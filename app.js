/**
 * 葡萄牙慢调之旅 · 核心交互与高精度定位引擎
 * 
 * 核心设计原则（拒绝盲目记忆，精准时间同步）：
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

  // DOM 元素引用
  const dayPills = document.querySelectorAll(".day-pill");
  const dayCards = document.querySelectorAll(".day-card");
  const dayNavScroll = document.getElementById("day-nav-scroll");
  const statusText = document.getElementById("status-text");
  const statusSub = document.getElementById("status-sub");
  const btnLocateToday = document.getElementById("btn-locate-today");
  const simWrapper = document.getElementById("sim-wrapper");
  const simDaySelect = document.getElementById("sim-day-select");
  const btnFloatingToday = document.getElementById("btn-floating-today");
  const floatTodayText = document.getElementById("float-today-text");
  const toastEl = document.getElementById("toast-tip");

  // 板块切换 DOM
  const viewTabs = document.querySelectorAll(".view-tab");
  const viewSections = document.querySelectorAll(".view-section");

  // 点餐大字卡 Modal DOM
  const flashcardOverlay = document.getElementById("flashcard-overlay");
  const btnShowFlashcard = document.getElementById("btn-show-flashcard");
  const btnCloseFlashcard = document.getElementById("btn-close-flashcard");
  const btnDoneFlashcard = document.getElementById("btn-done-flashcard");

  // 状态变量
  let activeTodayDay = 1;      // 判定的“今天”（真实里斯本时间或模拟演练天数）
  let currentViewingDay = 1;   // 用户当前视口正在查看的天数
  let isManualScrolling = false;
  let scrollTimer = null;
  let simulatedDaySetting = null; // null 为自动真实，数字 1-9 为模拟

  // 从 sessionStorage 恢复之前的演练模式（仅用于行前测试）
  try {
    const savedSim = sessionStorage.getItem("lisbon_sim_day");
    if (savedSim && savedSim !== "auto") {
      simulatedDaySetting = parseInt(savedSim, 10);
      if (simDaySelect) simDaySelect.value = String(simulatedDaySetting);
    }
  } catch (e) {}

  // -------------------------------------------------------------
  // 1. Toast 提示工具
  // -------------------------------------------------------------
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    setTimeout(() => {
      toastEl.classList.remove("show");
    }, 2200);
  }

  // -------------------------------------------------------------
  // 2. 葡萄牙里斯本官方时间 (Europe/Lisbon) 精准计算引擎
  // -------------------------------------------------------------
  function getLisbonState() {
    const now = new Date();

    // 格式化葡萄牙当地 YYYY-MM-DD
    const lisbonDateStr = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Lisbon",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }).format(now);

    // 格式化葡萄牙当地时间 HH:mm
    const lisbonTimeStr = new Intl.DateTimeFormat("zh-CN", {
      timeZone: "Europe/Lisbon",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    }).format(now);

    const realTripDay = TRIP_DATES[lisbonDateStr] || null;

    // 出发日时间戳对比
    const tripStartUtc = new Date("2027-05-04T00:00:00+01:00");
    const isBeforeTrip = now < tripStartUtc;
    let daysUntil = 0;
    if (isBeforeTrip) {
      daysUntil = Math.ceil((tripStartUtc.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    }

    return {
      dateStr: lisbonDateStr,
      timeStr: lisbonTimeStr,
      realTripDay: realTripDay,
      isBeforeTrip: isBeforeTrip,
      daysUntil: daysUntil
    };
  }

  // -------------------------------------------------------------
  // 3. 计算生效的“今日” (Today Resolver)
  // -------------------------------------------------------------
  function resolveEffectiveToday() {
    const lisbon = getLisbonState();

    // 真实旅行进行中 (2027-05-04 ~ 2027-05-12)
    if (lisbon.realTripDay) {
      // 旅途中完全隐藏模拟器，强制锁定真实葡萄牙日期
      if (simWrapper) simWrapper.style.display = "none";
      if (statusText) {
        statusText.textContent = `📍 葡萄牙今天：Day 0${lisbon.realTripDay} · 里斯本时间 ${lisbon.timeStr}`;
      }
      if (statusSub) {
        statusSub.textContent = `当前为旅途中 · 打开页面永远自动聚焦今天`;
      }
      return {
        effectiveToday: lisbon.realTripDay,
        isRealTrip: true,
        timeStr: lisbon.timeStr
      };
    }

    // 行前准备中 (当前处于 2026/2027 出发前)
    if (simWrapper) simWrapper.style.display = "flex";

    if (simulatedDaySetting && simulatedDaySetting >= 1 && simulatedDaySetting <= TRIP_TOTAL_DAYS) {
      // 处于行前演练模式
      if (statusText) {
        statusText.textContent = `⚡ 模拟演练中：Day 0${simulatedDaySetting} · 里斯本 ${lisbon.timeStr}`;
      }
      if (statusSub) {
        statusSub.textContent = `正在体验旅途中“一天多次打开自动聚焦该天”的效果`;
      }
      return {
        effectiveToday: simulatedDaySetting,
        isRealTrip: false,
        timeStr: lisbon.timeStr
      };
    }

    // 默认真实日历模式（展示倒计时）
    if (statusText) {
      statusText.textContent = `✈️ 距 5/4 出发还有 ${lisbon.daysUntil} 天 · 里斯本 ${lisbon.timeStr}`;
    }
    if (statusSub) {
      statusSub.textContent = `时区：Europe/Lisbon · 可在右侧选择天数模拟演练`;
    }
    return {
      effectiveToday: 1, // 默认聚焦 Day 1 作为起点
      isRealTrip: false,
      timeStr: lisbon.timeStr
    };
  }

  // -------------------------------------------------------------
  // 4. 更新卡片上的“今天进行中”动态标识
  // -------------------------------------------------------------
  function updateTodayBadges(todayDay, timeStr) {
    dayCards.forEach((card) => {
      const dayNum = parseInt(card.getAttribute("data-day"), 10);
      const headerTitleCol = card.querySelector(".day-title-col");
      const existingBadge = card.querySelector(".live-today-tag");

      if (dayNum === todayDay) {
        card.classList.add("is-active-day");
        if (!existingBadge && headerTitleCol) {
          const badge = document.createElement("span");
          badge.className = "live-today-tag";
          badge.innerHTML = `📍 今天进行中 · 里斯本 ${timeStr}`;
          headerTitleCol.appendChild(badge);
        } else if (existingBadge) {
          existingBadge.innerHTML = `📍 今天进行中 · 里斯本 ${timeStr}`;
        }
      } else {
        card.classList.remove("is-active-day");
        if (existingBadge) existingBadge.remove();
      }
    });

    // 更新浮动回到今天按钮文案
    if (floatTodayText) {
      floatTodayText.textContent = `回到今天 (D0${todayDay})`;
    }
  }

  // -------------------------------------------------------------
  // 5. 滚动聚焦指定天数卡片
  // -------------------------------------------------------------
  function scrollToDay(dayNumber, smooth = true) {
    const targetCard = document.getElementById(`day-${dayNumber}`);
    if (!targetCard) return;

    isManualScrolling = true;
    currentViewingDay = dayNumber;

    // 1. 同步顶部胶囊高亮与横向居中滚动
    dayPills.forEach((pill) => {
      const pDay = parseInt(pill.getAttribute("data-day"), 10);
      if (pDay === dayNumber) {
        pill.classList.add("active");
        pill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      } else {
        pill.classList.remove("active");
      }
    });

    // 2. 纵向滚动到卡片位置（配合 scroll-padding-top 不会被导航遮挡）
    targetCard.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "start"
    });

    // 3. 判断是否需要显示“回到今天”浮动按钮
    updateFloatingTodayButton();

    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      isManualScrolling = false;
    }, 700);
  }

  // -------------------------------------------------------------
  // 6. 浮动“回到今天”胶囊显隐逻辑
  // -------------------------------------------------------------
  function updateFloatingTodayButton() {
    if (!btnFloatingToday) return;

    // 只有在当前不在查看“今天”卡片时，才浮现快捷归位按钮
    if (currentViewingDay !== activeTodayDay) {
      btnFloatingToday.classList.add("show");
    } else {
      btnFloatingToday.classList.remove("show");
    }
  }

  // -------------------------------------------------------------
  // 7. 页面启动与重新唤醒自适应 (Sync & Auto-Locate)
  // -------------------------------------------------------------
  function syncAndLocateToday(smooth = false, showNotification = false) {
    const { effectiveToday, isRealTrip, timeStr } = resolveEffectiveToday();
    activeTodayDay = effectiveToday;
    currentViewingDay = effectiveToday;

    // 更新各卡片今日标识
    updateTodayBadges(activeTodayDay, timeStr);

    // 检查 URL 是否有强制指定
    const urlParams = new URLSearchParams(window.location.search);
    const dayFromQuery = parseInt(urlParams.get("day"), 10);
    const targetDay = (dayFromQuery >= 1 && dayFromQuery <= TRIP_TOTAL_DAYS)
      ? dayFromQuery
      : activeTodayDay;

    // 执行定位
    scrollToDay(targetDay, smooth);

    if (showNotification) {
      showToast(`🎯 已自动定位至今日行程 (Day 0${targetDay})`);
    }
  }

  // -------------------------------------------------------------
  // 8. 应对“一天打开多次”与手机锁屏解锁唤醒监听
  // -------------------------------------------------------------
  // 当用户在手机上重新切回浏览器、或锁屏数小时后再次亮屏时触发
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      // 重新检查葡萄牙时间，若已跨过午夜零点，无缝平滑切至新的一天
      const { effectiveToday } = resolveEffectiveToday();
      if (effectiveToday !== activeTodayDay) {
        syncAndLocateToday(true, true);
      }
    }
  });

  window.addEventListener("pageshow", () => {
    syncAndLocateToday(false, false);
  });

  // -------------------------------------------------------------
  // 9. 交互事件绑定
  // -------------------------------------------------------------
  // 点击“聚焦今天”按钮
  if (btnLocateToday) {
    btnLocateToday.addEventListener("click", () => {
      switchView("itinerary");
      scrollToDay(activeTodayDay, true);
      showToast(`📍 已直达今天 (Day 0${activeTodayDay})`);
    });
  }

  // 点击悬浮“回到今天”胶囊
  if (btnFloatingToday) {
    btnFloatingToday.addEventListener("click", () => {
      scrollToDay(activeTodayDay, true);
      showToast(`📍 已返回今天 (Day 0${activeTodayDay})`);
    });
  }

  // 行前演练切换下拉框
  if (simDaySelect) {
    simDaySelect.addEventListener("change", (e) => {
      const val = e.target.value;
      if (val === "auto") {
        simulatedDaySetting = null;
        try { sessionStorage.removeItem("lisbon_sim_day"); } catch (err) {}
        showToast("已恢复自动日历模式");
      } else {
        simulatedDaySetting = parseInt(val, 10);
        try { sessionStorage.setItem("lisbon_sim_day", String(simulatedDaySetting)); } catch (err) {}
        showToast(`已切换演练模式：模拟今天为 Day 0${simulatedDaySetting}`);
      }
      syncAndLocateToday(true, false);
    });
  }

  // 点击顶部天数胶囊
  dayPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const dayNum = parseInt(pill.getAttribute("data-day"), 10);
      switchView("itinerary");
      scrollToDay(dayNum, true);
    });
  });

  // -------------------------------------------------------------
  // 10. Scrollspy: 上下滑动时感知当前可视天数卡片
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

              // 联动顶部胶囊高亮并横向滑动居中
              dayPills.forEach((pill) => {
                const pDay = parseInt(pill.getAttribute("data-day"), 10);
                if (pDay === dayNum) {
                  pill.classList.add("active");
                  pill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                } else {
                  pill.classList.remove("active");
                }
              });

              // 联动更新悬浮“回到今天”按钮状态
              updateFloatingTodayButton();
            }
          }
        });
      },
      {
        rootMargin: "-25% 0px -55% 0px", // 视口中上部判断带
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
      if (tab.getAttribute("data-view") === targetView) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    });

    viewSections.forEach((sec) => {
      if (sec.id === `view-${targetView}`) {
        sec.classList.add("active");
      } else {
        sec.classList.remove("active");
      }
    });

    // 切换离开日程页时隐藏回到今天按钮
    if (targetView !== "itinerary" && btnFloatingToday) {
      btnFloatingToday.classList.remove("show");
    } else if (targetView === "itinerary") {
      updateFloatingTodayButton();
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  viewTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const view = tab.getAttribute("data-view");
      switchView(view);
    });
  });

  // -------------------------------------------------------------
  // 12. 带娃点餐大字卡 (Fullscreen Flashcard)
  // -------------------------------------------------------------
  function openFlashcard() {
    if (flashcardOverlay) {
      flashcardOverlay.classList.add("active");
      flashcardOverlay.setAttribute("aria-hidden", "false");
    }
  }

  function closeFlashcard() {
    if (flashcardOverlay) {
      flashcardOverlay.classList.remove("active");
      flashcardOverlay.setAttribute("aria-hidden", "true");
    }
  }

  if (btnShowFlashcard) btnShowFlashcard.addEventListener("click", openFlashcard);
  if (btnCloseFlashcard) btnCloseFlashcard.addEventListener("click", closeFlashcard);
  if (btnDoneFlashcard) btnDoneFlashcard.addEventListener("click", closeFlashcard);
  if (flashcardOverlay) {
    flashcardOverlay.addEventListener("click", (e) => {
      if (e.target === flashcardOverlay) closeFlashcard();
    });
  }

  // -------------------------------------------------------------
  // 13. 一键复制文本
  // -------------------------------------------------------------
  function copyText(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg || "📋 已复制到剪贴板！");
      }).catch(() => {
        showToast("复制失败，请长按手动复制");
      });
    } else {
      showToast("已选择文本，请长按复制");
    }
  }

  const btnCopyQuote = document.getElementById("btn-copy-quote");
  if (btnCopyQuote) {
    btnCopyQuote.addEventListener("click", () => {
      const quote = btnCopyQuote.getAttribute("data-copy");
      copyText(quote, "📋 已复制葡语点餐句，可直接出示或发送！");
    });
  }

  const copyAddrButtons = document.querySelectorAll(".btn-copy-addr");
  copyAddrButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-copy-target");
      const textEl = document.getElementById(targetId);
      if (textEl) {
        copyText(textEl.textContent.trim(), "📋 已复制当地地址，可直接出示给司机！");
      }
    });
  });

  // -------------------------------------------------------------
  // 14. 每日打卡进度记忆 (localStorage)
  // -------------------------------------------------------------
  const TASK_STORAGE_KEY = "lisbon_trip_tasks_completed";
  let completedTasks = [];
  try {
    const saved = localStorage.getItem(TASK_STORAGE_KEY);
    if (saved) completedTasks = JSON.parse(saved);
  } catch (e) {
    completedTasks = [];
  }

  const taskCheckboxes = document.querySelectorAll(".task-check");
  taskCheckboxes.forEach((checkbox) => {
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
      try {
        localStorage.setItem(TASK_STORAGE_KEY, JSON.stringify(completedTasks));
      } catch (e) {}
    });
  });

  // 执行启动定位
  syncAndLocateToday(false, false);
});
