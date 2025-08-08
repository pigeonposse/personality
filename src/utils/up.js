import { Updater } from '@clippium/updater'

import {
	blue,
	bold,
	gray,
	green,
	italic,
} from './color.js'
import {
	name,
	version,
} from './pkg.js'

const _updater = new Updater( {
	version,
	name,
} )

export const updater = { notify : async () => {

	const data = await _updater.get()
	if ( !data ) return

	console.log( `📦 ${bold( 'Update available' )} ${gray( data.currentVersion )} → ${green( data.latestVersion )} ${italic( `(${data.type})` )}

Run ${blue( data.packageManager + ' i ' + name )} to update
		` )

} }
