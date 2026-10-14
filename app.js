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
    const h = (+p.hour || 0) % 24;
    const mi = +p.minute || 0;
    return { date: `${p.year}-${p.month}-${p.day}`, min: h * 60 + mi };
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
  const md = (d) => [+d.slice(5, 7), +d.slice(8, 10)];
  const dateLabel = (d) => { const [m, dd] = md(d); return `${m}月${dd}日 ${weekday(d)}`; };

  /** 城市配色：全部来自 data.js；界面只认 --c / --c-soft 两个变量 */
  const cityVars = (k) => `--c:${T.cities[k].color};--c-soft:${T.cities[k].soft}`;
  const CITY_KEYS = [...new Set(DAYS.map((d) => d.city))];
  const nightsIn = (k) => DAYS.filter((d) => d.city === k && d.stay).length;

  const dayDrive = (day) => day.stops.reduce((a, s) => (s.leg && s.leg.mode !== 'walk' ? { min: a.min + s.leg.min, n: a.n + 1 } : a), { min: 0, n: 0 });

  /**
   * stop / stay → 可搜索导航的具体地点（采用明确名称/地址，不用坐标/Pin，便于在地图与打车软件精准检索）
   */
  const place = (o) => (o.at ? T.stays[o.at] : o);
  const dest = (o) => {
    const p = place(o);
    return p.address || p.query || null;
  };

  const navUrl = (o, mode) => {
    const target = dest(o) || place(o).name;
    return `https://www.google.com/maps/dir/?api=1&destination=${enc(target)}${mode === 'walk' ? '&travelmode=walking' : ''}`;
  };

  const uberUrl = (o) => {
    const p = place(o);
    const target = dest(o) || p.name;
    return `https://m.uber.com/ul/?action=setPickup&pickup=my_location&dropoff[formatted_address]=${enc(target)}&dropoff[nickname]=${enc(p.name)}`;
  };

  const legText = (leg, first) => {
    if (!leg) return '';
    const from = first ? '从住处出发 · ' : '';
    if (leg.mode === 'walk') return `🚶 ${from}步行约 ${fmtMin(leg.min)}`;
    if (leg.mode === 'drive') return `🚗 ${from}自驾约 ${fmtMin(leg.min)}${leg.km ? ` · ${leg.km} km` : ''}`;
    return `🚕 ${from}约 ${fmtMin(leg.min)}${leg.eur ? ` · ~€${leg.eur}` : ''}`;
  };

  const btn = (label, href, primary, extra = '') => `<a class="btn${primary ? ' primary' : ''}" href="${href}" target="_blank" rel="noopener"${extra}>${label}</a>`;
  /** 目的地文字：点叫车时静默复制到剪贴板，方便切到别的打车 App（如 Bolt）粘贴比价 */
  const rideText = (o) => dest(o) || place(o).name;
  const uberAttrs = (o) => ` data-also-copy="${esc(rideText(o))}"`;
  const uberBtn = (o, label = '🚕 叫车') => btn(label, uberUrl(o), true, uberAttrs(o));
  const copyBtn = (label, text) => `<button type="button" class="btn" data-copy="${esc(text)}">${label}</button>`;

  /** 给一个停靠点生成【叫车 / 导航】按钮 */
  function stopActions(stop) {
    const p = place(stop);
    if (!dest(p)) return '';
    const mode = stop.leg && stop.leg.mode;
    const nav = (primary) => btn('🧭 导航', navUrl(p, mode), primary);
    if (mode === 'uber') return `<div class="actions">${uberBtn(p)}${nav(false)}</div>`;
    return `<div class="actions">${nav(true)}</div>`;
  }

  /* ------------------------------------------------------------------ *
   * 3. 渲染：「今天」/ 某一天详情（同一个组件）
   * ------------------------------------------------------------------ */
  function renderStopRow(s, i, st) {
    const past = st && (st.done || i < st.cur);
    const cur = st && !st.done && i === st.cur;
    const p = place(s);
    const go = dest(p) ? `<a class="go" href="${navUrl(p, s.leg && s.leg.mode)}" target="_blank" rel="noopener" aria-label="导航到${esc(s.name)}"><span>↗</span></a>` : '<span></span>';
    const leg = s.leg ? `<li class="leg">${legText(s.leg, i === 0)}</li>` : '';
    return `${leg}<li class="stop${s.hl ? ' hl' : ''}${past ? ' past' : ''}${cur ? ' cur' : ''}">
      <div class="t">${s.t}<small>${slotOf(s.t)}</small></div>
      <span class="dot"></span>
      <div class="b"><div class="name">${esc(s.name)}</div>${s.note ? `<div class="note">${esc(s.note)}</div>` : ''}</div>
      ${go}
    </li>`;
  }

  const etaText = (t, nowMin) => {
    const d = toMin(t) - nowMin;
    return d <= 0 ? '现在出发' : d < 60 ? `${d} 分钟后` : `${fmtMin(d)}后`;
  };

  function renderLiveCards(day, st, clk) {
    if (st.done) return '<div class="nowbar"><span>🌙</span><b>今天的行程结束了，好好休息</b></div>';
    let html = '';
    if (st.cur >= 0) html += `<div class="nowbar"><i class="pulse"></i><span>现在</span><b>${esc(day.stops[st.cur].name)}</b></div>`;
    else html += '<div class="nowbar"><span>今天还没开始</span></div>';
    if (st.next >= 0) {
      const s = day.stops[st.next];
      html += `<div class="card next"><div class="next-h"><span class="eyebrow">下一站 · <b class="big">${s.t}</b></span><span class="eta" data-eta="${s.t}">${etaText(s.t, clk.min)}</span></div>
        <div class="name">${esc(s.name)}</div>
        ${s.note ? `<div class="note">${esc(s.note)}</div>` : ''}
        ${s.leg ? `<div class="legline">${legText(s.leg, false)}</div>` : ''}
        ${stopActions(s)}</div>`;
    }
    return html;
  }

  function renderDayPager(day) {
    if (day.n < DAYS.length) {
      const next = DAYS[day.n];
      return `
        <div class="day-pager">
          <div class="dp-hint"><span class="dp-arrow">↑</span> 继续上滑切换下一天</div>
          <button type="button" class="dp-card" data-day="${next.n}">
            <div class="dp-sub">下一天 · Day ${next.n}</div>
            <div class="dp-title"><span>${esc(next.title)}</span><span class="dp-chev">›</span></div>
          </button>
        </div>`;
    }
    return `
      <div class="day-pager">
        <button type="button" class="dp-card dp-end" data-tab="trip">
          <div class="dp-sub">🎉 9 天慢调行程圆满结束</div>
          <div class="dp-title" style="justify-content:center;gap:6px"><span>查看全程总览</span><span class="dp-chev">›</span></div>
        </button>
      </div>`;
  }

  function renderDay(day, ctx) {
    const live = ctx.live;
    const st = live ? stopState(day, ctx.clk) : null;
    const dr = dayDrive(day);
    const home = day.stay && T.stays[day.stay];
    const driveChip = dr.n ? `🚗 车程约 ${fmtMin(dr.min)} · ${dr.n} 段` : '🚶 基本步行';
    return `
      ${ctx.banner}
      <${home ? `a class="hero" href="${uberUrl(home)}" target="_blank" rel="noopener"${uberAttrs(home)}` : 'div class="hero"'}>
        <div class="hero-top"><span>Day ${day.n}/${DAYS.length} · ${dateLabel(day.date)}</span><span>${esc(T.cities[day.city].name)}</span></div>
        <h1 class="day-title">${esc(day.title)}</h1>
        <div class="hero-chips"><span>${driveChip}</span><span>📍 ${day.stops.length} 站</span></div>
      </${home ? 'a' : 'div'}>
      ${live ? renderLiveCards(day, st, ctx.clk) : ''}
      <div class="sec-h">${live ? '今日完整安排' : '当天安排'}</div>
      <ol class="tl">${day.stops.map((s, i) => renderStopRow(s, i, st)).join('')}</ol>
      ${day.tip ? `<div class="tip"><span>💡</span><span>${esc(day.tip)}</span></div>` : ''}
      ${renderDayPager(day)}`;
  }

  /* ------------------------------------------------------------------ *
   * 4. 渲染：「全程」「随身」、顶栏
   * ------------------------------------------------------------------ */
  function renderTrip(clk) {
    const ratio = CITY_KEYS.map((c) => `<i style="${cityVars(c)};flex:${nightsIn(c)}"></i>`).join('');
    const groups = CITY_KEYS.map((c) => {
      const rows = DAYS.filter((d) => d.city === c).map((d) => {
        const dr = dayDrive(d);
        const isToday = clk.mode === 'live' && d.n === clk.todayN;
        const [m, dd] = md(d.date);
        return `<button type="button" class="row" style="${cityVars(c)}" data-day="${d.n}">
          <span class="n">D${d.n}</span>
          <span class="m"><span class="d">${m}/${dd} ${weekday(d.date)}${isToday ? '<span class="badge">今天</span>' : ''}</span><span class="ti">${esc(d.title)}</span></span>
          <span class="dr">${dr.n ? `🚗 ${fmtMin(dr.min)}` : '🚶'}</span><span class="chev">›</span></button>`;
      }).join('');
      return `<div class="grp-h" style="${cityVars(c)}">${esc(T.cities[c].name)} · ${nightsIn(c)} 晚</div>${rows}`;
    }).join('');
    return `<div class="trip-sum">${DAYS.length} 天 ${DAYS.length - 1} 晚 · ${T.party}</div><div class="ratio">${ratio}</div>${groups}`;
  }

  function renderStayPocket(s) {
    return `<div class="card stay"><div class="name">${esc(s.name)}</div><div class="status">${esc(s.status || '')}</div>
      <div class="addr${s.address ? '' : ' pending'}" data-copy="${esc(rideText(s))}">${s.address ? esc(s.address) : '地址待订单确认'} <span>📋</span></div>
      <div class="actions">${btn('🧭 导航', navUrl(s), false)}${uberBtn(s)}</div></div>`;
  }

  function renderPocket() {
    const poc = T.pocket.map((p) => `<details class="poc"><summary><span class="ic">${p.icon}</span><span class="ttl"><b>${esc(p.title)}</b><i>${esc(p.summary)}</i></span></summary>
      <div class="pb">${p.body}${p.copy ? `<div class="actions">${copyBtn(`📋 ${p.copyLabel || '复制'}`, p.copy)}</div>` : ''}</div></details>`).join('');
    return `
      <div class="card flash-card"><div class="name">${esc(T.flash.title)}</div><div class="note">${esc(T.flash.hint)}</div>
        <div class="actions"><button type="button" class="btn primary" data-flash>出示给服务员</button></div></div>
      <div class="sec-h">住处</div>
      ${Object.values(T.stays).map(renderStayPocket).join('')}
      <div class="sec-h">小抄</div>
      ${poc}`;
  }

  function renderHead(clk) {
    const live = clk.mode === 'live';
    $('#top-main').innerHTML = live ? `Day <b>${clk.todayN}</b> / ${DAYS.length}`
      : clk.mode === 'before' ? `距出发 <b>${clk.until}</b> 天` : `旅程完成 · ${DAYS.length} 天`;
    $('#clock').textContent = `里斯本 ${pad(Math.floor(clk.min / 60))}:${pad(clk.min % 60)}`;
  }

  /* ------------------------------------------------------------------ *
   * 5. 状态与总渲染
   * ------------------------------------------------------------------ */
  const state = { tab: 'today', viewDay: null, fromTrip: false, lastNav: 0 };
  let lastSig = '';

  // 全屏点餐卡的文案来自 data.js
  $('#flash-badge').textContent = T.flash.badge;
  $('#flash-pt').textContent = T.flash.pt;
  $('#flash-zh').textContent = T.flash.zh;

  const panels = { today: $('#p-today'), trip: $('#p-trip'), pocket: $('#p-pocket') };

  function render() {
    const clk = getClock();
    const viewN = state.viewDay ?? clk.todayN;
    const day = DAYS[viewN - 1];

    document.body.dataset.tab = state.tab;
    document.body.dataset.mode = clk.mode;
    document.body.style.setProperty('--accent', T.cities[day.city].color);
    document.body.style.setProperty('--accent-soft', T.cities[day.city].soft);
    document.querySelectorAll('.tab').forEach((t) => {
      if (t.dataset.tab === state.tab) t.setAttribute('aria-current', 'page'); else t.removeAttribute('aria-current');
    });
    Object.entries(panels).forEach(([k, el]) => { el.hidden = k !== state.tab; });

    renderHead(clk);
    document.querySelectorAll('[data-eta]').forEach((el) => { el.textContent = etaText(el.dataset.eta, clk.min); });

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
   * 6. 翻页动效与手势识别（上滑翻至下一天 / 下拉翻回上一天）
   * ------------------------------------------------------------------ */
  const PULL_THRESHOLD = 52;
  let touchStartX = 0;
  let touchStartY = 0;
  let pullY0 = null;          // 「到达页面底部」那一刻手指的位置：只计算此后的额外上拉距离
  let pullDir = null;
  let pullDist = 0;
  let thresholdTriggered = false;

  function switchDay(n, dir = 'next') {
    if (n < 1 || n > DAYS.length) return;
    const curN = state.viewDay ?? getClock().todayN;
    if (n === curN && state.tab === 'today') return;
    const panel = panels.today;
    panel.classList.remove('slide-next', 'slide-prev');
    void panel.offsetWidth; // 触发 reflow 重置动画
    panel.classList.add(dir === 'next' ? 'slide-next' : 'slide-prev');
    go({ tab: 'today', viewDay: n, fromTrip: false });
    setTimeout(() => panel.classList.remove('slide-next', 'slide-prev'), 320);
  }

  function showFlipIndicator(targetN, dist) {
    const ind = $('#flip-indicator');
    if (!ind || targetN < 1 || targetN > DAYS.length) return;
    const targetDay = DAYS[targetN - 1];
    const ready = dist >= PULL_THRESHOLD;
    if (ready && !thresholdTriggered) {
      thresholdTriggered = true;
      if (navigator.vibrate) try { navigator.vibrate(10); } catch {}
    } else if (!ready) {
      thresholdTriggered = false;
    }
    ind.hidden = false;
    ind.className = `flip-indicator${ready ? ' ready' : ''}`;
    ind.innerHTML = `<span class="fi-arrow">↑</span><span>${ready ? `松手切换至 Day ${targetN} · ${esc(targetDay.title)}` : `↑ 继续上滑查看 Day ${targetN} · ${esc(targetDay.title)}`}</span>`;
  }

  function hideFlipIndicator() {
    const ind = $('#flip-indicator');
    if (ind) { ind.hidden = true; ind.className = 'flip-indicator'; }
    thresholdTriggered = false;
  }

  window.addEventListener('touchstart', (e) => {
    if (state.tab !== 'today' || e.touches.length !== 1) return;
    const t = e.touches[0];
    touchStartY = t.clientY;
    touchStartX = t.clientX;
    pullY0 = null;
    pullDir = null;
    pullDist = 0;
    thresholdTriggered = false;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (state.tab !== 'today' || e.touches.length !== 1) return;
    const t = e.touches[0];
    const dx = t.clientX - touchStartX;
    if (Math.abs(dx) > Math.abs(t.clientY - touchStartY) * 1.2) return;   // 横向优先，不抢手势

    const clk = getClock();
    const viewN = state.viewDay ?? clk.todayN;
    const docEl = document.documentElement;
    const scrollBottom = docEl.scrollHeight - window.innerHeight - window.scrollY;

    // 手指从页面中部一路滑到底时不算翻页：以「到底那一刻」为起点，再额外上拉才触发
    if (scrollBottom > 8) pullY0 = null;
    else if (pullY0 === null) pullY0 = t.clientY;
    const dy = pullY0 === null ? 0 : t.clientY - pullY0;

    // 仅在页面底部继续往上拉时触发下一天翻页（顶部下拉保留给浏览器原生刷新/回弹）
    if (dy < -10 && viewN < DAYS.length) {
      pullDir = 'next';
      pullDist = Math.min(100, Math.max(0, -dy * 0.5));
      showFlipIndicator(viewN + 1, pullDist);
    } else {
      hideFlipIndicator();
      pullDir = null;
      pullDist = 0;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    if (pullDir && pullDist >= PULL_THRESHOLD) {
      const clk = getClock();
      const viewN = state.viewDay ?? clk.todayN;
      const targetN = pullDir === 'next' ? viewN + 1 : viewN - 1;
      switchDay(targetN, pullDir);
    }
    hideFlipIndicator();
    pullDir = null;
    pullDist = 0;
  }, { passive: true });

  // 桌面/Mac 触控板滚轮超限翻页
  let wheelAccum = 0;
  let wheelTimer = null;
  let wheelLast = 0;
  let wheelFromBottom = false;   // 这一轮滚动是不是「本来就停在底部」开始的（排除惯性滑到底）
  window.addEventListener('wheel', (e) => {
    if (state.tab !== 'today') return;
    const clk = getClock();
    const viewN = state.viewDay ?? clk.todayN;
    const docEl = document.documentElement;
    const scrollBottom = docEl.scrollHeight - window.innerHeight - window.scrollY;
    const now = Date.now();
    if (now - wheelLast > 250) wheelFromBottom = scrollBottom <= 6;   // 新一轮滚动
    wheelLast = now;

    if (wheelFromBottom && e.deltaY > 0 && scrollBottom <= 6 && viewN < DAYS.length) {
      wheelAccum += e.deltaY;
      if (wheelAccum > 120) {
        wheelAccum = 0;
        switchDay(viewN + 1, 'next');
      }
    } else {
      wheelAccum = 0;
    }
    clearTimeout(wheelTimer);
    wheelTimer = setTimeout(() => { wheelAccum = 0; }, 320);
  }, { passive: true });

  /* ------------------------------------------------------------------ *
   * 7. 全局点击与常规操作
   * ------------------------------------------------------------------ */
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toast.t);
    toast.t = setTimeout(() => el.classList.remove('show'), 1800);
  }

  async function copyText(text, msg = '已复制') {   // msg=null 时静默
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = Object.assign(document.createElement('textarea'), { value: text });
      document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    if (msg) toast(msg);
  }

  document.addEventListener('click', (e) => {
    const t = e.target.closest('.tab[data-tab],[data-day],[data-act],[data-copy],[data-also-copy],[data-flash],[data-close-flash]');
    if (!t) return;
    if (t.dataset.copy != null) return copyText(t.dataset.copy);
    if (t.dataset.alsoCopy != null) return copyText(t.dataset.alsoCopy, null);   // 不拦截，链接照常跳转
    if (t.dataset.flash != null) return $('#flash').showModal();
    if (t.dataset.closeFlash != null) return $('#flash').close();
    if (t.dataset.act === 'today') return switchDay(getClock().todayN, 'prev');
    if (t.dataset.act === 'back-trip') return go({ tab: 'trip', viewDay: null, fromTrip: false });
    if (t.dataset.day) {
      const fromTrip = t.classList.contains('row');
      const nextN = +t.dataset.day;
      const curN = state.viewDay ?? getClock().todayN;
      const dir = nextN >= curN ? 'next' : 'prev';
      if (fromTrip) return go({ tab: 'today', viewDay: nextN, fromTrip: true });
      return switchDay(nextN, dir);
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
