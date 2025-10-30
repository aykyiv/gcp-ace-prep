/**
 * Root Layout (Enhanced)
 *
 * Improved navigation with better styling
 */

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Providers } from "@/lib/provider/providers";
import { Github } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GCP ACE Quiz Cards - Master the Associate Cloud Engineer Exam",
  description:
    "Prepare for the Google Cloud Platform Associate Cloud Engineer certification with 200+ practice questions and spaced repetition learning.",
  keywords:
    "GCP, Google Cloud, ACE, Associate Cloud Engineer, certification, quiz, exam prep, spaced repetition",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        {/* Navigation header */}
        <Header />

        {/* Main content */}
        <Providers>{children}</Providers>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}

/**
 * Header Component with Navigation
 */
function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-3xl">☁️</span>
            <div className="flex flex-col">
              <span className="font-bold text-xl text-gray-900">
                GCP ACE Quiz
              </span>
              <span className="text-xs text-gray-500">Exam Prep</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink href="/study">Study</NavLink>
            <NavLink href="/exam-sim">Exam Sim</NavLink>
            <NavLink href="/progress">Progress</NavLink>

            {/* github repo link with icon */}
            <NavLink
              href="https://github.com/aykyiv/gcp-ace-prep"
              target="_blank"
            >
              <span className=" h-8 w-8 rounded-full border border-gray-500 hover:bg-gray-100   flex items-center justify-center gap-1 text-gray-600 hover:text-gray-900 font-medium transition-colors">
                <Github className="w-5 h-5" /> {/* GitHub Icon */}
              </span>
            </NavLink>
          </nav>

          {/* Mobile menu button */}
          <button className="md:hidden text-gray-600">☰</button>
        </div>
      </div>
    </header>
  );
}

/**
 * Navigation Link Component
 */
function NavLink({
  href,
  children,
  target = "_self",
}: {
  href: string;
  children: React.ReactNode;
  target?: string;
}) {
  // Note: usePathname only works in client components
  // For simplicity, keeping it basic here
  return (
    <Link
      href={href}
      className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
      target={target}
    >
      {children}
    </Link>
  );
}

/**
 * Footer Component
 */
function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-semibold mb-3">About</h3>
            <p className="text-sm leading-relaxed">
              Free quiz cards app for Google Cloud Associate Cloud Engineer exam
              preparation. Built with spaced repetition learning for maximum
              retention.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-3">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link
                href="/study"
                className="block hover:text-white transition-colors"
              >
                Start Studying
              </Link>
              <Link
                href="/exam-sim"
                className="block hover:text-white transition-colors"
              >
                Practice Exam
              </Link>
              <Link
                href="/progress"
                className="block hover:text-white transition-colors"
              >
                View Progress
              </Link>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-white font-semibold mb-3">Resources</h3>
            <div className="space-y-2 text-sm">
              <Link
                href="https://cloud.google.com/certification/cloud-engineer"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition-colors"
              >
                Official GCP ACE Page ↗
              </Link>
              <Link
                href="https://cloud.google.com/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="block hover:text-white transition-colors"
              >
                GCP Documentation ↗
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>
            © {new Date().getFullYear()} GCP ACE Quiz Cards. Built for exam
            preparation <br /> by{" "}
            <a
              href="https://linkedin.com/in/aykyiv"
              className="text-white underline"
              target="_blank"
            >
              Andrew Yurchenko
            </a>
            <span> </span>
            🇺🇦
          </p>
          <p className="mt-2 text-xs">
            Not affiliated with Google Cloud. All trademarks are property of
            their respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}

// TODO: Add mobile navigation menu
// TODO: Add active link highlighting
// TODO: Add dark mode toggle
