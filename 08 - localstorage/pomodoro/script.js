const modes = {
  pomodoro: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};
let currentMode = "pomodoro";
let timeLeft = modes[currentMode];
let timerInterval = null;

const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const modeBtns = document.querySelectorAll(".mode-select button");

function updateDisplay() {
  const mins = Math.floor(timeLeft / 60)
    .toString()
    .padStart(2, "0");
  const secs = (timeLeft % 60).toString().padStart(2, "0");
  minutesEl.textContent = mins;
  secondsEl.textContent = secs;
}

function switchMode(mode) {
  clearInterval(timerInterval);
  modeBtns.forEach((btn) =>
    btn.classList.toggle("active", btn.dataset.mode === mode)
  );
  currentMode = mode;
  timeLeft = modes[mode];
  updateDisplay();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
}

modeBtns.forEach((btn) => {
  btn.addEventListener("click", () => switchMode(btn.dataset.mode));
});

startBtn.addEventListener("click", () => {
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else {
      clearInterval(timerInterval);
      startBtn.disabled = false;
      pauseBtn.disabled = true;
      // Aquí podrías añadir sonido o notificación
    }
  }, 1000);
});

pauseBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  startBtn.disabled = false;
  pauseBtn.disabled = true;
});

resetBtn.addEventListener("click", () => {
  clearInterval(timerInterval);
  timeLeft = modes[currentMode];
  updateDisplay();
  startBtn.disabled = false;
  pauseBtn.disabled = true;
});

// Inicialización
updateDisplay();
