import * as React from "react";
import Modal from "../containers/Modal";
import {Link, Redirect, Route} from "react-router-dom";
import StateStore from "../state/StateStore";
import {User} from "../Models/User";
import {appService} from "../AppService";
import {Group} from "../Models/Group";
// import {InitTree} from "../Helpers/InitTree";
// import {Group} from "../Models/Group";



interface IAddProps{
    AddType : string[],
    isGroupWithUsersMode : boolean
}

interface IAddState {
    selectedType : string,
    userName : string,
    userPassword : string,
    userAge : string,
    groupName : string,
    userNameG : string,
    groupNameG : string,
    groupNameU : string,
    newGroupName : string,
    canAdd : boolean,
    MessageResolve : string

}

class Add extends React.Component<IAddProps, IAddState> {
    constructor(props : IAddProps){
        super(props);

        this.state = {
            selectedType: 'New user',
            userName : '',
            userPassword : '',
            userAge : '',
            groupName : '',
            userNameG : '',
            groupNameG : '',
            groupNameU : '',
            newGroupName : '',
            canAdd : false,
            MessageResolve : ''
        };
    }

    Add = async() => {
        let MessageRes : string;
        if(this.state.selectedType === 'New user'){
            let userToSend = new User(0, this.state.userName, this.state.userPassword, parseInt(this.state.userAge));
            MessageRes = await appService.AddUser(userToSend);
        }
        else if(this.state.selectedType === 'New group'){
            let groupToSend = new Group(0, this.state.groupName, []);
            MessageRes = await appService.AddGroup(groupToSend, '', -1);
        }
        else if(this.state.selectedType === 'Add existing user to marked group'){
            MessageRes = await appService.AddUserToExistingGroup(this.state.userNameG, StateStore.getInstance().get('TreeSelected').Id);

        }
        else{
            if(this.state.groupNameG !== ''){
                let groupToSend = new Group(0, this.state.groupNameG, []);
                MessageRes = await appService.AddGroup(groupToSend, '', StateStore.getInstance().get('TreeSelected').Id);
            }
            else{
                let groupToSend = new Group(0, this.state.groupNameU, []);
                MessageRes = await appService.AddGroup(groupToSend, this.state.newGroupName, StateStore.getInstance().get('TreeSelected').Id);
            }
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

        this.setState({
            MessageResolve : MessageRes
        });
    };


    private AddInputChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let name = event.target.name;
        let value = event.target.value;

        if(name === 'userName')
            this.setState({
                userName: value,
                canAdd: (value !== ''  && this.state.userPassword !== '' && this.state.userAge !== '')
            });
        else if(name === 'userPassword')
            this.setState({
                userPassword: value,
                canAdd: (this.state.userName !== ''  && value !== '' && this.state.userAge !== '')
            });
        else if(name === 'userAge') {
            if (parseInt(value) > 120)
                value = '120';
            else if (parseInt(value) <= 0)
                return;
            this.setState({
                userAge: value,
                canAdd: (this.state.userName !== '' && this.state.userPassword !== '' && value !== '')
            });
        }
        else if(name === 'groupName')
            this.setState({
                groupName: value,
                canAdd: value !== ''
            });
        else if(name === 'userNameG')
            this.setState({
                userNameG: value,
                canAdd: value !== ''
            });
        else if(name === 'groupNameG')
            this.setState({
                groupNameG: value,
                canAdd: value !== ''
            });
        else if(name === 'groupNameU')
            this.setState({
                groupNameU: value,
                canAdd: (this.state.newGroupName !== '' && value !== '')
            });
        else if(name === 'newGroupName')
            this.setState({
                newGroupName: value,
                canAdd: (this.state.groupNameU !== '' && value !== '')
            });

    };

