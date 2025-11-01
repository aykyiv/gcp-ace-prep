/**
 * Features Section
 *
 * Grid of key app features with icons
 * Simple card layout
 */

"use client";

import { Card } from "@/components/ui/card";

export function FeaturesSection() {
  const features = [
    {
      icon: "🧠",
      title: "Spaced Repetition",
      description:
        "SuperMemo 2 algorithm optimizes review timing for maximum retention and efficient learning.",
    },
    {
      icon: "📚",
      title: "200+ Questions",
      description:
        "Comprehensive coverage of all 9 GCP domains with multiple choice and multiple select questions.",
    },
    {
      icon: "🎯",
      title: "Realistic Exam Sim",
      description:
        "50-question practice exams with 2-hour timer mimicking actual ACE exam conditions.",
    },
    {
      icon: "📊",
      title: "Progress Tracking",
      description:
        "Track mastery by domain, monitor study streaks, and identify weak areas that need practice.",
    },
    {
      icon: "💡",
      title: "Detailed Explanations",
      description:
        "Every question includes comprehensive explanations of correct answers and common mistakes.",
    },
    {
      icon: "⚙️",
      title: "Customizable Sessions",
      description:
        "Choose domains, difficulty levels, and study modes to focus on what you need most.",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Pass
          </h2>
          <p className="text-xl text-gray-600">
            Smart features designed for effective exam preparation
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// TODO: Add hover effects on cards
// TODO: Add feature comparison table
