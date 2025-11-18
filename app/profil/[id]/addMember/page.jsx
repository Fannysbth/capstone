"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import FixLayout from "../../../../components/FixLayout";
import { useParams } from 'next/navigation';

export default function AddMemberPage() {
  const params = useParams();
  const groupId = params.groupId;
  const router = useRouter();
  const [form, setForm] = useState({
    _id: "",
    name: "",
    nim: "",
    major: "",
    linkedinUrl: "",
    portfolioUrl: ""
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

      const response = await fetch(`${apiBaseUrl}/users/members`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add member');
      }

      alert('Anggota berhasil ditambahkan');
      router.push(`/profil/${groupId}`);
    } catch (err) {
      console.error('Error adding member:', err);
      alert('Gagal menambah anggota: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FixLayout>
      <div className="min-h-screen bg-[#FCFCFC]">
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-10">

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
              onClick={() => router.push(`/profil/${groupId}`)}
            >
              Profil
            </span>
            <span>›</span>
            <span className="text-[#004A74] font-semibold">Tambah Anggota</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-[#004A74] mb-2">
            Tambah Anggota
          </h1>
          <div className="h-1 bg-[#FED400] rounded mb-8"></div>

          {/* FORM */}
          <form  onSubmit={(e) => handleSubmit(e)}  className="bg-white border border-gray-200 rounded-lg shadow p-6 space-y-8">
            {/* BOX 1 – Informasi Dasar */}
            <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
              <h2 className="font-semibold text-gray-700 mb-4">
                Informasi Dasar Anggota
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Nama Anggota *
                  </label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004A74]"
                    placeholder="Masukkan nama anggota"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    NIM *
                  </label>
                  <input
                    name="nim"
                    value={form.nim}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004A74]"
                    placeholder="Masukkan NIM"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Jurusan *
                  </label>
                  <input
                    name="major"
                    value={form.major}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004A74]"
                    placeholder="Masukkan jurusan"
                  />
                </div>
              </div>
            </div>

            {/* BOX 2 – Link LinkedIn & Portofolio */}
            <div className="border border-gray-200 bg-gray-50 rounded-lg p-4">
              <h2 className="font-semibold text-gray-700 mb-4">
                Link & Portofolio
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Link LinkedIn
                  </label>
                  <input
                    name="linkedinUrl"
                    value={form.linkedinUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004A74]"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Link Portofolio
                  </label>
                  <input
                    name="portfolioUrl"
                    value={form.portfolioUrl}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#004A74]"
                    placeholder="https://portfolio.com/..."
                  />
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex items-center justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => router.push(`/profil/${groupId}` )}
                className="px-4 py-2 border text-gray-600 rounded-lg hover:bg-gray-100"
                disabled={loading}
              >
                Batal
              </button>

              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-[#004A74] text-white rounded-lg font-semibold hover:bg-[#003d5e] disabled:opacity-50"
              >
                {loading ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </FixLayout>
  );
}