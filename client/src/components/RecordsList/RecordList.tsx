import React from 'react';
import {IRecord} from "../../interfaces/IRecord";
import RecordsGroup from "./RecordsGroup";
import {AppContext} from "../AppContext";
import {connect} from "react-redux";
import {IAppState} from "../../interfaces/IAppState";
import { getRecords } from '../../redux/records/recordsActions';
import Loader from '../singleComponents/Loader';

interface RecordListProps {
    records: IRecord[],
    loader: boolean,
    getMoreRecords: any,
}

class RecordList extends React.PureComponent<RecordListProps, any> {
    static contextType = AppContext;
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.getMoreRecords('1970.01.01', '2099.12.31');
    }

    render() {
        if (this.props.loader) {
            return <Loader/>;
        }
        const {records} = this.props;
        if (records.length === 0) {
            return (
              <div className='item-list' style={{marginTop: '1em'}}>
                  У вас пока нет ни одной записи.
              </div>
            )
        }
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
        loader: records.loader,
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        getMoreRecords: (from, to) => dispatch(getRecords(from ,to)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RecordList);

