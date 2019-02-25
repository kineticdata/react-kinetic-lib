const path = require('path');
const neutrino = require('neutrino');
const webpackConfig = neutrino().webpack();

// console.log(webpackConfig.module.rules[0])
module.exports = {
  title: 'React Kinetic - Component Library and Style Guide',
  webpackConfig: {
    ...webpackConfig,
    module: {
      ...webpackConfig.module,
      rules: [
        ...webpackConfig.module.rules,
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader']
        }
      ]
    }
  },
  components: 'src/**/[A-Z]*.js',
  skipComponentsWithoutExample: true,
  pagePerSection: true,
  require: [
    'babel-polyfill',
  ],
  moduleAliases: {
    'react-kinetic-lib': path.resolve(__dirname, 'src')
  },
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'tests/StyleguideWrapper')
  },
  usageMode: 'expand',
  exampleMode: 'expand',
  sections: [
    {
      name: 'Components',
      content: 'src/apis/APIs.md',
      sectionDepth: 1,
      sections: [
        { name: 'Common', components: 'src/components/common/**/*.js' },
        { name: 'Core', components: 'src/components/core/**/*.js' },
        { name: 'Discussions', components: 'src/components/discussions/**/*.js', }, 
      ]
    },
    {
      name: 'APIs',
      content: 'src/apis/APIs.md',
      sections: [
        { name: 'Disussions API', content: 'src/apis/DiscussionsAPI.md' },
      ],
      sectionDepth: 1
    }
  ],

  template: {
    head: {
      links: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Roboto',
        },
      ],
    },
  },
  theme: {
    fontFamily: {
      base: '"Roboto", sans-serif',
    },
  },
};
