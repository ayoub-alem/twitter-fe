import React, { useState, useEffect, useRef, Fragment } from 'react';
import Joi from 'joi';
import { Redirect } from 'react-router-dom';
import http, { cookies } from './../services/httpService.js';
import serverPath from './../services/serverPath.js';
import { getUser } from './../services/auth.js';
import getSubjects from '../services/getSubjects.js';
import Subject from './subject.jsx';
import Input from './input';
import User from './user.jsx';
import getSuggestedUsers from '../services/getSuggestedUsers.js';
import { toast } from 'react-toastify';
import AddAPhotoIcon from '@material-ui/icons/AddAPhoto';
import TwitterIcon from '@material-ui/icons/Twitter';
import "./../css/signup.css";
import "./../css/signupPic.css";
import picturesPath from '../services/picturesPath.js';

let globalSchema = Joi.object({
    description: Joi.string().allow("").max(160).label("Description").min(0)
});


const photoToSend = (fileRef) => {
    const data = new FormData();
    const user = getUser();
    data.append("photo", fileRef.current.files[0]);
    data.append("user_id", user.user_id);
    return data;
}
const followToSend = (prop, value) => {
    const data = new FormData();
    data.append(prop, value);
    return data;
}
const bioToSend = (state) => {
    const data = new URLSearchParams();
    const user = getUser();
    data.append("description", state.description);
    data.append("user_id", user.user_id);
    return data;
}

