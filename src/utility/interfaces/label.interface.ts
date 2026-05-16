export interface Form {
    alias?: string;
    title?: string;
    labels: { [key: string]: Label };
    action?: string;
    method?: string;
}

export interface Label {
    title: string | null;
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
    flags?: Flags[];
    options?: Options;
    hidden?: boolean
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

export interface Options {
    mask?: string;
    startStep?: string;
    convert?: string
}