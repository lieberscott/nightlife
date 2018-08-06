import React from 'react';
// import PropTypes from 'prop-types'; // https://www.npmjs.com/package/prop-types

class Bar extends React.Component {
  state = {
    countMeIn: false, // coming from Mongo
    loggedIn: true,
    numberGoing: 0, // coming from Mongo
    key: this.props.id // yelp ID from api call
  }

  rsvp() {
    let url = '/rsvp/?&yelp_id=' + key;
    fetch(url, { method: "POST" })
    .then((res) => res.json())
    .then((json) => {
      this.setState({
        numberGoing: this.state.numberGoing + 1,
        countMeIn: true
      });
    })
  }

  render() {
    return (
      <div className="col-md-3 onecomponent">
        <div>
          { this.props.name }
        </div>
        <div>
          { this.props.rating } { this.props.price }
        </div>
        <div className="image">
          <img src={ this.props.image_url } />
        </div>
        <div>
          { this.props.location.address1 }
        </div>
        <hr/>
        <div>
          { this.state.numberGoing } going
          { this.state.loggedIn ? <span onClick={ this.rsvp }>Count me in</span> : <span onClick={ this.login }> Please log in </span> }
        </div>
      </div>
    )
  }
}

export default Bar;
