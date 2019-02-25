// jest.config.js
const neutrino = require('neutrino');

process.env.NODE_ENV = process.env.NODE_ENV || 'test';

const jestConfig = neutrino().jest();

module.exports = {
    ...jestConfig,
    testRegex: 'src/.*(_test|_spec|\\.test|\\.spec)\\.(js|jsx|vue|ts|tsx|mjs)$',
    setupFiles: ['./tests/setupTests.js'],
    snapshotSerializers: ['enzyme-to-json/serializer'],
};

