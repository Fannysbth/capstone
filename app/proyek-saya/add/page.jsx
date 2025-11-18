"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FixLayout from "../../../components/FixLayout";

export default function AddProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const isEditMode = Boolean(id);

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
  const [loading, setLoading] = useState(false);

  const projectPhotoInputRef = useRef(null);
  const proposalInputRef = useRef(null);

  const categories = [
    "Pilih Kategori",
    "Kesehatan", 
    "Pengelolaan Sampah", 
    "Smart City", 
    "Transportasi Ramah Lingkungan"
  ];

  // Fetch project data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchProjectData();
    }
  }, [id]);

  const fetchProjectData = async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    // **PERBAIKAN: Gunakan URL lengkap**
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetch(`${backendUrl}/api/projects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    console.log("Fetch project response status:", response.status);

    if (response.ok) {
      const project = await response.json();
      console.log("Project data received for edit:", project);
      
      // **PERBAIKAN: Transformasi data yang lebih aman**
      setFormData({
        title: project.title || "",
        summary: project.summary || "",
        evaluation: project.evaluation || "",
        suggestion: project.suggestion || "",
        theme: project.theme || ""
      });

      // **PERBAIKAN: Handle project photos dengan benar**
      if (project.projectPhotoUrls && project.projectPhotoUrls.length > 0) {
        const photos = project.projectPhotoUrls.map(url => ({
          preview: url,
          isExisting: true,
          url: url // simpan URL asli untuk reference
        }));
        setProjectPhotos(photos);
      }

      // **PERBAIKAN: Handle proposal file**
      if (project.proposalDriveLink) {
        setProposalFile({
          name: project.proposalDriveLink.fileName || "Proposal.pdf",
          isExisting: true,
          url: project.proposalDriveLink.downloadLink // simpan URL download
        });
      }
    } else {
      const errorData = await response.json().catch(() => ({ message: "Unknown error" }));
      console.error("Failed to fetch project:", errorData);
      alert(`Gagal memuat data proyek: ${errorData.message || "Unknown error"}`);
    }
  } catch (err) {
    console.error("Error fetching project:", err);
    alert("Terjadi kesalahan saat memuat data proyek");
  } finally {
    setLoading(false);
  }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Project Photo Handler
 const handleProjectPhotoChange = (e) => {
  const files = Array.from(e.target.files); // ambil semua file
  const validTypes = ["image/png", "image/jpeg", "image/jpg"];
  
  const newPhotos = files.map(file => {
    if (!validTypes.includes(file.type)) {
      alert(`File ${file.name} harus berupa gambar (PNG/JPG/JPEG)`);
      return null;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(`File ${file.name} terlalu besar. Maksimal 5MB`);
      return null;
    }

    return {
      file,
      preview: URL.createObjectURL(file),
      isExisting: false
    };
  }).filter(Boolean);

  setProjectPhotos(prev => [...prev, ...newPhotos]);
};

const removeProjectPhoto = (index) => {
  setProjectPhotos(prev => {
    const updated = [...prev];
    const removed = updated.splice(index, 1)[0];
    if (!removed.isExisting) URL.revokeObjectURL(removed.preview);
    return updated;
  });
};



  // Proposal File Handler
  const handleProposalChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Hanya file PDF yang diperbolehkan untuk proposal");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("File terlalu besar. Maksimal 10MB");
      return;
    }

    setProposalFile({
      file,
      name: file.name,
      isExisting: false
    });

    if (errors.proposal) {
      setErrors(prev => ({ ...prev, proposal: "" }));
    }
  };

  const removeProposal = () => {
    setProposalFile(null);
    if (proposalInputRef.current) {
      proposalInputRef.current.value = "";
    }
  };

  const validate = () => {
  const newErrors = {};

  console.log('=== VALIDATING FORM ===');
  console.log('isEditMode:', isEditMode);
  console.log('formData:', formData);
  console.log('projectPhotos:', projectPhotos);
  console.log('proposalFile:', proposalFile);

  // Validate title
  const titleValue = formData.title?.trim() || '';
  if (!titleValue) {
    newErrors.title = "Judul proyek harus diisi";
  } else if (titleValue.length < 2) {
    newErrors.title = "Judul proyek minimal 2 karakter";
  }

  // Validate theme
  if (!formData.theme || formData.theme === "Pilih Kategori") {
    newErrors.theme = "Kategori harus dipilih";
  }

  // Validate summary
  const summaryValue = formData.summary?.trim() || '';
  if (!summaryValue) {
    newErrors.summary = "Ringkasan harus diisi";
  } else if (summaryValue.length < 10) {
    newErrors.summary = "Ringkasan minimal 10 karakter";
  }

  // **PERBAIKAN: Untuk edit mode, evaluation dan suggestion tidak wajib jika sudah ada data**
  const evaluationValue = formData.evaluation?.trim() || '';
  if (!evaluationValue && !isEditMode) {
    newErrors.evaluation = "Evaluasi harus diisi";
  } else if (evaluationValue && evaluationValue.length < 10) {
    newErrors.evaluation = "Evaluasi minimal 10 karakter";
  }

  const suggestionValue = formData.suggestion?.trim() || '';
  if (!suggestionValue && !isEditMode) {
    newErrors.suggestion = "Saran pengembangan harus diisi";
  } else if (suggestionValue && suggestionValue.length < 10) {
    newErrors.suggestion = "Saran pengembangan minimal 10 karakter";
  }

  // **PERBAIKAN: Untuk edit mode, foto dan proposal tidak wajib jika sudah ada**
  if (!isEditMode && projectPhotos.length === 0) {
    newErrors.projectPhoto = "Foto proyek harus diupload";
  }

  if (!isEditMode && !proposalFile) {
    newErrors.proposal = "Proposal (PDF) harus diupload";
  }

  console.log('Validation errors:', newErrors);
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validate()) {
    alert("Mohon lengkapi semua field yang wajib diisi");
    return;
  }

  setSubmitting(true);

  try {
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Session expired. Please login again.");
      router.push("/login");
      return;
    }

    const formDataToSend = new FormData();

    // Append text fields
    formDataToSend.append('title', formData.title.trim());
    formDataToSend.append('summary', formData.summary.trim());
    formDataToSend.append('evaluation', formData.evaluation.trim());
    formDataToSend.append('suggestion', formData.suggestion.trim());
    formDataToSend.append('theme', formData.theme);

    // **PERBAIKAN: Untuk edit mode, handle photos yang baru saja diupload**
    projectPhotos.forEach((photo, index) => {
      if (!photo.isExisting && photo.file) {
        console.log(`Appending new photo ${index}:`, photo.file.name);
        formDataToSend.append("projectPhotos", photo.file);
      }
    });

    // **PERBAIKAN: Untuk edit mode, hanya append proposal jika file baru**
    if (proposalFile && !proposalFile.isExisting && proposalFile.file) {
      console.log('Appending new proposal:', proposalFile.file.name);
      formDataToSend.append("proposal", proposalFile.file);
    }

    // Debug: log all FormData entries
    console.log("=== FormData entries ===");
    let formDataDebug = {};
    for (let [key, value] of formDataToSend.entries()) {
      if (value instanceof File) {
        console.log(key, `File: ${value.name} (${value.size} bytes)`);
        if (!formDataDebug[key]) formDataDebug[key] = [];
        formDataDebug[key].push(`File: ${value.name}`);
      } else {
        console.log(key, value);
        if (!formDataDebug[key]) formDataDebug[key] = [];
        formDataDebug[key].push(value);
      }
    }
    console.log('FormData summary:', formDataDebug);

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const url = isEditMode 
      ? `${backendUrl}/api/projects/${id}` 
      : `${backendUrl}/api/projects`;
    
    const method = isEditMode ? "PUT" : "POST";

    console.log('=== SENDING REQUEST ===');
    console.log('URL:', url);
    console.log('Method:', method);
    console.log('isEditMode:', isEditMode);

    const response = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        // Jangan set Content-Type untuk FormData
      },
      body: formDataToSend,
    });

    console.log("=== RESPONSE RECEIVED ===");
    console.log("Response status:", response.status);

    let responseData;
    const responseText = await response.text();
    
    try {
      responseData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      console.error("Response text was:", responseText);
      throw new Error("Server mengirim response yang tidak valid");
    }

    if (!response.ok) {
      const errorMessage = responseData.message || responseData.error || `HTTP ${response.status}`;
      throw new Error(errorMessage);
    }

    alert(`Proyek berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}!`);
    
    // **PERBAIKAN: Redirect dengan timeout lebih pendek**
    setTimeout(() => {
      router.push("/proyek-saya");
      router.refresh(); // Refresh untuk update data terbaru
    }, 100);

  } catch (error) {
    console.error("=== ERROR SAVING PROJECT ===");
    console.error("Error:", error);
    
    alert(`Error: ${error.message}`);
  } finally {
    setSubmitting(false);
  }
};

 if (loading) {
  return (
    <FixLayout>
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#004A74]"></div>
          <p className="text-gray-500 mt-4">
            {isEditMode ? "Memuat data proyek..." : "Mempersiapkan form..."}
          </p>
          {isEditMode && (
            <p className="text-sm text-gray-400 mt-2">ID: {id}</p>
          )}
        </div>
      </div>
    </FixLayout>
  );
}

  return (
    <FixLayout>
      <div className="min-h-screen bg-[#FCFCFC]">
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-8">
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
            <span>›</span>
            <span className="text-[#004A74] font-semibold">
              {isEditMode ? "Edit Proyek" : "Tambah Proyek"}
            </span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-block">
              <h1 className="text-3xl font-bold text-[#004A74]">
                {isEditMode ? "Edit Proyek" : "Tambah Proyek Baru"}
              </h1>
              <div className="h-1 bg-[#FED400] rounded mt-2"></div>
            </div>
            {isEditMode && (
              <p className="text-gray-600 mt-2">
                Edit informasi proyek Anda. Upload file baru jika ingin mengganti foto atau proposal.
              </p>
            )}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="space-y-6">
              {/* Judul Proyek */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Judul Proyek <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                    errors.title ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#004A74] focus:ring-[#004A74]"
                  }`}
                  placeholder="Masukkan judul proyek capstone"
                />
                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Kategori <span className="text-red-500">*</span>
                </label>
                <select
                  name="theme"
                  value={formData.theme}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                    errors.theme ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#004A74] focus:ring-[#004A74]"
                  }`}
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat} disabled={cat === "Pilih Kategori"}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.theme && <p className="text-red-500 text-xs mt-1">{errors.theme}</p>}
              </div>

              {/* Ringkasan */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ringkasan Proyek <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="summary"
                  value={formData.summary}
                  onChange={handleChange}
                  rows="3"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 resize-none ${
                    errors.summary ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#004A74] focus:ring-[#004A74]"
                  }`}
                  placeholder="Ringkasan singkat tentang proyek"
                />
                {errors.summary && <p className="text-red-500 text-xs mt-1">{errors.summary}</p>}
              </div>

              {/* Evaluasi Capstone */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Evaluasi Capstone <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="evaluation"
                  value={formData.evaluation}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 resize-none ${
                    errors.evaluation ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#004A74] focus:ring-[#004A74]"
                  }`}
                  placeholder="Hasil evaluasi proyek: performa sistem, pencapaian target, kelebihan dan kekurangan"
                />
                {errors.evaluation && <p className="text-red-500 text-xs mt-1">{errors.evaluation}</p>}
              </div>

              {/* Saran Pengembangan */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Saran Pengembangan <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="suggestion"
                  value={formData.suggestion}
                  onChange={handleChange}
                  rows="4"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 resize-none ${
                    errors.suggestion ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-[#004A74] focus:ring-[#004A74]"
                  }`}
                  placeholder="Saran untuk pengembangan lebih lanjut: fitur tambahan, integrasi sistem, atau perbaikan yang bisa dilakukan"
                />
                {errors.suggestion && <p className="text-red-500 text-xs mt-1">{errors.suggestion}</p>}
              </div>

              {/* Foto Proyek */}
              <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
  errors.projectPhoto ? "border-red-500" : "border-gray-300"
}`}>
  <input
    ref={projectPhotoInputRef}
    type="file"
    accept="image/png,image/jpeg,image/jpg"
    multiple // <- ini penting agar bisa pilih banyak file
    onChange={handleProjectPhotoChange}
    className="hidden"
  />

  {/* Tombol untuk menambahkan foto */}
  <button
    type="button"
    onClick={() => projectPhotoInputRef.current?.click()}
    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
  >
    Tambah Foto Proyek
  </button>
  <p className="text-xs text-gray-500 mt-2">PNG/JPG/JPEG, maksimal 5MB per foto</p>

  {/* Preview foto */}
  <div className="flex flex-wrap gap-4 mt-4">
    {projectPhotos.map((photo, idx) => (
      <div key={idx} className="relative">
        <img
          src={photo.preview}
          alt={`Preview ${idx}`}
          className="w-48 h-32 object-cover rounded-lg border border-gray-200"
        />
        <button
          type="button"
          onClick={() => removeProjectPhoto(idx)}
          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    ))}
  </div>
</div>


              {/* Upload Proposal */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Upload Proposal (PDF) {!isEditMode && <span className="text-red-500">*</span>}
                  {isEditMode && <span className="text-gray-500 text-xs ml-2">(Opsional - upload baru untuk mengganti)</span>}
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${
                  errors.proposal ? "border-red-500" : "border-gray-300"
                }`}>
                  <input
                    ref={proposalInputRef}
                    type="file"
                    accept="application/pdf"
                    onChange={handleProposalChange}
                    className="hidden"
                  />
                  
                  {!proposalFile ? (
                    <>
                      <button
                        type="button"
                        onClick={() => proposalInputRef.current?.click()}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                      >
                        Pilih File PDF
                      </button>
                      <p className="text-xs text-gray-500 mt-2">Maksimal 10MB. Hanya file PDF.</p>
                    </>
                  ) : (
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                        <div className="text-left">
                          <p className="font-medium text-sm">{proposalFile.name}</p>
                          <p className="text-xs text-gray-500">
                            {proposalFile.isExisting ? "File saat ini" : "File baru yang akan diupload"}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeProposal}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                {errors.proposal && <p className="text-red-500 text-xs mt-1">{errors.proposal}</p>}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push("/proyek-saya")}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition"
                  disabled={submitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-6 py-3 bg-[#004A74] text-white font-semibold rounded-lg hover:bg-[#003d5e] transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting 
                    ? (isEditMode ? "Memperbarui..." : "Menyimpan...") 
                    : (isEditMode ? "Perbarui Proyek" : "Simpan Proyek")
                  }
                </button>
              </div>
            </div>
          </form>

          {/* Info tentang batasan proyek */}
          {!isEditMode && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm text-blue-800 font-medium">Informasi Penting</p>
                  <p className="text-xs text-blue-700 mt-1">
                    Setiap user hanya dapat memiliki 1 proyek aktif. Pastikan semua informasi yang diisi sudah benar.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </FixLayout>
  );
}