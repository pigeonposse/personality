// @ts-nocheck
import Conf from 'conf'

import { appID } from './main.js'

export const initCache = ( {
	id, values, cached = true, 
} ) => {

	const name = appID

	const config = new Conf( { projectName: name + '-dev' } )

	return {
		values,
		get : v => {

			const c = config.get( id ) || {}
			if ( !v ) return c
			if ( cached && c && typeof c === 'object' && v in c ) return c[ v ]
			if ( typeof values === 'object' && v in values ) return values[ v ]
			throw new Error( `Cache value is unexpected: ${v}` )
		
		},
		set : obj => {

			const currentConfig = config.get( id ) || {}
			const updatedConfig = {
				...currentConfig,
				...obj, 
			}
			config.set( id, updatedConfig )
		
		},
	}

}
