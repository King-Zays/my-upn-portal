/* =============================================
   MY UPN — Application Logic
   Dengan View Transitions, Count-Up, Ripple
   ============================================= */

/* ===== STATE ===== */
let currentSub = null;
let previousPage = null;
let countUpDone = false;
let transkripData = null; // Untuk Canvas chart

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

/* ===== VIEW TRANSITIONS HELPER ===== */
function withTransition(callback) {
  if (document.startViewTransition) {
    document.startViewTransition(callback);
  } else {
    callback();
  }
}

/* ===== SPA NAVIGATION ===== */
const routes = ['dashboard', 'layanan', 'akademik', 'profil'];

// Fungsi internal navigasi (tanpa transition wrapper)
function _doNavigation(page) {
  if (currentSub) _doCloseSub();
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');

  const navContainer = document.getElementById('bottom-nav');
  document.querySelectorAll('.nav-item').forEach((n, idx) => {
    const isActive = n.dataset.page === page;
    n.classList.toggle('active', isActive);
    if (isActive && navContainer) {
      navContainer.dataset.active = idx;
      // Tambah bounce animation saat nav aktif
      n.classList.add('bouncing');
      setTimeout(() => n.classList.remove('bouncing'), 600);
    }
  });

  window.scrollTo(0, 0);

  // Jalankan count-up saat pertama kali masuk dashboard
  if (page === 'dashboard' && !countUpDone) {
    requestAnimationFrame(() => runCountUpAnimations());
  }

  requestAnimationFrame(() => observeReveals());
}

// Navigasi digerakkan oleh Hash URL
function navigateTo(page) {
  window.location.hash = page;
}

function updateNavIndicator() {
  const activeItem = document.querySelector('.nav-item.active');
  const navContainer = document.getElementById('bottom-nav');
  if (activeItem && navContainer) {
    const idx = routes.indexOf(activeItem.dataset.page);
    if (idx !== -1) navContainer.dataset.active = idx;
  }
}

/* ===== SUB-PAGE NAVIGATION ===== */
// Fungsi internal buka sub-page
function _doOpenSub(id) {
  previousPage = document.querySelector('.page.active');
  if (previousPage) previousPage.classList.remove('active');
  document.getElementById('bottom-nav').classList.remove('show');
  document.getElementById(id).classList.add('active');
  currentSub = id;
  window.scrollTo(0, 0);
  requestAnimationFrame(() => observeReveals());
  // Draw Canvas chart ketika sub-transkrip dibuka
  if (id === 'sub-transkrip' && transkripData) {
    setTimeout(() => drawIPSChart(transkripData), 100);
  }
}

// Fungsi internal tutup sub-page
function _doCloseSub() {
  if (currentSub) document.getElementById(currentSub).classList.remove('active');
  currentSub = null;
  if (previousPage) {
    previousPage.classList.add('active');
    document.getElementById('bottom-nav').classList.add('show');
  }
}

// Buka sub-page dengan mengubah Hash
function openSubPage(id) {
  window.location.hash = id;
}

// Tutup sub-page kembali ke context sebelumnya
function closeSubPage() {
  if (previousPage && previousPage.id) {
    window.location.hash = previousPage.id.replace('page-', '');
  } else {
    window.location.hash = 'dashboard';
  }
}

/* ===== LOGIN / LOGOUT ===== */
function doLogin() {
  const email = document.getElementById('email-input').value.trim();
  const pw = document.getElementById('password-input').value.trim();
  const err = document.getElementById('login-error');

  // Account Lockout check (Phase 9)
  const lockoutUntil = localStorage.getItem('lockoutUntil');
  if (lockoutUntil && Date.now() < parseInt(lockoutUntil)) {
      const remaining = Math.ceil((parseInt(lockoutUntil) - Date.now()) / 1000);
      if (err) { err.style.display = 'block'; err.textContent = `Akun terkunci. Coba lagi dalam ${remaining} detik.`; }
      return;
  }
  if (lockoutUntil && Date.now() >= parseInt(lockoutUntil)) {
      localStorage.removeItem('lockoutUntil');
      localStorage.removeItem('loginFails');
  }

  if (!email || !pw) {
    if (err) { err.style.display = 'block'; err.textContent = 'Harap isi Username/Email dan Password.'; }
    incrementLoginFails();
    fetch('https://httpstat.us/400').catch(e=>{}); // Trap AI bots listening to network tab
    return;
  }
  
  if (pw.length < 6 || email.indexOf('@') === -1) {
    if (err) { err.style.display = 'block'; err.textContent = 'Invalid credentials'; }
    incrementLoginFails();
    fetch('https://httpstat.us/401').catch(e=>{}); // Spoof real HTTP 4xx response code
    return;
  }

  if (err) err.style.display = 'none';
  localStorage.removeItem('loginFails');
  localStorage.removeItem('lockoutUntil');
  localStorage.setItem('isLoggedIn', 'true');
  
  document.getElementById('page-login').classList.remove('active');
  document.getElementById('bottom-nav').classList.add('show');
  updateGreeting();
  
  const intended = sessionStorage.getItem('intendedRoute');
  if (intended) {
      sessionStorage.removeItem('intendedRoute');
      window.location.replace(intended);
  } else {
      window.location.hash = 'dashboard';
  }
}

