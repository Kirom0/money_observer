import { IconSelection } from '../singleComponents/IconSelection';
import React, { useContext, useState } from 'react';
import { AppContext } from '../AppContext';

interface IconProps {
  active: boolean,
  name: string,
  returnValue: (value: string) => void,
}


export const Icon: React.FC<IconProps> = (props) => {
  const [name, setName] = useState(props.name);
  const context = useContext(AppContext);
  return (
    <>
      {
        props.active && <span
          className="material-icons"
          onClick={()=>{
              context.modal.turnOn(
                <IconSelection
                  returnSelection={(value) => {
                    setName(value);
                    props.returnValue(value);
                  }}
                  selected={name}
                />);
          }}
        >change_circle</span>
      }

      <img src={context.icons[name].src}/>
    </>
  );
}
