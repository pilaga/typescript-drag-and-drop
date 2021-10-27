import { Project, ProjectStatus } from "../models/project.js";

//Listener type is a function that receives an array of projects
type Listener<T> = (items: T[]) => void; 

//base State class
class State<T> {
    protected listeners: Listener<T>[] = [];
    addListener(listernerFunction: Listener<T>) {
        this.listeners.push(listernerFunction);
    }
}

//project state management class
export class ProjectState extends State<Project> {    
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

    deleteProject(id: string) {
        this.projects.splice(this.projects.findIndex(item => item.id === id), 1);
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

export const projectState = ProjectState.getInstance();
