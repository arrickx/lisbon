/**
 * 葡萄牙慢调之旅 · 核心交互与高精度定位引擎 (DRY 重构版)
 * 
 * 设计原则：
 * 1. 【高精度葡萄牙时间 (Europe/Lisbon)】：利用原生 Intl.DateTimeFormat，无论用户手机处于何种时区/漫游，
 *    100% 按照葡萄牙里斯本当地自然日历（WEST/UTC+1）判定当前是行程的哪一天。
 * 2. 【一天打开多次，永远直达“今天”】：在旅途期间，每次打开或从后台唤醒解锁，一律坚决自动聚焦到当天的卡片。
 * 3. 【无感浮动归位 (Back to Today)】：若用户临时翻看其他日期，右下角优雅浮现「回到今天」胶囊，一键瞬滑归位。
 * 4. 【行前模拟演练】：在 2027年5月 出发前，提供行前倒计时与“模拟演练选择器”，随时测试在旅途中任何一天的定位体验。
 * 5. 【视口联动 (Scrollspy)】：上下滑动时，吸顶胶囊导航实时横向平滑居中联动。
 */

document.addEventListener("DOMContentLoaded", () => {
  // 葡萄牙行程真实日历映射 (2027年5月4日 - 2027年5月12日)
  const TRIP_DATES = {
    "2027-05-04": 1,
    "2027-05-05": 2,
    "2027-05-06": 3,
    "2027-05-07": 4,
    "2027-05-08": 5,
    "2027-05-09": 6,
    "2027-05-10": 7,
    "2027-05-11": 8,
    "2027-05-12": 9,
  };
  const TRIP_TOTAL_DAYS = 9;
  const TRIP_START_UTC = new Date("2027-05-04T00:00:00+01:00");
  const TASK_STORAGE_KEY = "lisbon_trip_tasks_completed";

  // --- DRY 统一本地存储辅助工具 ---
  const storage = {
    get(key, fallback = null, isSession = false) {
      try {
        const raw = (isSession ? sessionStorage : localStorage).getItem(key);
        return raw ? JSON.parse(raw) : fallback;
      } catch {
        return fallback;
      }
    },
    set(key, val, isSession = false) {
      try {
        (isSession ? sessionStorage : localStorage).setItem(key, JSON.stringify(val));
      } catch {}
    },
    remove(key, isSession = false) {
      try {
        (isSession ? sessionStorage : localStorage).removeItem(key);
      } catch {}
    }
  };

  // DOM 元素引用
  const dayPills = document.querySelectorAll(".day-pill");
  const dayCards = document.querySelectorAll(".day-card");
  const statusText = document.getElementById("status-text");
  const statusSub = document.getElementById("status-sub");
  const btnLocateToday = document.getElementById("btn-locate-today");
  const simWrapper = document.getElementById("sim-wrapper");
  const simDaySelect = document.getElementById("sim-day-select");
  const btnFloatingToday = document.getElementById("btn-floating-today");
  const floatTodayText = document.getElementById("float-today-text");
  const toastEl = document.getElementById("toast-tip");

  const viewTabs = document.querySelectorAll(".view-tab");
  const viewSections = document.querySelectorAll(".view-section");
  const flashcardOverlay = document.getElementById("flashcard-overlay");

  // 状态变量
  let activeTodayDay = 1;      // 当前生效的“今天”（真实里斯本时间或模拟演练天数）
  let currentViewingDay = 1;   // 用户视口当前所在天数
  let isManualScrolling = false;
  let scrollTimer = null;
  let toastTimer = null;

  // 恢复之前选择的模拟演练（仅在行前生效）
  let simulatedDaySetting = storage.get("lisbon_sim_day", null, true);
  if (simulatedDaySetting && simDaySelect) {
    simDaySelect.value = String(simulatedDaySetting);
  }

  // -------------------------------------------------------------
  // 1. Toast 提示
  // -------------------------------------------------------------
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 2200);
  }

  // -------------------------------------------------------------
  // 2. 葡萄牙官方时间 (Europe/Lisbon) 判定
  // -------------------------------------------------------------
  function getLisbonState() {
    const now = new Date();

    const lisbonDateStr = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Lisbon",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(now);

    const lisbonTimeStr = new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Europe/Lisbon",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(now);

    const realTripDay = TRIP_DATES[lisbonDateStr] || null;
    const isBeforeTrip = now < TRIP_START_UTC;
    const daysUntil = isBeforeTrip
      ? Math.ceil((TRIP_START_UTC.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    return { dateStr: lisbonDateStr, timeStr: lisbonTimeStr, realTripDay, isBeforeTrip, daysUntil };
  }

  // -------------------------------------------------------------
  // 3. 计算生效的“今日”并刷新状态栏
  // -------------------------------------------------------------
  function resolveEffectiveToday() {
    const lisbon = getLisbonState();

    // A. 真实旅行期 (5/4 - 5/12)
    if (lisbon.realTripDay) {
      if (simWrapper) simWrapper.style.display = "none";
      if (statusText) statusText.textContent = `📍 葡萄牙今天：Day 0${lisbon.realTripDay} · 里斯本时间 ${lisbon.timeStr}`;
      if (statusSub) statusSub.textContent = `当前为旅途中 · 打开页面永远自动聚焦今天`;
      return { effectiveToday: lisbon.realTripDay, timeStr: lisbon.timeStr };
    }

    // B. 行前模拟演练期
    if (simWrapper) simWrapper.style.display = "flex";

    if (simulatedDaySetting && simulatedDaySetting >= 1 && simulatedDaySetting <= TRIP_TOTAL_DAYS) {
      if (statusText) statusText.textContent = `⚡ 模拟演练中：Day 0${simulatedDaySetting} · 里斯本 ${lisbon.timeStr}`;
      if (statusSub) statusSub.textContent = `正在体验旅途中“一天多次打开自动聚焦该天”的效果`;
      return { effectiveToday: simulatedDaySetting, timeStr: lisbon.timeStr };
    }

    // C. 行前常规倒计时展示
    if (statusText) statusText.textContent = `✈️ 距 5/4 出发还有 ${lisbon.daysUntil} 天 · 里斯本 ${lisbon.timeStr}`;
    if (statusSub) statusSub.textContent = `时区：Europe/Lisbon · 可在右侧选择天数模拟演练`;
    return { effectiveToday: 1, timeStr: lisbon.timeStr };
  }

  // -------------------------------------------------------------
  // 4. DRY 胶囊高亮与横向居中定位
  // -------------------------------------------------------------
  function setActivePill(dayNum) {
    dayPills.forEach((pill) => {
      const pDay = parseInt(pill.getAttribute("data-day"), 10);
      const isTarget = pDay === dayNum;
      pill.classList.toggle("active", isTarget);
      if (isTarget) {
        pill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    });
  }

  // -------------------------------------------------------------
  // 5. 更新卡片今日动态徽章与浮动按钮文案
  // -------------------------------------------------------------
  function updateTodayBadges(todayDay, timeStr) {
    dayCards.forEach((card) => {
      const dayNum = parseInt(card.getAttribute("data-day"), 10);
      const headerTitleCol = card.querySelector(".day-title-col");
      const existingBadge = card.querySelector(".live-today-tag");
      const isToday = dayNum === todayDay;

      card.classList.toggle("is-active-day", isToday);

      if (isToday) {
        if (!existingBadge && headerTitleCol) {
          const badge = document.createElement("span");
          badge.className = "live-today-tag";
          badge.innerHTML = `📍 今天进行中 · 里斯本 ${timeStr}`;
          headerTitleCol.appendChild(badge);
        } else if (existingBadge) {
          existingBadge.innerHTML = `📍 今天进行中 · 里斯本 ${timeStr}`;
        }
      } else if (existingBadge) {
        existingBadge.remove();
      }
    });

    if (floatTodayText) {
      floatTodayText.textContent = `回到今天 (D0${todayDay})`;
    }
  }

  // -------------------------------------------------------------
  // 6. 滚动聚焦指定天数卡片
  // -------------------------------------------------------------
  function scrollToDay(dayNumber, smooth = true) {
    const targetCard = document.getElementById(`day-${dayNumber}`);
    if (!targetCard) return;

    isManualScrolling = true;
    currentViewingDay = dayNumber;

    setActivePill(dayNumber);

    targetCard.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "start"
    });

    updateFloatingTodayButton();

    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      isManualScrolling = false;
    }, 700);
  }

  // -------------------------------------------------------------
  // 7. 浮动“回到今天”胶囊显隐控制
  // -------------------------------------------------------------
  function updateFloatingTodayButton() {
    if (!btnFloatingToday) return;
    const isAwayFromToday = currentViewingDay !== activeTodayDay;
    btnFloatingToday.classList.toggle("show", isAwayFromToday);
  }

  // -------------------------------------------------------------
  // 8. 页面启动与重新唤醒自适应
  // -------------------------------------------------------------
  function syncAndLocateToday(smooth = false, showNotification = false) {
    const { effectiveToday, timeStr } = resolveEffectiveToday();
    activeTodayDay = effectiveToday;
    currentViewingDay = effectiveToday;

    updateTodayBadges(activeTodayDay, timeStr);

    const urlParams = new URLSearchParams(window.location.search);
    const dayFromQuery = parseInt(urlParams.get("day"), 10);
    const targetDay = (dayFromQuery >= 1 && dayFromQuery <= TRIP_TOTAL_DAYS)
      ? dayFromQuery
      : activeTodayDay;

    scrollToDay(targetDay, smooth);

    if (showNotification) {
      showToast(`🎯 已自动定位至今日行程 (Day 0${targetDay})`);
    }
  }

  // 手机锁屏唤醒 & 后台切回监听
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      const { effectiveToday } = resolveEffectiveToday();
      if (effectiveToday !== activeTodayDay) {
        syncAndLocateToday(true, true);
      }
    }
  });

  window.addEventListener("pageshow", () => syncAndLocateToday(false, false));

  // -------------------------------------------------------------
  // 9. 交互事件绑定
  // -------------------------------------------------------------
  if (btnLocateToday) {
    btnLocateToday.addEventListener("click", () => {
      switchView("itinerary");
      scrollToDay(activeTodayDay, true);
      showToast(`📍 已直达今天 (Day 0${activeTodayDay})`);
    });
  }

  if (btnFloatingToday) {
    btnFloatingToday.addEventListener("click", () => {
      scrollToDay(activeTodayDay, true);
      showToast(`📍 已返回今天 (Day 0${activeTodayDay})`);
    });
  }

  if (simDaySelect) {
    simDaySelect.addEventListener("change", (e) => {
      const val = e.target.value;
      if (val === "auto") {
        simulatedDaySetting = null;
        storage.remove("lisbon_sim_day", true);
        showToast("已恢复自动日历模式");
      } else {
        simulatedDaySetting = parseInt(val, 10);
        storage.set("lisbon_sim_day", simulatedDaySetting, true);
        showToast(`已切换演练模式：模拟今天为 Day 0${simulatedDaySetting}`);
      }
      syncAndLocateToday(true, false);
    });
  }

  dayPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const dayNum = parseInt(pill.getAttribute("data-day"), 10);
      switchView("itinerary");
      scrollToDay(dayNum, true);
    });
  });

  // -------------------------------------------------------------
  // 10. Scrollspy 视口感知
  // -------------------------------------------------------------
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScrolling) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const dayNum = parseInt(entry.target.getAttribute("data-day"), 10);
            if (dayNum) {
              currentViewingDay = dayNum;
              setActivePill(dayNum);
              updateFloatingTodayButton();
            }
          }
        });
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: 0
      }
    );

    dayCards.forEach((card) => observer.observe(card));
  }

  // -------------------------------------------------------------
  // 11. 板块切换 (日程 / 省心锦囊 / 住址交通)
  // -------------------------------------------------------------
  function switchView(targetView) {
    viewTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.getAttribute("data-view") === targetView);
    });

    viewSections.forEach((sec) => {
      sec.classList.toggle("active", sec.id === `view-${targetView}`);
    });

    if (targetView !== "itinerary" && btnFloatingToday) {
      btnFloatingToday.classList.remove("show");
    } else if (targetView === "itinerary") {
      updateFloatingTodayButton();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  viewTabs.forEach((tab) => {
    tab.addEventListener("click", () => switchView(tab.getAttribute("data-view")));
  });

  // -------------------------------------------------------------
  // 12. 带娃点餐大字卡 Modal 控制
  // -------------------------------------------------------------
  function toggleFlashcard(isOpen) {
    if (!flashcardOverlay) return;
    flashcardOverlay.classList.toggle("active", isOpen);
    flashcardOverlay.setAttribute("aria-hidden", isOpen ? "false" : "true");
  }

  document.getElementById("btn-show-flashcard")?.addEventListener("click", () => toggleFlashcard(true));
  document.getElementById("btn-close-flashcard")?.addEventListener("click", () => toggleFlashcard(false));
  document.getElementById("btn-done-flashcard")?.addEventListener("click", () => toggleFlashcard(false));
  flashcardOverlay?.addEventListener("click", (e) => {
    if (e.target === flashcardOverlay) toggleFlashcard(false);
  });

  // -------------------------------------------------------------
  // 13. DRY 统一复制文本处理 (属性委托机制)
  // -------------------------------------------------------------
  document.querySelectorAll("[data-copy], [data-copy-target]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const directText = btn.getAttribute("data-copy");
      const targetId = btn.getAttribute("data-copy-target");
      const text = directText || (targetId && document.getElementById(targetId)?.textContent.trim());
      const msg = btn.getAttribute("data-copy-msg") || "📋 已复制到剪贴板！";

      if (!text) return;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => showToast(msg)).catch(() => {
          showToast("复制失败，请长按手动复制");
        });
      } else {
        showToast("请长按文本复制");
      }
    });
  });

  // -------------------------------------------------------------
  // 14. 行程打卡勾选记忆
  // -------------------------------------------------------------
  let completedTasks = storage.get(TASK_STORAGE_KEY, []);

  document.querySelectorAll(".task-check").forEach((checkbox) => {
    const taskId = checkbox.getAttribute("data-task");
    if (taskId && completedTasks.includes(taskId)) {
      checkbox.checked = true;
    }

    checkbox.addEventListener("change", () => {
      if (checkbox.checked) {
        if (!completedTasks.includes(taskId)) completedTasks.push(taskId);
        showToast("🎉 已打卡该项行程！");
      } else {
        completedTasks = completedTasks.filter((id) => id !== taskId);
      }
      storage.set(TASK_STORAGE_KEY, completedTasks);
    });
  });

  // 启动定位
  syncAndLocateToday(false, false);
});
