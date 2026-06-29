import dayjs from "dayjs";

export async function scheduleValidate(when) {
  const appointment = dayjs(when);
  const now = dayjs();

  return appointment.isAfter(now);
}
