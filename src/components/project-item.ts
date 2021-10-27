import { Draggable } from '../models/drag-and-drop';
import { Project } from '../models/project';
import Component from './base-component';
import { Autobind } from '../decorators/autobind';
import { projectState } from '../state/project-state';


//project item class
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
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

    @Autobind
    deleteProjectHandler(event: Event) {
        projectState.deleteProject(this.project.id);
    }

    configure() {
        this.mainElement.addEventListener('dragstart', this.dragStartHandler);
        this.mainElement.addEventListener('dragend', this.dragEndHandler);

        //delete button
        this.mainElement.querySelector('button')!.addEventListener('click', this.deleteProjectHandler);
    }
}
