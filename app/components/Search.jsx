const React = require('react');

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  render() {
    return (
      <div className="col-lg-6 offset-lg-3">
        <div className="input-group">
          <input className="form-control" id="location" type="text" name="symbol" placeholder="Location" aria-label="Location" aria-describedby="Location" />
          <div className="input-group-append">
            <button className="btn btn-primary" id="#addSeries" type="submit" onClick={ this.props.search }> Search </button>
          </div>
        </div>
        <h6 className="text-center">Powered by <img className="yelplogo" src="https://cdn.glitch.com/f34ce293-1d70-4950-a37a-cb4cd8dde649%2Fyelp.png?1533993111521"/></h6>
      </div>
    )
  }
}

module.exports = Search;
