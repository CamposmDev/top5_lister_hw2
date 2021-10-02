import jsTPS_Transaction from "./jsTPS.js"

/**
 * ChangeItem_Transaction
 * 
 * This class represents a transaction that updates the text
 * for a given item. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author Michael Campos
 */
export default class ChangeItem_Transaction extends jsTPS_Transaction {
    constructor(changeItem, list, index, oldText, newText) {
        super();
        this.changeItem = changeItem;
        this.list = list
        this.index = index;
        this.oldText = oldText;
        this.newText = newText;

        console.log("ChangeItem_Transaction[index=" + this.index + ", oldText=" + this.oldText + ', newText=' + this.newText + ']');
    }

    doTransaction() {
        this.changeItem(this.list, this.index, this.newText);
    }
    
    undoTransaction() {
        this.changeItem(this.list, this.index, this.oldText);
    }
}