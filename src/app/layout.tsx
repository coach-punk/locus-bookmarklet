import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Locus Movies",
  description: "A self-hosted movie & TV season rating log, backed by TMDB.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="flex-1">{children}</div>
        <footer className="border-t border-neutral-200 py-4 text-center text-xs text-neutral-500 dark:border-neutral-800">
          <a
            href="https://github.com/coach-punk/locus-movies"
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            Locus Movies on GitHub
          </a>
        </footer>
      </body>
    </html>
  );
}
