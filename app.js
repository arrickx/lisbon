/**
 * 私人旅行手册 — 轻量灵动交互
 * 支持：天数切换过滤、地点完成打勾、一键复制地址、行李装箱清单进度
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. 天数切换过滤 (Day Tabs)
  const dayTabs = document.querySelectorAll(".day-tab");
  const dayGroups = document.querySelectorAll(".timeline-day-group");

  dayTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      dayTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      const targetDay = tab.getAttribute("data-day");

      dayGroups.forEach((group) => {
        const groupDay = group.getAttribute("data-day-group");
        if (targetDay === "all" || targetDay === groupDay) {
          group.style.display = "flex";
        } else {
          group.style.display = "none";
        }
      });
    });
  });

  // 2. 复制当地地址出示卡 (Copy Address)
  const copyBtn = document.getElementById("btn-copy-address");
  const addressText = document.getElementById("local-address");
  const toast = document.getElementById("toast");

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }

  if (copyBtn && addressText) {
    copyBtn.addEventListener("click", () => {
      const textToCopy = addressText.textContent.trim();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textToCopy).then(() => {
          showToast("📋 已复制当地地址，可直接出示给司机！");
        }).catch(() => {
          showToast("复制失败，请长按文本复制");
        });
      } else {
        showToast("已选择文本，请长按手动复制");
      }
    });
  }

  // 3. 行程地点打勾记忆 (Timeline Checklist)
  const itineraryStorageKey = "travel_itinerary_completed";
  let completedItems = [];
  try {
    const saved = localStorage.getItem(itineraryStorageKey);
    if (saved) completedItems = JSON.parse(saved);
  } catch (e) {
    completedItems = [];
  }

  const timelineCards = document.querySelectorAll(".timeline-card");
  timelineCards.forEach((card) => {
    const itemId = card.getAttribute("data-item-id");
    const checkbox = card.querySelector(".check-box");

    if (itemId && completedItems.includes(itemId)) {
      card.classList.add("is-done");
      if (checkbox) checkbox.checked = true;
    }

    if (checkbox) {
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          card.classList.add("is-done");
          if (!completedItems.includes(itemId)) completedItems.push(itemId);
          showToast("🎉 已打卡该行程！");
        } else {
          card.classList.remove("is-done");
          completedItems = completedItems.filter((id) => id !== itemId);
        }
        localStorage.setItem(itineraryStorageKey, JSON.stringify(completedItems));
      });
    }
  });

  // 4. 行李打包清单与实时计数 (Packing Checklist)
  const packingStorageKey = "travel_packing_checked";
  let packedIds = [];
  try {
    const savedPacked = localStorage.getItem(packingStorageKey);
    if (savedPacked) packedIds = JSON.parse(savedPacked);
  } catch (e) {
    packedIds = [];
  }

  const packCheckboxes = document.querySelectorAll(".pack-checkbox");
  const packingStatus = document.getElementById("packing-status");

  function updatePackingCount() {
    const total = packCheckboxes.length;
    const checkedCount = document.querySelectorAll(".pack-checkbox:checked").length;
    if (packingStatus) {
      packingStatus.textContent = `${checkedCount} / ${total} 已装箱`;
      if (checkedCount === total && total > 0) {
        packingStatus.textContent = "✨ 全部装箱完毕！";
      }
    }
  }

  packCheckboxes.forEach((box) => {
    const id = box.getAttribute("data-pack-id");
    if (id && packedIds.includes(id)) {
      box.checked = true;
    }

    box.addEventListener("change", () => {
      if (box.checked) {
        if (!packedIds.includes(id)) packedIds.push(id);
      } else {
        packedIds = packedIds.filter((item) => item !== id);
      }
      localStorage.setItem(packingStorageKey, JSON.stringify(packedIds));
      updatePackingCount();
    });
  });

  updatePackingCount();
});
