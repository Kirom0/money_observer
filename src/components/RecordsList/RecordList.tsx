import React from 'react';
import {areDaysEqual, IRecord} from "../../interfaces/IRecord";
import {RecordsGroup} from "./RecordsGroup";
import {AppContext} from "../AppContext";

interface RecordListProps {
    records: IRecord[],
    modalCall: (index: number) => void,
}

class RecordList extends React.PureComponent<RecordListProps, any> {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        //debugger;
    }

    render() {
        const {records} = this.props;
        const groups : Array<[number, number]> = [[0, 1]];
        {
            let d = 0;
            for (let i = 1; i < records.length; i++) {
                if (areDaysEqual(records[i], records[i - 1])) {
                    groups[d][1] += 1;
                } else {
                    d += 1;
                    groups.push([i, 1]);
                }
            }
        }
        return (
            <div className='item-list'>
                {
                    groups.map((group) =>
                        <RecordsGroup
                            records={records}
                            offset={group[0]}
                            count={group[1]}
                            modalCall={this.props.modalCall}
                            key={`${group[0]}-${group[1]}`}
                        />)
                }
            </div>
        );
    }
}

export default RecordList;
