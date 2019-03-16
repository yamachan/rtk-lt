import React from 'react';
import { TextField, Button } from '@material-ui/core';
import AlertDialogSlide from './AlertDialogSlide.jsx';
import request from 'superagent';

export default class TranslatePanel extends React.Component {
	constructor(props) {
		super(props);
		this.onScore = props.onScore;
		this.user = props.user.user;
		this.lang = props.lang;
		this.state = {
			text: "",
			ttext:"",
			open: false
        };
	}
	traslate(_en) {
		let req = {
			source: _en ? "ja" : "en",
			target: _en ? "en" : "ja",
			text: this.state.text
		}
		request.post('/translate').send(req).end((err, res) => {
			if (err) {
				console.log('Error: ' + err);
			} else {
				this.setState({ttext:res.text});
			}
		});
	}
	getScore(_score) {
		if (this.onScore) {
			this.onScore({
				text:this.state.text,
				ttext:this.state.ttext,
				score:_score,
				user:this.user,
				date:new Date()
			});
			this.setState({open:true})
		}
	}
	afterScore() {
		this.setState({text:"", ttext:"", open:false});
	}
	text(_key) {
        if (this.lang === 'ja') {
            return {
				hello_before: '',
				hello_after: 'さん、翻訳したい文章を入力してください。',
				from_label: '翻訳元の文章',
				from_placeholder: '英語もしくは日本語を入力してください',
				to_label: '翻訳結果',
				action_lang1: '英語に翻訳',
				action_lang2: '日本語に翻訳',
				action_clear: 'クリア',
				result: '翻訳結果の評価',
				score_0: '非常に悪い',
				score_1: '悪い',
				score_2: '普通',
				score_3: '良い',
				score_4: 'すごく良い',
				popupTitle: 'スコアの記録完了',
				popupDescription: '翻訳機能の利用をありがとうございます。 評価いただいたスコアは翻訳精度の向上の参考とさせていただきます！'
            }[_key];
        } else {
            return {
				hello_before: 'Hello',
				hello_after: ', please input the text which you want to translate.',
				from_label: 'Original Text',
				from_placeholder: 'English or Japanese text here...',
				to_label: 'Translated Text',
				action_lang1: 'To English',
				action_lang2: 'To Japanese',
				action_clear: 'Clear',
				result: 'Translation Score',
				score_0: 'Very bad',
				score_1: 'Bad',
				score_2: 'Normal',
				score_3: 'Good',
				score_4: 'Very good',
				popupTitle: 'Log the score',
				popupDescription: 'Thank you to use this translation function. The log data will be used for the future update.'
            }[_key];
        }
    }
	render() {
		return (
			<div>
				{this.text('hello_before')} {this.user} {this.text('hello_after')}
				<TextField id="tf-from" fullWidth multiline rows="4" margin="normal" variant="filled"
					label={this.text('from_label')}
					placeholder={this.text('from_placeholder')}
					InputLabelProps={{ shrink: true }}
					value={this.state.text}
					onChange={e => this.setState({text:e.target.value})} />
				<Button variant="contained" color="primary"
				  disabled={!this.state.text}
				  onClick={e => this.traslate(true)} >{this.text('action_lang1')}</Button>&nbsp;
				<Button variant="contained" color="primary"
				  disabled={!this.state.text}
				  onClick={e => this.traslate(false)} >{this.text('action_lang2')}</Button>&nbsp;
				<Button variant="contained" color="secondary"
				  disabled={!this.state.text}
				  onClick={e => this.setState({text:"", ttext:""})} >{this.text('action_clear')}</Button>
				<TextField id="tf-to" fullWidth multiline rows="4" margin="normal" variant="filled"
					label={this.text('to_label')}
					value={this.state.ttext}
					InputLabelProps={{ readOnly: true }} />
				{this.text('result')}<br/>
				<Button variant="contained" color="secondary" size="small"
					disabled={!this.state.ttext}
					onClick={e => this.getScore(0)} >
					{this.text('score_0')}</Button>&nbsp;
				<Button variant="contained" color="secondary" size="small"
					disabled={!this.state.ttext}
					onClick={e => this.getScore(1)} >
					{this.text('score_1')}</Button>&nbsp;
				<Button variant="contained" color="secondary" size="small"
					disabled={!this.state.ttext}
					onClick={e => this.getScore(2)} >
					{this.text('score_2')}</Button>&nbsp;
				<Button variant="contained" color="secondary" size="small"
					disabled={!this.state.ttext}
					onClick={e => this.getScore(3)} >
					{this.text('score_3')}</Button>&nbsp;
				<Button variant="contained" color="secondary" size="small"
					disabled={!this.state.ttext}
					onClick={e => this.getScore(4)} >
					{this.text('score_4')}</Button>
				<AlertDialogSlide
					dialogTitle={this.text('popupTitle')}
					dialogDescription={this.text('popupDescription')}
					open={this.state.open}
					afterClose={e => this.afterScore()} />
			</div>
		)
	}
}
