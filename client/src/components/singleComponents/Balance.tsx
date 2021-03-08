import React from 'react';
import { connect } from 'react-redux';
import { beautyMoneyValue } from '../../core/utils';

class Balance extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="balance">
        <div className="balance__container">
          <span className="amount">{beautyMoneyValue(this.props.balance)}₽</span>
          <div className="balance__container_btn">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    balance: state.balance,
  }
}

export default connect(mapStateToProps, null)(Balance);
