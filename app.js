/**
 * 葡萄牙慢调之旅 · 核心交互引擎
 * 功能：
 * 1. 智能天数计算与「自动定位到那一天」
 * 2. 吸顶天数横向胶囊导航 + 双向平滑滚动联动 (Scrollspy)
 * 3. 核心板块无感切换 (日程 / 省心锦囊 / 住址交通)
 * 4. 带娃点餐大字全屏出示卡
 * 5. 一键复制与轻量 Toast 提示
 * 6. 每日行程打卡进度本地记忆 (localStorage)
 */

document.addEventListener("DOMContentLoaded", () => {
  // 行程时间配置 (2027年5月4日 - 2027年5月12日，共 9 天 8 晚)
  const TRIP_START_DATE_STR = "2027-05-04";
  const TRIP_TOTAL_DAYS = 9;

  // DOM 元素引用
  const dayPills = document.querySelectorAll(".day-pill");
  const dayCards = document.querySelectorAll(".day-card");
  const dayNavContainer = document.getElementById("day-nav-scroll");
  const statusText = document.getElementById("status-text");
  const btnLocateToday = document.getElementById("btn-locate-today");
  const toastEl = document.getElementById("toast-tip");

  // 板块切换 DOM
  const viewTabs = document.querySelectorAll(".view-tab");
  const viewSections = document.querySelectorAll(".view-section");

  // 点餐大字卡 Modal DOM
  const flashcardOverlay = document.getElementById("flashcard-overlay");
  const btnShowFlashcard = document.getElementById("btn-show-flashcard");
  const btnCloseFlashcard = document.getElementById("btn-close-flashcard");
  const btnDoneFlashcard = document.getElementById("btn-done-flashcard");

  let currentActiveDay = 1;
  let isManualScrolling = false;
  let scrollTimeout = null;

  // -------------------------------------------------------------
  // 1. 轻量 Toast 提示工具
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
  // 2. 计算当前系统日期是否落在旅行区间 (智能定位核心)
  // -------------------------------------------------------------
  function detectTripDay() {
    const now = new Date();
    // 构造无时区偏差的本地年月日比较
    const tripStart = new Date(TRIP_START_DATE_STR + "T00:00:00");
    const diffTime = now.getTime() - tripStart.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

    // 如果当前正在旅行期间 (Day 1 到 Day 9)
    if (diffDays >= 1 && diffDays <= TRIP_TOTAL_DAYS) {
      return {
        isDuringTrip: true,
        dayNum: diffDays
      };
    }

    // 不在旅行期间（行前规划或行后复盘）
    return {
      isDuringTrip: false,
      dayNum: null
    };
  }

  // -------------------------------------------------------------
  // 3. 滚动并聚焦到指定天数卡片 (支持平滑居中顶部胶囊)
  // -------------------------------------------------------------
  function scrollToDay(dayNumber, smooth = true) {
    const targetCard = document.getElementById(`day-${dayNumber}`);
    if (!targetCard) return;

    isManualScrolling = true;
    currentActiveDay = dayNumber;

    // 1. 更新顶部胶囊高亮与横向居中
    dayPills.forEach((pill) => {
      const pDay = parseInt(pill.getAttribute("data-day"), 10);
      if (pDay === dayNumber) {
        pill.classList.add("active");
        pill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      } else {
        pill.classList.remove("active");
      }
    });

    // 2. 更新卡片高亮样式
    dayCards.forEach((card) => {
      const cDay = parseInt(card.getAttribute("data-day"), 10);
      if (cDay === dayNumber) {
        card.classList.add("is-active-day");
      } else {
        card.classList.remove("is-active-day");
      }
    });

    // 3. 纵向滚动到卡片位置
    targetCard.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      block: "start"
    });

    // 记忆在 localStorage 中
    try {
      localStorage.setItem("lisbon_last_viewed_day", String(dayNumber));
    } catch (e) {}

    // 锁定几百毫秒避免与 Scrollspy 互斥
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isManualScrolling = false;
    }, 700);
  }

  // -------------------------------------------------------------
  // 4. 自动定位初始化 (页面加载时触发)
  // -------------------------------------------------------------
  function initAutoLocation() {
    const tripState = detectTripDay();

    // 优先级 1: URL 中的 fragment 或 query 参数 (例如 ?day=3 或 #day-3)
    const urlParams = new URLSearchParams(window.location.search);
    const dayFromQuery = parseInt(urlParams.get("day"), 10);
    const hashMatch = window.location.hash.match(/day-(\d+)/);
    const dayFromHash = hashMatch ? parseInt(hashMatch[1], 10) : null;

    let targetDay = null;

    if (dayFromQuery >= 1 && dayFromQuery <= TRIP_TOTAL_DAYS) {
      targetDay = dayFromQuery;
      if (statusText) statusText.textContent = `已定位至 Day 0${targetDay}（URL 指定）`;
    } else if (dayFromHash >= 1 && dayFromHash <= TRIP_TOTAL_DAYS) {
      targetDay = dayFromHash;
      if (statusText) statusText.textContent = `已定位至 Day 0${targetDay}（锚点直达）`;
    } else if (tripState.isDuringTrip) {
      // 优先级 2: 真实旅行中！自动定位到今天
      targetDay = tripState.dayNum;
      if (statusText) {
        statusText.textContent = `📍 今天是行程 Day 0${targetDay} · 已自动为您聚焦`;
      }
      // 给出提示
      showToast(`🎯 已自动定位到今天的行程 (Day 0${targetDay})`);
    } else {
      // 优先级 3: 提取用户上次浏览偏好
      let savedDay = 1;
      try {
        const stored = localStorage.getItem("lisbon_last_viewed_day");
        if (stored) savedDay = parseInt(stored, 10);
      } catch (e) {}
      targetDay = (savedDay >= 1 && savedDay <= TRIP_TOTAL_DAYS) ? savedDay : 1;
      if (statusText) {
        statusText.textContent = `✨ 9天日程全景已就绪 · 当前聚焦 Day 0${targetDay}`;
      }
    }

    // 确保定位到目标天
    setTimeout(() => {
      scrollToDay(targetDay, false);
    }, 100);
  }

  // 点击“直达目标天 / 重定位”按钮
  if (btnLocateToday) {
    btnLocateToday.addEventListener("click", () => {
      const tripState = detectTripDay();
      const target = tripState.isDuringTrip ? tripState.dayNum : currentActiveDay;
      scrollToDay(target, true);
      showToast(`🎯 已平滑聚焦到 Day 0${target}`);
    });
  }

  // 点击胶囊直接定位
  dayPills.forEach((pill) => {
    pill.addEventListener("click", () => {
      const dayNum = parseInt(pill.getAttribute("data-day"), 10);
      // 切换到行程视图
      switchView("itinerary");
      scrollToDay(dayNum, true);
      if (statusText) {
        statusText.textContent = `当前浏览：Day 0${dayNum}`;
      }
    });
  });

  // -------------------------------------------------------------
  // 5. Scrollspy: 上下滑动页面时，自动感知并同步高亮顶部胶囊
  // -------------------------------------------------------------
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScrolling) return; // 手动点击跳转时不干扰

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const dayNum = parseInt(entry.target.getAttribute("data-day"), 10);
            if (dayNum) {
              currentActiveDay = dayNum;
              dayPills.forEach((pill) => {
                const pDay = parseInt(pill.getAttribute("data-day"), 10);
                if (pDay === dayNum) {
                  pill.classList.add("active");
                  pill.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                } else {
                  pill.classList.remove("active");
                }
              });
              if (statusText) {
                statusText.textContent = `正在浏览：Day 0${dayNum}`;
              }
            }
          }
        });
      },
      {
        rootMargin: "-25% 0px -55% 0px", // 视口中上部作为激活判断触发带
        threshold: 0
      }
    );

    dayCards.forEach((card) => observer.observe(card));
  }

  // -------------------------------------------------------------
  // 6. 核心大板块无感切换 (9天日程 / 省心锦囊 / 住址交通)
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

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  viewTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const view = tab.getAttribute("data-view");
      switchView(view);
    });
  });

  // -------------------------------------------------------------
  // 7. 点餐大字全屏出示卡 (Fullscreen Flashcard Modal)
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

  if (btnShowFlashcard) {
    btnShowFlashcard.addEventListener("click", openFlashcard);
  }
  if (btnCloseFlashcard) {
    btnCloseFlashcard.addEventListener("click", closeFlashcard);
  }
  if (btnDoneFlashcard) {
    btnDoneFlashcard.addEventListener("click", closeFlashcard);
  }
  if (flashcardOverlay) {
    flashcardOverlay.addEventListener("click", (e) => {
      if (e.target === flashcardOverlay) closeFlashcard();
    });
  }

  // -------------------------------------------------------------
  // 8. 一键复制文本 (地址 / 点餐葡语)
  // -------------------------------------------------------------
  function copyText(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(successMsg || "📋 已成功复制到剪贴板！");
      }).catch(() => {
        showToast("复制失败，请长按手动选择复制");
      });
    } else {
      showToast("已选择文本，请长按复制");
    }
  }

  // 复制带娃点餐神句
  const btnCopyQuote = document.getElementById("btn-copy-quote");
  if (btnCopyQuote) {
    btnCopyQuote.addEventListener("click", () => {
      const quote = btnCopyQuote.getAttribute("data-copy");
      copyText(quote, "📋 已复制葡语点餐句，可直接出示或发送！");
    });
  }

  // 复制酒店/度假村地址
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
  // 9. 每日行程打卡清单记忆 (localStorage)
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

  // 执行自动定位
  initAutoLocation();
});
