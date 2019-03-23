import React from 'react';
import ReactDOM from 'react-dom';
import { WithContext as ReactTags } from 'react-tag-input';

import '../App.css';


class AddTag extends React.Component {
    render() {
        return (
            <div>
                <ReactTags
                    tags={this.props.tags}
                    handleDelete={this.props.handleDelete}
                    handleAddition={this.props.handleAddition}
                    handleDrag={this.props.handleDrag}
                    delimiters={this.props.delimiters}
                    placeholder='+/- Tags'
                    inline />
            </div>
        )
    }
};


export default AddTag