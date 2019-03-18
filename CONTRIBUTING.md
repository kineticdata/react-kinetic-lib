## Prerequisites

[Node.js](http://nodejs.org/) >= 10 must be installed.

## Installation

- Running `yarn install` in the component's root directory will install everything you need for development.

## Styleguide / Development Server

- `yarn start` will run a development server with the component's styleguide app at [http://localhost:6060](http://localhost:6060) with hot module reloading.

## Running Tests

- `yarn test` will run the tests once.

- `yarn test:coverage` will run the tests and produce a coverage report in `coverage/`.

- `yarn test:watch` will run the tests on every change.

## Building

- `yarn build` will build the component for publishing to npm and also bundle the demo app.

# Code Style

The React component library project contains a Prettier config.
Developers should be using an extension/plugin that runs the Prettier tool before committing.

If you are using Visual Studio Code we encourage you to install the `Prettier - Code formatter` extension and enable `Editor: Format On Save` setting.

If you are developing other JavaScript projects and do not want Prettier to format them you should check the `Prettier: Require Config` setting so that VS Code only formats projects with Prettier enabled.