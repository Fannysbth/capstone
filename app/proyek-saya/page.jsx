"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import FixLayout from "../../components/FixLayout";
import EmptyProjectState from "../../components/EmptyProjectState";

export default function ProyekSayaPage() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token tidak ditemukan. Silakan login kembali.");
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/projects/user/my-projects`, 
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Response status:", response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log("Projects data:", data);
          
          // PERBAIKAN: Handle struktur response yang berbeda
          if (data.projects) {
            setProjects(data.projects);
          } else if (Array.isArray(data)) {
            setProjects(data);
          } else {
            setProjects([]);
          }
        } else {
          if (response.status === 401) {
            localStorage.removeItem("token");
            router.push("/login");
            return;
          }
          
          const errorText = await response.text();
          let errorMessage = "Gagal memuat proyek";
          
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message || errorMessage;
          } catch {
            errorMessage = errorText || errorMessage;
          }
          
          setError(errorMessage);
        }
      } catch (err) {
        console.error("Error fetching user projects:", err);
        setError("Terjadi kesalahan saat memuat proyek");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProjects();
  }, [router]);

  // REDIRECT otomatis jika user punya 1 proyek
  useEffect(() => {
    if (!loading && projects.length === 1) {
      const projectId = projects[0]._id || projects[0].id;
      console.log("Redirecting to project detail:", projectId);
      router.push(`/proyek-saya/detail?id=${projectId}`);
    }
  }, [loading, projects, router]);

  // Loading UI
  if (loading) {
    return (
      <FixLayout>
        <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#004A74]"></div>
            <p className="text-gray-500 mt-4">Memuat proyek...</p>
          </div>
        </div>
      </FixLayout>
    );
  }

  // Error UI
  if (error) {
    return (
      <FixLayout>
        <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Terjadi Kesalahan</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <div className="space-x-4">
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#004A74] text-white rounded-lg hover:bg-[#003d5e] transition text-sm font-semibold"
              >
                Coba Lagi
              </button>
              <button
                onClick={() => router.push("/login")}
                className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition text-sm font-semibold"
              >
                Login Ulang
              </button>
            </div>
          </div>
        </div>
      </FixLayout>
    );
  }

  // Jika user belum punya proyek → tampilkan EmptyProjectState
  if (projects.length === 0) {
    return <EmptyProjectState />;
  }

  // Jika user punya 1 proyek → jangan render apa-apa (redirect sedang berlangsung)
  if (projects.length === 1) {
    return (
      <FixLayout>
        <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#004A74]"></div>
            <p className="text-gray-500 mt-4">Mengarahkan ke proyek...</p>
          </div>
        </div>
      </FixLayout>
    );
  }

  // fallback (tidak akan pernah terjadi karena user max 1 proyek)
  return null;
}