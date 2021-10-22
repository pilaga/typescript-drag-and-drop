//-----------------------------------------------------------------------------------------------------
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

//-----------------------------------------------------------------------------------------------------
//user input validation
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
}

function validateUserInput(validatableInput: Validatable) {
    let isValid = true;
    if(validatableInput.required) {
        isValid = isValid && validatableInput.value.toString().trim().length !== 0;
    }
    if(validatableInput.minLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
    }
    if(validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
        isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
    }
    if(validatableInput.minValue != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value >= validatableInput.minValue;
    }
    if(validatableInput.maxValue != null && typeof validatableInput.value === 'number') {
        isValid = isValid && validatableInput.value <= validatableInput.maxValue;
    }
    return isValid;
}

//-----------------------------------------------------------------------------------------------------
//project list class
class ProjectList {
    templateElement: HTMLTemplateElement;
    appElement: HTMLDivElement;
    mainElement: HTMLElement; //<section> element

    constructor(private type: 'active' | 'finished') { //project is either active or completed
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.appElement = document.getElementById('app')! as HTMLDivElement;

        //grab section element
        const importedNode = document.importNode(this.templateElement.content, true);
        this.mainElement = importedNode.firstElementChild as HTMLFormElement;
        this.mainElement.id = `${this.type}-projects`;

        this.attach();
        this.render();
    }

    private render() {
        const listId = `${this.type}-projects-list`;
        this.mainElement.querySelector('ul')!.id = listId;
        this.mainElement.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }

    private attach() {
        this.appElement.insertAdjacentElement('beforeend', this.mainElement);        
    }
}

//-----------------------------------------------------------------------------------------------------
//project input class
class ProjectInput {
    templateElement: HTMLTemplateElement;
    appElement: HTMLDivElement;
    mainElement: HTMLFormElement;    
    titleInputElement: HTMLInputElement;
    descInputElement: HTMLInputElement;
    teamInputElement: HTMLInputElement;    

    constructor() {
        this.templateElement = document.getElementById('project-input')! as HTMLTemplateElement;
        this.appElement = document.getElementById('app')! as HTMLDivElement;

        //grab form element
        const importedNode = document.importNode(this.templateElement.content, true);
        this.mainElement = importedNode.firstElementChild as HTMLFormElement;
        this.mainElement.id = 'user-input';

        //grab form input
        this.titleInputElement = this.mainElement.querySelector('#title')! as HTMLInputElement;
        this.descInputElement = this.mainElement.querySelector('#description')! as HTMLInputElement;
        this.teamInputElement = this.mainElement.querySelector('#people')! as HTMLInputElement;

        //prepare & render
        this.configure();
        this.attach();
    }

    private fetchUserInput(): [string, string, number] | void {
        const inputTitle = this.titleInputElement.value;
        const inputDesc = this.descInputElement.value;
        const inputTeam = this.teamInputElement.value;

        const titleValidatable: Validatable = {
            value: inputTitle,
            required: true
        }
        const descValidatable: Validatable = {
            value: inputDesc,
            required: true,
            minLength: 5
        }
        const teamValidatable: Validatable = {
            value: +inputTeam,
            required: true,
            minValue: 1,
            maxValue: 5
        }

        //check input
        if(
            !validateUserInput(titleValidatable) ||
            !validateUserInput(descValidatable) ||
            !validateUserInput(teamValidatable)) {
                console.log('error, please check input')
                return;
        } else {
            return [inputTitle, inputDesc, +inputTeam];
        }
    }

    private clearUserInput() {
        this.titleInputElement.value = "";
        this.descInputElement.value = "";
        this.teamInputElement.value = "";
    }

    @Autobind
    private submitHandler(event: Event) {
        event.preventDefault();
        const userInput = this.fetchUserInput();
        if(Array.isArray(userInput)) {
            const [title, desc, people] = userInput;

            console.log(title, desc, people);
        }

        this.clearUserInput();
    }

    private configure() {
        this.mainElement.addEventListener('submit', this.submitHandler);
    }

    private attach() {
        this.appElement.insertAdjacentElement('afterbegin', this.mainElement);
    }
}

const project = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');