import React, { Component } from "react";
import axios from "axios";

class Home extends Component {
  state = {
    yearlyData: null,
    isError: false
  };

  getData = async () => {
    const { props } = this;

    try {
      const accessToken = await props.auth.getAccessToken();
      const response = await axios({
        method: "post",
        url: "http://localhost:4000/users/getdata",
        headers: {
          Authorization: accessToken
        }
      });
      this.setState({ yearlyData: response.data });
    } catch (error) {
      const { name } = error.response.data;

      this.setState({ isError: true });

      if (name === "JwtParseError") {
        props.auth.redirect();
      }
    }
  };

  render() {
    const {
      state: { yearlyData, isError }
    } = this;

    return (
      <div>
        {!yearlyData &&
          !isError && (
            <button
              type="button"
              className="btn btn-primary m-3"
              onClick={this.getData}
            >
              Request Information
            </button>
          )}

        {!yearlyData &&
          isError && (
            <div className="alert alert-danger m-3" role="alert">
              There has been an error fetching data from the server.
            </div>
          )}

        {yearlyData &&
          !isError &&
          yearlyData.map(({ year, completed, total }) => (
            <div className="m-3" key={year}>
              <h4>{year}</h4>

              <div className="progress">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${(completed / total) * 100}%` }}
                  aria-valuenow={completed}
                  aria-valuemin="0"
                  aria-valuemax={total}
                />
              </div>
            </div>
          ))}
      </div>
    );
  }
}

export default Home;
