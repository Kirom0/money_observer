export interface IRecord {
    id: number,
    amount: number,
    title: string,
    description?: string,
    date: string,
    order: number,
}

export function compareIRecords(a: IRecord, b: IRecord) : number {
    if (a.date < b.date || (a.date === b.date && a.order < b.order)) {
        return -1;
    }
    if (a.date > b.date || (a.date === b.date && a.order > b.order)) {
        return 1;
    }
    return 0;
}
