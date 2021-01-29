import React, { useState, Fragment } from 'react';
import { getUser } from '../services/auth';
import { NavLink, Redirect } from 'react-router-dom';
import TwitterIcon from '@material-ui/icons/Twitter';
import "./../css/sideBar.css"
import { Avatar } from '@material-ui/core';
import HomeIcon from '@material-ui/icons/Home';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import { BookmarkBorder, ListAlt, MailOutline, MoreHoriz, NotificationsNone, PermIdentity, Search } from '@material-ui/icons';
import { cookies } from '../services/httpService';
import picturesPath from '../services/picturesPath';

const SideBar = () => {

    const [logout, setLogout] = useState(false);
    const onLogout = () => {
        cookies.remove("x-auth-token");
        setLogout(true);
    }

    return (
        <Fragment>
            {logout && <Redirect to="/login"></Redirect>}
            <div className="sidebar--div">
                <div className="twitter-logo"><TwitterIcon></TwitterIcon></div>
                <div className="sidebar--links--div">
                    <div className="sidebar--link">
                        <NavLink to="/flux" ><HomeIcon></HomeIcon><span>Accueil</span></NavLink>
                    </div>
                    <div className="sidebar--link">
                        <NavLink to="/explorer"><Search></Search><span>Explorer</span></NavLink>
                    </div>
                    <div className="sidebar--link">
                        <NavLink to="/notifications"><NotificationsNone></NotificationsNone><span>Notifications</span></NavLink>
                    </div>
                    <div className="sidebar--link">
                        <NavLink to="/messages"><MailOutline></MailOutline><span>Messages</span></NavLink>
                    </div>
                    <div className="sidebar--link">
                        <NavLink to="/signets"><BookmarkBorder></BookmarkBorder><span>Signets</span></NavLink>
                    </div>
                    <div className="sidebar--link">
                        <NavLink to="/listes"><ListAlt></ListAlt><span>Listes</span></NavLink>
                    </div>
                    <div className="sidebar--link">
                        <NavLink to="/profil"><PermIdentity></PermIdentity><span>Profil</span></NavLink>
                    </div>
                    <div className="sidebar--link">
                        <NavLink to="/plus"><MoreHoriz></MoreHoriz><span>Plus</span></NavLink>
                    </div>
                    <button className="sidebar--tweet--button">Tweeter</button>
                </div>
                <div className="footer--logout" onClick={() => onLogout()}>
                    <Avatar src={picturesPath + getUser().photo}></Avatar>
                    <div>
                        <h5>{getUser().prenom + " " + getUser().nom}</h5>
                        <h5>@{getUser().prenom + " " + getUser().nom}</h5>
                    </div>
                    <MeetingRoomIcon></MeetingRoomIcon>
                    <span className="span--popup--logout">click to logout</span>
                </div>
            </div>
        </Fragment >
    )
}

export default SideBar;