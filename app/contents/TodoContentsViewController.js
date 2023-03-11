import ViewController from "../../lib/ViewController.js";
import TodoListItemModel from "../list/TodoListItemModel.js";

export default class TodoContentsViewController extends ViewController {
    constructor() {
        super()
        super.init({
            template: `
                <div class="layout"></div>
                <template id="empty-view">
                    <div class="title">EMPTY VIEW</div>
                </template>
                <template id="content-view">
                    <div class="title">{{title}}</div>
                    <div class="content">{{desc}}</div>
                </template>
                <template id="editor-view">
                    <label>title : </label><input class="title">
                    <label>content : </label><textarea class="desc"></textarea>
                    <button class="createTodo">등록하기</button>
                </template>
            `,
            events: [
                {
                    selector: '.createTodo',
                    eventKey: 'click',
                    listener: () => {
                        const title = this.getElement().querySelector(".title").value
                        const desc = this.getElement().querySelector(".desc").value
                        this.triggerEvent('item:added', {title , desc});
                    }
                }
            ]           
        })
        this.showEmpty();
    }
    onRender() {
        const layout = this.getElement().querySelector('.layout')
        switch (this._mode) {
            case 'EMPTY':
                layout.innerHTML = this.getElement().querySelector('#empty-view').innerHTML
                return;
            case 'CONTENT':
                layout.innerHTML = this.getElement().querySelector('#content-view').innerHTML
                    .replace('{{title}}', this._itemModel.title)
                    .replace('{{desc}}', this._itemModel.desc);
                return;
            case 'EDIT':
                layout.innerHTML = this.getElement().querySelector('#editor-view').innerHTML
                return;
            default:
                return;
        }
    }
    showContent(itemModel) {
        this._mode = 'CONTENT';
        this._itemModel = itemModel;
        this.render();
    }
    showEmpty() {
        this._mode = 'EMPTY'
        this._itemModel = null;
        this.render();
    }
    showEditor() {
        this._mode = 'EDIT';
        this.render();
    }
    getCurrentShowingModel() {
        return this._itemModel;
    }
}
