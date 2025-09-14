import {Label} from "@/utility/interfaces/label.interface";
import {Component} from "vue";
import FieldText from "../fields/Field.vue";
import Select from "@/components/fields/fields/Select.vue";
import PreviewText from "@/components/fields/fields/PreviewText.vue";
import MultiSelectAdvanced from "@/components/fields/fields/MultiSelectAdvanced.vue";
import ColorPickerField from "@/components/fields/fields/ColorPickerField.vue";
import TextArea from "@/components/fields/fields/TextArea.vue";

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
            case 'multiSelectAdvanced':
                return MultiSelectAdvanced;
            case 'colorPicker':
                return ColorPickerField
            case 'textArea':
                return TextArea
            case 'datetime':
            default:
                return FieldText;
        }
    }
}