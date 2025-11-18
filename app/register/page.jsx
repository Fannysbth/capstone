'use client';

import { useRouter } from 'next/navigation';

export default function RegisterPage() {
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

  function validate(values) {
    const errors = {};
    if (!values.username || values.username.length < 3)
      errors.username = 'Username harus minimal 3 karakter';
    if (!values.email || !/^\S+@\S+\.\S+$/.test(values.email))
      errors.email = 'Format email tidak valid';
    if (!values.phone)
      errors.phone = 'Nomor HP diperlukan';
    if (!values.password || values.password.length < 6)
      errors.password = 'Password harus minimal 6 karakter';
    return errors;
  }

  async function onSubmit(e) {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);

  const values = {
    username: fd.get('username')?.trim(),
    email: fd.get('email')?.trim(),
    phone: fd.get('phone')?.trim(),
    password: fd.get('password'),
  };

  document.querySelectorAll('.field-error').forEach(n => (n.textContent = ''));

  const errors = validate(values);
  if (Object.keys(errors).length) {
    Object.entries(errors).forEach(([k, v]) => {
      const node = document.getElementById(`err-${k}`);
      if (node) node.textContent = v;
    });
    showToast('Perbaiki field yang error', 'destructive');
    return;
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const resp = await fetch(`${apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      credentials: 'include',
      body: JSON.stringify(values),
    });

    const data = await resp.json();

    if (!resp.ok) {
      throw new Error(data.message || 'Registrasi gagal');
    }

    if (data.success) {
      showToast(data.message || 'Registrasi berhasil!');
      
      // Simpan status login
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(data.user));
      
      // Redirect berdasarkan status profil
      setTimeout(() => {
        if (data.user.isIncomplete) {
          router.push("/login");
        } else {
          router.push("/");
        }
      }, 1500);
    } else {
      throw new Error(data.message || 'Registrasi gagal');
    }
  } catch (err) {
    showToast(err.message || 'Terjadi error saat registrasi', 'destructive');
  }
}

  return (
    <div className="min-h-screen relative flex">

      {/* GLOBAL BACKGROUND */}
      <img
        src="https://simaster.ugm.ac.id/ugmfw-assets-metronics8/media/ugm/bg-1200.jpg"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Background"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative flex w-full">

        {/* LEFT HERO – SAME AS LOGIN */}
        <aside className="hidden lg:flex w-1/2 relative items-center justify-center text-white">
          <div className="relative z-10 max-w-lg text-center px-8">
            <div className="flex items-center justify-center gap-4 mb-6">
              <img
                src="https://simaster.ugm.ac.id/ugmfw-assets/images/maskot-simaster.png"
                alt="Maskot Simaster"
                className="w-16 h-16"
              />
              <img
                src="https://simaster.ugm.ac.id/ugmfw-assets/images/logo-ugm.png"
                alt="Logo UGM"
                className="w-14 h-14"
              />
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight mb-4">
              CAPSTONE <span className="text-yellow-400">CONNECTOR</span>
            </h1>

            <p className="text-lg text-slate-100 mb-8">
              Portal Informasi Capstone Berkelanjutan mendukung kesinambungan
              proyek capstone di lingkungan perguruan tinggi DTETI UGM.
            </p>

            <div className="mb-8 flex items-center justify-center gap-4">
              <a href="#">
                <img 
                  src="https://simaster.ugm.ac.id/ugmfw-assets/images/simaster/playstore.png" 
                  alt="Google Play" 
                  className="h-10"
                />
              </a>
              <a href="#">
                <img 
                  src="https://simaster.ugm.ac.id/ugmfw-assets/images/simaster/appstore.png" 
                  alt="App Store" 
                  className="h-10"
                />
              </a>
            </div>

            <p className="text-sm text-slate-200 mb-6">Made by Kelompok 1 PAW</p>

            <div className="flex gap-6 justify-center text-sm">
              <a href="#" className="hover:underline">Terms & Conditions</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
            </div>
          </div>
        </aside>

        {/* RIGHT FORM */}
        <main className="flex-1 relative flex items-center justify-center p-6">
          <div
            className="relative z-20 w-full max-w-[600px] bg-white rounded-2xl shadow-2xl p-8 pb-36"
            style={{
              backgroundImage:
                "url('https://simaster.ugm.ac.id/ugmfw-assets-metronics8/media/ugm/artwork-ugm-revisi-600.png')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'bottom center',
              backgroundSize: 'contain',
            }}
          >
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold">REGISTER</h2>
              <p className="text-sm text-slate-500 mt-2">Buat akun Capstone Anda</p>
            </div>

            {/* FORM CARD */}
            <div className="bg-white rounded-lg p-6 shadow-md -mt-6">
              <form onSubmit={onSubmit} className="space-y-4" noValidate>

                <div>
                  <label className="text-sm font-medium">Username *</label>
                  <input 
                    name="username" 
                    className="w-full border rounded-md px-3 py-2" 
                    placeholder="Masukkan username (minimal 3 karakter)"
                  />
                  <p id="err-username" className="text-xs text-red-600 field-error"></p>
                </div>

                <div>
                  <label className="text-sm font-medium">Email *</label>
                  <input 
                    name="email" 
                    type="email" 
                    className="w-full border rounded-md px-3 py-2" 
                    placeholder="contoh: nama@ugm.ac.id"
                  />
                  <p id="err-email" className="text-xs text-red-600 field-error"></p>
                </div>

                <div>
                  <label className="text-sm font-medium">Nomor HP *</label>
                  <input 
                    name="phone" 
                    type="tel" 
                    className="w-full border rounded-md px-3 py-2" 
                    placeholder="Contoh: 081234567890"
                  />
                  <p id="err-phone" className="text-xs text-red-600 field-error"></p>
                </div>

                <div>
                  <label className="text-sm font-medium">Password *</label>
                  <input 
                    name="password" 
                    type="password" 
                    className="w-full border rounded-md px-3 py-2" 
                    placeholder="Minimal 6 karakter"
                  />
                  <p id="err-password" className="text-xs text-red-600 field-error"></p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white rounded-md py-3 font-semibold hover:bg-blue-700 transition-colors"
                >
                  DAFTAR
                </button>
              </form>

              <p className="mt-4 text-center text-sm text-slate-600">
                Sudah punya akun?{' '}
                <a href="/login" className="font-semibold text-blue-600 hover:underline">
                  Login di sini
                </a>
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}