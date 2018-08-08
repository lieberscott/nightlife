const React = require('react');

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div>
        <div> Welcome { this.props.name } <span onClick={ this.props.logout }> Logout </span></div>
      </div>
    )
  }
}

module.exports = Login;