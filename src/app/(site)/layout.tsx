import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import { AnnouncementBar } from "@/components/Layout/AnnouncementBar";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
    <AnnouncementBar/>
      <Header />

      <main>{children}</main>

      <Footer />
    </>
  );
}