import { ActTypes } from '../action.types';
import { balanceChange } from './balanceActions';

export function balanceMiddleware(store) {
  return function(next){
    return function(action) {
      if (action.type === ActTypes.RECORDS_CHANGE) {
        const { MappedRecords } = store.getState().records;
        const oldRecord =
          MappedRecords.has(action.record.id) ?
            MappedRecords.get(action.record.id) : {amount: 0};
        const [amountOld, amountNew] = [oldRecord.amount, action.record.amount];
        if (amountOld !== amountNew) {
          store.dispatch(balanceChange(amountOld, amountNew));
        }
      } else
      if (action.type === ActTypes.RECORDS_NEW) {
        store.dispatch(balanceChange(0, action.record.amount));
      }
      next(action);
    }
  }
}
