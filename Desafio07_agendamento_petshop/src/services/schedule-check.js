import { apiConfig } from "./api.config.js";

export async function scheduleCheck(when) {
  const response = await fetch(
    `${apiConfig.baseURL}/schedules?when=${encodeURIComponent(when)}`,
  );

  const schedules = await response.json();

  return schedules.length > 0;
}
