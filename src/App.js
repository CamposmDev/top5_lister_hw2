import React from 'react';
import './App.css';

// IMPORT DATA MANAGEMENT AND TRANSACTION STUFF
import DBManager from './db/DBManager';

// THESE ARE OUR REACT COMPONENTS
import DeleteModal from './components/DeleteModal';
import Banner from './components/Banner.js'
import Sidebar from './components/Sidebar.js'
import Workspace from './components/Workspace.js';
import Statusbar from './components/Statusbar.js'
import jsTPS from './transactions/jsTPS';
import ChangeItem_Transaction from './transactions/ChangeItem_Transaction';
import MoveItem_Transaction from './transactions/MoveItem_Transaction';

/**
Item Drag and Drop - the items should be rearrangeable via dragging, just as in HW 1.
Undo/Redo - Undo/Redo should also work using Control-Z and Control-Y.
List Saving - after every single edit, data should be saved to local storage. Remember to also save session data when necessary, like when a list is deleted.
Foolproof Design - make sure the undo, redo, and close buttons are only enabled when they are usable. When disabled, they should look faded (use transparency) and should not be clickable.


Drag Guidance - when dragging an item, the container into which the dragged item is above should be green to denote that you can place it there. Note, only one container can be such and if we are not dragging over a container, no items should be green.
 */

class App extends React.Component {
    constructor(props) {
        super(props);

        // THIS WILL TALK TO LOCAL STORAGE
        this.db = new DBManager();
        this.tps = new jsTPS();

        // GET THE SESSION DATA FROM OUR DATA MANAGER
        let loadedSessionData = this.db.queryGetSessionData();

        // SETUP THE INITIAL STATE
        this.state = {
            currentList: null,
            sessionData: loadedSessionData,
            keyNamePairToDelete: null,
            btUndoFlag: false,
            btRedoFlag: false,
            btCloseFlag: false,
        }
    }
    sortKeyNamePairsByName = (keyNamePairs) => {
        keyNamePairs.sort((keyPair1, keyPair2) => {
            // GET THE LISTS
            return keyPair1.name.localeCompare(keyPair2.name);
        });
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CREATING A NEW LIST
    createNewList = () => {
        // FIRST FIGURE OUT WHAT THE NEW LIST'S KEY AND NAME WILL BE
        let newKey = this.state.sessionData.nextKey;
        let newName = "Untitled" + newKey;

        // MAKE THE NEW LIST
        let newList = {
            key: newKey,
            name: newName,
            items: ["?", "?", "?", "?", "?"]
        };

        // MAKE THE KEY,NAME OBJECT SO WE CAN KEEP IT IN OUR
        // SESSION DATA SO IT WILL BE IN OUR LIST OF LISTS
        let newKeyNamePair = { "key": newKey, "name": newName };
        let updatedPairs = [...this.state.sessionData.keyNamePairs, newKeyNamePair];
        this.sortKeyNamePairsByName(updatedPairs);

        // CHANGE THE APP STATE SO THAT IT THE CURRENT LIST IS
        // THIS NEW LIST AND UPDATE THE SESSION DATA SO THAT THE
        // NEXT LIST CAN BE MADE AS WELL. NOTE, THIS setState WILL
        // FORCE A CALL TO render, BUT THIS UPDATE IS ASYNCHRONOUS,
        // SO ANY AFTER EFFECTS THAT NEED TO USE THIS UPDATED STATE
        // SHOULD BE DONE VIA ITS CALLBACK
        this.setState(prevState => ({
            currentList: newList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey + 1,
                counter: prevState.sessionData.counter + 1,
                keyNamePairs: updatedPairs
            }
        }), () => {
            // PUTTING THIS NEW LIST IN PERMANENT STORAGE
            // IS AN AFTER EFFECT
            this.db.mutationCreateList(newList);
        });
    }
    renameList = (key, newName) => {
        let newKeyNamePairs = [...this.state.sessionData.keyNamePairs];
        // NOW GO THROUGH THE ARRAY AND FIND THE ONE TO RENAME
        for (let i = 0; i < newKeyNamePairs.length; i++) {
            let pair = newKeyNamePairs[i];
            if (pair.key === key) {
                pair.name = newName;
            }
        }
        this.sortKeyNamePairsByName(newKeyNamePairs);

        // WE MAY HAVE TO RENAME THE currentList
        let currentList = this.state.currentList;
        if (currentList.key === key) {
            currentList.name = newName;
        }

        this.setState(prevState => ({
            currentList: prevState.currentList,
            sessionData: {
                nextKey: prevState.sessionData.nextKey,
                counter: prevState.sessionData.counter,
                keyNamePairs: newKeyNamePairs
            }
        }), () => {
            // AN AFTER EFFECT IS THAT WE NEED TO MAKE SURE
            // THE TRANSACTION STACK IS CLEARED
            let list = this.db.queryGetList(key);
            list.name = newName;
            this.db.mutationUpdateList(list);
            this.db.mutationUpdateSessionData(this.state.sessionData);
        });
    }

    changeItem = (list, index, newName) => {
        list.items[index] = newName;
        this.db.mutationUpdateList(list); // Save this change
    }

    changeItemHandler = (id, newName) => {
        let list = this.state.currentList;
        let index = parseInt(id.slice(-1));
        console.log(index);
        let oldName = list.items[index];

        // Add ChangeItem_Transaction
        let transaciton = new ChangeItem_Transaction(this.changeItem, list, index, oldName, newName);

        this.tps.addTransaction(transaciton);
        

        this.setState(ps => ({
            btUndoFlag: this.tps.hasTransactionToUndo(),
            btRedoFlag: this.tps.hasTransactionToRedo()
        }));
        // Update View
    }

