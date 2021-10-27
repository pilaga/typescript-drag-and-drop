import { ProjectInput } from "./components/project-input";
import { ProjectList } from "./components/project-list";
import { ProjectState } from "./state/project-state";


//instantiates objects
const project = new ProjectInput();
const activeProjectList = new ProjectList('active');
const finishedProjectList = new ProjectList('finished');

//debug
let debug = ProjectState.getInstance();

debug.addProject(
    'Specs, sitemap and wireframe',
    'Write full specificaton document according to customer\'s requirements. Generate sitemap and wireframes.',
    2
    );

debug.addProject(
    'Frontend development',
    'Design UI according to spec doc. Implement website\'s frontend using React and Bootstrap',
    3
    );

debug.addProject(
    'Backend development',
    'Design and create MongoDB database, implement Express server',
    5
    );

debug.addProject(
    'Testing',
    'Test the website following the spec doc. Document bugs, issues and missing features.',
    1
    );
