const express = require('express');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');

const app = express();

const PORT = 8080;

/**
 * @type {Map<string, {file: string, type: string, basename: string}>}
 */
const FilesInfo = new Map();

app.get('/d/:file', async function(req, res) {
    if(!req.params.file || !FilesInfo.has(req.params.file)) {
        res.writeHead(404, 'File not found');
    }
    const File = FilesInfo.get(req.params.file);


    res.setHeader('Content-disposition', 'attachment; filename=' + File.basename);
    res.setHeader('Content-type', File.type);

    const Stream = fs.createReadStream(File.file);
    Stream.pipe(res);
});

app.listen(PORT, async function() {
    const Files = fs.readdirSync(path.join(__dirname, 'files')).filter(f => f.endsWith('.json'));
    for(const File of Files) {
        const info = require(path.join(__dirname, 'files', File));
        const file = path.join(__dirname, 'files', info.file);
        const basename = path.basename(file);
        const type = mime.lookup(file);
        FilesInfo.set(info.get, {file, basename, type});
    }
});