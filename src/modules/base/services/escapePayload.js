const secret = require('./secret');

function escapeHtmlTags(str) {
  const regex = /<([a-zA-Z]+)(?:\s[^>]*)?>|<\/([a-zA-Z]+)>/g;
  const replacements = {
    '<': '&lt;',
    '>': '&gt;'
  };
  return str.replace(regex, (match) => {
    return match.replace(/[<>&"']/g, (char) => replacements[char] || char);
  });
}

module.exports = function escapePayload(obj) {
  for (let prop in obj) {
    if (typeof obj[prop] === 'string') {
      // Check if we found the secret string at the end of value
      if (obj[prop].endsWith(secret)) {
        // Remove the secret keyword from the value
        obj[prop] = obj[prop].replace(secret, '');
      } else {
        obj[prop] = escapeHtmlTags(obj[prop]);
      }
    } else if (typeof obj[prop] === 'object' && obj[prop] !== null) {
      escapePayload(obj[prop]);
    } else if (Array.isArray(obj[prop])) {
      obj[prop].forEach((item) => {
        escapePayload(item);
      });
    }
  }
};
