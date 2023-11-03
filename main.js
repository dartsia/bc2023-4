const http = require('http');
const xml = require('fast-xml-parser');
const xmlBuilder = require("fast-xml-parser");
const fs = require('fs');

const host = 'localhost';
const port = 8000;
const type = "utf-8";

function findMinValue(data) {
    let minv = 100000;
    for (let list of data.indicators.res) {
      if (list.value < minv) {
        minv = list.value;
      }
    }
    return minv;
}

const requestListener = function (req, res) {
    res.writeHead(200);
    const data = fs.readFileSync("data.xml", type);
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "",
    };

    const parser = new xml.XMLParser();
    const jsonData = parser.parse(data, options);
    const minVal = findMinValue(jsonData);

    const xmlData = {
        data: {
            min_value: minVal,
        },
    };

    const builder = new xmlBuilder.XMLBuilder();
    const xmlres = builder.build(xmlData);

    fs.writeFileSync("res.xml", xmlres);
    res.end(xmlres);
}

const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
})
