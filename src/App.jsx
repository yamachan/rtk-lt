import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { AppBar,Toolbar, Avatar, Card, CardContent, Button, Typography } from '@material-ui/core'
import LoginPanel from './LoginPanel.jsx';
import MainPanel from './MainPanel.jsx';

class App extends Component {
	constructor(props) {
		super(props);
        this.state = {
            lang: location.search.includes("lang=en") ? 'en' : 'ja',
            user: null
        };
	}
    text(_key) {
        if (this.state.lang === 'ja') {
            return {
                title: '翻訳アプリ (ログ機能付き)'
            }[_key];
        } else {
            return {
                title: 'Translation App (with Log function)'
            }[_key];
        }
    }
	render() {
		return (
            <div>
                <AppBar position="static" color="primary">
                    <Toolbar>
                        <Typography type="title" color="inherit">
                            {this.text('title')} &nbsp; &nbsp; by yamachan
                        </Typography>
                    </Toolbar>
                </AppBar>
                {this.state.user == null ?
                    <LoginPanel onLogin={u => this.setState({user:u})} lang={this.state.lang} /> :
                    <MainPanel user={this.state.user} lang={this.state.lang} />
                }
            </div>
		);
	}
}

ReactDOM.render(
  <App />,
  document.getElementById('react-root')
);
