/**
 * Hero Section
 *
 * Simple hero with heading, description, and CTA button
 * Clean design, no fancy animations
 */

"use client";

import { Button } from "@/components/ui/button";
import { totalCategoriesInDomainsJson, totalQuestions } from "@/data";
import { useRouter } from "next/navigation";

export function HeroSection() {
  const router = useRouter();

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Icon/Logo */}
        <div className="text-7xl">☁️</div>

        {/* Heading */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
            Master the GCP ACE Exam
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
            200+ practice questions with spaced repetition learning
          </p>
        </div>

        {/* Description */}
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Prepare for the Google Cloud Associate Cloud Engineer certification
          with intelligent quiz cards that adapt to your learning progress.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            onClick={() => router.push("/study")}
            size="lg"
            className="text-lg px-8 py-6 w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
          >
            Start Learning Now
          </Button>
          <Button
            onClick={() => router.push("/exam-sim")}
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 w-full sm:w-auto"
          >
            Take Practice Exam
          </Button>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto pt-8">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{totalQuestions}</p>
            <p className="text-sm text-gray-600 mt-1">Questions</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">{totalCategoriesInDomainsJson}</p>
            <p className="text-sm text-gray-600 mt-1">Domains</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">Free</p>
            <p className="text-sm text-gray-600 mt-1">Forever</p>
          </div>
        </div>
      </div>
    </section>
  );
}

// TODO: Add animated counter for stats
// TODO: Add testimonial carousel
