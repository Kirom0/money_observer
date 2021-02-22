export interface IRecord {
    id: number,
    amount: number,
    title: string,
    description?: string,
    dateMills: number,
}

export function compareIRecords(a: IRecord, b: IRecord) : number {
    if (a.dateMills < b.dateMills) {
        return -1;
    }
    if (a.dateMills > b.dateMills) {
        return 1;
    }
    return 0;
}

export function areDaysEqual(a: IRecord, b : IRecord) : boolean {
    return Math.floor(a.dateMills / 1000) === (Math.floor(b.dateMills / 1000));
}
