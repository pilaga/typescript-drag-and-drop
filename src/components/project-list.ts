import { Project, ProjectStatus } from "../models/project.js";
import { DragTarget } from "../models/drag-and-drop.js";
import { ProjectItem } from "./project-item.js";
import Component from "./base-component.js";
import { Autobind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";


//project list class
export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget {
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
