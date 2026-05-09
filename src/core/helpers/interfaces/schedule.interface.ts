export interface ScheduleInterface {
    schedule_rule_id: number | null;
    time: string;
    duration: number;
    trainer_name: string;
    training_name: string;
    style: {
        color?: string;
        background_color?: string;
        font_size?: string;
        css?: string;
    };
    price: number;
}
