"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import FixLayout from "../../../components/FixLayout.jsx";
import RequestFormClient from "../../../components/RequestFormClient";

const Stars = ({ rating = 0, interactive = false, onRatingChange = null }) => {
  const r = Math.max(0, Math.min(5, Number(rating || 0)));

  const handleStarClick = (index) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1);
    }
  };

  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: 5 }).map((_, i) => (
        <img
          key={i}
          src={
            i < Math.round(r)
              ? "/assets/icons/star-filled.png"
              : "/assets/icons/star-empty.png"
          }
          alt="star"
          className={`w-6 h-6 ${
            interactive
              ? "cursor-pointer hover:scale-110 transition-transform"
              : ""
          }`}
          onClick={() => handleStarClick(i)}
        />
      ))}
    </div>
  );
};

export default function DetailPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params?.id;

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Rating states
  const [userRating, setUserRating] = useState(0);
  const [userRatingId, setUserRatingId] = useState(null);
  const [isRatingMode, setIsRatingMode] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  // Comment states
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  // Check login status and get current user
  useEffect(() => {
    const saved = localStorage.getItem("isLoggedIn") === "true";
    const userData = localStorage.getItem("user");
    console.log("Login Status:", saved);
    console.log("Raw User Data from localStorage:", userData);
    setIsLoggedIn(saved);

    if (userData) {
      const parsedData = JSON.parse(userData);
      // Ambil hanya parsedData.user
      setCurrentUser(parsedData.user);
    }
  }, []);

  // Fetch project detail from BE
  useEffect(() => {
    if (!projectId) return;
    
    const fetchProject = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        
        console.log('Fetching project detail for ID:', projectId);
        
        const response = await fetch(`${apiUrl}/api/projects/${projectId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Project detail data received:', data);
        
        // PERBAIKAN: Transform data from BE to FE format
        const transformedProject = {
          id: data._id,
          title: data.title,
          category: data.theme,
          group: data.ownerId?.groupName || 'Kelompok',
          description: data.summary,
          evaluation: data.evaluation,
          developmentSuggestion: data.suggestion,
          // PERBAIKAN: Gunakan projectPhotoUrls array untuk images
          images: data.projectPhotoUrls && data.projectPhotoUrls.length > 0 
            ? data.projectPhotoUrls 
            : ["/assets/images/default-project.jpg"],
          thumbnail: data.projectPhotoUrls && data.projectPhotoUrls.length > 0 
            ? data.projectPhotoUrls[0] 
            : "/assets/images/default-project.jpg",
          rating: data.avgRating || 0,
          availableForContinuation: data.status === 'Open',
          ownerId: data.ownerId,
          status: data.status
        };
        
        console.log('Transformed project:', transformedProject);
        
        setProject(transformedProject);
        setAverageRating(data.avgRating || 0);
        setRatingCount(data.ratingCount || 0);
        
        // Fetch comments and ratings for this project
        await Promise.all([
          fetchComments(projectId),
          fetchRatings(projectId)
        ]);
        
      } catch (err) {
        console.error("Error fetching project:", err);
        alert('Gagal memuat detail project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  // Fetch comments from BE
  const fetchComments = async (projectId) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/comments/${projectId}`);
      
      if (response.ok) {
        const commentsData = await response.json();
        console.log("Comments Data from API:", commentsData);
        // Handle both array response and object with comments property
        const commentsArray = Array.isArray(commentsData) ? commentsData : commentsData.comments || [];
        setComments(commentsArray);
        commentsArray.forEach(comment => {
          console.log("Comment:", comment._id, "Author:", comment.userId);
        });
      } else {
        throw new Error('Failed to fetch comments');
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
      // Use empty array if BE fails
      setComments([]);
    }
  };

  // Fetch ratings from BE and check user's existing rating
  const fetchRatings = async (projectId) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/ratings/${projectId}`);
      
      if (response.ok) {
        const ratingsData = await response.json();
        console.log("Ratings Data from API:", ratingsData);
        setAverageRating(ratingsData.average || 0);
        setRatingCount(ratingsData.ratings?.length || 0);
        
        // Check if current user has rated this project
        if (currentUser && ratingsData.ratings) {
          console.log("Current User ID:", currentUser._id);
          console.log("All Ratings:", ratingsData.ratings);
          
          const userRating = ratingsData.ratings.find(
            rating => {
              console.log("Rating User ID:", rating.userId?._id);
              console.log("Comparison:", rating.userId?._id === currentUser._id);
              return rating.userId?._id === currentUser._id;
            }
          );
          
          console.log("Found User Rating:", userRating);
          
          if (userRating) {
            setUserRating(userRating.score);
            setUserRatingId(userRating._id);
          } else {
            setUserRating(0);
            setUserRatingId(null);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching ratings:", err);
    }
  };

  // Fungsi handle image error
  const handleImageError = (e) => {
    e.target.src = "/assets/images/default-project.jpg";
  };

  // Submit rating to BE
  const submitRating = async (rating) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Silakan login terlebih dahulu!");
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/ratings/${projectId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          score: rating
        })
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Rating ${rating} bintang berhasil ${userRatingId ? 'diupdate' : 'dikirim'}!`);
        setIsRatingMode(false);
        setUserRating(0);
        
        // Refresh ratings data
        await fetchRatings(projectId);
        
        // Update project rating in local state
        if (project) {
          setProject({
            ...project,
            rating: result.average || rating
          });
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit rating');
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
      alert(err.message || 'Gagal mengirim rating');
    }
  };

  // Delete rating from BE
  const deleteRating = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Silakan login terlebih dahulu!");
        return;
      }

      if (!userRatingId) {
        alert("Tidak ada rating untuk dihapus!");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/ratings/${projectId}/${userRatingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Rating berhasil dihapus!');
        setIsRatingMode(false);
        setUserRating(0);
        setUserRatingId(null);
        
        // Refresh ratings data
        await fetchRatings(projectId);
        
        // Update project rating in local state
        if (project) {
          setProject({
            ...project,
            rating: 0
          });
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete rating');
      }
    } catch (err) {
      console.error("Error deleting rating:", err);
      alert(err.message || 'Gagal menghapus rating');
    }
  };

  // Submit comment to BE
  const submitComment = async (text, parentId = null) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Silakan login terlebih dahulu!");
        router.push('/login');
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/comments/${projectId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          parentId: parentId
        })
      });

      if (response.ok) {
        const newComment = await response.json();
        alert('Komentar berhasil dikirim!');
        return newComment;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit comment');
      }
    } catch (err) {
      console.error("Error submitting comment:", err);
      alert(err.message || 'Gagal mengirim komentar');
      return null;
    }
  };

  // Update comment in BE
  const updateComment = async (commentId, text) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/comments/${projectId}/${commentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text
        })
      });

      if (response.ok) {
        const updatedComment = await response.json();
        alert('Komentar berhasil diperbarui!');
        return updatedComment;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update comment');
      }
    } catch (err) {
      console.error("Error updating comment:", err);
      alert(err.message || 'Gagal mengupdate komentar');
      return null;
    }
  };

  // Delete comment from BE
  const deleteComment = async (commentId) => {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      
      const response = await fetch(`${apiUrl}/api/comments/${projectId}/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        alert('Komentar berhasil dihapus!');
        return true;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete comment');
      }
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert(err.message || 'Gagal menghapus komentar');
      return false;
    }
  };

  const handlePrevImage = () => {
    if (project?.images?.length > 0) {
      setSelectedImageIndex((prev) =>
        prev === 0 ? project.images.length - 1 : prev - 1
      );
    }
  };

  const handleNextImage = () => {
    if (project?.images?.length > 0) {
      setSelectedImageIndex((prev) =>
        prev === project.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleRatingClick = () => {
    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu untuk memberikan rating!");
      router.push('/login');
      return;
    }

    if (userRating === 0) {
      alert("Silakan pilih rating terlebih dahulu!");
      return;
    }

    submitRating(userRating);
  };

  const handleAddComment = async () => {
    if (!isLoggedIn) {
      alert("Silakan login terlebih dahulu untuk memberikan komentar!");
      router.push('/login');
      return;
    }

    if (newComment.trim()) {
      const newCommentData = await submitComment(newComment);
      if (newCommentData) {
        setComments([newCommentData, ...comments]);
        setNewComment("");
      }
    }
  };

  const handleReply = async (commentId) => {
    if (replyText.trim()) {
      const replyData = await submitComment(replyText, commentId);
      if (replyData) {
        // Update the comment with the new reply
        setComments(comments.map(comment => 
          comment._id === commentId 
            ? { ...comment, replies: [...(comment.replies || []), replyData] }
            : comment
        ));
        setReplyText("");
        setReplyTo(null);
      }
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditCommentText(comment.text);
  };

  const handleUpdateComment = async (commentId) => {
    if (editCommentText.trim()) {
      const updatedComment = await updateComment(commentId, editCommentText);
      if (updatedComment) {
        setComments(comments.map(comment =>
          comment._id === commentId
            ? { ...comment, text: editCommentText }
            : comment
        ));
        setEditingComment(null);
        setEditCommentText("");
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditCommentText("");
  };

  const handleDeleteComment = async (commentId) => {
    if (confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
      const success = await deleteComment(commentId);
      if (success) {
        setComments(comments.filter(comment => comment._id !== commentId));
      }
    }
  };

  const handleRequestContinuation = async(id) => {
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    router.push(`/detail/${id}/request`); 
  };

  const handleViewGroupDetail = () => {
    if (project?.ownerId?._id) {
      router.push(`/profil/${project.ownerId._id}`);
    }
  };

  // Check if current user is the author of a comment
  const isCommentAuthor = (comment) => {
    return currentUser && comment.userId && comment.userId._id === currentUser._id;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-[#004A74]"></div>
          <p className="text-gray-500 mt-4">Memuat detail project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Project tidak ditemukan</p>
          <button
            onClick={() => router.push("/katalog")}
            className="mt-4 px-6 py-2 bg-[#004A74] text-white rounded-lg hover:bg-[#003d5e] transition"
          >
            Kembali ke Katalog
          </button>
        </div>
      </div>
    );
  }

  const currentImage = project.images?.[selectedImageIndex] || project.thumbnail;

  return (
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
              onClick={() => router.push("/katalog")}
            >
              Katalog
            </span>
            <span>›</span>
            <span className="text-[#004A74] font-semibold line-clamp-1">
              {project.title}
            </span>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-8 mb-12">
            {/* Left: Hero Image Gallery */}
            <div className="space-y-4">
              {/* Main Hero Image with Overlay */}
              <div className="relative rounded-lg overflow-hidden h-[400px] group">
                <img
                  src={currentImage}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                {/* Navigation Arrows */}
                {project.images?.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition opacity-0 group-hover:opacity-100"
                    >
                      <svg
                        className="w-6 h-6 text-[#004A74]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition opacity-0 group-hover:opacity-100"
                    >
                      <svg
                        className="w-6 h-6 text-[#004A74]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}

                {/* Dot Indicators at Bottom */}
                {project.images?.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {project.images.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          selectedImageIndex === idx
                            ? "bg-[#FED400] w-6"
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {project.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {project.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition ${
                        selectedImageIndex === idx
                          ? "border-[#004A74]"
                          : "border-gray-200 hover:border-[#004A74]"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={handleImageError}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Project Info */}
            <div className="space-y-6">
              {/* Title Section */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-[#004A74] mb-3">
                  {project.title}
                </h1>

                {/* Category Badge */}
                <div className="mb-0">
                  <span className="inline-block text-lg font-regular text-[#004A74] py-1 rounded-full">
                    {project.category}
                  </span>
                </div>

                {/* Group Name */}
                <p className="text-md text-gray-600 mb-2 font-regular">
                  {project.group}
                </p>

                {/* Rating Section */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Stars rating={averageRating} />
                      <span className="text-sm text-gray-500">
                        ({ratingCount} rating)
                      </span>
                    </div>

                    {isLoggedIn && (
                      <button
                        onClick={() => {
                          setIsRatingMode(!isRatingMode);
                          // Pre-fill with existing rating if user has rated
                          if (userRatingId && userRating > 0) {
                            setUserRating(userRating);
                          }
                        }}
                        className="text-sm text-[#004A74] hover:underline font-semibold"
                      >
                        {userRatingId ? "Edit Rating" : "Kirim Rating"}
                      </button>
                    )}
                  </div>

                  {/* Interactive Rating Box */}
                  {isRatingMode && (
                    <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 mt-3">
                      <p className="text-sm font-semibold text-[#004A74] mb-3">
                        {userRatingId ? "Edit Rating Anda" : "Pilih rating Anda:"}
                      </p>
                      <div className="flex items-center gap-4 mb-3">
                        <Stars
                          rating={userRating}
                          interactive={true}
                          onRatingChange={setUserRating}
                        />
                        {userRating > 0 && (
                          <span className="text-sm text-gray-600 font-medium">
                            {userRating} bintang
                          </span>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleRatingClick}
                          disabled={userRating === 0}
                          className="px-4 py-2 bg-[#004A74] text-white text-sm font-semibold rounded-lg hover:bg-[#003d5e] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {userRatingId ? "Update Rating" : "Kirim Rating"}
                        </button>
                        {userRatingId && (
                          <button
                            onClick={deleteRating}
                            className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition"
                          >
                            Hapus Rating
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setIsRatingMode(false);
                            setUserRating(0);
                          }}
                          className="px-4 py-2 border border-gray-300 text-gray-600 text-sm font-semibold rounded-lg hover:bg-gray-50 transition"
                        >
                          Batal
                        </button>
                      </div>
                    </div>
                  )}
                </div>

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

                {/* Request Button */}
                {project.availableForContinuation && (
                  <button
                    onClick={() => handleRequestContinuation(projectId)}
                    className="w-full py-3 bg-[#004A74] text-white font-semibold rounded-lg hover:bg-[#003d5e] transition shadow-lg"
                  >
                    Kirim Request
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
            {/* Deskripsi Project */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#004A74] mb-2 pb-2 border-b-2 border-[#FED400] inline-block">
                Deskripsi Project
              </h2>
              <p className="text-gray-700 leading-relaxed text-justify mt-2">
                {project.description}
              </p>
            </div>

            {/* Evaluasi Project */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-[#004A74] mb-2 pb-2 border-b-2 border-[#FED400] inline-block">
                Evaluasi Project
              </h2>
              <p className="text-gray-700 leading-relaxed text-justify mt-2">
                {project.evaluation}
              </p>
            </div>

            {/* Saran Pengembangan */}
            <div>
              <h2 className="text-xl font-bold text-[#004A74] mb-2 pb-2 border-b-2 border-[#FED400] inline-block">
                Saran Pengembangan
              </h2>
              <p className="text-gray-700 leading-relaxed text-justify mt-2">
                {project.developmentSuggestion}
              </p>
            </div>
          </div>

          {/* Anggota Kelompok */}
          {project.ownerId?.members && project.ownerId.members.length > 0 && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#004A74]">
                  Anggota Kelompok
                </h2>
                <button 
                  onClick={handleViewGroupDetail}
                  className="px-4 py-2 border border-[#004A74] text-[#004A74] font-semibold rounded-lg hover:bg-blue-50 transition text-sm"
                >
                  Detail Kelompok
                </button>
              </div>

              <div className="flex gap-8 flex-wrap">
                {project.ownerId.members.map((member, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mb-2 mx-auto flex items-center justify-center">
                      {member.photoUrl ? (
                        <img 
                          src={member.photoUrl} 
                          alt={member.name}
                          className="w-full h-full rounded-full object-cover"
                          onError={handleImageError}
                        />
                      ) : (
                        <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm font-medium text-gray-800">{member.name}</p>
                    <p className="text-xs text-gray-600">{member.major}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Komentar Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-[#004A74]">
                Komentar ({comments.length})
              </h2>
            </div>

            {/* Add Comment Form */}
            {isLoggedIn && (
              <div className="mb-6">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Tulis komentar Anda..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#004A74] focus:ring-1 focus:ring-[#004A74] resize-none"
                  rows="3"
                />
                <div className="flex justify-end mt-2">
                  <button
                    onClick={handleAddComment}
                    disabled={!newComment.trim()}
                    className="px-6 py-2 bg-[#004A74] text-white font-semibold rounded-lg hover:bg-[#003d5e] transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Kirim Komentar
                  </button>
                </div>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  Belum ada komentar. Jadilah yang pertama berkomentar!
                </p>
              ) : (
                comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="border-b border-gray-200 pb-6 last:border-0"
                  >
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                        <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-[#004A74]">
                              {comment.userId?.groupName || "Anonymous"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                            </p>
                          </div>
                          {isCommentAuthor(comment) && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditComment(comment)}
                                className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteComment(comment._id)}
                                className="text-xs text-red-600 hover:text-red-800 hover:underline"
                              >
                                Hapus
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Comment Text or Edit Form */}
                        {editingComment === comment._id ? (
                          <div className="mb-3">
                            <textarea
                              value={editCommentText}
                              onChange={(e) => setEditCommentText(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#004A74] resize-none"
                              rows="3"
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleUpdateComment(comment._id)}
                                disabled={!editCommentText.trim()}
                                className="px-4 py-1.5 bg-[#004A74] text-white text-sm rounded-lg hover:bg-[#003d5e] transition disabled:opacity-50"
                              >
                                Update
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="px-4 py-1.5 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-700 mb-3">{comment.text}</p>
                        )}

                        {isLoggedIn && editingComment !== comment._id && (
                          <button
                            onClick={() => setReplyTo(comment._id)}
                            className="text-sm text-[#004A74] hover:underline flex items-center gap-1"
                          >
                            Reply
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </button>
                        )}

                        {/* Reply Form */}
                        {replyTo === comment._id && (
                          <div className="mt-4 ml-8">
                            <textarea
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Tulis balasan..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#004A74] resize-none text-sm"
                              rows="2"
                            />
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleReply(comment._id)}
                                className="px-4 py-1.5 bg-[#004A74] text-white text-sm rounded-lg hover:bg-[#003d5e] transition"
                              >
                                Kirim
                              </button>
                              <button
                                onClick={() => {
                                  setReplyTo(null);
                                  setReplyText("");
                                }}
                                className="px-4 py-1.5 border border-gray-300 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        )}

                        {/* Replies */}
                        {comment.replies?.length > 0 && (
                          <div className="mt-4 ml-8 space-y-4">
                            {comment.replies.map((reply) => (
                              <div key={reply._id} className="flex gap-3">
                                <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center">
                                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-start justify-between mb-1">
                                    <div>
                                      <p className="font-semibold text-[#004A74] text-sm">
                                        {reply.userId?.groupName || "Anonymous"}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {new Date(reply.createdAt).toLocaleDateString("id-ID", {
                                          day: "numeric",
                                          month: "long",
                                          year: "numeric",
                                        })}
                                      </p>
                                    </div>
                                    {isCommentAuthor(reply) && (
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleEditComment(reply)}
                                          className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                                        >
                                          Edit
                                        </button>
                                        <button
                                          onClick={() => handleDeleteComment(reply._id)}
                                          className="text-xs text-red-600 hover:text-red-800 hover:underline"
                                        >
                                          Hapus
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-gray-700 text-sm">
                                    {reply.text}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </FixLayout>
  );
}