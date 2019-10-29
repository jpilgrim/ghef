/*
 * This is only a test script to emulate a server in order to test whether the proxy is delegating
 * correctly.
 */

// cf. express-http-proxy


// content of index.js
const http = require('http')
const port = 8080

const requestHandler = (request, response) => {
  try {
    console.log("URL: " + request.url)
    console.log("Event: " + request.headers["x-github-event"]);
    //console.log(request)	
    let body = '';
      request.on('data', (chunk) => {
          body += chunk;
      });
      request.on('end', () => {
          try {
            // console.log(body);
            
            let pl = JSON.parse(body);

            // event pull_request:
            console.log("Action: " + pl.action); // openend or closed



            // console.log("Branch: " + pl.ref)

            } catch (ex) {
              // ignore
            }
            response.write('OK'); 
            response.end(); 
      });
    } catch (ex) {
      console.log("Error processing request: " + ex)
    }
  // response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

