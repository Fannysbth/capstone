"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import FixLayout from "../../../../components/FixLayout";

const PLACEHOLDER_THUMB = "/assets/thumb-placeholder.png";
const ICONS = {
  approved: "/assets/icons/v.svg",
  rejected: "/assets/icons/x.svg",
  waiting: "/assets/icons/w.svg",
};

// Custom Hook untuk fetching project
function useProjectDetail(id) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      setError("Project ID tidak ditemukan.");
      setLoading(false);
      return;
    }

    let mounted = true;
    setLoading(true);
    setError(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
    fetch(`${apiUrl}/api/projects/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (!mounted) return;
        const transformedProject = {
          id: data._id,
          title: data.title,
          category: data.theme,
          group: data.ownerId?.groupName || 'Kelompok',
          summary: data.summary,
          thumbnail: data.projectPhotoUrls?.[0] || PLACEHOLDER_THUMB,
          status: data.status,
          availableForContinuation: data.status === 'Open',
          createdAt: data.createdAt
        };
        setProject(transformedProject);
      })
      .catch((err) => {
        if (!mounted) return;
        setError("Gagal memuat project: " + (err.message || err));
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  return { project, loading, error };
}

// Custom Hook untuk fetching existing request untuk project tertentu
function useExistingRequest(projectId) {
  const [existingRequest, setExistingRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    const fetchExistingRequest = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${apiUrl}/api/users/requests`, {
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        }

        const requests = await res.json();
        console.log('All requests:', requests);
        
        // Cari request untuk project ini
        const currentRequest = requests.find(req => req.projectId === projectId);
        console.log('Found request for project:', currentRequest);
        
        setExistingRequest(currentRequest || null);
      } catch (err) {
        console.error('Error fetching existing request:', err);
        setError(err.message || "Gagal memuat request");
      } finally {
        setLoading(false);
      }
    };

    fetchExistingRequest();
  }, [projectId]);

  return { existingRequest, loading, error };
}

