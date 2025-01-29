import {Label} from "@/utility/interfaces/label.interface";

export default class Validator {

    protected labels: { [key: string]: Label };

    protected errors: ValidationError[] = [];


    public constructor(labels: { [key: string]: Label }) {
        this.labels = labels;
    }

    public validate(formData: Record<string, string>): boolean {
        this.errors = [];

        if (!this.labels) {
            return true;
        }

        Object.keys(this.labels).forEach(key => {
            if (this.validateRequiredField(formData, key))
                this.errors.push({
                    property: key,
                    message: `Значение в поле "${this.labels[key].title}" не может быть пустым`
                })
        });

        return !this.errors;
    }

    protected validateRequiredField(formData: Record<string, string>, key: string): boolean {
        const label = this.labels[key];
        return !label.required || formData.hasOwnProperty(key) && !!formData[key];
    }
}