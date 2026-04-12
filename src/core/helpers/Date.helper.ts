export default class DateHelper {
    protected static readonly DaysOfWeek: Record<number, string> = {
        1: "ПН",
        2: "ВТ",
        3: "СР",
        4: "ЧТ",
        5: "ПТ",
        6: "СБ",
        7: "ВС",
    }

    public static getDayOfWeekCodeByDate(date: string): number | null {
        try {
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                return null;
            }

            const day = dateObj.getDay();
            return day === 0 ? 7 : day;
        } catch (error) {
            return null;
        }
    }

    public static getDayOfWeekByDate(date: string): string {
        const dayCode = this.getDayOfWeekCodeByDate(date);
        if (dayCode === null) {
            return "";
        }
        return this.DaysOfWeek[dayCode] || "";
    }

    /**
     * Определяет начало недели по любой дате
     */
    public static getStartDayOfWeekDateByDate(date: string): string {
        try {
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                return "";
            }

            const dayOfWeek = dateObj.getDay();

            const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

            const monday = new Date(dateObj);
            monday.setDate(dateObj.getDate() + diff);

            return monday.toISOString().split('T')[0];
        } catch (error) {
            return "";
        }
    }
}
