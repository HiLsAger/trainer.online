import {Label} from "@/utility/interfaces/label.interface";

export default class Validator {

    public isValid: boolean = false;

    protected labels: { [key: string]: Label } = {};

    public validate(labels: { [key: string]: Label }): { [key: string]: Label } {
        this.isValid = true;

        this.labels = labels;

        Object.keys(this.labels).forEach(key => {
            this.labels[key].error = null;
            if (!this.validateRequiredField(key)) {
                this.labels[key].error = `Значение в поле "${this.labels[key].title}" не может быть пустым`;
                this.isValid = false;
            }
        });

        return this.labels;
    }

    protected validateRequiredField(key: string): boolean {
        const label = this.labels[key];
        return !label.required || !!label.value;
    }
}