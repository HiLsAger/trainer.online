import {Label} from "@/utility/interfaces/label.interface";
import {Component} from "vue";
import FieldText from "../fields/Field.vue";
import Select from "@/components/fields/fields/Select.vue";
import PreviewText from "@/components/fields/fields/PreviewText.vue";
import MultiSelectAdvanced from "@/components/fields/fields/MultiSelectAdvanced.vue";

export default class FieldFactory {
    private static instance: FieldFactory | null = null;

    public static getInstance(): FieldFactory {
        if (!FieldFactory.instance) {
            this.instance = new FieldFactory();
        }

        return this.instance as FieldFactory;
    }

    public createField(label: Label): Component | null {
        switch (label.templateType) {
            case 'text':
                return FieldText;
            case 'select':
                return Select;
            case 'previewText':
                return PreviewText;
            case 'datetime':
            case 'multiSelectAdvanced':
                return MultiSelectAdvanced;
            default:
                return null;
        }
    }
}