export interface Grid {
    head: (string | number)[] | null;
    body: TableBody[] | null;
    options: GridParamOptions
}

export interface TableBody {
    columns: (string | number | Action[])[];
    actions?: Actions;
}

export interface Actions {
    rowActionUrl?: string | null;
}

export interface Action {
    url: string;
    title?: string | null;
    icon?: string | null;
    method: string;
    confirm?: string;
}

export interface GridParamOptions {
    countPage: number;
    limit: number;
    page: number;
}