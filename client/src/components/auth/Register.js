import React, { Fragment, useState } from "react";
import { connect } from 'react-redux';
import { setAlert } from '../../actions/alert'
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';

//import axios from 'axios';

const Register = ({ setAlert }) => {
  let [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    password2: ""
  });

  const { firstName, lastName, email, password, password2 } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e =>{
      e.preventDefault();
      if (password !== password2) {
        setAlert('the password dosnt matched', 'danger');
      }
      else{
        console.log('SUCCESS');
       /*
       axios requst without redux
       const newUser= {
          firstName,
          lastName,
          email,
          password
        }

        try {
          const config= {
            headers: {
              'Content-Type': 'application/json'
            }
          }
          const body = JSON.stringify(newUser);

          const res = await axios.post('/api/users',body,config);
          console.log(res.data);
        } catch (err) {
          console.error(err.response.data);
        }
        */
      } 
    };
  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user" /> Create Your Account
      </p>
      <form className="form" onSubmit={e =>onSubmit(e)}>
        <div className="form-group">
          <input
            type="text"
            placeholder="First Name"
            name="firstName"
            value={firstName}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            placeholder="Last Name"
            name="lastName"
            value={lastName}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={e => onChange(e)}
            required
          />
          <small className="form-text">
            This site uses Gravatar so if you want a profile image, use a
            Gravatar email
          </small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            minLength="6"
            value={password}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            minLength="6"
            value={password2}
            onChange={e => onChange(e)}
            required
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};


Register.PropTypes = {
  setAlert: PropTypes.func.isRequired
};

export default connect(null, { setAlert })(Register);
