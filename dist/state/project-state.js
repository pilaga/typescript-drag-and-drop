import { Project, ProjectStatus } from "../models/project.js";
class State {
    constructor() {
        this.listeners = [];
    }
    addListener(listernerFunction) {
        this.listeners.push(listernerFunction);
    }
}
export class ProjectState extends State {
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
        const newProject = new Project(id, title, description, team, ProjectStatus.Active);
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
export const projectState = ProjectState.getInstance();
//# sourceMappingURL=project-state.js.map