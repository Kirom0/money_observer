import React from 'react';
import { AppContext } from '../AppContext';

interface IconSelectionProps {
  returnSelection: (value: string) => void,
  selected: string,
}

export class IconSelection extends React.Component<IconSelectionProps, any> {
  static contextType = AppContext;
  constructor(props) {
    super(props);
  }

  clickHandler(value) {
    this.props.returnSelection(value);
  }
  render() {
    return (
    <div className="icon-selection">
      {
        Object.keys(this.context.icons)
          .map(key=>this.context.icons[key])
          .map((icon, idx)=>
            <img
              className={icon.name === this.props.selected ? 'selected' : ''}
              src={icon.src}
              alt={icon.name}
              key={idx}
              onClick={this.clickHandler.bind(this, icon.name)}
            />)
      }
    </div>);
  }
}
