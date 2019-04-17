import React, { Component } from 'react'
import $ from 'jquery'

import Navbar from './Components/Navbar'
import Gallery from './Components/Gallery'
import './App.css'


const KeyCodes = {
  comma: 188,
  enter: 13,
}

const delimiters = [KeyCodes.comma, KeyCodes.enter]

const API_URL = 'http://localhost:3001/search/houston/'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      tags: [],
      tagResults: [],
      mixedResults: [],
      items: [],
      showItems: 0
    }

    this.saveToLocal = this.saveToLocal.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleAddition = this.handleAddition.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
    this.fetchAndStore = this.fetchAndStore.bind(this)
    this.fetchSave = this.fetchSave.bind(this)
    this.lazyLoad = this.lazyLoad.bind(this)
    this.shuffle = this.shuffle.bind(this)
    this.mixResults = this.mixResults.bind(this)
  }

  componentDidMount() {
    let tags = JSON.parse(localStorage.getItem('tags'))

    setTimeout(this.lazyLoad, 2000)

    this.setState({
      tags
    },
      this.fetchAndStore
    )
  }

  componentDidUpdate() {
    console.log(this.state.tagResults)
    console.log(this.state.items)
  }

  fetchSave = () => {
    this.saveToLocal()
    this.fetchAndStore()
    this.lazyLoad()
  }

  lazyLoad() {
    const { mixedResults } = this.state
    const items = mixedResults.slice(0, this.state.showItems + 12)
    this.setState({
      showItems: this.state.showItems + 12,
      items
    })
  }

  shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex

    while (0 !== currentIndex) {

      randomIndex = Math.floor(Math.random() * currentIndex)
      currentIndex -= 1

      temporaryValue = array[currentIndex]
      array[currentIndex] = array[randomIndex]
      array[randomIndex] = temporaryValue
    }

    return array
  }

  mixResults() {
    const { tagResults } = this.state

    let uniqueResults = tagResults.reduce((unique, o) => {
      if (!unique.some(obj => obj.title === o.title)) {
        unique.push(o)
      }
      return unique
    }, [])
    console.log(uniqueResults)
    const mixedResults = this.shuffle(uniqueResults)

    this.setState({ mixedResults })
  }

  saveToLocal() {
    localStorage.setItem('tags', JSON.stringify(this.state.tags))
  }

  fetchAndStore() {
    let tagString = []
    let offerTag = this.state.tags[0].text || []
    let data = []

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
      .then(json => this.setState({ tagResults: json[0].allResults || [] }))
      .then(this.mixResults)
  }

  handleDelete(i) {
    const { tags } = this.state
    this.setState(
      { tags: tags.filter((tag, index) => index !== i) },
      () => {
        this.fetchSave()
      }
    )
  }

  handleAddition(tag) {
    this.setState({ tags: [...this.state.tags, tag] },
      () => {
        this.fetchSave()
      }
    )
  }

  handleDrag(tag, currPos, newPos) {
    const tags = [...this.state.tags]
    const newTags = tags.slice()

    newTags.splice(currPos, 1)
    newTags.splice(newPos, 0, tag)

    // re-render
    this.setState({ tags: newTags })
  }

  render() {
    const { tags, tagResults, items } = this.state
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
          lazyLoad={this.lazyLoad}
          tagResults={tagResults}
          items={items}
        />
      </div>
    );
  }
}

export default App;
