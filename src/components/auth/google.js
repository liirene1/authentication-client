import React, { Component } from 'react';
import * as actions from '../../actions';
import {connect} from 'react-redux';

class Google extends Component {
  constructor(props) {
    super(props);
    this.onSignIn.bind(this);
  }

  componentDidMount() {
    gapi.load('auth2', () => {

      console.log('gapi in load', gapi.auth2);
      gapi.auth2.init({
        client_id: '227964482032-f7p86kksnjgem08asg85q3jk5m3u5pd9.apps.googleusercontent.com',
        fetch_basic_profile: true
      })
      .then((googleAuth) => {
        console.log("inside .then function", googleAuth)
        googleAuth.attachClickHandler(document.getElementById('googlesignin'), {}, (googleUser) => {
          console.log("this in click handler", this);
            this.onSignIn(googleUser);
            console.log(googleUser.getBasicProfile().getName());
          }, function(error) {
            alert(JSON.stringify(error, undefined, 2));
          });
      })
    });
  }

  onSignIn(googleUser) {
    console.log("google is signed in!");

    const profile = googleUser.getBasicProfile();

    console.log('Name: ' + profile.getName());
    console.log('Email: ' + profile.getEmail());

    const name = profile.getName();
    const email = profile.getEmail();
    var id_token = googleUser.getAuthResponse().id_token;
    console.log('id token to send to backend', id_token);

    const names = name.split(" ");
    const first_name = names[0];
    const last_name = names[1] || "";
    console.log(names, first_name, last_name);

    //this.props.socialSignin({ type: "Google", first_name, last_name, email});
  }

  render() {
    return (
      <button className="social_media_login google" id="googlesignin">
        <span className="login_social_text center_align">Log in with Google</span>
      </button>
    );
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default connect(mapStateToProps, actions)(Google);
