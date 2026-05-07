import repoConfig from '@repo/config/eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [...repoConfig, { ignores: ['dist/**', 'storybook-static/**'] }];
