import { useState } from 'react';
import Login from './components/login_forms';
import Register from './components/register_forms';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./App.css";

const App = () => {

    const submitForms = async (login) => {
        console.log(login)
    }

    return (
        <Router>
            <div className="App">
                <Route path="/login" component={Login}/>
                <Route path="/Register" component={Register}/>
            </div>
        </Router>
    );
}

export default App;
