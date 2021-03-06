import { ActTypes } from '../action.types';
import { api } from '../../core/api';
import { IRecord } from '../../interfaces/IRecord';
import { hideLoader, newRecord, showLoader } from './recordsActions';

export function recordsMiddleware({dispatch}) {
  return function(next) {
    return function(action) {
      if (action.type === ActTypes.RECORDS_CHANGE) {
        if (!action.record.id) {
          dispatch(async (_dispatch) => {
            _dispatch(showLoader())
            const record : IRecord = await api.recordsNew(action.record);
            console.log('recordsNew:', record);
            _dispatch(newRecord(record));
            _dispatch(hideLoader());
          })
          return;
        } else {
          dispatch(async () => {
            const res = await api.recordsUpdate(action.record);
            console.log('recordsUpdate:', res);
          });
        }
      }
      if (action.type === ActTypes.RECORDS_DELETE) {
        dispatch(async () => {
          const res = await api.recordsDelete(action.record);
          console.log('recordsDelete:', res);
        })
      }
      return next(action);
    }
  }
}
