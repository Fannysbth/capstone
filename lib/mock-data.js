// lib/mock-data.js
/**
 * Centralized in-memory mock store for dev/testing.
 *
 * WARNING: This is in-memory only. Data will be lost when the process restarts.
 * For persistence in dev, replace with a JSON file writer or a lightweight DB.
 */

export const MOCK_PROJECTS = [
  {
    id: "1",
    title: "Smart Air Quality Monitoring System",
    category: "Smart City",
    group: "Kelompok IoT A",
    date: new Date().toISOString(),
    summary: "Sistem monitoring kualitas udara real-time menggunakan sensor IoT yang terintegrasi dengan dashboard web untuk memantau polusi udara di area kampus.",
    description: "Proyek ini mengembangkan sistem monitoring kualitas udara berbasis IoT yang dapat mengukur parameter PM2.5, PM10, CO2, dan suhu kelembaban. Data sensor dikirim ke cloud melalui protokol MQTT dan divisualisasikan dalam dashboard real-time.",
    evaluation: "Sistem berhasil diimplementasikan dengan akurasi sensor mencapai 95%. Dashboard responsif dan user-friendly. Integrasi dengan cloud berjalan stabil dengan latency rata-rata 200ms.",
    developmentSuggestion: "Menambahkan fitur prediksi kualitas udara menggunakan machine learning, implementasi notifikasi push saat kualitas udara buruk, dan ekspansi sensor ke lebih banyak titik monitoring.",
    thumbnail: "/assets/projects/air-quality-1.jpg",
    images: [
      "/assets/projects/air-quality-1.jpg",
      "/assets/projects/air-quality-2.jpg",
      "/assets/projects/air-quality-3.jpg"
    ],
    status: "Approved",
    rating: 4.5,
    driveLink: "https://drive.google.com/drive/folders/1aB2cD3eF4gH5iJ6kL7mN8oP9qR0sT",
    availableForContinuation: true,
  },
  {
    id: "2",
    title: "Telemedicine Platform untuk Desa Terpencil",
    category: "Kesehatan",
    group: "Kelompok Medtech B",
    date: new Date(Date.now() - 86400000).toISOString(),
    summary: "Platform telemedicine yang menghubungkan pasien di desa terpencil dengan dokter melalui video call dan chatbot AI untuk konsultasi awal.",
    description: "Aplikasi web dan mobile yang memfasilitasi konsultasi medis jarak jauh. Dilengkapi dengan chatbot berbasis NLP untuk triase awal, sistem antrian online, rekam medis elektronik, dan integrasi pembayaran digital.",
    evaluation: "Berhasil diuji coba di 5 desa dengan 200+ pengguna. Response time chatbot rata-rata 2 detik. Video call stabil pada koneksi 3G. User satisfaction rate mencapai 87%.",
    developmentSuggestion: "Integrasi dengan BPJS untuk klaim otomatis, penambahan fitur resep digital yang terintegrasi dengan apotek, dan implementasi AI diagnosis untuk penyakit umum.",
    thumbnail: "/assets/projects/telemedicine-1.jpg",
    images: [
      "/assets/projects/telemedicine-1.jpg",
      "/assets/projects/telemedicine-2.jpg"
    ],
    status: "Approved",
    rating: 4.8,
    driveLink: "https://drive.google.com/drive/folders/2bC3dE4fG5hI6jK7lM8nO9pQ0rS1tU",
    availableForContinuation: false,
  },
  {
    id: "3",
    title: "Smart Waste Segregation System",
    category: "Pengelolaan Sampah",
    group: "Kelompok Enviro C",
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    summary: "Tempat sampah pintar yang dapat memisahkan sampah organik dan anorganik secara otomatis menggunakan computer vision.",
    description: "Sistem yang menggunakan kamera dan model deep learning untuk mengenali jenis sampah (organik, plastik, kertas, logam) dan secara otomatis memisahkannya ke kompartemen yang sesuai menggunakan mekanisme servo motor.",
    evaluation: "Akurasi klasifikasi sampah mencapai 92% pada 10 kategori sampah. Sistem mekanik bekerja dengan baik dengan success rate 88%. Dapat memproses 1 item sampah setiap 3 detik.",
    developmentSuggestion: "Meningkatkan kecepatan pemrosesan dengan model yang lebih ringan, menambah sensor berat untuk tracking volume sampah, dan implementasi reward system untuk mendorong pembuangan sampah yang benar.",
    thumbnail: "/assets/projects/waste-1.jpg",
    images: [
      "/assets/projects/waste-1.jpg",
      "/assets/projects/waste-2.jpg",
      "/assets/projects/waste-3.jpg",
      "/assets/projects/waste-4.jpg"
    ],
    status: "Approved",
    rating: 4.3,
    driveLink: "https://drive.google.com/drive/folders/3cD4eF5gH6iJ7kL8mN9oP0qR1sT2uV",
    availableForContinuation: true,
  },
  {
    id: "4",
    title: "Electric Bus Route Optimization",
    category: "Transportasi Ramah Lingkungan",
    group: "Kelompok Transport D",
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    summary: "Sistem optimasi rute bus listrik untuk meminimalkan konsumsi energi dan waktu tempuh menggunakan algoritma genetika.",
    description: "Aplikasi yang menganalisis pola perjalanan penumpang, kondisi lalu lintas real-time, dan topografi jalan untuk menentukan rute optimal bus listrik. Mempertimbangkan lokasi charging station dan kapasitas baterai.",
    evaluation: "Berhasil mengurangi konsumsi energi hingga 18% dibanding rute konvensional. Waktu tunggu penumpang berkurang 12%. Sistem dapat menghandle 50 bus secara simultan dengan update rute setiap 5 menit.",
    developmentSuggestion: "Integrasi dengan sistem pembayaran elektronik untuk analisis demand yang lebih akurat, prediksi kebutuhan charging menggunakan machine learning, dan dynamic pricing berdasarkan jam sibuk.",
    thumbnail: "/assets/projects/bus-1.jpg",
    images: [
      "/assets/projects/bus-1.jpg",
      "/assets/projects/bus-2.jpg"
    ],
    status: "Approved",
    rating: 4.6,
    driveLink: "https://drive.google.com/drive/folders/4dE5fG6hI7jK8lM9nO0pQ1rS2tU3vW",
    availableForContinuation: true,
  },
  {
    id: "5",
    title: "Smart Parking System dengan IoT",
    category: "Smart City",
    group: "Kelompok Smart E",
    date: new Date(Date.now() - 4 * 86400000).toISOString(),
    summary: "Sistem parkir pintar yang mendeteksi ketersediaan slot parkir menggunakan sensor dan memberikan guidance ke pengemudi melalui mobile app.",
    description: "Implementasi sensor ultrasonik di setiap slot parkir yang terhubung ke microcontroller ESP32. Data dikirim ke server melalui WiFi dan dapat diakses pengguna melalui aplikasi mobile untuk menemukan slot parkir kosong terdekat.",
    evaluation: "Sistem berhasil mengurangi waktu mencari parkir hingga 40%. Akurasi deteksi slot kosong 96%. Battery life sensor mencapai 6 bulan. User adoption rate 65% dalam 2 bulan testing.",
    developmentSuggestion: "Implementasi pembayaran parkir otomatis menggunakan license plate recognition, integrasi dengan Google Maps untuk routing, dan predictive analytics untuk estimasi ketersediaan parkir di waktu tertentu.",
    thumbnail: "/assets/projects/parking-1.jpg",
    images: [
      "/assets/projects/parking-1.jpg",
      "/assets/projects/parking-2.jpg",
      "/assets/projects/parking-3.jpg"
    ],
    status: "Approved",
    rating: 4.4,
    driveLink: "https://drive.google.com/drive/folders/5eF6gH7iJ8kL9mN0oP1qR2sT3uV4wX",
    availableForContinuation: true,
  },
  {
    id: "6",
    title: "AI-Powered Mental Health Chatbot",
    category: "Kesehatan",
    group: "Kelompok AI Health F",
    date: new Date(Date.now() - 5 * 86400000).toISOString(),
    summary: "Chatbot berbasis AI untuk deteksi dini gangguan mental dan memberikan dukungan emosional serta rekomendasi profesional.",
    description: "Chatbot menggunakan Natural Language Processing untuk menganalisis pola percakapan pengguna dan mendeteksi tanda-tanda depresi, anxiety, atau stress. Dilengkapi dengan sentiment analysis dan mood tracking.",
    evaluation: "Akurasi deteksi kondisi mental mencapai 84% dibanding assessment psikolog profesional. Average conversation satisfaction rate 4.2/5. Response time < 1 detik. Telah melayani 1000+ sesi konsultasi.",
    developmentSuggestion: "Penambahan fitur voice input untuk user yang kesulitan mengetik, integrasi dengan wearable devices untuk monitoring physiological data, dan sistem referral otomatis ke psikolog berlisensi untuk kasus urgent.",
    thumbnail: "/assets/projects/mental-health-1.jpg",
    images: [
      "/assets/projects/mental-health-1.jpg",
      "/assets/projects/mental-health-2.jpg"
    ],
    status: "Approved",
    rating: 4.7,
    driveLink: "https://drive.google.com/drive/folders/6fG7hI8jK9lM0nO1pQ2rS3tU4vW5xY",
    availableForContinuation: true,
  },
  {
    id: "7",
    title: "Composting Monitoring System",
    category: "Pengelolaan Sampah",
    group: "Kelompok Green G",
    date: new Date(Date.now() - 6 * 86400000).toISOString(),
    summary: "Sistem monitoring proses pengomposan sampah organik yang mengukur suhu, kelembaban, dan pH secara real-time.",
    description: "IoT system yang menggunakan multiple sensors untuk memonitor kondisi optimal pengomposan. Automatic water sprinkler untuk menjaga kelembaban, dan aerator otomatis untuk oksigenasi. Dashboard menampilkan progress pengomposan.",
    evaluation: "Berhasil mempercepat proses pengomposan 30% dibanding metode tradisional. Kualitas kompos meningkat dengan C/N ratio optimal. Sistem alert bekerja dengan baik untuk kondisi abnormal. Efisiensi penggunaan air meningkat 40%.",
    developmentSuggestion: "Implementasi AI untuk prediksi waktu panen kompos yang optimal, integrasi dengan smart waste bin untuk tracking origin sampah organik, dan marketplace untuk penjualan kompos yang dihasilkan.",
    thumbnail: "/assets/projects/compost-1.jpg",
    images: [
      "/assets/projects/compost-1.jpg",
      "/assets/projects/compost-2.jpg",
      "/assets/projects/compost-3.jpg"
    ],
    status: "Approved",
    rating: 4.2,
    driveLink: "https://drive.google.com/drive/folders/7gH8iJ9kL0mN1oP2qR3sT4uV5wX6yZ",
    availableForContinuation: false,
  },
  {
    id: "8",
    title: "Bike Sharing System dengan IoT Lock",
    category: "Transportasi Ramah Lingkungan",
    group: "Kelompok Mobility H",
    date: new Date(Date.now() - 7 * 86400000).toISOString(),
    summary: "Sistem bike sharing dengan smart lock IoT yang dapat dibuka melalui aplikasi mobile dan GPS tracking untuk anti-theft.",
    description: "Platform bike sharing yang menggunakan IoT smart lock dengan Bluetooth dan GSM connectivity. User dapat menemukan, booking, dan unlock sepeda melalui mobile app. GPS tracker untuk monitoring lokasi real-time.",
    evaluation: "Berhasil deploy 100 sepeda di kampus dengan utilization rate 4.5 trip/bike/day. Theft rate hanya 2% berkat GPS tracking. User satisfaction 4.3/5. Average trip distance 2.3 km dengan duration 15 menit.",
    developmentSuggestion: "Implementasi electric bike untuk jarak tempuh lebih jauh, dynamic pricing berdasarkan demand, predictive maintenance menggunakan IoT sensors untuk monitoring kondisi sepeda, dan expansion ke area publik di luar kampus.",
    thumbnail: "/assets/projects/bike-1.jpg",
    images: [
      "/assets/projects/bike-1.jpg",
      "/assets/projects/bike-2.jpg"
    ],
    status: "Approved",
    rating: 4.5,
    driveLink: "https://drive.google.com/drive/folders/8hI9jK0lM1nO2pQ3rS4tU5vW6xY7zA",
    availableForContinuation: true,
  },
  {
    id: "9",
    title: "Smart Street Lighting System",
    category: "Smart City",
    group: "Kelompok Urban I",
    date: new Date(Date.now() - 8 * 86400000).toISOString(),
    summary: "Sistem penerangan jalan pintar yang dapat menyesuaikan intensitas cahaya berdasarkan kondisi lingkungan dan deteksi kehadiran.",
    description: "Lampu jalan LED yang dilengkapi dengan light sensor, motion sensor, dan konektivitas LoRaWAN. Dapat dimming otomatis saat tidak ada aktivitas untuk menghemat energi. Central management system untuk monitoring dan control.",
    evaluation: "Penghematan energi mencapai 65% dibanding lampu jalan konvensional. Response time motion detection < 0.5 detik. Uptime sistem 99.5%. Biaya maintenance berkurang 40% dengan predictive maintenance.",
    developmentSuggestion: "Integrasi dengan weather forecast untuk penyesuaian cahaya saat mendung/hujan, implementasi panic button untuk keamanan, dan penambahan environmental sensors (suhu, kelembaban, kualitas udara) untuk smart city dashboard.",
    thumbnail: "/assets/projects/street-light-1.jpg",
    images: [
      "/assets/projects/street-light-1.jpg",
      "/assets/projects/street-light-2.jpg",
      "/assets/projects/street-light-3.jpg"
    ],
    status: "Approved",
    rating: 4.4,
    driveLink: "https://drive.google.com/drive/folders/9iJ0kL1mN2oP3qR4sT5uV6wX7yZ8aB",
    availableForContinuation: true,
  },
  {
    id: "10",
    title: "Healthcare Data Analytics Dashboard",
    category: "Kesehatan",
    group: "Kelompok Data J",
    date: new Date(Date.now() - 9 * 86400000).toISOString(),
    summary: "Dashboard analytics untuk rumah sakit yang mengintegrasikan data pasien, inventory obat, dan operational metrics untuk decision making.",
    description: "Web-based dashboard yang mengintegrasikan data dari berbagai sistem rumah sakit (EMR, pharmacy, lab). Menampilkan KPI, trend analysis, predictive analytics untuk bed occupancy, dan inventory forecasting untuk obat-obatan.",
    evaluation: "Berhasil mengintegrasikan 5 sistem berbeda. Dashboard load time < 2 detik. Prediction accuracy untuk bed occupancy 89%. Inventory optimization mengurangi stock out 45% dan overstock 30%. User adoption rate 78% dari staff medis.",
    developmentSuggestion: "Implementasi real-time alerting untuk kondisi kritis, machine learning untuk prediksi readmission pasien, integrasi dengan insurance system untuk automated claim processing, dan mobile app untuk monitoring on-the-go.",
    thumbnail: "/assets/projects/healthcare-dashboard-1.jpg",
    images: [
      "/assets/projects/healthcare-dashboard-1.jpg",
      "/assets/projects/healthcare-dashboard-2.jpg"
    ],
    status: "Approved",
    rating: 4.6,
    driveLink: "https://drive.google.com/drive/folders/0jK1lM2nO3pQ4rS5tU6vW7xY8zA9bC",
    availableForContinuation: true,
  },
  {
    id: "11",
    title: "Plastic Waste Collection Gamification App",
    category: "Pengelolaan Sampah",
    group: "Kelompok Recycle K",
    date: new Date(Date.now() - 10 * 86400000).toISOString(),
    summary: "Aplikasi mobile yang menggunakan gamification untuk mendorong masyarakat mengumpulkan dan mendaur ulang sampah plastik.",
    description: "Mobile app dengan sistem poin reward untuk setiap plastik yang dikumpulkan. QR code scanning untuk verification, leaderboard, achievement badges, dan marketplace untuk menukar poin dengan voucher atau produk daur ulang.",
    evaluation: "Total 5000+ user dalam 3 bulan pilot. Berhasil mengumpulkan 2.5 ton sampah plastik. Average daily active user 45%. User engagement rate tinggi dengan 4.1 session/user/week. Partnership dengan 20+ merchant lokal.",
    developmentSuggestion: "Implementasi AR game untuk 'treasure hunt' sampah plastik, blockchain untuk transparency tracking recycling process, corporate CSR integration untuk funding reward pool, dan expansion ke jenis sampah lainnya (kertas, logam).",
    thumbnail: "/assets/projects/plastic-app-1.jpg",
    images: [
      "/assets/projects/plastic-app-1.jpg",
      "/assets/projects/plastic-app-2.jpg",
      "/assets/projects/plastic-app-3.jpg"
    ],
    status: "Approved",
    rating: 4.3,
    driveLink: "https://drive.google.com/drive/folders/1kL2mN3oP4qR5sT6uV7wX8yZ9aB0cD",
    availableForContinuation: false,
  },
  {
    id: "12",
    title: "EV Charging Station Finder & Booking",
    category: "Transportasi Ramah Lingkungan",
    group: "Kelompok EV L",
    date: new Date(Date.now() - 11 * 86400000).toISOString(),
    summary: "Platform untuk menemukan, booking, dan monitoring charging station kendaraan listrik dengan route planning terintegrasi.",
    description: "Mobile dan web app yang menampilkan peta real-time ketersediaan charging station. Fitur booking slot, payment integration, route planner yang memperhitungkan battery level dan charging stops, serta community review & rating.",
    evaluation: "Database 150+ charging station terverifikasi. Average booking conversion rate 72%. Route planner accuracy 94%. Payment integration success rate 99.2%. User base 2000+ EV owners dengan retention rate 68%.",
    developmentSuggestion: "Implementasi dynamic pricing saat peak hours, loyalty program untuk frequent users, integration dengan car manufacturers untuk direct battery status access, dan predictive maintenance alert untuk charging station operators.",
    thumbnail: "/assets/projects/ev-charging-1.jpg",
    images: [
      "/assets/projects/ev-charging-1.jpg",
      "/assets/projects/ev-charging-2.jpg"
    ],
    status: "Approved",
    rating: 4.7,
    driveLink: "https://drive.google.com/drive/folders/2lM3nO4pQ5rS6tU7vW8xY9zA0bC1dE",
    availableForContinuation: true,
  },
  {
    id: "13",
    title: "Smart Water Quality Monitoring",
    category: "Smart City",
    group: "Kelompok Water M",
    date: new Date(Date.now() - 12 * 86400000).toISOString(),
    summary: "Sistem monitoring kualitas air sungai secara real-time menggunakan sensor IoT dan machine learning untuk deteksi polusi.",
    description: "Network sensor IoT yang mengukur pH, turbidity, dissolved oxygen, temperature, dan conductivity di multiple points sungai. Data streaming ke cloud, dianalisis dengan ML untuk deteksi anomaly dan pollution source prediction.",
    evaluation: "Berhasil deploy 15 sensor nodes sepanjang 10km sungai. Data accuracy 96% dibanding lab testing. Pollution event detection dengan 30 menit faster dari metode konvensional. Alert system reliability 98%.",
    developmentSuggestion: "Integrasi dengan drone untuk sampling dan visual inspection saat terdeteksi polusi, collaboration dengan industri untuk automated compliance reporting, dan public dashboard untuk transparansi kualitas air ke masyarakat.",
    thumbnail: "/assets/projects/water-quality-1.jpg",
    images: [
      "/assets/projects/water-quality-1.jpg",
      "/assets/projects/water-quality-2.jpg",
      "/assets/projects/water-quality-3.jpg"
    ],
    status: "Approved",
    rating: 4.5,
    driveLink: "https://drive.google.com/drive/folders/3mN4oP5qR6sT7uV8wX9yZ0aB1cD2eF",
    availableForContinuation: true,
  },
  {
    id: "14",
    title: "Elderly Care Monitoring System",
    category: "Kesehatan",
    group: "Kelompok Care N",
    date: new Date(Date.now() - 13 * 86400000).toISOString(),
    summary: "Sistem monitoring kesehatan lansia menggunakan wearable devices dan AI untuk deteksi kondisi abnormal dan emergency alert.",
    description: "Smartwatch khusus lansia yang monitor heart rate, blood pressure, activity level, dan fall detection. Data dikirim ke caregiver app dengan AI analytics untuk pattern recognition dan early warning system untuk kondisi kesehatan yang memburuk.",
    evaluation: "Testing dengan 50 elderly users selama 6 bulan. Fall detection accuracy 91%. False alarm rate hanya 5%. Emergency response time berkurang dari 15 menit ke 3 menit. User comfort rating 4.4/5 untuk wearable device.",
    developmentSuggestion: "Integrasi dengan smart home untuk automated environmental control (AC, lights), medication reminder dengan dispenser otomatis, video call feature untuk easy communication dengan family, dan integration dengan ambulance dispatch system.",
    thumbnail: "/assets/projects/elderly-care-1.jpg",
    images: [
      "/assets/projects/elderly-care-1.jpg",
      "/assets/projects/elderly-care-2.jpg"
    ],
    status: "Waiting for Response",
    rating: 4.6,
    driveLink: "https://drive.google.com/drive/folders/4nO5pQ6rS7tU8vW9xY0zA1bC2dE3fG",
    availableForContinuation: true,
  },
  {
    id: "15",
    title: "Organic Waste to Biogas Converter",
    category: "Pengelolaan Sampah",
    group: "Kelompok Energy O",
    date: new Date(Date.now() - 14 * 86400000).toISOString(),
    summary: "Sistem konversi sampah organik rumah tangga menjadi biogas untuk memasak dengan monitoring IoT dan automated process control.",
    description: "Biodigester skala rumah tangga dengan sistem automated feeding, temperature control, pressure monitoring, dan gas storage. IoT sensors untuk optimize biogas production dan mobile app untuk monitoring daily gas production dan usage.",
    evaluation: "Prototype dapat process 5kg sampah organik/hari menghasilkan 1.5m³ biogas. Cukup untuk memasak 3-4 jam. Conversion efficiency 65%. System payback period 2.5 tahun. Residue slurry berkualitas tinggi sebagai pupuk organik.",
    developmentSuggestion: "Scaling up untuk community level (20-50 rumah), safety features enhancement dengan multiple fail-safe mechanisms, integration dengan smart stove untuk automated cooking, dan carbon credit mechanism untuk additional revenue stream.",
    thumbnail: "/assets/projects/biogas-1.jpg",
    images: [
      "/assets/projects/biogas-1.jpg",
      "/assets/projects/biogas-2.jpg",
      "/assets/projects/biogas-3.jpg",
      "/assets/projects/biogas-4.jpg"
    ],
    status: "Rejected",
    rating: 3.9,
    driveLink: "https://drive.google.com/drive/folders/5oP6qR7sT8uV9wX0yZ1aB2cD3eF4gH",
    availableForContinuation: false,
  },
];

