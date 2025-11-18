import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-16 text-white text-sm">
      {/* BAGIAN ATAS (BIRU TUA) */}
      <div className="bg-[#0A3E66]">
        <div className="max-w-7xl mx-auto px-6 py-10 grid gap-10 md:grid-cols-4">
          {/* KOLOM 1 – LOGO + ALAMAT */}
          <div className="space-y-3">
            <img
              src="/assets/images/ugm-logo.png"
              alt="Logo DTETI"
              className="h-16 w-auto"
            />
            <p className="leading-relaxed">
              Departemen Teknik Elektro dan Teknologi Informasi
              <br />
              Fakultas Teknik Universitas Gadjah Mada
              <br />
              Jl. Grafika No. 2 Kampus UGM Yogyakarta, 55281
            </p>
            <div className="space-y-1 text-sm">
              <p>✉ teti@ugm.ac.id</p>
              <p>☎ +62 (274) 552305</p>
            </div>
          </div>

          {/* KOLOM 2 – NAVIGASI (SESUI AI MENU ATAS) */}
          <div>
            <h4 className="font-semibold tracking-wide mb-3 text-xs md:text-sm">
              NAVIGASI
            </h4>
            <ul className="space-y-1">
              <li>
                <Link href="/" className="hover:underline">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/profil" className="hover:underline">
                  Profil
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:underline">
                  Katalog
                </Link>
              </li>
              <li>
                <Link href="/history-request" className="hover:underline">
                  Riwayat
                </Link>
              </li>
            </ul>
          </div>

          {/* KOLOM 3 – KONTAK (VERSI RINGKAS DARI YANG UDAH ADA) */}
          <div>
            <h4 className="font-semibold tracking-wide mb-3 text-xs md:text-sm">
              KONTAK
            </h4>
            <p className="leading-relaxed">
              Telp: (0274) 588688
              <br />
              Email: info@ugm.ac.id
            </p>
          </div>

          {/* KOLOM 4 – MEDIA SOSIAL (BIAR MIRIP SS, BOLEH KAMU GANTI LINK) */}
          <div>
            <h4 className="font-semibold tracking-wide mb-3 text-xs md:text-sm">
              MEDIA SOSIAL
            </h4>
            <ul className="space-y-1">
              <li>
                <Link href="#" className="hover:underline">
                  Youtube
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Instagram
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:underline">
                  Facebook
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* BAR BAWAH (BIRU LEBIH GELAP) */}
      <div className="bg-[#062741]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-col md:flex-row items-center justify-between text-xs tracking-wide">
          <p>© {year} UNIVERSITAS GADJAH MADA</p>

          {/* Kalau mau persis SS bisa tambahin link di kanan */}
          <div className="flex gap-6 mt-1 md:mt-0">
            <Link href="#" className="hover:underline">
              KEBIJAKAN PRIVASI / PRIVACY POLICY
            </Link>
            <div className="flex gap-3">
              <Link href="#" className="hover:underline">
                KMTETI
              </Link>
              <span>|</span>
              <Link href="#" className="hover:underline">
                KATETIGAMA
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
