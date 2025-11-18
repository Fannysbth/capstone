"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Props:
 * - project: { id, title }
 * - onSubmitted?: function(createdRequest) — dipanggil jika submit sukses
 */
export default function RequestFormClient({ project, onSubmitted }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const openForm = () => {
    setMessage("");
    setError(null);
    setSuccessMsg(null);
    setOpen(true);
  };

  const closeForm = () => {
    setOpen(false);
  };

  const submit = async (e) => {
    e?.preventDefault?.();
    setError(null);
    setSuccessMsg(null);

    if (!message || message.trim().length < 10) {
      setError("Pesan minimal 10 karakter untuk menjelaskan rencana Anda.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("Silakan login terlebih dahulu!");
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/requests/projects/${project.id}/request`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          message: message.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.message || `HTTP ${response.status}`);
      }

      const createdRequest = await response.json();
      
      setSuccessMsg("Request berhasil dikirim! Tunggu konfirmasi dari pemilik project.");
      setOpen(false);

      if (typeof onSubmitted === "function") {
        onSubmitted(createdRequest);
      }

      // Refresh halaman setelah beberapa detik
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (err) {
      setError(err.message || "Gagal mengirim request.");
      console.error("Submit request error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={(e) => {
          e.stopPropagation();
          openForm();
        }}
        className="w-full py-3 bg-[#004A74] text-white font-semibold rounded-lg hover:bg-[#003d5e] transition shadow-lg"
      >
        Kirim Request
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={closeForm}
            aria-hidden
          />
          <form
            onSubmit={submit}
            className="relative z-10 w-full max-w-lg bg-white rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-lg font-semibold mb-3 text-[#004A74]">Request Lanjutkan Project</h3>
            <p className="text-sm text-gray-600 mb-4">
              Project: <strong className="text-[#004A74]">{project.title}</strong>
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pesan / Rencana Pengembangan *
              </label>
              <textarea
  value={message}
  onChange={(e) => {
    setMessage(e.target.value);
    // auto-expand height
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }}
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#004A74] focus:ring-1 focus:ring-[#004A74] resize-none"
  rows={5}
  placeholder="Jelaskan rencana pengembangan atau alasan Anda ingin melanjutkan project ini. Minimal 10 karakter."
  required
/>

              <p className="text-xs text-gray-500 mt-1">
                {message.length}/10 karakter
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {successMsg && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-600">{successMsg}</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeForm}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                disabled={loading}
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#004A74] text-white rounded-lg hover:bg-[#003d5e] transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading || message.trim().length < 10}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Mengirim...
                  </span>
                ) : (
                  "Kirim  Request"
                )}
              </button>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600">
                <strong>Note:</strong> Request Anda akan dikirim ke pemilik project. 
                Anda akan menerima notifikasi via email ketika request disetujui.
              </p>
            </div>
          </form>
        </div>
      )}
    </>
  );
}