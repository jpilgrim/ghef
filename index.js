#!/usr/bin/env node

const proxy = require('express-http-proxy');
const express = require('express');
const yargs = require("yargs");
var pjson = require('./package.json');

const argv = yargs
  .scriptName("GitHub event filter, only fowards pushes and opened pull-requests.")
  .usage('$0')
  .option('inPort',  {
  		default: 3000, 
  		describe: 'Port to which github/smee.io sends events.',
  		type: 'number'
	})
  .option('outServer', {
  		default: 'localhost',
  		describe: 'Host on which Jenkins runs.',
  		type: 'string'
  	})
  .option('outPort', {
  		default: 8080,
  		describe: 'Port on which Jenkins is listening.',
  		type: 'number'
  	})
  .option('syncPR', {
        default: true,
        describe: 'if true, pull_request synchronize actions are forwarded as well. This is required if pull requests are to be build (and updated) stemming from 3rd party repositories.',
        type: 'boolean'
    })
  .help() // --help
  .argv;

const inPort = argv.inPort
const outServer = argv.outServer
const outPort = argv.outPort
const syncPR = argv.syncPR


var app = express();
app.use(express.json());
app.use('/', proxy(outServer+":"+outPort,
	{
	  parseReqBody: true,
	  filter: function(req, res) {
	  	try {
			const event = req.headers["x-github-event"];
			const body = req.body;
			const action = body ? body.action : null;
			const number = body ? body.number : null;
			
			let accept = event== 'push'
				|| (event == 'pull_request' && action == 'opened');

			if (!accept && syncPR) {		
				accept = event == 'pull_request' && action == 'synchronize';
			}

			console.log((accept?'Forwarding':
				                '  Ignoring')
			    + (number ? ' #'+number : '')
				+ ' github event: ' + event 
				+ (action ? ', action: ' + action : ''));


			/*
			 * in particular, ignore event -- action 
			 * - issue_comment -- action created etc.
			 * - pull_request -- edited, assigned, labeled, unlabeled, closed etc.
			 * - 
			 */

			// console.log("... ignored");
			return accept;
		} catch (ex) {
			console.log("ERROR processing github event: " + ex + ", req: " +
				 req);
			return false;
		}
	  }
	}
));
app.use('/', function(req, res, next) { // send ok when event is ignored, otherwise log is floated with errros by smee client
	res.send('OK');	
})
app.listen(inPort, () => console.log(`GitHub Event Filter ${pjson.version} listening on port ${inPort}, forwarding to ${outServer}:${outPort}, syncPR is ${syncPR}!`))