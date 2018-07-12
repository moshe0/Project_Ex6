import * as React from "react";
import {appService} from "../AppService";
import {InitTree} from "../Helpers/InitTree";
import MainHelpers from "../Helpers/MainHelpers";
import {store} from "../Redux/store";
import {AppState} from "../Redux/AppState";
import {connect} from "react-redux";
import {setMessages} from "../Redux/actions";


interface IMessageHistoryProps {
    messages : any[]
}

class MessageHistory extends React.Component <IMessageHistoryProps, {}>{

    messagesBlock : any;

    constructor(props: IMessageHistoryProps) {
        super(props);
        this.messagesBlock = React.createRef();
    }

    //After render
    componentDidMount(){
        this.messagesBlock.current.scrollTop = this.messagesBlock.current.scrollHeight;
    }

    // After updating occurs
    async componentDidUpdate(){
        this.messagesBlock.current.scrollTop = this.messagesBlock.current.scrollHeight;
    }

    public render() {
        if(!store.getState()['currentUser']){
            return (
                <div className="content" ref={this.messagesBlock}/>
            );
        }
        const listMessages = store.getState()['Messages'].map((item, idx) => {
            const itemClassName = store.getState()['currentUser'].Id === item.SenderId? 'MineMessage MessageHistory' : 'OtherMessage MessageHistory';
            let Receiver = '';
            if(!! store.getState()['Receiver'])
                Receiver = MainHelpers.GetType(store.getState()['Receiver']);
            else if(!! store.getState()['HoldReceiver'])
                Receiver = MainHelpers.GetType(store.getState()['HoldReceiver']);

            if(Receiver === 'group') {
                return (
                    <div className={'message'} key={idx}>
                        <div className={itemClassName}>
                            <div className={'MessageUserSending'}>{item.SenderName}</div>
                            {item.Content}
                            <br/>
                            <div className={'MessageTime'}>{item.TimeSent}</div>
                        </div>
                    </div>
                );
            }
            else{
                return (
                    <div className={'message'} key={idx}>
                        <div className={itemClassName}>
                            {item.Content}
                            <br/>
                            <div className={'MessageTime'}>{item.TimeSent}</div>
                        </div>
                    </div>
                );
            }
        });

        return (
            <div className="content" ref={this.messagesBlock}>
                {listMessages}
            </div>
        );
    }
}


const mapPropsToState = (state : AppState, ownProps) => {
    return {
        messages : state.Messages
    }
};


export default connect(mapPropsToState)(MessageHistory);