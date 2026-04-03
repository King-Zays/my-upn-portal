// === lib/mock-data.ts ===
// Semua data mock statis untuk MY UPN — tidak ada backend/API nyata

// === Tipe Data ===
export interface Mahasiswa {
  nama: string
  npm: string
  prodi: string
  fakultas: string
  semester: number
  ipk: number
  ips: number
  sksLulus: number
  sksMaksimal: number
  email: string
  angkatan: number
  status: 'Aktif' | 'Cuti' | 'Lulus'
}

export interface JadwalKuliah {
  id: string
  mataKuliah: string
  kode: string
  dosen: string
  hari: string
  jam: string
  ruangan: string
  sks: number
  jenis: 'Teori' | 'Praktikum'
}

export interface MataKuliah {
  kode: string
  nama: string
  sks: number
  dosen: string
  nilai: string | null
  semester: number
  jenis: 'Teori' | 'Praktikum'
}

export interface Pengumuman {
  id: string
  judul: string
  isi: string
  tanggal: string
  kategori: 'akademik' | 'keuangan' | 'umum'
  penting: boolean
}

export interface RiwayatPembayaran {
  id: string
  jenis: string
  nominal: number
  tanggal: string
  status: 'Lunas' | 'Belum Lunas' | 'Tertunda'
  semester: number
}

export interface Kehadiran {
  mataKuliah: string
  kode: string
  hadir: number
  totalPertemuan: number
  persentase: number
}

export interface LayananItem {
  id: string
  label: string
  icon: string
  color: string
  href: string
  badge?: string
}

// === Data Mahasiswa ===
export const mahasiswaData: Mahasiswa = {
  nama: 'Muhammad Firzan',
  npm: '22083010001',
  prodi: 'Informatika',
  fakultas: 'Ilmu Komputer',
  semester: 4,
  ipk: 3.72,
  ips: 3.85,
  sksLulus: 82,
  sksMaksimal: 144,
  email: '22083010001@student.upnjatim.ac.id',
  angkatan: 2022,
  status: 'Aktif',
}

// === Jadwal Hari Ini ===
export const jadwalHariIni: JadwalKuliah[] = [
  {
    id: 'j1',
    mataKuliah: 'Basis Data',
    kode: 'IF2301',
    dosen: 'Dr. Sari Dewi, M.Kom.',
    hari: 'Senin',
    jam: '08.00 – 10.30',
    ruangan: 'Gd. D-301',
    sks: 3,
    jenis: 'Teori',
  },
  {
    id: 'j2',
    mataKuliah: 'Algoritma & Pemrograman',
    kode: 'IF2401',
    dosen: 'Budi Santoso, S.T., M.T.',
    hari: 'Senin',
    jam: '13.00 – 15.30',
    ruangan: 'Lab. Komp-2',
    sks: 4,
    jenis: 'Praktikum',
  },
  {
    id: 'j3',
    mataKuliah: 'Pemrograman Web',
    kode: 'IF2402',
    dosen: 'Denny Arifianto, M.Kom.',
    hari: 'Senin',
    jam: '16.00 – 17.40',
    ruangan: 'Gd. E-102',
    sks: 3,
    jenis: 'Teori',
  },
]

