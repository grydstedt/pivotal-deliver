#!/usr/bin/env node
/**
 * Delivers your finished Pivotal tasks
 *
 * @package pivotal-deliver
 * @author Gustav Rydstedt <gustav.rydstedt@gmail.com>
 */

var PivotalDeliver = require('./pivotal-deliver');

module.exports = PivotalDeliver;


if (require.main === module) {
  // This module got invoked directly
  
  var program = require('commander');

  program
    .version('0.0.1')
    .option('-t, --token', 'Pivotal token')
    .option('-i, --id', 'Pivotal project id')
    .parse(process.argv);
  
  var pivotalDeliver = new PivotalDeliver(program.token, program.id);

  pivotalDeliver.checkAndDeliver(function(err) {
    if(err) {
      console.error('Failed to check and deliver.');
      console.error(err);
      process.exit(1);
    } else {
      console.log('Done');
      process.exit(0);
    }
  })
};