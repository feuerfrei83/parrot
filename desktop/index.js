'use strict';

const fs = require('fs');
const record = require('node-record-lpcm16');
const Speech = require('@google-cloud/speech');
const Datastore = require('@google-cloud/datastore');
const projectId = 'parrot-161917';
const datastore = Datastore();
const speech = Speech();
const encoding = 'LINEAR16';
const sampleRate = 16000;
const request = {
	config: {
	  encoding: 'LINEAR16',
	  sampleRate: sampleRate
	}
};

var transcripts = { 0: new Array(),
					1: new Array(),
					2: new Array(),
					3: new Array(),
					4: new Array() };
var cursor = 0
var timerStarted = false;
const recognizeStream = speech.createRecognizeStream(request)
							  .on('error', console.error)
							  .on('data', (data) => {
								  					  process.stdout.write(data.results);
								  					  (transcripts[cursor]).push(data.results);
													  if(timerStarted === false) {
														  setTimeout(incrementCursorAndWrite, 5000);
													  }
													  timerStarted = true;
												    });

// Every 5 seconds advance the cursor, then store the current transcript buffer and empty it
function incrementCursorAndWrite(){
	var temp = cursor;
	cursor = (cursor+1 == 5) ? 0 : cursor+1;
	storeTranscript(transcripts[temp].join(' '));
	transcripts[temp] = [];
	timerStarted = false;
};

// Start recording and send the microphone input to the Speech API
record.start({
	sampleRate: sampleRate,
	threshold: 0
}).pipe(recognizeStream);

console.log('Listening, press Ctrl+C to stop.');

// The kind for the new entity
const kind = 'Transcripts';

function storeTranscript(data) {
	console.log('storing transcript: ' + JSON.stringify(data));
	var now = (new Date()).getTime();
	const transcriptKey = datastore.key([kind, now]);
	var task = {
	  key: transcriptKey,
	  data: {
		timestamp: now,
	    description: data
	  }
	};
	datastore.save(task)
			 .then(() => {
			    console.log(`Saved ${task.key.name}: ${task.data.description}`);
			 });

}
