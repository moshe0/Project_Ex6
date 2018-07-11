import Header from './Header';
import Main from './Main';
import * as React from 'react'
import LogIn from "../components/LogIn";
import LogOut from "../components/LogOut";
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import Add from "../components/Add";
import UpdateUser from "../components/UpdateUser";
import {InitTree} from "../Helpers/InitTree";
import {AppState} from "../Redux/AppState";
import {connect} from "react-redux";
import {doChangeErr, doLogin} from "../Redux/actions";
import {store} from "../Redux/store";

interface IAppProps {
    doLogin(userName: string, password: string): void,
    doChangeErr(err: string),
    messageErr : string,
    logInState: boolean
}

interface IAppState {
    userLogin: string,
    passwordLogin: string,
}

class App extends React.Component<IAppProps, IAppState> {
    canLogin: boolean;

    constructor(props: IAppProps) {
        super(props);

        this.state = {
            userLogin : 'Moshe',
            passwordLogin: '11',
        };
    }

    Login = async () => {
        this.props.doLogin(this.state.userLogin, this.state.passwordLogin);
    };

    public InputChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let name = event.target.name;
        const value = event.target.value;

        this.props.doChangeErr('');
        if (name === 'userLogin')
            this.setState({userLogin: value});
        else
            this.setState({passwordLogin: value});

    };


    ShowLogin = () => {
        const canLogin = !!this.state.userLogin && !!this.state.passwordLogin;

        if(!!store.getState()['currentUser']){
            return (<Redirect to="/"/>)
        }

        return (
            <LogIn
                canLogin={canLogin}
                passwordLogin={this.state.passwordLogin}
                MessageErr={this.props.messageErr}
                userLogin={this.state.userLogin}
                InputChangedHandler={this.InputChangedHandler}
                LoginCallback={this.Login}
            />
        );
    };

    ShowLogOut = () => {
        if (!store.getState()['currentUser'])
            return (<Redirect to="/LogIn"/>);
        return <LogOut/>
    };

    ShowAdd = () => {
        const type = InitTree.SelectedType();
        let addTypes = [];
        let isGroupWithUsersMode = false;
        if (type === 'Empty group')
            addTypes = ['New user', 'New group', 'Add existing user to marked group', 'Add new group to marked group'];
        else if(type === 'Group with users') {
            addTypes = ['New user', 'New group', 'Add existing user to marked group', 'Add new group to marked group'];
            isGroupWithUsersMode = true;
        }
        else if (type === 'Group with groups')
            addTypes = ['New user', 'New group', 'Add new group to marked group'];
        else
            addTypes = ['New user', 'New group'];
        return <Add AddType={addTypes} isGroupWithUsersMode={isGroupWithUsersMode}/>
    };

    appRoutes = () => {
        const currentUser = !!store.getState()['currentUser'];

        return (
            <div>
                {!currentUser ? (<Redirect to='/LogIn'/>) : null}
                <Route path='/LogOut' render={this.ShowLogOut}/>
                <Route path='/Add' render={this.ShowAdd}/>
                <Route path='/UpdateUser' component={UpdateUser}/>
            </div>
        )
    };

    public render() {
        return (
            <BrowserRouter>
                <div className="bodyClass">
                    <Switch>
                        <Route path='/LogIn' render={this.ShowLogin}/>
                        <Route path='/' render={this.appRoutes}/>
                    </Switch>
                    <Header currentUser={store.getState()['currentUser']}/>
                    <Main/>
                </div>
            </BrowserRouter>
        );
    }
}



const mapPropsToState = (state : AppState, ownProps) => {
    return {
        messageErr : state.MessageErr,
        logInState : state.LogInState
    }
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        doLogin: (userName: string, password: string) => {
            dispatch(doLogin({Name: userName, Password: password}))
        },
        doChangeErr: (err: string) => {
            dispatch(doChangeErr(err))
        }


    }
};

export default connect(mapPropsToState, mapDispatchToProps)(App);