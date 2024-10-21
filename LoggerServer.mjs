// server.mjs
import { createServer } from 'node:http';

const server = createServer((request, response) => {
    if (request.method === 'POST') {
      var body = ''
      request.on('data', function(data) {
          body += data
      })
      request.on('end', function() {
          console.log(body)
          response.writeHead(200, {'Content-Type': 'text/plain'})
          response.end('post received')
      })
  }
});
// starts a simple http server locally on port 3000
server.listen(4000, '127.0.0.1', () => {
    console.log('Listening on 127.0.0.1:4000');
});
