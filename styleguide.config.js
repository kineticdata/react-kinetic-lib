const path = require('path');

module.exports = {
  title: 'React Kinetic - Component Library and Style Guide',
  components: 'src/**/[A-Z]*.js',
  skipComponentsWithoutExample: true,
  pagePerSection: true,
  require: [
    'babel-polyfill',
  ],
  moduleAliases: {
    'react-kinetic-lib': path.resolve(__dirname, 'src'),
    '@kineticdata/react': path.resolve(__dirname, 'src'),
    '@kineticdata/fixtures': path.resolve(__dirname, 'src', 'styleguide', 'fixtures.js')
  },
  getComponentPathLine: (componentPath) => {
    const name = path.basename(componentPath, '.js')
    return `import { ${name} } from '@kineticdata/react';`
  },
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'src/styleguide/StyleguideWrapper')
  },
  usageMode: 'expand',
  exampleMode: 'expand',
  sections: [
    {
      name: 'Components',
      content: 'src/apis/APIs.md',
      sectionDepth: 1,
      sections: [
        { 
          name: 'Common', 
          components: 'src/components/common/**/*.js', 
          ignore: ['src/components/common/tables/**'],
          sectionDepth: 1,
          sections: [
            { 
              name: 'Tables',
              content: 'src/components/common/tables/Tables.md',
              components: 'src/components/common/tables/*.js',
              ignore: ['src/components/common/tables/Table.redux.js'],
              sections: [
                { 
                  name: 'Components',
                  content: 'src/components/common/tables/defaults/Components.md',
                  components: 'src/components/common/tables/defaults/*.js'
                }
              ]
            }
          ] 
        },
        { name: 'Core', components: 'src/components/core/**/*.js' },
        { name: 'Discussions', components: 'src/components/discussions/**/*.js', },
      ]
    },
    {
      name: 'APIs',
      content: 'src/apis/APIs.md',
      sections: [
        { name: 'Disussions API', content: 'src/apis/discussions/DiscussionsAPI.md' },
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
