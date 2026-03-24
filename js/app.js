/* =============================================
   MY UPN — Application Logic
   ============================================= */

/* ===== STATE ===== */
let currentSub = null;
let previousPage = null;

/* ===== THEME TOGGLE ===== */
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon('dark');
  }
}

function toggleTheme() {
  const root = document.documentElement;
  const newTheme = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icons = document.querySelectorAll('.theme-toggle-icon');
  icons.forEach(icon => {
    if (theme === 'dark') {
      icon.innerHTML = `<path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" fill="currentColor"/>`;
    } else {
      icon.innerHTML = `<circle cx="12" cy="12" r="5" fill="currentColor"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>`;
    }
  });
}

/* ===== SPA NAVIGATION ===== */
const routes = ['dashboard', 'layanan', 'akademik', 'profil'];

function navigateTo(page) {
  if (currentSub) closeSubPage();
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  
  const navContainer = document.getElementById('bottom-nav');
  document.querySelectorAll('.nav-item').forEach((n, idx) => {
    const isActive = n.dataset.page === page;
    n.classList.toggle('active', isActive);
    if (isActive && navContainer) {
      navContainer.dataset.active = idx;
    }
  });

  window.scrollTo(0, 0);
  // Re-observe new page elements for scroll reveal
  requestAnimationFrame(() => observeReveals());
}

function updateNavIndicator() {
  const activeItem = document.querySelector('.nav-item.active');
  const navContainer = document.getElementById('bottom-nav');
  if (activeItem && navContainer) {
    const idx = routes.indexOf(activeItem.dataset.page);
    if(idx !== -1) navContainer.dataset.active = idx;
  }
}

/* ===== SUB-PAGE NAVIGATION ===== */
function openSubPage(id) {
  previousPage = document.querySelector('.page.active');
  if (previousPage) previousPage.classList.remove('active');
  document.getElementById('bottom-nav').classList.remove('show');
  document.getElementById(id).classList.add('active');
  currentSub = id;
  window.scrollTo(0, 0);
  requestAnimationFrame(() => observeReveals());
}

function closeSubPage() {
  if (currentSub) document.getElementById(currentSub).classList.remove('active');
  currentSub = null;
  if (previousPage) {
    previousPage.classList.add('active');
    document.getElementById('bottom-nav').classList.add('show');
  }
}

/* ===== LOGIN / LOGOUT ===== */
function doLogin() {
  document.getElementById('page-login').classList.remove('active');
  navigateTo('dashboard');
  document.getElementById('bottom-nav').classList.add('show');
  updateGreeting();
  setTimeout(updateNavIndicator, 50);
}

function doLogout() {
  document.getElementById('bottom-nav').classList.remove('show');
  document.querySelectorAll('.page,.sub-page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-login').classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector('[data-page="dashboard"]').classList.add('active');
  currentSub = null;
  updateNavIndicator();
}

/* ===== TOGGLE PASSWORD ===== */
function togglePassword() {
  const inp = document.getElementById('password-input');
  const btn = document.getElementById('toggle-pw');
  if (inp.type === 'password') {
    inp.type = 'text';
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>';
  } else {
    inp.type = 'password';
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>';
  }
}

/* ===== HELP MODAL ===== */
function openHelp() { document.getElementById('modal-help').classList.add('show'); }
function closeHelp(e) { if (e.target === e.currentTarget) document.getElementById('modal-help').classList.remove('show'); }

/* ===== DYNAMIC GREETING ===== */
function updateGreeting() {
  const h = new Date().getHours();
  let g;
  if (h >= 5 && h < 11) g = 'Selamat Pagi, Rizky';
  else if (h >= 11 && h < 15) g = 'Selamat Siang, Rizky';
  else if (h >= 15 && h < 18) g = 'Selamat Sore, Rizky';
  else g = 'Selamat Malam, Rizky';
  document.getElementById('greeting-text').textContent = g;
}

/* =============================================
   INTERSECTION OBSERVER — Scroll Reveal
   ============================================= */
let revealObserver;

function initRevealObserver() {
  revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
}

function observeReveals() {
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    revealObserver.observe(el);
  });
}

