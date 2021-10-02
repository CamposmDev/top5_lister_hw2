import jsTPS_Transaction from "./jsTPS.js"
/**
 * MoveItem_Transaction
 * 
 * This class represents a transaction that works with drag
 * and drop. It will be managed by the transaction stack.
 * 
 * @author McKilla Gorilla
 * @author ?
 */
export default class MoveItem_Transaction extends jsTPS_Transaction {
    constructor(moveItem, list, initOld, initNew) {
        super();
        this.moveItem = moveItem;
        this.list = list;
        this.oldIndex = initOld;
        this.newIndex = initNew;

        console.log('MoveItem_Transaction[list=' + this.list + ', oldIndex=' + this.oldIndex + ', newIndex=' + this.newIndex + ']');
    }

    doTransaction() {
        this.moveItem(this.list, this.oldIndex, this.newIndex);
    }
    
    undoTransaction() {
        this.moveItem(this.list, this.newIndex, this.oldIndex);
    }
}