const fs = require('fs');
const express = require("express");
const LanguageTranslatorV3 = require('watson-developer-cloud/language-translator/v3');
const bodyParser = require('body-parser');
const Cloudant = require('@cloudant/cloudant');

const app = express();
app.use(express.static('public'));

let lt_apikey = '<your apiKey>';
try {
	let lt_obj = JSON.parse(process.env.VCAP_SERVICES);
	if (!!lt_obj.language_translator[0].credentials.apikey) {
		lt_apikey = lt_obj.language_translator[0].credentials.apikey;
	}
} catch (e) {}
const languageTranslator = new LanguageTranslatorV3({
  iam_apikey: lt_apikey,
  url: 'https://gateway.watsonplatform.net/language-translator/api/',
  version: '2018-05-01'
});

// Check Custom Tlanslation Model
let custom_model_id = '';
languageTranslator.listModels(
  {},
  function(error, response) {
    if (response.models) {
		let m = response.models.filter(m => m.name == 'custom-en-ja');
		if (m.length > 0) {
		  custom_model_id = m[0].model_id;
	  	} else {
			console.log("Can't find custom model: custom-en-ja");
			languageTranslator.createModel(
				{
					name: 'custom-en-ja',
					base_model_id: 'en-ja',
					forced_glossary: fs.createReadStream('glossary.tmx')
				},
				function(error, response) {
					if (error)
						console.log('Create Model: ' + error);
					else
						console.log(JSON.stringify(response, null, 2));
				}
			);
		}
  	}
  }
)

app.use(bodyParser.json({strict: true}));
app.post('/translate', (req, res) => {
	languageTranslator.translate(
		!!custom_model_id && req.body.target == 'ja' ?
		{
		    text: req.body.text,
			model_id: custom_model_id
		} : {
			text: req.body.text,
			source: req.body.source,
			target: req.body.target
		},
		function(err, translation) {
			if (err)  {
				res.status(500).send('error:' + err);
			} else  {
				res.status(200).send(translation.translations[0].translation);
			}
		}
	);
});

let cloudant_credentials = {
	// <your credentials>
};
try {
	let db_obj = JSON.parse(process.env.VCAP_SERVICES);
	if (!!db_obj.cloudantNoSQLDB[0].credentials) {
		cloudant_credentials = db_obj.cloudantNoSQLDB[0].credentials;
	}
} catch (e) {}
const cloudant = Cloudant(cloudant_credentials);

const cloudant_dbname = 'rtk-lt';
cloudant.db.create(cloudant_dbname, function(err, data) {
	if(!err) //err if database doesn't already exists
		console.log("Created database: " + cloudant_dbname);
});
const db = cloudant.db.use(cloudant_dbname);

app.post('/add', (req, res) => {
	//console.dir(req.body);
	if (req.body) {
		db.insert(req.body, function(err, body, header) {
			if (err) {
				console.log('[db.insert] ', err.message);
				res.status(500).send("Error");
				return;
			}
			req.body._id = body.id;
			console.dir(req.body);
			res.status(200).send(req.body);
		});
	}
});
app.get('/list/:user', (req, res) => {
	if (!!req.params.user) {
		db.find({ selector: { user:req.params.user }, limit:50 }, function(err, result) {
			if (err) {
				console.log('[db.find] ', err.message);
				res.status(500).send("Error");
				return;
			}
			let json = '[' + result.docs.map(doc => JSON.stringify(doc)).join(',') + ']';
			res.status(200).send(json);
		});
	} else {
		res.status(400).send("Bad Request");
	}
});


let port = process.env.PORT || 3000;
app.listen(port);
