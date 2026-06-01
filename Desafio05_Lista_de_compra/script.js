const form = document.querySelector(".add-item-form");
const input = document.querySelector(".add-item-form input");
const list = document.querySelector(".shopping-list");
const alert = document.querySelector(".alert");
const closeAlert = document.querySelector(".close-alert");

let items = JSON.parse(localStorage.getItem("shopping-list")) || [];

function saveItems() {
  localStorage.setItem("shopping-list", JSON.stringify(items));
}

let alertTimeout;

function showAlert() {
  alert.classList.remove("hidden");

  clearTimeout(alertTimeout);

  alertTimeout = setTimeout(() => {
    alert.classList.add("hidden");
  }, 3000);
}

closeAlert.addEventListener("click", () => {
  alert.classList.add("hidden");
});

function renderItems() {
  list.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");

    if (item.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <label>
        <input
          type="checkbox"
          ${item.completed ? "checked" : ""}
        >

        <span>${item.name}</span>
      </label>

      <button title="Remover item">
        <img src="assets/trash.svg" alt="Remover item">
      </button>
    `;

    const checkbox = li.querySelector("input");
    const deleteBtn = li.querySelector("button");

    checkbox.addEventListener("change", () => {
      item.completed = checkbox.checked;

      saveItems();
      renderItems();
    });

    deleteBtn.addEventListener("click", () => {
      removeItem(item.id);
    });

    list.appendChild(li);
  });
}

function addItem(name) {
  const newItem = {
    id: Date.now(),
    name,
    completed: false,
  };

  items.push(newItem);

  saveItems();
  renderItems();
}

function removeItem(id) {
  items = items.filter((item) => item.id !== id);

  saveItems();
  renderItems();

  showAlert();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const value = input.value.trim();

  if (!value) {
    input.focus();
    return;
  }

  addItem(value);

  input.value = "";
  input.focus();
});

renderItems();
