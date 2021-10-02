import React from "react";
import EditToolbar from "./EditToolbar";

export default class Banner extends React.Component {
    render() {
        const { 
            title, 
            btUndoFlag, 
            btRedoFlag, 
            btCloseFlag,
            undoCallback,
            redoCallback, 
            closeCallback
        } = this.props;
        return (
            <div id="top5-banner">
                {title}
                <EditToolbar 
                 btUndoFlag={btUndoFlag}
                 btRedoFlag={btRedoFlag}
                 btCloseFlag={btCloseFlag}
                 undoCallback={undoCallback}
                 redoCallback={redoCallback}
                closeCallback={closeCallback}/>
            </div>
        );
    }
}