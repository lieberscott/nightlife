import React from 'react';
// import PropTypes from 'prop-types'; // https://www.npmjs.com/package/prop-types

class Bar extends React.Component {
  state = {
    countMeIn: false, // coming from Mongo
    loggedIn: false,
    numberGoing: 0 // coming from Mongo
  }

  render() {
    return (
      <div className="col-md-3 onecomponent">
        <div>
          { props.name }
        </div>
        <div>
          { props.rating } {props.price }
        </div>
        <div className="image">
          <img src={ props.image_url } />
        </div>
        <div>
          { props.location.address1 }
        </div>
        <hr/>
        <div>
          Number going <span>Count me in</span>
        </div>
      </div>
    )
  }
}

export default Bar;
