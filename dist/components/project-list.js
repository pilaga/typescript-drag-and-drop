var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { ProjectStatus } from "../models/project.js";
import { ProjectItem } from "./project-item.js";
import Component from "./base-component.js";
import { Autobind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";
export class ProjectList extends Component {
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
            new ProjectItem(this.mainElement.querySelector('ul').id, item);
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
        projectState.moveProject(id, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
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
        projectState.addListener((projects) => {
            const filteredProject = projects.filter(proj => {
                if (this.type === 'active') {
                    return proj.status === ProjectStatus.Active;
                }
                return proj.status === ProjectStatus.Finished;
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
    Autobind
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    Autobind
], ProjectList.prototype, "dropHandler", null);
__decorate([
    Autobind
], ProjectList.prototype, "dragLeaveHandler", null);
//# sourceMappingURL=project-list.js.map