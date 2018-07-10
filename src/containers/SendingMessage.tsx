import * as React from "react";
import {Message} from "./../Models/Message";
import StateStore from "../state/StateStore";
import * as moment from 'moment'
import {appService} from "../AppService";
import {InitTree} from "../Helpers/InitTree";
import MainHelpers from "../Helpers/MainHelpers";



interface ISendingMessageState {
    inputVal: string
}


class SendingMessage extends React.Component <{}, ISendingMessageState> {
    stateStore = StateStore.getInstance();
    constructor(props: {}) {
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
        let m = new Message(0, this.state.inputVal, this.stateStore.get('currentUser').Name, this.stateStore.get('Receiver').Name, this.stateStore.get('currentUser').Id, this.stateStore.get('Receiver').Id, moment().format('h:mm:ss'));
        this.setState({inputVal: ''});

        await appService.AddMessage(m);
         MainHelpers.socket.emit('chat', InitTree.GetSelectedChildrenNames());
     };

    EnterKeyPress = (key : any) => {
        if (key.key === 'Enter') {
            this.handleButtonClick();
        }
    };


    public render() {
        let inputDisabled = false;
        let placeholder = 'Type Message...';
        let buttonDisabled = false;
        if(!this.stateStore.get('currentUser') || InitTree.SelectedType() === 'Not selected') {
            placeholder = '';
            inputDisabled = true;
        }
        else if(InitTree.SelectedType() !== 'User without parent' && InitTree.SelectedType() !== 'User in a parent'){
            let index = InitTree.GetSelectedChildrenNames().find(item => item === StateStore.getInstance().get('currentUser').Name);
            if (!index) {
                placeholder = '';
                inputDisabled = true;
            }
        }

        if(this.state.inputVal.trim() === '' || inputDisabled)
             buttonDisabled = true;

        let btnClass = (buttonDisabled) ? 'buttonDisabled' : 'buttonActive';

        return (
            <div className={'SendingMessage'}>
                <input onKeyUp={this.EnterKeyPress} type='text' className='MessageInput' disabled={inputDisabled} onChange={this.handleInputChange} value={this.state.inputVal} placeholder={placeholder}/>
                <button onClick={this.handleButtonClick} className={btnClass} type='button' disabled={buttonDisabled}>
                    <div className="SendingImg"/>
                </button>
            </div>
        );
    }
}

export default SendingMessage;