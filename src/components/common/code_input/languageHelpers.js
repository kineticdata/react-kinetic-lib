import Prism from 'prismjs';

export const processCode = string =>
  Prism.tokenize(string, Prism.languages.javascript).reduce(
    ([tokens, index], token) => [
      [
        ...tokens,
        typeof token === 'string'
          ? { content: token, index }
          : { type: token.type, content: token.content, index },
      ],
      index + token.length,
    ],
    [[], 0],
  )[0];

export const processTemplate = (string, index = 0) => {
  const openingIndex = string.indexOf('${');
  return openingIndex > -1
    ? [
        string.slice(0, openingIndex),
        ...processInterpolation(
          string.slice(openingIndex),
          index + openingIndex,
        ),
      ]
    : [string];
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
    processTemplate(string.slice(localIndex), index + localIndex),
  );
};
