import React, { useState, Fragment, useRef } from 'react';
import { getUser } from '../services/auth';
import CropOriginalOutlinedIcon from '@material-ui/icons/CropOriginalOutlined';
import "./../css/home.css"
import { IconButton } from '@material-ui/core';
import picturesPath from '../services/picturesPath';

const HomeHead = ({ textAreaValue, photoAdded, onChange, handleImage, fileRef, imageButtonRef, imagePostRef, onSendNewPost }) => {

    const [textAreaSize, setTextAreaSize] = useState(0);
    const tweeterButton = useRef();

    const handleSizeChange = (e) => {
        setTextAreaSize(textAreaSize);
        e.currentTarget.style.height = e.currentTarget.scrollHeight + "px";
    }
    const handleSizeChangeSecond = (e) => {
        setTextAreaSize(textAreaSize);
        if (!e.currentTarget.value)
            e.currentTarget.style.height = "fit-content";
    }

    const addTopBorder = () => {
        tweeterButton.current.style.setProperty("border-top", "1px solid rgb(235, 238, 240)");
        tweeterButton.current.style.setProperty("margin-top", "20px");
    }
    const removeTopBorder = () => {
        tweeterButton.current.style.setProperty("border-top", "0px");
        tweeterButton.current.style.setProperty("margin-top", "auto");
    }


    return (
        <Fragment>
            <div className="flux--container--head">
                Accueil
            </div>
            <div className="replace--flux--head"></div>
            <div className="flux--container--tweeter--div">
                <img className="avatar" src={picturesPath + getUser().photo} alt="pdp" />
                <div className="input--text--area" onFocus={addTopBorder} onBlur={removeTopBorder}>
                    <input ref={fileRef} accept="image/x-png,image/gif,image/jpeg" onChange={handleImage} type="file" name="photo" hidden />
                    <textarea value={textAreaValue} onChange={e => onChange(e)} spellCheck="false" onInput={e => handleSizeChange(e)} onBlur={(e) => handleSizeChangeSecond(e)} cols="30" rows="1" placeholder="Quoi de neuf ?"></textarea>
                    {photoAdded && <img ref={imagePostRef} src="" alt="post" className="photo--post" />}
                    <div className="tweeter-button--add--picture--button" ref={tweeterButton}>
                        <IconButton onClick={() => fileRef.current.click()} ref={imageButtonRef}>
                            <CropOriginalOutlinedIcon></CropOriginalOutlinedIcon>
                        </IconButton>
                        <button onClick={(e) => onSendNewPost(e)} disabled={(textAreaValue || photoAdded) ? false : true} style={(textAreaValue || photoAdded) ? {} : { opacity: 0.5 }} >Tweeter</button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default HomeHead;