export default function MyRequestPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? String(params.id) : null;

  const { project, loading: projectLoading, error: projectError } = useProjectDetail(id);
  const { existingRequest, loading: requestLoading, error: requestError } = useExistingRequest(id);

  const [message, setMessage] = useState("");
  const [mode, setMode] = useState("view");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Set message dari existing request ketika data loaded
  useEffect(() => {
    if (existingRequest) {
      setMessage(existingRequest.message || "");
    }
  }, [existingRequest]);

  // ✅ PERBAIKAN: Update request dengan endpoint yang benar
  const handleUpdate = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!message.trim()) {
      setSubmitError("Pesan/rencana lanjutan harus diisi.");
      return;
    }

    setSubmitting(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      
      // ✅ ENDPOINT YANG BENAR: /api/requests/:requestId
      const res = await fetch(`${apiUrl}/api/requests/${existingRequest.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: message.trim() }),
      });

      const text = await res.text();
      console.log('Update response:', text); // Debug log
      
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Unexpected response: " + text);
      }

      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      setSuccess(true);
      setMode("view");
      
      // Refresh data dengan cara yang lebih baik
      setTimeout(() => {
        window.location.reload();
      }, 1500);
      
    } catch (err) {
      console.error("Update request error:", err);
      setSubmitError(err.message || "Gagal mengupdate request.");
    } finally {
      setSubmitting(false);
    }
  };

  // ✅ PERBAIKAN: Delete request dengan endpoint yang benar
  const handleDelete = async () => {
    if (!existingRequest) return;

    if (!confirm("Apakah Anda yakin ingin menghapus request ini? Tindakan ini tidak dapat dibatalkan.")) {
      return;
    }

    setDeleteLoading(true);
    setSubmitError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      
      // ✅ ENDPOINT YANG BENAR: /api/requests/:requestId/cancel
      const res = await fetch(`${apiUrl}/api/requests/${existingRequest.id}/cancel`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${await res.text()}`);
      }

      // Redirect kembali ke detail project setelah delete
      setTimeout(() => {
        router.push(`/detail/${id}`);
      }, 1000);
      
    } catch (err) {
      console.error("Delete request error:", err);
      setSubmitError(err.message || "Gagal menghapus request.");
      setDeleteLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const s = String(status || "").toLowerCase();
    if (s === "approved") return { color: "text-green-600", bg: "bg-green-50", icon: ICONS.approved };
    if (s === "rejected") return { color: "text-red-600", bg: "bg-red-50", icon: ICONS.rejected };
    if (s.includes("waiting")) return { color: "text-amber-600", bg: "bg-amber-50", icon: ICONS.waiting };
    return { color: "text-gray-600", bg: "bg-gray-100", icon: "" };
  };

  const canEditDelete = (status) => {
    const s = String(status || "").toLowerCase();
    return s.includes("waiting") || s === "pending" || s === "waiting for response";
  };

  const statusStyle = existingRequest ? getStatusStyle(existingRequest.status) : null;

  return (
    <FixLayout>
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
            onClick={() => router.push("/katalog")}
          >
            Katalog
          </span>
          <span>›</span>
          <span
            className="hover:text-[#004A74] cursor-pointer"
            onClick={() => router.push(`/detail/${id}`)}
          >
            {project?.title || "Detail Capstone"}
          </span>
          <span>›</span>
          <span className="text-[#004A74] font-semibold">
            My Request
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-block">
            <h1 className="text-3xl font-bold text-[#004A74]">
              My Request
            </h1>
            <div className="h-1 bg-[#FED400] rounded mt-2"></div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            {existingRequest ? "Lihat dan kelola request Anda" : "Request Anda untuk project ini"}
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LEFT: Form atau View Request */}
            <div className="md:col-span-2">
              {requestLoading && (
                <div className="flex justify-center items-center h-32">
                  <p className="text-gray-500">Memuat request...</p>
                </div>
              )}

              {!requestLoading && requestError && (
                <div className="text-center py-10">
                  <p className="text-red-600 mb-4">Error: {requestError}</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2 bg-[#004A74] text-white rounded-lg hover:bg-[#003956] transition-colors"
                  >
                    Coba Lagi
                  </button>
                </div>
              )}

              {!requestLoading && !requestError && existingRequest && (
                <div className="space-y-6">
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-[#004A74]">Request Anda</h2>
                      <p className="text-sm text-gray-600">
                        Request dikirim pada: {new Date(existingRequest.createdAt).toLocaleDateString('id-ID', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    {statusStyle && (
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.color}`}>
                        {statusStyle.icon && <img src={statusStyle.icon} alt={existingRequest.status} className="w-4 h-4" />}
                        <span className="capitalize">{existingRequest.status}</span>
                      </div>
                    )}
                  </div>

                  {/* Message Display/Edit */}
                  <div>
                    <label className="block text-xs font-semibold mb-2">
                      Pesan / Rencana Lanjutan
                    </label>
                    
                    {mode === "view" ? (
                      <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {existingRequest.message || "Tidak ada pesan request."}
                        </p>
                      </div>
                    ) : (
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full p-3 border rounded-lg bg-white text-sm min-h-[200px] focus:outline-none focus:border-[#004A74] focus:ring-1 focus:ring-[#004A74] resize-none"
                        placeholder="Jelaskan singkat rencana atau alasan Anda ingin melanjutkan project ini"
                        required
                      />
                    )}
                  </div>

                  {/* Drive Link jika approved */}
                  {existingRequest.status === "approved" && existingRequest.driveLink && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-semibold text-green-800 mb-2">🎉 Request Anda Disetujui!</p>
                      <a
                        href={existingRequest.driveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-700 text-sm hover:underline inline-flex items-center gap-1"
                      >
                        Lihat Dokumen Capstone →
                      </a>
                    </div>
                  )}

                  {submitError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600">{submitError}</p>
                    </div>
                  )}

                  {success && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-600">
                        ✅ Request berhasil diupdate.
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => router.push(`/detail/${id}`)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                    >
                      Kembali ke Detail
                    </button>

                    {mode === "view" ? (
                      <div className="flex gap-3">
                        {canEditDelete(existingRequest.status) && (
                          <>
                            <button
                              onClick={() => setMode("edit")}
                              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                            >
                              Edit Request
                            </button>
                            <button
                              onClick={handleDelete}
                              disabled={deleteLoading}
                              className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition disabled:opacity-70"
                            >
                              {deleteLoading ? "Menghapus..." : "Delete Request"}
                            </button>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setMode("view");
                            setMessage(existingRequest.message || "");
                            setSubmitError(null);
                          }}
                          className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                          disabled={submitting}
                        >
                          Batal
                        </button>
                        <button
                          onClick={handleUpdate}
                          disabled={submitting || !message.trim()}
                          className="px-6 py-2 bg-[#004A74] text-white font-semibold rounded-lg hover:bg-[#003d5e] transition disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {submitting ? "Menyimpan..." : "Simpan Perubahan"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {!requestLoading && !requestError && !existingRequest && (
                <div className="text-center py-10">
                  <p className="text-gray-500 mb-4">Anda belum mengirim request untuk project ini.</p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => router.push(`/detail/${id}`)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                    >
                      Kembali ke Detail
                    </button>
                    <button
                      onClick={() => router.push(`/detail/${id}/request`)}
                      className="px-6 py-2 bg-[#004A74] text-white font-semibold rounded-lg hover:bg-[#003d5e] transition"
                    >
                      Buat Request Baru
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Project summary card */}
            <aside className="md:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm sticky top-8 p-4">
                {projectLoading && (
                  <p className="text-sm text-slate-500">Memuat project…</p>
                )}
                {projectError && (
                  <p className="text-sm text-red-600">{projectError}</p>
                )}
                {!projectLoading && project && (
                  <>
                    <div className="relative h-36 overflow-hidden bg-gradient-to-br from-red-100 via-orange-50 to-pink-100 rounded-[12px]">
                      <img
                        src={project.thumbnail  || PLACEHOLDER_THUMB}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="mt-3">
                      <p className="text-xs font-regular text-[#004A74] tracking-wide">
                        {project.category || "Tanpa Kategori"}
                      </p>
                      <h3 className="text-base font-bold text-[#004A74] mt-1 line-clamp-2">
                        {project.title || "—"}
                      </h3>
                      <p className="text-sm text-[#332C2B] mt-2 line-clamp-3">
                        {project.summary || "Tidak ada deskripsi."}
                      </p>
                      {/* Status Badge */}
                      {project.availableForContinuation ? (
                        <div className="flex items-center gap-2 text-green-600 text-md mb-4">
                          <svg
                            className="w-5 h-5"
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
                        <div className="flex items-center gap-2 text-red-600 text-md mb-4">
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <span className="font-medium">Sudah dilanjutkan</span>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </FixLayout>
  );
}