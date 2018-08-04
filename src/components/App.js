import React from 'react';
import axios from 'axios'; // allows us to make ajax calls
import Header from './Header';



class App extends React.Component {
  state = {
    header: "Please log in",
    bars: []
  };

  componentDidMount() {
    axios.get('/api/bars')
    .then(resp => {
      console.log(resp);
    })
    .catch(err => console.log(err));
  }

  render() {
    return (
      <div>
        <Header message={ this.state.header } />
      </div>
    )
  }
}

export default App;