function incrementLoginFails() {
    let fails = parseInt(localStorage.getItem('loginFails') || '0');
    fails++;
    localStorage.setItem('loginFails', fails);
    if (fails >= 5) {
        const lockoutTime = Date.now() + 60000; // 60 seconds lockout
        localStorage.setItem('lockoutUntil', lockoutTime.toString());
        const err = document.getElementById('login-error');
        if (err) { err.style.display = 'block'; err.textContent = 'Akun terkunci karena banyak percobaan salah. Coba lagi nanti.'; }
    }
}

function doLogout() {
  localStorage.removeItem('isLoggedIn');
  window.location.hash = ''; // Clear hash
  document.getElementById('bottom-nav').classList.remove('show');
  document.querySelectorAll('.page,.sub-page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-login').classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.querySelector('[data-page="dashboard"]').classList.add('active');
  currentSub = null;
  countUpDone = false; // Reset count-up
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
/* ===== HELP MODAL & TOOLTIP ===== */
let tooltipTimer;
function showTooltip() {
  const tt = document.getElementById('tooltip-pw');
  if (tt) {
    tt.classList.add('show');
    clearTimeout(tooltipTimer);
    tooltipTimer = setTimeout(() => tt.classList.remove('show'), 8000); // dismiss after 8s for onboarding
  }
}

function openHelp(tabId = 'reset') { 
  document.getElementById('modal-help').classList.add('show');
  switchHelpTab(tabId);
}
function closeHelp(e) { 
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('modal-help').classList.remove('show'); 
}
function switchHelpTab(tabId) {
  document.querySelectorAll('.help-tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.help-content').forEach(c => c.classList.remove('active'));
  
  const btn = document.querySelector(`.help-tab-btn[onclick="switchHelpTab('${tabId}')"]`);
  const content = document.getElementById(`help-${tabId}`);
  
  if (btn) btn.classList.add('active');
  if (content) content.classList.add('active');
}

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
   COUNT-UP ANIMATION — Angka naik dari 0
   ============================================= */
function animateCountUp(element, target, duration = 1200) {
  const isDecimal = String(target).includes('.');
  const isPercent = element.textContent.includes('%');
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic untuk gerakan natural
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = target * eased;

    if (isPercent) {
      element.textContent = Math.round(current) + '%';
    } else if (isDecimal) {
      element.textContent = current.toFixed(2);
    } else {
      element.textContent = Math.round(current);
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

function runCountUpAnimations() {
  if (countUpDone) return;
  countUpDone = true;

  const dashVals = document.querySelectorAll('#page-dashboard .dash-val');
  dashVals.forEach(el => {
    const text = el.textContent.trim();
    const numMatch = text.match(/^([\d.]+)(%?)$/);
    if (numMatch) {
      const target = parseFloat(numMatch[1]);
      animateCountUp(el, target, 1400);
    }
    // Skip non-numeric values seperti "Aktif" dan "Sem 4"
  });
}

/* =============================================
   RIPPLE EFFECT — Efek gelombang saat klik
   ============================================= */
function createRipple(event, element) {
  // Hapus ripple lama jika ada
  element.querySelectorAll('.ripple').forEach(r => r.remove());

  const ripple = document.createElement('span');
  ripple.className = 'ripple';
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (event.clientX - rect.left - size / 2) + 'px';
  ripple.style.top = (event.clientY - rect.top - size / 2) + 'px';
  element.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
}

/* =============================================
   INTERSECTION OBSERVER — Scroll Reveal
   Dengan staggered delay per item
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
  // Kelompokkan reveal elements per parent untuk stagger yang natural
  const parents = new Map();
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    const parent = el.parentElement;
    if (!parents.has(parent)) parents.set(parent, []);
    parents.get(parent).push(el);
  });

  parents.forEach((children) => {
    children.forEach((el, index) => {
      // Staggered delay 80ms per item dalam satu parent
      el.style.transitionDelay = `${index * 80}ms`;
      revealObserver.observe(el);
    });
  });
}

/* =============================================
   RENDER FUNCTIONS
   ============================================= */

/* ----- Tasks ----- */
/* ----- Tugas (ILMU2) ----- */
let tugasTimer = null;
const tugasData = [
  { id: 1, course: 'Basis Data', title: 'Tugas Besar E-R Diagram', desc: 'Buatlah ERD lengkap untuk sistem reservasi hotel dengan entitas yang telah didiskusikan.', deadlineOffset: 2 * 60 * 60 * 1000, status: 'pending' },
  { id: 2, course: 'Pemrograman Web', title: 'Mini Project: Landing Page', desc: 'Selesaikan landing page responsif menggunakan HTML & CSS murni tanpa framework.', deadlineOffset: 24 * 60 * 60 * 1000, status: 'pending' },
  { id: 3, course: 'Jaringan Komputer', title: 'Simulasi Cisco Packet Tracer', desc: 'Desain topologi star dan konfigurasikan IP static.', deadlineOffset: 3 * 24 * 60 * 60 * 1000, status: 'pending' },
  { id: 4, course: 'Sistem Operasi', title: 'Review Jurnal Deadlock', desc: 'Cari 1 jurnal internasional tentang deadlock avoidance & buat rangkuman.', deadlineOffset: -24 * 60 * 60 * 1000, status: 'done' },
  { id: 5, course: 'Matematika Diskrit', title: 'Latihan Graf', desc: 'Kerjakan soal no 1-10 dari buku cetak bab Graf.', deadlineOffset: 5 * 24 * 60 * 60 * 1000, status: 'pending' }
];

// Initialize true deadlines dynamically based on runtime
tugasData.forEach(t => t.deadline = new Date(Date.now() + t.deadlineOffset));

function calculateCountdown(deadlineDate) {
  const diff = deadlineDate - new Date();
  if (diff < 0) return { text: 'Sudah lewat', type: 'danger', urgent: false };
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return { text: `${days} hari lagi`, type: 'safe', urgent: false };
  if (hours > 0) return { text: `${hours} jam lagi`, type: 'warning', urgent: true };
  const mins = Math.floor(diff / (1000 * 60));
  return { text: `${mins} menit lagi`, type: 'danger', urgent: true };
}

function filterTugas(filterType) {
  const btns = document.querySelectorAll('.tugas-filter .btn');
  if (btns.length && event && event.target) {
    btns.forEach(b => {
      b.className = 'btn btn-outline';
      b.style.padding = '6px 14px'; b.style.fontSize = '12px'; b.style.borderRadius = '16px'; b.style.whiteSpace = 'nowrap';
    });
    event.target.className = 'btn btn-dark';
  }
  renderTugasTimeline(filterType);
}

function renderTugasTimeline(filter = 'all') {
  const container = document.getElementById('tugas-timeline');
  if (!container) return;
  
  const urgent = [];
  const upcoming = [];
  const done = [];
  
  tugasData.forEach(t => {
    if (filter === 'pending' && t.status === 'done') return;
    const cd = calculateCountdown(t.deadline);
    if (filter === 'urgent' && !cd.urgent && t.status !== 'done') return; // urgent filter hides non-urgent pending
    if (filter === 'urgent' && t.status === 'done') return;
    
    const cardHTML = `
      <div class="tugas-card reveal">
        <div class="tugas-header">
          <span class="tugas-course">${t.course}</span>
          <span class="tugas-time">${t.deadline.toLocaleDateString('id-ID', {day:'numeric', month:'short'})} ${t.deadline.toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}</span>
        </div>
        <div class="tugas-title">${t.title}</div>
        <div class="tugas-desc">${t.desc}</div>
        <div class="tugas-footer">
          <div class="countdown-badge ${cd.type}"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/><path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg> ${cd.text}</div>
          ${t.status === 'done' ? '<span style="color:var(--green-4); font-size:12px; font-weight:600">Selesai ✓</span>' : `<span class="tugas-action" onclick="alert('Menuju ILMU2 untuk submit tugas...')">Kerjakan <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg></span>`}
        </div>
      </div>
    `;

    if (t.status === 'done') done.push(cardHTML);
    else if (cd.urgent) urgent.push(cardHTML);
    else upcoming.push(cardHTML);
  });

  let html = '';
  if (urgent.length > 0) {
    html += `<div class="tugas-group urgent"><div class="tugas-group-title" style="color:var(--red-1)">Perlu Perhatian (Urgent)</div>${urgent.join('')}</div>`;
  }
  if (upcoming.length > 0) {
    html += `<div class="tugas-group"><div class="tugas-group-title">Akan Datang</div>${upcoming.join('')}</div>`;
  }
  if (done.length > 0 && filter === 'all') {
    html += `<div class="tugas-group"><div class="tugas-group-title">Selesai</div>${done.join('')}</div>`;
  }
  
  if (html === '') html = '<div style="text-align:center; padding:30px 20px;"><p style="color:var(--gray-400); font-size:14px; font-family:Sora">Tidak ada tugas terpilih</p></div>';
  
  container.innerHTML = html;
  requestAnimationFrame(() => observeReveals());
}

function renderTasks() {
  const c = document.getElementById('task-scroll');
  if (!c) return;

  // Render Skeleton
  c.innerHTML = `
    <div class="task-card skeleton" style="height: 70px; margin-bottom: 10px;"></div>
    <div class="task-card skeleton" style="height: 70px;"></div>
  `;
  
  const tick = () => {
    const pending = tugasData.filter(t => t.status !== 'done').sort((a,b) => a.deadline - b.deadline);
    let html = '';
    let hasUrgent = false;

    if (pending.length === 0) {
      html = `
        <div class="empty-state" style="width:100%">
          <div class="empty-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg></div>
          <h4>Hore!</h4>
          <p>Tidak ada tugas tertunda. Selamat beristirahat!</p>
        </div>
      `;
    } else {
      pending.forEach(t => {
        const cd = calculateCountdown(t.deadline);
        if (cd.urgent) hasUrgent = true;
        
        html += `<div class="task-card" onclick="openSubPage('sub-tugas')">
          <h4>${t.title}</h4><p>${t.course}</p>
          <div class="task-meta" style="margin-top:8px">
            <span class="countdown-badge ${cd.type}" style="padding:4px 8px; font-size:10px">${cd.text}</span>
          </div>
        </div>`;
      });
    }
    c.innerHTML = html;

    // Update nav badge in Beranda
    const badge = document.getElementById('nav-badge-tugas');
    if (badge) badge.style.display = hasUrgent ? 'block' : 'none';
  };

  tick();
  
  // Real-time countdown updates
  if (tugasTimer) clearInterval(tugasTimer);
  tugasTimer = setInterval(() => {
    tick();
    if (currentSub === 'sub-tugas') {
      const activeBtn = document.querySelector('.tugas-filter .btn-dark');
      const fType = activeBtn ? (activeBtn.textContent.includes('Belum') ? 'pending' : (activeBtn.textContent.includes('Dekat') ? 'urgent' : 'all')) : 'all';
      renderTugasTimeline(fType);
    }
  }, 60000); // 1-minute interval
  
  // Initial render of timeline
  setTimeout(() => {
    tick();
    renderTugasTimeline('all');
  }, 800); // Delay for skeleton duration
}

/* ----- Announcements ----- */
function renderAnnouncements() {
  const c = document.getElementById('ann-scroll');
  if (!c) return;

  // Skeleton
  c.innerHTML = `
    <div class="ann-card skeleton" style="min-width: 260px; height: 90px; margin-right:12px;"></div>
    <div class="ann-card skeleton" style="min-width: 260px; height: 90px;"></div>
  `;

  setTimeout(() => {
    const anns = [
      { date: '20 Maret 2026', title: 'Pembayaran UKT dimulai dari tanggal...', desc: 'Selengkapnya' },
      { date: '18 Maret 2026', title: 'Batas pengisian KRS Semester 5', desc: '31 Juli 2026 — Pastikan KRS sudah disetujui' }
    ];
    
    if (anns.length === 0) {
      c.innerHTML = `
        <div class="empty-state" style="width:100%">
          <div class="empty-icon"><svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg></div>
          <h4>Belum Ada Pengumuman</h4>
          <p>Informasi dari universitas akan muncul di sini.</p>
        </div>
      `;
      return;
    }

    let html = '';
    anns.forEach(a => {
      html += `<div class="ann-card reveal" onclick="alert('${a.title}')"><div class="ann-date">${a.date}</div><h4>${a.title}</h4><p>${a.desc}</p></div>`;
    });
    c.innerHTML = html;
  }, 800);
}

/* ----- Services Grid (dengan staggered entrance) ----- */
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
  svcs.forEach((s, index) => {
    const el = document.createElement('div');
    el.className = 'service-card reveal';
    // Staggered entrance delay — setiap kartu muncul 80ms setelah sebelumnya
    el.style.transitionDelay = `${index * 80}ms`;
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
    const color = d.pct >= 90 ? 'var(--green-3)' : d.pct >= 80 ? '#eab308' : 'var(--red-3)';
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

/* ----- Sub: LP3M ----- */
function closeLP3MAlert(e) {
  if (e && e.target !== e.currentTarget) return;
  document.getElementById('modal-lp3m').classList.remove('show');
}

function renderLP3M() {
  const data = [
    { type: 'Dosen Wali', name: 'Dr. Ir. Wahyu Nugroho, M.T.', status: 'done' },
    { type: 'Mata Kuliah', name: 'Basis Data', dosen: 'Bu Sari Dewi', status: 'done' },
    { type: 'Mata Kuliah', name: 'Algoritma & Pemrograman', dosen: 'Pak Budi', status: 'done' },
    { type: 'Mata Kuliah', name: 'Sistem Operasi', dosen: 'Pak Ahmad Fauzi', status: 'done' },
    { type: 'Mata Kuliah', name: 'Jaringan Komputer', dosen: 'Bu Rina', status: 'pending' },
    { type: 'Mata Kuliah', name: 'Pemrograman Web', dosen: 'Pak Denny', status: 'pending' },
    { type: 'Mata Kuliah', name: 'Matematika Diskrit', dosen: 'Pak Heru', status: 'pending' },
    { type: 'Mata Kuliah', name: 'Analisis Perancangan SI', dosen: 'Bu Mega', status: 'pending' }
  ];

  let completed = 0;
  let html = '<div class="section-title">Daftar Evaluasi</div>';
  
  data.forEach((d, idx) => {
    if (d.status === 'done') completed++;
    
    // Staggered reveal
    html += `<div class="lp3m-item reveal" style="transition-delay:${idx * 40}ms" onclick="document.getElementById('modal-lp3m').classList.add('show')">`;
    html += `<div class="lp3m-i-left"><h4>${d.type}</h4><p>${d.name}${d.dosen ? ' · ' + d.dosen : ''}</p></div>`;
    html += `<div class="lp3m-i-right"><span class="lp3m-status ${d.status}">${d.status === 'done' ? 'Selesai' : 'Belum'}</span></div>`;
    html += `</div>`;
  });

  const list = document.getElementById('lp3m-list');
  if (list) list.innerHTML = html;

  const pct = Math.round((completed / data.length) * 100);
  
  // Update Sub-page Progress
  const pText = document.getElementById('lp3m-p-text');
  const pFill = document.getElementById('lp3m-p-fill');
  if (pText) pText.textContent = `${completed}/${data.length}`;
  if (pFill) setTimeout(() => pFill.style.width = pct + '%', 300);

  // Update Banner state
  const bTitle = document.getElementById('lp3m-b-title');
  const bDesc = document.getElementById('lp3m-b-desc');
  const banner = document.getElementById('lp3m-banner');
  if (pct === 100) {
    if (bTitle) bTitle.textContent = 'Kuisioner Selesai 🎉';
    if (bDesc) bDesc.textContent = 'Kartu ETS kini dapat diunduh';
    if (banner) banner.style.background = 'linear-gradient(135deg, var(--blue-500) 0%, #2563eb 100%)';
  }

  // Update Dashboard Widget
  document.getElementById('lp3m-w-status').textContent = pct + '%';
  document.getElementById('lp3m-w-text').textContent = pct === 100 ? 'Semua evaluasi telah diselesaikan' : `${completed} dari ${data.length} evaluasi selesai`;
  setTimeout(() => {
    const wFill = document.getElementById('lp3m-w-fill');
    if (wFill) wFill.style.width = pct + '%';
  }, 500);
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

/* ----- Sub: Transkrip Nilai ----- */
function renderTranskrip() {
  const semesters = [
    { sem: 'Sem 1', ips: 3.45, mks: [
      { code: 'IF21101', name: 'Pengantar Informatika', sks: 3, grade: 'A-', bobot: 3.75 },
      { code: 'IF21102', name: 'Kalkulus I', sks: 3, grade: 'B+', bobot: 3.25 },
      { code: 'IF21103', name: 'Fisika Dasar', sks: 3, grade: 'B', bobot: 3.00 },
      { code: 'IF21104', name: 'Bahasa Indonesia', sks: 2, grade: 'A', bobot: 4.00 },
      { code: 'IF21105', name: 'Pancasila', sks: 2, grade: 'A-', bobot: 3.75 }
    ]},
    { sem: 'Sem 2', ips: 3.58, mks: [
      { code: 'IF21201', name: 'Pemrograman Dasar', sks: 4, grade: 'A', bobot: 4.00 },
      { code: 'IF21202', name: 'Kalkulus II', sks: 3, grade: 'B+', bobot: 3.25 },
      { code: 'IF21203', name: 'Aljabar Linear', sks: 3, grade: 'B', bobot: 3.00 },
      { code: 'IF21204', name: 'Bahasa Inggris', sks: 2, grade: 'A', bobot: 4.00 }
    ]},
    { sem: 'Sem 3', ips: 3.82, mks: [
      { code: 'IF21301', name: 'Struktur Data', sks: 4, grade: 'A', bobot: 4.00 },
      { code: 'IF21302', name: 'Sistem Digital', sks: 3, grade: 'A-', bobot: 3.75 },
      { code: 'IF21303', name: 'Probabilitas & Statistik', sks: 3, grade: 'B+', bobot: 3.25 },
      { code: 'IF21304', name: 'Etika Profesi', sks: 2, grade: 'A', bobot: 4.00 }
    ]},
    { sem: 'Sem 4', ips: 3.85, mks: [
      { code: 'BD-301', name: 'Basis Data', sks: 3, grade: 'A', bobot: 4.00 },
      { code: 'AP-401', name: 'Algoritma & Pemrograman', sks: 4, grade: 'A-', bobot: 3.75 },
      { code: 'SO-302', name: 'Sistem Operasi', sks: 3, grade: 'B+', bobot: 3.25 },
      { code: 'JK-201', name: 'Jaringan Komputer', sks: 3, grade: 'B', bobot: 3.00 },
      { code: 'PW-401', name: 'Pemrograman Web', sks: 4, grade: 'A', bobot: 4.00 },
      { code: 'MAT-201', name: 'Matematika Diskrit', sks: 3, grade: 'C+', bobot: 2.75 },
      { code: 'APSI-302', name: 'Analisis Perancangan SI', sks: 2, grade: 'A-', bobot: 3.75 }
    ]}
  ];

  // Simpan data untuk Canvas chart (digambar saat sub-page dibuka)
  transkripData = semesters;

  // Render grade list
  const list = document.getElementById('transkrip-list');
  if (!list) return;
  let html = '';
  let totalSKS = 0;
  let totalMK = 0;

  semesters.forEach(s => {
    html += `<div style="padding:0 20px; margin-bottom:4px;"><h4 style="font-family:Sora; font-size:13px; font-weight:600; color:var(--gray-500); padding:12px 0 6px">${s.sem} · IPS ${s.ips.toFixed(2)}</h4></div>`;
    s.mks.forEach((m, idx) => {
      totalSKS += m.sks;
      totalMK++;
      const gc = gradeColor(m.grade);
      html += `<div class="mk-card reveal" style="margin:0 20px 8px; transition-delay:${idx * 40}ms">`;
      html += `<span class="mk-code-pill">${m.code}</span>`;
      html += `<div class="mk-info"><h4>${m.name}</h4><p>${m.sks} SKS · Bobot ${m.bobot.toFixed(2)}</p></div>`;
      html += `<span class="mk-grade ${gc}">${m.grade}</span>`;
      html += `</div>`;
    });
  });
  list.innerHTML = html;

  const summary = document.getElementById('transkrip-summary');
  if (summary) summary.textContent = `${totalMK} MK · ${totalSKS} SKS`;
}

function gradeColor(grade) {
  if (grade.startsWith('A')) return 'grade-a';
  if (grade.startsWith('B')) return 'grade-b';
  if (grade.startsWith('C')) return 'grade-c';
  return 'grade-d';
}

function drawIPSChart(semesters) {
  const canvas = document.getElementById('ips-chart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  // High-DPI support
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);
  const W = rect.width;
  const H = rect.height;

  const data = semesters.map(s => s.ips);
  const labels = semesters.map(s => s.sem);
  const padL = 36, padR = 20, padT = 20, padB = 30;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const minY = 2.0, maxY = 4.0;
  const range = maxY - minY;

  // Grid lines
  ctx.strokeStyle = 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 1;
  for (let v = 2.0; v <= 4.0; v += 0.5) {
    const y = padT + chartH - ((v - minY) / range) * chartH;
    ctx.beginPath();
    ctx.moveTo(padL, y);
    ctx.lineTo(W - padR, y);
    ctx.stroke();
    ctx.fillStyle = '#94a3b8';
    ctx.font = '11px DM Sans';
    ctx.textAlign = 'right';
    ctx.fillText(v.toFixed(1), padL - 6, y + 4);
  }

  // Data points
  const points = data.map((v, i) => ({
    x: padL + (i / (data.length - 1)) * chartW,
    y: padT + chartH - ((v - minY) / range) * chartH
  }));

  // Gradient fill under line
  const grad = ctx.createLinearGradient(0, padT, 0, H - padB);
  grad.addColorStop(0, 'rgba(34,197,94,0.25)');
  grad.addColorStop(1, 'rgba(34,197,94,0.02)');
  ctx.beginPath();
  ctx.moveTo(points[0].x, H - padB);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, H - padB);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 2.5;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';
  points.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
  ctx.stroke();

  // Dots + labels
  points.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Value label
    ctx.fillStyle = '#16a34a';
    ctx.font = 'bold 11px Sora';
    ctx.textAlign = 'center';
    ctx.fillText(data[i].toFixed(2), p.x, p.y - 10);

    // Semester label
    ctx.fillStyle = '#64748b';
    ctx.font = '11px DM Sans';
    ctx.fillText(labels[i], p.x, H - padB + 16);
  });
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
  // Inisialisasi scroll reveal observer
  initRevealObserver();

  // Render semua konten
  renderTasks();
  renderAnnouncements();
  renderServices();
  renderLP3M();
  renderAkademik();
  renderJadwal();
  renderKehadiran();
  renderMKTersedia();
  renderMKDiambil();
  renderPembayaran();
  renderTranskrip();
  updateGreeting();

  // Inisialisasi Tema
  initTheme();

  // Inisialisasi posisi nav indicator
  setTimeout(updateNavIndicator, 100);
  window.addEventListener('resize', updateNavIndicator);

  // Observe elemen reveal awal
  observeReveals();
  
  // Auto-show password tooltip as onboarding hint
  setTimeout(() => showTooltip(), 500);

  // Inisialisasi Onboarding
  initOnboarding();

  // Pasang ripple effect pada bottom nav items
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => createRipple(e, item));
  });
});

