"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FixLayout from "../components/FixLayout.jsx";

const features = [
  {
    title: "Jelajahi Showcase Capstone",
    desc: "Akses showcase proyek yang telah terdokumentasi lengkap dengan ringkasan, galeri, dan hasil evaluasi. Gunakan filter dan pencarian untuk menemukan solusi sesuai topik atau teknologi yang Anda butuhkan.",
    icon: "showcase-icon",
  },
  {
    title: "Lanjutkan Capstone Sebelumnya",
    desc: "Kirim proposal singkat dan lampirkan rencana teknis atau portofolio tim Anda. Pemilik proyek dapat meninjau, meminta klarifikasi, dan menyetujui kelanjutan secara terstruktur melalui platform.",
    icon: "lanjutkan-icon",
  },
  {
    title: "Review Penerus Capstone",
    desc: "Periksa detail anggota, portofolio, dan proposal teknis untuk menilai kesiapan penerus. Berikan keputusan yang transparan, terima, tolak, atau minta revisi, lengkap dengan catatan alasan.",
    icon: "review-icon",
  },
  {
    title: "Beri Rating dan Komentar",
    desc: "Berikan rating dan komentar untuk membantu penerus dan peneliti lain memahami kelebihan serta area perbaikan. Umpan balik yang terstruktur meningkatkan kualitas pengembangan berkelanjutan dan akuntabilitas akademik.",
    icon: "rating-icon",
  },
];

// Komponen Stars untuk rating (akan digunakan jika BE menyediakan data rating)
const Stars = ({ rating = 0 }) => {
  const r = Math.max(0, Math.min(5, Number(rating || 0)));
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <img
          key={i}
          src={
            i < Math.round(r)
              ? "/assets/icons/star-filled.png"
              : "/assets/icons/star-empty.png"
          }
          alt="star"
          className="w-4 h-4"
        />
      ))}
    </div>
  );
};

