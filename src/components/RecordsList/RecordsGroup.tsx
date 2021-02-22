import React from 'react';
import {IRecord} from "../../interfaces/IRecord";
import {Record} from "./Record";
import {AppContext} from "../AppContext";
import {getRecordsOrderChanger, IRecordsOrderChanger} from "./RecordsOrderChange";

interface RecordsGroupProps {
    records : IRecord[],
    offset: number,
    count: number,
    modalCall: (index: number) => void,
}

interface RecordsGroupState {
    editOrderMode? : boolean,
    editingTarget? : number,
}

export class RecordsGroup extends React.PureComponent<RecordsGroupProps, RecordsGroupState> {
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
            const data = this.context.data;
            const beginTime = data.records[this.props.offset].dateMills;
            data.records = [...data.records];
            const targetRecord = data.records[targetIndex];
            if (targetIndex < newIndex) {
                for (let i = targetIndex; i < newIndex; i++) {
                    data.records[i] = data.records[i + 1];
                }
            } else {
                for (let i = targetIndex; i > newIndex; i--) {
                    data.records[i] = data.records[i - 1];
                }
            }
            data.records[newIndex] = targetRecord;
            for (let i = this.props.offset; i < this.props.offset + this.props.count; i++) {
                data.records[i].dateMills = beginTime + i - this.props.offset;
            }
        }
        console.log(newIndex);

        this.setState({editOrderMode: false});
        this.context.modal.turnOff();
    }

    mouseMoveHandler(event : React.MouseEvent<HTMLDivElement, MouseEvent>) {
        //console.log('mouseMove client', event.clientX, event.clientY, 'page:', event.pageX, event.pageY, 'screen:', event.screenX, event.screenY);
        this.orderChanger.setNewY(event.clientY);
    }

    touchMoveHandler(event) {
        //console.log(event.touches[0].clientY);
        this.orderChanger.setNewY(event.touches[0].clientY);
    }

    render() {
        //debugger;
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

function getDate(mills: number): string {
    return (new Date(mills)).toLocaleDateString('ru-RU',
        {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        })
}