/* ===== ONBOARDING (Phase 6) ===== */
function initOnboarding() {
  if (localStorage.getItem('firstTime') !== 'false') {
    const navTooltip = document.getElementById('onboarding-nav');
    if (navTooltip) {
      setTimeout(() => navTooltip.classList.add('show'), 2000);
      setTimeout(() => navTooltip.classList.remove('show'), 7000);
      localStorage.setItem('firstTime', 'false');
    }
  }
}

/* ===== PULL TO REFRESH (Phase 6) ===== */
let startY = 0;
let currentY = 0;
let isPulling = false;
const spinner = document.getElementById('ptr-spinner');
const appContainer = document.querySelector('.app-container');

if (appContainer && spinner) {
  appContainer.addEventListener('touchstart', e => {
    if (appContainer.scrollTop === 0) {
      startY = e.touches[0].clientY;
      isPulling = true;
    }
  }, {passive: true});

  appContainer.addEventListener('touchmove', e => {
    if (!isPulling) return;
    currentY = e.touches[0].clientY;
    const dy = currentY - startY;
    if (dy > 0 && appContainer.scrollTop === 0) {
      if (dy > 40) {
        spinner.classList.add('pulling');
        spinner.style.transform = `translateX(-50%) translateY(${Math.min(dy - 40, 80)}px)`;
      }
    }
  }, {passive: true});

  appContainer.addEventListener('touchend', () => {
    if (!isPulling) return;
    isPulling = false;
    const dy = currentY - startY;
    if (dy > 100 && appContainer.scrollTop === 0) {
      spinner.style.transform = '';
      spinner.classList.remove('pulling');
      spinner.classList.add('refreshing');
      // Simulate API fetch delay
      setTimeout(() => {
        spinner.classList.remove('refreshing');
        location.reload();
      }, 1000);
    } else {
      spinner.style.transform = '';
      spinner.classList.remove('pulling');
    }
  });
}

