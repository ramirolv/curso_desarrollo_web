const loginEl = document.getElementById("login");
const appEl = document.getElementById("app");
const usernameInput = document.getElementById("usernameInput");
const saveUserBtn = document.getElementById("saveUserBtn");
const welcomeEl = document.getElementById("welcome");
const boardsEl = document.getElementById("boards");
const addBoardBtn = document.getElementById("addBoardBtn");

let state = { user: "", boards: [] };
let draggedTask = null;

function saveState() {
  localStorage.setItem("todoState", JSON.stringify(state));
}
function loadState() {
  const saved = localStorage.getItem("todoState");
  if (saved) state = JSON.parse(saved);
}
function getDragAfterElement(container, y) {
  const elements = [...container.querySelectorAll(".task:not(.dragging)")];
  return elements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset)
        return { offset, element: child };
      return closest;
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function render() {
  if (state.user) {
    loginEl.classList.add("hidden");
    appEl.classList.remove("hidden");
    welcomeEl.textContent = `¡Bienvenido, ${state.user}!`;
  }
  boardsEl.innerHTML = "";
  state.boards.forEach((board) => {
    const boardEl = document.createElement("div");
    boardEl.className = "board";
    boardEl.style.background = board.color || "var(--purple-glass)";
    boardEl.dataset.id = board.id;

    const headerEl = document.createElement("div");
    headerEl.className = "board-header";
    const titleEl = document.createElement("h3");
    titleEl.textContent = board.title;
    const delBtn = document.createElement("button");
    delBtn.textContent = "×";
    delBtn.onclick = () => {
      state.boards = state.boards.filter((b) => b.id !== board.id);
      saveState();
      render();
    };
    headerEl.append(titleEl, delBtn);

    const tasksEl = document.createElement("div");
    tasksEl.className = "tasks";
    tasksEl.addEventListener("dragover", (e) => {
      e.preventDefault();
      tasksEl.classList.add("dragover");
    });
    tasksEl.addEventListener("dragleave", () =>
      tasksEl.classList.remove("dragover")
    );
    tasksEl.addEventListener("drop", (e) => {
      e.preventDefault();
      tasksEl.classList.remove("dragover");
      if (!draggedTask) return;
      const from = state.boards.find((b) => b.id === draggedTask.boardId);
      const idx = from.tasks.findIndex((t) => t.id === draggedTask.taskId);
      const [task] = from.tasks.splice(idx, 1);
      const afterEl = getDragAfterElement(tasksEl, e.clientY);
      if (!afterEl) board.tasks.push(task);
      else {
        const afterId = parseInt(afterEl.dataset.id);
        const insertIdx = board.tasks.findIndex((t) => t.id === afterId);
        board.tasks.splice(insertIdx, 0, task);
      }
      draggedTask = null;
      saveState();
      render();
    });

    board.tasks.forEach((task) => {
      const taskEl = document.createElement("div");
      taskEl.className = "task";
      taskEl.dataset.id = task.id;
      taskEl.draggable = true;
      if (task.completed) taskEl.classList.add("completed");
      taskEl.addEventListener("dragstart", () => {
        draggedTask = { boardId: board.id, taskId: task.id };
        setTimeout(() => taskEl.classList.add("dragging"), 0);
      });
      taskEl.addEventListener("dragend", () =>
        taskEl.classList.remove("dragging")
      );
      const chk = document.createElement("input");
      chk.type = "checkbox";
      chk.checked = task.completed;
      chk.onchange = () => {
        task.completed = chk.checked;
        saveState();
        render();
      };
      const info = document.createElement("div");
      info.className = "info";
      const txt = document.createElement("span");
      txt.textContent = task.text;
      const due = document.createElement("span");
      due.className = "due";
      due.textContent = task.due || "";
      info.append(txt, due);
      taskEl.append(chk, info);
      taskEl.ondblclick = () => {
        const newText = prompt("Editar tarea", task.text);
        const newDue = prompt(
          "Fecha de vencimiento (YYYY-MM-DD)",
          task.due || ""
        );
        if (newText) task.text = newText;
        task.due = newDue;
        saveState();
        render();
      };
      tasksEl.append(taskEl);
    });

    const addEl = document.createElement("div");
    addEl.className = "add-task";
    const inpText = document.createElement("input");
    inpText.type = "text";
    inpText.placeholder = "Nueva tarea";
    const inpDate = document.createElement("input");
    inpDate.type = "date";
    const btnAdd = document.createElement("button");
    btnAdd.textContent = "+";
    btnAdd.onclick = () => {
      if (!inpText.value.trim()) return;
      board.tasks.push({
        id: Date.now(),
        text: inpText.value.trim(),
        completed: false,
        due: inpDate.value,
      });
      inpText.value = "";
      inpDate.value = "";
      saveState();
      render();
    };
    addEl.append(inpText, inpDate, btnAdd);

    boardEl.append(headerEl, tasksEl, addEl);
    boardsEl.append(boardEl);
  });
}

saveUserBtn.onclick = () => {
  const name = usernameInput.value.trim();
  if (!name) return;
  state.user = name;
  saveState();
  render();
};
addBoardBtn.onclick = () => {
  const title = prompt("Nombre de la lista:");
  if (!title) return;
  const color = prompt("Color hexadecimal para la lista:", "#8a2be2");
  state.boards.push({ id: Date.now(), title, color, tasks: [] });
  saveState();
  render();
};

loadState();
render();