export interface Form {
    title?: string;
    labels: { [key: string]: Label };
    action?: string;
    method?: string;
}

export interface Label {
    title: string;
    value?: string | number | boolean;
    values?: string[] | number[]
    placeholder?: string;
    templateType: string;
    type?: string;
    required?: boolean;
    tooltip?: string;
    list?: string | object;
    max?: number;
    min?: number;
    size?: number;
    error?: string | null;
    flags?: Flags[]
}

export enum Flags {
    AS_HTML = 'as_html'
}

export interface loginLabels {
    login: Label;
    hash: Label;
}

export interface registerLabels {
    login: Label;
    hash: Label;
    name: Label;
}
