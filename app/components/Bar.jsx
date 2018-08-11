const React = require('react');
// import PropTypes from 'prop-types'; // https://www.npmjs.com/package/prop-types
import { Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';

class Bar extends React.Component {  
  constructor(props) {
    super(props);
    this.state = {
      countMeIn: false, // coming from Mongo
      numberGoing: this.props.user_namesArr.length, // ANTI-PATTERN: DO NOT (NORMALLY) DO THIS
      starsUrl: "a",
      user_id: this.props.twitter_id, // setting state with props is an anti-pattern because state is only set
      user_name: this.props.user_name, // once, upon first load. it's very error prone.
      yelp_id: this.props.yelp_id, // may use componentDidUpdate(prevProps) function if necessary
      user_namesArr: this.props.user_namesArr,
      popover: false
    };
    this.toggle = this.toggle.bind(this);
  }
  
  generateStarImg(stars) {
    let starsUrl = "";
    switch(stars) {
      case 0:
        starsUrl = "https://cdn.glitch.com/f34ce293-1d70-4950-a37a-cb4cd8dde649%2F0.png?1533953882616";
        break;
        
      case 0.5:
        starsUrl = "https://cdn.glitch.com/f34ce293-1d70-4950-a37a-cb4cd8dde649%2F0.png?1533953882616"; // no 0.5 img, so reusing img for 0
        break;
        
      case 1:
        starsUrl = "https://cdn.glitch.com/f34ce293-1d70-4950-a37a-cb4cd8dde649%2F1.png?1533953882891";
        break;
        
      case 1.5:
        starsUrl = "https://cdn.glitch.com/f34ce293-1d70-4950-a37a-cb4cd8dde649%2F1.5.png?1533953882720";
        break;
        
      case 2:
        starsUrl = "https://cdn.glitch.com/f34ce293-1d70-4950-a37a-cb4cd8dde649%2F2.png?1533953882808";
        break;
        
      case 2.5:
        starsUrl = "https://cdn.glitch.com/f34ce293-1d70-4950-a37a-cb4cd8dde649%2F2.5.png?1533953883124";
        break;
        
      case 3:
        starsUrl = "https://cdn.glitch.com/f34ce293-1d70-4950-a37a-cb4cd8dde649%2F3.png?1533953883324";
        break;
        
      case 3.5:
        starsUrl = "https://cdn.glitch.com/f34ce293-1d70-4950-a37a-cb4cd8dde649%2F3.5.png?1533953883034";
        break;
        
      case 4:
        starsUrl = "https://cdn.glitch.com/f34ce293-1d70-4950-a37a-cb4cd8dde649%2F4.png?1533953883509";
        break;
        
      case 4.5:
        starsUrl = "https://cdn.glitch.com/f34ce293-1d70-4950-a37a-cb4cd8dde649%2F4.5.png?1533953883404";
        break;
        
      case 5:
        starsUrl = "https://cdn.glitch.com/f34ce293-1d70-4950-a37a-cb4cd8dde649%2F5.png?1533953883593";
        break;
    }
    this.setState({ starsUrl });
  }
  
  componentDidMount() { // need the same for DidMount and DidUpdate, in case user is signed in upon load (from previous session), or signs in after load
    if (this.state.user_namesArr.includes(this.props.user_name) && !this.state.countMeIn) {
      this.setState({
        countMeIn: true
      });
    }
    
    this.generateStarImg(this.props.rating);    
  }
  
  componentDidUpdate(prevProps, prevState) { // DidUpdate does NOT fire on initial render, only subsequent updates
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
      let newArr = this.state.user_namesArr;
      newArr.push(this.props.user_name);
      this.setState({
        user_namesArr: newArr,
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
      let ind = this.state.user_namesArr.indexOf(this.props.user_name);
      let newArr = this.state.user_namesArr;
      newArr.splice(ind, 1);
      this.setState({
        user_namesArr: newArr,
        numberGoing: this.state.numberGoing - 1,
        countMeIn: false
      });
    })
  }
  
  toggle() {
    this.setState({
      popover: !this.state.popover
    });
  }

  render() {
    return (
      <div className="col-lg-4 onecomponent">
        <a href={ this.props.bar_yelp_url } target="_blank">
        <div className="barname text-center">
          { this.props.name }
        </div>
        <div className="priceline">
          <img className="stars" src={ this.state.starsUrl } /> { this.props.review_count } reviews <span className="price">{ this.props.price }</span>
        </div>
        <div className="image">
          <img class="mainimg" src={ this.props.image_url } />
        </div>
        <div className="address text-center">
          { this.props.loc[0] }., { this.props.loc[1] }
        </div>
        </a>
        <hr/>
        <div className="text-center">
          { /* For this to work, id must have leading letters, otherwise throws massive errors. See here: https://stackoverflow.com/questions/23898873/failed-to-execute-queryselectorall-on-document-how-to-fix */ }
          <Button id={ "abc" + this.props.yelp_id } className="btn btn-success" onClick={ this.toggle }>{ this.state.numberGoing } going</Button>
          <Popover placement="right" isOpen={ this.state.popover } target={ "abc" + this.props.yelp_id } toggle={ this.toggle }>
            <PopoverHeader>Who's In?</PopoverHeader>
            <PopoverBody>{ this.state.user_namesArr }</PopoverBody>
          </Popover>
          {
            this.props.loggedIn ?
            this.state.countMeIn ?
            <span className="going" onClick={ () => this.unrsvp() }>You're going!</span> : // if logged in and already RSVP'd
            <span className="rsvpdetails" onClick={ () => this.rsvp() }>Count me in!</span> : // if logged in but not yet RSVP'd
            <span> Please log in </span> // if not logged in
          }
        </div>
      </div>
    )
  }

}

module.exports = Bar;
