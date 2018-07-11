import * as React from "react";
import {Link} from "react-router-dom";
import {InitTree} from "../Helpers/InitTree";
import {appService} from "../AppService";
import MainHelpers from "../Helpers/MainHelpers";
import {store} from "../Redux/store";
import {setAllTree, setMany} from "../Redux/actions";
import {AppState} from "../Redux/AppState";
import {connect} from "react-redux";



interface ITreeActionsProps {
    receiver : any
}

class TreeActions extends React.Component<ITreeActionsProps, {}> {
    constructor(props: ITreeActionsProps) {
        super(props);
    }

    OnClick = () => {
        if(InitTree.SelectedType() === 'Not selected')
            store.dispatch(setAllTree(InitTree.GetAllTree()));
        else
            store.dispatch(setMany({
                'AllTree' : InitTree.GetAllTree(),
                'TreeSelected' : InitTree.GetTreeItem()
            }));
    };

    OnDeleteClick = async () =>{
        store.dispatch(setMany({
            'AllTree' : InitTree.GetAllTree(),
            'TreeSelected' : InitTree.GetTreeItem()
        }));
        let MessageRes : string;

        const type = InitTree.SelectedType();

        if (type === 'User without parent'){ // DeleteUser server
            MessageRes = await appService.DeleteUser(store.getState()['TreeSelected'].Id);
        }
        else if (type === 'User in a parent'){ // DeleteUserFromGroup server
            MessageRes = await appService.DeleteUserFromGroup(store.getState()['TreeSelected'].Id, store.getState()['TreeSelected'].ParentId);
        }
        else{ // DeleteGroup server
            MessageRes = await appService.DeleteGroup(store.getState()['TreeSelected'].Id, store.getState()['TreeSelected'].ParentId);
        }

        console.log(MessageRes);

        if(MessageRes.startsWith('succeeded')){
            MainHelpers.FirstUse = 1;
            store.dispatch(setMany({
                'Data' : await appService.GetData(),
                'TreeSelected' : null
            }));
            store.dispatch(setAllTree(null));
        }
        alert(MessageRes);
    };


    OnFlatteningClick = async () =>{
        store.dispatch(setMany({
            'AllTree' : InitTree.GetAllTree(),
            'TreeSelected' : InitTree.GetTreeItem()
        }));
        let MessageRes : string;

        MessageRes = await appService.FlatteningGroup(store.getState()['TreeSelected'].Id, store.getState()['TreeSelected'].ParentId);

        console.log(MessageRes);
        if(MessageRes.startsWith('succeeded')){
            MainHelpers.FirstUse = 1;
            store.dispatch(setMany({
                'Data' : await appService.GetData(),
                'TreeSelected' : null
            }));
            store.dispatch(setAllTree(null));
        }
        alert(MessageRes);
    };

    public render() {
        const type  = InitTree.SelectedType();
        if(type === 'Not selected'){
            return (
                <div className="ActionTree">
                    <div className="TreeActionsImages EditImageDisable"/>
                    <div className="TreeActionsImages DelImageDisable"/>
                    <Link to='/Add'><div title="Add" className="TreeActionsImages AddImage" onClick={this.OnClick}/></Link>
                    <div className="TreeActionsImages FlatteningImageDisable"/>
                </div>
            );
        }
        else if(type === 'User without parent'){
            return (
                <div className="ActionTree">
                    <Link to='/UpdateUser'><div title="Edit User" className="TreeActionsImages EditImage" onClick={this.OnClick}/></Link>
                    <div title="Delete selected item" className="TreeActionsImages DelImage" onClick={this.OnDeleteClick}/>
                    <Link to='/Add'><div title="Add" className="TreeActionsImages AddImage" onClick={this.OnClick}/></Link>
                    <div className="TreeActionsImages FlatteningImageDisable"/>
                </div>
            );
        }
        else if(type === 'User in a parent'){
            return (
                <div className="ActionTree">
                    <div className="TreeActionsImages EditImageDisable"/>
                    <div title="Delete selected item" className="TreeActionsImages DelImage" onClick={this.OnDeleteClick}/>
                    <Link to='/Add'><div title="Add" className="TreeActionsImages AddImage" onClick={this.OnClick}/></Link>
                    <div className="TreeActionsImages FlatteningImageDisable"/>
                </div>
            );
        }

        else if(type === 'Group with groups'){
            return (
                <div className="ActionTree">
                    <div className="TreeActionsImages EditImageDisable"/>
                    <div title="Delete selected item" className="TreeActionsImages DelImage" onClick={this.OnDeleteClick}/>
                    <Link to='/Add'><div title="Add" className="TreeActionsImages AddImage" onClick={this.OnClick}/></Link>
                    <div className="TreeActionsImages FlatteningImageDisable"/>
                </div>
            );
        }

        else if(type === 'Group with users'){
            if(InitTree.SelectedParentType() === 'With one group' && InitTree.GetParentId() !== -1) {
                return (
                    <div className="ActionTree">
                        <div className="TreeActionsImages EditImageDisable"/>
                        <div title="Delete selected item" className="TreeActionsImages DelImage" onClick={this.OnDeleteClick}/>
                        <Link to='/Add'>
                            <div title="Add" className="TreeActionsImages AddImage" onClick={this.OnClick}/>
                        </Link>
                        <div title="Flattening" className="TreeActionsImages FlatteningImage" onClick={this.OnFlatteningClick}/>
                    </div>
                );
            }
            else{
                return (
                    <div className="ActionTree">
                        <div className="TreeActionsImages EditImageDisable"/>
                        <div title="Delete selected item" className="TreeActionsImages DelImage" onClick={this.OnDeleteClick}/>
                        <Link to='/Add'>
                            <div title="Add" className="TreeActionsImages AddImage" onClick={this.OnClick}/>
                        </Link>
                        <div className="TreeActionsImages FlatteningImageDisable"/>
                    </div>
                );
            }
        }
        else{ //Empty group
            return (
                <div className="ActionTree">
                    <div className="TreeActionsImages EditImageDisable"/>
                    <div title="Delete selected item" className="TreeActionsImages DelImage" onClick={this.OnDeleteClick}/>
                    <Link to='/Add'><div title="Add" className="TreeActionsImages AddImage" onClick={this.OnClick}/></Link>
                    <div className="TreeActionsImages FlatteningImageDisable"/>
                </div>
            );
        }
    }
}


const mapPropsToState = (state : AppState, ownProps) => {
    return {
        receiver : state.Receiver,
    }
};


export default connect(mapPropsToState)(TreeActions);