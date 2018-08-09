const React = require('react');
// import PropTypes from 'prop-types'; // https://www.npmjs.com/package/prop-types

class Bar extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      countMeIn: false, // coming from Mongo
      numberGoing: this.props.user_namesArr.length, // ANTI-PATTERN: DO NOT (NORMALLY) DO THIS
      user_id: this.props.twitter_id, // setting state with props is an anti-pattern because state is only set
      user_name: this.props.user_name, // once, upon first load. it's very error prone.
      yelp_id: this.props.yelp_id, // may use componentDidUpdate(prevProps) function if necessary
      user_namesArr: this.props.user_namesArr
    };
  }
  
  componentDidUpdate(prevProps, prevState) {
    if (this.state.user_namesArr.includes(this.props.user_name) && !prevState.countMeIn) {
      this.setState({
        countMeIn: true
      });
    }
  }
  

  rsvp() {
    let url = '/rsvp/?&yelp_id=' + this.props.yelp_id + '&user_id=' + this.props.twitter_id + '&user_name=' + this.props.user_name;
    fetch(url, { method: "POST" })
    .then((res) => res.json())
    .then((json) => {
      this.setState({
        numberGoing: this.state.numberGoing + 1,
        countMeIn: true
      });
    })
  }
  
  unrsvp() {
    let url = '/unrsvp/?&yelp_id=' + this.props.yelp_id + '&user_id=' + this.props.twitter_id + '&user_name=' + this.props.user_name;
    fetch(url, { method: "POST" })
    .then((res) => res.json())
    .then((json) => {
      this.setState({
        numberGoing: this.state.numberGoing - 1,
        countMeIn: false
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
            this.state.countMeIn ?
            <span onClick={ () => this.unrsvp() }>You're going!</span> : // if logged in and already RSVP'd
            <span onClick={ () => this.rsvp() }>Count me in!</span> : // if logged in but not yet RSVP'd
            <span> Please log in </span> // if not logged in
          }
        </div>
      </div>
    )
  }

}

module.exports = Bar;
