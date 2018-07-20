import * as React from "react";
import Modal from "../containers/Modal";



interface ILogInProps{
    userLogin : string,
    passwordLogin : string,
    MessageErr : string,
    canLogin : boolean,
    InputChangedHandler : any,
    LoginCallback : any
}

class LogIn extends React.Component<ILogInProps, {}> {
    constructor(props : ILogInProps){
        super(props);
    }

    Login = () => {
        this.props.LoginCallback();
    };

    private InputChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.props.InputChangedHandler(event);
    };

    render() {
        return (
            <Modal style={styles.modal}>
                <p style={styles.p}>
                    <label style={styles.label} htmlFor="userLogin">Username</label>
                    <input style={styles.input} type="text" name="userLogin" value={this.props.userLogin} onChange={this.InputChangedHandler}/>
                </p>
                <p>
                    <label style={styles.label} htmlFor="passwordLogin">Password</label>
                    <input style={styles.input} type="password" name="passwordLogin" value={this.props.passwordLogin} onChange={this.InputChangedHandler} />
                </p>
                <button className={this.props.canLogin ? 'buttonLogin' : 'buttonLoginDisabled'} disabled={!this.props.canLogin} onClick={this.Login}>Login</button>
                <p>
                    <label style={styles.inputErr}>{this.props.MessageErr}</label>
                </p>
            </Modal>
        );
    }
}

const styles: { [key: string]: React.CSSProperties } = {
    modal: {
        minWidth: '50px',
        minHeight: '240px'
    },
    p: {
        margin: "0 0 0.5em 0",
        fontSize: '20px'
    },
    label: {
        display: "inline-block",
        marginBottom: ".5rem",
        fontSize: '20px'
    },
    input: {
        display: "block",
        width: "100%",
        outline: 'none',
        fontSize: '20px',
        borderRadius: '5px',
        boxSizing: 'border-box',
    },
    inputErr: {
        display: "block",
        width: "100%",
        outline: 'none',
        fontSize: '15px',
        color : 'red',
        borderRadius: '5px',
    },
};


export default LogIn;