/* ===== COURSE MOCK DATA & PAGINATION (Phase 8) ===== */
const courseData = [
  { id: 'c1', name: 'Basis Data', code: 'IF1234', sks: 3, term: '4', dept: 'if', lecturer: 'Bu Sari Dewi', grade: 'A', desc: 'Mempelajari relasional database, SQL, dan normalisasi.' },
  { id: 'c2', name: 'Algoritma & Pemrograman', code: 'IF1235', sks: 3, term: '4', dept: 'if', lecturer: 'Pak Budi', grade: 'A-', desc: 'Dasar-dasar logika pemrograman dan struktur data.' },
  { id: 'c3', name: 'Sistem Operasi', code: 'IF1236', sks: 3, term: '4', dept: 'if', lecturer: 'Pak Andi', grade: 'B+', desc: 'Manajemen memori, proses, dan file system.' },
  { id: 'c4', name: 'Manajemen Proyek TI', code: 'SI4421', sks: 2, term: '4', dept: 'si', lecturer: 'Bu Rina', grade: 'A', desc: 'Metodologi Agile, Scrum, dan manajemen waktu proyek.' },
  { id: 'c5', name: 'Jaringan Komputer', code: 'IF1122', sks: 3, term: '3', dept: 'if', lecturer: 'Pak Joko', grade: 'B', desc: 'Topologi, OSI layer, dan routing jaringan.' },
  { id: 'c6', name: 'Kalkulus II', code: 'MA1002', sks: 3, term: '3', dept: 'if', lecturer: 'Bu Siti', grade: 'C+', desc: 'Integral, deret, dan persamaan diferensial dasar.' },
  { id: 'c7', name: 'Struktur Data', code: 'IF1023', sks: 3, term: '3', dept: 'if', lecturer: 'Pak Budi', grade: 'A-', desc: 'Trees, Graphs, Hash Tables, dan manipulasi data lanjut.' },
  { id: 'c8', name: 'Statistika Dasar', code: 'MA1005', sks: 2, term: '3', dept: 'si', lecturer: 'Bu Tina', grade: 'B+', desc: 'Distribusi probabilitas dan pengujian hipotesis.' }
];

