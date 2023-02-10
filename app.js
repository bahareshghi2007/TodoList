const addTodoBtn = document.querySelector('.add-todo-btn');
const todosContainer = document.querySelector('.todos-list');
const addTodoInput = document.querySelector('.add-todo-input');
const searchInput = document.querySelector('.search-input');
const sortTodos = document.querySelector('.sort');

addTodoBtn.addEventListener('click', (e) => App.addTodo(e.target));
searchInput.addEventListener('input', (e) => App.searchTodos(e.target));
sortTodos.addEventListener('click', (e) => App.sortTodos(e.target));

document.addEventListener('DOMContentLoaded', () => {
  const todos = Storage.getTodos();
  todos.forEach((todo) => {
    App.createTodo(todo);
  });
  // reset App:
  App.resetApp();
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
      const filteredTodos = todos.filter(
        (t) => t.id != todo.parentElement.dataset.id
      );
      Storage.saveTodo(filteredTodos);
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
    } else if (todo.classList.contains('todo-title')) {
      todo.addEventListener('input', (e) => {
        let todos = Storage.getTodos();
        const changedTodo = todos.find(
          (t) => t.id == e.target.nextElementSibling.dataset.id
        );
        changedTodo.title = e.target.value;
        // update LocalStorage:
        Storage.saveTodo(todos);
      });
    }
  }

  static searchTodos(e) {
    const todos = Storage.getTodos();
    const filteredTodos = todos.filter((todo) => todo.title.includes(e.value));
    let result = '';
    filteredTodos.forEach((t) => {
      if (t.completed == true) {
        result += `
        <li class='todo'>
        <input type="text" class="todo-title complete" value='${t.title}'/>
        <div class="todo-desc" data-id ='${t.id}'>
        <i class="fa-regular fa-check-square completed"></i>
        <i class="fa-solid fa-trash"></i>
        </div>
        </li>
       `;
      } else {
        result += `
        <li class='todo'>
         <input type="text" class="todo-title" value='${t.title}'/>
         <div class="todo-desc" data-id ='${t.id}'>
         <i class="fa-regular fa-square"></i>
         <i class="fa-solid fa-trash"></i>
         </div>
         </li>
        `;
      }
    });
    // update DOM:
    todosContainer.innerHTML = result;
  }

  static sortTodos(e) {
    let result = '';
    const todos = Storage.getTodos();
    if (e.value == 'All') {
      todos.forEach((t) => {
        if (t.completed == true) {
          result += `
          <li class='todo'>
          <input type="text" class="todo-title complete" value='${t.title}'/>
          <div class="todo-desc" data-id ='${t.id}'>
          <i class="fa-regular fa-check-square completed"></i>
          <i class="fa-solid fa-trash"></i>
          </div>
          </li>
         `;
        } else {
          result += `
          <li class='todo'>
           <input type="text" class="todo-title" value='${t.title}'/>
           <div class="todo-desc" data-id ='${t.id}'>
           <i class="fa-regular fa-square"></i>
           <i class="fa-solid fa-trash"></i>
           </div>
           </li>
          `;
        }
      });
      // update DOM:
      todosContainer.innerHTML = result;
    } else if (e.value == 'Completed') {
      todos.forEach((t) => {
        if (t.completed == true) {
          result += `
            <li class='todo'>
            <input type="text" class="todo-title complete" value='${t.title}'/>
            <div class="todo-desc" data-id ='${t.id}'>
            <i class="fa-regular fa-check-square completed"></i>
            <i class="fa-solid fa-trash"></i>
            </div>
            </li>
           `;
        } else return;
      });
      // update DOM:
      todosContainer.innerHTML = result;
    } else if (e.value == 'Uncompleted') {
      todos.forEach((t) => {
        if (t.completed == false) {
          result += `
           <li class='todo'>
           <input type="text" class="todo-title" value='${t.title}'/>
           <div class="todo-desc" data-id ='${t.id}'>
           <i class="fa-regular fa-square"></i>
           <i class="fa-solid fa-trash"></i>
           </div>
           </li>
           `;
        } else return;
      });
      // update DOM:
      todosContainer.innerHTML = result;
    }
  }

  static resetApp() {
    addTodoInput.value = '';
    searchInput.value = '';
    sortTodos.getElementsByTagName('option')[0].selected = 'selected';
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
