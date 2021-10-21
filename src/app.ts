
class ProjectInput {
    templateElement: HTMLTemplateElement;
    formElement: HTMLFormElement;
    appElement: HTMLDivElement;
    

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.appElement = document.getElementById('app')! as HTMLDivElement;

        //immediately render
        const importedNode = document.importNode(this.templateElement.content, true);
        this.formElement = importedNode.firstElementChild as HTMLFormElement;
        this.attach();
    }

    private attach() {
        this.appElement.insertAdjacentElement('afterbegin', this.formElement);
    }
}

const project = new ProjectInput();