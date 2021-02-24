import React from 'react';
import {IRecord} from "../../interfaces/IRecord";
import RecordsGroup from "./RecordsGroup";
import {AppContext} from "../AppContext";
import {connect} from "react-redux";
import {IAppState} from "../../interfaces/IAppState";

interface RecordListProps {
    records: IRecord[],
}

class RecordList extends React.PureComponent<RecordListProps, any> {
    static contextType = AppContext;
    constructor(props) {
        super(props);
    }

    render() {
        const {records} = this.props;
        const groups : Array<[number, number]> = [[0, 1]];
        {
            let d = 0;
            for (let i = 1; i < records.length; i++) {
                if (records[i].date === records[i - 1].date) {
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
                            key={`${group[0]}-${group[1]}`}
                        />)
                }
            </div>
        );
    }
}

const mapStateToProps = ({records} : IAppState) => {
    return {
        records: records.records,
    };
}

export default connect(mapStateToProps, null)(RecordList);

