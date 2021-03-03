import React from 'react';

export class Balance extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="balance">
        <div className="balance__container">
          <span className="amount">799.02₽</span>
          <div className="balance__container_btn">
            {this.props.children}
          </div>
        </div>
      </div>
    )
  }
}
