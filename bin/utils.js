import inquirer from 'inquirer'
import {
	exec,
	execSync,
	spawnSync, 
} from 'node:child_process'
import {
	access,
	mkdir, 
	writeFile,
	chmod, 
}    from 'node:fs/promises'
import { tmpdir }           from 'node:os'
import {
	join as joinPath,
	resolve as resolvePath, 
} from 'node:path'

export {
	resolvePath,
	joinPath,
	writeFile,
	chmod, 
	exec,
	execSync,
	spawnSync, 
}

export const ask = inquirer.prompt
export const appID = 'personality' 

export const generateUniqueFileId = () => {

	const now        = new Date()
	const timestamp  = now.toISOString().replace( /[-:.TZ]/g, '' ) 
	const randomPart = Math.floor( Math.random() * 1000000 ).toString().padStart( 6, '0' ) 

	return `${timestamp}-${randomPart}`

}
export const sanitizeFileName = fileName => {

	return fileName
		.replace( /[/\\?%*:|"<>]/g, '_' ) 
		.replace( /\s+/g, '_' ) 
		.trim()

}

export const ensureDirectoryExists = async dirPath => {

	try {

		await access( dirPath )
	
	} catch ( error ) {

		if ( error.code === 'ENOENT' ) {

			await mkdir( dirPath, { recursive: true } )
			console.log( `Directory created: ${dirPath}` )
		
		} else {

			throw error
		
		}
	
	}

}
export const getAppTempDir = v => joinPath( tmpdir(), appID, v )

