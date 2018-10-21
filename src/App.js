import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Security, ImplicitCallback } from "@okta/okta-react";
import AuthViews from "./AuthViews";
import Home from "./Home";

const config = {
  issuer: "https://dev-674288.oktapreview.com/oauth2/default",
  redirect_uri: window.location.origin + "/implicit/callback",
  client_id: "0oagr4td3sYTNYhcX0h7"
};

const HomeWithAuth = () => (
  <AuthViews>{auth => <Home {...{ auth }} />}</AuthViews>
);

class App extends Component {
  render() {
    return (
      <div>
        <Router>
          <Security
            issuer={config.issuer}
            client_id={config.client_id}
            redirect_uri={config.redirect_uri}
          >
            <Route path="/" exact={true} component={HomeWithAuth} />
            <Route path="/implicit/callback" component={ImplicitCallback} />
          </Security>
        </Router>
      </div>
    );
  }
}

export default App;
