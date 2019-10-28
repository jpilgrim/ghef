// cf. express-http-proxy


// content of index.js
const http = require('http')
const port = 8080

const requestHandler = (request, response) => {
  console.log("URL: " + request.url)
  console.log("Event: " + request.headers["x-github-event"]);
  //console.log(request)	
  let body = '';
    request.on('data', (chunk) => {
        body += chunk;
    });
    request.on('end', () => {
        // console.log(body);
        
        let pl = JSON.parse(body);

        // event pull_request:
        console.log("Action: " + pl.action); // openend or closed



        // console.log("Branch: " + pl.ref)




        response.write('OK'); 
        response.end(); 
    });
  // response.end('Hello Node.js Server!')
}

const server = http.createServer(requestHandler)

server.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})

