import {atom} from 'jotai';
import {atomFamily} from 'jotai/utils'
import { getTodoList } from '../../api/api';
import todoStore from './store';

const updatar = atom(0);
export const todoListFetchAtom = atom(async (get) => { 
    get(updatar);
    return await getTodoList()
});
export function refetchTodoList() {
    todoStore.set(updatar, (prev) => prev + 1);
}
export const todoList = atom([]);
export const todoItem = atomFamily((param) => atom(null), (a, b) => {
    return a.key === b.key;
})
export const currentClickedTodoItem = atom(null);

export const isCurrentlyClicked = atomFamily((param) => atom((get) => {
    const currentlyClickedItem = get(currentClickedTodoItem);
    return currentlyClickedItem === param.key;
}), (a, b) => {
    return a.key === b.key;
})

