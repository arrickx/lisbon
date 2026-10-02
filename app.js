/**
 * 随身便签自动保存 (Local Storage)
 */
document.addEventListener("DOMContentLoaded", () => {
  const memoEl = document.getElementById("quick-memo");
  const STORAGE_KEY = "lisbon_travel_memo";

  if (memoEl) {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      memoEl.innerText = saved;
    }

    memoEl.addEventListener("input", () => {
      localStorage.setItem(STORAGE_KEY, memoEl.innerText);
    });
  }
});
