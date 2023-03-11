// import TodoListItemModel from "./TodoListItemModel.js";
import { deleteTodoItem } from '../../api/api.js';
import ViewController from '../../lib/ViewController.js'
import todoStore from "../atom/store.js";
import { currentClickedTodoItem, isCurrentlyClicked, todoItem, todoList } from "../atom/todoAtom.js";

export default class TodoListItemViewController extends ViewController {
    constructor(id) {
        super();
        super.init({
            attributes: {
                style: 'box-sizing:border-box;position:relative',
            },
            events: [
                {
                    selector: '.delete1',
                    eventKey: 'click',
                    listener: (e) => {
                        e.stopPropagation()
                        deleteTodoItem(this.id).then(() => {
                            this.deleteItem();
                        })
                    },
                },
                {
                    selector: '.container',
                    eventKey: 'click',
                    listener: () => {
                        todoStore.set(currentClickedTodoItem, this.id)
                    },
                }
            ],
            template: `
                    <div class="container" data-id={{id}} style="display:flex;flex-direction:column;border:1px solid #dfdfdf;border-radius:10px;padding:15px;{{isActive}}">
                        <div class="title" style="font-weight:bolder;font-size:1.2rem;margin-bottom:10px">{{title}}</div>
                        <div class="desc">{{desc}}</div>
                        <button class="delete1" style="position:absolute;top:10px;right:10px">x</div> 
                    </div>
                `
        })
        this.id = id;
        this.addJotaiSubListener(todoStore, todoItem({key: this.id}), () => {
            this.render();
        })
        this.addJotaiSubListener(todoStore, isCurrentlyClicked({key: this.id}), () => {
            this.render();
        })
    }
    onRender() {
        const data = todoStore.get(todoItem({key: this.id}));
        const isActive = todoStore.get(isCurrentlyClicked({key: this.id}));
        this.getElement().innerHTML = this.getTemplate()
            .replace('{{id}}', data.id)
            .replace('{{title}}', data.title)
            .replace('{{desc}}', data.desc)
            .replace('{{isActive}}', isActive ? 'background-color: #f0f8ff;box-shadow: 0 5px 20px rgb(0 0 0 / 5%);' : '')
    }
    deleteItem() {
        const list = todoStore.get(todoList)
        todoItem.remove({key: this.id})
        isCurrentlyClicked.remove({key: this.id});
        todoStore.set(todoList, list.filter((value) => value.id !== this.id));
        this.destroy();
    }
}