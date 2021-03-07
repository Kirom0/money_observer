import React from 'react';
import parseUrl from 'parse-url';
import Loader from './Loader';
import { api } from '../../core/api';
import { getToken, setToken } from '../../core/authentication';
import { AppContext } from '../AppContext';
import { connect } from 'react-redux';
import { balanceGet } from '../../redux/balance/balanceActions';

interface SignInState {
  loading?: boolean,
  vk_oauth_uri?: string,
}

interface SignInProps {
  sendAuth: (auth: any, showWelcomeScreen: boolean) => void,
  balanceGet: (balance: number) => void,
}


class Authorization extends React.Component<SignInProps, SignInState>{
  static contextType = AppContext;
  private readonly code: string | undefined;
  constructor(props) {
    super(props);
    this.code = parseUrl(document.location.href).query.code;
    this.state = {loading: true, vk_oauth_uri: '' };
  }

  async componentDidMount() {
    if (this.code) { //Удаление данных их строки поиска
      history.pushState({}, null, '/');
    }

    const token = getToken() || this.code || '';
    const needShowWelcomeScreen = !getToken() && !!this.code;
    const auth = await api.auth({ token });
    console.log(auth);
    if (auth.success) {
      const { token, balance } = auth;
      setToken(token);
      this.props.balanceGet(balance);
      this.props.sendAuth(auth, needShowWelcomeScreen);
      return;
    }
    setToken('');
    this.setState({ vk_oauth_uri: auth.vk_oauth_uri, loading: false});
  }

  render() {
    if (this.state.loading) {
      return <Loader/>
    }
    return (
      <div className="sign-in">
        <p className="sign-in__paragraph">Вы не авторизированны.</p>
            <a
              className="sign-in__button"
              href={this.state.vk_oauth_uri}
            >
              <div className="sign-in__button_content">
                <span>Войти с помощью</span>
                <img src="img/vk-logo.svg"/>
              </div>
            </a>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    balanceGet: (balance) => {dispatch(balanceGet(balance))},
  }
}

export default connect(null, mapDispatchToProps)(Authorization);