export const MOCK_REQUESTS = [
  {
    id: "r-1",
    projectId: "1",
    projectTitle: "Smart Air Quality Monitor",
    requester: "Budi",
    message: "Saya mau lanjutkan dan implementasi sensor tambahan.",
    status: "Waiting for Response",
    createdAt: new Date().toISOString(),
    // optional proposalFile: { name, mime, size, base64 }
  },
];

// ✅ NEW: Mock data untuk Proyek Saya (User's own projects)
export const MOCK_MY_PROJECTS = [
  {
    id: "my-1",
    title: "Smart Parking System dengan IoT",
    category: "Smart City",
    group: "Kelompok Smart E",
    year: "2024",
    semester: "Genap",
    status: "In Progress", // "Draft", "In Progress", "Completed", "Approved", "Rejected"
    summary: "Sistem parkir pintar yang mendeteksi ketersediaan slot parkir menggunakan sensor dan memberikan guidance ke pengemudi melalui mobile app.",
    description: "Implementasi sensor ultrasonik di setiap slot parkir yang terhubung ke microcontroller ESP32. Data dikirim ke server melalui WiFi dan dapat diakses pengguna melalui aplikasi mobile untuk menemukan slot parkir kosong terdekat.",
    evaluation: "Sistem berhasil mengurangi waktu mencari parkir hingga 40%. Akurasi deteksi slot kosong 96%. Battery life sensor mencapai 6 bulan.",
    developmentSuggestion: "Implementasi pembayaran parkir otomatis menggunakan license plate recognition, integrasi dengan Google Maps untuk routing.",
    thumbnail: "/assets/projects/parking-1.jpg",
    images: [
      "/assets/projects/parking-1.jpg",
      "/assets/projects/parking-2.jpg",
      "/assets/projects/parking-3.jpg"
    ],
    rating: 4.4,
    members: [
      { id: 1, name: "Ahmad Rizki", nim: "21/234567/TK/12345", role: "Project Leader", jurusan: "Teknik Elektro" },
      { id: 2, name: "Siti Nurhaliza", nim: "21/234568/TK/12346", role: "Hardware Engineer", jurusan: "Teknik Elektro" },
      { id: 3, name: "Budi Santoso", nim: "21/234569/TK/12347", role: "Software Developer", jurusan: "Teknik Informatika" },
      { id: 4, name: "Dewi Lestari", nim: "21/234570/TK/12348", role: "UI/UX Designer", jurusan: "Teknik Informatika" }
    ],
    documents: [
      { id: 1, name: "Proposal Capstone.pdf", type: "Proposal", uploadedAt: "2024-02-15", size: "2.3 MB", url: "#" },
      { id: 2, name: "Design Document.pdf", type: "Design", uploadedAt: "2024-03-20", size: "1.8 MB", url: "#" },
      { id: 3, name: "Progress Report 1.pdf", type: "Report", uploadedAt: "2024-04-10", size: "1.2 MB", url: "#" }
    ],
    milestones: [
      { id: 1, title: "Research & Planning", status: "Completed", date: "2024-02-28" },
      { id: 2, title: "Hardware Development", status: "Completed", date: "2024-04-15" },
      { id: 3, title: "Software Development", status: "In Progress", date: "2024-06-30" },
      { id: 4, title: "Testing & Integration", status: "Pending", date: "2024-08-15" },
      { id: 5, title: "Final Presentation", status: "Pending", date: "2024-09-30" }
    ],
    availableForContinuation: true,
    createdAt: "2024-02-01T10:00:00.000Z",
    updatedAt: "2024-05-15T14:30:00.000Z"
  },
  {
    id: "my-2",
    title: "AI-Powered Mental Health Chatbot",
    category: "Kesehatan",
    group: "Kelompok AI Health F",
    year: "2023",
    semester: "Genap",
    status: "Completed",
    summary: "Chatbot berbasis AI untuk deteksi dini gangguan mental dan memberikan dukungan emosional serta rekomendasi profesional.",
    description: "Chatbot menggunakan Natural Language Processing untuk menganalisis pola percakapan pengguna dan mendeteksi tanda-tanda depresi, anxiety, atau stress. Dilengkapi dengan sentiment analysis dan mood tracking.",
    evaluation: "Akurasi deteksi kondisi mental mencapai 84% dibanding assessment psikolog profesional. Average conversation satisfaction rate 4.2/5. Response time < 1 detik. Telah melayani 1000+ sesi konsultasi.",
    developmentSuggestion: "Penambahan fitur voice input untuk user yang kesulitan mengetik, integrasi dengan wearable devices untuk monitoring physiological data.",
    thumbnail: "/assets/projects/mental-health-1.jpg",
    images: [
      "/assets/projects/mental-health-1.jpg",
      "/assets/projects/mental-health-2.jpg"
    ],
    rating: 4.7,
    members: [
      { id: 1, name: "Rina Wijaya", nim: "20/234567/TK/11234", role: "Project Leader", jurusan: "Teknik Informatika" },
      { id: 2, name: "Andi Pratama", nim: "20/234568/TK/11235", role: "AI Engineer", jurusan: "Teknik Informatika" },
      { id: 3, name: "Maya Kusuma", nim: "20/234569/TK/11236", role: "Backend Developer", jurusan: "Sistem Informasi" }
    ],
    documents: [
      { id: 1, name: "Final Report.pdf", type: "Report", uploadedAt: "2023-09-20", size: "4.5 MB", url: "#" },
      { id: 2, name: "Presentation Slides.pdf", type: "Presentation", uploadedAt: "2023-09-25", size: "3.2 MB", url: "#" },
      { id: 3, name: "Source Code Documentation.pdf", type: "Documentation", uploadedAt: "2023-09-28", size: "2.1 MB", url: "#" }
    ],
    milestones: [
      { id: 1, title: "Research & Planning", status: "Completed", date: "2023-02-28" },
      { id: 2, title: "Model Development", status: "Completed", date: "2023-05-15" },
      { id: 3, title: "Application Development", status: "Completed", date: "2023-07-30" },
      { id: 4, title: "Testing & Deployment", status: "Completed", date: "2023-08-31" },
      { id: 5, title: "Final Presentation", status: "Completed", date: "2023-09-25" }
    ],
    availableForContinuation: true,
    createdAt: "2023-02-01T08:00:00.000Z",
    updatedAt: "2023-09-28T16:45:00.000Z"
  },
  {
    id: "my-3",
    title: "Smart Waste Segregation System",
    category: "Pengelolaan Sampah",
    group: "Kelompok Enviro C",
    year: "2024",
    semester: "Ganjil",
    status: "Draft",
    summary: "Tempat sampah pintar yang dapat memisahkan sampah organik dan anorganik secara otomatis menggunakan computer vision.",
    description: "Sistem yang menggunakan kamera dan model deep learning untuk mengenali jenis sampah (organik, plastik, kertas, logam) dan secara otomatis memisahkannya ke kompartemen yang sesuai menggunakan mekanisme servo motor.",
    evaluation: "",
    developmentSuggestion: "",
    thumbnail: "/assets/projects/waste-1.jpg",
    images: [
      "/assets/projects/waste-1.jpg"
    ],
    rating: 0,
    members: [
      { id: 1, name: "Fajar Ramadan", nim: "21/234571/TK/12349", role: "Project Leader", jurusan: "Teknik Elektro" },
      { id: 2, name: "Linda Setiawan", nim: "21/234572/TK/12350", role: "Machine Learning Engineer", jurusan: "Teknik Informatika" },
      { id: 3, name: "Rudi Hartono", nim: "21/234573/TK/12351", role: "Hardware Engineer", jurusan: "Teknik Elektro" }
    ],
    documents: [
      { id: 1, name: "Initial Proposal Draft.pdf", type: "Proposal", uploadedAt: "2024-09-05", size: "1.5 MB", url: "#" }
    ],
    milestones: [
      { id: 1, title: "Research & Planning", status: "In Progress", date: "2024-10-31" },
      { id: 2, title: "Prototype Development", status: "Pending", date: "2024-12-15" },
      { id: 3, title: "Testing & Refinement", status: "Pending", date: "2025-01-31" },
      { id: 4, title: "Final Implementation", status: "Pending", date: "2025-03-15" },
      { id: 5, title: "Final Presentation", status: "Pending", date: "2025-05-30" }
    ],
    availableForContinuation: false,
    createdAt: "2024-09-01T09:00:00.000Z",
    updatedAt: "2024-09-05T11:20:00.000Z"
  }
];

