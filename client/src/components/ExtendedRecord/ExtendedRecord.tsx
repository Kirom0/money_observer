import React from 'react';
import {AmountInput} from "./AmountInput";
import {IRecord} from "../../interfaces/IRecord";
import {connect} from "react-redux";
import { changeRecord, deleteRecord } from '../../redux/records/recordsActions';
import { AppContext } from '../AppContext';

interface ILocProps {
    record: IRecord,
    saveRecord: (record : IRecord) => void,
    deleteRecord: (record : IRecord) => void,
}

interface ILocState {
    editMode: boolean,
}

class ExtendedRecord extends React.Component<ILocProps, ILocState>{
    static contextType = AppContext;
    private readonly record: IRecord;
    private readonly dateInputRef: React.RefObject<HTMLInputElement>;
    private readonly isNew: boolean;

    constructor(props: ILocProps | Readonly<ILocProps>) {
        super(props);
        this.record = {...this.props.record};
        this.isNew = !this.record.id;
        this.state = {editMode: this.isNew};
        this.dateInputRef = React.createRef<HTMLInputElement>();

        this.toggleEditMode = this.toggleEditMode.bind(this);
        this.dateInputHandler = this.dateInputHandler.bind(this);
        this.changeEventHandler = this.changeEventHandler.bind(this);
        this.edit_saveBtnHandler = this.edit_saveBtnHandler.bind(this);
        this.deleteBtnHandler = this.deleteBtnHandler.bind(this);
    }

    componentDidMount() {
        this.dateInputRef.current.value = this.record.date;
    }

    toggleEditMode() {
        this.setState((prevState) => {
            return {editMode: !prevState.editMode};
        })
    };

    changeEventHandler(propName : string, event: React.FormEvent<HTMLInputElement>) {
        this.record[propName] = event.currentTarget.value;
    }

    dateInputHandler(event: React.FormEvent<HTMLInputElement>) {
        const value = event.currentTarget.value;
        if (this.record.date !== value) {
            this.record.date = value;
        }
    }

    edit_saveBtnHandler() {
        if (this.state.editMode) {
            this.props.saveRecord({...this.record});
        }
        this.toggleEditMode();
    }

    deleteBtnHandler() {
        this.props.deleteRecord(this.record);
        this.context.modal.turnOff();
    }

    render() {
        return (
            <div className="item-info modal-content">
                <div className="content_and_buttons">
                    <div className="content">
                        <div className="logo_and_title">
                            <div className="logo">
                                <span className="material-icons">change_circle</span>
                                <img src="./img/shopping-basket.svg"/>

                            </div>
                            <div className="title">
                                <input
                                    id="title"
                                    type="text"
                                    placeholder="Заголовок операции"
                                    defaultValue={this.record.title}
                                    disabled={!this.state.editMode}
                                    onInput={this.changeEventHandler.bind(this, 'title')}
                                />
                            </div>
                        </div>
                        <div className="description">
                        <textarea
                            name="description"
                            id="description"
                            placeholder="Описание"
                            defaultValue={this.record.description}
                            disabled={!this.state.editMode}
                            onInput={this.changeEventHandler.bind(this, 'description')}
                        />
                        </div>
                    </div>
                    <div className="buttons">
                        <span
                            className={activeMaterialIconsClasses(this.state.editMode)}
                            onClick={this.edit_saveBtnHandler}
                        >{this.state.editMode ? 'save' : 'create'}</span>
                        {
                            this.isNew || (
                              <span
                                className='material-icons'
                                onClick={this.deleteBtnHandler}
                              >delete</span>
                            )
                        }
                    </div>
                </div>
                <div className="footer">
                    <div className="date">
                        <input
                            type='date'
                            ref={this.dateInputRef}
                            onInput={this.dateInputHandler}
                            disabled={!this.state.editMode}
                        />
                    </div>
                    <AmountInput
                        disabled={!this.state.editMode}
                        amount={this.record.amount}
                        saveAmount={(amount)=>{this.record.amount = amount}}
                    />
                </div>
            </div>
        );
    }
}

function activeMaterialIconsClasses(active : boolean) : string {
    return ['material-icons', active ? 'active' : ''].join(' ');
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveRecord: (record : IRecord) => dispatch(changeRecord(record)),
        deleteRecord: (record : IRecord) => dispatch(deleteRecord(record)),
    }
}

export default connect(null, mapDispatchToProps)(ExtendedRecord);
