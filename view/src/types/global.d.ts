export interface Features {
    numeric: string[],
    nonnumeric: string[],
}

export type DataType = {
    columns: string[];
    shape: number[];
    description: Record<string, Record<string, number>>;
    head: Record<string, Record<string, string | number>>;
};