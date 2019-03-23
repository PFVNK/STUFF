import React, { Component } from 'react'

import AddTag from './AddTag'

import '../App.css';

class Navbar extends Component {

    render() {
        return (
            <React.Fragment>
                <header className='nav-header'>
                    <div className='nav-logo'><div className='nav-logo-title'>STUFF</div></div>
                    <AddTag
                        className='nav-tag'
                        tags={this.props.tags}
                        handleDelete={this.props.handleDelete}
                        handleAddition={this.props.handleAddition}
                        handleDrag={this.props.handleDrag}
                        delimiters={this.props.delimiters}
                    />
                </header>
            </React.Fragment>

        )
    }
}


export default Navbar