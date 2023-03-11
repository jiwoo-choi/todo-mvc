import { atom } from "jotai";
import { loadable } from "jotai/utils.js";
import { createTodoItem } from "../../api/api.js";
import ViewController from "../../lib/ViewController.js";
import todoStore from "../atom/store.js";
import { currentClickedTodoItem, isCurrentlyClicked, refetchTodoList, todoItem, todoList, todoListFetchAtom } from "../atom/todoAtom.js";

export default class TodoContentsViewController extends ViewController {
    constructor() {
        super()
        super.init({
            template: `
                <div class="layout" style="padding:20px"></div>
                <template id="loading-view">
                    <div> 로딩 중 입니다.. </div>
                </template>
                <template id="ready-view">
                    <div class="title">현재 선택된 아이템이 없습니다.</div>
                </template>
                <template id="empty-view">
                    <div class="title">현재 아이템이 없습니다.</div>
                </template>
                <template id="content-view">
                    <div class="title" style="font-weight:bolder;font-size:2rem;margin-bottom:10px">{{title}}</div>
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
                        createTodoItem(title, desc).then((data) => {
                            todoStore.set(currentClickedTodoItem, data.id);
                            refetchTodoList();
                        })
                    }
                }
            ]           
        })
        this.showLoadingView();

        // 현재 선택된 아이템이 없다.
        // TODO: 문제 여러개의 의존성을 태울 수 있나?
        this.addJotaiSubListener(todoStore, atom((get) => {
            get(currentClickedTodoItem); 
            get(todoList);
            if (get(currentClickedTodoItem) !== null) {
                get(todoItem({key : get(currentClickedTodoItem)}))
            }
            get(loadable(todoListFetchAtom))
            return {};
        }), () => {
            const data = todoStore.get(loadable(todoListFetchAtom));
            if (data.state === 'loading') {
                this.showLoadingView();
                return;
            }
            if (todoStore.get(currentClickedTodoItem) !== null) {
                const item = todoStore.get(todoItem({key : todoStore.get(currentClickedTodoItem)}))
                if (item == null) {
                    this.showEmpty();
                    return;
                } 
                this.showContent(item);
            }  else {
                this.showEmpty();
            }
            
        })
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
            case 'LOADING':
                layout.innerHTML = this.getElement().querySelector('#loading-view').innerHTML
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
    showLoadingView() {
        this._mode = 'LOADING';
        this.render();
    }
    getCurrentShowingModel() {
        return this._itemModel;
    }
}