/* =============================================
   RENDER FUNCTIONS
   ============================================= */

/* ----- Tasks ----- */
function renderTasks() {
  const tasks = [
    { title: 'Tugas Basis Data', desc: 'Coding web dengan bahasa C++...', due: '28/03/2026', status: 'Belum' },
    { title: 'Tugas PWeb', desc: 'Coding web dengan bahasa HTML CSS JS...', due: '01/04/2026', status: 'Belum' },
    { title: 'Tugas Algo', desc: 'Tidak ada tugas. Selamat istirahat!', due: '-', status: 'Selesai' }
  ];
  const c = document.getElementById('task-scroll');
  if (!c) return;
  c.innerHTML = '';
  tasks.forEach(t => {
    const el = document.createElement('div');
    el.className = 'task-card';
    el.onclick = () => alert(t.title + ': ' + t.desc);
    el.innerHTML = `<h4>${t.title}</h4><p>${t.desc}</p><div class="task-meta">${t.status === 'Selesai' ? '<span style="color:var(--green-3)">Selesai</span>' : '<span class="task-due">Deadline: ' + t.due + '</span>'}</div>`;
    c.appendChild(el);
  });
}

/* ----- Announcements ----- */
function renderAnnouncements() {
  const anns = [
    { date: '20 Maret 2026', title: 'Pembayaran UKT dimulai dari tanggal...', desc: 'Selengkapnya' },
    { date: '18 Maret 2026', title: 'Batas pengisian KRS Semester 5', desc: '31 Juli 2026 — Pastikan KRS sudah disetujui' }
  ];
  const c = document.getElementById('ann-scroll');
  if (!c) return;
  c.innerHTML = '';
  anns.forEach(a => {
    const el = document.createElement('div');
    el.className = 'ann-card';
    el.onclick = () => alert(a.title);
    el.innerHTML = `<div class="ann-date">${a.date}</div><h4>${a.title}</h4><p>${a.desc}</p>`;
    c.appendChild(el);
  });
}

/* ----- Services Grid ----- */
function renderServices() {
  const svcs = [
    { id: 'sub-jadwal', title: 'Jadwal Kelas', badge: 'Hari ini 2', badgeColor: 'var(--green-1)', badgeText: 'var(--green-4)', bg: 'var(--green-1)', fill: 'var(--green-3)', icon: '<path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/>' },
    { id: 'sub-kehadiran', title: 'Daftar Kehadiran', badge: '89%', badgeColor: 'var(--yellow-1)', badgeText: '#92400e', bg: 'rgba(250,204,21,.12)', fill: '#eab308', icon: '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>' },
    { id: 'sub-mk-tersedia', title: 'MK Tersedia', badge: '', bg: 'rgba(59,130,246,.1)', fill: 'var(--blue-500)', icon: '<path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z"/>' },
    { id: 'sub-mk-diambil', title: 'MK Diambil', badge: '', bg: 'var(--purple-1)', fill: '#8b5cf6', icon: '<path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/>' },
    { id: null, title: 'Kalender Akademik', badge: '', bg: 'var(--peach-1)', fill: '#f97316', icon: '<path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/>' },
    { id: null, title: 'Kartu Hasil Studi', badge: 'Sem 3', badgeColor: 'rgba(59,130,246,.1)', badgeText: '#2563eb', bg: 'rgba(6,182,212,.1)', fill: '#06b6d4', icon: '<path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>' },
    { id: 'sub-pembayaran', title: 'Riwayat Pembayaran', badge: '', bg: 'rgba(236,72,153,.1)', fill: '#ec4899', icon: '<path d="M20 4H4c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.11-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>' },
    { id: null, title: 'Riwayat IPS', badge: '', bg: 'rgba(20,184,166,.1)', fill: '#14b8a6', icon: '<path d="M3.5 18.49l6-6.01 4 4L22 6.92l-1.41-1.41-7.09 7.97-4-4L2 16.99z"/>' }
  ];
  const grid = document.getElementById('service-section');
  if (!grid) return;
  grid.innerHTML = '<div class="service-grid" id="svc-grid"></div>';
  const g = document.getElementById('svc-grid');
  svcs.forEach(s => {
    const el = document.createElement('div');
    el.className = 'service-card reveal';
    el.onclick = () => s.id ? openSubPage(s.id) : alert(s.title + ' — Segera hadir');
    let badgeHtml = '';
    if (s.badge) badgeHtml = `<span class="svc-badge" style="background:${s.badgeColor || 'var(--green-1)'};color:${s.badgeText || 'var(--green-4)'}">${s.badge}</span>`;
    el.innerHTML = `<div class="svc-icon" style="background:${s.bg}"><svg viewBox="0 0 24 24" style="fill:${s.fill}">${s.icon}</svg></div><h4>${s.title}</h4>${badgeHtml}`;
    g.appendChild(el);
  });
}

