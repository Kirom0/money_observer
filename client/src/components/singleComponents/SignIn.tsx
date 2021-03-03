import React from 'react';
import parseUrl from 'parse-url';
import Loader from './Loader';
import { api } from '../../core/api';
import { setToken } from '../../core/authentication';

interface SignInState {
  loading?: boolean,
  authed?:boolean,
  name?:string,
}

export class SignIn extends React.Component<any, SignInState>{
  private code: string | undefined;
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
            <a
              className="sign-in__button"
              href="https://oauth.vk.com/authorize?client_id=7778112&scope=65536&display=popup&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F"
            >
              <div className="sign-in__button_content">
                <span>Войти с помощью</span>
                <img src="img/vk-logo.svg"/>
              </div>
            </a>
          )
        }
      </div>
    );
  }
}
