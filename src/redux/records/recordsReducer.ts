import {ActTypes} from "../action.types";
import {IAppRecordsState, IAppState} from "../../interfaces/IAppState";
import {compareIRecords, IRecord} from "../../interfaces/IRecord";
import {act} from "react-dom/test-utils";

const initalState : IAppRecordsState = {
    records: [
        {
            id: 1,
            amount: 60000,
            title: 'Зарплата',
            date: "2021-02-23",
            order: 1,
        },
        {
            id: 2,
            amount: -432.12,
            title: 'Поход в магазин',
            description: 'Куриное филе, хлеб, молоко и яица',
            date: "2021-02-24",
            order: 1,
        },
        {
            id: 3,
            amount: -12990,
            title: 'Покупка телефона',
            description: 'Redmi Note 7 Pro',
            date: "2021-02-24",
            order: 2,
        },
        {
            id: 4,
            amount: 500,
            title: 'Нашёл на дороге',
            date: "2021-02-24",
            order: 3,
        },
        {
            id: 5,
            amount: -1170,
            title: 'Поел в Больших Тарелках',
            description: 'Стейк отменный',
            date: "2021-02-24",
            order: 4,
        }
    ]
}

export const recordsReducer = (state = initalState, action) => {
    switch (action.type) {
        case ActTypes.RECORD_CHANGE:
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
                records[targetIndex] = {...action.record};
            }
            return {
                ...state,
                records,
            };
        default: return state;
    }
}

function swap(records, i, j) {
    const temp = records[i];
    records[i] = records[j]
    records[j] = temp;
}
