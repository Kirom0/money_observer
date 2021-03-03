import React from 'react';
import RecordList from "./RecordsList/RecordList";
import { AppContext } from './AppContext';
import { SignIn } from './singleComponents/SignIn';
import { Balance } from './singleComponents/Balance';
import { AddRecordBtn } from './singleComponents/AddRecordBtn';
import ExtendedRecord from './ExtendedRecord/ExtendedRecord';
import { emptyRecord } from '../interfaces/IRecord';

interface AppState {
    modalActive?: boolean,
    authorized?: boolean,
    modalElement?: JSX.Element,
}

const AppContextValue = {
    modal: {
        active: false,
        turnOn: undefined,
        turnOff: undefined,
    },
    authorized: false,
    authData: {
        token: '',
        name: '',
    }
}

class App extends React.Component<{ authData : any }, AppState> {
    private modalRef: React.LegacyRef<HTMLDivElement>;
    constructor(props) {
        super(props);
        if (this.props.authData) {
            AppContextValue.authorized = true;
            AppContextValue.authData = this.props.authData;
        }

        this.state = {
            modalActive: false,
            authorized: AppContextValue.authorized,
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
                    {
                        !state.authorized ? (<SignIn/>) : (
                          <>
                              <Balance>
                                  <AddRecordBtn onClick={()=>{
                                      AppContextValue.modal.turnOn((
                                        <ExtendedRecord
                                          record={emptyRecord()}
                                        />
                                      ));
                                  }}/>
                              </Balance>
                              <RecordList/>
                          </>
                          )
                    }
                    {
                        state.modalActive && state.modalElement
                    }
                </AppContext.Provider>
            </>
        );
    }
}


export default App;