export default function HomePage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(saved);
  }, []);

  // Fetch 6 project terbaru dengan status "Open" dari BE
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        // Fetch projects dengan limit 6 dan status Open
        const response = await fetch(`${apiUrl}/api/projects?limit=6&status=Open`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        // Transform data dari BE ke format yang diharapkan FE
        const transformedProjects = data.projects.map(project => ({
          id: project._id,
          title: project.title,
          category: project.theme,
          group: project.ownerId?.groupName || 'Kelompok',
          summary: project.summary,
          thumbnail: project.projectPhotoUrls?.[0] || "/assets/images/default-project.jpg",
          status: project.status,
          availableForContinuation: project.status === 'Open',
          // Jika BE menyediakan rating, bisa ditambahkan di sini
          // rating: project.averageRating || 0,
          createdAt: project.createdAt
        }));
        
        // Sort by creation date (terbaru)
        const sortedProjects = transformedProjects.sort((a, b) => 
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        
        setProjects(sortedProjects);
      } catch (err) {
        console.error("Error fetching projects:", err);
        // Fallback: tetap set empty array
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDetailClick = (id) => {
    router.push(`/detail/${id}`);
  };

  const handleViewAllClick = () => {
    router.push("/katalog");
  };

  return (
    <FixLayout>
      <div className="min-h-screen bg-[#FCFCFC] text-slate-900">
        {/* CONTAINER WITH PADDING */}
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
          {/* HERO SECTION */}
          <section className="relative h-80 rounded-lg overflow-hidden shadow-lg mb-16">
            {/* Background Image */}
            <img
              src="/assets/images/hero-bg.jpg"
              alt="Hero Background"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Gradient Overlay - dari kiri gelap ke kanan transparan */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

            {/* Content */}
            <div className="relative h-full flex items-center px-8 md:px-12">
              <div className="max-w-xl">
                <h1 className="text-2xl md:text-3xl font-extrabold text-white leading-tight italic">
                  Selamat Datang di Capstone Connector DTETI FT UGM
                </h1>
                <p className="mt-3 text-sm md:text-base text-white/95 leading-relaxed">
                  Capstone Connector merupakan sebuah platform yang dirancang
                  untuk mendukung kesinambungan proyek capstone di lingkungan
                  DTETI FT UGM.
                </p>
                {!isLoggedIn && (
                  <button
                    onClick={() => router.push("/login")}
                    className="mt-5 px-5 py-2 bg-white text-[#004A74] font-semibold rounded shadow hover:bg-gray-100 transition"
                  >
                    Gabung Sekarang
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* DAFTAR PROJECT SECTION */}
          <section className="mb-20">
            <div className="text-center mb-10">
              <div className="inline-block">
                <h2 className="text-3xl font-bold text-[#004A74] relative">
                  Daftar Project Capstone
                </h2>
                <div className="h-1 bg-[#FED400] rounded mt-2"></div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#004A74]"></div>
                <p className="text-gray-500 mt-4">Memuat project...</p>
              </div>
            )}

            {/* Project Grid */}
            {!loading && projects.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {projects.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white rounded-[12px] overflow-hidden border border-gray-200 shadow hover:shadow-lg transition cursor-pointer"
                      onClick={() => handleDetailClick(project.id)}
                    >
                      {/* Thumbnail dengan padding sesuai content card */}
                      <div className="p-4">
                        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-red-100 via-orange-50 to-pink-100 rounded-[12px]">
                          <img
                            src={project.thumbnail}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="px-4 pb-5 flex flex-col h-full">
                        <p className="text-xs font-regular text-[#004A74] tracking-wide">
                          {(project.category || "Tanpa Kategori").toUpperCase()}
                        </p>
                        <h3 className="text-base font-bold text-[#004A74] mt-2 leading-tight line-clamp-2">
                          {project.title}
                        </h3>

                        

                        {/* Rating & Comment Count */}
  <div className="flex items-center gap-2 mt-1">
    <Stars rating={project.rating || 0} />
    <span className="text-xs text-gray-500">
      ({project.commentCount || 0} komentar)
    </span>
  </div>
  {/* Group Name */}
                        <p className="text-xs text-gray-500 mt-2">
                          {project.group}
                        </p>

                        {/* Description */}
                        <p className="text-sm text-[#332C2B] mt-3 leading-relaxed line-clamp-3">
                          {project.summary}
                        </p>

                        {/* Link & Status Badge */}
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2 text-[#004A74] font-semibold group">
                            <span className="text-sm relative">
                              Lihat Detail Project
                              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FED400] transition-all duration-300 group-hover:w-full"></span>
                            </span>
                            <img
                              src="/assets/icons/arrow-right.png"
                              alt="arrow"
                              className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                            />
                          </div>

                          {/* Status Badge */}
                          {project.availableForContinuation ? (
                            <div className="flex items-center gap-1 text-green-600 text-xs">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="font-medium">
                                Terbuka untuk dilanjutkan
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-red-600 text-xs">
                              <svg
                                className="w-4 h-4"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="font-medium">
                                Sudah dilanjutkan
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* View All Button */}
                <div className="text-center">
                  <button
                    onClick={handleViewAllClick}
                    className="px-8 py-2.5 bg-[#004A74] text-white font-semibold rounded-[6px] hover:bg-[#FED400] transition shadow"
                  >
                    Lihat Semua Project
                  </button>
                </div>
              </>
            )}

            {/* Empty State */}
            {!loading && projects.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500">
                  Belum ada project capstone yang tersedia.
                </p>
                {isLoggedIn && (
                  <button
                    onClick={() => router.push("/projects/create")}
                    className="mt-4 px-6 py-2 bg-[#004A74] text-white rounded hover:bg-[#003d5e] transition"
                  >
                    Buat Project Pertama
                  </button>
                )}
              </div>
            )}
          </section>

          {/* FITUR SECTION */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <div className="inline-block">
                <h2 className="text-3xl font-bold text-[#004A74] relative">
                  Fitur Capstone Connector
                </h2>
                <div className="h-1 bg-[#FED400] mt-2"></div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-[12px] border border-gray-200 p-10 text-center hover:shadow-lg transition"
                >
                  {/* Icon */}
                  <div className="w-16 h-16 mx-auto flex items-center justify-center">
                    <img
                      src={`/assets/icons/${feature.icon}.png`}
                      alt={feature.title}
                      className="w-auto h-auto object-contain"
                    />
                  </div>

                  {/* Title */}
                  <div className="inline-block">
                    <h3 className="font-bold text-[#004A74] text-lg leading-tight mb-2">
                      {feature.title}
                    </h3>
                    <div className="h-0.5 bg-[#FED400] rounded mb-3"></div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </FixLayout>
  );
}