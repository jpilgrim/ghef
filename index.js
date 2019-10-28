#!/usr/bin/env node

const proxy = require('express-http-proxy');
const express = require('express');
const yargs = require("yargs");

const argv = yargs
  .scriptName("GitHub event filter, only fowards pushes and opened pull-requests.")
  .usage('$0 [args]')
  .default('inPort', 3000)
  .default('outServer', 'localhost')
  .default('outPort', 8080)
  .help()
  .hide("version")
  .argv

const inPort = argv.inPort
const outServer = argv.outServer
const outPort = argv.outPort


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
			
			let accept = event==' push'
				|| (event == 'pull_request' && action == 'opened');

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
app.listen(inPort, () => console.log(`GitHub Event Filter listening on port ${inPort}, forwarding to ${outServer}:${outPort}!`))