import { schedulesDay } from "./schedules/load";

const selectedDate = document.getElementById("date-picker");

selectedDate.onchange = () => schedulesDay();
