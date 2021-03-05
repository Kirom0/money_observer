import { ActTypes } from '../action.types';

export const balanceReducer = (state = 0, action) => {
  switch (action.type) {
    case ActTypes.BALANCE_GET:
      return action.balance;
    case ActTypes.BALANCE_CHANGE:
      const { amountOld, amountNew } = action.changedRecord;
      return state + amountNew - amountOld;
  }
  return state;
}
