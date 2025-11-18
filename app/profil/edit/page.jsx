"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FixLayout from "../../../components/FixLayout";
export default function ProfileEditPage() {
  const router = useRouter();
  const [form, setForm] = useState({
     _id: "",
    groupName: "",
    email: "",
    department: "",
    year: "",
    description: "",
    phone: ""
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

        const response = await fetch(`${apiBaseUrl}/users/me`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const data = await response.json();
        setForm({
          _id: data._id || "",  
          groupName: data.groupName || "",
          email: data.email || "",
          department: data.department || "",
          year: data.year || "",
          description: data.description || "",
          phone: data.phone || ""
        });
      } catch (err) {
        console.error('Error fetching profile:', err);
        alert('Gagal memuat profil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (userId) => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';
      if (!form.groupName || !form.email) {
  alert("Nama Kelompok dan Email wajib diisi!");
  return;
}


      const response = await fetch(`${apiBaseUrl}/users/profile`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      const data = await response.json();
      alert("Data tersimpan!");
      router.push(`/profil/${userId}`);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Gagal menyimpan perubahan: ' + err.message);
    }
  };

  if (loading) {
    return (
      <FixLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#FCFCFC]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#004A74]"></div>
            <p className="text-gray-500 mt-3">Memuat...</p>
          </div>
        </div>
      </FixLayout>
    );
  }

  return (
    <FixLayout>
      <div className="min-h-screen bg-[#FCFCFC] py-10 px-6">
        <div className="max-w-4xl mx-auto">

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
              onClick={() => router.push(`/profil/${form._id}`)}
            >
              Profil
            </span>
            <span>›</span>
            <span className="text-[#004A74] font-semibold">Edit Profil</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl font-bold text-[#004A74] mb-2">
            Edit Profil Kelompok
          </h1>
          <div className="h-1 bg-[#FED400] rounded mb-8"></div>

          {/* Edit Form */}
          <div className="bg-white shadow border border-gray-200 rounded-lg p-6">
            <div className="space-y-5">

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Nama Kelompok *
                </label>
                <input
                  value={form.groupName}
                  onChange={(e) => setForm({ ...form, groupName: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-[#004A74]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-[#004A74]"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Departemen
                </label>
                <select
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-[#004A74]"
                >
                  <option value="">Pilih Departemen</option>
                  <option value="DTETI">DTETI</option>
                  <option value="DTK">DTK</option>
                  <option value="DTMI">DTMI</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Tahun
                </label>
                <select
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-[#004A74]"
                >
                  <option value="">Pilih Tahun</option>
                  <option value="2024">2024</option>
                  <option value="2023">2023</option>
                  <option value="2022">2022</option>
                  <option value="2021">2021</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Nomor Telepon
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 focus:ring-2 focus:ring-[#004A74]"
                  placeholder="081234567890"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Deskripsi Kelompok
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 mt-1 h-32 focus:ring-2 focus:ring-[#004A74]"
                  placeholder="Deskripsikan tentang kelompok Anda"
                ></textarea>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end mt-6 gap-4">
              <button
                onClick={() => router.push(`/profil/${form._id}`)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
              >
                Batal
              </button>

              <button
                onClick={() => handleSave(form._id)}
                className="px-4 py-2 bg-[#004A74] text-white rounded shadow hover:bg-[#003d5e]"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      </div>
    </FixLayout>
  );
}