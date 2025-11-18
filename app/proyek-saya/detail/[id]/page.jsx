"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import FixLayout from "../../../../components/FixLayout";

const Stars = ({ rating = 0 }) => {
  const r = Math.max(0, Math.min(5, Number(rating || 0)));
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <img
          key={i}
          src={i < Math.round(r) ? "/assets/icons/star-filled.png" : "/assets/icons/star-empty.png"}
          alt="star"
          className="w-6 h-6"
        />
      ))}
    </div>
  );
};

// Fungsi untuk mendapatkan warna status
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case "selesai":
    case "completed":
      return "bg-green-100 text-green-800";
    case "dalam pengerjaan":
    case "in progress":
      return "bg-yellow-100 text-yellow-800";
    case "ditolak":
    case "rejected":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export default function DetailProyekPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchProject = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching project with ID:", id);

        const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
          headers: { 
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setProject(data);
        } else {
          console.error("Failed to fetch project:", response.status);
          setProject(null);
        }
      } catch (err) {
        console.error("Error fetching project:", err);
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // Fungsi untuk navigasi gambar
  const handlePrevImage = () => {
    if (transformedProject?.images?.length) {
      setSelectedImageIndex(prev => 
        prev === 0 ? transformedProject.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (transformedProject?.images?.length) {
      setSelectedImageIndex(prev => 
        prev === transformedProject.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleDeleteProject = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus proyek ini?")) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
          method: "DELETE",
          credentials: "include",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          router.push("/proyek-saya");
        } else {
          alert("Gagal menghapus proyek");
        }
      } catch (err) {
        console.error("Error deleting project:", err);
        alert("Terjadi kesalahan saat menghapus proyek");
      }
    }
  };

  // Transformasi data dengan fallback yang lebih aman
  const transformedProject = project
    ? {
        ...project,
        _id: project._id || id,
        category: project.theme || "Tidak ada kategori",
        group: project.ownerId?.groupName || project.groupName || "Nama Kelompok",
        rating: project.avgRating || project.rating || 0,
        ratingCount: project.ratingCount || 0,
        description: project.summary || project.description || "Tidak ada deskripsi",
        developmentSuggestion: project.suggestion || project.developmentSuggestion || "Tidak ada saran pengembangan",
        evaluation: project.evaluation || "Tidak ada evaluasi",
        images: project.projectPhotoUrls || project.images || [],
        thumbnail: (project.projectPhotoUrls?.[0] || project.thumbnail || "/assets/images/default-project.jpg"),
        members: project.ownerId?.members || project.members || [],
        status: project.status || "Tidak diketahui",
        title: project.title || "Judul Tidak Tersedia",
        documents: project.proposalDriveLink
          ? [
              {
                id: project.proposalDriveLink.driveFileId || "1",
                name: project.proposalDriveLink.fileName || "Proposal",
                type: "Proposal",
                size: "PDF",
                uploadedAt: project.createdAt 
                  ? new Date(project.createdAt).toLocaleDateString("id-ID")
                  : new Date().toLocaleDateString("id-ID"),
                url: project.proposalDriveLink.downloadLink,
                viewLink: project.proposalDriveLink.viewLink,
              },
            ]
          : project.documents || [],
      }
    : null;

  const currentImage =
    transformedProject?.images?.[selectedImageIndex] ||
    transformedProject?.thumbnail ||
    "/assets/images/default-project.jpg";

  if (loading) {
    return (
      <FixLayout>
        <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#004A74]"></div>
            <p className="text-gray-500 mt-4">Memuat detail proyek...</p>
          </div>
        </div>
      </FixLayout>
    );
  }

  if (!project || !transformedProject) {
    return (
      <FixLayout>
        <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-700 mb-4">Proyek Tidak Ditemukan</h2>
            <p className="text-gray-500 mb-6">
              Proyek yang Anda cari tidak ditemukan atau mungkin telah dihapus.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push("/proyek-saya")}
                className="px-6 py-2 bg-[#004A74] text-white rounded-lg hover:bg-[#003d5e] transition text-sm font-semibold"
              >
                Kembali ke Proyek Saya
              </button>
              <button
                onClick={() => router.push("/proyek-saya/add")}
                className="px-6 py-2 border border-[#004A74] text-[#004A74] rounded-lg hover:bg-blue-50 transition text-sm font-semibold"
              >
                Tambahkan Proyek
              </button>
            </div>
          </div>
        </div>
      </FixLayout>
    );
  }

  return (
    <FixLayout>
      <div className="min-h-screen bg-[#FCFCFC]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <span className="hover:text-[#004A74] cursor-pointer" onClick={() => router.push("/")}>
              Homepage
            </span>
            <span>›</span>
            <span className="hover:text-[#004A74] cursor-pointer" onClick={() => router.push("/proyek-saya")}>
              Proyek Saya
            </span>
            <span>›</span>
            <span className="text-[#004A74] font-semibold truncate max-w-[200px]">
              {transformedProject.title}
            </span>
          </div>

          {/* Main Content */}
          <div className="flex flex-col gap-8 mb-12">
            {/* Image */}
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden h-[400px] group">
                <img 
                  src={currentImage} 
                  alt={transformedProject.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = "/assets/images/default-project.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {transformedProject.images?.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-6 h-6 text-[#004A74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition opacity-0 group-hover:opacity-100"
                    >
                      <svg className="w-6 h-6 text-[#004A74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {transformedProject.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            selectedImageIndex === idx ? "bg-[#FED400] w-6" : "bg-white/50 hover:bg-white/75"
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {transformedProject.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {transformedProject.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition ${
                        selectedImageIndex === idx ? "border-[#004A74]" : "border-gray-200 hover:border-[#004A74]"
                      }`}
                    >
                      <img 
                        src={img} 
                        alt={`Thumbnail ${idx + 1}`} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = "/assets/images/default-project.jpg";
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#004A74] mb-3">{transformedProject.title}</h1>
                <div className="mb-0">
                  <span className="inline-block text-lg font-regular text-[#004A74] py-1 rounded-full">
                    {transformedProject.category}
                  </span>
                </div>
                <p className="text-md text-gray-600 mb-2 font-regular">{transformedProject.group}</p>

                <div className="mb-4 flex items-center justify-between gap-3">
                  <Stars rating={transformedProject.rating} />
                  <span className="text-sm text-gray-500">({transformedProject.ratingCount || 0} rating)</span>
                </div>

                <div
                  className={`inline-block text-sm px-3 py-1 rounded-full font-medium ${getStatusColor(
                    transformedProject.status
                  )}`}
                >
                  {transformedProject.status}
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => router.push(`/proyek-saya/request?projectId=${transformedProject._id}`)}
                  className="px-4 py-2 border border-[#004A74] text-[#004A74] rounded-lg hover:bg-blue-50 transition text-sm font-semibold"
                >
                  Lihat Request Masuk
                </button>
                <button
                  onClick={() => router.push(`/proyek-saya/add?id=${transformedProject._id}`)}
                  className="px-4 py-2 bg-[#004A74] text-white rounded-lg hover:bg-[#003d5e] transition text-sm font-semibold"
                >
                  Edit Proyek
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
                >
                  Hapus Proyek
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="flex border-b border-gray-200 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`px-6 py-3 text-sm font-semibold transition whitespace-nowrap ${
                    activeTab === "info"
                      ? "text-[#004A74] border-b-2 border-[#FED400]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Informasi Proyek
                </button>
                <button
                  onClick={() => setActiveTab("members")}
                  className={`px-6 py-3 text-sm font-semibold transition whitespace-nowrap ${
                    activeTab === "members"
                      ? "text-[#004A74] border-b-2 border-[#FED400]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Anggota ({transformedProject.members?.length || 0})
                </button>
                <button
                  onClick={() => setActiveTab("documents")}
                  className={`px-6 py-3 text-sm font-semibold transition whitespace-nowrap ${
                    activeTab === "documents"
                      ? "text-[#004A74] border-b-2 border-[#FED400]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  Dokumen ({transformedProject.documents?.length || 0})
                </button>
              </div>

              <div className="p-6">
                {activeTab === "info" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-[#004A74] mb-3">Deskripsi Proyek</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {transformedProject.description}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold text-[#004A74] mb-3">Evaluasi</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {transformedProject.evaluation}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-[#004A74] mb-3">Saran Pengembangan</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {transformedProject.developmentSuggestion}
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === "members" && (
                  <div className="space-y-4">
                    {transformedProject.members && transformedProject.members.length > 0 ? (
                      transformedProject.members.map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center shrink-0">
                            {member.photoUrl ? (
                              <img 
                                src={member.photoUrl} 
                                alt={member.name} 
                                className="w-full h-full rounded-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-[#004A74]">{member.name || "Nama tidak tersedia"}</div>
                            <div className="text-sm text-gray-600">{member.nim || "NIM tidak tersedia"}</div>
                            <div className="text-sm text-gray-500">{member.major || "Jurusan tidak tersedia"}</div>
                            {member.linkedinUrl && (
                              <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                                LinkedIn
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">Belum ada anggota</p>
                    )}
                  </div>
                )}

                {activeTab === "documents" && (
                  <div className="space-y-3">
                    {transformedProject.documents && transformedProject.documents.length > 0 ? (
                      transformedProject.documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                        >
                          <div className="flex items-center gap-3 mb-2 sm:mb-0">
                            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <div>
                              <div className="font-semibold text-gray-800">{doc.name}</div>
                              <div className="text-sm text-gray-500">{doc.type} • {doc.size} • {doc.uploadedAt}</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {doc.url && (
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-[#004A74] text-white rounded-lg hover:bg-[#003d5e] transition text-sm font-semibold"
                              >
                                Download
                              </a>
                            )}
                            {doc.viewLink && (
                              <a
                                href={doc.viewLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 border border-[#004A74] text-[#004A74] rounded-lg hover:bg-blue-50 transition text-sm font-semibold"
                              >
                                Lihat
                              </a>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 text-center py-8">Belum ada dokumen</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </FixLayout>
  );
}