/**
 * 子页面公共脚本（todo.html · restaurants.html）：
 *  1) 与 app.js 统一的里斯本当前日期（支持 ?now=YYYY-MM-DD[THH:MM]）
 *  2) 保留 ?from= 与 ?now= 的顶部返回/互跳导航
 *  3) 单一数据源渲染 Belmar 前台英文卡 + 自动按日期切换展开卡片
 *  4) 复制地点名 / 话术并弹出 Toast
 */
(() => {
  'use strict';

  const params = new URLSearchParams(location.search);

  function lisbonTodayIso() {
    const q = params.get('now');
    if (q) {
      const m = q.match(/^(\d{4}-\d{2}-\d{2})/);
      if (m) return m[1];
    }
    return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Lisbon' }).format(new Date());
  }

  const todayIso = lisbonTodayIso();
  const from = params.get('from');
  const qNow = params.get('now');

  // 1. 返回主应用的来源还原 + 同源跨页携带 ?from / ?now
  const back = document.querySelector('.back');
  if (back && from) {
    if (from === 'pocket') { back.href = 'index.html?tab=pocket'; back.textContent = '‹ 返回随身'; }
    else if (from === 'trip') { back.href = 'index.html?tab=trip'; back.textContent = '‹ 返回全程'; }
    else if (from.startsWith('day-')) {
      const d = from.slice(4);
      back.href = `index.html?day=${encodeURIComponent(d)}`;
      back.textContent = `‹ 返回 D${d}`;
    }
  }
  if (qNow && back) {
    const u = new URL(back.getAttribute('href'), location.href);
    u.searchParams.set('now', qNow);
    back.href = u.pathname.split('/').pop() + u.search;
  }

  document.querySelectorAll('.top-switch').forEach((link) => {
    const u = new URL(link.getAttribute('href'), location.href);
    if (from) u.searchParams.set('from', from);
    if (qNow) u.searchParams.set('now', qNow);
    link.href = u.pathname.split('/').pop() + u.search + u.hash;
  });

  // 2. Belmar 前台分两次代订英文卡（唯一数据源；5/11 起自动收起第 ① 批、展开第 ② 批）
  const BELMAR_CARDS = [
    {
      open: todayIso < '2027-05-11',
      summary: '① 5/10 (周一) 17:15 入住时 · 先订今明两晚',
      items: [
        { label: 'Today (Mon, May 10) at 18:15', text: 'Campimar', tel: '+351 282 762 024' },
        { label: 'Tomorrow (Tue, May 11) at 17:30', text: 'Casinha do Petisco', tel: '+351 282 767 163' }
      ],
      copyText: 'Hello! Could you please help us call to book a table for 4 adults + 1 baby high chair (Cadeira de bebé)? 1. Today (Mon, May 10) at 18:15 - Campimar (+351 282 762 024). 2. Tomorrow (Tue, May 11) at 17:30 - Casinha do Petisco (+351 282 767 163). Thank you so much!'
    },
    {
      open: todayIso >= '2027-05-11',
      summary: '② 5/11 (周二) 路过前台时 · 再订周三和周四',
      items: [
        { label: 'Tomorrow (Wed, May 12) at 18:00', text: 'Don Sebastião', tel: '+351 282 780 480' },
        { label: 'Thu, May 13 at 18:00', text: 'O Camilo', tel: '+351 282 763 845' }
      ],
      note: '💡 周二白天出海回来或出门前顺口找前台订就行，提前 1–2 天很充裕。',
      copyText: 'Hello! Could you please help us call to book a table for 4 adults + 1 baby high chair (Cadeira de bebé)? 1. Tomorrow (Wed, May 12) at 18:00 - Don Sebastião (+351 282 780 480). 2. Thu, May 13 at 18:00 - O Camilo (+351 282 763 845). Thank you so much!'
    }
  ];

  const belmarRoot = document.getElementById('belmar-cards');
  if (belmarRoot) {
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    belmarRoot.innerHTML = BELMAR_CARDS.map((card) => `
      <details class="show-fold"${card.open ? ' open' : ''}>
        <summary>${esc(card.summary)}</summary>
        <div class="show-body">
          <p class="show-en" lang="en">Hello! Could you please help us call to book a table for <b>4 adults + 1 baby high chair (Cadeira de bebé)</b>?</p>
          <ol class="show-list" lang="en">
            ${card.items.map((it) => `<li><b>${esc(it.label)}</b> — ${esc(it.text)} (<code>${esc(it.tel)}</code>)</li>`).join('')}
          </ol>
          <p class="show-en" lang="en">Thank you so much!</p>
          ${card.note ? `<p class="show-note">${esc(card.note)}</p>` : ''}
          <div class="acts"><button type="button" class="btn" data-copy="${esc(card.copyText)}">📋 复制英文话术</button></div>
        </div>
      </details>`).join('');
  }

  // 3. Toast 与一键复制
  function showToast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(showToast.t);
    showToast.t = setTimeout(() => el.classList.remove('show'), 1800);
  }

  async function copy(text) {
    showToast(text.length <= 50 ? `已复制：${text}` : '已复制英文话术');
    const fallback = () => {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;pointer-events:none';
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); } catch {}
      ta.remove();
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) await navigator.clipboard.writeText(text);
      else fallback();
    } catch { fallback(); }
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-copy]');
    if (t) copy(t.dataset.copy);
  });

  window.LISBON_TODAY_ISO = todayIso;
})();
