import http from 'http';
import fs from 'fs';
import path from 'path'

// Getting __dirname for module file
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

// Getting port from .env or setting it to 8080
const port = process.env.PORT || 8080;

// Creating server
const server = http.createServer((req, res) => {

  // Build a file path
  const filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url)

  // Getting file extension
  const extname = path.extname(filePath);
  
  // Setting content type
  let contentType = 'text/html'
  
  switch (extname) {
    case ".js":
      contentType = "text/javascript";
      break;
    case ".css":
      contentType = "text/css";
      break;
    case ".json":
      contentType = "application/json";
      break;
    case ".png":
      contentType = "image/png";
      break;
    case ".jpg":
      contentType = "image/jpg";
      break;
  }

  // Read file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        // Page not found
        fs.readFile(path.join(__dirname, '404.html'), (err, content) => {
          if (err) throw err
          res.writeHead(404, { "Content-Type": "text/html" })
          res.end(content, 'utf8')
        })
      } else {
        // some server error
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`)
      }
    } else {
      // Success
      res.writeHead(200, { "Content-Type": contentType })
      res.end(content, 'utf8')
    }
  })
})

// listening to server
server.listen(port, () => console.log(`Server running at port ${port}`))