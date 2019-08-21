import React, { useEffect, Fragment } from "react";
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../Layout/Spinner";
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';

import { getCurrentProfile, deleteAccount } from "../../actions/profile";

const Dashboard = ({
  getCurrentProfile,
  deleteAccount,
  profile: { profile, loading },
  auth: { user }
}) => {
  useEffect(() => {
    getCurrentProfile();
  }, [getCurrentProfile]);

  return loading && profile === null ? (
    <Spinner />
  ) : (
    <Fragment>
      <h1 className="large text-primary">Dashboard</h1>
      <p className="lead">
        <i className="fas fa-user" />
        Welcome {user && user.firstName + " " + user.lastName}
      </p>
      {profile !== null ? (
        <Fragment>
            <DashboardActions />
            <Experience experience={profile.experience} />
            <Education education={profile.education} />
            <div className="my-2">
              <button className="btn btn-danger" onClick={() => deleteAccount()}>
              <i className="fas fa-user-minus"/>{' '}
              Delete My Account
              </button>
            </div>
        </Fragment>
      ) : (
        <Fragment>
            <p>You have not yet setup a profile, please add some info</p>
            <Link to='create-profile' className="btn btn-primary my-1">
            Create Profile
            </Link>
        </Fragment>
      )}
    </Fragment>
  );
};

Dashboard.prototype = {
  auth: PropTypes.object.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  deleteAccount: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
});
export default connect(
  mapStateToProps,
  { getCurrentProfile, deleteAccount }
)(Dashboard);
