export class ConvertHelper {
    static convertDataTimeValue(
        fromMask: string,
        toMask: string,
        value: string
    ): string {
        const map: Record<string, string> = {
            y: "(\\d{4})",
            m: "(\\d{1,2})",
            d: "(\\d{1,2})",
            h: "(\\d{1,2})",
            i: "(\\d{1,2})",
            s: "(\\d{1,2})",
        };

        let regex = "";
        let i = 0;

        const tokens: string[] = [];

        while (i < fromMask.length) {
            const char = fromMask[i];

            if (map[char]) {
                tokens.push(char);

                while (fromMask[i + 1] === char) {
                    i++;
                }

                regex += map[char];
            } else {
                regex += char.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            }

            i++;
        }

        const match = value.match(new RegExp(`^${regex}$`));

        if (!match) {
            return value;
        }

        const values: Record<string, string> = {};

        tokens.forEach((token, index) => {
            values[token] = match[index + 1];
        });

        let result = toMask;

        Object.entries(values).forEach(([key, val]) => {
            result = result.replace(
                new RegExp(`${key}+`, "g"),
                (token) => val.padStart(token.length, "0")
            );
        });

        return result;
    }
}