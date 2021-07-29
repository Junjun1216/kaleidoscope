// import React, { useState } from 'react';
import Login from './components/login_forms';
import Register from './components/register_forms';
import HomeFooter from "./components/home_footer";
import { BrowserRouter as Router, Switch, Route, useHistory } from 'react-router-dom';
import "./css/App.css";

const AppWrapper = () => {
    return (
        <Router>
            <App/>
        </Router>
    )
}

const App = () => {
    let history = useHistory();

    const loginUser = async (login) => {
        const url = 'http://localhost:3001/login';
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "include",
            body: JSON.stringify({
                username: login.usernameText,
                password: login.passwordText
            })
        };

        await fetch(url, options)
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    history.push(res.url.replace('http://localhost:3001/', ''));
                }
            });
    }

    const registerUser = async (register) => {
        const url = 'http://localhost:3001/register';
        const options = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                email: register.emailText,
                username: register.usernameText,
                password: register.passwordText
            })
        };

        await fetch(url, options)
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    history.push(res.url.replace('http://localhost:3001/', ''));
                }
            });
    }

    return (
        <div className="App">
            <Switch>
                <Route path="/login" exact>
                    <Login loginUser={loginUser}/>
                    <HomeFooter/>
                </Route>
                <Route path="/register" exact>
                    <Register registerUser={registerUser}/>
                    <HomeFooter/>
                </Route>
                <Route path="/" exact>
                    <Register registerUser={registerUser}/>
                    <HomeFooter/>
                </Route>
            </Switch>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.0/dist/css/bootstrap.min.css"
                  integrity="sha384-B0vP5xmATw1+K9KRQjQERJvTumQW0nPEzvF6L/Z6nronJ3oUOFUFpCjEUQouq2+l"
                  crossOrigin="anonymous"/>
        </div>
    )
}

export default AppWrapper;
