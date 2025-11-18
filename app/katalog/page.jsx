"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FixLayout from "../../components/FixLayout.jsx";

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

export default function KatalogPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("semua");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/projects`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        // Transform project data + fetch ratings & comments count
        const transformedProjects = await Promise.all(
          data.projects.map(async (project) => {
            // Fetch ratings
            const ratingRes = await fetch(`${apiUrl}/api/ratings/${project._id}`);
            const ratingData = ratingRes.ok ? await ratingRes.json() : { average: 0, count: 0 };

            // Fetch comments
            const commentRes = await fetch(`${apiUrl}/api/comments/${project._id}`);
            const commentData = commentRes.ok ? await commentRes.json() : [];

            return {
              id: project._id,
              title: project.title,
              category: project.theme || "Tanpa Kategori",
              group: project.ownerId?.groupName || "Kelompok",
              summary: project.summary || "",
              thumbnail: project.projectPhotoUrls?.[0] || "/assets/images/default-project.jpg",
              availableForContinuation: project.status === "Open",
              rating: ratingData.average || 0,
              commentCount: commentData.length || 0,
              createdAt: project.createdAt,
            };
          })
        );

        // Sort by newest
        const sortedProjects = transformedProjects.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setProjects(sortedProjects);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const categories = ["semua", ...new Set(projects.map((p) => p.category.toUpperCase()))];

  const filteredProjects = projects.filter((project) => {
    const matchCategory =
      filterCategory === "semua" || project.category.toUpperCase() === filterCategory;
    const matchSearch =
      searchQuery === "" ||
      project.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.group?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.category?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDetailClick = (id) => router.push(`/detail/${id}`);

  return (
    <FixLayout>
      <div className="min-h-screen bg-[#FCFCFC]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <span className="hover:text-[#004A74] cursor-pointer" onClick={() => router.push("/")}>
              Homepage
            </span>
            <span>›</span>
            <span className="text-[#004A74] font-semibold">Katalog</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-block">
              <h1 className="text-3xl font-bold text-[#004A74]">Katalog Capstone</h1>
              <div className="h-1 bg-[#FED400] rounded mt-2"></div>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex-1 flex items-center bg-[#5B585829] rounded-lg px-3 py-0.5">
              <div className="flex-1 relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Cari berdasarkan kata kunci, judul, atau nama kelompok"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border-none focus:outline-none text-sm text-gray-800 placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
                Filter berdasarkan tema
              </span>
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#004A74] focus:ring-1 focus:ring-[#004A74] bg-white text-sm text-gray-800"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === "semua" ? "Semua" : cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-4 text-sm text-gray-600">
            Menampilkan {paginatedProjects.length} dari {filteredProjects.length} capstone
          </div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#004A74]"></div>
              <p className="text-gray-500 mt-4">Memuat data...</p>
            </div>
          )}

          {/* Empty */}
          {!loading && filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Tidak ada capstone yang ditemukan.</p>
              <p className="text-gray-400 text-sm mt-2">
                Coba ubah kata kunci pencarian atau filter kategori
              </p>
            </div>
          )}

          {/* Grid */}
          {!loading && paginatedProjects.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {paginatedProjects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white rounded-[12px] overflow-hidden border border-gray-200 shadow hover:shadow-lg transition cursor-pointer flex flex-col"
                  onClick={() => handleDetailClick(project.id)}
                >
                  <div className="p-4">
                    <div className="relative h-36 overflow-hidden bg-gradient-to-br from-red-100 via-orange-50 to-pink-100 rounded-[12px]">
                      <img
                        src={project.thumbnail}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="px-4 pb-5 flex flex-col h-full">
                    <p className="text-xs font-regular text-[#004A74] tracking-wide">
                      {project.category.toUpperCase()}
                    </p>
                    <h3 className="text-base font-bold text-[#004A74] mt-2 leading-tight line-clamp-2">
                      {project.title}
                    </h3>

                    {/* Rating & Comment Count */}
                    <div className="flex items-center gap-2 mt-2">
                      <Stars rating={project.rating} />
                      <span className="text-xs text-gray-500">({project.commentCount} komentar)</span>
                    </div>

                    <p className="text-xs text-gray-500 mt-2">{project.group}</p>

                    <p className="text-sm text-[#332C2B] mt-3 leading-relaxed line-clamp-3">
                      {project.summary}
                    </p>

                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2 text-[#004A74] font-semibold group">
                        <span className="text-sm relative">
                          Lihat Detail Capstone
                          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FED400] transition-all duration-300 group-hover:w-full"></span>
                        </span>
                        <img
                          src="/assets/icons/arrow-right.png"
                          alt="arrow"
                          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                        />
                      </div>

                      {project.availableForContinuation ? (
                        <div className="flex items-center gap-1 text-green-600 text-xs">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          <span className="font-medium">Terbuka untuk dilanjutkan</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-red-600 text-xs">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
                          </svg>
                          <span className="font-medium">Sudah dilanjutkan</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition">
                <svg className="w-5 h-5 text-[#004A74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                </svg>
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button key={pageNum} onClick={() => handlePageChange(pageNum)} className="relative px-2 py-2 min-w-[10px] transition">
                    <span className={`${currentPage === pageNum ? "text-[#004A74] font-bold" : "text-gray-400 hover:text-gray-600"}`}>{pageNum}</span>
                    {currentPage === pageNum && <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#FED400] rounded-t"></span>}
                  </button>
                );
              })}

              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition">
                <svg className="w-5 h-5 text-[#004A74]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </FixLayout>
  );
}