// ✅ NEW: Incoming Requests untuk proyek yang user miliki
export const MOCK_INCOMING_REQUESTS = [
  {
    id: "req-in-1",
    projectId: "my-2", // AI Mental Health Chatbot
    projectTitle: "AI-Powered Mental Health Chatbot",
    requesterName: "Kelompok New Gen",
    requesterEmail: "newgen@mail.ugm.ac.id",
    subject: "Request to Continue Mental Health Chatbot Project",
    message: "Kami tertarik untuk melanjutkan project chatbot kesehatan mental ini dengan menambahkan fitur voice input dan integrasi dengan wearable devices. Tim kami memiliki expertise di bidang speech recognition dan IoT yang dapat melengkapi project yang sudah ada.",
    status: "Waiting for Response", // "Waiting for Response", "Approved", "Rejected"
    proposalFile: {
      name: "Proposal_Continuation_Mental_Health_Chatbot.pdf",
      mime: "application/pdf",
      size: 2458000,
      base64: ""
    },
    createdAt: "2024-11-10T14:30:00.000Z"
  },
  {
    id: "req-in-2",
    projectId: "my-1", // Smart Parking
    projectTitle: "Smart Parking System dengan IoT",
    requesterName: "Kelompok Innovators",
    requesterEmail: "innovators@mail.ugm.ac.id",
    subject: "Proposal untuk Pengembangan Smart Parking",
    message: "Halo, kami ingin melanjutkan project smart parking dengan menambahkan fitur payment gateway dan license plate recognition. Kami sudah melakukan riset awal dan yakin bisa mengimplementasikan fitur tersebut dalam waktu 6 bulan.",
    status: "Approved",
    proposalFile: null,
    createdAt: "2024-10-25T09:15:00.000Z",
    respondedAt: "2024-10-28T16:45:00.000Z"
  },
  {
    id: "req-in-3",
    projectId: "my-2", // AI Mental Health Chatbot
    projectTitle: "AI-Powered Mental Health Chatbot",
    requesterName: "Kelompok Tech Savvy",
    requesterEmail: "techsavvy@mail.ugm.ac.id",
    subject: "Melanjutkan Development Chatbot",
    message: "Kami ingin melanjutkan project ini dengan fokus pada multilingual support dan integrasi dengan platform media sosial untuk jangkauan yang lebih luas.",
    status: "Rejected",
    proposalFile: null,
    createdAt: "2024-11-05T11:20:00.000Z",
    respondedAt: "2024-11-08T10:30:00.000Z",
    rejectionReason: "Terima kasih atas minatnya. Namun saat ini kami sudah menerima tim lain untuk melanjutkan project ini. Semoga di kesempatan lain bisa berkolaborasi."
  }
];

