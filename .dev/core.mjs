import { createRequire } from 'module'
import {
	dirname,
	join as joinPath, 
} from 'path'
import { fileURLToPath } from 'url'

export { joinPath }

export const workspacePath = joinPath( dirname( fileURLToPath( import.meta.url ) ), '..' )
export const pkgPath = joinPath( workspacePath, 'package.json' )
export const cliSrcPath = joinPath( workspacePath, 'src', 'cli.js' )
export const distPathOnly = joinPath( 'build', 'in' )
export const cliDistDir = joinPath( workspacePath, distPathOnly )
export const cliDistPath = joinPath( workspacePath, distPathOnly, 'cli.cjs' )

const require = createRequire( import.meta.url )
export const getPkg = async () => require( pkgPath )
