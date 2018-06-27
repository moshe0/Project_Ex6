import * as React from "react";
import MessageHistory from "./MessageHistory";
import SendingMessage from "./SendingMessage";


class UserInteraction extends React.Component<{}, {}> {
    constructor(props: {}) {
        super(props);
    }

    public render() {
        return (
            <div className="right">
                <MessageHistory/>
                <SendingMessage/>
            </div>
        );
    }
}

export default UserInteraction;