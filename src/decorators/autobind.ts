namespace App {
    
    //autobind decorator
    export function Autobind(target: any, methodName: string | Symbol, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        const adjustedDescriptor: PropertyDescriptor = {
            configurable: true,
            enumerable: false,
            get() {
                const boundFunction = originalMethod.bind(this);
                return boundFunction; 
            }
        };
        return adjustedDescriptor;
    }
}