const addTodoBtn = document.querySelector('.add-todo-btn');
const todosContainer = document.querySelector('.todos-list');
const addTodoInput = document.querySelector('.add-todo-input');
let result = '';

addTodoBtn.addEventListener('click', (e) => App.addTodo(e.target));

document.addEventListener('DOMContentLoaded', () => {
  const todos = Storage.getTodos();
  todos.forEach((todo) => {
    App.createTodo(todo);
  });
});

class App {
  static addTodo(todo) {
    if (todo.parentElement.classList.contains('add-todo-btn')) {
      this.createTodo(todo.parentElement.nextElementSibling.value);
      // update LocalStorage:
      Storage.saveTodo(todo.parentElement.nextElementSibling.value);
    } else {
      this.createTodo(todo.nextElementSibling.value);
      // update LocalStorage:
      Storage.saveTodo(todo.nextElementSibling.value);
    }
    // reset app:
    addTodoInput.value = '';
  }

  static createTodo(todo) {
    result += `
        <li class="todo">
        <input type="text" class="todo-title" value='${todo}'/>
        <div class="todo-desc">
        <i class="fa-regular fa-square"></i>
        <i class="fa-solid fa-trash"></i>
        </div>
        </li>
        `;
    todosContainer.innerHTML = result;
  }
}

class Storage {
  static saveTodo(todoToSave) {
    console.log(todoToSave);
    let todos = this.getTodos();
    todos = [...todos, todoToSave];
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  static getTodos() {
    return JSON.parse(localStorage.getItem('todos'))
      ? JSON.parse(localStorage.getItem('todos'))
      : [];
  }
}
