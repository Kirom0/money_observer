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
            setState({amount, warning: ''});
        }
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
        props.saveAmount(amount);
    }
    return (
        <div className={amountClassNames(state.amount)}>
            <input
                type="text"
                defaultValue={state.amount}
                onInput={inputHandler}
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
