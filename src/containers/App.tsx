import Header from './Header';
import Main from './Main';
import * as React from 'react'
import StateStore from "../state/StateStore";
import LogIn from "../components/LogIn";
import LogOut from "../components/LogOut";
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import {appService} from "../AppService";
import Add from "../components/Add";
import UpdateUser from "../components/UpdateUser";
import {InitTree} from "../Helpers/InitTree";


interface IAppUserState {
    userLogin: string,
    passwordLogin: string,
    MessageErr : string
}

class App extends React.Component<{}, IAppUserState> {
    canLogin: boolean;

    constructor(props: {}) {
        super(props);

        this.state = {
            userLogin: 'Moshe',
            passwordLogin: '11',
            MessageErr : ''
        };

        StateStore.getInstance().subscribe(() => {
            let userLogin = this.state.userLogin;
            this.setState({
                userLogin: userLogin
            });
        });
    }

    Login = async () => {
        const LoginUser = await appService.GetSpecificUser(this.state.userLogin, this.state.passwordLogin);
        if(LoginUser.Id === -1){
            this.setState({
                MessageErr : 'User name or password incorrect!'
            });
            return;
        }
        const Data = await appService.GetData();

        if (!!LoginUser && !!Data) {
            StateStore.FirstUse = 1;
            StateStore.getInstance().setMany({
                'currentUser': LoginUser,
                'Data': Data,
                'ModalState': false,
                'LogInState': false
            });
        }
    };

    public InputChangedHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        let name = event.target.name;
        const value = event.target.value;

        if (name === 'userLogin')
            this.setState({userLogin: value, MessageErr : ''});
        else
            this.setState({passwordLogin: value, MessageErr : ''});

    };


    ShowLogin = () => {
        const canLogin = !!this.state.userLogin && !!this.state.passwordLogin;

        if (!!StateStore.getInstance().get('currentUser')) {
            return (<Redirect to="/"/>)
        }

        return (
            <LogIn
                canLogin={canLogin}
                passwordLogin={this.state.passwordLogin}
                MessageErr={this.state.MessageErr}
                userLogin={this.state.userLogin}
                InputChangedHandler={this.InputChangedHandler}
                LoginCallback={this.Login}
            />
        );
    };

    ShowLogOut = () => {
        if (!StateStore.getInstance().get('currentUser'))
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
        const currentUser = !!StateStore.getInstance().get('currentUser');

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
                    <Header/>
                    <Main/>
                </div>
            </BrowserRouter>
        );
    }
}


export default App;