// Enhance incoming requests with sample group details (description, image, members)
// so UI can render requester group profile for review.
MOCK_INCOMING_REQUESTS.forEach((r) => {
  if (!r.groupDescription) {
    r.groupDescription = `Kelompok ${r.requesterName} adalah tim yang memiliki latar belakang multidisiplin dan pengalaman pada topik terkait proyek. Mereka menawarkan kombinasi keahlian teknis dan manajerial untuk melanjutkan pengembangan proyek.`;
  }
  if (!r.groupImage) {
    r.groupImage = "/assets/projects/thumb-placeholder.png";
  }
  if (!Array.isArray(r.members)) {
    // provide small sample members for demo purposes
    r.members = [
      {
        id: `${r.id}-m1`,
        name: "Anggota Satu",
        nim: "21/000001/TK/00001",
        major: "Teknik Informatika",
        portfolioUrl: "https://example.com/portfolio/anggota1",
        linkedinUrl: "https://linkedin.com/in/anggota1"
      },
      {
        id: `${r.id}-m2`,
        name: "Anggota Dua",
        nim: "21/000002/TK/00002",
        major: "Teknik Elektro",
        portfolioUrl: "",
        linkedinUrl: "https://linkedin.com/in/anggota2"
      }
    ];
  }
});

/**
 * Helpers (small convenience functions)
 * - getProjectById(id)
 * - createProject(payload) -> new project
 * - getRequestById(id)
 * - createRequest(payload) -> new request
 * - updateRequestStatus(id, status) -> updated request or null
 */

