export class Component {
    constructor(templateId, appElementId, insertAtStart, newElementId) {
        this.templateElement = document.getElementById(templateId);
        this.appElement = document.getElementById(appElementId);
        const importedNode = document.importNode(this.templateElement.content, true);
        this.mainElement = importedNode.firstElementChild;
        if (newElementId) {
            this.mainElement.id = newElementId;
        }
        this.attach(insertAtStart);
    }
    attach(insertAtStart) {
        this.appElement.insertAdjacentElement(insertAtStart ? 'afterbegin' : 'beforeend', this.mainElement);
    }
}
//# sourceMappingURL=base-component.js.map