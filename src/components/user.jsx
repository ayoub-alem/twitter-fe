import React from 'react';
import "./../css/subject.css";
import { Avatar } from "@material-ui/core"
import "./../css/user.css"
import picturesPath from '../services/picturesPath';

const User = ({ onClick, id, nom, prenom, description, photo, isFollowed }) => {

    return (
        <div id={id} className="user">
            <Avatar width='large' alt="user profile" src={picturesPath + photo}></Avatar>
            <div className="name--description--user">
                <h4>{prenom + " " + nom}</h4>
                <p>{description}</p>
            </div>
            <button onClick={(e) => onClick(e)} id={id} className={isFollowed === "1" ? "subject suivre suivre--active" : "subject suivre "}>{isFollowed === "1" ? "Abonné" : "Suivre"}</button>
        </div>
    )
}

export default User;