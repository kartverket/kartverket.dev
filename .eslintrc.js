module.exports = {
  extends: [require.resolve('@backstage/cli/config/eslint')],
  rules: {
    '@backstage/no-forbidden-package-imports': 'error',
    'new-cap': 'off',
  },
};