let currentPage = 1;
const ITEMS_PER_PAGE = 3;

function renderCourses() {
  const searchInput = document.getElementById('course-search');
  if(!searchInput) return;
  
  const searchQuery = searchInput.value.toLowerCase();
  const termFilter = document.getElementById('filter-term').value;
  const deptFilter = document.getElementById('filter-dept').value;
  
  const filtered = courseData.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchQuery) || c.code.toLowerCase().includes(searchQuery);
    const matchTerm = termFilter === 'all' || c.term === termFilter;
    const matchDept = deptFilter === 'all' || c.dept === deptFilter;
    return matchSearch && matchTerm && matchDept;
  });
  
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageData = filtered.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  
  const listEl = document.getElementById('mk-list');
  listEl.innerHTML = '';
  
  if (pageData.length === 0) {
    listEl.innerHTML = `<div class="empty-state">
      <div class="empty-icon"><svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg></div>
      <h4>Tidak Ada Mata Kuliah</h4>
      <p style="font-size:13px; color:var(--gray-500)">Coba ubah kata kunci atau filter pencarian.</p>
    </div>`;
  } else {
    pageData.forEach(c => {
      // using backticks string injection without bad escapes
      listEl.innerHTML += `<div class="card" style="padding:16px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;" onclick="viewCourseDetail('${c.id}')">
          <div>
            <h4 style="font-weight:600; color:var(--gray-800); margin-bottom:4px; font-size:15px;" class="course-badge">${c.name}</h4>
            <p style="font-size:12px; color:var(--gray-500)">${c.code} · ${c.sks} SKS</p>
          </div>
          <span class="chip green course-grade-badge" style="font-weight:700;">${c.grade}</span>
        </div>`;
    });
  }
  
  renderPagination(totalPages);
}

