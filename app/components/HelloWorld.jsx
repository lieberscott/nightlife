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
      token: '',
      twitter_id: '',
      user_names: []
    };
    this.onSuccess = this.onSuccess.bind(this)
    this.onFail = this.onFail.bind(this)
  }


  onSuccess(res) {
    const token = res.headers.get('x-auth-token');
    res.json().then((user) => { // user :  { id: '81957315', name: 'Scott Lieber' }
      if (token) {
        localStorage.setItem('nightlife', JSON.stringify({ name: user.name, token: token, twitter_id: user.id })); // localStorage can only be set as a string, so we use JSON.stringify
        this.setState({
          loggedIn: true,
          name: user.name,
          token: token,
          twitter_id: user.id
        });
      }
    });
  };

  onFail(err) {
    console.log(err);
  };

  logout() {
    localStorage.removeItem('nightlife');
    this.setState({
      loggedIn: false,
      token: '',
      user: null})
  };

  search() {
    console.log("search");
    let loc = document.getElementById("location").value;
    localStorage.setItem('nightlifesearch', loc);
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


  componentDidMount() {
        
    const local = localStorage.getItem('nightlife');
    const loc = localStorage.getItem('nightlifesearch');
    if (local) {
      let info = JSON.parse(local);
      this.setState({
        loggedIn: true,
        name: info.name,
        token: info.token,
        twitter_id: info.twitter_id
      });
    }
    
    if (loc) {
      let url = "/api/?loc=" + loc;
      fetch(url)
      .then((res) => res.json())
      .then((json) => {
      this.setState({
        bars: json.data // will be an array of objects
      })
    })
    .catch(err => console.log(err));
    }
    
    else if (navigator.geolocation) {
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
            <Bar key={ bar.id } yelp_id={ bar.id } twitter_id={ this.state.twitter_id } user_name={ this.state.name } user_namesArr={ bar.user_names } loggedIn={ this.state.loggedIn } name={ bar.name } rating={ bar.rating } price={ bar.price } image_url={ bar.image_url } loc={ bar.location.address1 } />
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
*/

module.exports = HelloWorld;
