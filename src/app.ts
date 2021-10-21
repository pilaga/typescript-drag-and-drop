//autobind decorator
function Autobind(target: any, methodName: string | Symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const adjustedDescriptor: PropertyDescriptor = {
        configurable: true,
        enumerable: false,
        get() {
            const boundFunction = originalMethod.bind(this);
            return boundFunction; 
        }
    };
    return adjustedDescriptor;
}

//project input class
class ProjectInput {
    templateElement: HTMLTemplateElement;
    formElement: HTMLFormElement;
    appElement: HTMLDivElement;
    titleInputElement: HTMLInputElement;
    descInputElement: HTMLInputElement;
    peopleInputElement: HTMLInputElement;    

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.appElement = document.getElementById('app')! as HTMLDivElement;

        //grab form element
        const importedNode = document.importNode(this.templateElement.content, true);
        this.formElement = importedNode.firstElementChild as HTMLFormElement;
        this.formElement.id = 'user-input';

        //grab form input
        this.titleInputElement = this.formElement.querySelector('#title')! as HTMLInputElement;
        this.descInputElement = this.formElement.querySelector('#description')! as HTMLInputElement;
        this.peopleInputElement = this.formElement.querySelector('#people')! as HTMLInputElement;

        //prepare & render
        this.configure();
        this.attach();
    }

    private fetchUserInput(): [string, string, number] | void {
        const inputTitle = this.titleInputElement.value;
        const inputDesc = this.descInputElement.value;
        const inputPeople = this.peopleInputElement.value;

        if(inputTitle.trim().length === 0 || inputDesc.trim().length === 0 || inputPeople.trim().length === 0) {
            alert('invalid input, please try again');
            return;
        } else {
            return [inputTitle, inputDesc, +inputPeople];
        }
    }

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault(); //prevent HTTP request from being sent
        const userInput = this.fetchUserInput();
        if(Array.isArray(userInput)) {
            const [title, desc, people] = userInput;
            console.log(title, desc, people);
        }
    }

    private configure() {
        this.formElement.addEventListener('submit', this.submitHandler);
    }

    private attach() {
        this.appElement.insertAdjacentElement('afterbegin', this.formElement);
    }
}

const project = new ProjectInput();