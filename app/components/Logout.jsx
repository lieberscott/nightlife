const React = require('react');

class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="text-center">
        <div> Welcome, { this.props.name } <span onClick={ this.props.logout }><img class="logouticon" src="https://cdn.glitch.com/f34ce293-1d70-4950-a37a-cb4cd8dde649%2Flogout.png?1533965922888" /></span></div>
      </div>
    )
  }
}

module.exports = Logout;