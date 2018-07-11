import * as React from "react";
import StateStore from "../state/StateStore";
import {appService} from "../AppService";
import {InitTree} from "../Helpers/InitTree";
import MainHelpers from "../Helpers/MainHelpers";
import {store} from "../Redux/store";
import {AppState} from "../Redux/AppState";
import {connect} from "react-redux";
import {setMessages} from "../Redux/actions";


interface IMessageHistoryProps {
    receiver : any
}

class MessageHistory extends React.Component <IMessageHistoryProps, {}>{

    stateStore = StateStore.getInstance();
    messagesBlock : any;

    constructor(props: IMessageHistoryProps) {
        super(props);
        this.messagesBlock = React.createRef();
    }

    //Befor render
    async componentWillMount(){
        const resMessages = await appService.GetMessages(store.getState()['currentUser'], store.getState()['Receiver']);
        if(!! store.getState()['currentUser'] && !! store.getState()['Receiver']) {
            store.dispatch(setMessages(resMessages));
        }
        else if(!!store.getState()['HoldReceiver']){
            const resMessages = await appService.GetMessages(store.getState()['currentUser'], store.getState()['HoldReceiver']);
            store.dispatch(setMessages(resMessages));
        }
        else
            store.dispatch(setMessages([]));
    }

    //After render
    componentDidMount(){
        this.messagesBlock.current.scrollTop = this.messagesBlock.current.scrollHeight;
    }

    // After updating occurs
    async componentDidUpdate(){
        let index;
        if(!!store.getState()['currentUser'])
            index = InitTree.GetSelectedChildrenNames().find(item => item === store.getState()['currentUser'].Name);

        if(!! store.getState()['currentUser'] && !! store.getState()['Receiver'] && !!index) {
            const resMessages = await appService.GetMessages(store.getState()['currentUser'], store.getState()['Receiver']);
            this.setState({
                Messages : resMessages
            });
        }
        else if(!!store.getState()['HoldReceiver']  && !!index){
            const resMessages = await appService.GetMessages(store.getState()['currentUser'], store.getState()['HoldReceiver']);
            this.setState({
                Messages : resMessages
            });
        }
        else{
            this.setState({
                Messages: []
            });
        }


        this.messagesBlock.current.scrollTop = this.messagesBlock.current.scrollHeight;
    }

    public render() {
        if(!store.getState()['currentUser']){
            return (
                <div className="content" ref={this.messagesBlock}/>
            );
        }
        const listMessages = store.getState()['messages'].map((item, idx) => {
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
         receiver : state.Receiver,
    }
};


export default connect(mapPropsToState)(MessageHistory);