    private SelectedChangedHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({
            selectedType: event.target.value,
            userName : '',
            userPassword : '',
            userAge : '',
            groupName : '',
            userNameG : '',
            groupNameG : '',
            groupNameU : '',
            newGroupName : '',
            MessageResolve : '',
            canAdd : false
        });
    };

    public AddRender =()=>(this.state.MessageResolve.startsWith('succeeded')? <Redirect to={{pathname:'/'}}/>: true);

    public Cancel = async() =>{
        StateStore.getInstance().set('TreeSelected', null);
    };

    public AddInteraction(){
        if(this.state.selectedType === 'New user'){
            return (
                <div>
                    <p style={styles.p}>
                        <label style={styles.label} htmlFor="userName">Name</label>
                        <input style={styles.input} type="text" name="userName" value={this.state.userName} onChange={this.AddInputChangedHandler} />
                    </p>
                    <p style={styles.p}>
                        <label style={styles.label} htmlFor="userPassword">Password</label>
                        <input style={styles.input} type="text" name="userPassword" value={this.state.userPassword} onChange={this.AddInputChangedHandler} />
                    </p>
                    <p style={styles.p}>
                        <label style={styles.label} htmlFor="userAge">Age</label>
                        <input style={styles.input} type="number" min="1" max="130" name="userAge" value={this.state.userAge} onChange={this.AddInputChangedHandler} />
                    </p>
                </div>
            );
        }
        else if(this.state.selectedType === 'New group'){
            return (
                <div>
                    <p style={styles.p}>
                        <label style={styles.label} htmlFor="groupName">Name</label>
                        <input style={styles.input} type="text" name="groupName" value={this.state.groupName} onChange={this.AddInputChangedHandler} />
                    </p>
                </div>
            );
        }
        else if(this.state.selectedType === 'Add existing user to marked group'){
            return (
                <div>
                    <p style={styles.p}>
                        <label style={styles.label} htmlFor="userNameG">Name</label>
                        <input style={styles.input} type="text" name="userNameG" value={this.state.userNameG} onChange={this.AddInputChangedHandler} />
                    </p>
                </div>
            );
        }
        else{ // Add new group to marked group
            if(this.props.isGroupWithUsersMode){
                return (
                    <div>
                        <p style={styles.p}>
                            <label style={styles.label} htmlFor="groupNameU">Name</label>
                            <input style={styles.input} type="text" name="groupNameU" value={this.state.groupNameU} onChange={this.AddInputChangedHandler} />
                        </p>
                        <p style={styles.p}>
                            <label style={styles.label} htmlFor="newGroupName">New group name</label>
                            <input style={styles.input} type="text" name="newGroupName" value={this.state.newGroupName} onChange={this.AddInputChangedHandler} />
                        </p>
                    </div>
                );
            }
            return (
                <div>
                    <p style={styles.p}>
                        <label style={styles.label} htmlFor="groupNameG">Name</label>
                        <input style={styles.input} type="text" name="groupNameG" value={this.state.groupNameG} onChange={this.AddInputChangedHandler} />
                    </p>
                </div>
            );
        }
    }


    render() {
        const AddTypes = this.props.AddType.map((item, idx) => {
            return (<option key={idx} value={item}>{item}</option>);
        });

        const divSelected = this.AddInteraction();

        return (
            <Modal style={styles.modal}>
                <div style={styles.divOfType}>
                    <span style={styles.p}>
                        <label style={styles.input} htmlFor="AddType">Type of add</label>
                        <select style={styles.input} name="AddType" onChange={this.SelectedChangedHandler}>
                            {AddTypes}
                        </select>
                    </span>
                </div>
                {divSelected}
                <p>
                    <Route path='/Add' render={this.AddRender}/>
                    <Link to='/Add'><button style={this.state.canAdd ? styles.button : styles.buttonDisabled} disabled={!this.state.canAdd} onClick={this.Add}>Add</button></Link>
                    <Link to='/'><button style={styles.button} onClick={this.Cancel}>Cancel</button></Link>
                </p>
                <p>
                    <label style={styles.inputErr}>{this.state.MessageResolve}</label>
                </p>
            </Modal>
        );
    }
}

const styles: { [key: string]: React.CSSProperties } = {
    modal: {
        minWidth: '380px',
        minHeight: '370px'
    },
    p: {
        margin: "0 0 0.5em 0",
        fontSize: '20px'
    },
    label: {
        display: "inline-block",
        fontSize: '20px'
    },
    input: {
        display: "block",
        width: "100%",
        outline: 'none',
        fontSize: '20px',
        borderRadius: '5px',
    },
    inputErr: {
        display: "block",
        width: "100%",
        outline: 'none',
        fontSize: '15px',
        color : 'red',
        borderRadius: '5px',
    },
    button: {
        background: '#5077bb',
        color: 'white',
        fontSize: '20px',
        cursor: 'pointer',
        borderRadius: '5px'
    },
};

styles.buttonDisabled = {
    background: '#DDDDDD',
    color: '#444753',
    fontSize: '20px',
    cursor: 'pointer',
    borderRadius: '5px'
};


styles.divOfType ={
    marginBottom : '40px',
};

export default Add;