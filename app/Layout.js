import { loadable } from "jotai/utils.js";
import ViewController from "../lib/ViewController.js"
import todoStore from "./atom/store.js";
import { todoItem, todoListFetchAtom } from "./atom/todoAtom.js";
import TodoContentsViewController from "./contents/TodoContentsViewController.js";
import TodoListViewController from './list/TodoListViewController.js'


export default class Layout extends ViewController {
    constructor() {
        super();
        super.init({
            template: `
                <div class="todo-list" style="flex:0 0 300px;max-width:300px"></div>
                <div class="todo-content" style="flex:1 1 auto;"></div>
            `,
            attributes: {
                style: 'display:flex;width:100%'
            }
        })

    }
    async onRender() {
        const listView = new TodoListViewController();
        const contentView = new TodoContentsViewController();
        this.getElement().querySelector('.todo-list').appendChild(listView.render())
        this.getElement().querySelector('.todo-content').appendChild(contentView.render())
        listView.addListener('listView:editor:open', () => {
            contentView.showEditor();
        })
    }
}