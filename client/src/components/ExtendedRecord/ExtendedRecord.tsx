import React from 'react';
import {AmountInput} from "./AmountInput";
import {IRecord} from "../../interfaces/IRecord";
import {connect} from "react-redux";
import {changeRecord} from "../../redux/records/recordsActions";

interface ILocProps {
    record: IRecord,
    saveRecord: (record : IRecord) => void,
}

interface ILocState {
    editMode: boolean,
}

class ExtendedRecord extends React.Component<ILocProps, ILocState>{
    private readonly record: IRecord;
    private readonly dateInputRef: React.RefObject<HTMLInputElement>;
    private needToSaveRecord: boolean;

    constructor(props: ILocProps | Readonly<ILocProps>) {
        super(props);
        //this.record = JSON.parse(JSON.stringify(props.record));
        this.record = {...this.props.record};
        this.state = {editMode: false};
        this.dateInputRef = React.createRef<HTMLInputElement>();
        this.needToSaveRecord = false;

        this.toggleEditMode = this.toggleEditMode.bind(this);
        this.dateInputHandler = this.dateInputHandler.bind(this);
        this.changeEventHandler = this.changeEventHandler.bind(this);
    }

    componentDidMount() {
        console.log(this.dateInputRef.current.value, this.record.date);
        this.dateInputRef.current.value = this.record.date;
    }

    toggleEditMode() {
        this.setState((prevState) => {
            if (prevState.editMode) {
                this.needToSaveRecord = true;
            }
            return {editMode: !prevState.editMode};
        })
    };

    componentDidUpdate() {
        if (this.needToSaveRecord) {
            this.props.saveRecord({...this.record});
            this.needToSaveRecord = false;
        }
    }

    changeEventHandler(propName : string, event: React.FormEvent<HTMLInputElement>) {
        this.record[propName] = event.currentTarget.value;
    }

    dateInputHandler(event: React.FormEvent<HTMLInputElement>) {
        const value = event.currentTarget.value;
        if (this.record.date !== value) {
            this.record.date = value;
        }
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
                        onClick={this.toggleEditMode}
                    >{this.state.editMode ? 'save' : 'create'}</span>
                        <span className='material-icons'>delete</span>
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
    }
}

export default connect(null, mapDispatchToProps)(ExtendedRecord);
