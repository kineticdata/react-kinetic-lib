const path = require('path');

module.exports = {
  title: 'React Kinetic Lib',
  skipComponentsWithoutExample: false,
  pagePerSection: true,
  styleguideDir: 'docs',
  require: [
    'babel-polyfill',
    path.join(__dirname, '/src/styleguide/assets/styles/master.scss'),
  ],
  moduleAliases: {
    'react-kinetic-lib': path.resolve(__dirname, 'src'),
    '@kineticdata/react': path.resolve(__dirname, 'src'),
    '@kineticdata/fixtures': path.resolve(
      __dirname,
      'src',
      'styleguide',
      'fixtures.js',
    ),
  },
  getComponentPathLine: componentPath => {
    const name = path.basename(componentPath, '.js');
    return `import { ${name} } from '@kineticdata/react';`;
  },
  styleguideComponents: {
    Wrapper: path.join(__dirname, 'src/styleguide/components/Wrapper'), // Wraps all Components with context
    StyleGuideRenderer: path.join(
      __dirname,
      'src/styleguide/components/StyleGuideRenderer',
    ),
    TableOfContentsRenderer: path.join(
      __dirname,
      'src/styleguide/components/TableOfContentsRenderer',
    ),
  },
  usageMode: 'expand',
  sections: [
    { name: 'Getting Started', content: 'README.md' },
    {
      name: 'Components',
      sectionDepth: 3,
      content: 'src/components/Components.md',
      components: [
        'src/components/common/authentication/*.js',
        'src/components/common/ContentEditable.js',
      ],
      sections: [
        {
          name: 'Core',
          components: ['src/components/core/!(form)/*.js'],
          sectionDepth: 2,
        },
        {
          name: 'Discussions',
          components: ['src/components/discussions/!(sagas|redux).js'],
          sectionDepth: 2,
        },
        {
          name: 'Forms',
          content: 'src/components/common/tables/Tables.md',
          components: [
            'src/components/core/form/Form.js',
            'src/components/core/form/!(Form|SampleTeamsRolesFIeld|DefaultFieldConfig).js',
          ],
          sectionDepth: 2,
        },
        {
          name: 'Tables',
          content: 'src/components/common/tables/Tables.md',
          components: [
            'src/components/common/tables/*.js',
            'src/components/common/tables/defaults/*.js',
          ],
          ignore: ['src/components/common/tables/Table.redux.js'],
          sectionDepth: 2,
        },
      ],
    },
    {
      name: 'APIs',
      content: 'src/apis/APIs.md',
      sections: [
        {
          name: 'Disussions API',
          content: 'src/apis/discussions/DiscussionsAPI.md',
        },
        {
          name: 'Core API',
          content: 'src/apis/core/CoreAPI.md',
        },
      ],
      sectionDepth: 2,
    },
    {
      name: 'Helpers',
      content: 'src/helpers/helpers.md',
    },
  ],
  template: {
    head: {
      links: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css?family=Roboto',
        },
        {
          rel: 'stylesheet',
          href:
            'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
        },
      ],
    },
  },
  styles: {
    SectionHeading: {
      wrapper: {
        lineHeight: 'normal',
      },
    },
  },
};
