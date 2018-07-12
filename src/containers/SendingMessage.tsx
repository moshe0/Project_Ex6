import * as React from "react";
import {Message} from "../Models/Message";
import * as moment from 'moment'
import {appService} from "../AppService";
import {InitTree} from "../Helpers/InitTree";
import MainHelpers from "../Helpers/MainHelpers";
import {store} from "../Redux/store";
import {AppState} from "../Redux/AppState";
import {connect} from "react-redux";



interface ISendingMessageState {
    inputVal: string
}

interface ISendingMessageProps {
    receiver : any
    logInState : boolean
}

class SendingMessage extends React.Component <ISendingMessageProps, ISendingMessageState> {
    constructor(props: ISendingMessageProps) {
        super(props);

        this.state = {
            inputVal: '',
        }
    }


    private handleInputChange = (e: any) => {
        this.setState({
            inputVal: e.target.value
        });
    };

     private handleButtonClick = async() => {
        if(this.state.inputVal.trim() === '')
            return;
        let m = new Message(0, this.state.inputVal, store.getState()['currentUser'].Name, store.getState()['Receiver'].Name, store.getState()['currentUser'].Id, store.getState()['Receiver'].Id, moment().format('h:mm:ss'));
        this.setState({inputVal: ''});

        await appService.AddMessage(m);
         MainHelpers.socket.emit('chat', InitTree.GetSelectedChildrenNames());
     };

    EnterKeyPress = (key : any) => {
        if (key.key === 'Enter') {
            this.handleButtonClick();
        }
    };

    componentDidUpdate(){
        if(MainHelpers.inputReset === 1) {
            MainHelpers.inputReset = 0;
            this.setState({
                inputVal: ''
            });
        }
    };

    public render() {
        let inputDisabled = false;
        let placeholder = 'Type Message...';
        let buttonDisabled = false;
        if(!store.getState()['currentUser'] || InitTree.SelectedType() === 'Not selected') {
            placeholder = '';
            inputDisabled = true;
        }
        else if(InitTree.SelectedType() !== 'User without parent' && InitTree.SelectedType() !== 'User in a parent'){
            let index = InitTree.GetSelectedChildrenNames().find(item => item === store.getState()['currentUser'].Name);
            if (!index) {
                placeholder = '';
                inputDisabled = true;
            }
        }

        if(this.state.inputVal.trim() === '' || inputDisabled)
             buttonDisabled = true;

        let btnClass = (buttonDisabled) ? 'buttonDisabled' : 'buttonActive';

        let input : any;
        if(!this.props.receiver) {
            input = (
                <div className={'SendingMessage'}>
                    <input onKeyUp={this.EnterKeyPress} type='text' className='MessageInput' disabled={inputDisabled} onChange={this.handleInputChange} value={''} placeholder={placeholder}/>
                    <button onClick={this.handleButtonClick} className='buttonDisabled' type='button' disabled={true}>
                        <div className="SendingImg"/>
                    </button>
                </div>
            );
        }
        else {
            input = (
                <div className={'SendingMessage'}>
                    <input onKeyUp={this.EnterKeyPress} type='text' className='MessageInput' disabled={inputDisabled} onChange={this.handleInputChange} value={this.state.inputVal} placeholder={placeholder}/>
                    <button onClick={this.handleButtonClick} className={btnClass} type='button' disabled={buttonDisabled}>
                        <div className="SendingImg"/>
                    </button>
                </div>
            );
        }

        return input;
    }
}


const mapPropsToState = (state : AppState, ownProps) => {
    return {
        receiver : state.Receiver,
        logInState : state.LogInState
    }
};


export default connect(mapPropsToState)(SendingMessage);