const sortPanel = document.getElementById("sortPanel");
const resultPanel = document.getElementById("resultPanel");
const drawBtn = document.getElementById("drawBtn");
const againBtn = document.getElementById("againBtn");
const amountInput = document.getElementById("amount");
const minInput = document.getElementById("min");
const maxInput = document.getElementById("max");
const noRepeatInput = document.getElementById("noRepeat");

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateNumbers(amount, min, max, noRepeat) {
  const numbers = [];

  if (noRepeat) {
    const intervalSize = max - min + 1;

    if (amount > intervalSize) {
      throw new Error(
        "A quantidade de números é maior que o intervalo disponível.",
      );
    }

    while (numbers.length < amount) {
      const number = randomNumber(min, max);

      if (!numbers.includes(number)) {
        numbers.push(number);
      }
    }
  } else {
    for (let i = 0; i < amount; i++) {
      numbers.push(randomNumber(min, max));
    }
  }

  return numbers;
}

async function showResults(numbers) {
  resultNumbers.innerHTML = "";

  for (const number of numbers) {
    const wrapper = document.createElement("div");

    wrapper.classList.add("number-animation");

    wrapper.innerHTML = `
      <div class="box"></div>
      <span class="number">${number}</span>
    `;

    resultNumbers.appendChild(wrapper);

    await sleep(1800);
  }
}

async function drawNumbers() {
  const amount = Number(amountInput.value);
  const min = Number(minInput.value);
  const max = Number(maxInput.value);
  const noRepeat = noRepeatInput.checked;

  if (amount <= 0) {
    alert("Informe uma quantidade válida.");
    return;
  }

  if (min >= max) {
    alert("O valor mínimo deve ser menor que o máximo.");
    return;
  }

  try {
    const numbers = generateNumbers(amount, min, max, noRepeat);

    sortPanel.classList.add("hidden");
    resultPanel.classList.remove("hidden");

    await showResults(numbers);
  } catch (error) {
    alert(error.message);
  }
}

function resetDraw() {
  resultPanel.classList.add("hidden");
  sortPanel.classList.remove("hidden");

  resultNumbers.innerHTML = "";
}

drawBtn.addEventListener("click", drawNumbers);

againBtn.addEventListener("click", resetDraw);
