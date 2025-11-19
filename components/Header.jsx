"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  ArrowRightOnRectangleIcon,   // login
  ArrowLeftOnRectangleIcon,    // logout
} from "@heroicons/react/24/outline";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState(null);

useEffect(() => {
  const fetchUser = async () => {
    try {
      // Cek localStorage dulu
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUserId(parsedUser._id || parsedUser.id);
        setUsername(parsedUser.groupName || parsedUser.name || 'User');
        setProfilePhoto(parsedUser.teamPhotoUrl || null);
        setIsLoggedIn(true);
      }

      // Fetch terbaru dari backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
  'Content-Type': 'application/json'
}
      });

      if (res.ok) {
        const userData = await res.json();
        setUserId(userData._id || userData.id);
        setUsername(userData.groupName || userData.name || 'User');
        setProfilePhoto(userData.teamPhotoUrl || null);
        setIsLoggedIn(true);

        // Simpan ke localStorage
        localStorage.setItem("userId", userData._id || userData.id);
        localStorage.setItem("username", userData.groupName || userData.name || 'User');
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");
      } else {
        handleCleanLogout();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  fetchUser();
}, []);


  const handleCleanLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setProfilePhoto(null);
    setUserId(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Always clean up frontend state
      handleCleanLogout();
      router.push("/");
    }
  };

  // Menu items - "Projek" and "Profil" hidden when logged out
  const menu = [
    { name: "Beranda", href: "/" },
    { name: "Katalog", href: "/katalog" },
    // only show these when logged in
    ...(isLoggedIn ? [
      { name: "Riwayat", href: "/history-request" },
      { name: "Proyek", href: "/proyek-saya" },
      { name: "Profil", href: userId ? `/profil/${userId}` : "/profil" }
    ] : []),
  ];

  // Show loading state
  if (isLoading) {
    return (
      <header className="w-full bg-[#08375E] text-white shadow-md border-b border-[#0f4c75]">
        {/* TOP HEADER */}
        <div className="max-w-7xl mx-auto flex items-center gap-4 py-7 px-6">
          <img
            src="/assets/images/ugm-logo.png"
            alt="Logo UGM"
            className="h-14 w-auto"
          />
          <div className="gama-serif">
            <h1 className="text-lg font-semibold leading-tight tracking-wide">
              CAPSTONE CONNECTOR
            </h1>
            <h2 className="text-sm tracking-wide">
              DEPARTEMEN TEKNIK ELEKTRO DAN TEKNOLOGI INFORMASI
            </h2>
            <h2 className="text-sm tracking-wide">UNIVERSITAS GADJAH MADA</h2>
          </div>
        </div>

        {/* NAVBAR - Loading state */}
        <nav className="w-full bg-[#0A3E66] text-white text-sm font-medium select-none">
          <ul className="max-w-7xl mx-auto flex items-center">
            <li className="px-6 py-4 border-r border-[#0f4c75]">
              <div className="w-20 h-4 bg-gray-400 animate-pulse rounded"></div>
            </li>
            <li className="flex-1"></li>
            <li className="px-6 py-4">
              <div className="w-16 h-4 bg-gray-400 animate-pulse rounded"></div>
            </li>
          </ul>
        </nav>
      </header>
    );
  }

  return (
    <header className="w-full bg-[#08375E] text-white shadow-md border-b border-[#0f4c75]">
      
      {/* TOP HEADER */}
      <div className="max-w-7xl mx-auto flex items-center gap-4 py-7 px-6">
        <img
          src="/assets/images/ugm-logo.png"
          alt="Logo UGM"
          className="h-14 w-auto cursor-pointer"
          onClick={() => router.push("/")}
        />
        <div className="gama-serif">
          <h1 className="text-lg font-semibold leading-tight tracking-wide">
            CAPSTONE CONNECTOR
          </h1>
          <h2 className="text-sm tracking-wide">
            DEPARTEMEN TEKNIK ELEKTRO DAN TEKNOLOGI INFORMASI
          </h2>
          <h2 className="text-sm tracking-wide">UNIVERSITAS GADJAH MADA</h2>
        </div>
      </div>

      {/* NAVBAR */}
      <nav className="w-full bg-[#0A3E66] text-white text-sm font-medium select-none">
        <ul className="max-w-7xl mx-auto flex items-center">

          {/* MENU ITEMS */}
          {menu.map((item) => {
            const active = pathname === item.href;

            return (
              <li
                key={item.name}
                className={`px-6 py-4 cursor-pointer border-r border-[#0f4c75] ${
                  active
                    ? "bg-[#FED400] text-black font-semibold"
                    : "hover:text-[#FED400] hover:bg-[#0d4f82]"
                }`}
              >
                <Link href={item.href}>{item.name.toUpperCase()}</Link>
              </li>
            );
          })}

          <li className="flex-1"></li>

          {/* LOGIN / LOGOUT BUTTON */}
          {!isLoggedIn ? (
            <li
              onClick={handleLogin}
              className="flex items-center gap-2 px-6 py-4 cursor-pointer hover:text-[#FED400] hover:bg-[#0d4f82] border-l border-[#0f4c75]"
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              LOGIN
            </li>
          ) : (
            <>
              <li className="flex items-center gap-2 px-6 py-4 border-l border-[#0f4c75]">
                {/* FOTO PROFIL ATAU ICON */}
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    onError={(e) => { 
                      e.target.src = "/assets/images/default-user.png"; 
                    }}
                    className="w-8 h-8 rounded-full object-cover border border-white"
                  />
                ) : (
                  <UserCircleIcon className="w-8 h-8 text-gray-300" />
                )}

                {/* USERNAME */}
                <span className="font-medium tracking-wide">
                  {username?.toUpperCase()}
                </span>
              </li>
              <li
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-4 cursor-pointer hover:bg-red-700 border-l border-[#0f4c75]"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                LOGOUT
              </li>
            </>
          )}

        </ul>
      </nav>

    </header>
  );
}