/**
 * SEO Metadata Helper
 *
 * Generate metadata for different pages
 */

import type { Metadata } from "next";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export function generateMetadata(params: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const { title, description, path = "" } = params;
  const fullTitle = `${title} | GCP ACE Quiz Cards`;
  const url = `${baseUrl}${path}`;

  return {
    title: fullTitle,
    description,
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "GCP ACE Quiz Cards",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

// Page-specific metadata generators
export const pageMetadata = {
  home: generateMetadata({
    title: "Home",
    description:
      "Master the Google Cloud Associate Cloud Engineer exam with 200+ practice questions and spaced repetition learning.",
    path: "/",
  }),

  study: generateMetadata({
    title: "Study",
    description:
      "Configure your study session and practice GCP ACE exam questions with intelligent spaced repetition.",
    path: "/study",
  }),

  quiz: generateMetadata({
    title: "Quiz",
    description:
      "Practice GCP ACE exam questions with immediate feedback and detailed explanations.",
    path: "/quiz",
  }),

  examSim: generateMetadata({
    title: "Exam Simulation",
    description:
      "Take a realistic 50-question practice exam with 2-hour timer mimicking actual GCP ACE exam conditions.",
    path: "/exam-sim",
  }),

  progress: generateMetadata({
    title: "Progress",
    description:
      "Track your study progress, domain mastery, and exam readiness for the GCP ACE certification.",
    path: "/progress",
  }),
};

// TODO: Add structured data (JSON-LD)
// TODO: Add dynamic OG images
