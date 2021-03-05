import React from 'react';
import parseUrl from 'parse-url';
import Loader from './Loader';
import { api } from '../../core/api';
import { setToken } from '../../core/authentication';
import { AppContext } from '../AppContext';

interface SignInState {
  loading?: boolean,
  authed?:boolean,
  name?:string,
}

export class SignIn extends React.Component<any, SignInState>{
  static contextType = AppContext;
  private readonly code: string | undefined;
  constructor(props) {
    super(props);
    this.code = parseUrl(document.location.href).query.code;
    this.state = {loading: this.code !== undefined};
  }

  async componentDidMount() {
    if (this.code) {
      const ans = await api.auth({ token: this.code });

      if (ans.error) {
        alert(ans.error);
        this.setState({loading: false, authed: false});
      } else {
        const { token, name } = ans;
        setToken(token);
        this.setState({ loading: false, authed: true, name });

        setTimeout(()=>{
          document.location.href = '/';
        }, 5000);
      }
    }
  }

  render() {
    if (this.state.loading) {
      return <Loader/>
    }
    return (
      <div className="sign-in">
        <p className="sign-in__paragraph">
          {
            this.state.authed ? `Приветствую ${this.state.name}` : 'Вы не авторизированны.'
          }
        </p>
        {
          this.state.authed || (
            <AppContext.Consumer>
              {(value) => (
                <a
                  className="sign-in__button"
                  href={value.authData.vk_oauth_uri}
                >
                  <div className="sign-in__button_content">
                    <span>Войти с помощью</span>
                    <img src="img/vk-logo.svg"/>
                  </div>
                </a>)
              }
            </AppContext.Consumer>
          )
        }
      </div>
    );
  }
}
