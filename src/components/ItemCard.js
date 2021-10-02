import React from 'react'

export default class ItemCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: this.props.id,
            text: this.props.text,
            editActive: false,
            moveItemCallback: this.props.moveItemCallback,
            renameItemCallback: this.props.renameItemCallback,
            className: 'top5-item'
        }
        // this.className = 'top5-item'
        console.log('ItemCard[id=' + this.state.id
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
        console.log("ItemCard handleBlur: " + id + " | " + this.state.text);
        this.state.renameItemCallback(id, textValue);
        this.handleToggleEdit();
    }

    onDragStartHandler = (event) => {
        console.log('drag start ' + this.state.id)
        event.dataTransfer.setData('oldId', this.state.id)
    }

    onDragLeaveHandler = (event) => { // Remove Color
        console.log('drag left')
        this.setState(ps => ({
            className: 'top5-item'
        }));
        // this.className = 'top5-item'
    }

    onDragOverHandler = (event) => { // Change Color
        console.log('dragging over')
        // this.className = 'top5-item-dragged-to'
        this.setState(ps => ({
            className: 'top5-item-dragged-to'
        }));
        event.preventDefault();
    }

    onDropHandler = (event) => {
        let oldId = event.dataTransfer.getData('oldId')
        let newId = this.state.id
        console.log('dropped ' + oldId + " | " + newId)
        this.state.moveItemCallback(oldId, newId);
    }

    render() {
        if (this.state.editActive) {
            return (
                <input
                    className='top5-item-edit'
                    type='text'
                    key={this.state.id}
                    onKeyPress={this.handleKeyPress}
                    onBlur={this.handleBlur}
                    onChange={this.handleUpdate}
                    defaultValue={this.state.text}
                />
            )
        }
        return (
            <div
                className={this.state.className}
                // className='top5-item'
                key={this.state.id}
                onClick={this.handleClick}
                draggable='true'
                onDragStart={this.onDragStartHandler}
                onDragLeave={this.onDragLeaveHandler}
                onDragOver={this.onDragOverHandler}
                onDrop={this.onDropHandler}
            >
                {this.state.text}
            </div>
        )
    }
}