/* 통통 국무사 — 국제무역사 1급 개념 카드·퀴즈 앱 (오프라인 PWA) */
(function () {
  'use strict';
  const D = window.TT_DATA || { subjects: [], cards: [], quiz: [] };
  const KEY = 'tongtong-kms-v1';
  const EXAM_DEFAULT = '2026-11-28';
  const $app = document.getElementById('app');
  const $nav = document.getElementById('nav');

  const SUBJ = {}; D.subjects.forEach(s => SUBJ[s.id] = s);
  const CARD = {}; D.cards.forEach(c => CARD[c.id] = c);
  const Q = {}; D.quiz.forEach(q => Q[q.id] = q);
  const CARDS_BY_S = {}; D.cards.forEach(c => (CARDS_BY_S[c.s] = CARDS_BY_S[c.s] || []).push(c));
  const QUIZ_BY_S = {}; D.quiz.forEach(q => (QUIZ_BY_S[q.s] = QUIZ_BY_S[q.s] || []).push(q));
  const EXAMS = ['무역계약', '무역결제', '무역규범', '무역영어'];

  /* ---------- icons ---------- */
  const I = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 10.5 12 4l8.5 6.5V19a1.5 1.5 0 0 1-1.5 1.5h-4v-6h-6v6H5A1.5 1.5 0 0 1 3.5 19z"/></svg>',
    book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z"/><path d="M4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5"/><path d="M9 8h7M9 11.5h5"/></svg>',
    quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="3.5" width="17" height="17" rx="4"/><path d="M9.5 9.3a2.6 2.6 0 1 1 3.4 2.5c-.6.2-.9.7-.9 1.3v.6M12 16.8v.1"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3.5h9l3.5 3.5V20a.5.5 0 0 1-.5.5H6a.5.5 0 0 1-.5-.5V4a.5.5 0 0 1 .5-.5z"/><path d="M9 11l2 2 4-4M9 16.5h6"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3.2l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.6l-5.2 2.8 1-5.9-4.3-4.1 5.9-.8z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    left: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M15 5l-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><circle cx="11" cy="11" r="6.5"/><path d="m20 20-4.2-4.2"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>',
    bulb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1 2V16h5.2v-.2c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z"/></svg>',
    ship: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 15h18l-2.5 4.5h-13z"/><path d="M6 15V9h12v6M10 9V5.5h4V9"/></svg>',
    flag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4M5 4h11l-2 4 2 4H5"/></svg>',
    check: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    cross: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>',
  };

  /* 통통배 마스코트 */
  function boat(size = 76, mood = 'happy') {
    const mouth = mood === 'sad' ? '<path d="M45 60 q5 -4 10 0" stroke="#2F3A4A" stroke-width="2.6" fill="none" stroke-linecap="round"/>'
      : mood === 'wow' ? '<ellipse cx="50" cy="60" rx="3.6" ry="4.2" fill="#2F3A4A"/>'
        : '<path d="M44 58 q6 6 12 0" stroke="#2F3A4A" stroke-width="2.6" fill="none" stroke-linecap="round"/>';
    return `<svg width="${size}" height="${size}" viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 12 v26" stroke="#8A6A4A" stroke-width="3" stroke-linecap="round"/>
      <path d="M51 13 l16 6 -16 6z" fill="#FF7B7B"/>
      <rect x="30" y="36" width="40" height="30" rx="9" fill="#FFFFFF" stroke="#2F3A4A" stroke-width="3"/>
      <circle cx="42" cy="50" r="3.2" fill="#2F3A4A"/><circle cx="58" cy="50" r="3.2" fill="#2F3A4A"/>
      <ellipse cx="36.5" cy="57" rx="3.6" ry="2.4" fill="#FFB3B3"/><ellipse cx="63.5" cy="57" rx="3.6" ry="2.4" fill="#FFB3B3"/>
      ${mouth}
      <path d="M14 66 h72 l-9 17 q-1 3 -4 3 H27 q-3 0 -4 -3z" fill="#4C9DF2" stroke="#2F3A4A" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="36" cy="75" r="2.6" fill="#FFFFFF"/><circle cx="50" cy="75" r="2.6" fill="#FFFFFF"/><circle cx="64" cy="75" r="2.6" fill="#FFFFFF"/>
      <path d="M6 92 q6 -5 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0" stroke="#7CC0FF" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`;
  }

  /* ---------- helpers ---------- */
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const md = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const now = () => Date.now();
  function dayKey(ts) { const d = new Date(ts || now()); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
  function toast(msg, ms = 2000) {
    const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t);
    setTimeout(() => t.remove(), ms);
  }

  /* ---------- state ---------- */
  function fresh() { return { v: 1, seen: {}, star: {}, qa: {}, wrong: {}, day: {}, last: null, set: { theme: 'system', exam: EXAM_DEFAULT } }; }
  let S = load();
  function load() {
    try { const raw = localStorage.getItem(KEY); if (raw) return Object.assign(fresh(), JSON.parse(raw)); } catch (e) { }
    return fresh();
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
  function applyTheme() {
    const t = S.set.theme;
    if (t === 'system') document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', t);
  }
  function bumpDay(field) { const k = dayKey(); S.day[k] = S.day[k] || { q: 0, ok: 0, c: 0 }; S.day[k][field]++; }

  function markSeen(id) { if (!S.seen[id]) { S.seen[id] = now(); bumpDay('c'); } S.last = id; save(); }
  function record(q, ok) {
    const r = S.qa[q.id] || { n: 0, ok: 0, last: 0, lastOk: false };
    r.n++; if (ok) r.ok++; r.last = now(); r.lastOk = ok; S.qa[q.id] = r;
    bumpDay('q'); if (ok) bumpDay('ok');
    if (!ok) S.wrong[q.id] = { ts: now(), c: 0 };
    else if (S.wrong[q.id]) { S.wrong[q.id].c++; if (S.wrong[q.id].c >= 2) delete S.wrong[q.id]; }
    save();
  }
  const wrongIds = () => Object.keys(S.wrong).filter(id => Q[id]);

  /* ---------- router ---------- */
  let QS = null; // quiz session
  function go(h) { if (location.hash === h) render(); else location.hash = h; }
  window.addEventListener('hashchange', render);
  function setNav(active) {
    const w = wrongIds().length;
    const items = [['home', '홈', I.home, '#home'], ['concepts', '개념', I.book, '#concepts'], ['quiz', '퀴즈', I.quiz, '#quiz'], ['wrong', '오답노트', I.note, '#wrong']];
    $nav.innerHTML = items.map(([k, label, ic, h]) =>
      `<button class="ni ${active === k ? 'on' : ''}" data-h="${h}" aria-label="${label}">${ic}<span>${label}</span>${k === 'wrong' && w ? `<span class="badge">${w > 99 ? '99+' : w}</span>` : ''}</button>`).join('');
    $nav.querySelectorAll('.ni').forEach(b => b.onclick = () => go(b.dataset.h));
    $nav.style.display = active === 'run' ? 'none' : '';
  }
  function render() {
    const h = (location.hash || '#home').slice(1);
    const [page, arg] = h.split('/');
    window.scrollTo(0, 0);
    if (page === 'concepts') { setNav('concepts'); renderConcepts(arg ? decodeURIComponent(arg) : null); }
    else if (page === 'card') { setNav('concepts'); renderCard(decodeURIComponent(arg || '')); }
    else if (page === 'quiz') { setNav('quiz'); renderQuizSetup(); }
    else if (page === 'run') { setNav('run'); renderRun(); }
    else if (page === 'wrong') { setNav('wrong'); renderWrong(); }
    else { setNav('home'); renderHome(); }
  }

  /* ---------- stats ---------- */
  function subjStats(sid) {
    const cards = CARDS_BY_S[sid] || [], qs = QUIZ_BY_S[sid] || [];
    const seen = cards.filter(c => S.seen[c.id]).length;
    const answered = qs.filter(q => S.qa[q.id]);
    const correct = answered.filter(q => S.qa[q.id].lastOk).length;
    return { cards: cards.length, seen, qs: qs.length, answered: answered.length, correct };
  }
  function examStats(ex) {
    const qs = D.quiz.filter(q => (ex === '무역영어' ? q.eng : SUBJ[q.s] && SUBJ[q.s].exam === ex));
    const ans = qs.filter(q => S.qa[q.id]);
    return { total: qs.length, ans: ans.length, rate: ans.length ? Math.round(100 * ans.filter(q => S.qa[q.id].lastOk).length / ans.length) : null };
  }
  function ddays() {
    const t = new Date(S.set.exam + 'T00:00:00'); const d = new Date(); d.setHours(0, 0, 0, 0);
    return Math.round((t - d) / 86400000);
  }

  /* ---------- home ---------- */
  function renderHome() {
    const td = S.day[dayKey()] || { q: 0, ok: 0, c: 0 };
    const dd = ddays();
    const w = wrongIds().length;
    const greet = dd > 0 ? `시험까지 <b>${dd}일</b>! 오늘도 한 문제씩 통통 나아가요` : dd === 0 ? '오늘이 시험 날! <b>화이팅</b>' : '시험 수고했어요!';
    const lastCard = S.last && CARD[S.last];
    const examRows = EXAMS.map(ex => {
      const s = examStats(ex);
      const warn = s.rate !== null && s.ans >= 10 && s.rate < 50;
      return `<div class="subj" data-ex="${ex}" tabindex="0"><span class="n">${esc(ex)} ${warn ? '<span class="tag coral">과락 주의</span>' : ''}</span>
        <span class="r">${s.rate === null ? '아직 안 풂' : `정답률 ${s.rate}%`} · ${s.ans}/${s.total}</span>
        <div class="bar"><i class="b2" style="width:${s.total ? 100 * s.ans / s.total : 0}%"></i></div></div>`;
    }).join('');
    const subjRows = D.subjects.map(s => {
      const st = subjStats(s.id);
      return `<div class="subj" data-s="${s.id}" tabindex="0"><span class="n"><span class="sdot" style="background:${s.color}"></span>${esc(s.name)}</span>
        <span class="r">카드 ${st.seen}/${st.cards}</span>
        <div class="bar"><i class="b1" style="width:${st.cards ? 100 * st.seen / st.cards : 0}%"></i></div></div>`;
    }).join('');
    $app.innerHTML = `
      <div class="top"><div class="grow"><h1>통통 국무사</h1><div class="sub">국제무역사 1급 개념 · 퀴즈</div></div>
        <button class="iconbtn" id="set" aria-label="설정">${I.gear}</button></div>
      <div class="hello">${boat(72, dd <= 3 ? 'wow' : 'happy')}<div class="bubble">${greet}</div></div>
      <div class="home-grid">
        <div class="card">
          <div class="dday"><div class="num">${dd > 0 ? 'D-' + dd : dd === 0 ? 'D-DAY' : 'D+' + (-dd)}</div>
            <div class="t"><b>제67회 국제무역사 1급</b><span class="muted small">${esc(S.set.exam)} · 과목별 40점 미만 과락</span></div></div>
          <div class="stats3">
            <div class="stat sea"><b>${td.c}</b><span>오늘 본 카드</span></div>
            <div class="stat mint"><b>${td.q}</b><span>오늘 푼 문제</span></div>
            <div class="stat coral"><b>${w}</b><span>오답노트</span></div>
          </div>
          <div class="stack">
            <button class="btn" id="go10">${I.quiz}랜덤 10문제 풀기</button>
            <div class="row2">
              <button class="btn ghost" id="gowrong" ${w ? '' : 'disabled'}>오답 다시 풀기</button>
              <button class="btn ghost" id="golast">${lastCard ? '이어서 보기' : '개념 보러 가기'}</button>
            </div>
          </div>
        </div>
        <div class="card"><h2>시험 과목별 정답률</h2>${examRows}
          <div class="legend"><span><i style="background:var(--mint)"></i>푼 문제 비율</span><span>정답률은 각 문제의 마지막 답 기준</span></div></div>
      </div>
      <div class="card"><h2>교안별 진도</h2>${subjRows}</div>`;
    document.getElementById('set').onclick = openSettings;
    document.getElementById('go10').onclick = () => startQuiz({ subjects: [], count: 10, mode: 'smart' });
    document.getElementById('gowrong').onclick = () => startQuiz({ subjects: [], count: 20, mode: 'wrong' });
    document.getElementById('golast').onclick = () => go(lastCard ? '#card/' + encodeURIComponent(lastCard.id) : '#concepts');
    $app.querySelectorAll('.subj[data-s]').forEach(el => el.onclick = () => go('#concepts/' + el.dataset.s));
    $app.querySelectorAll('.subj[data-ex]').forEach(el => el.onclick = () => {
      const ex = el.dataset.ex;
      if (ex === '무역영어') startQuiz({ subjects: [], count: 10, mode: 'eng' });
      else startQuiz({ subjects: D.subjects.filter(s => s.exam === ex).map(s => s.id), count: 10, mode: 'smart' });
    });
  }

  /* ---------- concepts ---------- */
  let cq = '', cstar = false;
  function renderConcepts(sid) {
    if (sid && !SUBJ[sid]) sid = null;
    const chips = [`<button class="chip ${!sid && !cstar ? 'on' : ''}" data-s="">전체</button>`,
      `<button class="chip ${cstar ? 'on' : ''}" data-star="1">★ 즐겨찾기</button>`]
      .concat(D.subjects.map(s => `<button class="chip ${sid === s.id && !cstar ? 'on' : ''}" data-s="${s.id}">${esc(s.name)}</button>`)).join('');
    $app.innerHTML = `
      <div class="top"><div class="grow"><h1>개념 카드</h1><div class="sub">${D.cards.length}장 · 쉬운 설명 · 예시 · 시험 포인트</div></div></div>
      <div class="search">${I.search}<input id="q" type="search" placeholder="예: 신용장, CIF, 위부, 5영업일" value="${esc(cq)}" aria-label="개념 검색"></div>
      <div class="chips">${chips}</div>
      <div id="clist"></div>`;
    const draw = () => {
      const term = cq.trim().toLowerCase().replace(/\s+/g, '');
      let cards = D.cards;
      if (cstar) cards = cards.filter(c => S.star[c.id]);
      else if (sid) cards = cards.filter(c => c.s === sid);
      if (term) cards = cards.filter(c => (c.t + c.unit + c.easy + c.ex + c.pt).toLowerCase().replace(/\s+/g, '').includes(term));
      const box = document.getElementById('clist');
      if (!cards.length) { box.innerHTML = `<div class="empty">${boat(64, 'sad')}<p>${cstar ? '즐겨찾기한 카드가 없어요. 카드에서 ★를 눌러 보세요.' : '찾는 카드가 없어요.'}</p></div>`; return; }
      let html = '', curS = null, curU = null, open = false;
      cards.forEach(c => {
        if (c.s !== curS && !sid) { if (open) html += '</div>'; open = false; html += `<div class="unit" style="font-size:16px;color:var(--ink)">${esc(SUBJ[c.s].name)}</div>`; curS = c.s; curU = null; }
        if (c.unit !== curU) { if (open) html += '</div>'; html += `<div class="unit">${esc(c.unit)}</div><div class="list">`; open = true; curU = c.unit; }
        html += `<div class="item" data-id="${c.id}" tabindex="0"><span class="dot ${S.seen[c.id] ? 'seen' : ''}"></span>
          <div class="t"><b>${esc(c.t)}</b><span>${esc((c.easy || '').replace(/\*\*/g, '').split('\n')[0])}</span></div>
          ${S.star[c.id] ? `<span class="star on">${I.star}</span>` : ''}</div>`;
      });
      if (open) html += '</div>';
      box.innerHTML = html;
      box.querySelectorAll('.item').forEach(el => el.onclick = () => go('#card/' + encodeURIComponent(el.dataset.id)));
    };
    draw();
    const inp = document.getElementById('q');
    inp.oninput = () => { cq = inp.value; draw(); };
    $app.querySelectorAll('.chip').forEach(b => b.onclick = () => {
      if (b.dataset.star) { cstar = !cstar; renderConcepts(sid); return; }
      cstar = false; go('#concepts' + (b.dataset.s ? '/' + b.dataset.s : ''));
    });
  }

  function renderCard(id) {
    const c = CARD[id];
    if (!c) { go('#concepts'); return; }
    markSeen(id);
    const list = CARDS_BY_S[c.s], i = list.indexOf(c);
    const prev = list[i - 1], next = list[i + 1];
    const qn = (QUIZ_BY_S[c.s] || []).filter(q => q.card === c.id).length;
    $app.innerHTML = `
      <div class="sbar"><button class="iconbtn" id="back" aria-label="목록으로">${I.left}</button>
        <div class="mid">${esc(SUBJ[c.s].name)} · ${i + 1}/${list.length}</div>
        <button class="iconbtn ${S.star[c.id] ? 'on' : ''}" id="star" aria-label="즐겨찾기">${I.star}</button></div>
      <article class="concept">
        <div class="meta"><span class="tag sea">${esc(SUBJ[c.s].name)}</span><span class="tag">${esc(c.unit)}</span></div>
        <h2>${esc(c.t)}</h2>
        ${c.easy ? `<div class="sec easy"><div class="lab">${I.bulb.replace('<svg', '<svg width="18" height="18"')}쉽게 말하면</div>${md(c.easy)}</div>` : ''}
        ${c.ex ? `<div class="sec ex"><div class="lab">${I.ship.replace('<svg', '<svg width="18" height="18"')}예시로 보면</div>${md(c.ex)}</div>` : ''}
        ${c.pt ? `<div class="sec pt"><div class="lab">${I.flag.replace('<svg', '<svg width="18" height="18"')}시험 포인트</div>${md(c.pt)}</div>` : ''}
        <div class="src">완성형 교안 · ${esc(c.src || '')}</div>
      </article>
      ${qn ? `<div style="margin-top:14px"><button class="btn mint" id="cq">${I.quiz}이 개념 문제 ${qn}개 풀기</button></div>` : ''}
      <div class="navbtns">
        <button class="btn ghost" id="prev" ${prev ? '' : 'disabled'}>${I.left}이전</button>
        <button class="btn ghost" id="next" ${next ? '' : 'disabled'}>다음${I.right}</button>
      </div>`;
    document.getElementById('back').onclick = () => go('#concepts/' + c.s);
    document.getElementById('star').onclick = e => {
      if (S.star[c.id]) delete S.star[c.id]; else S.star[c.id] = 1; save();
      e.currentTarget.classList.toggle('on', !!S.star[c.id]); toast(S.star[c.id] ? '즐겨찾기에 담았어요' : '즐겨찾기에서 뺐어요');
    };
    if (prev) document.getElementById('prev').onclick = () => go('#card/' + encodeURIComponent(prev.id));
    if (next) document.getElementById('next').onclick = () => go('#card/' + encodeURIComponent(next.id));
    const cqb = document.getElementById('cq');
    if (cqb) cqb.onclick = () => startQuiz({ ids: (QUIZ_BY_S[c.s] || []).filter(q => q.card === c.id).map(q => q.id), back: '#card/' + encodeURIComponent(c.id) });
    // 좌우 밀기
    let x0 = null;
    const art = $app.querySelector('.concept');
    art.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
    art.addEventListener('touchend', e => {
      if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (dx < -60 && next) go('#card/' + encodeURIComponent(next.id));
      if (dx > 60 && prev) go('#card/' + encodeURIComponent(prev.id));
    });
  }

  /* ---------- quiz setup ---------- */
  let QSET = { subjects: [], count: 10, mode: 'smart' };
  function renderQuizSetup() {
    const pool = poolFor(QSET);
    const chips = D.subjects.map(s => `<button class="chip ${QSET.subjects.includes(s.id) ? 'on' : ''}" data-s="${s.id}">${esc(s.name)} <span class="small">${(QUIZ_BY_S[s.id] || []).length}</span></button>`).join('');
    const modes = [['smart', '골고루', '안 푼 문제·틀린 문제 먼저'], ['new', '안 푼 문제만', ''], ['wrong', '오답노트만', ''], ['eng', '무역영어만', '영문 조문 문제'], ['all', '전체 무작위', '']];
    $app.innerHTML = `
      <div class="top"><div class="grow"><h1>퀴즈</h1><div class="sub">OX · 4지선다 ${D.quiz.length}문항 · 틀리면 오답노트로</div></div></div>
      <div class="card"><h2>과목</h2><p class="muted small" style="margin:0 0 10px">아무것도 고르지 않으면 전체에서 내요.</p>
        <div class="chipwrap">${chips}</div></div>
      <div class="card"><h2>방식</h2>
        ${modes.map(([k, t, d]) => `<div class="optrow"><div class="t"><b>${t}</b>${d ? `<span>${d}</span>` : ''}</div>
          <button class="toggle-r chip ${QSET.mode === k ? 'on' : ''}" data-m="${k}">${QSET.mode === k ? '선택됨' : '선택'}</button></div>`).join('')}
        <div class="optrow"><div class="t"><b>문항 수</b></div>
          <div class="seg">${[10, 20, 30].map(n => `<button class="${QSET.count === n ? 'on' : ''}" data-n="${n}">${n}</button>`).join('')}</div></div>
      </div>
      <button class="btn" id="start" ${pool.length ? '' : 'disabled'}>${pool.length ? `${Math.min(pool.length, QSET.count)}문제 시작하기` : '해당하는 문제가 없어요'}</button>`;
    $app.querySelectorAll('.chip[data-s]').forEach(b => b.onclick = () => {
      const s = b.dataset.s; QSET.subjects = QSET.subjects.includes(s) ? QSET.subjects.filter(x => x !== s) : QSET.subjects.concat(s); renderQuizSetup();
    });
    $app.querySelectorAll('[data-m]').forEach(b => b.onclick = () => { QSET.mode = b.dataset.m; renderQuizSetup(); });
    $app.querySelectorAll('[data-n]').forEach(b => b.onclick = () => { QSET.count = +b.dataset.n; renderQuizSetup(); });
    document.getElementById('start').onclick = () => startQuiz(Object.assign({}, QSET));
  }
  function poolFor(o) {
    if (o.ids) return o.ids.map(id => Q[id]).filter(Boolean);
    let p = D.quiz;
    if (o.subjects && o.subjects.length) p = p.filter(q => o.subjects.includes(q.s));
    if (o.mode === 'new') p = p.filter(q => !S.qa[q.id]);
    if (o.mode === 'wrong') p = p.filter(q => S.wrong[q.id]);
    if (o.mode === 'eng') p = p.filter(q => q.eng);
    return p;
  }
  function startQuiz(o) {
    let pool = poolFor(o);
    if (!pool.length) { toast('풀 문제가 없어요'); return; }
    if (o.ids) pool = shuffle(pool);
    else if (o.mode === 'smart') {
      const w = shuffle(pool.filter(q => S.wrong[q.id])), n = shuffle(pool.filter(q => !S.qa[q.id] && !S.wrong[q.id])),
        r = shuffle(pool.filter(q => S.qa[q.id] && !S.wrong[q.id])).sort((a, b) => S.qa[a.id].last - S.qa[b.id].last);
      pool = w.slice(0, Math.ceil(o.count / 3)).concat(n, w.slice(Math.ceil(o.count / 3)), r);
    } else pool = shuffle(pool);
    const items = pool.slice(0, o.ids ? pool.length : o.count).map(q => ({ id: q.id, order: q.type === 'mc' ? shuffle([0, 1, 2, 3]) : null, picked: null }));
    QS = { items, i: 0, ok: 0, back: o.back || '#quiz' };
    go('#run');
  }

  /* ---------- quiz run ---------- */
  function renderRun() {
    if (!QS) { go('#quiz'); return; }
    if (QS.i >= QS.items.length) return renderDone();
    const it = QS.items[QS.i], q = Q[it.id];
    const answered = it.picked !== null;
    let body = '';
    if (q.type === 'ox') {
      const cls = v => !answered ? '' : (v === q.a ? 'ok' : (it.picked === v ? 'bad' : 'dim'));
      body = `<div class="ox"><button class="oxb o ${cls(true)}" data-v="1" aria-label="맞다">O</button><button class="oxb x ${cls(false)}" data-v="0" aria-label="틀리다">X</button></div>`;
    } else {
      body = '<div class="choices">' + it.order.map((oi, k) => {
        const cls = !answered ? '' : (oi === q.a ? 'ok' : (it.picked === oi ? 'bad' : 'dim'));
        return `<button class="choice ${cls}" data-o="${oi}"><span class="no">${'①②③④'[k]}</span><span>${md(q.o[oi])}</span></button>`;
      }).join('') + '</div>';
    }
    const right = answered && (q.type === 'ox' ? it.picked === q.a : it.picked === q.a);
    const fb = !answered ? '' : `<div class="fb ${right ? 'good' : 'bad'}">
        <div class="head">${right ? I.check : I.cross}${right ? '정답이에요!' : '아쉬워요, 오답노트에 담았어요'}</div>
        ${q.type === 'mc' && !right ? `<div><b>정답:</b> ${md(q.o[q.a])}</div>` : ''}${q.type === 'ox' && !right ? `<div><b>정답:</b> ${q.a ? 'O' : 'X'}</div>` : ''}
        <div>${md(q.why || '')}</div>
        ${q.card && CARD[q.card] ? `<button class="link" id="seecard">${I.book.replace('<svg', '<svg width="16" height="16"')}관련 개념 카드 보기</button>` : ''}</div>`;
    $app.innerHTML = `
      <div class="sbar"><button class="iconbtn" id="quit" aria-label="그만하기">${I.x}</button>
        <div class="prog"><i style="width:${100 * QS.i / QS.items.length}%"></i></div>
        <span class="tag sea">${QS.i + 1}/${QS.items.length}</span></div>
      <div class="qbox">
        <div class="meta"><span class="tag sea">${esc(SUBJ[q.s] ? SUBJ[q.s].name : '')}</span><span class="tag">${q.type === 'ox' ? 'OX' : '4지선다'}</span>${q.eng ? '<span class="tag lilac">무역영어</span>' : ''}${S.wrong[q.id] && !answered ? '<span class="tag coral">오답노트</span>' : ''}</div>
        <div class="qtext">${md(q.q)}</div>
        ${body}${fb}
      </div>
      ${answered ? `<div style="margin-top:14px"><button class="btn" id="nextq">${QS.i + 1 < QS.items.length ? '다음 문제' : '결과 보기'}${I.right}</button></div>` : ''}`;
    document.getElementById('quit').onclick = () => { const b = QS.back; QS = null; go(b); };
    if (!answered) {
      $app.querySelectorAll('.oxb').forEach(b => b.onclick = () => pick(b.dataset.v === '1'));
      $app.querySelectorAll('.choice').forEach(b => b.onclick = () => pick(+b.dataset.o));
    } else {
      document.getElementById('nextq').onclick = () => { QS.i++; renderRun(); window.scrollTo(0, 0); };
      const sc = document.getElementById('seecard');
      if (sc) sc.onclick = () => openCardSheet(q.card);
    }
  }
  function pick(v) {
    const it = QS.items[QS.i], q = Q[it.id];
    it.picked = v;
    const ok = v === q.a;
    if (ok) QS.ok++;
    record(q, ok);
    if (navigator.vibrate) try { navigator.vibrate(ok ? 15 : [30, 40, 30]); } catch (e) { }
    renderRun();
  }
  function renderDone() {
    const n = QS.items.length, ok = QS.ok, pct = Math.round(100 * ok / n);
    const wrongs = QS.items.filter(it => it.picked !== Q[it.id].a);
    $app.innerHTML = `
      <div class="done">${boat(96, pct >= 60 ? 'happy' : 'sad')}
        <h2>${pct >= 80 ? '최고예요!' : pct >= 60 ? '합격선 넘었어요!' : '오답노트로 한 번 더!'}</h2>
        <div class="score">${ok}<span style="font-size:26px;color:var(--ink3)">/${n}</span></div>
        <p class="muted">정답률 ${pct}% · 합격선은 평균 60점</p></div>
      ${wrongs.length ? `<div class="unit">틀린 문제</div><div class="list">${wrongs.map(it => {
        const q = Q[it.id]; return `<div class="item" data-q="${q.id}"><div class="t"><b>${esc(q.q.replace(/\*\*/g, '').slice(0, 60))}${q.q.length > 60 ? '…' : ''}</b><span>정답: ${q.type === 'ox' ? (q.a ? 'O' : 'X') : esc(q.o[q.a])}</span></div></div>`;
      }).join('')}</div>` : ''}
      <div class="stack" style="margin-top:16px">
        ${wrongs.length ? '<button class="btn coral" id="again">틀린 문제만 다시</button>' : ''}
        <button class="btn" id="more">새로 10문제 더</button>
        <button class="btn ghost" id="home">홈으로</button></div>`;
    $app.querySelectorAll('.item[data-q]').forEach(el => el.onclick = () => openQuestionSheet(el.dataset.q));
    const ag = document.getElementById('again');
    if (ag) ag.onclick = () => startQuiz({ ids: wrongs.map(it => it.id), back: QS.back });
    document.getElementById('more').onclick = () => startQuiz(Object.assign({}, QSET, { count: 10 }));
    document.getElementById('home').onclick = () => { QS = null; go('#home'); };
  }

  /* ---------- wrong note ---------- */
  let wsubj = '';
  function renderWrong() {
    const ids = wrongIds().sort((a, b) => S.wrong[b].ts - S.wrong[a].ts);
    const subs = [...new Set(ids.map(id => Q[id].s))];
    const shown = wsubj ? ids.filter(id => Q[id].s === wsubj) : ids;
    $app.innerHTML = `
      <div class="top"><div class="grow"><h1>오답노트</h1><div class="sub">틀린 문제는 여기 모여요 · 2번 연속 맞히면 졸업</div></div></div>
      ${ids.length ? `<div class="chips"><button class="chip ${!wsubj ? 'on' : ''}" data-s="">전체 ${ids.length}</button>${subs.map(s => `<button class="chip ${wsubj === s ? 'on' : ''}" data-s="${s}">${esc(SUBJ[s].name)} ${ids.filter(id => Q[id].s === s).length}</button>`).join('')}</div>
      <button class="btn coral" id="redo" style="margin-bottom:14px">${I.quiz}${shown.length > 20 ? '20' : shown.length}문제 다시 풀기</button>
      <div class="list">${shown.map(id => {
        const q = Q[id], c = S.wrong[id].c;
        return `<div class="item" data-q="${id}"><div class="t"><b>${esc(q.q.replace(/\*\*/g, '').slice(0, 70))}${q.q.length > 70 ? '…' : ''}</b><span>${esc(SUBJ[q.s].name)}${c ? ` · 연속 정답 ${c}/2` : ''}</span></div></div>`;
      }).join('')}</div>`
        : `<div class="empty">${boat(84)}<p>오답노트가 비어 있어요.<br>퀴즈에서 틀린 문제가 여기 쌓여요.</p></div>`}`;
    $app.querySelectorAll('.chip').forEach(b => b.onclick = () => { wsubj = b.dataset.s; renderWrong(); });
    $app.querySelectorAll('.item[data-q]').forEach(el => el.onclick = () => openQuestionSheet(el.dataset.q));
    const r = document.getElementById('redo');
    if (r) r.onclick = () => startQuiz({ ids: shuffle(shown).slice(0, 20), back: '#wrong' });
  }

  /* ---------- sheets ---------- */
  function openSheet(html, onMount) {
    const scrim = document.createElement('div'); scrim.className = 'scrim';
    const sh = document.createElement('div'); sh.className = 'sheet'; sh.setAttribute('role', 'dialog');
    sh.innerHTML = '<div class="grab"></div>' + html;
    const close = () => { scrim.remove(); sh.remove(); };
    scrim.onclick = close;
    document.body.append(scrim, sh);
    if (onMount) onMount(sh, close);
    return close;
  }
  function openCardSheet(id) {
    const c = CARD[id]; if (!c) return;
    markSeen(id);
    openSheet(`<article class="concept" style="box-shadow:none">
      <div class="meta"><span class="tag sea">${esc(SUBJ[c.s].name)}</span><span class="tag">${esc(c.unit)}</span></div>
      <h2>${esc(c.t)}</h2>
      ${c.easy ? `<div class="sec easy"><div class="lab">쉽게 말하면</div>${md(c.easy)}</div>` : ''}
      ${c.ex ? `<div class="sec ex"><div class="lab">예시로 보면</div>${md(c.ex)}</div>` : ''}
      ${c.pt ? `<div class="sec pt"><div class="lab">시험 포인트</div>${md(c.pt)}</div>` : ''}
      <div class="src">완성형 교안 · ${esc(c.src || '')}</div></article>
      <button class="btn ghost" id="sclose" style="margin-top:12px">닫기</button>`, (sh, close) => sh.querySelector('#sclose').onclick = close);
  }
  function openQuestionSheet(id) {
    const q = Q[id]; if (!q) return;
    const ans = q.type === 'ox' ? (q.a ? 'O' : 'X') : q.o[q.a];
    openSheet(`<div class="qbox" style="box-shadow:none">
      <div class="meta"><span class="tag sea">${esc(SUBJ[q.s].name)}</span><span class="tag">${q.type === 'ox' ? 'OX' : '4지선다'}</span></div>
      <div class="qtext">${md(q.q)}</div>
      ${q.type === 'mc' ? `<div class="choices">${q.o.map((o, k) => `<div class="choice ${k === q.a ? 'ok' : 'dim'}"><span class="no">${'①②③④'[k]}</span><span>${md(o)}</span></div>`).join('')}</div>` : ''}
      <div class="fb good"><div class="head">${I.check}정답: ${md(ans)}</div><div>${md(q.why || '')}</div>
      ${q.card && CARD[q.card] ? `<button class="link" id="sc">관련 개념 카드 보기</button>` : ''}</div></div>
      <button class="btn ghost" id="sclose" style="margin-top:12px">닫기</button>`, (sh, close) => {
      sh.querySelector('#sclose').onclick = close;
      const sc = sh.querySelector('#sc'); if (sc) sc.onclick = () => { close(); openCardSheet(q.card); };
    });
  }
  function openSettings() {
    const th = S.set.theme;
    openSheet(`<h2 style="font-size:22px;margin:0 0 6px">설정</h2>
      <div class="card" style="margin-top:10px">
        <div class="optrow"><div class="t"><b>화면 테마</b></div><div class="seg">
          ${[['system', '기기 설정'], ['light', '밝게'], ['dark', '어둡게']].map(([k, t]) => `<button class="${th === k ? 'on' : ''}" data-t="${k}">${t}</button>`).join('')}</div></div>
        <div class="optrow"><div class="t"><b>시험일</b><span>D-day 계산에 써요</span></div><input id="exam" type="date" value="${esc(S.set.exam)}" style="border:0;background:var(--soft);border-radius:12px;padding:8px"></div>
      </div>
      <div class="card"><h2>기록 옮기기</h2><p class="muted small" style="margin:0 0 8px">기록은 이 기기의 브라우저에 저장돼요. 다른 기기로 옮길 때 아래 글을 복사해서 그 기기의 같은 칸에 붙여넣으세요.</p>
        <textarea class="io" id="io" aria-label="기록 데이터"></textarea>
        <div class="row2" style="margin-top:10px"><button class="btn ghost" id="exp">내보내기</button><button class="btn ghost" id="imp">가져오기</button></div></div>
      <div class="card"><div class="optrow"><div class="t"><b>기록 초기화</b><span>본 카드·푼 문제·오답노트를 모두 지워요</span></div><button class="chip" id="reset" style="color:var(--coral-d)">초기화</button></div></div>
      <p class="muted small" style="text-align:center">카드 ${D.cards.length}장 · 문제 ${D.quiz.length}개 · 완성형 교안 기반 · 실제 기출 아님</p>`, (sh, close) => {
      sh.querySelectorAll('[data-t]').forEach(b => b.onclick = () => { S.set.theme = b.dataset.t; save(); applyTheme(); sh.querySelectorAll('[data-t]').forEach(x => x.classList.toggle('on', x === b)); });
      sh.querySelector('#exam').onchange = e => { if (e.target.value) { S.set.exam = e.target.value; save(); render(); } };
      sh.querySelector('#exp').onclick = async () => {
        const txt = JSON.stringify(S); const ta = sh.querySelector('#io'); ta.value = txt; ta.select();
        try { await navigator.clipboard.writeText(txt); toast('복사했어요'); } catch (e) { toast('글을 길게 눌러 복사하세요'); }
      };
      sh.querySelector('#imp').onclick = () => {
        try { const v = JSON.parse(sh.querySelector('#io').value); if (!v || !v.qa) throw 0; S = Object.assign(fresh(), v); save(); applyTheme(); close(); render(); toast('기록을 가져왔어요'); }
        catch (e) { toast('붙여넣은 글이 올바르지 않아요'); }
      };
      let armed = false;
      sh.querySelector('#reset').onclick = e => {
        if (!armed) { armed = true; e.target.textContent = '한 번 더 누르면 삭제'; return; }
        const set = S.set; S = fresh(); S.set = set; save(); close(); render(); toast('기록을 지웠어요');
      };
    });
  }

  /* ---------- start ---------- */
  applyTheme();
  render();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('sw.js').catch(() => { }));
  }
})();
