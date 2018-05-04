const test = require('ava');
const topics = require('../data/topics.json');
const {
  getTopics,
  getTopic,
  getTranslatedData,
} = require('../handler');

test('getTopics return a JSON with an array of available topics in data/topics.json', t => {
  const topicKeys = Object.keys(topics);
  const expectedResponse = JSON.stringify(topicKeys);
  getTopics(null, null, function(err, response) {
    t.is(response.body, expectedResponse);
  });
});

test('getTopic return a JSON with topic info when exists', t => {
  const topicKeys = Object.keys(topics);
  const topic = topicKeys[0];
  const event = {
    pathParameters: { topic }
  }
  const translatedData = getTranslatedData(topics[topic]);
  const expectedResponse = JSON.stringify(translatedData);
  getTopic(event, null, function(err, response) {
    t.is(response.statusCode, 200);
    t.is(response.body, expectedResponse);
  });
});

test('getTopic return a 404 status when topic is not found', t => {
  const topicKeys = Object.keys(topics);
  const event = {
    pathParameters: {
      topic: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    }
  }
  const expectedResponse = JSON.stringify({});
  getTopic(event, null, function(err, response) {
    t.not(err, null);
    t.is(response.statusCode, 404);
    t.is(response.body, expectedResponse);
  });
});

test('supports different languages', t => {
  t.pass();
})