## pivotal-deliver
#### Delivers your finished Pivotal tasks

Meant to be run in some sort of deployment service.

* Pulls your Pivotal stories marked "Finished"
* Checks your git log for those story ids
* Sets the commited stories to "Delivered" and adds a note to the story.

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

Can also be run from the command line (install -g if you want it globally): 

```bash
  Usage: pivotal-tracker [options]

  Options:

    -h, --help     output usage information
    -V, --version  output the version number
    -t, --token    Pivotal token
    -i, --id       Pivotal project id
```

If you don't feel like passing in token and project id every time you can set the *PIVOTAL_TOKEN* and *PIVOTAL_PROJECT_ID*
environment variables before running the command.


### Testing
```bash
npm test
```