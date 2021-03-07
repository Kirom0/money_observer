import React, { LegacyRef, useState } from 'react';
import {amountClassNames, formatAmount} from "../RecordsList/Record";
import { Simulate } from 'react-dom/test-utils';
import focus = Simulate.focus;
import keyDown = Simulate.keyDown;

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

    const inputRef : LegacyRef<HTMLInputElement> = React.createRef();

    const inputHandler : (event : React.FormEvent<HTMLInputElement>) => void = (event) => {
        const amount : number | undefined = normalize(event.currentTarget.value);
        if (amount !== undefined) {
            setState({amount, warning: ''});
        }
    }

    const changeAmount = (inputValue) => {
        const amount: number | undefined = normalize(inputValue);
        if (amount === undefined) {
            console.log('blurHandler save', amount);
            setState((prevState) => {
                console.log(prevState);
                return { ...prevState, warning: 'Недопустимое значение' };
            });
            return;
        }
        setState({ amount, warning: '' });
        props.saveAmount(amount);
    }

    const blurHandler : (event : React.FocusEvent<HTMLInputElement>) => void = (event) => {
        const targetValue = event.currentTarget.value;
        if (targetValue) {
            changeAmount(targetValue);
        }
    }
    const focusHandler : (event : React.FocusEvent<HTMLInputElement>) => void = (event) => {
        event.currentTarget.value = '';
    }
    const keyDownHandler : (event : React.KeyboardEvent<HTMLInputElement>) => void = (event) => {
        if (event.key === 'Enter') {
            inputRef.current.blur();
        }
    }

    return (
        <div className={amountClassNames(state.amount)}>
            <input
                type="text"
                defaultValue={state.amount}
                onInput={inputHandler}
                onBlur={blurHandler}
                onFocus={focusHandler}
                onKeyDown={keyDownHandler}
                disabled={props.disabled}
                ref={inputRef}
            />
            {state.warning ?
                (<span style={{fontSize: '0.7em', lineHeight: '1em', color: 'red'}}>{state.warning}</span>) :
                (<span>{formatAmount(state.amount)}</span>)
            }
        </div>
    );
}

function normalize(str: string) : number | undefined {
    str = str.replace(/\,/g, '.');
    const num = +str;
    return isNaN(num) ? undefined : +num.toFixed(2);
}
