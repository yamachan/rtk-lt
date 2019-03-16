import React from 'react';
import { Tabs, Tab, Typography, List, ListItem, ListItemIcon, ListItemText, Icon } from '@material-ui/core';
import TranslatePanel from './TranslatePanel.jsx';
import request from 'superagent';

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

export default class MainPanel extends React.Component {
	constructor(props) {
		super(props);
		this.user = props.user;
		this.lang = props.lang;
		this.state = {
            tab: 0,
			log: []
        };
	}
	componentWillMount() {
		if (this.user && !!this.user.user) {
			request.get('/list/' + this.user.user).end((err, res) => {
				if (err) {
					console.log('Error: ' + err);
				} else {
					//console.log('res.text: ' + res.text);
					this.setState({log:JSON.parse(res.text)});
				}
			});
		}
	}
	getScore(_o) {
		request.post('/add').send(_o).end((err, res) => {
			if (err) {
				console.log('Error: ' + err);
			}
		});
		this.setState({log: this.state.log.concat(_o)});
	}
	star(_s) {
		return [
			'exposure_neg_2',
			'exposure_neg_1',
			'check',
			'star_half',
			'star'
		][_s];
	}
	text(_key) {
        if (this.lang === 'ja') {
            return {
                tab_translate: '翻訳ページ',
				tab_log: '翻訳ログ'
            }[_key];
        } else {
            return {
				tab_translate: 'Translate',
				tab_log: 'Log'
            }[_key];
        }
    }
	render() {
		return (
			<div style={{padding:"1em"}}>
				<Tabs value={this.state.tab} onChange={(e,v) => this.setState({tab:v})}>
					<Tab label={this.text('tab_translate')} />
					<Tab label={this.text('tab_log')} />
				</Tabs>
				{this.state.tab === 0 && <TabContainer>
					<TranslatePanel
						user={this.user}
						lang={this.lang}
						onScore={e => this.getScore(e)}
					 />
				</TabContainer>}
				{this.state.tab === 1 && <TabContainer>
					<List component="nav">
						{this.state.log.map(o => (
							<ListItem key={o.text + '-=-'+ o.score + o.ttext}>
								<ListItemIcon><Icon>{this.star(o.score)}</Icon></ListItemIcon>
								<ListItemText primary={o.text} secondary={o.ttext} />
							</ListItem>
						))}
					</List>
				</TabContainer>}
			</div>
		)
	}
}
