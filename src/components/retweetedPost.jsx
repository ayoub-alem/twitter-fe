import { IconButton } from '@material-ui/core';
import { Repeat } from '@material-ui/icons';
import React, { Fragment } from 'react';
import { getUser } from '../services/auth';
import picturesPath from '../services/picturesPath';
import "./../css/post.css";


const RetweetedPost = ({ retweeterNom, retweeterPrenom, prenom, nom, description, postDate, photoProfile, photoPost, userId, postId, onClick }) => {

    return (
        <Fragment>
            <div className="post--container--div">
                <div className="retweet--div"><Repeat fontSize="default"></Repeat>{userId === getUser().user_id ? "Vous avez retweeté" : (retweeterPrenom + " " + retweeterNom + " a retweeté")}</div>
                <div className="avatar--description">
                    <img className="avatar" src={picturesPath + photoProfile} alt="post-twitter"></img>
                    <div className="name--photo--retweet">
                        <div className="name--username--timestamp">
                            <h4>{prenom + " " + nom}</h4>
                            <h5>{"@" + prenom + nom}</h5>
                            <span>.</span>
                            <h5>{postDate}</h5>
                        </div>
                        <div className="image--div">
                            <p>{description}</p>
                            {photoPost && <img className="photo-for-post" src={picturesPath + photoPost} alt="" />}
                        </div>
                        <div className="retweet">
                            <div id={postId} onClick={(e) => onClick(e)}>
                                <IconButton disabled={true}>
                                    <Repeat fontSize="small"></Repeat>
                                </IconButton>
                            </div>
                            <span className="retweet-span">click to retweet</span>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment >
    )
}

export default RetweetedPost;