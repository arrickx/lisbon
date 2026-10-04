/**
 * 葡萄牙家庭行 · v2
 * 所有行程内容来自 data.js (window.TRIP)；这里只做：时间判定 + 渲染 + 事件。
 *
 * 测试入口（不出现在 UI 上）：
 *   ?now=2027-05-06T15:00   伪造“里斯本当前时间”
 *   ?day=3                  直接打开某一天
 *   ?tab=trip|pocket        直接打开某个 Tab
 */
(() => {
  'use strict';

  const T = window.TRIP;
  const DAYS = T.days;
  const $ = (s) => document.querySelector(s);
  const pad = (n) => String(n).padStart(2, '0');
  const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
  const GRACE_MIN = 5 * 60 * 1000;   // 手动导航后 5 分钟内，切回来不打断
  const DONE_AFTER = 90;             // 最后一站之后 90 分钟视为当天结束

  /* ------------------------------------------------------------------ *
   * 1. 时间：永远用里斯本时间（手机可能开着美国时区）
   * ------------------------------------------------------------------ */
  const FMT = new Intl.DateTimeFormat('en-CA', {
    timeZone: T.tz, year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
  });
  const params = new URLSearchParams(location.search);

  function lisbonNow() {
    const q = params.get('now');
    const m = q && q.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);
    if (m) return { date: `${m[1]}-${m[2]}-${m[3]}`, min: (+m[4] || 0) * 60 + (+m[5] || 0) };
    const p = Object.fromEntries(FMT.formatToParts(new Date()).map((x) => [x.type, x.value]));
    return { date: `${p.year}-${p.month}-${p.day}`, min: (+p.hour % 24) * 60 + +p.minute };
  }

  const utc = (d) => { const [y, m, dd] = d.split('-').map(Number); return Date.UTC(y, m - 1, dd); };
  const dayDiff = (a, b) => Math.round((utc(b) - utc(a)) / 864e5);
  const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
  const weekday = (d) => WEEK[new Date(utc(d)).getUTCDay()];

  /** 当前处于哪种模式，以及“今天”是第几天 */
  function getClock() {
    const now = lisbonNow();
    const diff = dayDiff(T.start, now.date);
    if (diff < 0) return { ...now, mode: 'before', todayN: 1, until: -diff };
    if (diff < DAYS.length) return { ...now, mode: 'live', todayN: diff + 1 };
    return { ...now, mode: 'after', todayN: DAYS.length };
  }

  /** 当日停靠点状态：cur = 现在，next = 下一站，done = 当天已结束 */
  function stopState(day, clk) {
    const ts = day.stops.map((s) => toMin(s.t));
    let cur = -1;
    ts.forEach((t, i) => { if (t <= clk.min) cur = i; });
    const done = clk.min >= ts[ts.length - 1] + DONE_AFTER;
    const next = done ? -1 : cur + 1 < ts.length ? cur + 1 : -1;
    return { cur, next, done };
  }

  /* ------------------------------------------------------------------ *
   * 2. 小工具
   * ------------------------------------------------------------------ */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const enc = encodeURIComponent;

  const fmtMin = (m) => (m >= 60 ? `${Math.floor(m / 60)} 小时${m % 60 ? ` ${m % 60} 分` : ''}` : `${m} 分钟`);
  const slotOf = (t) => { const h = toMin(t) / 60; return h < 12 ? '上午' : h < 17 ? '下午' : h < 20 ? '傍晚' : '晚上'; };
  const dateLabel = (d) => `${+d.slice(5, 7)}月${+d.slice(8, 10)}日 ${weekday(d)}`;

  const dayDrive = (day) => day.stops.reduce((a, s) => (s.leg && s.leg.mode !== 'walk' ? { min: a.min + s.leg.min, n: a.n + 1 } : a), { min: 0, n: 0 });

  /** stop / stay → 可导航的目的地（没有信息则返回 null） */
  const place = (o) => (o.at ? T.stays[o.at] : o);
  const dest = (o) => (o.lat != null ? `${o.lat},${o.lng}` : o.query || null);

  const navUrl = (o, mode) => `https://www.google.com/maps/dir/?api=1&destination=${enc(dest(o))}${mode === 'walk' ? '&travelmode=walking' : ''}`;
  const uberUrl = (o) => {
    const target = o.lat != null
      ? `dropoff[latitude]=${o.lat}&dropoff[longitude]=${o.lng}`
      : `dropoff[formatted_address]=${enc(o.query)}`;
    return `https://m.uber.com/ul/?action=setPickup&pickup=my_location&${target}&dropoff[nickname]=${enc(o.name)}`;
  };

  const legText = (leg, first) => {
    if (!leg) return '';
    const from = first ? '从住处出发 · ' : '';
    if (leg.mode === 'walk') return `🚶 ${from}步行约 ${fmtMin(leg.min)}`;
    if (leg.mode === 'drive') return `🚗 ${from}自驾约 ${fmtMin(leg.min)}${leg.km ? ` · ${leg.km} km` : ''}`;
    return `🚕 ${from}约 ${fmtMin(leg.min)}${leg.eur ? ` · ~€${leg.eur}` : ''}`;
  };

  const btn = (label, href, primary) => `<a class="btn${primary ? ' primary' : ''}" href="${href}" target="_blank" rel="noopener">${label}</a>`;
  const copyBtn = (label, text) => `<button type="button" class="btn" data-copy="${esc(text)}">${label}</button>`;

  /** 给一个停靠点生成【叫车 / 导航】按钮 */
  function stopActions(stop) {
    const p = place(stop);
    if (!dest(p)) return '';
    const mode = stop.leg && stop.leg.mode;
    const nav = (primary) => btn('🧭 导航', navUrl(p, mode), primary);
    if (mode === 'uber') return `<div class="actions">${btn('🚕 叫 Uber', uberUrl(p), true)}${nav(false)}</div>`;
    return `<div class="actions">${nav(true)}</div>`;
  }

  /* ------------------------------------------------------------------ *
   * 3. 渲染：「今天」/ 某一天详情（同一个组件）
   * ------------------------------------------------------------------ */
  function renderStopRow(s, i, st) {
    const past = st && (st.done || i < st.cur);
    const cur = st && !st.done && i === st.cur;
    const p = place(s);
    const go = dest(p) ? `<a class="go" href="${navUrl(p, s.leg && s.leg.mode)}" target="_blank" rel="noopener" aria-label="导航到${esc(s.name)}">🧭</a>` : '<span></span>';
    const leg = s.leg ? `<li class="leg">${legText(s.leg, i === 0)}</li>` : '';
    return `${leg}<li class="stop${s.hl ? ' hl' : ''}${past ? ' past' : ''}${cur ? ' cur' : ''}">
      <div class="t">${s.t}<small>${slotOf(s.t)}</small></div>
      <span class="dot"></span>
      <div class="b"><div class="name">${esc(s.name)}</div>${s.note ? `<div class="note">${esc(s.note)}</div>` : ''}</div>
      ${go}
    </li>`;
  }

  function renderLiveCards(day, st) {
    if (st.done) return '<div class="card"><div class="eyebrow">🌙 今天的行程结束了</div><div class="note">好好休息，明天继续。</div></div>';
    let html = '';
    if (st.cur >= 0) {
      const s = day.stops[st.cur];
      html += `<div class="card now"><div class="eyebrow">现在 · ${slotOf(s.t)}</div><div class="name">${esc(s.name)}</div>${s.note ? `<div class="note">${esc(s.note)}</div>` : ''}</div>`;
    } else {
      html += '<div class="card"><div class="eyebrow">今天还没开始</div></div>';
    }
    if (st.next >= 0) {
      const s = day.stops[st.next];
      html += `<div class="card next"><div class="eyebrow">下一站 · ${s.t}</div><div class="name">${esc(s.name)}</div>
        ${s.note ? `<div class="note">${esc(s.note)}</div>` : ''}
        ${s.leg ? `<div class="legline">${legText(s.leg, false)}</div>` : ''}
        ${stopActions(s)}</div>`;
    }
    return html;
  }

  function renderStayCard(day, live) {
    if (!day.stay) return '';
    const s = T.stays[day.stay];
    const copy = s.address || s.name;
    return `<div class="card stay"><div class="eyebrow">${live ? '今晚住' : '当晚住'}</div>
      <div class="name">${esc(s.name)}</div><div class="status">${esc(s.status || '')}</div>
      <div class="actions">${btn('🚕 回住处', uberUrl(s), true)}${copyBtn('📋 复制地址', copy)}</div></div>`;
  }

  function renderDay(day, ctx) {
    const live = ctx.live;
    const st = live ? stopState(day, ctx.clk) : null;
    const dr = dayDrive(day);
    const driveChip = dr.n ? `🚗 今日车程约 ${fmtMin(dr.min)} · ${dr.n} 段` : '🚶 今天基本步行';
    return `
      ${ctx.banner}
      <div><div class="day-date">${dateLabel(day.date)} · ${esc(T.cities[day.city])}</div>
        <h1 class="day-title">${esc(day.title)}</h1>
        <div class="day-drive">${driveChip}</div></div>
      ${live ? renderLiveCards(day, st) : ''}
      <div class="sec-h">${live ? '今日完整安排' : '当天安排'}</div>
      <ol class="tl">${day.stops.map((s, i) => renderStopRow(s, i, st)).join('')}</ol>
      ${day.tip ? `<div class="tip"><span>💡</span><span>${esc(day.tip)}</span></div>` : ''}
      ${renderStayCard(day, live)}`;
  }

  /* ------------------------------------------------------------------ *
   * 4. 渲染：「全程」「随身」、顶栏
   * ------------------------------------------------------------------ */
  function renderTrip(clk) {
    const cities = [...new Set(DAYS.map((d) => d.city))];
    const ratio = cities.map((c) => `<i class="${c}" style="flex:${T.stays[c].nights}"></i>`).join('');
    const groups = cities.map((c) => {
      const rows = DAYS.filter((d) => d.city === c).map((d) => {
        const dr = dayDrive(d);
        const isToday = clk.mode === 'live' && d.n === clk.todayN;
        return `<button type="button" class="row" data-city="${c}" data-day="${d.n}">
          <span class="n">D${d.n}</span>
          <span class="m"><span class="d">${+d.date.slice(5, 7)}/${+d.date.slice(8, 10)} ${weekday(d.date)}${isToday ? '<span class="badge">今天</span>' : ''}</span><span class="ti">${esc(d.title)}</span></span>
          <span class="dr">${dr.n ? `🚗 ${fmtMin(dr.min)}` : '🚶'}</span><span class="chev">›</span></button>`;
      }).join('');
      return `<div class="grp-h" data-city="${c}">${esc(T.cities[c])} · ${T.stays[c].nights} 晚</div>${rows}`;
    }).join('');
    return `<div class="trip-sum">${DAYS.length} 天 ${T.nights} 晚 · ${T.party}</div><div class="ratio">${ratio}</div>${groups}`;
  }

  function renderStayPocket(s) {
    return `<div class="card stay"><div class="name">${esc(s.name)}</div><div class="status">${esc(s.status || '')}</div>
      <div class="addr${s.address ? '' : ' pending'}">${s.address ? esc(s.address) : '地址待订单确认'}</div>
      <div class="actions">${copyBtn('📋 复制', s.address || s.name)}${btn('🧭 导航', navUrl(s), false)}${btn('🚕 叫 Uber', uberUrl(s), true)}</div></div>`;
  }

  function renderPocket() {
    const poc = T.pocket.map((p) => `<details class="poc"><summary><span class="ic">${p.icon}</span><span class="ttl"><b>${esc(p.title)}</b><i>${esc(p.summary)}</i></span></summary>
      <div class="pb">${p.body}${p.copy ? `<div class="actions">${copyBtn(`📋 ${p.copyLabel || '复制'}`, p.copy)}</div>` : ''}</div></details>`).join('');
    return `
      <div class="card flash-card"><div class="name">👶 点餐大字卡</div><div class="note">蔬菜浓汤 + 白米饭，少盐不辣，直接给服务员看</div>
        <div class="actions"><button type="button" class="btn primary" data-flash>出示给服务员</button></div></div>
      <div class="sec-h">住处</div>
      ${Object.values(T.stays).map(renderStayPocket).join('')}
      <div class="sec-h">小抄</div>
      ${poc}`;
  }

  function renderHead(clk, viewN) {
    const live = clk.mode === 'live';
    $('#top-main').innerHTML = live ? `Day <b>${clk.todayN}</b> / ${DAYS.length}`
      : clk.mode === 'before' ? `距出发 <b>${clk.until}</b> 天` : `旅程完成 · ${DAYS.length} 天`;
    $('#clock').textContent = `里斯本 ${pad(Math.floor(clk.min / 60))}:${pad(clk.min % 60)}`;

    $('#prog').innerHTML = DAYS.map((d) => {
      const cls = [
        clk.mode === 'after' || (live && d.n < clk.todayN) ? 'done' : '',
        live && d.n === clk.todayN ? 'today' : '',
        d.n === viewN && (state.viewDay !== null || !live) ? 'view' : ''
      ].join(' ');
      return `<button type="button" class="seg ${cls}" data-city="${d.city}" data-n="${d.n}" data-day="${d.n}" aria-label="第 ${d.n} 天"></button>`;
    }).join('');
  }

  /* ------------------------------------------------------------------ *
   * 5. 状态与总渲染
   * ------------------------------------------------------------------ */
  const state = { tab: 'today', viewDay: null, fromTrip: false, lastNav: 0 };
  let lastSig = '';

  const panels = { today: $('#p-today'), trip: $('#p-trip'), pocket: $('#p-pocket') };

  function render() {
    const clk = getClock();
    const viewN = state.viewDay ?? clk.todayN;
    const day = DAYS[viewN - 1];

    document.body.dataset.tab = state.tab;
    document.body.dataset.mode = clk.mode;
    document.body.dataset.city = day.city;
    document.querySelectorAll('.tab').forEach((t) => {
      if (t.dataset.tab === state.tab) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
    Object.entries(panels).forEach(([k, el]) => { el.hidden = k !== state.tab; });

    renderHead(clk, viewN);

    // 面板内容只在“关键状态变了”时才重绘，避免每分钟刷新导致页面跳动
    const live = clk.mode === 'live' && viewN === clk.todayN;
    const st = live ? stopState(day, clk) : { cur: -2, done: false };
    const sig = [state.tab, viewN, clk.mode, clk.todayN, st.cur, st.done, state.fromTrip].join('|');
    if (sig === lastSig) return;
    lastSig = sig;

    if (state.tab === 'today') {
      panels.today.innerHTML = renderDay(day, { live, clk, banner: renderBanner(clk, viewN) });
    } else if (state.tab === 'trip') {
      panels.trip.innerHTML = renderTrip(clk);
    } else {
      panels.pocket.innerHTML = renderPocket();
    }
  }

  function renderBanner(clk, viewN) {
    const away = clk.mode === 'live' && viewN !== clk.todayN;
    let text = '';
    let action = '';
    if (state.fromTrip) action = '<button type="button" data-act="back-trip">← 返回全程</button>';
    else if (away) { text = `正在查看 Day ${viewN}`; action = '<button type="button" data-act="today">回到今天</button>'; }
    else if (clk.mode === 'before') text = '出发前预览 · 点上方进度条看任意一天';
    else if (clk.mode === 'after') text = '旅程已结束 · 点上方进度条回看';
    if (!text && !action) return '';
    if (state.fromTrip && !text) text = `Day ${viewN}`;
    return `<div class="banner"><span>${text}</span>${action}</div>`;
  }

  function go(patch) {
    Object.assign(state, patch);
    state.lastNav = Date.now();
    lastSig = '';
    render();
    window.scrollTo(0, 0);
  }

  /* ------------------------------------------------------------------ *
   * 6. 事件
   * ------------------------------------------------------------------ */
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), 1800);
  }

  async function copyText(text) {
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    toast('已复制');
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-tab],[data-day],[data-act],[data-copy],[data-flash],[data-close-flash]');
    if (!t) return;
    if (t.dataset.copy != null) return copyText(t.dataset.copy);
    if (t.dataset.flash != null) return $('#flash').showModal();
    if (t.dataset.closeFlash != null) return $('#flash').close();
    if (t.dataset.act === 'today') return go({ tab: 'today', viewDay: null, fromTrip: false });
    if (t.dataset.act === 'back-trip') return go({ tab: 'trip', viewDay: null, fromTrip: false });
    if (t.dataset.day) {
      const fromTrip = t.classList.contains('row');
      return go({ tab: 'today', viewDay: +t.dataset.day, fromTrip });
    }
    if (t.dataset.tab) {
      // 点“今天”Tab = 永远回到今天
      return go({ tab: t.dataset.tab, viewDay: null, fromTrip: false });
    }
  });

  $('#flash').addEventListener('click', (e) => { if (e.target === e.currentTarget) e.currentTarget.close(); });

  /** 重新判定：从后台切回 / 解锁 / bfcache 恢复。手动导航 5 分钟之后切回，一律回到“今天” */
  function wake() {
    if (Date.now() - state.lastNav > GRACE_MIN && (state.tab !== 'today' || state.viewDay !== null)) {
      state.tab = 'today'; state.viewDay = null; state.fromTrip = false;
      lastSig = '';
      window.scrollTo(0, 0);
    }
    render();
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') wake(); });
  window.addEventListener('pageshow', (e) => { if (e.persisted) wake(); });
  setInterval(() => { if (document.visibilityState === 'visible') render(); }, 60000);

  /* ------------------------------------------------------------------ *
   * 7. 启动
   * ------------------------------------------------------------------ */
  const qDay = +params.get('day');
  if (qDay >= 1 && qDay <= DAYS.length) state.viewDay = qDay;
  const qTab = params.get('tab');
  if (['today', 'trip', 'pocket'].includes(qTab)) state.tab = qTab;
  render();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
})();
