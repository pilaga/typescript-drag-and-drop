/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../models/drag-and-drop.ts" />
/// <reference path="../models/project.ts" />

namespace App {

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
}