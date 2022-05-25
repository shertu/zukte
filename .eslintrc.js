module.exports = {
  extends: ['./node_modules/gts/'],
  rules: {
    'node/no-unpublished-import': 'off',
    'node/no-unpublished-require': 'off',
    'require-jsdoc': [
      'warn',
      {
        require: {
          ArrowFunctionExpression: true,
          ClassDeclaration: true,
          FunctionDeclaration: true,
          FunctionExpression: true,
          MethodDefinition: true,
        },
      },
    ],
    'sort-keys': 'error',
  },
};
