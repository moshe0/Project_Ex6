import * as React from 'react'
import '../App.css';
import UserInteraction from './UserInteraction';
import TreeInteraction from "./TreeInteraction";


class Main extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    public render() {
        return (
            <div className="MainClass">
                <TreeInteraction/>
                <UserInteraction/>
            </div>
        );
    }
}

export default Main;
