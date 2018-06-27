import * as React from "react";
import StateStore from "../state/StateStore";
import {GetType} from "../Helpers/MainHelpers";
import {appService} from "../AppService";
import {InitTree} from "../Helpers/InitTree";



class MessageHistory extends React.Component <{}, {Messages}>{

    stateStore = StateStore.getInstance();
    messagesBlock : any;

    constructor(props: {}) {
        super(props);
        this.messagesBlock = React.createRef();
        this.state = {
            Messages : [],
        };


        this.stateStore.subscribe(async()=>{
            let index = InitTree.GetSelectedChildrenNames().find(item => item === StateStore.getInstance().get('currentUser').Name);

            if(!! this.stateStore.get('currentUser') && !! this.stateStore.get('Receiver') && !!index) {
                const resMessages = await appService.GetMessages(this.stateStore.get('currentUser'), this.stateStore.get('Receiver'));
                this.setState({
                    Messages : resMessages
                });
            }
            else if(!!this.stateStore.get('HoldReceiver')  && !!index){
                const resMessages = await appService.GetMessages(this.stateStore.get('currentUser'), this.stateStore.get('HoldReceiver'));
                    this.setState({
                    Messages : resMessages
                });
            }
            else{
                this.setState({
                    Messages: []
                });
            }
        });
    }

    //Befor render
    async componentWillMount(){
        const resMessages = await appService.GetMessages(this.stateStore.get('currentUser'), this.stateStore.get('Receiver'));
        if(!! this.stateStore.get('currentUser') && !! this.stateStore.get('Receiver')) {
            this.setState({
                Messages : resMessages
            });
        }
        else if(!!this.stateStore.get('HoldReceiver')){
            const resMessages = await appService.GetMessages(this.stateStore.get('currentUser'), this.stateStore.get('HoldReceiver'));
            this.setState({
                Messages : resMessages
            });
        }
        else{
            this.setState({
                Messages : []
            });
        }
    }

    //After render
    componentDidMount(){
        this.messagesBlock.current.scrollTop = this.messagesBlock.current.scrollHeight;
    }

    // After updating occurs
    componentDidUpdate(){
        this.messagesBlock.current.scrollTop = this.messagesBlock.current.scrollHeight;
    }

    public render() {
        if(! this.stateStore.get('currentUser')){
            return (
                <div className="content" ref={this.messagesBlock}/>
            );
        }
        const listMessages = this.state.Messages.map((item, idx) => {
            const itemClassName = this.stateStore.get('currentUser').Name === item.SendingUser? 'MineMessage MessageHistory' : 'OtherMessage MessageHistory';
            let Receiver = '';
            if(!! this.stateStore.get('Receiver'))
                Receiver = GetType(this.stateStore.get('Receiver'));
            else if(!! this.stateStore.get('HoldReceiver'))
                Receiver = GetType(this.stateStore.get('HoldReceiver'));

            if(Receiver === 'group') {
                return (
                    <div className={'message'} key={idx}>
                        <div className={itemClassName}>
                            <div className={'MessageUserSending'}>{item.SendingUser}</div>
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

export default MessageHistory;