import {IRecord} from "./IRecord";

export interface IAppRecordsState {
    records?: IRecord[],
    loader: boolean,
}

export interface IAppState {
    records: IAppRecordsState,
}
