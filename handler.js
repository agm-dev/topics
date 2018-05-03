'use strict';

const topicsData = require('./data/topics.json');

module.exports.getTopics = (event, context, callback) => {
  const keys = Object.keys(topicsData);
  const response = {
    statusCode: 200,
    body: JSON.stringify(keys),
  };
  callback(null, response);
};

module.exports.getTopic = (event, context, callback) => {
  const topic = event.pathParameters.topic;
  const topicData = typeof topicsData[topic] !== 'undefined' ? topicsData[topic] : {};
  const err = typeof topicData.positive !== 'undefined' && typeof topicData.negative !== 'undefined' ? null : 404;
  const response = {
    statusCode: err !== null ? err : 200,
    body: JSON.stringify(topicData),
  };
  callback(err, response);
}
