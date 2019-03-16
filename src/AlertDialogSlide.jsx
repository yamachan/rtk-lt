import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide } from '@material-ui/core'

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

export default class AlertDialogSlide extends React.Component {
    constructor(props) {
		super(props);
        this.afterClose = this.props.afterClose;
        this.title = this.props.dialogTitle || 'Dialog';
        this.description = this.props.dialogDescription;
        this.lang = props.lang;
	}
    text(_key) {
        if (this.lang === 'ja') {
            return {
                ok: '了解'
            }[_key];
        } else {
            return {
                ok: 'OK'
            }[_key];
        }
    }
    render() {
        return (
            <Dialog
                open={this.props.open}
                TransitionComponent={Transition}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description" >
                <DialogTitle id="alert-dialog-slide-title">{this.title || "Alert"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">{this.description}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={e => this.afterClose()} color="primary">{this.text('ok')}</Button>
                </DialogActions>
            </Dialog>
        );
    }
}
