// Drag and Drop interfaces
export interface Draggable { //ProjectItem objects are draggable
    dragStartHandler(event: DragEvent): void;
    dragEndHandler(event: DragEvent): void;
}

export interface DragTarget { //ProjectList objects are drag targets
    dragOverHandler(event: DragEvent): void;
    dropHandler(event: DragEvent): void;
    dragLeaveHandler(event: DragEvent): void;
}
