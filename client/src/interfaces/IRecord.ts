export interface IRecord {
    id: string,
    amount: number,
    title: string,
    description?: string,
    icon: string,
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

export function emptyRecord() : IRecord {
    return {
        id: '',
        amount: 0,
        title: '',
        icon: 'shopping-basket',
        date: (new Date()).toLocaleDateString('ru-RU',
          {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric',
          }).split('.').reverse().join('-'),
        order: 1,
    }
}
