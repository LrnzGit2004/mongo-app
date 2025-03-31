// Configuration de l'API
const API_URL = "http://localhost:5000/api/todos";

// Éléments du DOM
const todoTitleInput = document.getElementById("todo-title");
const addTodoBtn = document.getElementById("add-todo-btn");
const updateTodoBtn = document.getElementById("update-todo-btn");
const cancelEditBtn = document.getElementById("cancel-edit-btn");
const todoList = document.getElementById("todo-list");
const loadingElement = document.getElementById("loading");
const errorMessage = document.getElementById("error-message");
const editTodoIdInput = document.getElementById("edit-todo-id");

// Charger les todos au chargement de la page
document.addEventListener("DOMContentLoaded", fetchTodos);

// Ajouter un événement au bouton d'ajout
addTodoBtn.addEventListener("click", addTodo);

// Ajouter un événement au bouton de mise à jour
updateTodoBtn.addEventListener("click", updateTodo);

// Ajouter un événement au bouton d'annulation
cancelEditBtn.addEventListener("click", cancelEdit);

// Fonction pour récupérer les todos depuis l'API
async function fetchTodos() {
  try {
    showLoading();
    hideError();

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Erreur lors de la récupération des tâches");
    }

    const todos = await response.json();
    renderTodos(todos);
    hideLoading();
  } catch (error) {
    hideLoading();
    showError(error.message);
    console.error("Erreur:", error);
  }
}

// Fonction pour ajouter un nouveau todo
async function addTodo() {
  const title = todoTitleInput.value.trim();

  if (!title) {
    showError("Le titre est obligatoire");
    return;
  }

  try {
    hideError();

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'ajout de la tâche");
    }

    todoTitleInput.value = "";

    fetchTodos();
  } catch (error) {
    showError(error.message);
    console.error("Erreur:", error);
  }
}

// Fonction pour mettre à jour un todo
async function updateTodo() {
  const todoId = editTodoIdInput.value;
  const title = todoTitleInput.value.trim();

  if (!title) {
    showError("Le titre est obligatoire");
    return;
  }

  try {
    hideError();

    const response = await fetch(`${API_URL}/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la mise à jour de la tâche");
    }

    cancelEdit();
    fetchTodos();
  } catch (error) {
    showError(error.message);
    console.error("Erreur:", error);
  }
}

// Fonction pour supprimer un todo
async function deleteTodo(todoId) {
  try {
    hideError();

    const response = await fetch(`${API_URL}/${todoId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Erreur lors de la suppression de la tâche");
    }

    fetchTodos();
  } catch (error) {
    showError(error.message);
    console.error("Erreur:", error);
  }
}

// Fonction pour basculer l'état d'un todo
async function toggleTodoStatus(todoId, currentStatus) {
  try {
    hideError();

    const response = await fetch(`${API_URL}/${todoId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !currentStatus }),
    });

    if (!response.ok) {
      throw new Error("Erreur lors du changement de statut de la tâche");
    }

    fetchTodos();
  } catch (error) {
    showError(error.message);
    console.error("Erreur:", error);
  }
}

// Fonction pour éditer un todo
function editTodo(todo) {
  editTodoIdInput.value = todo._id;
  todoTitleInput.value = todo.title;

  addTodoBtn.classList.add("hidden");
  updateTodoBtn.classList.remove("hidden");
  cancelEditBtn.classList.remove("hidden");
}

// Fonction pour annuler l'édition
function cancelEdit() {
  editTodoIdInput.value = "";
  todoTitleInput.value = "";

  updateTodoBtn.classList.add("hidden");
  cancelEditBtn.classList.add("hidden");
  addTodoBtn.classList.remove("hidden");
}

// Fonction pour afficher les todos dans la liste
function renderTodos(todos) {
  todoList.innerHTML = "";

  if (todos.length === 0) {
    todoList.innerHTML =
      '<p class="loading">Aucune tâche pour le moment. Ajoutez-en une !</p>';
    todoList.classList.remove("hidden");
    return;
  }

  todos.forEach((todo) => {
    const todoItem = document.createElement("div");
    todoItem.className = `todo-item ${todo.completed ? "completed" : ""}`;

    const todoContent = document.createElement("div");
    todoContent.className = "todo-content";

    const todoTitle = document.createElement("div");
    todoTitle.className = "todo-title";
    todoTitle.textContent = todo.title;

    todoContent.appendChild(todoTitle);

    const todoActions = document.createElement("div");
    todoActions.className = "todo-actions";

    const toggleBtn = document.createElement("button");
    toggleBtn.className = "btn-toggle";
    toggleBtn.textContent = todo.completed ? "Rétablir" : "Terminer";
    toggleBtn.addEventListener("click", () =>
      toggleTodoStatus(todo._id, todo.completed)
    );

    const editBtn = document.createElement("button");
    editBtn.className = "btn-edit";
    editBtn.textContent = "Modifier";
    editBtn.addEventListener("click", () => editTodo(todo));

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "Supprimer";
    deleteBtn.addEventListener("click", () => deleteTodo(todo._id));

    todoActions.appendChild(toggleBtn);
    todoActions.appendChild(editBtn);
    todoActions.appendChild(deleteBtn);

    todoItem.appendChild(todoContent);
    todoItem.appendChild(todoActions);

    todoList.appendChild(todoItem);
  });

  todoList.classList.remove("hidden");
}

// Fonction pour afficher le chargement
function showLoading() {
  loadingElement.classList.remove("hidden");
  todoList.classList.add("hidden");
}

// Fonction pour masquer le chargement
function hideLoading() {
  loadingElement.classList.add("hidden");
}

// Fonction pour afficher une erreur
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

// Fonction pour masquer l'erreur
function hideError() {
  errorMessage.classList.add("hidden");
}
