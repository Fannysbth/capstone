'use client';
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import FixLayout from "../../../components/FixLayout";

export default function ClientAddProject() {
  const router = useRouter();

  // --- State Form ---
  const [formData, setFormData] = useState({
    title: "",
    summary: "",
    evaluation: "",
    suggestion: "",
    theme: ""
  });
  const [projectPhotos, setProjectPhotos] = useState([]);
  const [proposalFile, setProposalFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const projectPhotoInputRef = useRef(null);
  const proposalInputRef = useRef(null);

  const categories = [
    "Pilih Kategori",
    "Kesehatan",
    "Pengelolaan Sampah",
    "Smart City",
    "Transportasi Ramah Lingkungan"
  ];

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleProjectPhotoChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    const newPhotos = files.map(file => {
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} harus berupa gambar (PNG/JPG/JPEG)`);
        return null;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert(`${file.name} terlalu besar, maksimal 5MB`);
        return null;
      }
      return { file, preview: URL.createObjectURL(file) };
    }).filter(Boolean);

    setProjectPhotos(prev => [...prev, ...newPhotos]);
  };

  const removeProjectPhoto = (index) => {
    setProjectPhotos(prev => {
      const updated = [...prev];
      const removed = updated.splice(index, 1)[0];
      URL.revokeObjectURL(removed.preview);
      return updated;
    });
  };

  const handleProposalChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      alert("Hanya file PDF yang diperbolehkan");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      alert("File terlalu besar, maksimal 10MB");
      return;
    }
    setProposalFile({ file, name: file.name });
  };

  const removeProposal = () => {
    setProposalFile(null);
    if (proposalInputRef.current) proposalInputRef.current.value = "";
  };

  // --- Validate ---
  const validate = () => {
    const newErrors = {};
    if (!formData.title?.trim()) newErrors.title = "Judul proyek harus diisi";
    if (!formData.theme || formData.theme === "Pilih Kategori") newErrors.theme = "Kategori harus dipilih";
    if (!formData.summary?.trim()) newErrors.summary = "Ringkasan harus diisi";
    if (projectPhotos.length === 0) newErrors.projectPhoto = "Foto proyek harus diupload";
    if (!proposalFile) newErrors.proposal = "Proposal PDF harus diupload";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return alert("Mohon lengkapi semua field yang wajib diisi");

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) { alert("Session expired"); router.push("/login"); return; }

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title.trim());
      formDataToSend.append("summary", formData.summary.trim());
      formDataToSend.append("evaluation", formData.evaluation.trim());
      formDataToSend.append("suggestion", formData.suggestion.trim());
      formDataToSend.append("theme", formData.theme);

      projectPhotos.forEach(photo => formDataToSend.append("projectPhotos", photo.file));
      if (proposalFile?.file) formDataToSend.append("proposal", proposalFile.file);

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/projects`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend
      });

      if (!response.ok) throw new Error("Gagal menambahkan proyek");

      alert("Proyek berhasil ditambahkan!");
      router.push("/proyek-saya");
    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FixLayout>
      <div className="min-h-screen bg-[#FCFCFC]">
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-8">
          <h1 className="text-3xl font-bold text-[#004A74]">Tambah Proyek Baru</h1>

          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 mt-6 space-y-6">
            {/* Judul */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Judul Proyek *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 ${errors.title ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#004A74] focus:ring-[#004A74]"}`}
                placeholder="Masukkan judul proyek"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kategori *</label>
              <select
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 ${errors.theme ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#004A74] focus:ring-[#004A74]"}`}
              >
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat} disabled={cat === "Pilih Kategori"}>{cat}</option>
                ))}
              </select>
              {errors.theme && <p className="text-red-500 text-xs mt-1">{errors.theme}</p>}
            </div>

            {/* Ringkasan */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Ringkasan Proyek *</label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows="3"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 ${errors.summary ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#004A74] focus:ring-[#004A74]"}`}
                placeholder="Ringkasan singkat tentang proyek"
              />
              {errors.summary && <p className="text-red-500 text-xs mt-1">{errors.summary}</p>}
            </div>

            {/* Upload Foto */}
            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.projectPhoto ? "border-red-500" : "border-gray-300"}`}>
              <input ref={projectPhotoInputRef} type="file" accept="image/png,image/jpeg,image/jpg" multiple className="hidden" onChange={handleProjectPhotoChange} />
              <button type="button" onClick={() => projectPhotoInputRef.current?.click()} className="px-4 py-2 bg-gray-100 rounded-lg">Tambah Foto</button>
              <div className="flex flex-wrap gap-4 mt-4">
                {projectPhotos.map((photo, idx) => (
                  <div key={idx} className="relative">
                    <img src={photo.preview} alt="" className="w-48 h-32 object-cover rounded-lg border border-gray-200" />
                    <button type="button" onClick={() => removeProjectPhoto(idx)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1">X</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upload Proposal */}
            <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.proposal ? "border-red-500" : "border-gray-300"}`}>
              <input ref={proposalInputRef} type="file" accept="application/pdf" className="hidden" onChange={handleProposalChange} />
              {!proposalFile ? (
                <button type="button" onClick={() => proposalInputRef.current?.click()} className="px-4 py-2 bg-gray-100 rounded-lg">Pilih File PDF</button>
              ) : (
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                  <p>{proposalFile.name}</p>
                  <button type="button" onClick={removeProposal} className="text-red-500">X</button>
                </div>
              )}
            </div>

            {/* Submit */}
            <button type="submit" disabled={submitting} className="w-full px-6 py-3 bg-[#004A74] text-white rounded-lg">{submitting ? "Menyimpan..." : "Simpan Proyek"}</button>
          </form>
        </div>
      </div>
    </FixLayout>
  );
}
