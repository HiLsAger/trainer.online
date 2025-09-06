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
    error?: string | null
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
