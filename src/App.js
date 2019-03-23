import React, { Component } from 'react';

import Navbar from './Components/Navbar'
import Gallery from './Components/Gallery'
import './App.css';


const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tags: [
        { id: "Synth", text: "Synth" },
        { id: "Moog", text: "Moog" },
        { id: "korg", text: "korg" }
      ]
    }
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
  }

  componentDidUpdate() {
    console.log(this.state.tags)
  }

  handleDelete(i) {
    const { tags } = this.state;
    this.setState({
      tags: tags.filter((tag, index) => index !== i),
    });
  }

  handleAddition(tag) {
    this.setState(state => ({ tags: [...state.tags, tag] }));
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags];
    const newTags = tags.slice();

    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);

    // re-render
    this.setState({ tags: newTags });
  }

  render() {
    const { tags } = this.state;
    return (
      <div className="App">
        <Navbar
          tags={tags}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition}
          handleDrag={this.handleDrag}
          delimiters={delimiters}
        />
        <Gallery
          tags={tags}
        />
      </div>
    );
  }
}

export default App;
