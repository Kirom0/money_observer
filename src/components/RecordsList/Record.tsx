import React from 'react';
import {compareIRecords, IRecord} from "../../interfaces/IRecord";
import ExtendedRecord from "../ExtendedRecord/ExtendedRecord";
import {AppContext} from "../AppContext";

interface RecordProps {
    record: IRecord,
    index:number,
    editOrder: (index:number) => void,
    forbidAnyEvents: boolean,
    returnRef: (any) => void,
}

export class Record extends React.PureComponent<RecordProps> {
    static contextType = AppContext;
    private rootRef: React.LegacyRef<HTMLDivElement>;
    constructor(props) {
        super(props);
        this.rootRef = React.createRef();
    }

    componentDidMount() {
        this.props.returnRef(this.rootRef);
    }

    componentDidUpdate() {
        this.props.returnRef(this.rootRef);
    }

    render() {
        const record = this.props.record;
        const onClick = //this.props.onClick;
            (event) => {
                event.stopPropagation();
                this.context.modal.turnOn((
                    <ExtendedRecord
                        record={record}
                        saveRecord={(newRecord)=>{
                            const data = this.context.data;
                            data.records = [...data.records];
                            data.records[this.props.index] = newRecord;
                            data.records.sort(compareIRecords);
                        }}
                        closeCB={() => {
                            this.context.modal.turnOff();
                        }}
                    />
                ));
            }

        return (
            <div
                className='item'
                onClick={(!this.props.forbidAnyEvents === true ? true : null) && onClick}
                ref={this.rootRef}
            >
                <img className="record-logo" src="img/shopping-basket.svg"/>
                <div className="content">
                    <span className="title">{record.title}</span>
                    {record.description && (<p className="description">{record.description}</p>)}

                </div>
                <div className="side">
                    <span className={amountClassNames(record.amount)}>{formatAmount(record.amount)}</span>
                    <span
                        className="material-icons"
                        onMouseDown={(event)=>
                            {
                                event.stopPropagation();
                                this.props.editOrder(this.props.index);
                            }
                        }
                        onTouchStart={(event) =>
                            {
                                event.stopPropagation();
                                this.props.editOrder(this.props.index);
                            }
                        }
                    >drag_handle</span>
                </div>
            </div>
        );
    }
}


export function formatAmount(amount : number) : string {
    return (amount >= 0) ? `+${amount}₽` : `${amount}₽`;
}

export function amountClassNames(amount : number) : string {
    return ['amount', amount >= 0 ? "coming" : "cost"].join(' ');
}
