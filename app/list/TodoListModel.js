import { createTodoItem, getTodoList, deleteTodoItem } from "../../api/api.js";
import TodoListItemModel from '../../app/list/TodoListItemModel.js';

export default class TodoListModel {
    constructor() {
        this._list = [];
    }
    get list() {
        return this._list
    }
    set list(list) {
        this._list = list
    }
    async fetchTodoList() {
        const list = await getTodoList();
        this._list = list.map((value) => {
            return new TodoListItemModel(value)
        })
    }
    findById(id) {
        return this._list.find((value) => {
            return value._id === id
        })
    }
    async addData(title, desc) {
        const apiItemModel = await createTodoItem({
            title: title,
            desc: desc,
            date: Date.now()
        })
        const model = new TodoListItemModel(apiItemModel)
        this._list.push(model);
        return model
    }
    async deleteData(id) {
        await deleteTodoItem(id);
        this._list = this._list.filter((value) => {
            return value.id === id
        })
    }
}