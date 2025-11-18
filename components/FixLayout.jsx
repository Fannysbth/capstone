// components/FixLayout.jsx
import Header from "./Header";
import { Footer } from "./Footer";

export default function FixLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-[#FCFCFC]">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
