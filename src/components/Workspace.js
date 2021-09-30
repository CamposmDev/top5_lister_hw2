import React from "react";

export default class Workspace extends React.Component {
    render() {
        if (this.props.currentList !== null) {
            console.log(this.props.currentList);
            return (
                <div id="top5-workspace">
                    <div id="workspace-edit">
                        <div id="edit-numbering">
                            <div className="item-number">1.</div>
                            <div className="item-number">2.</div>
                            <div className="item-number">3.</div>
                            <div className="item-number">4.</div>
                            <div className="item-number">5.</div>
                        </div>
                        <div id='edit-items'>
                            {this.props.currentList.items.map((item) => (
                                <div className='top5-item'>{item}</div>
                            ))};
                        </div>
                    </div>
                </div>
            )
        }
        return (
            <div id="top5-workspace">
                <div id="workspace-edit">
                    <div id="edit-numbering">
                        <div className="item-number">1.</div>
                        <div className="item-number">2.</div>
                        <div className="item-number">3.</div>
                        <div className="item-number">4.</div>
                        <div className="item-number">5.</div>
                    </div>
                </div>
            </div>
        )
    }
}