import React from 'react';
import RecordList from "./RecordsList/RecordList";
import { AppContext, defaultAppContextValue } from './AppContext';
import Authorization from './singleComponents/Authorization';
import Balance from './singleComponents/Balance';
import { AddRecordBtn } from './singleComponents/AddRecordBtn';
import ExtendedRecord from './ExtendedRecord/ExtendedRecord';
import { emptyRecord } from '../interfaces/IRecord';
import WelcomeScreen from './singleComponents/WelcomeScreen';

interface AppState {
    modalActive?: boolean,
    authorized?: boolean,
    modalElements?: JSX.Element[],
    showWelcomeScreen?: boolean,
}

const AppContextValue = {
    icons: defaultAppContextValue.icons,
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
            modalElements: [],
            showWelcomeScreen: false,
        } as AppState;

        AppContextValue.modal.turnOn = (element : JSX.Element) => {
            if (element) {
                this.setState((prevState) => {
                  debugger;
                  return {modalElements: [...prevState.modalElements, element]};
                });
            } else {
                this.setState({modalActive: true});
            }
        };
        AppContextValue.modal.turnOff = () => {
            if (this.state.modalElements.length) {
              this.setState((prevState) => {
                const modalElements = [...prevState.modalElements];
                modalElements.pop();
                return {modalElements};
              });
            } else {
              this.setState({modalActive: false});
            }
        };
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
                    className={['modal', state.modalActive || state.modalElements.length ? '' : 'off'].join(' ')}
                    style={state.modalElements.length ? {zIndex: state.modalElements.length+1} : {}}
                    onClick={()=>{
                      this.setState({modalActive: false});
                    }}
                />
                <div className="header"><span>Money Observer</span></div>
                <AppContext.Provider value={AppContextValue}>
                    {
                        content()
                    }
                    {
                      state.modalElements.map((el, idx)=>
                        <div
                          className='modal-content'
                          key={idx}
                          style={{zIndex: (idx+1)*2}}
                          onClick={AppContextValue.modal.turnOff}
                        >{el}</div>
                      )
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
