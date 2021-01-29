import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
import { getUser } from '../services/auth';


const RedirectToHome = () => {

    return (
        <Fragment>
            {!getUser() && <Redirect to="/signup"></Redirect>}
            {(getUser() && (getUser().completed === "0") && <Redirect to="/signup_complete"></Redirect>)}
            {(getUser() && (getUser().completed === "1") && <Redirect to="/flux"></Redirect>)}
        </Fragment >
    )
}

export default RedirectToHome;