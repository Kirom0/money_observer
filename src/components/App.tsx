import React from 'react';
import {IRecord} from "../interfaces/IRecord";
import RecordList from "./RecordsList/RecordList";
import { AppContext } from './AppContext';

interface AppState {
    modalActive?: boolean,
    recordIndexInModal?: number,
    modalElement?: JSX.Element,
}

let records : IRecord[] = [
    {
        id: 1,
        amount: 1000,
        title: 'Выровнен баланс',
        dateMills: 20000000001,
    },
    {
        id: 2,
        amount: -120,
        title: 'Поход в магазин 1',
        description: 'Картошка, хлеб, молоко и яица',
        dateMills: 210000000000,
    },
    {
        id: 3,
        amount: -120,
        title: 'Поход в магазин 2',
        description: 'Картошка, хлеб, молоко и яица',
        dateMills: 210000000002,
    },
    {
        id: 4,
        amount: -120,
        title: 'Поход в магазин 3',
        description: 'Картошка, хлеб, молоко и яица',
        dateMills: 210000000003,
    },
    {
        id: 5,
        amount: 124,
        title: 'Поход в магазин 4',
        description: 'Картошка, хлеб, молоко и яица',
        dateMills: 210000000004,
    }
];

const AppContextValue = {
    modal: {
        active: false,
        turnOn: undefined,
        turnOff: undefined,

    },
    data: {
        records,
    }
}

class App extends React.Component<any, AppState> {
    private modalRef: React.LegacyRef<HTMLDivElement>;
    constructor(props) {
        super(props);
        //debugger;
        this.state = {
            modalActive: false,
            recordIndexInModal: 0
        } as AppState;

        this.modalRef = React.createRef();

        this.turnOnModal = this.turnOnModal.bind(this);
        this.turnOffModal = this.turnOffModal.bind(this);

        AppContextValue.modal.turnOn = (element : JSX.Element) => {
            if (element) {
                this.setState({modalActive: true, modalElement: element});
            } else {
                this.setState({modalActive: true, modalElement: null});
            }
        };
        AppContextValue.modal.turnOff = () => {
            this.setState({modalActive: false, modalElement: null});
        };
    }

    componentDidMount() {
    }

    turnOnModal(index:number) : void {
        this.setState(
            {
                modalActive: true,
                recordIndexInModal: index,
            } as AppState
        );
    }
    turnOffModal() : void {
        this.setState({modalActive: false});
    }
    render() {
        const state = this.state;
        AppContextValue.modal.active = this.state.modalActive;

        return (
            <>
                <div
                    className={['modal', !state.modalActive ? 'off' : ''].join(' ')}
                    ref={this.modalRef}
                    onClick={()=>{
                        if (state.modalElement) {
                            this.turnOffModal();
                        }
                    }}
                />
                <div className="header"><span>Money Observer</span></div>
                <AppContext.Provider value={AppContextValue}>
                    <RecordList records={AppContextValue.data.records} modalCall={this.turnOnModal}/>
                    {
                        state.modalActive && state.modalElement
                    }
                </AppContext.Provider>
            </>
        );
    }
}


export default App;
