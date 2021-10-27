"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var App;
(function (App) {
    let ProjectStatus;
    (function (ProjectStatus) {
        ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
        ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
    })(ProjectStatus = App.ProjectStatus || (App.ProjectStatus = {}));
    class Project {
        constructor(id, title, description, team, status) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.team = team;
            this.status = status;
        }
    }
    App.Project = Project;
})(App || (App = {}));
var App;
(function (App) {
    class State {
        constructor() {
            this.listeners = [];
        }
        addListener(listernerFunction) {
            this.listeners.push(listernerFunction);
        }
    }
    class ProjectState extends State {
        constructor() {
            super();
            this.projects = [];
        }
        static getInstance() {
            if (!this.instance) {
                this.instance = new ProjectState();
            }
            return this.instance;
        }
        addProject(title, description, team, status) {
            let id = Math.random().toString();
            const newProject = new App.Project(id, title, description, team, App.ProjectStatus.Active);
            this.projects.push(newProject);
            this.callListeners();
        }
        deleteProject(id) {
            this.projects.splice(this.projects.findIndex(item => item.id === id), 1);
            this.callListeners();
        }
        moveProject(id, newStatus) {
            const project = this.projects.find(project => project.id === id);
            if (project && project.status != newStatus) {
                project.status = newStatus;
                this.callListeners();
            }
        }
        callListeners() {
            for (const listenerFunction of this.listeners) {
                listenerFunction(this.projects.slice());
            }
        }
    }
    App.ProjectState = ProjectState;
    App.projectState = ProjectState.getInstance();
})(App || (App = {}));
var App;
(function (App) {
    function validateUserInput(validatableInput) {
        let isValid = true;
        if (validatableInput.required) {
            isValid = isValid && validatableInput.value.toString().trim().length !== 0;
        }
        if (validatableInput.minLength != null && typeof validatableInput.value === 'string') {
            isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
        }
        if (validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
            isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
        }
        if (validatableInput.minValue != null && typeof validatableInput.value === 'number') {
            isValid = isValid && validatableInput.value >= validatableInput.minValue;
        }
        if (validatableInput.maxValue != null && typeof validatableInput.value === 'number') {
            isValid = isValid && validatableInput.value <= validatableInput.maxValue;
        }
        return isValid;
    }
    App.validateUserInput = validateUserInput;
})(App || (App = {}));
var App;
(function (App) {
    function Autobind(target, methodName, descriptor) {
        const originalMethod = descriptor.value;
        const adjustedDescriptor = {
            configurable: true,
            enumerable: false,
            get() {
                const boundFunction = originalMethod.bind(this);
                return boundFunction;
            }
        };
        return adjustedDescriptor;
    }
    App.Autobind = Autobind;
})(App || (App = {}));
var App;
(function (App) {
    class Component {
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
    App.Component = Component;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectInput extends App.Component {
        constructor() {
            super('project-input', 'app', true, 'user-input');
            this.titleInputElement = this.mainElement.querySelector('#title');
            this.descInputElement = this.mainElement.querySelector('#description');
            this.teamInputElement = this.mainElement.querySelector('#people');
            this.configure();
        }
        fetchUserInput() {
            const inputTitle = this.titleInputElement.value;
            const inputDesc = this.descInputElement.value;
            const inputTeam = this.teamInputElement.value;
            const titleValidatable = {
                value: inputTitle,
                required: true
            };
            const descValidatable = {
                value: inputDesc,
                required: true,
                minLength: 5
            };
            const teamValidatable = {
                value: +inputTeam,
                required: true,
                minValue: 1,
                maxValue: 5
            };
            if (!App.validateUserInput(titleValidatable) ||
                !App.validateUserInput(descValidatable) ||
                !App.validateUserInput(teamValidatable)) {
                console.log('error, please check input');
                return;
            }
            else {
                return [inputTitle, inputDesc, +inputTeam];
            }
        }
        clearUserInput() {
            this.titleInputElement.value = "";
            this.descInputElement.value = "";
            this.teamInputElement.value = "";
        }
        submitHandler(event) {
            event.preventDefault();
            const userInput = this.fetchUserInput();
            if (Array.isArray(userInput)) {
                const [title, desc, team] = userInput;
                App.projectState.addProject(title, desc, team);
                console.log(title, desc, team);
                this.clearUserInput();
            }
        }
        configure() {
            this.mainElement.addEventListener('submit', this.submitHandler);
        }
        render() { }
    }
    __decorate([
        App.Autobind
    ], ProjectInput.prototype, "submitHandler", null);
    App.ProjectInput = ProjectInput;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectItem extends App.Component {
        constructor(hostId, project) {
            super('single-project', hostId, false, project.id);
            this.project = project;
            this.configure();
            this.render();
        }
        get persons() {
            if (this.project.team === 1) {
                return '1 person';
            }
            else {
                return `${this.project.team} persons`;
            }
        }
        render() {
            this.mainElement.querySelector('h2').textContent = this.project.title;
            this.mainElement.querySelector('h3').textContent = this.persons + ' assigned';
            this.mainElement.querySelector('p').textContent = this.project.description;
        }
        dragStartHandler(event) {
            event.dataTransfer.setData('text/plain', this.project.id);
            event.dataTransfer.effectAllowed = 'move';
        }
        dragEndHandler(event) {
            console.log('DragEnd');
        }
        deleteProjectHandler(event) {
            App.projectState.deleteProject(this.project.id);
        }
        configure() {
            this.mainElement.addEventListener('dragstart', this.dragStartHandler);
            this.mainElement.addEventListener('dragend', this.dragEndHandler);
            this.mainElement.querySelector('button').addEventListener('click', this.deleteProjectHandler);
        }
    }
    __decorate([
        App.Autobind
    ], ProjectItem.prototype, "dragStartHandler", null);
    __decorate([
        App.Autobind
    ], ProjectItem.prototype, "dragEndHandler", null);
    __decorate([
        App.Autobind
    ], ProjectItem.prototype, "deleteProjectHandler", null);
    App.ProjectItem = ProjectItem;
})(App || (App = {}));
var App;
(function (App) {
    class ProjectList extends App.Component {
        constructor(type) {
            super('project-list', 'app', false, `${type}-projects`);
            this.type = type;
            this.assignedProjects = [];
            this.configure();
            this.render();
        }
        renderProjects() {
            const listElement = document.getElementById(`${this.type}-projects-list`);
            listElement.innerHTML = '';
            for (const item of this.assignedProjects) {
                new App.ProjectItem(this.mainElement.querySelector('ul').id, item);
            }
        }
        dragOverHandler(event) {
            if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                const listElement = this.mainElement.querySelector('ul');
                listElement.classList.add('droppable');
            }
        }
        dropHandler(event) {
            const id = event.dataTransfer.getData('text/plain');
            App.projectState.moveProject(id, this.type === 'active' ? App.ProjectStatus.Active : App.ProjectStatus.Finished);
            const listElement = this.mainElement.querySelector('ul');
            listElement.classList.remove('droppable');
        }
        dragLeaveHandler(event) {
            const listElement = this.mainElement.querySelector('ul');
            listElement.classList.remove('droppable');
        }
        render() {
            const listId = `${this.type}-projects-list`;
            this.mainElement.querySelector('ul').id = listId;
            this.mainElement.querySelector('h2').textContent = this.type.toUpperCase() + ' PROJECTS';
        }
        configure() {
            App.projectState.addListener((projects) => {
                const filteredProject = projects.filter(proj => {
                    if (this.type === 'active') {
                        return proj.status === App.ProjectStatus.Active;
                    }
                    return proj.status === App.ProjectStatus.Finished;
                });
                this.assignedProjects = filteredProject;
                this.renderProjects();
            });
            this.mainElement.addEventListener('dragover', this.dragOverHandler);
            this.mainElement.addEventListener('dragleave', this.dragLeaveHandler);
            this.mainElement.addEventListener('drop', this.dropHandler);
        }
    }
    __decorate([
        App.Autobind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        App.Autobind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        App.Autobind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    App.ProjectList = ProjectList;
})(App || (App = {}));
var App;
(function (App) {
    const project = new App.ProjectInput();
    const activeProjectList = new App.ProjectList('active');
    const finishedProjectList = new App.ProjectList('finished');
    let debug = App.ProjectState.getInstance();
    debug.addProject('Specs, sitemap and wireframe', 'Write full specificaton document according to customer\'s requirements. Generate sitemap and wireframes.', 2);
    debug.addProject('Frontend development', 'Design UI according to spec doc. Implement website\'s frontend using React and Bootstrap', 3);
    debug.addProject('Backend development', 'Design and create MongoDB database, implement Express server', 5);
    debug.addProject('Testing', 'Test the website following the spec doc. Document bugs, issues and missing features.', 1);
})(App || (App = {}));
//# sourceMappingURL=bundle.js.map