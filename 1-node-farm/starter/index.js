const fs = require("fs");
const http = require("http");
const url = require("url");

//////////////////////////
// files

// blocking, synchronous way
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// //console.log(textIn);

// const textOut = `This is what we know about the avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut);
// //console.log("The file has been written");

// // non blocking , asynchronous
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile(`./txt/append.txt`, "utf-8", (err, data3) => {
//         console.log(data3);

//         fs.writeFile('./txt/final.txt', `${data2}\n${data3}`,
//         'utf-8', err => {
//             console.log('Your file has been written 😄')
//         })
//       });
//   });
// });
// console.log("Will read file!");

///////////////////////////////
// server

const server = http.createServer((req, res) => {
  console.log(req.url);

  const pathName = req.url;

  if (pathName == "/" || pathName == "/overview") {
    res.end("This is the OVERVIEW");
  } else if (pathName == "/product") {
    res.end("This is the PRODUCT");
  } else {
    res.writeHead(404, 
      { 
        'Content-Type' : 'text/html',
        'my-own-header': 'hello header'
      });
    res.end("<h1>The page cannot be found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server has been started..");
});
