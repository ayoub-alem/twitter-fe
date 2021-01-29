import React, { useState, Fragment } from 'react';
import http, { cookies } from './../services/httpService';
import serverPath from './../services/serverPath';
import { toast } from 'react-toastify';
import { getUser } from '../services/auth';
import Input from './input';
import { NavLink, Redirect } from 'react-router-dom';
import TwitterIcon from '@material-ui/icons/Twitter';
import "./../css/home.css"
import "./../css/login.css"



const loginToSend = (state) => {
    const data = new FormData();
    data.append("email", state.email);
    data.append("mdp", state.mdp);
    return data;
}


const Login = () => {

    const [state, setState] = useState({ email: "", mdp: "", redirect: false });
    const { email, mdp, redirect } = state;


    const setChange = ({ currentTarget: input }) => {
        let name = input.name;
        let value = input.value;
        setState(state => {
            return {
                ...state, [name]: value
            }
        });
    }


    const login = async (e) => {
        e.preventDefault();
        try {
            const { data, headers } = await http.post(
                serverPath + 'login.php',
                loginToSend(state),
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
            setState(state => {
                return { ...state, redirect: true }
            });
            console.log(headers['x-auth-token']);
        } catch (error) {
            toast.error(error.response)
        }
    }


    return (
        <Fragment>
            {redirect && <Redirect to="/flux"></Redirect>}
            {(getUser() && (getUser().completed === "1") && <Redirect to="/flux"></Redirect>)}
            {(getUser() && (getUser().completed === "0") && <Redirect to="/signup_complete"></Redirect>)}
            <div className="div--wrap">
                <div className="div--signup--login custom--login">
                    <TwitterIcon fontSize="large"></TwitterIcon>
                    <h2 className="signup--titre">Se connecter à Twitter</h2>
                    <Input value={email} handleChange={setChange} inputType='email' inputName='email' spanValue="Email"></Input>
                    <Input value={mdp} handleChange={setChange} inputType='password' inputName='mdp' spanValue="Mot de passe"></Input><br></br>
                    <button className="login--button" onClick={(e) => login(e)} type="submit" >Se connecter</button>
                    <NavLink className="signup--navlink" to="/signup">S'inscrire sur Twitter</NavLink>
                </div>
            </div>
        </Fragment>
    )
}

export default Login;