export function getProjectById(id) {
  return MOCK_PROJECTS.find((p) => String(p.id) === String(id)) || null;
}

export function createProject(payload = {}) {
  const newProject = {
    id: String(Date.now()),
    title: String(payload.title || "Untitled Project"),
    category: payload.category || "-",
    group: payload.group || "-",
    date: new Date().toISOString(),
    summary: payload.summary || "",
    description: payload.description || "",
    evaluation: payload.evaluation || "",
    developmentSuggestion: payload.developmentSuggestion || "",
    thumbnail: payload.thumbnail || "/assets/thumb-placeholder.png",
    images: Array.isArray(payload.images) ? payload.images : [payload.thumbnail || "/assets/thumb-placeholder.png"],
    status: payload.status || "Waiting for Response",
    rating: typeof payload.rating === "number" ? payload.rating : 0,
    driveLink: payload.driveLink || null,
  };
  MOCK_PROJECTS.unshift(newProject);
  return newProject;
}

export function getRequestById(id) {
  return MOCK_REQUESTS.find((r) => String(r.id) === String(id)) || null;
}

export function createRequest(payload = {}) {
  const newReq = {
    id: `r-${Date.now()}`,
    projectId: String(payload.projectId || ""),
    projectTitle: String(payload.projectTitle || ""),
    subject: payload.subject || "",
    message: String(payload.message || ""),
    status: "Waiting for Response",
    createdAt: new Date().toISOString(),
    proposalFile: payload.proposalFile
      ? {
          name: String(payload.proposalFile.name || ""),
          mime: String(payload.proposalFile.mime || "application/octet-stream"),
          size: Number(payload.proposalFile.size || 0),
          base64: String(payload.proposalFile.base64 || ""), // base64 string WITHOUT data:* prefix
        }
      : null,
  };
  MOCK_REQUESTS.unshift(newReq);
  return newReq;
}

