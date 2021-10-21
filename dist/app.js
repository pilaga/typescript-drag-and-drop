"use strict";
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById('project-input');
        this.appElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.formElement = importedNode.firstElementChild;
        this.attach();
    }
    attach() {
        this.appElement.insertAdjacentElement('afterbegin', this.formElement);
    }
}
const project = new ProjectInput();
//# sourceMappingURL=app.js.map