// === Jadwal Mingguan Lengkap ===
export const jadwalMingguanData: JadwalKuliah[] = [
  ...jadwalHariIni,
  {
    id: 'j4',
    mataKuliah: 'Sistem Operasi',
    kode: 'IF2302',
    dosen: 'Ahmad Fauzi, S.Kom., M.Cs.',
    hari: 'Selasa',
    jam: '08.00 – 10.30',
    ruangan: 'Gd. D-205',
    sks: 3,
    jenis: 'Teori',
  },
  {
    id: 'j5',
    mataKuliah: 'Jaringan Komputer',
    kode: 'IF2201',
    dosen: 'Rina Fitriani, M.Cs.',
    hari: 'Selasa',
    jam: '13.00 – 15.30',
    ruangan: 'Lab. Jaringan',
    sks: 3,
    jenis: 'Praktikum',
  },
  {
    id: 'j6',
    mataKuliah: 'Matematika Diskrit',
    kode: 'IF2103',
    dosen: 'Prof. Heru Prasetyo, M.Si.',
    hari: 'Rabu',
    jam: '08.00 – 10.30',
    ruangan: 'Gd. C-401',
    sks: 3,
    jenis: 'Teori',
  },
  {
    id: 'j7',
    mataKuliah: 'Struktur Data',
    kode: 'IF2303',
    dosen: 'Surya Wijaya, S.Kom., M.T.',
    hari: 'Kamis',
    jam: '10.00 – 12.30',
    ruangan: 'Lab. Komp-1',
    sks: 4,
    jenis: 'Praktikum',
  },
]

// === Daftar Mata Kuliah Aktif ===
export const mataKuliahData: MataKuliah[] = [
  { kode: 'IF2301', nama: 'Basis Data', sks: 3, dosen: 'Dr. Sari Dewi, M.Kom.', nilai: 'A', semester: 4, jenis: 'Teori' },
  { kode: 'IF2401', nama: 'Algoritma & Pemrograman', sks: 4, dosen: 'Budi Santoso, S.T., M.T.', nilai: 'A-', semester: 4, jenis: 'Praktikum' },
  { kode: 'IF2302', nama: 'Sistem Operasi', sks: 3, dosen: 'Ahmad Fauzi, S.Kom., M.Cs.', nilai: 'B+', semester: 4, jenis: 'Teori' },
  { kode: 'IF2201', nama: 'Jaringan Komputer', sks: 3, dosen: 'Rina Fitriani, M.Cs.', nilai: 'B', semester: 4, jenis: 'Praktikum' },
  { kode: 'IF2402', nama: 'Pemrograman Web', sks: 3, dosen: 'Denny Arifianto, M.Kom.', nilai: 'A', semester: 4, jenis: 'Teori' },
  { kode: 'IF2103', nama: 'Matematika Diskrit', sks: 3, dosen: 'Prof. Heru Prasetyo, M.Si.', nilai: 'C+', semester: 4, jenis: 'Teori' },
  { kode: 'IF2303', nama: 'Struktur Data', sks: 4, dosen: 'Surya Wijaya, S.Kom., M.T.', nilai: 'A', semester: 3, jenis: 'Praktikum' },
  { kode: 'IF2102', nama: 'Kalkulus II', sks: 3, dosen: 'Dr. Mega Utami, M.Si.', nilai: 'B+', semester: 3, jenis: 'Teori' },
]

// === Pengumuman ===
export const pengumumanData: Pengumuman[] = [
  {
    id: 'p1',
    judul: 'Pembayaran UKT Gasal 2025/2026',
    isi: 'Pembayaran UKT semester gasal dibuka mulai 1 April. Segera lakukan pembayaran sebelum batas akhir.',
    tanggal: '2026-04-01',
    kategori: 'keuangan',
    penting: true,
  },
  {
    id: 'p2',
    judul: 'Batas Pengisian KRS Semester 5',
    isi: 'Pengisian KRS untuk semester 5 paling lambat tanggal 31 Juli 2026 melalui SIAMIK.',
    tanggal: '2026-03-28',
    kategori: 'akademik',
    penting: true,
  },
  {
    id: 'p3',
    judul: 'Wisuda Periode III 2026',
    isi: 'Pendaftaran wisuda periode III tahun 2026 telah dibuka. Silakan daftar melalui SIAMIK.',
    tanggal: '2026-03-25',
    kategori: 'umum',
    penting: false,
  },
  {
    id: 'p4',
    judul: 'Jadwal UAS Semester Genap',
    isi: 'Jadwal UAS semester genap 2025/2026 sudah tersedia di SIAMIK.',
    tanggal: '2026-03-20',
    kategori: 'akademik',
    penting: false,
  },
]

