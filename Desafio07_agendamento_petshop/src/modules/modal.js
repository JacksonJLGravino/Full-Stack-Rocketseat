const btnClose = document.querySelector(".close");
const btnOpen = document.querySelector(".new-appointment");
const modal = document.querySelector(".modal");

btnClose.addEventListener("click", () => {
  modal.classList.add("active");
});

btnOpen.addEventListener("click", () => {
  modal.classList.remove("active");
});
