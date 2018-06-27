import * as React from "react";
import {Link} from "react-router-dom";
import {InitTree} from "../Helpers/InitTree";
import StateStore from "../state/StateStore";
import {appService} from "../AppService";


class TreeActions extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    OnClick = () => {
        if(InitTree.SelectedType() === 'Not selected')
            StateStore.getInstance().set('AllTree',InitTree.GetAllTree());
        else
            StateStore.getInstance().setMany({
                'AllTree' : InitTree.GetAllTree(),
                'TreeSelected' : InitTree.GetTreeItem()
            });
    };

    OnDeleteClick = async () =>{
        StateStore.getInstance().setMany({
            'AllTree' : InitTree.GetAllTree(),
            'TreeSelected' : InitTree.GetTreeItem()
        });
        let MessageRes : string;

        const type = InitTree.SelectedType();

        if (type === 'User without parent'){ // DeleteUser server
            MessageRes = await appService.DeleteUser(StateStore.getInstance().get('TreeSelected').Id);
        }
        else if (type === 'User in a parent'){ // DeleteUserFromGroup server
            MessageRes = await appService.DeleteUserFromGroup(StateStore.getInstance().get('TreeSelected').Id, StateStore.getInstance().get('TreeSelected').ParentId);
        }
        else{ // DeleteGroup server
            MessageRes = await appService.DeleteGroup(StateStore.getInstance().get('TreeSelected').Id, StateStore.getInstance().get('TreeSelected').ParentId);
        }

        console.log(MessageRes);

        if(MessageRes.startsWith('succeeded')){
            StateStore.FirstUse = 1;
            StateStore.getInstance().setMany({
                'Data' : await appService.GetData(),
                'TreeSelected' : null
            });
            StateStore.getInstance().set('AllTree', null);
        }
        alert(MessageRes);
    };


    OnFlatteningClick = async () =>{
        StateStore.getInstance().setMany({
            'AllTree' : InitTree.GetAllTree(),
            'TreeSelected' : InitTree.GetTreeItem()
        });
        let MessageRes : string;

        MessageRes = await appService.FlatteningGroup(StateStore.getInstance().get('TreeSelected').Id, StateStore.getInstance().get('TreeSelected').ParentId);

        console.log(MessageRes);
        if(MessageRes.startsWith('succeeded')){
            StateStore.FirstUse = 1;
            StateStore.getInstance().setMany({
                'Data' : await appService.GetData(),
                'TreeSelected' : null
            });
            StateStore.getInstance().set('AllTree', null);
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


export default TreeActions;