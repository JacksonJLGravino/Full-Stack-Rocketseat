import { scheduleFetchByDay } from "../../services/schedule-fetch-by-day";
import { scheduleShow } from "./show.js";

const selectedDate = document.getElementById("date-picker");

export async function schedulesDay() {
  const date = selectedDate.value;

  const dailySchedules = await scheduleFetchByDay({ date });

  scheduleShow({ dailySchedules });
}
