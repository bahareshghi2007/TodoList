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
    const id = new Date().getTime();
    if (todo.parentElement.classList.contains('add-todo-btn')) {
      this.createTodo([todo.parentElement.nextElementSibling.value, id]);

      // update LocalStorage:
      let todos = Storage.getTodos();
      todos = [
        ...todos,
        {
          completed: false,
          title: todo.parentElement.nextElementSibling.value,
          id: new Date().getTime(),
        },
      ];
      Storage.saveTodo(todos);
    } else {
      this.createTodo([todo.nextElementSibling.value, id]);

      // update LocalStorage:
      let todos = Storage.getTodos();
      todos = [
        ...todos,
        {
          completed: false,
          title: todo.nextElementSibling.value,
          id: id,
        },
      ];
      Storage.saveTodo(todos);
    }
    // reset app:
    addTodoInput.value = '';
  }

  static createTodo(todo) {
    const todoContainer = document.createElement('li');
    todoContainer.classList.add('todo');
    if (todo.completed == true) {
      todoContainer.innerHTML = `
      <input type="text" class="todo-title complete" value='${
        todo.title || todo[0]
      }'/>
      <div class="todo-desc" data-id ='${todo.id || todo[1]}'>
      <i class="fa-regular fa-check-square completed"></i>
      <i class="fa-solid fa-trash"></i>
      </div>
     `;
    } else {
      todoContainer.innerHTML = `
       <input type="text" class="todo-title" value='${todo.title || todo[0]}'/>
       <div class="todo-desc" data-id ='${todo.id || todo[1]}'>
       <i class="fa-regular fa-square"></i>
       <i class="fa-solid fa-trash"></i>
       </div>
      `;
    }
    todosContainer.appendChild(todoContainer);
    todoContainer.addEventListener('click', (e) => this.todoLogic(e.target));
  }

  static todoLogic(todo) {
    if (todo.classList.contains('fa-trash')) {
      // update DOM:
      const deletedTodo = todo.parentElement.parentElement;
      deletedTodo.remove();

      // update LocalStorage:
      const todos = Storage.getTodos();
      const remainingTodos = todos.filter(
        (t) => t.id != todo.parentElement.dataset.id
      );
      Storage.saveTodo(remainingTodos);
    } else if (
      todo.classList.contains('fa-square') ||
      todo.classList.contains('fa-check-square')
    ) {
      todo.classList.toggle('completed');
      // update DOM:
      let todos = Storage.getTodos();
      let selectedTodo = todos.find(
        (t) => t.id == todo.parentElement.dataset.id
      );
      // todos.forEach((t) => console.log(t.id, todo.parentElement.dataset.id));
      if (selectedTodo.completed) {
        selectedTodo.completed = false;
        todo.parentElement.previousElementSibling.classList.remove('complete');
        todo.classList.remove('fa-check-square');
        todo.classList.add('fa-square');
      } else {
        selectedTodo.completed = true;
        todo.parentElement.previousElementSibling.classList.add('complete');
        todo.classList.remove('fa-square');
        todo.classList.add('fa-check-square');
      }

      // update LocalStorage:
      Storage.saveTodo(todos);
    }
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
