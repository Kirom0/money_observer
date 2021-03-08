import { ActTypes } from '../action.types';
import { IAction } from '../../interfaces/IAction';

export const balanceGet : (balance: number) => IAction =
  (balance) => {
  return {
    type: ActTypes.BALANCE_GET,
    balance,
  }
}

export const balanceChange : (amountOld: number, amountNew: number) => IAction =
  (amountOld, amountNew) => {
  return {
    type: ActTypes.BALANCE_CHANGE,
    changedRecord: {
      amountOld,
      amountNew,
    }
  }
}
