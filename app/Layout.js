import ViewController from "../lib/ViewController.js"
import TodoContentsViewController from "./contents/TodoContentsViewController.js";
import TodoListViewController from './list/TodoListViewController.js'
export default class Layout extends ViewController {
    constructor() {
        super();
        super.init({
            template: `
                <div class="todo-list" style="flex:0 0 300px;background-color:pink;max-width:300px"></div>
                <div class="todo-content" style="flex:1 1 auto;background-color:green"></div>
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

        listView.addListener('listView:click', ({model}) => {
            contentView.showContent(model);
        })
        listView.addListener('listView:editor:open', () => {
            contentView.showEditor();
        })
        listView.addListener('item:deleted', ({itemModel}) => {
            const showingModel = contentView.getCurrentShowingModel();
            console.log(showingModel);
            if (showingModel && showingModel.id === itemModel.id) {
                contentView.showEmpty();
            }
        })
        contentView.addListener('item:added', async ({title, desc}) => {
            const newModel = await listView.addData(title, desc);
            contentView.showContent(newModel);
        })

        listView.updateData()
    }
}