/* ----- Akademik MK List ----- */
function renderAkademik() {
  const mks = [
    { code: 'BD-301', name: 'Basis Data', sks: 3, dosen: 'Bu Sari Dewi, M.Kom', grade: 'A', cls: 'grade-a' },
    { code: 'AP-401', name: 'Algoritma & Pemrograman', sks: 4, dosen: 'Pak Budi, S.T., M.T.', grade: 'A-', cls: 'grade-a' },
    { code: 'SO-302', name: 'Sistem Operasi', sks: 3, dosen: 'Pak Ahmad Fauzi', grade: 'B+', cls: 'grade-b' },
    { code: 'JK-201', name: 'Jaringan Komputer', sks: 3, dosen: 'Bu Rina, M.Cs.', grade: 'B', cls: 'grade-b' },
    { code: 'PW-401', name: 'Pemrograman Web', sks: 4, dosen: 'Pak Denny, M.Kom.', grade: 'A', cls: 'grade-a' },
    { code: 'MAT-201', name: 'Matematika Diskrit', sks: 3, dosen: 'Pak Heru, M.Si.', grade: 'C+', cls: 'grade-c' },
    { code: 'APSI-302', name: 'Analisis Perancangan SI', sks: 2, dosen: 'Bu Mega, M.M.', grade: 'A-', cls: 'grade-a' }
  ];
  const list = document.getElementById('mk-list');
  if (!list) return;
  list.innerHTML = '';
  let totalSks = 0;
  mks.forEach(m => {
    totalSks += m.sks;
    const el = document.createElement('div');
    el.className = 'mk-card reveal';
    el.innerHTML = `<span class="mk-code-pill">${m.code}</span><div class="mk-info"><h4>${m.name}</h4><p>${m.sks} SKS · ${m.dosen}</p></div><span class="mk-grade ${m.cls}">${m.grade}</span>`;
    list.appendChild(el);
  });
  const sum = document.getElementById('akd-summary');
  if (sum) sum.innerHTML = `<p>Total: ${mks.length} Mata Kuliah · ${totalSks} SKS · IPS: 3.85</p>`;
}

/* ----- Sub: Jadwal Kelas ----- */
function renderJadwal() {
  const data = [
    { hari: 'Senin', items: [{ mk: 'Basis Data', jam: '08.45 - 10.45', ruang: 'Gd. D-301', dosen: 'Bu Sari Dewi' }, { mk: 'Algo & Pemrograman', jam: '13.00 - 15.00', ruang: 'Lab Komp-2', dosen: 'Pak Budi' }] },
    { hari: 'Selasa', items: [{ mk: 'Sistem Operasi', jam: '08.00 - 10.00', ruang: 'Gd. B-201', dosen: 'Pak Ahmad' }] },
    { hari: 'Rabu', items: [{ mk: 'Jaringan Komputer', jam: '10.00 - 12.00', ruang: 'Lab Jaringan', dosen: 'Bu Rina' }, { mk: 'Pemrograman Web', jam: '13.00 - 15.30', ruang: 'Lab Komp-1', dosen: 'Pak Denny' }] },
    { hari: 'Kamis', items: [{ mk: 'Matematika Diskrit', jam: '08.00 - 10.00', ruang: 'Gd. A-102', dosen: 'Pak Heru' }] },
    { hari: 'Jumat', items: [{ mk: 'Analisis Perancangan SI', jam: '08.00 - 09.30', ruang: 'Gd. C-305', dosen: 'Bu Mega' }] }
  ];
  const c = document.getElementById('jadwal-content');
  if (!c) return;
  let html = '';
  data.forEach(d => {
    html += `<div class="card reveal" style="padding:14px;margin-bottom:12px"><h4 style="font-family:Sora;font-size:14px;font-weight:600;color:var(--gray-800);margin-bottom:8px">${d.hari}</h4>`;
    d.items.forEach(it => {
      html += `<div class="sched-item"><div class="sched-dot"></div><div class="sched-content"><h4>${it.mk}</h4><p>${it.ruang} · ${it.dosen}</p></div><div class="sched-time-badge">${it.jam}</div></div>`;
    });
    html += '</div>';
  });
  c.innerHTML = html;
}

