"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
class ProjectList {
    constructor(type) {
        this.type = type;
        this.templateElement = document.getElementById('project-list');
        this.appElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.mainElement = importedNode.firstElementChild;
        this.mainElement.id = `${this.type}-projects`;
        this.attach();
        this.render();
    }
    render() {
        const listId = `${this.type}-projects-list`;
        this.mainElement.querySelector('ul').id = listId;
        this.mainElement.querySelector('h2').textContent = this.type.toUpperCase() + ' PROJECTS';
    }
    attach() {
        this.appElement.insertAdjacentElement('beforeend', this.mainElement);
    }
}
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById('project-input');
        this.appElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.mainElement = importedNode.firstElementChild;
        this.mainElement.id = 'user-input';
        this.titleInputElement = this.mainElement.querySelector('#title');
        this.descInputElement = this.mainElement.querySelector('#description');
        this.teamInputElement = this.mainElement.querySelector('#people');
        this.configure();
        this.attach();
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
        if (!validateUserInput(titleValidatable) ||
            !validateUserInput(descValidatable) ||
            !validateUserInput(teamValidatable)) {
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
            const [title, desc, people] = userInput;
            console.log(title, desc, people);
        }
        this.clearUserInput();
    }
    configure() {
        this.mainElement.addEventListener('submit', this.submitHandler);
    }
    attach() {
        this.appElement.insertAdjacentElement('afterbegin', this.mainElement);
    }
}
__decorate([
    Autobind
], ProjectInput.prototype, "submitHandler", null);
const project = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');
//# sourceMappingURL=app.js.map