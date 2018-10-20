import React, { Component } from "react";
import { withAuth } from "@okta/okta-react";

class AuthViews extends Component {
  state = {
    isAuthenticated: null,
    userName: null
  };

  componentDidMount() {
    this.checkAuthentication();
  }

  componentDidUpdate() {
    this.checkAuthentication();
  }

  async checkAuthentication() {
    const { props, state } = this;
    const isAuthenticated = await props.auth.isAuthenticated();
    const hasChanged = isAuthenticated !== state.isAuthenticated;

    if (hasChanged) {
      this.setState({ isAuthenticated });
    }

    if (hasChanged && isAuthenticated) {
      const userData = await props.auth.getUser();
      const userName = userData.given_name;
      this.setState({ userName });
    }
  }

  login = () => this.props.auth.login("/");
  logout = () => this.props.auth.logout("/");

  getAuthView = () => {
    const { isAuthenticated, userName } = this.state;

    switch (true) {
      case isAuthenticated === true:
        return (
          <div>
            <p>Hi, {userName || "there"}. You are logged in.</p>
            <p>
              <button onClick={this.logout}>Logout</button>
            </p>
            {this.props.children}
          </div>
        );
      case isAuthenticated === false:
        return (
          <div>
            <p>
              You are <strong>not</strong> logged in.
            </p>
            <p>
              <button onClick={this.login}>Login</button>
            </p>
          </div>
        );

      default:
        return (
          <div>
            <p>Checking Authentication...</p>
          </div>
        );
    }
  };

  render() {
    const { getAuthView } = this;

    return <div>{getAuthView()}</div>;
  }
}

export default withAuth(AuthViews);
