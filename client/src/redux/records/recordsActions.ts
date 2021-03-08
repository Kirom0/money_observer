import { IRecord } from '../../interfaces/IRecord';
import { IAction } from '../../interfaces/IAction';
import { ActTypes } from '../action.types';
import { api } from '../../core/api';

export const changeRecord : (record: IRecord) => IAction = (record) => {
    return {
        type: ActTypes.RECORDS_CHANGE,
        record
    }
}

export const newRecord : (record: IRecord) => IAction = (record) => {
    return {
        type: ActTypes.RECORDS_NEW,
        record
    }
}

export const deleteRecord : (record: IRecord) => IAction = (record) => {
    return {
        type: ActTypes.RECORDS_DELETE,
        record
    }
}

export const getRecords = (from : string, to : string) => {
    return async (dispatch) => {
        dispatch(showLoader());
        try {
            const records = await api.recordsGet(from, to);
            dispatch({
                type: ActTypes.RECORDS_GET,
                payload: records,
            });
        } catch (e) {
            console.log(e.message);
            alert('Произошла ошибка при получении записей.')
        }
        dispatch(hideLoader());
    }
}


export const showLoader : () => IAction = () => {
    return {
        type: ActTypes.RECORDS_SHOW_LOADER,
    }
}

export const hideLoader : () => IAction = () => {
    return {
        type: ActTypes.RECORDS_HIDE_LOADER,
    }
}
