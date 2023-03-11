import TodoListItemModel from "./TodoListItemModel.js";
import ViewController from '../../lib/ViewController.js'

export default class TodoListItemViewController extends ViewController {
    constructor(itemModel) {
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
                        this.triggerEvent('item:deleted',{ itemModel : this._model })
                    },
                }
            ],
            template: `
                    <div class="container" data-id={{id}} style="display:flex;flex-direction:column;border:2px solid black;border-radius:10px;padding:15px;">
                        <div class="title" style="font-weight:bolder;font-size:1.2rem;margin-bottom:10px">{{title}}</div>
                        <div class="desc">{{desc}}</div>
                        <button class="delete1" style="position:absolute;top:10px;right:10px">x</div> 
                    </div>
                `
        })
        this._model = itemModel
    }
    onRender() {
        this.getElement().innerHTML = this.getTemplate()
            .replace('{{id}}', this._model.id)
            .replace('{{title}}', this._model.title)
            .replace('{{desc}}', this._model.desc)
    }
}