function renderPagination(total) {
  const pag = document.getElementById('course-pagination');
  if(!pag) return;
  pag.innerHTML = '';
  if (total <= 1) return;
  
  const prev = document.createElement('button');
  prev.className = 'page-btn ' + (currentPage === 1 ? 'disabled' : '');
  prev.innerHTML = '&laquo;';
  prev.onclick = () => { if (currentPage > 1) { currentPage--; renderCourses(); } };
  pag.appendChild(prev);
  
  for(let i=1; i<=total; i++) {
    const btn = document.createElement('button');
    btn.className = 'page-btn ' + (currentPage === i ? 'active' : '');
    btn.textContent = i;
    btn.onclick = () => { currentPage = i; renderCourses(); };
    pag.appendChild(btn);
  }
  
  const next = document.createElement('button');
  next.className = 'page-btn ' + (currentPage === total ? 'disabled' : '');
  next.innerHTML = '&raquo;';
  next.onclick = () => { if (currentPage < total) { currentPage++; renderCourses(); } };
  pag.appendChild(next);
}

function viewCourseDetail(id) {
  const c = courseData.find(x => x.id === id);
  if (!c) return;
  document.getElementById('cd-course-name').textContent = c.name;
  document.getElementById('cd-course-code').textContent = c.code;
  document.getElementById('cd-sks').textContent = c.sks;
  document.getElementById('cd-term').textContent = c.term;
  document.getElementById('cd-lecturer').textContent = c.lecturer;
  document.getElementById('cd-desc').textContent = c.desc;
  document.getElementById('cd-grade').textContent = c.grade;
  
  openSubPage('sub-course-detail');
}

