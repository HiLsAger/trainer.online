import {Vue} from "vue-class-component";
import {Label} from "@/utility/interfaces/label.interface";

export default class BaseField extends Vue {
    label!: Label;

    public handleInput(event: Event): void {
        const inputElement = event.target as HTMLInputElement;

        this.$emit("handleInput", inputElement.value);
    }

    protected triggerInitialInput(): void {
        if (this.label?.value === undefined) {
            return;
        }

        const fakeEvent = {
            target: {
                value: this.label.value
            }
        } as unknown as Event;

        this.handleInput(fakeEvent);
    }

    public mounted() {
        this.triggerInitialInput()
    }
}