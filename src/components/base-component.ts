
//project list class
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
    templateElement: HTMLTemplateElement;
    appElement: T;
    mainElement: U;

    constructor(templateId: string, appElementId: string, insertAtStart: boolean, newElementId?: string)
    {
        this.templateElement = document.getElementById(templateId)! as HTMLTemplateElement;
        this.appElement = document.getElementById(appElementId)! as T;

        //grab section element
        const importedNode = document.importNode(this.templateElement.content, true);
        this.mainElement = importedNode.firstElementChild as U;

        if(newElementId) {
            this.mainElement.id = newElementId;
        }

        this.attach(insertAtStart);
    }

    private attach(insertAtStart: boolean) {
        this.appElement.insertAdjacentElement(insertAtStart? 'afterbegin':'beforeend', this.mainElement);              
    }

    abstract configure(): void;
    abstract render(): void;
}
