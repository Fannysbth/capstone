"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FixLayout from "../../../components/FixLayout";
// Replace mock helpers with API services
import RequestAPI from "../../../lib/request-api";
import ProjectAPI from "../../../lib/project-api";
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

const ICONS = {
  approved: "/assets/icons/v.svg",
  rejected: "/assets/icons/x.svg",
  waiting: "/assets/icons/w.svg",
};

export default function RequestMasukPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("semua");
  const [projectTitle, setProjectTitle] = useState(null);

  useEffect(() => {
    const loadRequests = async () => {
      setLoading(true);
      try {
        const data = await RequestAPI.getIncomingRequests(projectId || null);
        setRequests(data || []);
      } catch (err) {
        console.error("Error loading incoming requests:", err);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    loadRequests();
  }, [projectId]);

  useEffect(() => {
    const loadProjectTitle = async () => {
      if (!projectId) {
        setProjectTitle(null);
        return;
      }
      try {
        const p = await ProjectAPI.getMyProjectById(projectId);
        setProjectTitle(p ? p.title : null);
      } catch (err) {
        console.error("Failed to load project title:", err);
        setProjectTitle(null);
      }
    };

    loadProjectTitle();
  }, [projectId]);

  const handleApprove = async (id) => {
    try {
      const updated = await RequestAPI.updateRequestStatus(id, "Approved");
      
      if (updated.status === 'Approved') {
        // For approved requests, update the local state
        setRequests((prev) => 
          prev.map((r) => 
            r.id === id ? { ...r, status: 'Approved', approved: true } : r
          )
        );
        
        // Show success message with proposal link if available
        if (updated.proposalLink) {
          alert(`Request berhasil disetujui! Link proposal: ${updated.proposalLink}`);
        } else {
          alert('Request berhasil disetujui!');
        }
      }
    } catch (err) {
      console.error("Failed to approve request", err);
      alert("Gagal menyetujui request: " + (err.message || err));
    }
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Alasan penolakan (opsional):", "");
    
    // In your BE, reason is not stored, but we'll keep the prompt for UX
    if (reason !== null) { // User didn't cancel
      try {
        await RequestAPI.updateRequestStatus(id, "Rejected", reason);
        
        // For rejected requests, remove from local state since BE deletes them
        setRequests((prev) => prev.filter((r) => r.id !== id));
        
        alert('Request berhasil ditolak!');
      } catch (err) {
        console.error("Failed to reject request", err);
        alert("Gagal menolak request: " + (err.message || err));
      }
    }
  };

  const filteredRequests = requests.filter((req) => {
    if (filterStatus === "semua") return true;
    return req.status === filterStatus;
  });

  const getStatusStyle = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "approved")
      return { color: "text-green-600", bg: "bg-green-50", icon: ICONS.approved };
    if (s === "rejected")
      return { color: "text-red-600", bg: "bg-red-50", icon: ICONS.rejected };
    return { color: "text-amber-600", bg: "bg-amber-50", icon: ICONS.waiting };
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
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
            <span
              className="hover:text-[#004A74] cursor-pointer"
              onClick={() => router.push("/proyek-saya")}
            >
              Proyek Saya
            </span>
            {projectTitle && (
              <>
                <span>›</span>
                <span
                  className="hover:text-[#004A74] cursor-pointer"
                  onClick={() => router.push(`/proyek-saya/detail?id=${projectId}`)}
                >
                  {projectTitle}
                </span>
              </>
            )}
            <span>›</span>
            <span className="text-[#004A74] font-semibold">Request Masuk</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-block">
              <h1 className="text-3xl font-bold text-[#004A74]">Request Masuk</h1>
              <div className="h-1 bg-[#FED400] rounded mt-2"></div>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Daftar request dari kelompok lain untuk melanjutkan proyek Anda
            </p>
          </div>

          {/* Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
                Filter berdasarkan status
              </span>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#004A74] focus:ring-1 focus:ring-[#004A74] bg-white text-sm text-gray-800"
              >
                <option value="semua">Semua Status</option>
                <option value="Waiting for Response">Waiting for Response</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Results Info */}
          <div className="mb-4 text-sm text-gray-600">
            Menampilkan {filteredRequests.length} request
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#004A74]"></div>
              <p className="text-gray-500 mt-4">Memuat data...</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredRequests.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Tidak ada request yang ditemukan.</p>
            </div>
          )}

          {/* Requests List */}
          {!loading && filteredRequests.length > 0 && (
            <div className="space-y-4">
              {filteredRequests.map((req) => {
                const st = getStatusStyle(req.status);
                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition cursor-pointer"
                    onClick={() => router.push(`/proyek-saya/request/detail?id=${req.id}`)}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-[#004A74]">{req.projectTitle}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${st.bg} ${st.color} flex items-center gap-1`}>
                            <img src={st.icon} alt={req.status} className="w-3 h-3" />
                            {req.status}
                          </span>
                        </div>
                        
                        <div className="space-y-1 mb-3">
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Dari:</span> {req.requesterName}
                          </p>
                          <p className="text-sm text-gray-600">
                            <span className="font-semibold">Subject:</span> {req.subject}
                          </p>
                        </div>

                        <p className="text-sm text-gray-700 line-clamp-2">{req.message}</p>

                        <p className="text-xs text-gray-500 mt-2">
                          Dikirim: {new Date(req.createdAt).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric"
                          })}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/proyek-saya/request/detail?id=${req.id}`);
                          }}
                          className="px-4 py-2 bg-[#004A74] text-white rounded-lg hover:bg-[#003d5e] transition text-sm font-semibold whitespace-nowrap"
                        >
                          Lihat Detail
                        </button>
                        
                        {req.status === 'Waiting for Response' && (
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprove(req.id);
                              }}
                              className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex-1"
                            >
                              Setujui
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleReject(req.id);
                              }}
                              className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm flex-1"
                            >
                              Tolak
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </FixLayout>
    </Suspense>
  );
}