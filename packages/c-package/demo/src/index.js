import React, { Component } from 'react';
import { render } from 'react-dom';
import CP from '../../src';
export default class Demo extends Component {
  componentDidMount() {
    console.log('componentDidMount');
  }
  render() {
    return (
      <div>
        <CP />
      </div>
    );
  }
}

render(<Demo />, document.querySelector('#root'));
