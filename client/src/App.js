import Home from "./components/home/home.js";
import Dashboard from "./components/dashboard/dashboard.js";
import Room from "./components/room/room.js";
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/room/:roomID" component={Room}/>
                <Route exact path="/dashboard" component={Dashboard}/>
                <Route path="/" component={Home}/>
            </Switch>
        </Router>
    )
}

export default App;
