const React = require('react');
// import PropTypes from 'prop-types'; // https://www.npmjs.com/package/prop-types

class Bar extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      countMeIn: false, // coming from Mongo
      numberGoing: 0, // coming from Mongo
      id: this.props.key // bar's yelp ID from api call
    };
  }

  rsvp() {
    let url = '/rsvp/?&yelp_id=' + this.state.id;
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
          { this.props.loc }
        </div>
        <hr/>
        <div>
          { this.state.numberGoing } going
          {
            this.props.loggedIn ?
            this.props.countMeIn ?
            <span onClick={ this.unrsvp }>I'm going</span> : // if logged in and already RSVP'd
            <span onClick={ this.rsvp }>Count me in</span> : // if logged in but not yet RSVP'd
            <span onClick={ this.login }> Please log in </span> // if not logged in
          }
        </div>
      </div>
    )
  }

}

module.exports = Bar;