    moveItem = (list, oldIndex, newIndex) => {
        list.items.splice(newIndex, 0, list.items.splice(oldIndex, 1)[0]);
        this.db.mutationUpdateList(list); // Save this change
    }

    moveItemHandler = (oldId, newId) => {
        let list = this.state.currentList;
        let oldIndex = parseInt(oldId.slice(-1));
        let newIndex = parseInt(newId.slice(-1));
        let transaction = new MoveItem_Transaction(this.moveItem, list, oldIndex, newIndex);

        this.tps.addTransaction(transaction);

        this.setState(ps => ({
            btUndoFlag: this.tps.hasTransactionToUndo(),
            btRedoFlag: this.tps.hasTransactionToRedo()
        }));
    }

    undoHandler = () => {
        console.log(this.tps.hasTransactionToUndo());
        if (this.tps.hasTransactionToUndo) {
            this.tps.undoTransaction();
            
            this.setState(ps => ({
                currentList: ps.currentList,
                btUndoFlag: this.tps.hasTransactionToUndo(),
                btRedoFlag: this.tps.hasTransactionToRedo()
            }));
        }
    }

    redoHandler = () => {
        console.log(this.tps.hasTransactionToRedo());
        if (this.tps.hasTransactionToRedo()) {
            this.tps.doTransaction();

            this.setState(ps => ({
                currentList: ps.currentList,
                btUndoFlag: this.tps.hasTransactionToUndo(),
                btRedoFlag: this.tps.hasTransactionToRedo()
            }));
        }
    }

    // THIS FUNCTION BEGINS THE PROCESS OF LOADING A LIST FOR EDITING
    loadList = (key) => {
        let newCurrentList = this.db.queryGetList(key);
        this.tps.clearAllTransactions();
        this.setState(prevState => ({
            currentList: newCurrentList,
            sessionData: prevState.sessionData,
            btUndoFlag: this.tps.hasTransactionToUndo(),
            btRedoFlag: this.tps.hasTransactionToRedo(),
            btCloseFlag: true
        }));
    }
    // THIS FUNCTION BEGINS THE PROCESS OF CLOSING THE CURRENT LIST
    closeCurrentList = () => {
        this.setState(prevState => ({
            currentList: null,
            listKeyPairMarkedForDeletion: prevState.listKeyPairMarkedForDeletion,
            sessionData: this.state.sessionData,
            btUndoFlag: false,
            btRedoFlag: false,
            btCloseFlag: false
        }), () => {
            this.tps.clearAllTransactions();
        });
    }
    deleteList = (keyNamePair) => {
        // SOMEHOW YOU ARE GOING TO HAVE TO FIGURE OUT
        // WHICH LIST IT IS THAT THE USER WANTS TO
        // DELETE AND MAKE THAT CONNECTION SO THAT THE
        // NAME PROPERLY DISPLAYS INSIDE THE MODAL 
        this.setState(prevState => ({
            sessionData: prevState.sessionData,
            keyNamePairToDelete: keyNamePair
        }));
        this.showDeleteListModal();
    }
    // THIS FUNCTION SHOWS THE MODAL FOR PROMPTING THE USER
    // TO SEE IF THEY REALLY WANT TO DELETE THE LIST
    showDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.add("is-visible");
    }

    deleteCurrentList = () => {
        console.log(this.state.keyNamePairToDelete);
        this.db.mutationDeleteList(this.state.keyNamePairToDelete.key);
        let newSessionData = this.db.queryGetSessionData();

        this.setState(prevState => ({
            currentList: null,
            sessionData: newSessionData,
            keyNamePairToDelete: null
        }));
        this.hideDeleteListModal();
    }

    // THIS FUNCTION IS FOR HIDING THE MODAL
    hideDeleteListModal() {
        let modal = document.getElementById("delete-modal");
        modal.classList.remove("is-visible");
    }

    keyInputHandler = (event) => {
        if (event.ctrlKey) {
            if (event.key === 'z') { // Undo
                this.undoHandler();
            } else if (event.key === 'y') {
                this.redoHandler();
            }  
        }
    }

    render() {
        window.addEventListener('keydown', this.keyInputHandler);
        return (
            <div id="app-root">
                <Banner
                    title='Top 5 Lister'
                    btUndoFlag={this.state.btUndoFlag}
                    btRedoFlag={this.state.btRedoFlag}
                    btCloseFlag={this.state.btCloseFlag}
                    undoCallback={this.undoHandler}
                    redoCallback={this.redoHandler}
                    closeCallback={this.closeCurrentList} />
                <Sidebar
                    heading='Your Lists'
                    currentList={this.state.currentList}
                    keyNamePairs={this.state.sessionData.keyNamePairs}
                    createNewListCallback={this.createNewList}
                    deleteListCallback={this.deleteList}
                    loadListCallback={this.loadList}
                    renameListCallback={this.renameList}
                />
                <Workspace
                    currentList={this.state.currentList} 
                    moveItemCallback={this.moveItemHandler}
                    renameItemCallback={this.changeItemHandler}
                />
                <Statusbar
                    currentList={this.state.currentList}
                />
                <DeleteModal
                    listKeyPair={this.state.keyNamePairToDelete}
                    hideDeleteListModalCallback={this.hideDeleteListModal}
                    deleteCurrentList={this.deleteCurrentList}
                />
            </div>
        );
    }
}

export default App;