/* ----- Sub: Kehadiran ----- */
function renderKehadiran() {
  const data = [
    { mk: 'Basis Data', code: 'BD-301', pct: 97, hadir: '14/14' },
    { mk: 'Algo & Pemrograman', code: 'AP-401', pct: 91, hadir: '13/14' },
    { mk: 'Sistem Operasi', code: 'SO-302', pct: 86, hadir: '12/14' },
    { mk: 'Jaringan Komputer', code: 'JK-201', pct: 93, hadir: '13/14' },
    { mk: 'Pemrograman Web', code: 'PW-401', pct: 100, hadir: '14/14' },
    { mk: 'Matematika Diskrit', code: 'MAT-201', pct: 79, hadir: '11/14' },
    { mk: 'Analisis Perancangan SI', code: 'APSI-302', pct: 93, hadir: '13/14' }
  ];
  const c = document.getElementById('kehadiran-content');
  if (!c) return;
  let html = '<div class="card" style="padding:16px">';
  data.forEach(d => {
    const color = d.pct >= 90 ? 'var(--green-3)' : d.pct >= 80 ? '#eab308' : 'var(--red-500)';
    html += `<div class="att-item"><div class="att-top"><h4>${d.mk}</h4><span style="color:${color}">${d.pct}%</span></div><div class="att-bar"><div class="att-fill" style="width:${d.pct}%;background:${color}"></div></div><div class="att-meta">${d.code} · Kehadiran ${d.hadir}</div></div>`;
  });
  html += '</div>';
  c.innerHTML = html;
}

/* ----- Sub: MK Tersedia ----- */
function renderMKTersedia() {
  const semesters = [
    { sem: 'Semester 1', mks: [{ code: 'IF21101', name: 'Pengantar Informatika', sks: 3 }, { code: 'IF21102', name: 'Kalkulus I', sks: 3 }, { code: 'IF21103', name: 'Fisika Dasar', sks: 3 }] },
    { sem: 'Semester 2', mks: [{ code: 'IF21201', name: 'Pemrograman Dasar', sks: 4 }, { code: 'IF21202', name: 'Kalkulus II', sks: 3 }, { code: 'IF21203', name: 'Aljabar Linear', sks: 3 }] }
  ];
  const c = document.getElementById('mk-tersedia-content');
  if (!c) return;
  let html = '';
  semesters.forEach(s => {
    html += `<div class="card reveal" style="padding:14px;margin-bottom:12px"><h4 style="font-family:Sora;font-size:14px;font-weight:600;margin-bottom:10px">${s.sem}</h4><table class="mk-table"><thead><tr><th>Kode</th><th>Mata Kuliah</th><th>SKS</th></tr></thead><tbody>`;
    s.mks.forEach(m => { html += `<tr><td class="code">${m.code}</td><td>${m.name}</td><td style="text-align:center">${m.sks}</td></tr>`; });
    html += '</tbody></table></div>';
  });
  c.innerHTML = html;
}

