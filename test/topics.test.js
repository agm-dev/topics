const test = require('ava');
const topics = require('../data/topics.json');
const {
  getTopics,
  getTopic,
  getTranslatedData,
  getTopicPositive,
  getTopicNegative,
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

test('getTopicPositive returns a JSON with positive reasons array about topic, when exists', t => {
  const topicKeys = Object.keys(topics);
  const topic = topicKeys[0];
  const event = { pathParameters: { topic } };
  const data = topics[topic].positive;
  const translatedData = getTranslatedData(data);
  const expectedResponse = JSON.stringify(translatedData);
  getTopicPositive(event, null, function(err, response) {
    t.is(response.statusCode, 200);
    t.is(response.body, expectedResponse);
  });
});

test('getTopicNegative returns a JSON with negative reasons array about topic, when exists', t => {
  const topicKeys = Object.keys(topics);
  const topic = topicKeys[0];
  const event = { pathParameters: { topic } };
  const data = topics[topic].negative;
  const translatedData = getTranslatedData(data);
  const expectedResponse = JSON.stringify(translatedData);
  getTopicNegative(event, null, function(err, response) {
    t.is(response.statusCode, 200);
    t.is(response.body, expectedResponse);
  });
});

test('supports different languages', t => {
  const topicKeys = Object.keys(topics);
  const topic = topicKeys[0];
  const langString = 'es-ES,es;q=0.9'; // spanish string example
  const event = {
    headers: {
      "Accept-Language": langString
    },
    pathParameters: { topic }
  };
  const data = topics[topic].positive;

  const translatedData = getTranslatedData(data, 'es');
  const expectedResponse = JSON.stringify(translatedData);
  getTopicPositive(event, null, function(err, response) {
    t.is(response.statusCode, 200);
    t.is(response.body, expectedResponse);
  });
})