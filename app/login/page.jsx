'use client';

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  function showToast(message, kind = 'info') {
    const id = 'capstone-toast';
    let el = document.getElementById(id);
    if (!el) {
      el = document.createElement('div');
      el.id = id;
      el.className =
        'fixed bottom-6 right-6 z-50 max-w-xs rounded-md p-3 shadow-lg text-sm';
      document.body.appendChild(el);
    }
    el.innerHTML = `<div class="px-4 py-2 rounded ${
      kind === 'destructive' ? 'bg-red-600 text-white' : 'bg-slate-800 text-white'
    }">${message}</div>`;
    setTimeout(() => {
      if (el) el.innerHTML = '';
    }, 3000);
  }

  async function onSubmit(e) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    let email = String(fd.get('email') || '').trim();
    const password = String(fd.get('password') || '').trim();

    if (!email) {
      showToast('Email diperlukan', 'destructive');
      return;
    }
    if (!password) {
      showToast('Password diperlukan', 'destructive');
      return;
    }

    // Tambahkan @ugm.ac.id jika user hanya input username (tanpa @)
    if (!email.includes('@')) {
      email = `${email}@ugm.ac.id`;
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login gagal');
      }

      showToast('Login berhasil!');
      
      // Simpan status login di localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.groupName || data.user.email);

      
      // Redirect berdasarkan status profil
      setTimeout(() => {
        if (data.isIncomplete) {
          router.push("/");
        } else {
          router.push("/");
        }
      }, 1500);
      
    } catch (error) {
      console.error('Login error:', error);
      showToast(error.message || 'Terjadi kesalahan saat login', 'destructive');
    }
  }

  // Fungsi untuk login Google
  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    window.location.href = `${apiUrl}/api/auth/google`;
  };

  return (
    <div className="min-h-screen relative flex">

      {/* === GLOBAL BACKGROUND === */}
      <img
        src="https://simaster.ugm.ac.id/ugmfw-assets-metronics8/media/ugm/bg-1200.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        alt="bg"
      />
      <div className="absolute inset-0 bg-black/60" />

      {/* MAIN CONTENT */}
      <div className="relative flex w-full">

        {/* LEFT HERO */}
        <aside className="hidden lg:flex w-1/2 relative items-center justify-center text-white">
          <div className="relative z-10 max-w-lg text-center px-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img
                src="https://simaster.ugm.ac.id/ugmfw-assets/images/maskot-simaster.png"
                alt="maskot"
                className="w-16 h-16"
              />
              <img
                src="https://simaster.ugm.ac.id/ugmfw-assets/images/logo-ugm.png"
                alt="ugm"
                className="w-14 h-14"
              />
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight mb-4">
              CAPSTONE <span className="text-yellow-400">CONNECTOR</span>
            </h1>

            <p className="text-lg leading-relaxed text-slate-100 mb-8">
              Portal Informasi Capstone Berkelanjutan adalah platform untuk mendukung
              kesinambungan proyek capstone di lingkungan perguruan tinggi DTETI UGM.
            </p>

            <div className="mb-8 flex items-center justify-center gap-4">
              <a href="#"><img src="https://simaster.ugm.ac.id/ugmfw-assets/images/simaster/playstore.png" className="h-10" /></a>
              <a href="#"><img src="https://simaster.ugm.ac.id/ugmfw-assets/images/simaster/appstore.png" className="h-10" /></a>
            </div>

            <p className="text-sm text-slate-200 mb-6">Made by Kelompok 1 PAW</p>

            <div className="flex gap-6 justify-center text-sm text-slate-200">
              <a href="#" className="hover:underline">Terms &amp; Conditions</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
            </div>
          </div>
        </aside>

        {/* RIGHT LOGIN FORM */}
        <main className="flex-1 relative flex items-center justify-center p-6">
          <div
            className="relative z-20 w-full max-w-[560px] bg-white rounded-2xl shadow-2xl p-8 pb-36"
            style={{
              backgroundImage:
                "url('https://simaster.ugm.ac.id/ugmfw-assets-metronics8/media/ugm/artwork-ugm-revisi-600.png')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'bottom center',
              backgroundSize: 'contain',
            }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">SIGN IN</h2>
              <p className="text-sm text-slate-500 mt-2">Akun Capstone Anda</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md -mt-6">
              <form onSubmit={onSubmit} className="space-y-4" autoComplete="off" noValidate>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    UGM ID (tanpa @ugm.ac.id) atau Email
                  </label>
                  <input
                    name="email"
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="devanw atau devanw@ugm.ac.id"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Password</label>
                  <input
                    name="password"
                    type="password"
                    className="w-full rounded-md border px-3 py-2"
                    placeholder="••••••••"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-md bg-blue-600 text-white py-3 font-semibold hover:bg-blue-700"
                >
                  LOGIN
                </button>
              </form>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400">Atau</span>
                </div>
              </div>

              {/* Tombol Login Google */}
              <button
                onClick={handleGoogleLogin}
                type="button"
                className="w-full flex items-center justify-center gap-3 rounded-md border border-gray-300 bg-white text-gray-700 py-3 font-semibold hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Login dengan Google
              </button>

              <div className="text-center mt-6">
                <p className="text-sm text-slate-600 mb-2">Belum punya akun?</p>
                <a
                  href="/register"
                  className="inline-block w-full rounded-md border px-4 py-2 text-center hover:bg-slate-50"
                >
                  Registrasi Akun Baru
                </a>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}