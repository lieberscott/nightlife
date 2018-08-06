import React from 'react';
// import PropTypes from 'prop-types'; // https://www.npmjs.com/package/prop-types

class Login extends React.Component {
  state = {
    loggedIn: false
  }

  render() {
    return (
      <div>
        { this.props.loggedIn ?
          <div> Welcome { this.props.name } <span onClick={ this.props.logout }> Logout </span></div> :
          <div onClick={ this.props.login }>Please log in</div>  }
      </div>
    )
  }
}

export default Login;
