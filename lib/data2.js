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
