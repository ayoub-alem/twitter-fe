import React, { useState } from 'react';
import "./../css/select.css";
import "./../css/signup.css"

function Select({ placeholdeSpan, options, name, handleChange, value }) {



    const [focus, changeState] = useState(false);

    const setFocus = (e) => {
        e.target.classList.add("changeSelectBorderColor");
        e.target.parentNode.firstChild.classList.add("changeSpanColor");
        changeState(true);
    }

    const setBlur = (e) => {
        if (!e.target.value) {
            e.target.classList.remove("changeSelectBorderColor");
            e.target.parentNode.firstChild.classList.remove("changeSpanColor");
            changeState(false);
        }
    }







    return (
        <div className="div--select">
            <span className="input--placeholder select--placeholder">{placeholdeSpan}</span>
            <select onChange={(e)=> handleChange(e)} value={value} name={name} onFocus={(e) => setFocus(e)} onBlur={(e) => setBlur(e)} className="select--element">
                {options.map((obj) => {
                    return (<option key={obj.value} value={obj.value}>{obj.label}</option>);
                })}
            </select>
        </div>
    )
}

export default Select;