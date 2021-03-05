import {ActTypes} from "../action.types";
import {IAppRecordsState} from "../../interfaces/IAppState";
import {compareIRecords, IRecord} from "../../interfaces/IRecord";

const initalState : IAppRecordsState = {
    records: [],
    MappedRecords: new Map<string, IRecord>(),
    loader: true,
    /*records: [
        {
            id: 1,
            amount: 60000,
            title: 'Зарплата',
            date: "2021.02.23",
            order: 1,
        },
        {
            id: 2,
            amount: -432.12,
            title: 'Поход в магазин',
            description: 'Куриное филе, хлеб, молоко и яица',
            date: "2021.02.24",
            order: 1,
        },
        {
            id: 3,
            amount: -12990,
            title: 'Покупка телефона',
            description: 'Redmi Note 7 Pro',
            date: "2021.02.24",
            order: 2,
        },
        {
            id: 4,
            amount: 500,
            title: 'Нашёл на дороге',
            date: "2021.02.24",
            order: 3,
        },
        {
            id: 5,
            amount: -1170,
            title: 'Поел в Больших Тарелках',
            description: 'Стейк отменный',
            date: "2021.02.24",
            order: 4,
        }
    ]*/
}

export const getRecordsReducer = () => {
    const MappedRecords = new Map<string, IRecord>();
    const records_change = (state, action) => {
        const records : IRecord[] = [];
        let targetIndex;
        for (let i = 0; i < state.records.length; i++) {
            if (state.records[i].id === action.record.id) {
                targetIndex = i;
            }
            records.push(state.records[i]);
        }

        //if 'date' was changed
        if (records[targetIndex].date !== action.record.date) {
            const target = {...action.record};
            MappedRecords.set(target.id, target);
            target.order = 0;
            let i = targetIndex;
            while (i + 1 < records.length &&
            records[i].date === records[i + 1].date) {
                records[i + 1].order -= 1;
                swap(records, i, i + 1);
                i++;
            }
            records[i] = target;
            records.sort(compareIRecords);

            i = 0;
            while (records[i].id !== target.id) {
                i++;
            }

            while (i + 1 < records.length &&
            records[i + 1].date === records[i].date &&
            records[i + 1].order - records[i].order === 1) {
                records[i].order = records[i + 1].order;
                swap(records, i, i + 1);
                i++;
            }
            target.order += 1;

        } else //if 'order' was changed
        if (records[targetIndex].order !== action.record.order) {
            while (records[targetIndex].order < action.record.order) {
                records[targetIndex].order += 1;
                records[targetIndex + 1].order -= 1;
                swap(records, targetIndex, targetIndex + 1);
                targetIndex += 1;
            }
            while (records[targetIndex].order > action.record.order) {
                records[targetIndex].order -= 1;
                records[targetIndex - 1].order += 1;
                swap(records, targetIndex, targetIndex - 1);
                targetIndex -= 1;
            }
        } else {
            const record = {...action.record};
            records[targetIndex] = record;
            MappedRecords.set(record.id, records[targetIndex]);
        }
        return {
            ...state,
            records,
        };
    }
    const records_get = (state, action) => {
        const records = [...state.records];
        action.payload.forEach((record) => {
            if (!MappedRecords.has(record.id)) {
                records.push(record);
                MappedRecords.set(record.id, record);
            }
        });
        records.sort(compareIRecords);
        return {...state, records};
    }
    const records_new = (state, action) => {
        const records = [...state.records];
        records.push(action.record);
        records.sort(compareIRecords);
        MappedRecords.set(action.record.id, action.record);
        return {...state, records}
    }
    return (state = {...initalState, MappedRecords}, action) => {
        switch (action.type) {
            case ActTypes.RECORDS_CHANGE:
                return records_change(state, action);
            case ActTypes.RECORDS_GET:
                return records_get(state, action);
            case ActTypes.RECORDS_NEW:
                return records_new(state, action);
            case ActTypes.RECORDS_SHOW_LOADER:
                return {...state, loader: true};
            case ActTypes.RECORDS_HIDE_LOADER:
                return {...state, loader: false};
            default: return state;
        }
    }
}

function swap(records, i, j) {
    const temp = records[i];
    records[i] = records[j]
    records[j] = temp;
}
