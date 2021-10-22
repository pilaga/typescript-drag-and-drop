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
//Validatable interface
interface Validatable {
    value: string | number;
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    minValue?: number;
    maxValue?: number;
}

//user input validation
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
//project item class
enum ProjectStatus { Active, Finished }

class Project {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public team: number,
        public status: ProjectStatus
        ) {}
}

//Listener type is a function that receives an array of projects
type Listener = (items: Project[]) => void; 

//-----------------------------------------------------------------------------------------------------
//project state management class
class ProjectState {    
    private static instance: ProjectState;
    private listeners: Listener[] = [];  //list of listeners to notify objects of changes
    private projects: Project[] = [];

    private constructor() {

    }

    static getInstance() {
        if(!this.instance) {
            this.instance = new ProjectState();        
        }
        return this.instance;
    }

    addProject(title: string, description: string, team: number, status?: string) {
        let id = Math.random().toString();
        const newProject = new Project(id, title, description, team, ProjectStatus.Active);
        this.projects.push(newProject);
        this.callListeners();
    }

    addListener(listenerFunction: Listener) {
        this.listeners.push(listenerFunction);
    }

    private callListeners() {
        for(const listenerFunction of this.listeners) {
            listenerFunction(this.projects.slice());    //slice() to only return a copy
        }
    }
}

const projectState = ProjectState.getInstance();

//-----------------------------------------------------------------------------------------------------
//project list class
class ProjectList {
    templateElement: HTMLTemplateElement;
    appElement: HTMLDivElement;
    mainElement: HTMLElement; //<section> element
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') { //project is either active or completed
        this.templateElement = document.getElementById('project-list')! as HTMLTemplateElement;
        this.appElement = document.getElementById('app')! as HTMLDivElement;
        this.assignedProjects = [];

        //grab section element
        const importedNode = document.importNode(this.templateElement.content, true);
        this.mainElement = importedNode.firstElementChild as HTMLFormElement;
        this.mainElement.id = `${this.type}-projects`;

        projectState.addListener((projects: Project[]) => {
            this.assignedProjects = projects;
            this.renderProjects();
        });

        this.attach();
        this.renderList();
    }

    private renderProjects() {
        const listElement = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        for(const item of this.assignedProjects) {
            const listItem = document.createElement('li');
            listItem.textContent = item.title;
            listElement.appendChild(listItem);
        }
    }

    private renderList() {
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
            const [title, desc, team] = userInput;

            projectState.addProject(title, desc, team);
            console.log(title, desc, team);
            this.clearUserInput();
        }       
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