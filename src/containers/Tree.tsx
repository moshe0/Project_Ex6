import * as React from "react";
import * as $ from 'jquery';
import {InitTree} from "../Helpers/InitTree";
import StateStore from "../state/StateStore";


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

        if(!!StateStore.getInstance().get('currentUser') &&
            !StateStore.getInstance().get('LogInState') &&
            !StateStore.getInstance().get('ModalState') &&
            StateStore.FirstUse === 1
            ||
            StateStore.getInstance().get('LogInState') &&
            StateStore.getInstance().get('ModalState')
        ) {
            return true;
        }
        return false;
    }

    componentDidUpdate() {
        StateStore.FirstUse = 0;

        new InitTree($(this.ref), StateStore.getInstance().get('Data'));
        if(!!StateStore.getInstance().get('AllTree'))
            InitTree.InitExistingTree();
        // console.log('****  Done  ****');
    }

    //Before component dead
    componentWillUnmount() {
        if(StateStore.getInstance().get('ModalState') === true)
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