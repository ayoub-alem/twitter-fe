import React, { useState, Fragment } from 'react';
import Joi from 'joi';
import http, { cookies } from './../services/httpService';
import serverPath from './../services/serverPath';
import { toast } from 'react-toastify';
import Input from './input';
import Select from './select';
import TwitterIcon from '@material-ui/icons/Twitter';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import { IconButton } from '@material-ui/core';
import "./../css/signup.css";
import { Redirect, NavLink } from 'react-router-dom';
import { getUser } from '../services/auth';

let globalSchema = Joi.object({
    nom: Joi.string().max(50).trim().required().label("Nom"),
    prenom: Joi.string().max(50).trim().required().label("Prenom"),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr', 'io', 'org', 'ma'] } }).max(100).trim().required().label('Email'),
    date_de_naissance: Joi.string().max(8).trim().required(),
    mdp: Joi.string().min(8).max(50).required().label("Mot de passe")
})



const arrayMois = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Aout", "Septembre", "Octobre", "Novembre", "Décembre"]
const jours = [];
const années = [];
const mois = []


for (let i = 1; i < 31; i++) {
    const obj = {
        label: i,
        value: i
    }
    jours.push(obj);
}
for (let i = 1; i < 13; i++) {
    const obj = {
        label: arrayMois[i - 1],
        value: i
    }
    mois.push(obj);
}
for (let i = 1901; i < 2022; i++) {
    const obj = {
        label: i,
        value: i
    }
    années.push(obj);
}


const date_de_naissance = state => {
    return state.année + "-" + state.mois + "-" + state.jour
}
const dataToSend = (state) => {
    const data = new URLSearchParams();
    data.append("date_de_naissance", date_de_naissance(state));
    data.append("nom", state.nom);
    data.append("prenom", state.prenom);
    data.append("email", state.email);
    data.append("mdp", state.mdp)
    return data;
}

const changeColorToRed = (currentTarget, errors) => {
    if (errors) {
        currentTarget.classList.add("active--input--wrong");
        currentTarget.parentNode.firstChild.classList.add("active--input--placeholder--wrong");
    } else {
        currentTarget.classList.remove("active--input--wrong");
        currentTarget.parentNode.firstChild.classList.remove("active--input--placeholder--wrong");
    }
}


const getSchemaValue = (inputName, schema) => {
    for (let key of schema._ids._byKey.entries()) {
        if (key[1].id === inputName) return key[1].schema;
    }
}

const validate = (input) => {
    const obj = { [input.name]: input.value };
    const schema = Joi.object({ [input.name]: getSchemaValue(input.name, globalSchema) });
    let { error } = schema.validate(obj, { abortEarly: false });
    return error ? error.details[0].message : null;
}


export default function Signup({ location, history }) {

    const [suivant, setSuivant] = useState(0);
    const [state, setState] = useState({ nom: "", prenom: "", email: "", mdp: "", jour: "1", mois: "1", année: "2000", redirect: false, errors: { nom: "", prenom: "", email: "", mdp: "" } });

    const disableSuivantButton = () => {
        let disableState = { ...state.errors };

        if (suivant !== 2) {
            disableState["mdp"] = null;
        };
        for (let prop in disableState) {
            if (disableState[prop] !== null) return "disabled";
        }
        return false
    }

    const setClick = async () => {
        setSuivant(prevSuivant => prevSuivant === 2 ? prevSuivant : prevSuivant + 1);
        if (suivant === 2) {
            try {
                const { data, headers } = await http.post(
                    serverPath + 'signup.php',
                    dataToSend(state),
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
                    return { ...prevState, redirect: true }
                });
            } catch (error) {
                toast.error(error.response)
            }

        }
    }

    const setBirth = ({ currentTarget: input }) => {
        let name = input.name;
        let value = input.value;
        setState(state => {
            let prevState = { ...state };
            prevState[name] = value;
            return prevState;
        });
    }


    const setChange = ({ currentTarget: input }) => {
        let name = input.name;
        let value = input.value;
        setState(state => {
            let prevState = { ...state };
            prevState[name] = value;
            return prevState;
        });
        changeColorToRed(input, validate(input));
        setState(state => {
            let prevState = { ...state };
            prevState.errors[name] = validate(input);
            return prevState;
        });
    }

    return (
        <Fragment>
            {(state.redirect && <Redirect to="/signup_complete"></Redirect>)}
            {(getUser() && (getUser().completed === "1") && <Redirect to="/flux"></Redirect>)}
            {(getUser() && (getUser().completed === "0") && <Redirect to="/signup_complete"></Redirect>)}
            <div className="div--wrap">
                <div className="div--signup--login">
                    <div className="header--div--signup--login">
                        {suivant === 0 && <NavLink className="signup--navlink customize--login--button" to="/login">Login ?</NavLink>}
                        {suivant >= 1 && <div className="arrowBack--button" onClick={() => setSuivant((pre) => pre - 1)}><IconButton>
                            <ArrowBackIcon></ArrowBackIcon>
                        </IconButton></div>}
                        <TwitterIcon></TwitterIcon>
                        <button className={"signup--suivant--button " + (disableSuivantButton() ? 'button--opacity' : "")} disabled={disableSuivantButton()} onClick={(e) => setClick(e)} type="button" >{suivant < 2 ? "Suivant" : "S'inscrire"}</button>
                    </div>
                    <div className="body--signup--personnaliser--mdp">
                        {suivant === 0 && (<div className="body--signup">
                            <h2 className="signup--titre">Créer votre compte</h2>
                            <Input value={state.nom} error={state.errors.nom} handleChange={setChange} inputType='text' inputName='nom' spanValue="Nom"></Input>
                            <Input value={state.prenom} error={state.errors.prenom} handleChange={setChange} inputType='text' inputName='prenom' spanValue="Prénom"></Input>
                            <Input value={state.email} error={state.errors.email} handleChange={setChange} inputType='email' inputName='email' spanValue="Email"></Input>
                            <h4>Date de naissance</h4>
                            <p>Cette information ne sera pas affichée publiquement. Confirmez votre age, meme si ce compte est pour une entreprise, un animal de compagnie ou autre chose.</p>
                            <div className="selects">
                                <Select name='mois' handleChange={setBirth} value={state.mois} placeholdeSpan='Mois' options={mois}></Select>
                                <Select name='jour' handleChange={setBirth} value={state.jour} placeholdeSpan='Jour' options={jours}></Select>
                                <Select name='année' handleChange={setBirth} value={state.année} placeholdeSpan='Année' options={années}></Select>
                            </div>
                        </div>)}
                        {suivant === 1 && (<div className="body--personnaliser">
                            <h2 className="signup--titre">Personnaliser Votre experience</h2>
                            <h3>Suivez les endroits où vous voyez du contenu Twitter sur le Web.</h3>
                            <div className="wrap--check--p">
                                <p>Twitter utilise ces données pour personnaliser votre expérience. Cet historique de navigation ne sera jamais stocké avec votre nom, votre adresse email ou votre numéro de téléphone.</p>
                                <input type="checkbox" readOnly checked name="checkBox-personnaliser" />
                            </div>
                        </div>)}
                        {suivant >= 2 && (<div className="body--mdp">
                            <h2 className="signup--titre">Il vous faut un mot de passe</h2>
                            <label>Vérifiez qu'il contient au moins 8 caractères.</label><br></br>
                            <Input value={state.mdp} error={state.errors.mdp} handleChange={setChange} inputType='password' inputName='mdp' spanValue="Mot de passe"></Input><br></br>
                        </div>)}
                    </div>
                </div>
            </div>
        </Fragment>
    )
};