// === Teks marquee pengumuman ===
export const marqueeTexts: string[] = [
  '📢 Pembayaran UKT Gasal 2025/2026 dibuka mulai 1 April',
  '📅 Batas pengisian KRS Semester 5: 31 Juli 2026',
  '🎓 Wisuda Periode III tahun 2026 telah dibuka',
  '📋 Jadwal UAS Semester Genap sudah tersedia di SIAMIK',
]

// === Menu layanan ===
export const layananData: LayananItem[] = [
  { id: 'jadwal', label: 'Jadwal Kelas', icon: 'Clock', color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400', href: '/layanan/jadwal' },
  { id: 'kehadiran', label: 'Kehadiran', icon: 'CheckSquare', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400', href: '/layanan/kehadiran', badge: '89%' },
  { id: 'mk-tersedia', label: 'MK Tersedia', icon: 'BookOpen', color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400', href: '/akademik' },
  { id: 'mk-diambil', label: 'MK Diambil', icon: 'FileText', color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400', href: '/akademik' },
  { id: 'kalender', label: 'Kalender Akd.', icon: 'CalendarDays', color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400', href: '/kalender' },
  { id: 'khs', label: 'KHS', icon: 'Award', color: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400', href: '/akademik' },
  { id: 'pembayaran', label: 'Pembayaran', icon: 'CreditCard', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400', href: '/layanan/pembayaran' },
  { id: 'ips-history', label: 'Riwayat IPS', icon: 'TrendingUp', color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400', href: '/akademik' },
  { id: 'lp3m', label: 'Kuisioner LP3M', icon: 'ClipboardList', color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400', href: '#', badge: 'Pending' },
]

// === Riwayat pembayaran ===
export const riwayatPembayaranData: RiwayatPembayaran[] = [
  { id: 'pay1', jenis: 'UKT Semester 4', nominal: 3500000, tanggal: '2026-02-15', status: 'Lunas', semester: 4 },
  { id: 'pay2', jenis: 'UKT Semester 3', nominal: 3500000, tanggal: '2025-08-10', status: 'Lunas', semester: 3 },
  { id: 'pay3', jenis: 'UKT Semester 2', nominal: 3500000, tanggal: '2025-02-12', status: 'Lunas', semester: 2 },
  { id: 'pay4', jenis: 'UKT Semester 1', nominal: 3500000, tanggal: '2024-08-05', status: 'Lunas', semester: 1 },
  { id: 'pay5', jenis: 'UKT Semester 5', nominal: 3500000, tanggal: '-', status: 'Belum Lunas', semester: 5 },
]

// === Data kehadiran ===
export const kehadiranData: Kehadiran[] = [
  { mataKuliah: 'Basis Data', kode: 'IF2301', hadir: 12, totalPertemuan: 14, persentase: 86 },
  { mataKuliah: 'Algoritma & Pemrograman', kode: 'IF2401', hadir: 14, totalPertemuan: 14, persentase: 100 },
  { mataKuliah: 'Sistem Operasi', kode: 'IF2302', hadir: 11, totalPertemuan: 14, persentase: 79 },
  { mataKuliah: 'Jaringan Komputer', kode: 'IF2201', hadir: 13, totalPertemuan: 14, persentase: 93 },
  { mataKuliah: 'Pemrograman Web', kode: 'IF2402', hadir: 14, totalPertemuan: 14, persentase: 100 },
  { mataKuliah: 'Matematika Diskrit', kode: 'IF2103', hadir: 10, totalPertemuan: 14, persentase: 71 },
]

// === Sistem terhubung (untuk halaman profil) ===
export interface SistemTerhubung {
  nama: string
  deskripsi: string
  status: 'Terhubung' | 'Tidak Terhubung'
  url: string
}

export const sistemTerhubungData: SistemTerhubung[] = [
  { nama: 'SIAMIK', deskripsi: 'Sistem Informasi Akademik', status: 'Terhubung', url: 'https://siamik.upnjatim.ac.id' },
  { nama: 'ILMU2', deskripsi: 'E-Learning UPN', status: 'Terhubung', url: 'https://ilmu.upnjatim.ac.id' },
  { nama: 'LP3M', deskripsi: 'Evaluasi Dosen', status: 'Terhubung', url: 'https://lp3m.upnjatim.ac.id' },
]

// === Helper: Greeting berdasarkan jam ===
export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 11) return 'Selamat pagi'
  if (hour < 15) return 'Selamat siang'
  if (hour < 18) return 'Selamat sore'
  return 'Selamat malam'
}

// === Helper: Emoji greeting ===
export function getGreetingEmoji(): string {
  const hour = new Date().getHours()
  if (hour < 11) return '☀️'
  if (hour < 15) return '🌤️'
  if (hour < 18) return '🌅'
  return '🌙'
}

// === Helper: Warna nilai ===
export function getNilaiColor(nilai: string | null): string {
  if (!nilai) return 'text-muted-foreground bg-muted'
  if (nilai.startsWith('A')) return 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
  if (nilai.startsWith('B')) return 'text-blue-700 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30'
  if (nilai.startsWith('C')) return 'text-amber-700 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/30'
  return 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
}

// === Riwayat IPS per semester (untuk grafik) ===
export interface RiwayatIPS {
  semester: string
  ips: number
  ipk: number
  sks: number
}

export const riwayatIPSData: RiwayatIPS[] = [
  { semester: 'Smt 1', ips: 3.50, ipk: 3.50, sks: 20 },
  { semester: 'Smt 2', ips: 3.65, ipk: 3.58, sks: 22 },
  { semester: 'Smt 3', ips: 3.78, ipk: 3.64, sks: 22 },
  { semester: 'Smt 4', ips: 3.85, ipk: 3.72, sks: 18 },
]

// === Helper: Format rupiah ===
export function formatRupiah(num: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)
}

// === Activity Feed Data ===
export interface ActivityItem {
  id: string
  type: 'nilai' | 'kehadiran' | 'deadline' | 'pengumuman'
  title: string
  description: string
  timestamp: string // ISO date
  meta?: string
}

export const activityFeedData: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'nilai',
    title: 'Nilai Basis Data Diperbarui',
    description: 'Nilai UTS Basis Data: A (92/100)',
    timestamp: '2026-04-03T08:30:00',
    meta: 'IF2301',
  },
  {
    id: 'act-2',
    type: 'kehadiran',
    title: 'Kehadiran Tercatat',
    description: 'Hadir di Pemrograman Web — Pertemuan 12',
    timestamp: '2026-04-02T16:00:00',
    meta: '100%',
  },
  {
    id: 'act-3',
    type: 'deadline',
    title: 'Deadline Mendatang',
    description: 'Tugas Akhir Algoritma & Pemrograman',
    timestamp: '2026-04-05T23:59:00',
    meta: '2 hari lagi',
  },
  {
    id: 'act-4',
    type: 'nilai',
    title: 'Nilai Sistem Operasi Diperbarui',
    description: 'Nilai Tugas 3 Sistem Operasi: B+ (78/100)',
    timestamp: '2026-04-01T10:15:00',
    meta: 'IF2302',
  },
  {
    id: 'act-5',
    type: 'kehadiran',
    title: 'Kehadiran Tercatat',
    description: 'Hadir di Matematika Diskrit — Pertemuan 11',
    timestamp: '2026-03-31T10:30:00',
    meta: '71%',
  },
  {
    id: 'act-6',
    type: 'pengumuman',
    title: 'Pengumuman Baru',
    description: 'Jadwal UAS Semester Genap sudah tersedia',
    timestamp: '2026-03-30T09:00:00',
    meta: 'Akademik',
  },
]
