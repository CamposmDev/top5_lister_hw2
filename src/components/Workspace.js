import React from "react";
import ItemCard from './ItemCard';

export default class Workspace extends React.Component {
    render() {
        let key = 0;
        if (this.props.currentList !== null) {
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
                                <ItemCard
                                    key={key + '-' + item} // Weird :(
                                    id={'item-' + key++}
                                    text={item}
                                    moveItemCallback={this.props.moveItemCallback}
                                    renameItemCallback={this.props.renameItemCallback}
                                />
                            ))};
                        </div>
                    </div>
                </div>
            );
        } else {
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
            );
        }
    }
}