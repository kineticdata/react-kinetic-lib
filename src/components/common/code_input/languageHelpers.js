import Prism from 'prismjs';

const getTokenContent = token =>
  typeof token === 'string'
    ? token
    : token instanceof Array
    ? token.map(getTokenContent).join()
    : getTokenContent(token.content);

const getTokenLength = token => token.length;
const getTokenType = token => token.type;

export const processCode = language => string =>
  Prism.tokenize(string, language).reduce(
    ([tokens, index], token) => [
      [
        ...tokens,
        {
          index,
          content: getTokenContent(token),
          type: getTokenType(token),
        },
      ],
      index + getTokenLength(token),
    ],
    [[], 0],
  )[0];

export const processJavaScript = processCode(Prism.languages.javascript);
export const processRuby = processCode(Prism.languages.ruby);

const processEmbeddedRuby = (string, index) => {
  const result = [
    {
      type: 'opening-tag',
      content: string.startsWith('<%=') ? '<%=' : '<%',
      index,
    },
  ];
  let localIndex = result[0].content.length;
  let foundPercent = false;
  let done = false;
  Prism.tokenize(string.slice(localIndex), Prism.languages.ruby).forEach(
    token => {
      if (!done) {
        // Handle the check for closing tag. If the previous character was a %
        // operator check to see if the current character is a > operator. If so
        // add the closing tag and we are done. Otherwise add the % operator to
        // the result.
        if (foundPercent) {
          if (token.type === 'operator' && token.content === '>') {
            result.push({
              content: '%>',
              index: index + localIndex,
              type: 'closing-tag',
            });
            localIndex += 2;
            done = true;
          } else {
            result.push({
              content: '%',
              index: index + localIndex,
              type: 'operator',
            });
            foundPercent = false;
            localIndex++;
          }
        }
        // Handle the current token.
        if (!done) {
          // If it is a % operator this may be the closing tag so we don't add
          // it yet, set a boolean and continue.
          if (token.type === 'operator' && token.content === '%') {
            foundPercent = true;
            // It may also be a string token with the %>foo> delimiter syntax, in
            // this case we actually want to treat that as our closing tag.
          } else if (
            token.type === 'string' &&
            getTokenContent(token).startsWith('%>')
          ) {
            result.push({
              content: '%>',
              index: index + localIndex,
              type: 'closing-tag',
            });
            localIndex += 2;
            done = true;
            // Otherwise just add the token
          } else {
            result.push({
              content: getTokenContent(token),
              index: index + localIndex,
              type: getTokenType(token),
            });
            localIndex += getTokenLength(token);
          }
        }
      }
    },
  );
  return result.concat(
    processErbTemplate(string.slice(localIndex), index + localIndex),
  );
};

const processInterpolation = (string, index) => {
  const result = [
    {
      type: 'opening-interpolation',
      content: '${',
      index,
    },
  ];
  let localIndex = 2;
  let curlyDepth = 0;
  Prism.tokenize(string.slice(localIndex), Prism.languages.javascript).some(
    token => {
      if (typeof token === 'string') {
        result.push({
          content: token,
          index: index + localIndex,
        });
      } else {
        if (token.type === 'punctuation' && token.content === '}') {
          if (curlyDepth > 0) {
            curlyDepth--;
            result.push({
              type: token.type,
              content: token.content,
              index: index + localIndex,
            });
          } else {
            result.push({
              type: 'closing-interpolation',
              content: '}',
              index: index + localIndex,
            });
            // Because we used `some` instead of `forEach` returning true here
            // is like breaking the loop. Also make sure we increment the local
            // index here because returning will prevent us from reaching the
            // increment at the end.
            localIndex += token.length;
            return true;
          }
        } else {
          if (token.type === 'punctuation' && token.content === '{') {
            curlyDepth++;
          }
          result.push({
            type: token.type,
            content: token.content,
            index: index + localIndex,
          });
        }
      }
      localIndex += token.length;
      return false;
    },
  );
  return result.concat(
    processJavaScriptTemplate(string.slice(localIndex), index + localIndex),
  );
};

export const processTemplate = (openingString, processor) => (
  string,
  index = 0,
) => {
  const openingIndex = string.indexOf(openingString);
  return openingIndex > -1
    ? [
        string.slice(0, openingIndex),
        ...processor(string.slice(openingIndex), index + openingIndex),
      ]
    : [string];
};

export const processErbTemplate = processTemplate('<%', processEmbeddedRuby);
export const processJavaScriptTemplate = processTemplate(
  '${',
  processInterpolation,
);
