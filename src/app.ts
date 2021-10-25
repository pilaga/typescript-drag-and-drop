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
// Drag and Drop interfaces
interface Draggable { //ProjectItem objects are draggable
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}

interface DragTarget { //ProjectList objects are drag targets
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
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
type Listener<T> = (items: T[]) => void; 

//base State class
class State<T> {
    protected listeners: Listener<T>[] = [];
    addListener(listernerFunction: Listener<T>) {
        this.listeners.push(listernerFunction);
    }
}

//-----------------------------------------------------------------------------------------------------
//project state management class
class ProjectState extends State<Project> {    
    private static instance: ProjectState;
    private projects: Project[] = [];

    private constructor() {
        super();
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

    moveProject(id: string, newStatus: ProjectStatus) {
        const project = this.projects.find(project => project.id === id);
        if(project && project.status != newStatus) {
            project.status = newStatus;
            this.callListeners();
        }        
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
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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

//-----------------------------------------------------------------------------------------------------
//project item class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
    private project: Project;

    get persons() {
        if(this.project.team ===1) {
            return '1 person';
        } else {
            return `${this.project.team} persons`;
        }
    }

    constructor(hostId: string, project: Project) {
        super('single-project', hostId, false, project.id);
        this.project = project;

        this.configure();
        this.render();
    }

    render() {
        this.mainElement.querySelector('h2')!.textContent = this.project.title;
        this.mainElement.querySelector('h3')!.textContent = this.persons + ' assigned';
        this.mainElement.querySelector('p')!.textContent = this.project.description;
    }

    @Autobind
    dragStartHandler(event: DragEvent) {
        event.dataTransfer!.setData('text/plain', this.project.id);
        event.dataTransfer!.effectAllowed = 'move';
    }

    @Autobind
    dragEndHandler(event: DragEvent) {
        console.log('DragEnd');
    }

    configure() {
        this.mainElement.addEventListener('dragstart', this.dragStartHandler);
        this.mainElement.addEventListener('dragend', this.dragEndHandler);
    }
}

//-----------------------------------------------------------------------------------------------------
//project list class
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
    assignedProjects: Project[];

    constructor(private type: 'active' | 'finished') { //project is either active or completed
        super('project-list', 'app', false, `${type}-projects`);
        this.assignedProjects = [];

        this.configure();
        this.render();
    }

    private renderProjects() {
        const listElement = document.getElementById(`${this.type}-projects-list`)! as HTMLUListElement;
        listElement.innerHTML = ''; //empty list
        for(const item of this.assignedProjects) {            
            new ProjectItem(this.mainElement.querySelector('ul')!.id, item);
        }
    }

    @Autobind
    dragOverHandler(event: DragEvent) {
        if(event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){ //is the data attached to our drag event in text format
            event.preventDefault(); //in JS drag only allowed if preventDefault()
            const listElement = this.mainElement.querySelector('ul')!;// as HTMLUListElement;
            listElement.classList.add('droppable');
        }        
    }

    @Autobind
    dropHandler(event: DragEvent) {
        const id = event.dataTransfer!.getData('text/plain');
        projectState.moveProject(id, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);

        //clear background
        const listElement = this.mainElement.querySelector('ul')!;
        listElement.classList.remove('droppable');
    }

    @Autobind
    dragLeaveHandler(event: DragEvent) {
        const listElement = this.mainElement.querySelector('ul')!;
        listElement.classList.remove('droppable');
    }

    render() {
        const listId = `${this.type}-projects-list`;
        this.mainElement.querySelector('ul')!.id = listId;
        this.mainElement.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
    }   

    configure() {
        //grab section element
        projectState.addListener((projects: Project[]) => {
            const filteredProject = projects.filter(proj => { 
                if(this.type === 'active') {
                    return proj.status === ProjectStatus.Active;
                }
                return proj.status === ProjectStatus.Finished;           
            });
            this.assignedProjects = filteredProject;
            this.renderProjects();
        });

        //drag listeners
        this.mainElement.addEventListener('dragover', this.dragOverHandler);
        this.mainElement.addEventListener('dragleave', this.dragLeaveHandler);
        this.mainElement.addEventListener('drop', this.dropHandler);
    }
}

//-----------------------------------------------------------------------------------------------------
//project input class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {  
    titleInputElement: HTMLInputElement;
    descInputElement: HTMLInputElement;
    teamInputElement: HTMLInputElement;    

    constructor() {
        super('project-input', 'app', true, 'user-input');

        //grab form input
        this.titleInputElement = this.mainElement.querySelector('#title')! as HTMLInputElement;
        this.descInputElement = this.mainElement.querySelector('#description')! as HTMLInputElement;
        this.teamInputElement = this.mainElement.querySelector('#people')! as HTMLInputElement;

        this.configure();
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

    configure() {
        //submit handler
        this.mainElement.addEventListener('submit', this.submitHandler);        
    }

    render() {}
}

const project = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');

//debug
let debug = ProjectState.getInstance();

debug.addProject(
    'Specs, sitemap and wireframe',
    'Write full specificaton document according to customer\'s requirements. Generate sitemap and wireframes.',
    2
    );

debug.addProject(
    'Frontend development',
    'Design UI according to spec doc. Implement website\'s frontend using React and Bootstrap',
    3
    );

/*debug.addProject(
    'Backend development',
    'Design and create MongoDB database, implement Express server',
    5
    );

debug.addProject(
    'Testing',
    'Test the website following the spec doc. Document bugs, issues and missing features.',
    1
    );*/

