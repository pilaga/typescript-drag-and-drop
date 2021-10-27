export var ProjectStatus;
(function (ProjectStatus) {
    ProjectStatus[ProjectStatus["Active"] = 0] = "Active";
    ProjectStatus[ProjectStatus["Finished"] = 1] = "Finished";
})(ProjectStatus || (ProjectStatus = {}));
export class Project {
    constructor(id, title, description, team, status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.team = team;
        this.status = status;
    }
}
//# sourceMappingURL=project.js.map