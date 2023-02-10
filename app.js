const addTodoBtn = document.querySelector('.add-todo-btn');
const todosContainer = document.querySelector('.todos-list');
const addTodoInput = document.querySelector('.add-todo-input');

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
      this.createTodo([
        todo.parentElement.nextElementSibling.value,
        new Date().getTime(),
      ]);

      // update LocalStorage:
      let todos = Storage.getTodos();
      todos = [
        ...todos,
        [todo.parentElement.nextElementSibling.value, new Date().getTime()],
      ];
      Storage.saveTodo(todos);
    } else {
      this.createTodo([todo.nextElementSibling.value, new Date().getTime()]);

      // update LocalStorage:
      let todos = Storage.getTodos();
      todos = [...todos, [todo.nextElementSibling.value, new Date().getTime()]];
      Storage.saveTodo(todos);
    }
    // reset app:
    addTodoInput.value = '';
  }

  static createTodo(todo) {
    const todoContainer = document.createElement('li');
    todoContainer.classList.add('todo');
    todoContainer.innerHTML = `
     <input type="text" class="todo-title" value='${todo[0]}'/>
     <div class="todo-desc" data-id ='${todo[1]}'>
     <i class="fa-regular fa-square"></i>
     <i class="fa-solid fa-trash"></i>
     </div>
    `;
    todosContainer.appendChild(todoContainer);

    const deleteBtns = document.querySelectorAll('.fa-trash');
    deleteBtns.forEach((btn) =>
      btn.addEventListener('click', (e) => this.deleteTodo(e.target))
    );
  }

  static deleteTodo(todo) {
    // update DOM:
    const deletedTodo = todo.parentElement.parentElement;
    deletedTodo.remove();

    // update LocalStorage:
    const todos = Storage.getTodos();
    const remainingTodos = todos.filter(
      (t) => t[1] != todo.parentElement.dataset.id
    );
    Storage.saveTodo(remainingTodos);
  }
}

class Storage {
  static saveTodo(todosToSave) {
    localStorage.setItem('todos', JSON.stringify(todosToSave));
  }

  static getTodos() {
    return JSON.parse(localStorage.getItem('todos'))
      ? JSON.parse(localStorage.getItem('todos'))
      : [];
  }
}