const subjectsToSend = (state) => {
    return {
        sujets: [...state.selectedSubjects]
    };
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


export default function SignupPic({ location }) {

    const [suivant, setSuivant] = useState(0);
    const [disabledPicPhase, setPicPhase] = useState(false);
    const [state, setState] = useState({ photo: false, render: false, suggestedUsers: [], description: "", subjects: [], selectedSubjects: [], errors: { description: "" } });
    const fileRef = useRef();
    const imageRef = useRef();

    useEffect(() => {
        if (getUser()) {
            if (getUser().completed === "0") {
                const fetchSubjects = async () => {
                    const subjects = await getSubjects();
                    setState(prevState => {
                        return {
                            ...prevState,
                            subjects
                        }
                    })
                };
                const fetchSuggestedUsers = async () => {
                    const suggestedUsers = await getSuggestedUsers();
                    setState(prevState => {
                        return {
                            ...prevState,
                            suggestedUsers
                        }
                    })
                };
                fetchSubjects();
                fetchSuggestedUsers();
            }
        }
    }, [])



    const handleSelectSubject = (e) => {
        if (e.currentTarget.classList.contains("subject--active")) {
            e.currentTarget.classList.remove("subject--active");
            const subjectValue = e.currentTarget.id
            setState(prevState => {
                let selectedSubjects = prevState.selectedSubjects.filter((value) => value !== subjectValue);
                return { ...prevState, selectedSubjects: selectedSubjects };
            });
        } else {
            e.currentTarget.classList.add("subject--active");
            const subjectValue = e.currentTarget.id;
            setState(prevState => {
                return {
                    ...prevState, selectedSubjects: [...prevState.selectedSubjects, subjectValue],
                }
            })
        }
    }
    const appliquerOuPasser = (suivant) => {
        if (suivant === 0 && state.photo) {
            return true;
        }
        else if (suivant === 0 && !state.photo) {
            return false;
        } else if (suivant === 1 && state.description !== "") {
            return true
        } else if (suivant === 1 && state.description === "") {
            return false
        } else if (suivant === 2 && (state.selectedSubjects.length === 0)) {
            return false
        } else {
            return true;
        }
    }

    const disableSuivantButton = () => {
        let disableState = { ...state.errors };
        for (let prop in disableState) {
            if (!(disableState[prop] === null || disableState[prop] === "" || state.description === "")) return "disabled";
        }
        return false
    }

    const setClick = async () => {
        if (suivant === 0 && state.photo) {
            setPicPhase(true);
            try {
                const { data, headers } = await http.post(
                    serverPath + 'signup_photo.php',
                    photoToSend(fileRef),
                    http.urlEncoded(cookies.get("x-auth-token"))
                );
                toast.success(data, { toastId: "send-photo-response" });
                if (headers['x-auth-token']) {
                    cookies.remove("x-auth-token");
                    cookies.set('x-auth-token', headers['x-auth-token'], {
                        path: '/',
                        maxAge: 3600 * 24 * 30 * 12
                    });
                }
                setSuivant(prevSuivant => prevSuivant === 3 ? prevSuivant : prevSuivant + 1);
                setPicPhase(false);
                console.log(headers['x-auth-token']);
            } catch (error) {
                toast.error(error.response, { toastId: "send-photo-response" })
                setPicPhase(false);
            }

        } else if (suivant === 0 && !state.photo) {
            setSuivant(prevSuivant => prevSuivant === 3 ? prevSuivant : prevSuivant + 1);
        } else if (suivant === 1 && state.description) {
            setPicPhase(true);
            try {
                const { data, headers } = await http.post(
                    serverPath + 'signup_bio.php',
                    bioToSend(state),
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
                setSuivant(prevSuivant => prevSuivant === 3 ? prevSuivant : prevSuivant + 1);
                setPicPhase(false);
                console.log(headers['x-auth-token']);
            } catch (error) {
                setPicPhase(false);
                toast.error(error.response)
            }

        } else if (suivant === 1 && !state.description) {
            setSuivant(prevSuivant => prevSuivant === 3 ? prevSuivant : prevSuivant + 1);
        }
        else if (suivant === 2 && !state.selectedSubjects.length) {
            setSuivant(prevSuivant => prevSuivant === 3 ? prevSuivant : prevSuivant + 1);
        }
        else if (suivant === 2 && state.selectedSubjects.length) {
            setPicPhase(true);
            try {
                const { data, headers } = await http.post(
                    serverPath + 'signup_sujets.php',
                    subjectsToSend(state),
                    http.configJson(cookies.get("x-auth-token"))
                );
                toast.success(data);
                if (headers['x-auth-token']) {
                    cookies.remove("x-auth-token");
                    cookies.set('x-auth-token', headers['x-auth-token'], {
                        path: '/',
                        maxAge: 3600 * 24 * 30 * 12
                    });
                }
                setPicPhase(false);
                setSuivant(prevSuivant => prevSuivant === 3 ? prevSuivant : prevSuivant + 1);
                console.log(headers['x-auth-token']);
            } catch (error) {
                setPicPhase(false);
                toast.error(error.response)
            }
        }
        else if (suivant === 3) {
            setPicPhase(true);
            try {
                const { data, headers } = await http.get(
                    serverPath + 'signup_completed.php',
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
                setSuivant(prevSuivant => prevSuivant === 3 ? prevSuivant : prevSuivant + 1);
                setPicPhase(false);
                setState(prevState => {
                    return {
                        ...prevState, render: true
                    }
                })
            } catch (error) {
                setPicPhase(false);
                toast.error(error.response)
            }
        }
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

    const handleImage = () => {
        let input = fileRef.current;
        if (input.files && input.files[0]) {
            setState(state => {
                const prevState = { ...state };
                prevState.photo = true;
                return prevState;
            })
            var reader = new FileReader();
            reader.onload = (e) => imageRef.current.src = e.target.result;
            reader.readAsDataURL(input.files[0]);
        }
    }
    const onSuivre = async (e) => {
        if (e.currentTarget.classList.contains("suivre--active")) {
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
            target.classList.add("suivre--active");
            e.currentTarget.innerHTML = "Abonné";
            let followed_id = target.id;
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
            {(state.render && <Redirect to="/flux"></Redirect>)}
            {!getUser() && <Redirect to='/signup'></Redirect>}
            {(getUser().completed === "1") && <Redirect to='/flux'></Redirect>}
            <div className="div--wrap" >
                <div className="div--signup--login">
                    <div className="header--div--signup--login customize--div--photo--page">
                        <TwitterIcon></TwitterIcon>
                        <button className={"signup--suivant--button customize--button--photo--page " + ((disableSuivantButton() || disabledPicPhase) ? 'button--opacity' : "")} disabled={disableSuivantButton() || disabledPicPhase ? true : false} onClick={(e) => setClick(e)} type="button" >{appliquerOuPasser(suivant) ? "Terminer" : "Passer pour le moment"}</button>
                    </div>
                    <div className="body--signup--personnaliser--mdp">
                        {suivant === 0 && (<div className="body--signup">
                            <h2 className="photo--signup--titre">Choisissez une image de profil</h2>
                            <p>Vous avez un style préféré ? Télécharger le vite.</p>
                            <div className="div--image">
                                <input ref={fileRef} accept="image/x-png,image/gif,image/jpeg" onChange={handleImage} type="file" name="photo" hidden />
                                <div onClick={() => fileRef.current.click()} className="addAphotoIcon"><AddAPhotoIcon></AddAPhotoIcon></div>
                                <img ref={imageRef} src={picturesPath + "default-pic.png"} alt="default user" />
                            </div>
                        </div>)}
                        {suivant === 1 && (<div className="body--personnaliser">
                            <h2 className="photo--signup--titre">Décrivez-vous</h2>
                            <p className="paragraphe-above-bio">Qu'est-ce qui fait de vous une personne spéciale ? Ne reflichissez pas trop et amusez-vous.</p>
                            <Input value={state.description} error={state.errors.description} handleChange={setChange} inputType='text' inputName='description' spanValue="Votre biographie"></Input><br></br>
                        </div>)}
                        {suivant === 2 && (<div className="body--mdp">
                            <h2 className="photo--signup--titre">Quels sont les sujets qui vous intéressent</h2>
                            <p className="paragraphe-above-bio">Séléectionnez des sujets qui vous intéressent afin de personnaliser votre expérience Twitter, notamment pour trouver des personnes a suivre.</p>
                            <div className="subject--container">
                                {state.subjects.map(value => <Subject key={value.sujet_id} id={value.sujet_id} onClick={handleSelectSubject} subjectLabel={value.sujet}></Subject>)}
                            </div>
                        </div>
                        )}
                        {suivant >= 3 && (<div className="body--mdp">
                            <h2 className="photo--signup--titre">Suggestions d'abonnements</h2>
                            <h5 className="paragraphe-above-bio h5--suggestions">Quand vous suivez quelqu'un, vous voyez ses Tweets dans votre fil d'actualités.</h5>
                            <h3 className="paragraphe-above-bio h3--suggestions">Vous pourriez être intéressé par</h3>
                            <div className="user--container">
                                {state.suggestedUsers.map(user => <User key={user.user_id} onClick={onSuivre} id={user.user_id} nom={user.nom} prenom={user.prenom} photo={user.photo} description={user.description} isFollowed={user.isFollowed}></User>)}
                            </div>

                        </div>)}
                    </div>
                </div>
            </div >
        </Fragment>
    )
};
