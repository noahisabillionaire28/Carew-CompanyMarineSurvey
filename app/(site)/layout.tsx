import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/** Public site chrome. Admin pages under /admin use their own layout. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
