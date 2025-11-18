"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import FixLayout from "../../components/FixLayout.jsx";

// Safe icon paths dengan caching
const ICONS = {
  approved: "/assets/icons/v.svg",
  rejected: "/assets/icons/x.svg", 
  waiting: "/assets/icons/w.svg",
};

const PLACEHOLDER_THUMB = "/assets/thumb-placeholder.png";

// Optimasi Image Component dengan lazy loading
const SafeImage = React.memo(({ src, alt, className, fallback = PLACEHOLDER_THUMB }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [loading, setLoading] = useState(true);
  
  const handleError = useCallback(() => {
    setImgSrc(fallback);
    setLoading(false);
  }, [fallback]);
  
  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);
  
  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded"></div>
      )}
      <img
        src={imgSrc || fallback}
        alt={alt}
        className={`${className} ${loading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  );
});

SafeImage.displayName = 'SafeImage';

const Stars = React.memo(({ rating = 0 }) => {
  const r = Math.max(0, Math.min(5, Number(rating || 0)));
  
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <SafeImage
          key={i}
          src={
            i < Math.round(r)
              ? "/assets/icons/star-filled.png"
              : "/assets/icons/star-empty.png"
          }
          alt="star"
          className="w-4 h-4"
          fallback="/assets/icons/star-empty.png"
        />
      ))}
    </div>
  );
});

Stars.displayName = 'Stars';

export default function Page() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("semua");
  const [query, setQuery] = useState("");

  // Debounce search untuk performa
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Starting fetch...'); // Debug log
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/requests`, {
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        // Timeout setelah 10 detik
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }
      
      const data = await response.json();
      console.log('Received data:', data); // Debug log
      
      if (Array.isArray(data)) {
        setRequests(data);
      } else {
        console.warn('Expected array but got:', typeof data);
        setRequests([]);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || "Gagal memuat data");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Optimasi filtering dengan useMemo
  const filteredItems = useMemo(() => {
    if (!Array.isArray(requests)) return [];
    
    return requests.filter((item) => {
      const status = String(item.status || "").toLowerCase();
      const filterLower = String(filter).toLowerCase();

      // Filter status
      if (filter && filter !== "semua") {
        if (filterLower === "approved" && status !== "approved") return false;
        if (filterLower === "rejected" && status !== "rejected") return false;
        if (filterLower === "waiting for response" && !status.includes("waiting")) return false;
      }

      // Filter search query
      if (debouncedQuery && debouncedQuery.trim()) {
        const q = debouncedQuery.trim().toLowerCase();
        const inTitle = (item.title || "").toLowerCase().includes(q);
        const inGroup = (item.group || "").toLowerCase().includes(q);
        const inCategory = (item.category || "").toLowerCase().includes(q);
        if (!(inTitle || inGroup || inCategory)) return false;
      }

      return true;
    });
  }, [requests, filter, debouncedQuery]);

  const getStatusStyle = useCallback((status) => {
    const s = String(status || "").toLowerCase();
    if (s === "approved")
      return {
        color: "text-green-600",
        bg: "bg-green-50",
        icon: ICONS.approved,
      };
    if (s === "rejected")
      return { color: "text-red-600", bg: "bg-red-50", icon: ICONS.rejected };
    if (s.includes("waiting"))
      return {
        color: "text-amber-600",
        bg: "bg-amber-50",
        icon: ICONS.waiting,
      };
    return {
      color: "text-slate-600",
      bg: "bg-slate-100",
    };
  }, []);

  const handleRetry = useCallback(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Skeleton loader untuk loading state
  const SkeletonLoader = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-white rounded-[12px] overflow-hidden border border-gray-200 shadow animate-pulse">
          <div className="p-4">
            <div className="h-36 bg-gray-200 rounded-[12px]"></div>
          </div>
          <div className="px-4 pb-5 space-y-3">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-6 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="flex justify-between pt-4">
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <FixLayout>
      <div className="min-h-screen bg-[#FCFCFC]">
        <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <span
              className="hover:text-[#004A74] cursor-pointer"
              onClick={() => router.push("/")}
            >
              Homepage
            </span>
            <span>›</span>
            <span className="text-[#004A74] font-semibold">
              History Request
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-block">
              <h1 className="text-3xl font-bold text-[#004A74]">
                History Request
              </h1>
              <div className="h-1 bg-[#FED400] rounded mt-2"></div>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex-1 flex items-center bg-[#5B585829] rounded-lg px-3 py-0.5">
              <div className="flex-1 relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Cari berdasarkan kata kunci, judul, atau nama kelompok"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-none bg-transparent focus:outline-none text-sm text-gray-800 placeholder-gray-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
                Filter berdasarkan status
              </span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#004A74] focus:ring-1 focus:ring-[#004A74] bg-white text-sm text-gray-800"
              >
                <option value="semua">Semua Status</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="waiting for response">Waiting for Response</option>
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-4 text-sm text-gray-600">
            Menampilkan {filteredItems.length} capstone
            {loading && " (memuat...)"}
          </div>

          {/* Loading State dengan Skeleton */}
          {loading && <SkeletonLoader />}

          {/* Error State dengan retry option */}
          {error && (
            <div className="text-center py-20">
              <p className="text-red-600 mb-4">Error: {error}</p>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-[#004A74] text-white rounded-lg hover:bg-[#003956] transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredItems.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">
                {requests.length === 0 
                  ? "Belum ada request capstone" 
                  : "Tidak ada capstone yang sesuai dengan filter"}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {requests.length === 0 
                  ? "Mulai request capstone untuk melihat history di sini" 
                  : "Coba ubah kata kunci pencarian atau filter status"}
              </p>
            </div>
          )}

          {/* Capstone Grid */}
          {!loading && !error && filteredItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {filteredItems.map((item) => {
                const st = getStatusStyle(item.status);
                const rating = Math.max(0, Math.min(5, Number(item.rating || 0)));

                return (
                  <article
                    key={item.id}
                    className="bg-white rounded-[12px] overflow-hidden border border-gray-200 shadow hover:shadow-lg transition cursor-pointer flex flex-col"
                    onClick={() => item.projectId && router.push(`/detail/${item.projectId}`)}
                  >
                    {/* Thumbnail */}
                    <div className="p-4">
                      <SafeImage
                        src={item.thumbnail}
                        alt={item.title}
                        className="w-full h-36 object-cover rounded-[12px]"
                        fallback={PLACEHOLDER_THUMB}
                      />
                    </div>

                    {/* Content */}
                    <div className="px-4 pb-5 flex flex-col h-full">
                      <p className="text-xs font-regular text-[#004A74] tracking-wide">
                        {item.category || "-"}
                      </p>
                      <h3 className="text-base font-bold text-[#004A74] mt-2 leading-tight line-clamp-2">
                        {item.title}
                      </h3>

                      <div className="flex mt-2">
                        <Stars rating={rating} />
                        <span className="text-xs text-gray-500">({item.commentCount} komentar)</span>
                      </div>

                      <p className="text-xs text-gray-500 mt-2">
                        {item.group || "-"}
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/detail/${item.projectId}/myrequest`);
                        }}
                        className="text-blue-600 text-sm font-medium hover:underline mt-2 text-left"
                      >
                        Lihat Detail Request
                      </button>

                      <div className="flex items-center justify-between mt-auto pt-4">
                        <div className="flex items-center gap-2 text-[#004A74] font-semibold group">
                          <span className="text-sm relative">
                            Lihat Detail Capstone
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#FED400] transition-all duration-300 group-hover:w-full"></span>
                          </span>
                          <SafeImage
                            src="/assets/icons/arrow-right.png"
                            alt="arrow"
                            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                          />
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <div
                            className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium w-fit ${st.bg} ${st.color}`}
                          >
                            <SafeImage
                              src={st.icon}
                              alt={item.status}
                              className="w-4 h-4"
                            />
                            <span>{item.status || "-"}</span>
                          </div>

                          {item.status === "approved" && item.driveLink && (
                            <a
                              href={item.driveLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-amber-700 text-xs font-medium hover:underline whitespace-nowrap"
                            >
                              Lihat Dokumen Capstone →
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </FixLayout>
  );
}