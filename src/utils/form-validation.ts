namespace App {

    //Validatable interface
    export interface Validatable {
        value: string | number;
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        minValue?: number;
        maxValue?: number;
    }
    
    //user input validation
    export function validateUserInput(validatableInput: Validatable) {
        let isValid = true;
        if(validatableInput.required) {
            isValid = isValid && validatableInput.value.toString().trim().length !== 0;
        }
        if(validatableInput.minLength != null && typeof validatableInput.value === 'string') {
            isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
        }
        if(validatableInput.maxLength != null && typeof validatableInput.value === 'string') {
            isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
        }
        if(validatableInput.minValue != null && typeof validatableInput.value === 'number') {
            isValid = isValid && validatableInput.value >= validatableInput.minValue;
        }
        if(validatableInput.maxValue != null && typeof validatableInput.value === 'number') {
            isValid = isValid && validatableInput.value <= validatableInput.maxValue;
        }
        return isValid;
    }
}