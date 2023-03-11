export default class ViewController {
    /**
     * 
     * @param {{template: string; events: {selector:string; eventKey: string, handler: any}[]; attributes: object}} configs 
     */
    init(configs) {
        this._init = true;
        this._template = configs.template ? configs.template : '';
        this._events = configs.events ? configs.events : [];
        const div = document.createElement('div');
        const attributes = configs.attributes ? configs.attributes : {};
        Object.entries(attributes).forEach(([key, value]) => {
            div.setAttribute(key, value);
        })
        div.innerHTML = this._template;
        this._config = {
            element : div,
            template: this._template,
            events: this._events,
        }
        this._internalListener = []
    }
    _initChecker() {
        if (!this._init) {
            throw new Error('not yet initialized. call super.init()')
        }
    }
    getTemplate() {
        this._initChecker()
        return this._config.template;
    }
    /**
     * 
     * @returns {HTMLElement}
     */
    getElement() {
        this._initChecker()
        return this._config.element;
    }
    destroy() {
        this._initChecker()
        this._unbindEvents();
        this._removeAddedListenerAll();
        if (this.onDestory) {
            this.onDestory();
        }
        this.getElement().remove();
        this._config = null;
    }
    addListener(key, listener) {
        const coveredListener = (e) => { 
            if (e.detail) {
                listener(e.detail)
            } else {
                listener();
            }
        };
        this.getElement().addEventListener(key, coveredListener);
        this._internalListener.push({
            key: key,
            listener: coveredListener
        })
    }
    triggerEvent(key, data) {
        this.getElement().dispatchEvent(new CustomEvent(key, {detail: {...data}}))
    }
    _removeAddedListenerAll() {
        this._internalListener.forEach((value) => {
            this.getElement().removeEventListener(value.key, value.listener);
        })
        this._internalListener = [];
    }
    render() {
        this._initChecker()
        this.onRender();
        this._bindEvents();
        return this.getElement();
    }
    _bindEvents() {
        this._unbindEvents();
        this._events.forEach((value) => {
            const element = this.getElement().querySelector(value.selector);
            if (element) {
                element.addEventListener(value.eventKey, value.listener);
            }
        })
    }
    _unbindEvents() {
        this._events.forEach((value) => {
            const element = this.getElement().querySelector(value.selector);
            if (element) {
                element.removeEventListener(value.eventKey, value.listener);
            }
        })
    }
}
