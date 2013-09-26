/**
 * Class that can be used in code.
 *
 * @package pivotal-deliver
 * @author Gustav Rydstedt <gustav.rydstedt@gmail.com>
 */
var async = require('async');
var request = require('request');
var exec = require('child_process').exec;
var util = require('util');
var _ = require('underscore');

var PivotalDeliver, noop;

module.exports = PivotalDeliver;

noop = function() {};

/**
 * PivotalDeliver Constucotr
 * @param {String} apiKey Pivotal API key
 */
function PivotalDeliver(token, projectId, opts) {

  this.token = token;
  this.projectId = projectId || 0;
  this.options = opts || {}
  this.logger = this.options.logger || console;

  if(!this.token) {
    throw new Error('No pivotal token given');
  }

  if(!this.projectId) {
    throw new Error('No pivotal project id given');
  }
};

/**
 * Checks the current directory's git log and
 * looks for commits with patterns [Fixes: #]
 * @return {[type]} [description]
 */
PivotalDeliver.prototype.checkAndDeliver = function(done) {
  var _this = this;
  done = done || noop;

  async.waterfall([

    /**
     * Grab stories from pivotal that are in "finished" state
     * @param  {Function} done Callback when dond
     */
    function grabFinishedStories(cb) {
      var url;
      url = util.format('https://www.pivotaltracker.com/services/v5/projects/%s/stories', _this.projectId);
      _this.logger.log('Getting finished stories from project %s.', _this.projectId)
      request(
        {
          url: url,
          method: 'get',
          headers: {
            'X-TrackerToken': _this.token,
            'Content-Type': 'application/json'
          },
          qs: {
            with_state: 'finished'
          }
        },
        function(err, req, body) {
          var stories = JSON.parse(body) || [];
          cb(err, _.map(stories, function(story) {return story.id}));
        }
      )
    },

    /**
     * Find if any of them are in the deployed commits
     * @param  {Function} done Callback when dond
     */
    function findDeployedCommits(finishedStories, cb) {
      finishedStories = finishedStories || [];

      _this.logger.log('Found %s finished.', finishedStories.length)

      var deliveredStories = [];

      // Loop through each of the finished stories
      async.forEach(finishedStories, function(storyId, cbLoop) {
        // Git log and grep for story id
        exec(util.format('git log | grep %s', storyId), function(err, stdout, stderr) {
          if(stdout.length) deliveredStories.push(storyId);
          cbLoop();
        });
      }, function(err) {
        cb(err, deliveredStories);
      });
    },

    /**
     * Deliver the deployed commits to Pivotal
     * @param  {Function} done Callback when dond
     */
    function deliverDeployedStories(deliveredStories, cb) {

      _this.logger.log('Found %s delivered.', deliveredStories.length);

      // Iterate each storyId and deliver it
      async.forEach(deliveredStories, function(storyId, cbLoop) {

        async.parallel([
          function(cbLoop2) {

            // Set state to to delivered!

            url = util.format('https://www.pivotaltracker.com/services/v5/projects/%s/stories/%s', _this.projectId, storyId);
          
            request(
              {
                url: url,
                method: 'put',
                headers: {
                  'X-TrackerToken': _this.token,
                  'Content-Type': 'application/json'
                },
                json: {
                  current_state: 'delivered'
                }
              },
              cbLoop2
            );

          },
          function(cbLoop2) {

            // Add note!

            url = util.format('https://www.pivotaltracker.com/services/v5//projects/%s/stories/%s/comments', _this.projectId, storyId);

    
            request(
              {
                url: url,
                method: 'post',
                headers: {
                  'X-TrackerToken': _this.token,
                  'Content-Type': 'application/json'
                },
                json: {
                  text: 'Commit deployed.'
                }
              },
              cbLoop2
            );

          }
        ], cbLoop);
        
    }, cb);

  }], done);
};
