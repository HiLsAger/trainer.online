interface IField {
    validateMessage: string;

    validate(element: HTMLInputElement): boolean;

    handleInput(event: Event): void;

    enterValidateMessage(message: string): void
}