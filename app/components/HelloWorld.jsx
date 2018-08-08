// const React = require('react');
import React, { Component } from 'react';
const Link = require('react-router-dom').Link
import TwitterLogin from 'react-twitter-auth'; // must be like this or won't work
const Login = require('./Login');
const Bar = require('./Bar');
const Search = require('./Search');

class HelloWorld extends Component {
  constructor() {
    super();
    this.state = {
      bars: [], // will be an array of objects
      loggedIn: false,
      name: null,
      token: ''
    };
    this.onSuccess = this.onSuccess.bind(this)
  }


  onSuccess(res) {
    const token = res.headers.get('x-auth-token');
    res.json().then((user) => {
      console.log(user);
      if (token) {
        this.setState({
          loggedIn: true,
          name: user,
          token: token
        });
      }
    });
  };

  onFail(err) {
    console.log(err);
  };

  logout() {
    this.setState({
      loggedIn: false,
      token: '',
      user: null})
  };

  search() {
    console.log("search");
    let loc = document.getElementById("location").value;
    let url = "/api/?&loc=" + loc;
    fetch(url)
    .then((res) => res.json())
    .then((json) => {
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
  }

  render() {
    return (
      <div>
        { this.state.loggedIn ?
          <Login loggedIn={ this.state.loggedIn } name={ this.state.name } logout={ () => this.logout() } /> :
          <TwitterLogin loginUrl="https://easy-stitch.glitch.me/auth/twitter" onFailure={ this.onFail } onSuccess={ this.onSuccess }
         requestTokenUrl="https://easy-stitch.glitch.me/auth/twitter/reverse" /> }
        <Search search={ () => this.search() }/>
        <div className="row">
          { this.state.bars.map(bar =>
            <Bar key={ bar.id } loggedIn={ this.state.loggedIn } name={ bar.name } rating={ bar.rating } price={ bar.price } image_url={ bar.image_url } loc={ bar.location.address1  } />
          )}
        </div>
      </div>
    )
  }
}

/*
App.propTypes = {
  bars: PropTypes.array
}
*/
HelloWorld.defaultProps = {
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

module.exports = HelloWorld;