/* ----- Sub: MK Diambil ----- */
function renderMKDiambil() {
  const mks = [
    { code: 'BD-301', name: 'Basis Data', sks: 3, dosen: 'Bu Sari Dewi, M.Kom', jam: 'Senin 08.45-10.45', ruang: 'Gd. D-301' },
    { code: 'AP-401', name: 'Algoritma & Pemrograman', sks: 4, dosen: 'Pak Budi, S.T., M.T.', jam: 'Senin 13.00-15.00', ruang: 'Lab Komp-2' },
    { code: 'SO-302', name: 'Sistem Operasi', sks: 3, dosen: 'Pak Ahmad Fauzi', jam: 'Selasa 08.00-10.00', ruang: 'Gd. B-201' },
    { code: 'JK-201', name: 'Jaringan Komputer', sks: 3, dosen: 'Bu Rina, M.Cs.', jam: 'Rabu 10.00-12.00', ruang: 'Lab Jaringan' },
    { code: 'PW-401', name: 'Pemrograman Web', sks: 4, dosen: 'Pak Denny, M.Kom.', jam: 'Rabu 13.00-15.30', ruang: 'Lab Komp-1' },
    { code: 'MAT-201', name: 'Matematika Diskrit', sks: 3, dosen: 'Pak Heru, M.Si.', jam: 'Kamis 08.00-10.00', ruang: 'Gd. A-102' },
    { code: 'APSI-302', name: 'Analisis Perancangan SI', sks: 2, dosen: 'Bu Mega, M.M.', jam: 'Jumat 08.00-09.30', ruang: 'Gd. C-305' }
  ];
  const c = document.getElementById('mk-diambil-content');
  if (!c) return;
  let html = '';
  mks.forEach(m => {
    html += `<div class="card reveal" style="padding:14px;margin-bottom:10px"><div style="display:flex;align-items:center;gap:10px;margin-bottom:6px"><span class="mk-code-pill">${m.code}</span><span style="font-family:Sora;font-size:14px;font-weight:600;color:var(--gray-800)">${m.name}</span></div><p style="font-size:12px;color:var(--gray-500)">${m.sks} SKS · ${m.dosen}</p><p style="font-size:12px;color:var(--gray-500);margin-top:2px">${m.jam} · ${m.ruang}</p></div>`;
  });
  c.innerHTML = html;
}

/* ----- Sub: Pembayaran ----- */
function renderPembayaran() {
  const pays = [
    { title: 'UKT Gasal 2024/2025', amount: 'Rp 4.200.000', date: '12 Agt 2024', via: 'Bank Mandiri', status: 'Lunas' },
    { title: 'UKT Genap 2023/2024', amount: 'Rp 4.200.000', date: '15 Feb 2024', via: 'BNI', status: 'Lunas' },
    { title: 'UKT Gasal 2023/2024', amount: 'Rp 4.200.000', date: '10 Agt 2023', via: 'Bank Mandiri', status: 'Lunas' },
    { title: 'UKT Genap 2022/2023', amount: 'Rp 3.800.000', date: '20 Jan 2023', via: 'BRI', status: 'Lunas' }
  ];
  const c = document.getElementById('pay-content');
  if (!c) return;
  let html = '';
  pays.forEach(p => {
    html += `<div class="card reveal" style="padding:14px;margin-bottom:10px"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px"><span style="font-family:Sora;font-size:14px;font-weight:600;color:var(--gray-800)">${p.title}</span><span style="font-size:11px;padding:3px 10px;border-radius:6px;background:var(--green-1);color:var(--green-4);font-family:Sora;font-weight:600">${p.status}</span></div><div style="font-family:Sora;font-size:20px;font-weight:700;color:var(--green-3);margin-bottom:4px">${p.amount}</div><p style="font-size:12px;color:var(--gray-500)">${p.date} · ${p.via}</p></div>`;
  });
  c.innerHTML = html;
}

/* =============================================
   INITIALIZATION
   ============================================= */
document.addEventListener('DOMContentLoaded', () => {
  // Init scroll reveal observer
  initRevealObserver();

  // Render all content
  renderTasks();
  renderAnnouncements();
  renderServices();
  renderAkademik();
  renderJadwal();
  renderKehadiran();
  renderMKTersedia();
  renderMKDiambil();
  renderPembayaran();
  updateGreeting();

  // Initialize Theme
  initTheme();

  // Initialize nav indicator position
  setTimeout(updateNavIndicator, 100);
  window.addEventListener('resize', updateNavIndicator);

  // Observe initial reveals
  observeReveals();
});
