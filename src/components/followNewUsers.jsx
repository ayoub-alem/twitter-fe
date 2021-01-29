import React, { useState, useEffect, Fragment } from 'react';
import http, { cookies } from './../services/httpService.js';
import serverPath from './../services/serverPath.js';
import { getUser } from './../services/auth.js';
import getSuggestedUsers from '../services/getSuggestedUsers.js';
import { toast } from 'react-toastify';
import User from "./user"
import "./../css/followNewUsers.css"


const followToSend = (prop, value) => {
    const data = new FormData();
    data.append(prop, value);
    return data;
}

const FollowNewUsers = () => {
    const [state, setState] = useState({ suggestedUsers: [] });

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            const suggestedUsers = await getSuggestedUsers();
            setState(prevState => {
                return {
                    ...prevState,
                    suggestedUsers
                }
            })
        };
        if (getUser()) {
            if (getUser().completed === "1") {
                fetchSuggestedUsers();
            }
        }
    }, [])




    const onSuivre = async (e) => {
        let target = e.currentTarget;
        if (e.currentTarget.classList.contains("suivre--active")) {
            console.log('unfollow started ...', target)
            e.currentTarget.classList.remove("suivre--active");
            e.currentTarget.innerHTML = "Suivre";
            let unfollowed_id = e.currentTarget.id;
            try {
                const { data, headers } = await http.post(
                    serverPath + 'abandonne.php',
                    followToSend("unfollowed_id", unfollowed_id),
                    http.urlEncoded(cookies.get("x-auth-token"))
                );
                toast.success(data);
                if (headers['x-auth-token']) {
                    cookies.remove("x-auth-token");
                    cookies.set('x-auth-token', headers['x-auth-token'], {
                        path: '/',
                        maxAge: 3600 * 24 * 30 * 12
                    });
                }
            } catch (error) {
                e.currentTarget.classList.add("suivre--active");
                e.currentTarget.innerHTML = "Abonné";
                toast.error(error.response);
            }
        } else {
            let target = e.currentTarget;
            console.log('follow started ...', target);
            target.classList.add("suivre--active");
            e.currentTarget.innerHTML = "Abonné";
            let followed_id = target.id;
            console.log(followed_id);
            try {
                const { data, headers } = await http.post(
                    serverPath + 'suivre.php',
                    followToSend("followed_id", followed_id),
                    http.urlEncoded(cookies.get("x-auth-token"))
                );
                toast.success(data);
                if (headers['x-auth-token']) {
                    cookies.remove("x-auth-token");
                    cookies.set('x-auth-token', headers['x-auth-token'], {
                        path: '/',
                        maxAge: 3600 * 24 * 30 * 12
                    });
                }
            } catch (error) {
                target.classList.remove("suivre--active");
                target.innerHTML = "Suivre";
                toast.error(error.response);
            }
        }
    }

    return (
        <Fragment>
            <div className="flux--container--head">
                Listes
            </div>
            <div className="replace--flux--head"></div>
            <div className="user--container customize--list--container">
                {state.suggestedUsers.map(user => <User key={user.user_id} onClick={onSuivre} id={user.user_id} nom={user.nom} prenom={user.prenom} photo={user.photo} description={user.description} isFollowed={user.isFollowed}></User>)}
            </div>
        </Fragment>
    )
}

export default FollowNewUsers;