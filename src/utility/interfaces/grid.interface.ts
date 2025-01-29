export interface Grid {
    head: (string | number)[] | null;
    body: TableBody[] | null;
}

export interface TableBody {
    columns: (string | number)[];
    actions?: Actions;
}

export interface Actions {
    rowActionUrl?: string | null;
    action?: Action[] | null;
}

export interface Action {
    url: string;
    title?: string | null;
    icon?: string | null;
}
