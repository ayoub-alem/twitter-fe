import React, { Fragment } from 'react';
import { getUser } from '../services/auth';
import { Redirect, Route, Switch } from 'react-router-dom';
import "./../css/home.css"
import SideBar from './sideBar';
import Flux from './flux';
import FollowNewUsers from './followNewUsers';


const Home = () => {

    return (
        <Fragment>
            {!getUser() && <Redirect to="/signup"></Redirect>}
            {(getUser() && (getUser().completed === "0") && <Redirect to="/signup_complete"></Redirect>)}
            <div className="home--container--div">
                <SideBar></SideBar>
                <div className="flux--container--div">
                    <Switch>
                        <Route path="/flux" component={Flux} ></Route>
                        <Route path="/listes" component={FollowNewUsers} ></Route>
                    </Switch>
                </div>
            </div>
        </Fragment >
    )
}

export default Home;