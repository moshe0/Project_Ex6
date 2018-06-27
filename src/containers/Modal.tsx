import * as React from "react"

interface IModalProps {
    children: React.ReactNode,
    style?: React.CSSProperties
}

const Modal = (props: IModalProps) => {
    return (
        <div style={blackScreenStyle}>
            <div style={{...modalStyle, ...(props.style || {})}}>
                {props.children}
            </div>
        </div>
    )
};

const blackScreenStyle: React.CSSProperties = {
    height: "100vh",
    width: "100vw",
    position: "fixed",
    right: "0",
    top: "0",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const modalStyle: React.CSSProperties = {
    borderRadius: '10px',
    background: "#F2F5F8",
    padding: '2.5rem',
};

export default Modal
