/* eslint-disable camelcase */

import { initCache } from './utils/cache.js'
import { ask }       from './utils/main.js'

export class Personality {

	constructor() {

		this.tone               = null
		this.formality          = null
		this.topics             = []
		this.difficultyHandling = null
		this.humor              = null
		this.generalDescription = null
		this.props              = {
			tone : [
				'Friendly',
				'Formal',
				'Humorous',
				'Serious',
				'Motivational',
				'Reflective',
			],
			formality : [
				'Informal',
				'Semi-formal',
				'Formal',
				'Context-dependent',
			],
			topics : [
				'Technology',
				'Sports',
				'Finance',
				'Art',
				'Science Fiction',
				'Philosophy',
				'Pop Culture',
				'Psychology',
				'History',
				'Human Relationships',
				'Literature',
				'Science',
			],
			creativity : [
				'Highly creative',
				'Balanced',
				'Conservative',
				'Literal',
			],
			humor : [
				'Sarcastic',
				'Light',
				'Clever',
				'Dark',
				'No humor',
			],
			empathy : [
				'Highly empathetic',
				'Moderate empathy',
				'Objective',
				'Cold',
			],
			problemSolving : [
				'With tact and diplomacy',
				'With direct and clear answers',
				'Avoid diving too deep',
				'Analyze all aspects in detail',
			],
			responseLength : [
				'Short (250 words)',
				'Medium (500 words)',
				'Long (1000 words)',
				'Infinite (+1000 words)',
			],
			quirks             : 'speaking in metaphors, using pop culture references',
			generalDescription : '',
		}
		this.cache              = initCache( {
			id     : 'workflow',
			values : {
				tone               : this.props.tone[ 0 ],
				formality          : this.props.formality[ 0 ], 
				topics             : this.props.topics[ 0 ], 
				creativity         : this.props.creativity[ 0 ], // 'Highly creative'
				humor              : this.props.humor[ 0 ], // 'Sarcastic'
				empathy            : this.props.empathy[ 0 ], // 'Highly empathetic'
				problemSolving     : this.props.problemSolving[ 0 ], // 'With tact and diplomacy'
				responseLength     : this.props.responseLength[ 0 ], // 'Short (250 words)'
				quirks             : this.props.quirks, // 'speaking in metaphors, using pop culture references'
				generalDescription : this.props.generalDescription, // ''
			},
		} )

		this.questions = [
			{
				type    : 'list',
				name    : 'tone',
				message : 'What overall tone would you prefer for the AI?',
				choices : this.props.tone,
				default : this.cache.get( 'tone' ),
			},
			{
				type    : 'list',
				name    : 'formality',
				message : 'Choose the level of formality the AI should have:',
				choices : this.props.formality,
				default : this.cache.get( 'formality' ),
			},
			{
				type    : 'list',
				name    : 'topics',
				message : 'Select the main topics the AI should be knowledgeable in (you can choose more than one):',
				choices : this.props.topics,
				default : this.cache.get( 'topics' ),
			},
			{
				type    : 'list',
				name    : 'creativity',
				message : 'What level of creativity would you like in the AI\'s responses?',
				choices : this.props.creativity,
				default : this.cache.get( 'creativity' ),
			},
			{
				type    : 'list',
				name    : 'humor',
				message : 'What type of humor (if any) should the AI use?',
				choices : this.props.humor,
				default : this.cache.get( 'humor' ),
			},
			{
				type    : 'list',
				name    : 'empathy',
				message : 'What level of empathy should the AI show in conversations?',
				choices : this.props.empathy,
				default : this.cache.get( 'empathy' ),
			},
			{
				type    : 'list',
				name    : 'problemSolving',
				message : 'How should the AI approach complex problems or delicate questions?',
				choices : this.props.problemSolving,
				default : this.cache.get( 'problemSolving' ),
			},
			{
				type    : 'list',
				name    : 'responseLength',
				message : 'What response length would you prefer?',
				choices : this.props.responseLength,
				default : this.cache.get( 'responseLength' ),
			},
			{
				type    : 'input',
				name    : 'quirks',
				message : 'Would you like to add any quirks or distinctive behaviors to the AI? (e.g., speaking in metaphors, using pop culture references):',
				default : this.cache.get( 'quirks' ),
			},
			{
				type    : 'input',
				name    : 'generalDescription',
				message : 'Describe your overall vision for the AI\'s personality and areas of interest:',
				default : this.cache.get( 'generalDescription' ),
			},
		]
	
	}

	async askQuestions() {

		const answers = await ask( this.questions )
		this.cache.set( answers )
		Object.assign( this, answers )
	
	}

}
