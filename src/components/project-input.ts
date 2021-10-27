/// <reference path="base-component.ts" />
/// <reference path="../decorators/autobind.ts" />
/// <reference path="../utils/form-validation.ts" />
/// <reference path="../state/project-state.ts" />

namespace App {

    //project input class
    export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {  
        titleInputElement: HTMLInputElement;
        descInputElement: HTMLInputElement;
        teamInputElement: HTMLInputElement;    

        constructor() {
            super('project-input', 'app', true, 'user-input');

            //grab form input
            this.titleInputElement = this.mainElement.querySelector('#title')! as HTMLInputElement;
            this.descInputElement = this.mainElement.querySelector('#description')! as HTMLInputElement;
            this.teamInputElement = this.mainElement.querySelector('#people')! as HTMLInputElement;

            this.configure();
        }

        private fetchUserInput(): [string, string, number] | void {
            const inputTitle = this.titleInputElement.value;
            const inputDesc = this.descInputElement.value;
            const inputTeam = this.teamInputElement.value;

            const titleValidatable: Validatable = {
                value: inputTitle,
                required: true
            }
            const descValidatable: Validatable = {
                value: inputDesc,
                required: true,
                minLength: 5
            }
            const teamValidatable: Validatable = {
                value: +inputTeam,
                required: true,
                minValue: 1,
                maxValue: 5
            }

            //check input
            if(
                !validateUserInput(titleValidatable) ||
                !validateUserInput(descValidatable) ||
                !validateUserInput(teamValidatable)) {
                    console.log('error, please check input')
                    return;
            } else {
                return [inputTitle, inputDesc, +inputTeam];
            }
        }

        private clearUserInput() {
            this.titleInputElement.value = "";
            this.descInputElement.value = "";
            this.teamInputElement.value = "";
        }

        @Autobind
        private submitHandler(event: Event) {
            event.preventDefault();
            const userInput = this.fetchUserInput();
            if(Array.isArray(userInput)) {
                const [title, desc, team] = userInput;

                projectState.addProject(title, desc, team);
                console.log(title, desc, team);
                this.clearUserInput();
            }       
        }

        configure() {
            //submit handler
            this.mainElement.addEventListener('submit', this.submitHandler);        
        }

        render() {}
    }
}