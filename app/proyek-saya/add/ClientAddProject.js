'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import FixLayout from "../../../components/FixLayout";

export default function ClientAddProject() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Defer searchParams until client mounted ---
  const [id, setId] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const paramId = searchParams.get("id");
    setId(paramId);
    setReady(true);
  }, [searchParams]);

  if (!ready) return null;

  const isEditMode = Boolean(id);

  // --- State ---
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
    if (isEditMode) fetchProjectData();
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

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${backendUrl}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (response.ok) {
        const project = await response.json();
        setFormData({
          title: project.title || "",
          summary: project.summary || "",
          evaluation: project.evaluation || "",
          suggestion: project.suggestion || "",
          theme: project.theme || ""
        });

        if (project.projectPhotoUrls?.length > 0) {
          setProjectPhotos(project.projectPhotoUrls.map(url => ({
            preview: url,
            isExisting: true,
            url
          })));
        }

        if (project.proposalDriveLink) {
          setProposalFile({
            name: project.proposalDriveLink.fileName || "Proposal.pdf",
            isExisting: true,
            url: project.proposalDriveLink.downloadLink
          });
        }
      } else {
        const errData = await response.json().catch(() => ({ message: "Unknown error" }));
        alert(`Gagal memuat data proyek: ${errData.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memuat data proyek");
    } finally {
      setLoading(false);
    }
  };

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
      return { file, preview: URL.createObjectURL(file), isExisting: false };
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
    setProposalFile({ file, name: file.name, isExisting: false });
    if (errors.proposal) setErrors(prev => ({ ...prev, proposal: "" }));
  };

  const removeProposal = () => {
    setProposalFile(null);
    if (proposalInputRef.current) proposalInputRef.current.value = "";
  };

  // --- Validation ---
  const validate = () => {
    const newErrors = {};

    if (!formData.title?.trim()) newErrors.title = "Judul proyek harus diisi";
    else if (formData.title.trim().length < 2) newErrors.title = "Judul minimal 2 karakter";

    if (!formData.theme || formData.theme === "Pilih Kategori") newErrors.theme = "Kategori harus dipilih";

    if (!formData.summary?.trim()) newErrors.summary = "Ringkasan harus diisi";
    else if (formData.summary.trim().length < 10) newErrors.summary = "Ringkasan minimal 10 karakter";

    if (!formData.evaluation?.trim() && !isEditMode) newErrors.evaluation = "Evaluasi harus diisi";
    else if (formData.evaluation?.trim().length < 10) newErrors.evaluation = "Evaluasi minimal 10 karakter";

    if (!formData.suggestion?.trim() && !isEditMode) newErrors.suggestion = "Saran pengembangan harus diisi";
    else if (formData.suggestion?.trim().length < 10) newErrors.suggestion = "Saran minimal 10 karakter";

    if (!isEditMode && projectPhotos.length === 0) newErrors.projectPhoto = "Foto proyek harus diupload";

    if (!isEditMode && !proposalFile) newErrors.proposal = "Proposal PDF harus diupload";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      alert("Mohon lengkapi semua field yang wajib diisi");
      return;
    }
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

      projectPhotos.forEach((photo) => {
        if (!photo.isExisting && photo.file) formDataToSend.append("projectPhotos", photo.file);
      });

      if (proposalFile && !proposalFile.isExisting && proposalFile.file) {
        formDataToSend.append("proposal", proposalFile.file);
      }

      const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const url = isEditMode ? `${backendUrl}/api/projects/${id}` : `${backendUrl}/api/projects`;
      const method = isEditMode ? "PUT" : "POST";

      const response = await fetch(url, { method, headers: { Authorization: `Bearer ${token}` }, body: formDataToSend });
      const text = await response.text();
      let data;
      try { data = JSON.parse(text); } catch { data = null; }

      if (!response.ok) throw new Error(data?.message || "Server error");

      alert(`Proyek berhasil ${isEditMode ? "diperbarui" : "ditambahkan"}!`);
      setTimeout(() => { router.push("/proyek-saya"); router.refresh(); }, 100);

    } catch (err) {
      console.error(err);
      alert(`Error: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <FixLayout>
        <div className="min-h-screen flex items-center justify-center bg-[#FCFCFC]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#004A74]"></div>
            <p className="text-gray-500 mt-4">{isEditMode ? "Memuat data proyek..." : "Mempersiapkan form..."}</p>
            {isEditMode && <p className="text-sm text-gray-400 mt-2">ID: {id}</p>}
          </div>
        </div>
      </FixLayout>
    );
  }

  // --- Render form ---
  return (
    <FixLayout>
      <div className="min-h-screen bg-[#FCFCFC]">
        <div className="max-w-4xl mx-auto px-6 md:px-8 py-8">
          <h1 className="text-3xl font-bold text-[#004A74]">{isEditMode ? "Edit Proyek" : "Tambah Proyek Baru"}</h1>
          {/* --- Form --- */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
            {/* Form fields here... */}
            {/* Kamu bisa copy seluruh JSX form dari kode sebelumnya */}
          </form>
        </div>
      </div>
    </FixLayout>
  );
}
