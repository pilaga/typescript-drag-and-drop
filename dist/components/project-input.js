var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from "./base-component.js";
import * as Validation from "../utils/form-validation.js";
import { Autobind as AutoBind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";
export class ProjectInput extends Component {
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
        if (!Validation.validateUserInput(titleValidatable) ||
            !Validation.validateUserInput(descValidatable) ||
            !Validation.validateUserInput(teamValidatable)) {
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
            projectState.addProject(title, desc, team);
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
    AutoBind
], ProjectInput.prototype, "submitHandler", null);
//# sourceMappingURL=project-input.js.map