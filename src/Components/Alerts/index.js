import React from 'react'
import SweetAlert from 'react-bootstrap-sweetalert';

const Alert = (props) => {
    const onConfirm = () => {
        props.onConfirm();
    };

    const onCancel = () => {
        props.onCancel();
    };

    const style = {
        padding: "8px"
    }
    return (
        <>
            {props.type === "success" ? (
                <SweetAlert
                    success
                    title={props.title}
                    style={style}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                >
                    {props.body}
                </SweetAlert>
            ) : props.type === "warning" ? (
                <SweetAlert
                    warning
                    title={props.title}
                    style={style}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                >
                    {props.body}
                </SweetAlert>
            ) : (
                <SweetAlert
                    danger
                    title={props.title}
                    style={style}
                    onConfirm={onConfirm}
                    onCancel={onCancel}
                >
                    {props.body}
                </SweetAlert>
            )}
        </>
    )
}

export default Alert