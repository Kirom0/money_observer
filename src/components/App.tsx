import React from 'react';
import RecordList from "./RecordsList/RecordList";
import { AppContext } from './AppContext';

interface AppState {
    modalActive?: boolean,
    modalElement?: JSX.Element,
}

const AppContextValue = {
    modal: {
        active: false,
        turnOn: undefined,
        turnOff: undefined,
    }
}

class App extends React.Component<any, AppState> {
    private modalRef: React.LegacyRef<HTMLDivElement>;
    constructor(props) {
        super(props);
        this.state = {
            modalActive: false,
        } as AppState;

        this.modalRef = React.createRef();
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
    turnOffModal() : void {
        this.setState({modalActive: false});
    }
    render() {
        const state = this.state;
        AppContextValue.modal.active = this.state.modalActive;
        console.log('App render');
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
                    <RecordList/>
                    {
                        state.modalActive && state.modalElement
                    }
                </AppContext.Provider>
            </>
        );
    }
}


export default App;
