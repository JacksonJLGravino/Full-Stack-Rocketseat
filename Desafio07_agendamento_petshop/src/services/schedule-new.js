import { apiConfig } from "./api.config.js";
import { scheduleCheck } from "./schedule-check.js";
import { scheduleValidate } from "./schedule-validade.js";

export async function scheduleNew({
  id,
  nameTutor,
  namePet,
  clientPhone,
  serviceDescription,
  when,
}) {
  try {
    const validDate = await scheduleValidate(when);

    if (!validDate) {
      console.log(validDate);
      alert("Não é possível agendar um horário no passado.");
      return;
    }

    const occupied = await scheduleCheck(when);

    if (occupied) {
      alert("Esse horário já está ocupado.");
      return;
    }

    await fetch(`${apiConfig.baseURL}/schedules`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id,
        nameTutor,
        namePet,
        clientPhone,
        serviceDescription,
        when,
      }),
    });

    alert("Agendamento realizado com sucesso!");
  } catch (error) {
    console.log(error);
    alert("Não foi possivel agendar. Tente novamente mais tarde.");
  }
}
