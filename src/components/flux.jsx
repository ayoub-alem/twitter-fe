import React, { useState, useEffect, Fragment, useRef } from 'react';
import _ from "lodash";
import http, { cookies } from './../services/httpService';
import serverPath from './../services/serverPath';
import { toast } from 'react-toastify';
import { getUser } from '../services/auth';
import getPosts from '../services/getPosts.js';
import getRetweetedPosts from '../services/getRetweetedPosts';
import { Redirect } from 'react-router-dom';
import "./../css/home.css"
import HomeHead from './homeHead';
import Post from './post';
import RetweetedPost from './retweetedPost';
import Pusher from "pusher-js";


const postToSend = (fileRef, state) => {
    const data = new FormData();
    data.append("photo", fileRef.current.files[0]);
    data.append("description_post", state.newPost.description_post);
    return data;
}
const retweetToSend = (id) => {
    const data = new FormData();
    data.append("post_id", id);
    return data;
}

const Flux = () => {

    const [state, setState] = useState({ userInfo: {}, posts: [], newPost: { user_id: "", description_post: "", photo: false } });
    const fileRef = useRef();
    const imagePostRef = useRef();
    const imageButtonRef = useRef();
    const { posts, newPost } = state;


    useEffect(() => {
        if (getUser()) {
            if (getUser().completed === "1") {
                let execute = async () => {
                    const posts = async () => await getPosts();
                    const retweetedPosts = async () => await getRetweetedPosts();
                    let array = [...await posts(), ...await retweetedPosts()];
                    setState(prevState => {
                        return {
                            ...prevState, posts: [..._.orderBy([...array], ["compare_date"], ["desc"])]
                        }
                    })
                }
                execute();
            }
        }
    }, [])
    useEffect(() => {
        if (getUser()) {
            if (getUser().completed === "1") {
                // Enable pusher logging - don't include this in production
                // Pusher.logToConsole = true;

                const pusher = new Pusher('0b3634e12be4cfa3970b', {
                    cluster: 'eu'
                });

                const channel = pusher.subscribe(getUser().user_id);
                channel.bind('new_tweet', function (data) {
                    toast.info(data.message);
                    setState(prevState =>{
                        return {
                            ...prevState, posts: [data.post, ...prevState.posts]
                        }
                    })
                });
            }
        }
    }, [])

    const handleImage = () => {
        let input = fileRef.current;
        if (input.files && input.files[0]) {
            setState(prevState => {
                return {
                    ...prevState, newPost: { ...prevState.newPost, photo: true }
                }
            })
            var reader = new FileReader();
            reader.onload = (e) => imagePostRef.current.src = e.target.result;
            reader.readAsDataURL(input.files[0]);
            // imagePostRef.current.hidden = false;
        }
    }

    const onChangeTextArea = (e) => {
        if (e.currentTarget.value.length <= 255) {
            let value = e.currentTarget.value;
            setState(prevState => {
                return {
                    ...prevState, newPost: { ...prevState.newPost, description_post: value }
                }
            })
        } else {
            toast.info("Sorry you achieved the maximum length allowed for the tweet description");
        }
    }

    const sendNewPost = async (e) => {
        try {
            const { data, headers } = await http.post(
                serverPath + 'tweet.php',
                postToSend(fileRef, state),
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
            console.log(headers['x-auth-token']);
            setState(prevState => {
                return { ...prevState, newPost: { user_id: "", description_post: "", photo: false } }
            });
        } catch (error) {
            toast.error(error.response)
        }
    }

    const retweetPost = async (e) => {
        if (e.currentTarget.firstChild.disabled) {
            toast.info("Sorry you can not retweet your post, or a retweeted Post :)")
            return
        }
        let post_id = e.currentTarget.id;
        try {
            const { data, headers } = await http.post(
                serverPath + 'retweet.php',
                retweetToSend(post_id),
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
            console.log(headers['x-auth-token']);
        } catch (error) {
            toast.error(error.response)
        }
    }

    return (
        <Fragment>
            {!getUser() && <Redirect to="/signup"></Redirect>}
            {(getUser() && (getUser().completed === "0") && <Redirect to="/signup_complete"></Redirect>)}
            <HomeHead imageButtonRef={imageButtonRef} onSendNewPost={sendNewPost} fileRef={fileRef} imagePostRef={imagePostRef} handleImage={handleImage} onChange={onChangeTextArea} textAreaValue={newPost.description_post} photoAdded={newPost.photo}></HomeHead>
            <div className="separater--div"></div>
            {(posts.length !== 0) && posts.map((post, index) => {
                return <Fragment key={index}>
                    {post.retweet === "1" ? <RetweetedPost onClick={retweetPost} postId={post.post_id} userId={post.user_id} retweeterNom={post.nom} retweeterPrenom={post.prenom} photoProfile={post.post_owner_photo} photoPost={post.post_photo} prenom={post.post_owner_prenom} nom={post.post_owner_nom} description={post.description_post} postDate={post.post_date}></RetweetedPost> : <Post onClick={retweetPost} postId={post.post_id} userId={post.user_id} photoProfile={post.photo} photoPost={post.post_photo} prenom={post.prenom} nom={post.nom} description={post.description_post} postDate={post.compare_date}></Post>}

                </Fragment>
            })}
        </Fragment >
    )
}

export default Flux;