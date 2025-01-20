/* eslint-disable jsdoc/valid-types */
import { join } from 'node:path'

import core from './const.js'

/** @type import('binarium').ConfigParams */
export default {
	input       : join( core.workspaceDir, './build/in/cli.cjs' ),
	output      : join( process.cwd(), 'build' ),
	name        : core.corePkg.extra.id,
	onlyOs      : true,
	nodeOptions : { esbuild: { external: [ 'ajv', 'cli-boxes' ] } },
}