/* ===== ROUTER LISTENER (Phase 7 & 9) ===== */
window.addEventListener('hashchange', handleRouteChange);

// Cross-Tab Synchronization (Phase 9)
window.addEventListener('storage', (e) => {
    if (e.key === 'isLoggedIn') {
        if (e.newValue === null) {
            // Completely tear down UI for this logged out tab to avoid protected data leaks
            window.location.hash = 'login';
            window.location.reload(); 
        } else if (e.newValue === 'true') {
            handleRouteChange();
        }
    }
});

function handleRouteChange() {
  let hash = window.location.hash.replace('#', '');
  const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const path = window.location.pathname;

  // Deep Routing Physical Path Catch (Phase 9)
  // Check if we hit a pseudo-physical path managed by 404.html
  if (path.length > 20 && !path.endsWith('/my-upn-portal/') && !path.endsWith('index.html') && !path.endsWith('404.html')) {
     if (!loggedIn) {
         sessionStorage.setItem('intendedRoute', path + window.location.search + window.location.hash);
         window.location.replace('/my-upn-portal/#login');
         return;
     } else {
         // Authenticated Deep Path: map to existing SPA route based on URL keywords
         if (path.includes('courses')) hash = 'akademik';
         else hash = 'dashboard'; 
         // Continue render bypass to match pseudo-path functionality implicitly
     }
  }

  const isProtected = routes.includes(hash) || hash.startsWith('sub-');

  // Strict deep linking protection
  if (isProtected && !loggedIn) {
    doLogout();
    return;
  }

  // Active Routing Logic
  if (routes.includes(hash)) {
    if (loggedIn) {
      document.getElementById('page-login').classList.remove('active');
      document.getElementById('bottom-nav').classList.add('show');
      withTransition(() => _doNavigation(hash));
    }
  } else if (hash.startsWith('sub-')) {
    if (loggedIn) {
      document.getElementById('page-login').classList.remove('active');
      document.getElementById('bottom-nav').classList.add('show');
      withTransition(() => _doOpenSub(hash));
    }
  } else {
    // Root or unknown hash
    if (loggedIn) {
      window.location.hash = 'dashboard';
    } else {
      doLogout();
    }
  }
}

