import {ActTypes} from "../action.types";
import {IAppRecordsState, IAppState} from "../../interfaces/IAppState";
import {compareIRecords} from "../../interfaces/IRecord";

const initalState : IAppRecordsState = {
    records: [
        {
            id: 1,
            amount: 60000,
            title: 'Зарплата',
            dateMills: 20000000001,
        },
        {
            id: 2,
            amount: -432.12,
            title: 'Поход в магазин',
            description: 'Куриное филе, хлеб, молоко и яица',
            dateMills: 210000000001,
        },
        {
            id: 3,
            amount: -12990,
            title: 'Покупка телефона',
            description: 'Redmi Note 7 Pro',
            dateMills: 210000000002,
        },
        {
            id: 4,
            amount: 500,
            title: 'Нашёл на дороге',
            dateMills: 210000000003,
        },
        {
            id: 5,
            amount: -1170,
            title: 'Поел в Больших Тарелках',
            description: 'Стейк отменный',
            dateMills: 210000000004,
        }
    ]
}

export const recordsReducer = (state = initalState, action) => {
    switch (action.type) {
        case ActTypes.RECORD_CHANGE:
            const records = [];
            let target;
            for (let i = 0; i < state.records.length; i++) {
                if (state.records[i].id === action.record.id) {
                    target = i;
                }
                records.push(state.records[i]);
            }
            debugger;
            const needSort = records[target].dateMills !== action.record.dateMills;
            records[target] = action.record;
            const _state = {
                ...state,
                records,
            };
            if (needSort) {
                _state.records.sort(compareIRecords);
            }
            return _state;
        default: return state;
    }
}
