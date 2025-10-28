import appEngineCloudRun from "@/data/domains/app-engine-cloud-run.json";
import computeEngine from "@/data/domains/compute-engine.json";
import iam from "@/data/domains/iam.json";
import monitoringLogging from "@/data/domains/monitoring-logging.json";
import networking from "@/data/domains/networking.json";
import storage from "@/data/domains/storage.json";
import gke from "@/data/domains/gke.json";
import developerTools from "@/data/domains/developer-tools.json";
import dataAnalytics from "@/data/domains/data-analytics.json";
//import domains
import { domainsCategories } from "@/data/domains";

export const domains = [
  appEngineCloudRun,
  computeEngine,
  iam,
  monitoringLogging,
  networking,
  storage,
  gke,
  developerTools,
  dataAnalytics,
];

export const totalQuestions = domains.reduce((total, domain: any) => {
  let count = 0;

  // CASE 1: The JSON file is an ARRAY of questions (most likely)
  if (Array.isArray(domain)) {
    count = domain.length;
  }
  // CASE 2: The JSON file is an OBJECT and the questions array is a property (e.g., "questions" or "default")
  else if (domain && Array.isArray(domain.questions)) {
    count = domain.questions.length;
  }
  // Fallback for Next.js/Webpack default imports if the structure is more complex
  else if (domain && Array.isArray(domain.default)) {
    count = domain.default.length;
  }

  return total + count;
}, 0);

// Total questions in domains.json for domainsCategory object
export const totalCategoriesInDomainsJson = domainsCategories.length;
