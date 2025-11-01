/**
 * Submit Answer Button
 *
 * Large, prominent button to submit the selected answer
 */

"use client";

import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  onClick: () => void;
  disabled: boolean;
  hasSubmitted: boolean;
}

export function SubmitButton({
  onClick,
  disabled,
  hasSubmitted,
}: SubmitButtonProps) {
  if (hasSubmitted) return null;

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      size="lg"
      className="w-full md:w-auto px-8 py-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
    >
      {disabled ? "Select an answer first" : "Check Answer"}
    </Button>
  );
}

// TODO: Add loading state while validating
// TODO: Add confirmation for multiple select if not all answers selected
