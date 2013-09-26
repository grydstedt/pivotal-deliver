## pivotal-deliver
#### Delivers your finished Pivotal tasks

### Installation
```bash
npm install pivotal-deliver
```

### Basic Use
```javascript
var PivotalDeliver    = require('pivotal-deliver');

var deliver = new PivotalDeliver(API_TOKEN, PROJECT_ID);
deliver.checkAndDeliver(function(err) {
  console.log('Done!');
});
```

Can also be run from the command line: 

```bash
  Usage: index.js [options]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -t, --token    Pivotal token
    -i, --id       Pivotal project id
```


### Testing
```bash
npm test
```