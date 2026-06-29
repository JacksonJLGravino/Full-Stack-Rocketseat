import dayjs from "dayjs";

const periodMorning = document.getElementById("period-morning");
const periodAfternoon = document.getElementById("period-afternoon");
const periodNigth = document.getElementById("period-nigth");

export function scheduleShow({ dailySchedules }) {
  try {
    periodMorning.innerHTML = "";
    periodAfternoon.innerHTML = "";
    periodNigth.innerHTML = "";

    dailySchedules.forEach((schedule) => {
      const item = document.createElement("li");
      const time = document.createElement("span");
      const petContent = document.createElement("div");
      const petName = document.createElement("strong");
      const petOwner = document.createElement("span");
      const toDo = document.createElement("span");
      const btn = document.createElement("button");

      item.setAttribute("data-id", schedule.id);
      time.textContent = dayjs(schedule.when).format("HH:mm");
      petName.textContent = schedule.namePet;
      petOwner.textContent = " / " + schedule.nameTutor;
      toDo.textContent = schedule.serviceDescription;
      btn.textContent = "Remover agendamento";

      time.classList.add("hour");
      petContent.classList.add("pet");
      toDo.classList.add("to-do");

      petContent.append(petName, petOwner);
      item.append(time, petContent, toDo, btn);

      const hour = dayjs(schedule.when).hour();

      if (hour <= 12) {
        periodMorning.appendChild(item);
      } else if (hour > 12 && hour <= 18) {
        periodAfternoon.appendChild(item);
      } else {
        periodNigth.append(item);
      }
    });
  } catch (error) {
    alert("Não foi possível exibir os agendamentos");
    console.log(error);
  }
}

/*
<li>
                <span class="hour">09:00</span>

                <div class="pet">
                  <strong>Thor</strong>
                  <span>/ Fernanda Costa</span>
                </div>

                <span class="to-do">Vacinação</span>

                <button>Remover agendamento</button>
              </li>

*/
