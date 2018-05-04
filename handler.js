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
  const langCode = getLangCode(event);
  const translatedTopicData = err !== null ? topicData : getTranslatedData(topicData, langCode);
  const response = {
    statusCode: err !== null ? err : 200,
    body: JSON.stringify(translatedTopicData),
  };
  callback(err, response);
};

module.exports.getTopicPositive = (event, context, callback) => {
  const topic = event.pathParameters.topic;
  const data = getSpecificDataFromTopic(topic, true);
};

module.exports.getTopicNegative = (event, context, callback) => {
  const topic = event.pathParameters.topic;
  const data = getSpecificDataFromTopic(topic, false);

}

// privated functions:

const getSpecificDataFromTopic = (topic = null, positive = true) => {
  if (topic === null) return null;

};

const getLangCode = (event) => {
  // event.headers.Accept-Language format example: es-ES,es;q=0.9
  const supportedLangs = {
    'es-ES': 'es',
    'es': 'es',
    'en-EN': 'en',
    'en': 'en',
  };
  if (typeof event.headers !== 'undefined' && typeof event.headers['Accept-Language'] === 'string') {
    let langCode;
    let langSections = event.headers['Accept-Language'].split(',');
    if (langSections.length) {
      langCode = langSections[0];
      if (typeof supportedLangs[langCode] === 'string') return supportedLangs[langCode];
    }
    langSections = event.headers['Accept-Language'].split(';');
    if (langSections.length) {
      langSections = langSections[0].split(',');
      if (langSections.length > 1) {
        langCode = langSections[1];
        if (typeof supportedLangs[langCode] === 'string') return supportedLangs[langCode];
      }
    }
  }
  return 'en'; // default lang
};

const getTranslatedData = (data = null, lang = 'en') => {
  // check if is topic object, or positive/negative array
  if (Array.isArray(data)) { // is an array, positive/negative data about a topic
    return getTranslatedReasons(data);
  } else if (typeof data.positive !== 'undefined' && typeof data.negative !== 'undefined') { // its topic whole object data
    const positive = getTranslatedReasons(data.positive, lang);
    const negative = getTranslatedReasons(data.negative, lang);
    return { positive, negative };
  }
  return null;
};

module.exports.getTranslatedData = getTranslatedData; // export for testing

const getTranslatedReasons = (data, lang) => data.reduce((total, current, index) => {
  if (typeof current[lang] === 'string') return [...total, current[lang]];
  return total;
}, []);