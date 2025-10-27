/**
 * How It Works Section
 *
 * Simple 3-step process explanation
 */

"use client";

export function HowItWorks() {
  const steps = [
    {
      number: "1",
      title: "Choose Your Domains",
      description:
        "Select from 9 GCP domains including Compute Engine, IAM, Networking, and more.",
      icon: "📋",
    },
    {
      number: "2",
      title: "Practice Questions",
      description:
        "Answer questions with immediate feedback and detailed explanations for every answer.",
      icon: "✍️",
    },
    {
      number: "3",
      title: "Track Progress",
      description:
        "Monitor your mastery, maintain study streaks, and take realistic practice exams.",
      icon: "📈",
    },
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600">
            Three simple steps to ace your exam
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              {/* Step number circle */}
              <div className="mb-6 relative">
                <div className="border-2 border-blue-950 w-20 h-20 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold">
                  {step.icon}
                </div>
                <div className="border-2 border-blue-950 text-2xl  absolute -top-2 left-8 w-10 h-10 mx-auto rounded-full ">
                  {step.number}
                </div>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// TODO: Add connecting lines between steps
// TODO: Add step animations on scroll
