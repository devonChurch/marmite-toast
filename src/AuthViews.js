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
            <div className="alert alert-success m-3" role="alert">
              <h4 className="alert-heading">
                Hi, {userName || "there"}. You are logged in.
              </h4>
              <hr />
              <button
                type="button"
                className="btn btn-light"
                onClick={this.logout}
              >
                Logout
              </button>
            </div>
            {this.props.children(this.props.auth)}
          </div>
        );
      case isAuthenticated === false:
        return (
          <div>
            <div className="alert alert-danger m-3" role="alert">
              <h4 className="alert-heading">
                You are <strong>not</strong> logged in.
              </h4>
              <hr />
              <button
                type="button"
                className="btn btn-light"
                onClick={this.login}
              >
                Login
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="alert alert-warning m-3" role="alert">
            Checking Authentication...
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