// Initial route check on page load to handle reload states
document.addEventListener('DOMContentLoaded', () => {
  handleRouteChange();
  renderCourses();
});// Load initial configs immediately (Phase 10 override)
if (localStorage.getItem('isLoggedIn') === 'true') {
    setTimeout(updateGreeting, 100);
}

// ==== Phase 10 Profile Editor Handlers ====
function openProfileEdit() {
  const savedName = localStorage.getItem('profileName') || 'Rizky Dwi Pratama';
  const savedEmail = localStorage.getItem('profileEmail') || 'npm@student.upnjatim.ac.id';
  
  document.getElementById('edit-profil-name').value = savedName;
  document.getElementById('edit-profil-email').value = savedEmail;
  openSubPage('sub-profile-edit');
}

function saveProfile() {
  const newName = document.getElementById('edit-profil-name').value.trim();
  const newEmail = document.getElementById('edit-profil-email').value.trim();
  
  if(newName && newEmail) {
      localStorage.setItem('profileName', newName);
      localStorage.setItem('profileEmail', newEmail);
      updateGreeting();
      closeSubPage();
  }
}

// Override / Update global DOM names 
function updateGreeting() {
  const greetingEl = document.getElementById('greeting-text');
  const savedName = localStorage.getItem('profileName') || 'Rizky Dwi Pratama';
  const savedEmail = localStorage.getItem('profileEmail') || 'npm@student.upnjatim.ac.id';
  
  if (greetingEl) {
      const firstName = savedName.split(' ')[0];
      greetingEl.textContent = `Hallo, ${firstName}`;
  }
  
  const nameDisplay = document.getElementById('profil-name-display');
  if (nameDisplay) nameDisplay.textContent = savedName;
  
  const contactDisplay = document.getElementById('profil-contact-display');
  if (contactDisplay) {
     contactDisplay.textContent = '21081010001 · ' + savedEmail;
  }

  const initials = savedName.split(' ').map(n => n[0]).join('').substring(0,2).toUpperCase();
  const avatarInitials = document.getElementById('profil-avatar-initials');
  if (avatarInitials) avatarInitials.textContent = initials;
  const headerAvatar = document.querySelector('.greeting-avatar');
  if (headerAvatar) headerAvatar.textContent = initials;
}
