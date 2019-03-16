import React from 'react';
import { Card, CardContent, CardActions, TextField, Button } from '@material-ui/core';
import AlertDialogSlide from './AlertDialogSlide.jsx';

export default class LoginPanel extends React.Component {
	constructor(props) {
		super(props);
		this.onLogin = props.onLogin;
		this.lang = props.lang;
		this.state = {
            user: "guest",
			pw: "",
			open: false
        };
	}
	text(_key) {
        if (this.lang === 'ja') {
            return {
				id: 'ユーザーID',
				pw: 'パスワード',
				submit: 'ログインする',
				clear: 'クリア',
				errorTitle: 'ログインエラー',
				errorDescription: 'ユーザーID もしくは パスワード を確認してください。'
			}[_key];
		} else {
			return {
				id: 'User ID',
				pw: 'Password',
				submit: 'Login',
				clear: 'Clear',
				errorTitle: 'Login error',
				errorDescription: 'Please check User ID and/or Password.'
            }[_key];
        }
    }
	checkLogin() {
		// ここは今回、手抜きしています！
		if (this.state.user == "guest" || this.state.user == "yamachan") {
			this.onLogin({user:this.state.user});
		} else {
			this.setState({open:true});
		}
	}
	render() {
		return (
			<div>
			<Card style={{width:"16em", margin:"1em auto"}}>
				<CardContent>
					<TextField error={!this.state.user} required id="tf-user" label={this.text('id')} margin="normal"
					  value={this.state.user}
					  onChange={e => this.setState({user:e.target.value})} />
					<br/>
					<TextField id="tf-pw" label={this.text('pw')} type="password" margin="normal"
					  value={this.state.pw}
					  onChange={e => this.setState({pw:e.target.value})} />
				</CardContent>
				<CardActions>
					<Button variant="contained" color="primary"
					  disabled={!this.state.user}
					  onClick={e => this.checkLogin()} >
					{this.text('submit')}</Button>
					<Button variant="contained" color="secondary"
					  onClick={e => this.setState({user:"", pw:""})} >
					{this.text('clear')}</Button>
				</CardActions>
			</Card>
			<AlertDialogSlide
				dialogTitle={this.text('errorTitle')}
				dialogDescription={this.text('errorDescription')}
				open={this.state.open}
				afterClose={e => this.setState({open:false})}
				lang={this.lang} />
			</div>
		)
	}
}
