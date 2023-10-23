import todoStore, { Filters } from '../store/todo.store';
import html from './app.html?raw';
import { renderPending, renderTodos } from './models/use-cases';


const ElementsIDs = {
    ClearCompleted     : '.clear-completed',
    TodoList           : '.todo-list',
    TodoFilters        : '.filter',
    NewTodoInput       : '#new-todo-input',
    PendingCounterLabel: '#pending-count',
}

export const App = (elementoId) => {
    
    const updatePendingCounter = () => {
        renderPending(ElementsIDs.PendingCounterLabel);
    }

    const displayTodos = () => {
        const todos = todoStore.getTodos(todoStore.getCurrentFilter());
        renderTodos(ElementsIDs.TodoList, todos);
        updatePendingCounter();
    }

    

    (() => {
        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementoId).append(app);
        displayTodos();
    })();

    const newDescriptionInput = document.querySelector(ElementsIDs.NewTodoInput);
    const todoListUL = document.querySelector(ElementsIDs.TodoList);
    const filtersLIs = document.querySelectorAll(ElementsIDs.TodoFilters);
    const clearAllCompleted = document.querySelector(ElementsIDs.ClearCompleted);

    newDescriptionInput.addEventListener('keyup', ( e ) =>{
        if(e.keyCode !== 13){
            return;
        }

        if(e.target.value.trim().length === 0){
            return;
        }

        todoStore.addTodo(e.target.value);
        e.target.value = '';
        displayTodos();
    });

    todoListUL.addEventListener('click', (e) => {
        const isDestroyedElement = e.target.className === 'destroy';
        const element = e.target.closest('[data-id]');

        if(!element || !isDestroyedElement){
            todoStore.toggleTodo(element.getAttribute('data-id'));
        }else{
            todoStore.deleteTodo(element.getAttribute('data-id'));
        }
        
        displayTodos();
    });

    clearAllCompleted.addEventListener('click', () => {
        todoStore.deleteAllCompleted();
        displayTodos();
    });

    filtersLIs.forEach(element => {
        element.addEventListener('click', (element) => {
            filtersLIs.forEach(el => el.classList.remove('selected'));
            element.target.classList.add('selected');

            switch (element.target.text) {
                case 'Todos':
                    todoStore.setFilter(Filters.All);
                    break;
                case 'Pendientes':
                    todoStore.setFilter(Filters.Pending);
                    break;
                case 'Completados':
                    todoStore.setFilter(Filters.Completed);
                    break;
            }

            displayTodos();
        });
    });
}