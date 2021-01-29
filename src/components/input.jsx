import React, { useState, useRef } from 'react';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import './../css/input.css';


const Input = ({ spanValue, inputName, inputType, handleChange, error, value }) => {
    const [state, changeState] = useState({ focus: false, display: false });
    const myInputRef = useRef();
    const setFocus = (e) => {
        e.currentTarget.classList.add("active--input");
        e.currentTarget.parentNode.firstChild.classList.add("active--input--placeholder");
        changeState(prevStat => {
            const state = { ...prevStat };
            state.focus = true;
            return state;
        });
    }

    const setBlur = (e) => {
        if (!e.target.value) {
            e.currentTarget.classList.remove("active--input");
            e.currentTarget.parentNode.firstChild.classList.remove("active--input--placeholder");
            changeState(prevStat => {
                const state = { ...prevStat };
                state.focus = false;
                return state;
            });
        }
    }

    const display = () => {
        changeState(prevStat => {
            const state = { ...prevStat };
            state.display = !state.display;
            return state;
        });
        myInputRef.current.type = myInputRef.current.type === "text" ? "password" : "text";
    }

    return (
        <div className="div--input">
            <span className={"input--placeholder " + ((value && !error) ? " active--input--placeholder" : "") + (error && value ? " active--input--placeholder active--input--placeholder--wrong" : "") + (error && !value ? " active--input--placeholder active--input--placeholder--wrong" : "")}>{spanValue}</span>
            {inputType === "password" && (state.display ? <div><LockIcon onClick={display}></LockIcon></div> : <div><LockOpenIcon onClick={display}></LockOpenIcon></div>)}
            <input ref={myInputRef} value={value} onChange={(e) => handleChange(e)} onInput={(e) => setFocus(e)} onFocus={(e) => setFocus(e)} onBlur={(e) => setBlur(e)} className={"input--form " + ((value && !error) ? " active--input" : "") + (value && error ? "active--input--wrong" : "") + (!value && error ? " active--input--wrong" : "")} type={inputType} name={inputName}></input>
            {error && <p className='error'>{error}</p>}
        </div>
    )
};

export default Input;
