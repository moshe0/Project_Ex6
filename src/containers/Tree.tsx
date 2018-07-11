import * as React from "react";
import * as $ from 'jquery';
import {InitTree} from "../Helpers/InitTree";
import StateStore from "../state/StateStore";
import MainHelpers from "../Helpers/MainHelpers";
import {store} from "../Redux/store";


class Tree extends React.Component <{}, {}>{
    ref : any;

    constructor(props: {}) {
        super(props);
        this.ref = null;
    }


    shouldComponentUpdate(){
        // console.log('Tree componentDidUpdate');
        // console.log('Data: ', StateStore.getInstance().get('Data'));
        // console.log('currentUser: ', StateStore.getInstance().get('currentUser'));
        // console.log('LogInState: ' ,StateStore.getInstance().get('LogInState'));
        // console.log('LogIOutState: ' , StateStore.getInstance().get('LogIOutState'));

        if(!!store.getState()['currentUser'] &&
            !store.getState()['LogInState'] &&
            !store.getState()['ModalState'] &&
            MainHelpers.FirstUse === 1
            ||
            store.getState()['LogInState'] &&
        store.getState()['ModalState']
        ) {
            return true;
        }
        return false;
    }

    componentDidUpdate() {
        MainHelpers.FirstUse = 0;

        new InitTree($(this.ref), store.getState()['Data']);
        if(!!store.getState()['AllTree'])
            InitTree.InitExistingTree();
        // console.log('****  Done  ****');
    }

    //Before component dead
    componentWillUnmount() {
        if(store.getState()['ModalState'] === true)
            StateStore.getInstance().set('TreeState', $(this.ref).find('li'));
        $(this.ref).off();
    }


    setRef = (ulElement : any)=> {
        this.ref = ulElement;
    };

    public render() {
        return (<ul className="tree" ref={this.setRef} tabIndex={0}/>);
    }
}

export default Tree;