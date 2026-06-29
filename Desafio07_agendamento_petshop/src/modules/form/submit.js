import dayjs from "dayjs";
import { scheduleNew } from "../../services/schedule-new.js";
import { schedulesDay } from "../schedules/load.js";

const form = document.querySelector("form");
const tutor = document.getElementById("tutor");
const pet = document.getElementById("pet");
const phone = document.getElementById("phone");
const dateSubmit = document.getElementById("date");
const description = document.getElementById("description");
const hour = document.getElementById("hour");
const modal = document.querySelector(".modal");

const datePicker = document.getElementById("date-picker");

const date = dayjs(new Date()).format("YYYY-MM-DD");

datePicker.value = date;

dateSubmit.value = date;
dateSubmit.min = date;

hour.value = dayjs(new Date()).format("HH:mm");
// hour.min = dayjs(new Date()).format("HH:mm");

form.onsubmit = async (event) => {
  event.preventDefault();

  try {
    const nameTutor = tutor.value.trim();
    const namePet = pet.value.trim();
    const clientPhone = phone.value;
    const serviceDescription = description.value.trim();
    const selectedDate = dateSubmit.value;
    const selectedHour = hour.value;

    const when = dayjs(`${selectedDate}T${selectedHour}`).format();

    if (
      !nameTutor ||
      !namePet ||
      !clientPhone ||
      !serviceDescription ||
      !selectedDate ||
      !selectedHour
    ) {
      return alert("Preencha todos os campos corretamente para o agendamento");
    }

    const id = new Date().getTime();

    await scheduleNew({
      id,
      nameTutor,
      namePet,
      clientPhone,
      serviceDescription,
      when,
    });

    await schedulesDay();

    tutor.value = "";
    pet.value = "";
    phone.value = "";
    description.value = "";

    modal.classList.add("active");
  } catch (error) {
    alert("Não foi possível realizar o agendamento");
    console.log("error");
  }
};
