"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import FixLayout from "../../../../components/FixLayout";

const PLACEHOLDER_THUMB = "/assets/thumb-placeholder.png";

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

export default function RequestPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? String(params.id) : null;

  const { project, loading, error } = useProjectDetail(id);

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Submit handler
  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!project) {
      setSubmitError("Project belum siap. Harap tunggu.");
      return;
    }

    if (!message.trim()) {
      setSubmitError("Pesan/rencana lanjutan harus diisi.");
      return;
    }

    setSubmitting(true);

    try {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
  const res = await fetch(`${apiUrl}/api/requests/projects/${id}/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ message: message.trim() }),
  });

  const text = await res.text(); // always read raw response
  let data;
  try {
    data = JSON.parse(text); // try parse JSON
  } catch {
    throw new Error("Unexpected response: " + text);
  }

  if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

  setSuccess(true);
  setMessage("");
  setTimeout(() => router.push(`/detail/${id}`), 2000);

} catch (err) {
  console.error("Request error:", err);
  setSubmitError(err.message || "Gagal mengirim request.");
} finally {
  setSubmitting(false);
}

  };

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
            Request Lanjutkan
          </span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="inline-block">
            <h1 className="text-3xl font-bold text-[#004A74]">
              Request Lanjutkan
            </h1>
            <div className="h-1 bg-[#FED400] rounded mt-2"></div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            Isi form untuk meminta melanjutkan project
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LEFT: Form */}
            <div className="md:col-span-2">
              <form onSubmit={onSubmit} className="space-y-4">
          

                <div>
                  <label className="block text-xs font-semibold mb-2">
                    Pesan / Rencana Lanjutan *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full p-3 border rounded-lg bg-white text-sm min-h-[200px] focus:outline-none focus:border-[#004A74] focus:ring-1 focus:ring-[#004A74] resize-none"
                    placeholder="Jelaskan singkat rencana atau alasan Anda ingin melanjutkan project ini"
                    required
                  />
                </div>

                {submitError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{submitError}</p>
                  </div>
                )}

                {success && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-600">
                      ✅ Request berhasil dikirim. Mengalihkan ke History…
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => router.push(`/detail/${id}`)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                    disabled={submitting}
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !message.trim() || loading || error}
                    className="px-6 py-2 bg-[#004A74] text-white font-semibold rounded-lg hover:bg-[#003d5e] transition disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Mengirim..." : "Kirim Request"}
                  </button>
                </div>
              </form>
            </div>

            {/* RIGHT: Project summary card */}
            <aside className="md:col-span-1">
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm sticky top-8 p-4">
                {loading && (
                  <p className="text-sm text-slate-500">Memuat project…</p>
                )}
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
                {!loading && project && (
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
