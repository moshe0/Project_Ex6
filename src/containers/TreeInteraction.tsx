import * as React from "react";
import Tree from "./Tree";
import TreeActions from "./TreeActions";


class TreeInteraction extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    public render() {
        return (
            <div className="left">
                <Tree/>
                <TreeActions/>
            </div>
        );
    }
}

export default TreeInteraction;