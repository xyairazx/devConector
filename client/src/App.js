import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import Landing from "./components/Layout/Landing";
import Navbar from "./components/Layout/Navbar";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Alert from './components/Layout/alert';
import { loadUser} from './actions/auth';
import setAuthToken  from './utills/setAuthToken';
import PrivateRouter from '../src/components/routing/PrivateRoter';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';
//redux
import { Provider } from "react-redux";
import store from "./store";

if (localStorage.token) {
  setAuthToken(localStorage.token)
}

const App = () => {

  useEffect(()=> {
    store.dispatch(loadUser());
  },[]);

  return(
  <Provider store={store}>
    <Router>
      <Fragment>
        <Navbar />
        <Route exact path="/" component={Landing} />
        <section className="container">
          <Alert />
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/profile/:id" component={Profile} />
            <Route exact path="/profiles" component={Profiles} />
            <PrivateRouter exact path="/dashboard" component={Dashboard} />
            <PrivateRouter exact path="/create-profile" component={CreateProfile} />
            <PrivateRouter exact path="/edit-profile" component={EditProfile} />
            <PrivateRouter exact path='/add-experience' component={AddExperience} />
            <PrivateRouter exact path='/add-education' component={AddEducation} />
            <PrivateRouter exact path='/posts' component={Posts} />
            <PrivateRouter exact path='/posts/:id' component={Post} />

          </Switch>
        </section>
      </Fragment>
    </Router>
  </Provider>
);
}
export default App;
