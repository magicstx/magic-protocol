module.exports = {
  ...require('@stacks/prettier-config'),
  overrides: [{
    files: './deployments/*.yaml',
    options: {
      singleQuote: false,
    },
  }],
};
