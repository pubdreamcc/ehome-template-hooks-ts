module.exports = {
	env: {
		browser: true,
		es2021: true
	},
	extends: [
		'airbnb',
		'airbnb/hooks',
		'plugin:react/recommended',
		'plugin:@typescript-eslint/recommended',
		'prettier',
		'prettier/@typescript-eslint',
		'prettier/react',
		'prettier/unicorn'
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 12,
		sourceType: 'module'
	},
	plugins: ['react', '@typescript-eslint'],
	rules: {
		'import/extensions': [
			'error',
			'ignorePackages',
			{
				ts: 'never',
				tsx: 'never',
				json: 'never',
				js: 'never'
			}
		],
		'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
		'import/prefer-default-export': 'off',
		'import/no-unresolved': 'error',
		'@typescript-eslint/no-useless-constructor': 'error',
		'@typescript-eslint/no-empty-function': 'warn',
		'@typescript-eslint/no-var-requires': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',

		'react/jsx-filename-extension': [
			'error',
			{ extensions: ['.tsx', 'ts', '.jsx', 'js'] }
		],
		'react/jsx-indent-props': ['error'],
		'react/jsx-indent': ['error'],
		'react/jsx-one-expression-per-line': 'off',
		'react/destructuring-assignment': 'off',
		'react/state-in-constructor': 'off',
		'react/jsx-props-no-spreading': 'off',
		'react/prop-types': 'off',

		'jsx-a11y/click-events-have-key-events': 'off',
		'jsx-a11y/no-noninteractive-element-interactions': 'off',

		'lines-between-class-members': ['error', 'always'],
		'linebreak-style': ['error', 'unix'],
		quotes: ['error', 'single'],
		'no-unused-expressions': 'warn',
		'no-plusplus': 'off',
		'no-console': 'off',
		'class-methods-use-this': 'error',
		'jsx-quotes': ['error', 'prefer-single'],
		'global-require': 'off'
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.tsx', '.ts', '.js', '.json']
			}
		},
		typescript: {}
	}
};
