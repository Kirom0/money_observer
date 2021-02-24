import {IRecord} from "./IRecord";

export interface IAppRecordsState {
    records?: IRecord[],
}

export interface IAppState {
    records: IAppRecordsState,
}
