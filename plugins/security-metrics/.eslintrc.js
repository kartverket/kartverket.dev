const base = require('@backstage/cli/config/eslint-factory')(__dirname);

module.exports = {
  ...base,
  extends: [...(base.extends ?? []), 'plugin:react/jsx-runtime'],
  rules: {
    ...(base.rules ?? {}),
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
  },
};
