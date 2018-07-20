import * as React from "react";
import Modal from "../containers/Modal";
import {Link} from "react-router-dom";
import {setMany} from "../Redux/actions";
import {store} from "../Redux/store";
import MainHelpers from "../Helpers/MainHelpers";

class LogOut extends React.Component<{}, {}> {
    constructor(props : {}){
        super(props);
    }

    Yes = () => {
        MainHelpers.inputReset = 1;
        store.dispatch(setMany({
            'HoldReceiver': null,
            'currentUser': null,
            'Data' : [],
            'LogInState': true,
            'Messages' : []
        }));
    };

    No = () => {
        store.dispatch(setMany({
            'ModalState': false,
            'Receiver': store.getState()['HoldReceiver'],
            'HoldReceiver': null,
        }));
    };

    render() {
        return (
            <Modal style={styles.modal}>
                <p style={styles.p}>
                    Do you want to logout?
                </p>
                <button className={'okButton'} onClick={this.Yes}>Yes</button>
                <Link to='/'><button className={'notOkButton'} onClick={this.No}>No</button></Link>
            </Modal>
        );
    }
}

const styles: { [key: string]: React.CSSProperties } = {
    Link:{
        outline : 'none'
    },
    modal: {
        minWidth: '50px'
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
    },
};

styles.buttonDisabled = {
    background: '#DDDDDD',
    color: '#444753',
    fontSize: '20px',
    cursor: 'pointer',
    borderRadius: '5px'
};


export default LogOut;
