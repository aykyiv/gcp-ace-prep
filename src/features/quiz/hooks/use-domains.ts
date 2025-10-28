/**
 * React Hook for loading domain metadata
 *
 * Provides domain information for UI display and filtering
 */

"use client";

import { useQuery } from "@tanstack/react-query";
import type { Domain } from "../types/question.types";
import { domainsCategories } from "@/data/domains";

/**
 * Domain metadata interface (matches domains.json structure)
 */
export interface DomainMetadata {
  id: Domain;
  name: string;
  shortName: string;
  description: string;
  color: string;
  bgColor: string;
  icon: string;
  examPercentage: number;
  totalQuestions: number;
  estimatedStudyHours: number;
  keyTopics: string[];
  enabled: boolean;
}

/**
 * Loads domain metadata from JSON file
 */
function loadDomains(): DomainMetadata[] {
  try {
    const domainsData = domainsCategories as DomainMetadata[];
    return domainsData;
  } catch (error) {
    console.error("Failed to load domains metadata:", error);
    return [];
  }
}

/**
 * Hook to load all domain metadata
 *
 * @returns React Query result with domains array
 */
export function useDomains() {
  return useQuery({
    queryKey: ["domains"],
    queryFn: loadDomains,
    staleTime: Infinity, // Domains metadata never changes
  });
}

/**
 * Hook to get a single domain's metadata
 *
 * @param domainId - Domain ID to fetch
 * @returns React Query result with single domain
 */
export function useDomain(domainId: Domain) {
  const { data: domains, ...rest } = useDomains();

  const domain = domains?.find((d) => d.id === domainId);

  return {
    data: domain,
    ...rest,
  };
}

/**
 * Hook to get enabled domains only
 *
 * @returns React Query result with enabled domains
 */
export function useEnabledDomains() {
  const { data: domains, ...rest } = useDomains();

  const enabledDomains = domains?.filter((d) => d.enabled) || [];

  return {
    data: enabledDomains,
    ...rest,
  };
}

// TODO: Add hook to calculate total estimated study hours
// TODO: Add hook to get domains sorted by exam percentage
// TODO: Add hook to toggle domain enabled/disabled (for user preferences)
