import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";

const sarabun = Sarabun({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "ระบบจัดการข้อมูลบัญชีบริษัท",
  description: "ระบบจัดการข้อมูลบัญชีบริษัท",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={sarabun.className + 'bg-[#4e54c8] h-full w-full area'}>
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
        <main className="bg-slate-900 rounded-2xl drop-shadow-xl p-[2rem] mx-[6rem] my-[3rem]">
          {children}
        </main>
      </body>
    </html>
  );
}
