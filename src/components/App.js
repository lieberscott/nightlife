import React from 'react';
import PropTypes from 'prop-types'; // https://www.npmjs.com/package/prop-types
import Bar from './Bar';
import Login from './Login';
import Search from './Search';
import fetch from 'node-fetch';



class App extends React.Component {
  state = {
    bars: [], // will be an array of objects
    loggedIn: false,
    name: null
  };

  login() {
    fetch('/auth/twitter') // in the server, this will ultimately redirect to ('/')
    .then((res) => res.json())
    .then((json) => {
      this.setState({
        loggedIn: json.loggedIn,
        name: json.name
      })
    })
  }

  logout() {
    fetch('/logout') // in the server, this will ultimately redirect to ('/')
    .then((res) => res.json())
    .then((json) => {
      this.setStaet({
        loggedIn: json.loggedIn,
        name: json.name
      });
    });
  }

  search() {
    let loc = document.getElementById("location").value;
    let url = "/api/?&loc=" + loc;
    fetch(url)
    .then((res) => res.json())
    .then((json) => {
      console.log(json);
      this.setState({
        bars: json.data // will be an array of objects
      })
    })
    .catch(err => console.log(err));
  }

  componentWillMount() {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        let lat = pos.coords.latitude;
        let lon = pos.coords.longitude;
        let url = "/api/?&lat=" + lat + "&lon=" + lon;

        fetch(url)
        .then((res) => res.json())
        .then((json) => {
          this.setState({
            bars: json.data // will be an array of objects
          })
        })
        .catch(err => console.log(err));

      });
    }

    fetch('/checklogin')
    .then((res) => res.json())
    .then((json) => {
      this.setState({
        loggedIn: json.loggedIn,
        name: json.name
      });
    });

  }

  render() {
    return (
      <div>
        <Login loggedIn={ this.state.loggedIn } name={ this.state.name } login={ () => this.login() } logout={ () => this.logout() } />
        <Search search={ () => this.search() }/>
        <div className="row">
          { this.state.bars.map(bar =>
            <Bar key={ bar.id } { ...bar } />
          )}
        </div>
      </div>
    )
  }
}

App.propTypes = {
  bars: PropTypes.array
}

App.defaultProps = {
  bars: [{
    id: 1,
    name: "Loading",
    rating: null,
    price: null,
    img_url: null,
    location: {
      address1: null
    }
  }]
}

export default App;
