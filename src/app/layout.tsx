import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Resume Tailor - Professional Resume Optimization",
  description: "Optimize your resume for any job with AI-powered tailoring and ATS optimization",
  keywords: "resume, AI, tailoring, ATS, job, optimization, cover letter",
};

export async function generateViewport() {
  return {
    themeColor: "#3b82f6",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col dark:bg-gray-900 bg-white transition-colors duration-300">{children}</body>
    </html>
  );
}
