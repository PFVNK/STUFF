import React, { Component } from 'react';

import Navbar from './Components/Navbar'
import Gallery from './Components/Gallery'
import './App.css';



const KeyCodes = {
  comma: 188,
  enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

const API_URL = 'http://localhost:3001/search/houston/'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tags: [
        {
          id: 'bobblehead',
          text: 'bobblehead',
        },
        {
          id: 'tea',
          text: 'tea'
        }
      ],
      tagResults: []
    }

    this.saveToLocal = this.saveToLocal.bind(this)
    this.handleDelete = this.handleDelete.bind(this);
    this.handleAddition = this.handleAddition.bind(this);
    this.handleDrag = this.handleDrag.bind(this);
    this.fetchAndStore = this.fetchAndStore.bind(this)
    this.fetchSave = this.fetchSave.bind(this)
  }

  componentDidMount() {
    let tags = JSON.parse(localStorage.getItem('tags'))
    this.setState({
      tags
    },
      this.fetchAndStore
    )
  }

  componentDidUpdate() {
    console.log(this.state.tagResults)
  }

  fetchSave = () => {
    this.saveToLocal()
    this.fetchAndStore()
  }

  saveToLocal() {
    localStorage.setItem('tags', JSON.stringify(this.state.tags))
  }

  fetchAndStore() {
    let tagString = []
    let offerTag = this.state.tags[0].text || []

    this.state.tags.map((x, index) =>
      tagString.push(`|+${x.text}+`)
    )

    const urls = [
      `${API_URL}${tagString.join('').slice(2, -1)}`,
      `${API_URL}${offerTag}`
    ]

    Promise.all(urls.map(url =>
      fetch(url)
        .then(response => response.json())
    ))
      .then(json => this.setState({ tagResults: json[1].allResults || [] }))
  }

  handleDelete(i) {
    const { tags } = this.state;
    this.setState(
      { tags: tags.filter((tag, index) => index !== i) },
      () => {
        this.fetchSave()
      }
    );
  }

  handleAddition(tag) {
    this.setState({ tags: [...this.state.tags, tag] },
      () => {
        this.fetchSave()
      }
    );
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
    const { tags, tagResults, craigResults, offerResults, finalResults } = this.state;
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
          tagResults={tagResults}
          craigResults={craigResults}
          offerResults={offerResults}
          finalResults={finalResults}
        />
      </div>
    );
  }
}

export default App;
