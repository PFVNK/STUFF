import React, { Component } from 'react'
import StackGrid from 'react-stack-grid'
import Loader from 'react-loader-spinner'

import '../App.css';


class Gallery extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: true
        }
    }

    componentDidMount() {
        setTimeout(() => {
            this.setState({ isLoading: false })
        }, 7000)
    }

    render() {
        return (

            <div className='gallery-main'>
                {this.state.isLoading ?
                    <Loader
                        style={'gallery-spinner'}
                        type="Grid"
                        color="lightgreen"
                        height="200"
                        width="200"
                    />
                    :
                    <StackGrid
                        columnWidth={330}
                        monitorImagesLoaded={true}
                        gutterHeight={9}
                        gutterWidth={7}>
                        {this.props.tagResults.map((x, index) => <div className='gallery-item-wrap'><div key={index} className='gallery-item'>
                            <img className='gallery-img' src={x.images[0]} alt={x.title} />
                            <h2>{x.title}</h2>
                            <h3>PRICE: {x.price}</h3>
                            <p>LOCATION: {x.hood}</p>
                        </div></div>)}
                    </StackGrid>
                }
            </div>

        )
    }
}


export default Gallery