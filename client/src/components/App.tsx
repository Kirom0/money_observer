import React from 'react';
import RecordList from "./RecordsList/RecordList";
import { AppContext } from './AppContext';
import Authorization from './singleComponents/Authorization';
import Balance from './singleComponents/Balance';
import { AddRecordBtn } from './singleComponents/AddRecordBtn';
import ExtendedRecord from './ExtendedRecord/ExtendedRecord';
import { emptyRecord } from '../interfaces/IRecord';
import WelcomeScreen from './singleComponents/WelcomeScreen';

interface AppState {
    modalActive?: boolean,
    authorized?: boolean,
    modalElement?: JSX.Element,
    showWelcomeScreen?: boolean,
}

const AppContextValue = {
    modal: {
        active: false,
        turnOn: undefined,
        turnOff: undefined,
    },
    auth: {
        token: '',
        name: '',
        vk_oauth_uri: '',
        success: false,
    }
}

class App extends React.Component<any, AppState> {
    constructor(props) {
        super(props);

        this.state = {
            modalActive: false,
            authorized: false,
            showWelcomeScreen: false,
        } as AppState;

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
        const content = () => {
            if (!state.authorized) {
                return (
                  <Authorization sendAuth={(auth, showWelcomeScreen = false)=>{
                      if (auth.success) {
                          AppContextValue.auth = auth;
                          if (showWelcomeScreen) {
                              this.setState({ showWelcomeScreen });
                              setTimeout(()=>{
                                  this.setState({authorized: true });
                              }, 1000);
                              return;
                          }
                          this.setState({authorized: true, showWelcomeScreen });
                      }
                  }}/>
                )
            }
            return (
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
            );
        }
        return (
            <>
                <div
                    className={['modal', !state.modalActive ? 'off' : ''].join(' ')}
                    onClick={()=>{
                        if (state.modalElement) {
                            this.turnOffModal();
                        }
                    }}
                />
                <div className="header"><span>Money Observer</span></div>
                <AppContext.Provider value={AppContextValue}>
                    {
                        content()
                    }
                    {
                        state.modalActive && state.modalElement
                    }
                    {
                        state.showWelcomeScreen &&
                        (<WelcomeScreen
                          name={AppContextValue.auth.name}
                          close={()=>{this.setState({showWelcomeScreen: false})}}
                        />)
                    }
                </AppContext.Provider>
            </>
        );
    }
}


export default App;
