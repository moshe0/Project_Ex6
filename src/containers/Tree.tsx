import * as React from "react";
import * as $ from 'jquery';
import {InitTree} from "../Helpers/InitTree";
import MainHelpers from "../Helpers/MainHelpers";
import {store} from "../Redux/store";
import {AppState} from "../Redux/AppState";
import {connect} from "react-redux";



interface ITreeProps {
    data : any,
}


class Tree extends React.Component <ITreeProps, {}>{
    ref : any;

    constructor(props: ITreeProps) {
        super(props);
        this.ref = null;
    }


    shouldComponentUpdate(){
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
    }

    //Before component dead
    componentWillUnmount() {
        $(this.ref).off();
    }


    setRef = (ulElement : any)=> {
        this.ref = ulElement;
    };

    public render() {
        return (<ul className="tree" ref={this.setRef} tabIndex={0}/>);
    }
}



const mapPropsToState = (state : AppState, ownProps) => {
    return {
        data : state.Data,
    }
};


export default connect(mapPropsToState)(Tree);
