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

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }

  return output;
};

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  console.log(url.parse(req.url));
  const { query, pathname } = url.parse(req.url, true);

  // OVERVIEW
  if (pathname == "/" || pathname == "/overview") {
    res.writeHead(200, "text/html");

    const cardsHtml = dataObj
      .map((el) => replaceTemplate(tempCard, el))
      .join("");
    //console.log(cardsHtml);
    const output = tempOverview.replace("{%PRODUCT_CARDS%", cardsHtml);
    res.end(output);
    // PRODUCT
  } else if (pathname == "/product") {
    console.log(query);
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);

    res.writeHead(200, "text/html");
    res.end(output);

    // API
  } else if (pathname == "/api") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(data);

    // NOT FOUND
  } else {
    res.writeHead(404, {
      "Content-Type": "text/html",
      "my-own-header": "hello header",
    });
    res.end("<h1>The page cannot be found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server has been started..");
});
