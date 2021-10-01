import React from 'react'

export default class ItemCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            text: this.props.text,
            editActive: false,
            renameItemCallback: this.props.renameItemCallback
        }
        console.log('Created ItemCard[id=' + this.state.id
            + ', text=' + this.state.text + ', editActive='
            + this.state.editActive);
    }

    handleClick = (event) => {
        if (event.detail === 2) {
            this.handleToggleEdit(event);
        }
    }
    handleToggleEdit = (event) => {
        this.setState({
            editActive: !this.state.editActive
        });
    }
    handleUpdate = (event) => {
        this.setState({ text: event.target.value });
    }
    handleKeyPress = (event) => {
        if (event.code === "Enter") {
            this.handleBlur();
        }
    }
    handleBlur = () => {
        let id = this.state.id;
        let textValue = this.state.text;
        console.log("ItemCard handleBlur: " + this.state.text);
        this.state.renameItemCallback(id, textValue);
        this.handleToggleEdit();
    }

    render() {
        if (this.state.editActive) {
            return (
                // <div>
                    <input
                        className='top5-item-edit'
                        type='text'
                        key={this.state.id}
                        onKeyPress={this.handleKeyPress}
                        onBlur={this.handleBlur}
                        onChange={this.handleUpdate}
                        defaultValue={this.state.text}
                    />
                // </div>
            )
        }
        return (
            <div
                className='top5-item'
                key={this.state.id}
                onClick={this.handleClick}>
                {this.state.text}
            </div>
        )
    }
}