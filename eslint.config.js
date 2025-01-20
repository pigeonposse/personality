/**
 * ESLint config.
 * @description ESLint config for JavaScript and TypeScript projects.
 * @see https://eslint.org/docs
 * @see https://typescript-eslint.io/
 */
import { lint } from '@dovenv/theme-pigeonposse'

const { dovenvEslintConfig } = lint

export default [
	dovenvEslintConfig.includeGitIgnore(),
	...dovenvEslintConfig.config,
	dovenvEslintConfig.setIgnoreConfig( [
		'./docs/**.md',
		'**/docs/data/**/*.md',
		'**/CHANGELOG.md',
		'**/examples/**/partials/*',
		'**/.dovenv/**/partials/*',
		'**/.dovenv/**/templates/*',
	] ),
	// @see https://github.com/markdownlint/markdownlint/blob/main/docs/RULES.md
]
