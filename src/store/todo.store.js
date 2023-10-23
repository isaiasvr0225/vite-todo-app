import { Todo } from '../todos/models/todo-model';

export const Filters = {
    All: 'all',
    Completed: 'completed',
    Pending: 'pending'
};

const state = {
    todos: [],
    filter: Filters.All,
};

const initStore = () => {
    loadStore();
};


const loadStore = () => {
    if(!localStorage.getItem('state')) {
        return;
    }

    const {todos = [], filter = Filters.All} = JSON.parse(localStorage.getItem('state'));
    state.todos = todos;
    state.filter = filter;
};

const saveStateToLocalStorage = () => {
    localStorage.setItem('state', JSON.stringify(state));
}

const getTodos = (filter = Filters.All) => {
    switch(filter) {
        case Filters.All:
            return [...state.todos];
        case Filters.Completed:
            return state.todos.filter(todo => todo.done);
        case Filters.Pending:
            return state.todos.filter(todo => !todo.done);
        default:
            throw new Error('Option is not valid');
    }
};

/**
 * @param {string} description Todo Object
 */
const addTodo = (description) => {
    if(!description) {
        throw new Error('¡Description is required!');
    }

    state.todos.push(new Todo(description));

    saveStateToLocalStorage();
};

/**
 * @param {string} todoId Todo ID
 */
const toggleTodo = (todoId) => {
    state.todos = state.todos.map(todo => {
        if(todo.id === todoId){
            todo.done = !todo.done;
        }
        return todo;    
    });

    saveStateToLocalStorage();
};

/**
 * @param {string} todoId Todo ID
 */
const deleteTodo = (todoId) => {
    state.todos = state.todos.filter(todo => todo.id !== todoId);
    saveStateToLocalStorage();
};

const deleteAllCompleted = () => {
    state.todos = state.todos.filter(todo => !todo.done);
    saveStateToLocalStorage();
};

const setFilter = (newFilter = Filters.All) => {
    state.filter = newFilter;
    saveStateToLocalStorage();
};

const getCurrentFilter = () => {
    return state.filter;
};

export default {
    initStore,
    loadStore,
    getTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    deleteAllCompleted,
    setFilter,
    getCurrentFilter,
};
