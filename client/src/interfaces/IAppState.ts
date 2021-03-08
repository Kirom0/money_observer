import {IRecord} from "./IRecord";

export interface IAppRecordsState {
    records?: IRecord[],
    MappedRecords: Map<string, IRecord>,
    loader: boolean,
}

export interface IAppState {
    records: IAppRecordsState,
}
