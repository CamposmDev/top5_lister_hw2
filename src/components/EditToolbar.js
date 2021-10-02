import React from "react";

export default class EditToolbar extends React.Component {

    render() {
        const { btUndoFlag, btRedoFlag, btCloseFlag, undoCallback, redoCallback, closeCallback } = this.props;
        let btUndo, btRedo, btClose; // Declare buttons
        btUndoFlag ?
            btUndo = <div id='undo-button' className='top5-button' onClick={undoCallback}>&#x21B6;</div> :
            btUndo = <div id='undo-button' className='top5-button-disabled'>&#x21B6;</div>;
        btRedoFlag ?
            btRedo = <div id='redo-button' className='top5-button' onClick={redoCallback}>&#x21B7;</div> :
            btRedo = <div id='redo-button' className='top5-button-disabled'>&#x21B7;</div>;

        btCloseFlag ?
            btClose = <div id='close-button' className='top5-button' onClick={closeCallback}>&#x24E7;</div> :
            btClose = <div id='close-button' className='top5-button-disabled'>&#x24E7;</div>;

        return (
            <div id="edit-toolbar">
                {btUndo}
                {btRedo}
                {btClose}
            </div>
        )
    }
}