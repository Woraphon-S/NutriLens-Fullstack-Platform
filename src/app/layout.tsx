import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "NutriLens AI — วิเคราะห์อาหารด้วย AI",
  description: "แพลตฟอร์มวิเคราะห์โภชนาการอัจฉริยะ ถ่ายรูปอาหาร รู้ผลทันที ด้วยเทคโนโลยี Gemini AI",
  keywords: ["โภชนาการ", "วิเคราะห์อาหาร", "AI", "แคลอรี่", "สุขภาพ", "NutriLens"],
  openGraph: {
    title: "NutriLens AI — วิเคราะห์อาหารด้วย AI",
    description: "ถ่ายรูปอาหาร รู้ผลทันที พร้อมระบบ Gamification",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <Toaster position="top-center" richColors />
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}



function Footer() {
  return (
    <footer className="border-t border-health-border bg-health-card mt-20 pt-12">
      <div className="container-app py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🍃</span>
              <span className="text-lg font-bold text-health-green-dark">
                NutriLens AI
              </span>
            </div>
            <p className="text-sm text-health-muted leading-relaxed">
              แพลตฟอร์มวิเคราะห์โภชนาการอัจฉริยะ
              <br />
              ถ่ายรูปอาหาร รู้ทุกสารอาหารทันที
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-health-text mb-3">ลิงก์ด่วน</h4>
            <div className="flex flex-col gap-2">
              <a href="/analyze" className="text-sm text-health-muted hover:text-health-green transition-colors no-underline">
                วิเคราะห์อาหาร
              </a>
              <a href="/dashboard" className="text-sm text-health-muted hover:text-health-green transition-colors no-underline">
                แดชบอร์ด
              </a>
              <a href="/history" className="text-sm text-health-muted hover:text-health-green transition-colors no-underline">
                ประวัติการวิเคราะห์
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-health-border text-center">
          <p className="text-xs text-health-muted">
            © {new Date().getFullYear()} NutriLens AI — สร้างด้วย ❤️ เพื่อคนรักสุขภาพ
          </p>
        </div>
      </div>
    </footer>
  );
}
