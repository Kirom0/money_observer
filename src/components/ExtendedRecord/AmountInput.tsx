import React, {useState} from "react";
import {amountClassNames, formatAmount} from "../RecordsList/Record";

interface AmountInputProps {
    amount: number,
    saveAmount: (amount: number) => void,
    disabled: boolean,
}

export const AmountInput : React.FC<AmountInputProps> = (props) => {
    const [state, setState] = useState({
        amount: props.amount,
        warning: '',
    });

    const inputHandler : (event : React.FormEvent<HTMLInputElement>) => void = (event) => {
        const amount : number | undefined = normalize(event.currentTarget.value);
        if (amount !== undefined) {
            console.log('inputHandler save');
            setState({amount, warning: ''});
        }
    }

    const focusHandler : (event : React.FocusEvent<HTMLInputElement>) => void = (event) => {
        console.log('focus');
    }

    const blurHandler : (event : React.FocusEvent<HTMLInputElement>) => void = (event) => {
        const amount : number | undefined = normalize(event.currentTarget.value);
        if (amount === undefined) {
            console.log('blurHandler save', amount);
            setState((prevState) => {
                console.log(prevState);
                return {...prevState, warning: 'Недопустимое значение'};
            });
            return;
        }
        setState({amount, warning: ''});
        console.log('saveAmount');
        props.saveAmount(amount);
    }
    console.log('AmountInput render', state);
    return (
        <div className={amountClassNames(state.amount)}>
            <input
                type="text"
                defaultValue={state.amount}
                onInput={inputHandler}
                onFocus={focusHandler}
                onBlur={blurHandler}
                disabled={props.disabled}
            />
            {state.warning ?
                (<span style={{fontSize: '0.7em', lineHeight: '1em', color: 'red'}}>{state.warning}</span>) :
                (<span>{formatAmount(state.amount)}</span>)
            }
        </div>
    );
}

function normalize(str: string) : number | undefined {
    const num = +str;
    return isNaN(num) ? undefined : +num.toFixed(2);
}
