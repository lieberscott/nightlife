const React = require('react');

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="input-group">
        <input className="form-control" id="location" type="text" name="symbol" placeholder="Location" aria-label="Location" aria-describedby="Location" />
        <div className="input-group-append">
          <button className="btn btn-primary" id="#addSeries" type="submit" onClick={ this.props.search }> Add </button>
        </div>
      </div>
    )
  }
}

module.exports = Search;