import Layout from "./Layout.js";

class Application {
    async start() {
        const layout = new Layout();
        const element = layout.render();
        document.querySelector('#app').appendChild(element);
    }
}
new Application().start();