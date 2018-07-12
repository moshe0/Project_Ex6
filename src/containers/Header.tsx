import * as React from "react";
import {Link} from "react-router-dom";
import {store} from "../Redux/store";
import {setMany} from "../Redux/actions";
import MainHelpers from "../Helpers/MainHelpers";

interface IHeaderProps {
    currentUser : any
}

class Header extends React.Component<IHeaderProps, {}>  {
    constructor(props: IHeaderProps) {
        super(props);
    }

    LoginImage = () =>{
        store.dispatch(setMany({
            'HoldReceiver': store.getState()['Receiver'],
            'Receiver': null,
            'ModalState': true,
        }));
    };

    public render() {
        let userName = 'Not connected';
        if(!! this.props.currentUser)
            userName = this.props.currentUser.Name;
        return (
            <div className="Header">
                <Link to='/LogOut'><div title="Log out" className="LoginImage" onClick={this.LoginImage}/></Link>
                <div className="LoginStatus">{userName}</div>
            </div>
        );
    }
}

export default Header;