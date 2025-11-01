import appEngineCloudRun from "./domains/app-engine-cloud-run.json";
import computeEngine from "./domains/compute-engine.json";
import iam from "./domains/iam.json";
import monitoringLogging from "./domains/monitoring-logging.json";
import networking from "./domains/networking.json";
import storage from "./domains/storage.json";
import gke from "./domains/gke.json";
import developerTools from "./domains/developer-tools.json";
import dataAnalytics from "./domains/data-analytics.json";

// Count of questions in each domain
export const appEngineCloudRunCount = appEngineCloudRun.length;
export const computeEngineCount = computeEngine.length;
export const iamCount = iam.length;
export const monitoringLoggingCount = monitoringLogging.length;
export const networkingCount = networking.length;
export const storageCount = storage.length;
export const gkeCount = gke.length;
export const developerToolsCount = developerTools.length;
export const dataAnalyticsCount = dataAnalytics.length;