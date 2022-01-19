# fileshare

Download the code and install all packages using `npm i` / `npm install` and run the code using `npm start` / `node .`

# Add files
At folder files add an .json or .yaml, the examples are:

### JSON
```json
{
    "file": "relativePathToFile.any",
    "get": "pathto-file-in-the-link"
}
```
### YAML
```yaml
file: relativePathToFile.any
get: pathto-file-in-the-link
```

this is going to look:
```
examples
files:
    - relativePathToFile.yaml # I prefer add the same name of the liked file + .yaml
    - relativePathToFile.any
index.js
...
...
```

for acess to the file:
`http://ip.of.the.server/d/pathto-file-in-the-link`
if the por not is 80
`http://ip.of.the.server:port/d/pathto-file-in-the-link`