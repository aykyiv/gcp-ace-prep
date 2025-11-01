/**
 * Call-to-Action Section
 *
 * Bottom section encouraging user to start
 */

"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function CTASection() {
  const router = useRouter();

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold">
          Ready to Get Certified?
        </h2>
        <p className="text-xl md:text-2xl opacity-90">
          Start practicing today and pass your GCP ACE exam with confidence
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            onClick={() => router.push("/study")}
            size="lg"
            variant="outline"
            className="border-black bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-6 w-full sm:w-auto"
          >
            Start Learning Free
          </Button>
          <Button
            onClick={() => router.push("/progress")}
            size="lg"
            variant="outline"
            className="border-black text-blue-600 bg-white hover:bg-blue-600 hover:text-white text-lg px-8 py-6 w-full sm:w-auto"
          >
            View Your Progress
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="pt-8 text-sm opacity-75">
          <p>✓ 200+ practice questions</p>
          <p>✓ Spaced repetition learning</p>
          <p>✓ Realistic exam simulation</p>
          <p>✓ 100% free, no signup required</p>
        </div>
      </div>
    </section>
  );
}

// TODO: Add social proof section
// TODO: Add newsletter signup
