import * as React from "react";
import Modal from "../containers/Modal";
import {Link, Redirect, Route} from "react-router-dom";
import StateStore from "../state/StateStore";
import {appService} from "../AppService";
import {User} from "../Models/User";
import {InitTree} from "../Helpers/InitTree";


interface IUpdateState {
    userName : string,
    userPassword : string,
    userAge : string,
    canUpdate : boolean
    MessageResolve : string
}

class UpdateUser extends React.Component<{}, IUpdateState> {
    constructor(props : {}){
        super(props);

        this.state = {
            userName : !!StateStore.getInstance().get('Receiver') ? StateStore.getInstance().get('Receiver').Name : '',
            userPassword : !!StateStore.getInstance().get('Receiver') ? StateStore.getInstance().get('Receiver').Password : '',
            userAge : !!StateStore.getInstance().get('Receiver') ? StateStore.getInstance().get('Receiver').Age : '',
            canUpdate : !!StateStore.getInstance().get('Receiver'),
            MessageResolve : ''
        };
    }

    Update = async() => {
        let MessageRes : string;

        let userToSend = new User(InitTree.GetSelectedId(), this.state.userName, this.state.userPassword, parseInt(this.state.userAge));
        MessageRes = await appService.UpdateUser(userToSend);


        console.log(MessageRes);
        if(MessageRes.startsWith('succeeded')){
            StateStore.FirstUse = 1;
            StateStore.getInstance().setMany({
                'Data' : await appService.GetData(),
                'TreeSelected' : null
            });
            StateStore.getInstance().set('AllTree', null);
            InitTree.inFocusChanged();

            this.setState({
                MessageResolve : MessageRes
            });
        }
    };

    public UpdateRender =()=>(this.state.MessageResolve.startsWith('succeeded')? <Redirect to={{pathname:'/'}}/>: true);


    public Cancel = async() =>{
        StateStore.getInstance().set('TreeSelected', null);
    };

    private UpdateInputChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let name = event.target.name;
        let value = event.target.value;

        if(name === 'userPassword')
            this.setState({
                userPassword: value,
                canUpdate: (this.state.userName !== ''  && value !== '' && this.state.userAge !== '')
            });
        else if(name === 'userAge') {
            if (parseInt(value) > 120)
                value = '120';
            else if (parseInt(value) <= 0)
                return;
            this.setState({
                userAge: value,
                canUpdate: (this.state.userName !== '' && this.state.userPassword !== '' && value !== '')
            });
        }
    };


    render() {
        return (
            <Modal style={styles.modal}>
                <div>
                    <p style={styles.p}>
                        <label style={styles.label}>Name:</label>
                        <br/>
                        <label style={styles.inputName}> {this.state.userName}</label>
                    </p>
                    <p style={styles.p}>
                        <label style={styles.label} htmlFor="userPassword">Password</label>
                        <input style={styles.input} type="text" name="userPassword" value={this.state.userPassword} onChange={this.UpdateInputChangedHandler} />
                    </p>
                    <p style={styles.p}>
                        <label style={styles.label} htmlFor="userAge">Age</label>
                        <input style={styles.input} type="number" min="1" max="120" name="userAge" value={this.state.userAge} onChange={this.UpdateInputChangedHandler} />
                    </p>
                </div>
                <Route path='/UpdateUser' render={this.UpdateRender}/>
                <Link to='/UpdateUser'><button style={this.state.canUpdate ? styles.button : styles.buttonDisabled} disabled={!this.state.canUpdate} onClick={this.Update}>Update</button></Link>
                <Link to='/'><button style={styles.button} onClick={this.Cancel}>Cancel</button></Link>
            </Modal>
        );
    }
}

const styles: { [key: string]: React.CSSProperties } = {
    modal: {
        minWidth: '70px',
        minHeight: '250px'
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
    inputName: {
        fontWeight : "bold"
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

export default UpdateUser;