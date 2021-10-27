var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import Component from './base-component.js';
import { Autobind } from '../decorators/autobind.js';
import { projectState } from '../state/project-state.js';
export class ProjectItem extends Component {
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
        projectState.deleteProject(this.project.id);
    }
    configure() {
        this.mainElement.addEventListener('dragstart', this.dragStartHandler);
        this.mainElement.addEventListener('dragend', this.dragEndHandler);
        this.mainElement.querySelector('button').addEventListener('click', this.deleteProjectHandler);
    }
}
__decorate([
    Autobind
], ProjectItem.prototype, "dragStartHandler", null);
__decorate([
    Autobind
], ProjectItem.prototype, "dragEndHandler", null);
__decorate([
    Autobind
], ProjectItem.prototype, "deleteProjectHandler", null);
//# sourceMappingURL=project-item.js.map