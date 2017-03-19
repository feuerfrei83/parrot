'use strict';

const express = require('express');
const crypto = require('crypto');
const app = express();
app.enable('trust proxy');

const Datastore = require('@google-cloud/datastore');
const datastore = Datastore({
	projectId: 'parrot-161917'
});

function getTranscripts(res, timeDiff) {
	if (!timeDiff) { timeDiff = 10000; }
	var earliest = Date.now() - timeDiff;
	const query = datastore.createQuery('Transcripts')
      .filter('timestamp', '>=', earliest);

    return datastore.runQuery(query)
      .then((results) => {
        const entities = results[0];
		var response = entities.map((entity) => { return {"time": entity.timestamp, "transcript": entity.description} });
		//res.send (entities.map((entity) => `{ "time": "${entity.timestamp}", "transcript": "${entity.description}" }`));
		res.setHeader('Content-Type', 'application/json');
    	res.send(JSON.stringify(response));
      });
}


app.get('/timediff/:seconds', (req, res, next) => {
	var timeDiff = req.params.seconds * 1000;
	getTranscripts(res, timeDiff);
});

app.get('/', (req, res, next) => {
	getTranscripts(res);
});

const PORT = process.env.PORT || 8080;
app.listen(process.env.PORT || 8080, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});

module.exports = app;
