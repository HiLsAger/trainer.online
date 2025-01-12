import { Label } from "@/utility/interfaces/label.interface";
import { Component, defineComponent } from "vue";
import FieldText from "../fields/Field.vue";

export default class FieldFactory {
    private static instance: FieldFactory|null = null;

    public static getInstance(): FieldFactory {
        if(!FieldFactory.instance) {
            this.instance = new FieldFactory();
        }

        return this.instance as FieldFactory;
    }
    
    public createField(label: Label): Component|null{
        switch(label.templateType) {
            case 'text':
                return FieldText;
            case 'datetime':
                return null;
            default:
                return null;
        }
    }
}