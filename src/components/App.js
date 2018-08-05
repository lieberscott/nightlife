import React from 'react';
import PropTypes from 'prop-types'; // https://www.npmjs.com/package/prop-types
import Bar from './Bar';
import fetch from 'node-fetch';



class App extends React.Component {
  state = {
    bars: []
  };

  componentWillMount() {
    fetch("/api")
    .then((res) => res.json())
    .then((json) => {
      this.setState({
        bars: json.data // should be an array of objects
      })
    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <div className="row">
          { this.state.bars.map(bar =>
            // console.log(bar);
            <Bar key={ bar.id } { ...bar } />
          )}
        </div>
      </div>
    )
  }
}

App.propTypes = {
  bars: PropTypes.array
}

App.defaultProps = {
  bars: [{
    id: 1,
    name: "Loading",
    rating: null,
    price: null,
    img_url: null,
    location: {
      address1: null
    }
  }]
}

export default App;
