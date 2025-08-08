/**
 * ESLint config.
 *
 * @description ESLint config for JavaScript and TypeScript projects.
 * @see https://eslint.org/docs
 * @see https://typescript-eslint.io/
 */
import { setConfig } from '@dovenv/theme-pigeonposse/eslint'

export default setConfig( {
	general   : 'js',
	yaml      : true,
	gitignore : true,
	jsdoc     : false,
	json      : true,
	package   : true,
	ignore    : [
		'./docs/**.md',
		'**/docs/data/**/*.md',
		'**/CHANGELOG.md',
		'**/examples/**/partials/*',
		'**/.dovenv/**/partials/*',
		'**/.dovenv/**/templates/*',
	],
} )

