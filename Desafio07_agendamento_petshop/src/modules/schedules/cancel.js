import { scheduleCancel } from "../../services/schedule-cancel.js";
import { schedulesDay } from "./load.js";
const periods = document.querySelectorAll(".period");

periods.forEach((period) => {
  period.addEventListener("click", async (event) => {
    if (event.target.tagName === "BUTTON") {
      const item = event.target.closest("li");
      const { id } = item.dataset;

      if (id) {
        const isConfirm = confirm(
          "Tem certeza que deseja cancelar esse agendamento?",
        );

        if (isConfirm) {
          await scheduleCancel({ id });
          schedulesDay();
        }
      }
    }
  });
});
