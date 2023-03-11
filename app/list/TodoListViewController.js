import TodoListItemViewController from "./TodoListItemViewController.js";
import TodoListModel from "./TodoListModel.js";
import ViewController from '../../lib/ViewController.js'

export default class TodoListViewController extends ViewController {
    constructor() {
        super();
        super.init(
            {
                template: `
                    <button class="create" style="border-radius:10px;border:0px;padding:10px">추가하기</button>
                    <div class="items"></div>
                `,
                events: [
                    {
                        selector: '.create',
                        eventKey: 'click',
                        listener: () => {
                            this.triggerEvent('listView:editor:open');
                        }
                    },
                    {
                        selector: '.items',
                        eventKey: 'click',
                        listener: (e) => {
                            const container = e.target.closest('.container')
                            const id = container.getAttribute('data-id');
                            const itemModel = this._model.findById(id);
                            this.triggerEvent('listView:click',{model : itemModel});
                        }
                    }
                ],
            }
        )
        this._model = new TodoListModel();
    }
    onRender() {
        this.getElement().querySelector('.items').innerHTML = '';
        this._model.list.forEach((itemModel) => {
            const itemView = new TodoListItemViewController(itemModel);
            this.getElement().querySelector('.items').appendChild(itemView.render())
            itemView.addListener('item:deleted', ({itemModel}) => {
                this.triggerEvent('item:deleted', {itemModel});
                this._model.deleteData(itemModel.id);
                itemView.destroy();
            })
        })
    }
    async updateData() {
        await this._model.fetchTodoList();
        this.render();
    }
    async addData(title, desc) {
        const itemModel = await this._model.addData(title, desc)
        const itemView = new TodoListItemViewController(itemModel);
        this.getElement().querySelector('.items').appendChild(itemView.render())
        itemView.addListener('item:deleted', ({itemModel}) => {
            this.triggerEvent('item:deleted', {itemModel});
            this._model.deleteData(itemModel.id);
            itemView.destroy();
        })
        return itemModel;
    }
}