/// <reference path="models/drag-and-drop.ts" />
/// <reference path="models/project.ts" />
/// <reference path="state/project-state.ts" />
/// <reference path="utils/form-validation.ts" />
/// <reference path="decorators/autobind.ts" />
/// <reference path="components/base-component.ts" />
/// <reference path="components/project-input.ts" />
/// <reference path="components/project-item.ts" />
/// <reference path="components/project-list.ts" />

namespace App {

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
}