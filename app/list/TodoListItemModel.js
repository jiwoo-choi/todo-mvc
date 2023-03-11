export default class TodoListItemModel {
    constructor(json) {
        this._id = json.id;
        this._title = json.title;
        this._desc = json.desc;
        this._date = json.date;
    }
    get id() {
        return this._id;
    }
    get desc() {
        return this._desc;
    }  
    set desc(desc) {
        this._desc = desc;s
    }
    get title() {
        return this._title
    }
    set title(title) {
        return this._title = title;
    }
    get date() {
        return this._date;
    }
    set date(date) {
        this._date = date
    }
}