export function updateRequestStatus(id, status) {
  const valid = ["Waiting for Response", "Approved", "Rejected"];
  if (!valid.includes(status)) throw new Error("Invalid status");
  const idx = MOCK_REQUESTS.findIndex((r) => String(r.id) === String(id));
  if (idx === -1) return null;
  MOCK_REQUESTS[idx].status = status;
  return MOCK_REQUESTS[idx];
}

// ✅ NEW: Helper functions untuk My Projects
export function getMyProjectById(id) {
  return MOCK_MY_PROJECTS.find((p) => String(p.id) === String(id)) || null;
}

export function getMyProjects() {
  return [...MOCK_MY_PROJECTS];
}

export function createMyProject(payload = {}) {
  const newProject = {
    id: `my-${Date.now()}`,
    title: String(payload.title || "Untitled Project"),
    category: payload.category || "-",
    group: payload.group || "-",
    year: payload.year || new Date().getFullYear().toString(),
    semester: payload.semester || "Ganjil",
    status: payload.status || "Draft",
    summary: payload.summary || "",
    description: payload.description || "",
    evaluation: payload.evaluation || "",
    developmentSuggestion: payload.developmentSuggestion || "",
    thumbnail: payload.thumbnail || "/assets/thumb-placeholder.png",
    images: Array.isArray(payload.images) ? payload.images : [payload.thumbnail || "/assets/thumb-placeholder.png"],
    rating: typeof payload.rating === "number" ? payload.rating : 0,
    members: Array.isArray(payload.members) ? payload.members : [],
    documents: Array.isArray(payload.documents) ? payload.documents : [],
    milestones: Array.isArray(payload.milestones) ? payload.milestones : [],
    availableForContinuation: Boolean(payload.availableForContinuation),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  MOCK_MY_PROJECTS.unshift(newProject);
  return newProject;
}

export function updateMyProject(id, payload = {}) {
  const idx = MOCK_MY_PROJECTS.findIndex((p) => String(p.id) === String(id));
  if (idx === -1) return null;
  
  MOCK_MY_PROJECTS[idx] = {
    ...MOCK_MY_PROJECTS[idx],
    ...payload,
    updatedAt: new Date().toISOString()
  };
  return MOCK_MY_PROJECTS[idx];
}

export function deleteMyProject(id) {
  const idx = MOCK_MY_PROJECTS.findIndex((p) => String(p.id) === String(id));
  if (idx === -1) return false;
  MOCK_MY_PROJECTS.splice(idx, 1);
  return true;
}

// ✅ NEW: Helper functions untuk Incoming Requests
export function getIncomingRequests(projectId = null) {
  if (projectId) {
    return MOCK_INCOMING_REQUESTS.filter((r) => String(r.projectId) === String(projectId));
  }
  return [...MOCK_INCOMING_REQUESTS];
}

export function getIncomingRequestById(id) {
  return MOCK_INCOMING_REQUESTS.find((r) => String(r.id) === String(id)) || null;
}

export function updateIncomingRequestStatus(id, status, rejectionReason = null) {
  const valid = ["Waiting for Response", "Approved", "Rejected"];
  if (!valid.includes(status)) throw new Error("Invalid status");
  
  const idx = MOCK_INCOMING_REQUESTS.findIndex((r) => String(r.id) === String(id));
  if (idx === -1) return null;
  
  MOCK_INCOMING_REQUESTS[idx].status = status;
  MOCK_INCOMING_REQUESTS[idx].respondedAt = new Date().toISOString();
  
  if (status === "Rejected" && rejectionReason) {
    MOCK_INCOMING_REQUESTS[idx].rejectionReason = rejectionReason;
  }
  
  return MOCK_INCOMING_REQUESTS[idx];
}
