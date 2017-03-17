import React, { Component } from 'react';
import * as actions from '../../actions';
import {connect} from 'react-redux';

class Facebook extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '148248172277448',
        cookie     : true,  // enable cookies to allow the server to access
                          // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.1' // use version 2.1
      });

      // Now that we've initialized the JavaScript SDK, we call
      // FB.getLoginStatus().  This function gets the state of the
      // person visiting this page and can return one of three states to
      // the callback you provide.  They can be:
      //
      // 1. Logged into your app ('connected')
      // 2. Logged into Facebook, but not your app ('not_authorized')
      // 3. Not logged into Facebook and can't tell if they are logged into
      //    your app or not.
      //
      // These three cases are handled in the callback function.
      FB.getLoginStatus(function(response) {
        this.statusChangeCallback(response);
      }.bind(this));
    }.bind(this);

    // Load the SDK asynchronously
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  alertError() {
    alert('Facebook login failed. Unable to get your profile information. Please check your Facebook security settings or use our sign up form.')
  }

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  testAPI(id_token) {
    console.log("this in testAPI", this);
    console.log('testAPI - Fetching your information.... ');
    FB.api('/me', { locale: 'tr_TR', fields: 'name, email' }, function(response) {
      console.log('response in testAPI', response);  //id,name, email
      console.log("this", this);
      if (response.name === undefined || response.email === undefined) {
        alertError();
      } else {
        const names = response.name.split(" ");
        const first_name = names[0];
        const last_name = names[1] || "";
        const email = response.email;
        console.log("send to actions", first_name, last_name, email);
        //this.props.socialSignin({ type: "Facebook", first_name, last_name, email});
      }
    }.bind(this));
  };

  // This is called with the results from from FB.getLoginStatus().
  statusChangeCallback(response) {
    console.log('statusChangeCallback', response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      var accessToken = response.authResponse.accessToken;
      console.log("FB accessToken", accessToken);
      console.log("this in statusChangeCallback", this);
      this.testAPI(accessToken).bind(this);
    } else if (response.status === 'not_authorized') {
      // The person is logged into Facebook, but not your app.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    } else {
      // The person is not logged into Facebook, so we're not sure if
      // they are logged into this app or not.
      console.log("in status change callback else - render a div for 'sign into facebook again' ");
    }
  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
  checkLoginState() {
    FB.getLoginStatus(function(response) {
      this.statusChangeCallback(response);
    }.bind(this));
  }

  handleClick() {
    console.log("inside handleClick", this);
    FB.login(this.checkLoginState());
  }

  render() {
    return (
          <button onClick={this.handleClick.bind(this)} className="social_media_login facebook">
            <span className="login_social_text center_align">Log in with Facebook</span>
          </button>
    );
  }
}

function mapStateToProps(state) {
  return { errorMessage: state.auth.error };
}

export default connect(mapStateToProps, actions)(Facebook);
