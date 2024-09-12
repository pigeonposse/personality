import { Personality } from './personality.js'

export const personality = async( answers = undefined ) => {

	const p = new Personality( { answers } )
	await p.run()

}