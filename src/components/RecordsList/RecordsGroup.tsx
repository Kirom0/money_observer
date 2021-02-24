import React from 'react';
import {IRecord} from "../../interfaces/IRecord";
import {Record} from "./Record";
import {AppContext} from "../AppContext";
import {getRecordsOrderChanger, IRecordsOrderChanger} from "./RecordsOrderChange";
import {connect} from "react-redux";
import {changeRecord} from "../../redux/records/recordsActions";

interface RecordsGroupProps {
    records : IRecord[],
    offset: number,
    count: number,
    changeOrder: (record : IRecord, order : number) => void,
}

interface RecordsGroupState {
    editOrderMode? : boolean,
    editingTarget? : number,
}

class RecordsGroup extends React.PureComponent<RecordsGroupProps, RecordsGroupState> {
    static contextType = AppContext;
    private recordsRef: any[];
    private orderChanger: IRecordsOrderChanger;
    constructor(props) {
        super(props);
        this.state = {editOrderMode: false};
        this.recordsRef = [];
        this.turnEditOrderModeOn = this.turnEditOrderModeOn.bind(this);
        this.turnEditOrderModeOff = this.turnEditOrderModeOff.bind(this);
        this.mouseMoveHandler = this.mouseMoveHandler.bind(this);
        this.touchMoveHandler = this.touchMoveHandler.bind(this);
    }

    turnEditOrderModeOn(index: number) {
        this.setState({editOrderMode: true, editingTarget: index});
        this.context.modal.turnOn();
        this.orderChanger = getRecordsOrderChanger();
        this.orderChanger.start(index - this.props.offset, this.recordsRef.map((ref) => ref.current));
    }

    turnEditOrderModeOff() {
        const newIndex = this.orderChanger.finish() + this.props.offset;
        const targetIndex = this.state.editingTarget;
        {
            const {records, changeOrder} = this.props;

            for (let i = targetIndex + 1; i <= newIndex; i++) {
                changeOrder(records[i], records[i - 1].dateMills);
            }
            for (let i = targetIndex - 1; i >= newIndex; i--) {
                changeOrder(records[i], records[i + 1].dateMills);
            }
            changeOrder(records[targetIndex], records[newIndex].dateMills);
        }

        this.setState({editOrderMode: false});
        this.context.modal.turnOff();
    }

    mouseMoveHandler(event : React.MouseEvent<HTMLDivElement, MouseEvent>) {
        this.orderChanger.setNewY(event.clientY);
    }

    touchMoveHandler(event) {
        this.orderChanger.setNewY(event.touches[0].clientY);
    }

    render() {
        const {records, offset, count} = this.props;
        const Records : JSX.Element[] = [];
        while (count > this.recordsRef.length) {
            this.recordsRef.push(React.createRef());
        }
        for (let i = offset; i < offset + count; i++) {
            Records.push(
                <Record
                    record={records[i]}
                    editOrder={this.turnEditOrderModeOn}
                    index={i}
                    key={records[i].id}
                    forbidAnyEvents={this.state.editOrderMode}
                    returnRef={(ref) => {this.recordsRef[i - offset] = ref}}
                />
            )
        }
        const {editOrderMode} = this.state;
        return (
            <div
                className={['group', editOrderMode ? 'modal-like' : ''].join(' ')}
                onMouseMove={!editOrderMode ? null : this.mouseMoveHandler}
                onTouchMove={!editOrderMode ? null : this.touchMoveHandler}
                onClick={!editOrderMode ? null : this.turnEditOrderModeOff}
                onTouchEnd={!editOrderMode ? null : this.turnEditOrderModeOff}
            >
                <div className="date">
                    <span>{getDate(this.props.records[offset].dateMills)}</span>
                </div>
                <div
                    className="items"
                    style={!editOrderMode ? {} : {touchAction: 'none'}}
                >{Records}</div>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        changeOrder : (record, order) => dispatch(changeRecord({...record, dateMills: order})),
    }
}

export default connect(null, mapDispatchToProps)(RecordsGroup);

function getDate(mills: number): string {
    return (new Date(mills)).toLocaleDateString('ru-RU',
        {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
}
