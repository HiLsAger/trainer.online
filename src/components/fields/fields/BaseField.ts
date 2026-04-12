import {Vue} from "vue-class-component";
import {Label} from "@/utility/interfaces/label.interface";

export default class BaseField extends Vue {
    label!: Label;
    alias!: string;
    name!: string;

    public get labelValue(): any {
        if (!this.label.value) {
            return undefined;
        }

        if (this.label.value === "@COOKIE") {
            this.label.value = this.$cookies.get(this.cookieValue)
        }

        return this.label.value;
    }

    protected get cookieValue(): string {
        return `${this.alias}.${this.name.toLowerCase()}`
    }

    public handleInput(event: Event): void {
        const inputElement = event.target as HTMLInputElement;

        this.$emit("handleInput", inputElement.value);
    }

    protected triggerInitialInput(): void {
        if (this.labelValue === undefined) {
            return;
        }

        const fakeEvent = {
            target: {
                value: this.labelValue
            }
        } as unknown as Event;

        this.handleInput(fakeEvent);
    }

    public mounted() {
        this.triggerInitialInput()
    }
}