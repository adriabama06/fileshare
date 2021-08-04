const express = require('express');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types');
const YAML = require('yaml');

const app = express();

const PORT = 6060;

/**
 * @type {Map<string, {file: string, type: string, basename: string, size: number}>}
 */
const FilesInfo = new Map();

app.get('/d/:file', async function(req, res) {
    if(!req.params.file || !FilesInfo.has(req.params.file)) {
        res.writeHead(404, 'File not found');
        res.send()
        return;
    }
    const File = FilesInfo.get(req.params.file);

    res.setHeader('Content-Length', File.size);
    res.setHeader('Content-disposition', 'attachment; filename=' + File.basename);
    res.setHeader('Content-type', File.type);

    const Stream = fs.createReadStream(File.file);
    Stream.on('data', async function (chunk) {
        if(!res.write(chunk)) {
            Stream.pause();
        }
    });
    Stream.on('end', async function () {
        res.end();
    });
    res.on('drain', async function () {
        Stream.resume();
    });
});

app.get('*', async function(req, res) {
    res.redirect('https://www.youtube.com/c/adriabama06');
});

async function reloadFiles() {
    /**
     * @type {Map<string, {file: string, type: string, basename: string, size: number}>}
     */
    var toreturn = new Map();
    const Files = fs.readdirSync(path.join(__dirname, 'files')).filter(f => f.endsWith('.json'));
    for(const File of Files) {
        const info = require(path.join(__dirname, 'files', File));
        const file = path.join(__dirname, 'files', info.file);
        const basename = path.basename(file);
        const type = mime.lookup(file);
        const size = fs.statSync(file).size;
        FilesInfo.set(info.get, {file, basename, type, size});
        toreturn.set(info.get, {file, basename, type, size});
    }
    return toreturn;
}

async function YAMLreloadFiles() {
    /**
     * @type {Map<string, {file: string, type: string, basename: string, size: number}>}
     */
    var toreturn = new Map();
    const Files = fs.readdirSync(path.join(__dirname, 'files')).filter(f => f.endsWith('.yaml'));
    for(const File of Files) {
        const Data = fs.readFileSync(path.join(__dirname, 'files', File), { encoding: 'utf8' });
        /*const SData = Data.toString('utf-8').replace(/\n/g, '').split(/[:\s\n]+/g);
        /**
         * @type {{file: string, get: string}}
         *\/
        const toJSON = {}
        for(var i = 0; i <= SData.length/2; i+=2) {
            toJSON[SData[i]] = SData[i+1];
            console.log(toJSON[SData[i]], SData[i+1]);
        }*/
        const toJSON = YAML.parse(Data);

        const file = path.join(__dirname, 'files', toJSON.file);
        const basename = path.basename(file);
        const type = mime.lookup(file);
        const size = fs.statSync(file).size;
        FilesInfo.set(toJSON.get, {file, basename, type, size});
        toreturn.set(toJSON.get, {file, basename, type, size});
    }
    return toreturn;
}

app.listen(PORT, async function() {
    await reloadFiles();
    await YAMLreloadFiles();
    fs.watch(path.join(__dirname, 'files'), { encoding: 'utf8' }, async () => {
        FilesInfo.clear();
        await reloadFiles();
        await YAMLreloadFiles();
    });
});