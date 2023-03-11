import TodoListItemViewController from "./TodoListItemViewController.js";
import ViewController from '../../lib/ViewController.js'
import todoStore from "../atom/store.js";
import { loadable, splitAtom } from "jotai/utils.js";
import { todoAtomList, todoItem, todoList, todoListFetchAtom } from "../atom/todoAtom.js";

export default class TodoListViewController extends ViewController {
    constructor() {
        super();
        super.init(
            {
                template: `
                    <button class="create" style="border-radius:10px;border:0px;padding:10px;margin-bottom:10px;">추가하기</button>
                    <div class="items" style="display:flex;flex-direction:column;gap:10px"></div>
                    <div class="isLoading">...isLoading</div>
                `,
                events: [
                    {
                        selector: '.create',
                        eventKey: 'click',
                        listener: () => {
                            this.triggerEvent('listView:editor:open');
                        }
                    },
                ],
            }
        )
        this.itemList = [];
        this.addJotaiSubListener(todoStore, loadable(todoListFetchAtom), () => {
            const lodable = todoStore.get(loadable(todoListFetchAtom))
            if (lodable.state === 'loading') {
                console.log()
                this.getElement().querySelector('.isLoading').style = "display:block;"
                return;
            }
            this.itemList.forEach((itemView) => {
                // itemView.deleteItem();
            })
            
            this.getElement().innerHTML = this.getTemplate();
            this.getElement().querySelector('.isLoading').style = "display:none;"
            this.render();
            todoStore.set(todoList, lodable.data);
            lodable.data.forEach((value) => {
                todoStore.set(todoItem({key: value.id}), value)
                const itemView = new TodoListItemViewController(value.id)
                this.getElement().querySelector('.items').appendChild(itemView.render())
                this.itemList.push(itemView)
            })
            
        })
    }
    onRender() {
    }
}