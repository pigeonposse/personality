
import {
	appID,
	ensureDirectoryExists,
	generateUniqueFileId,
	getAppTempDir,
	joinPath,
	sanitizeFileName,
	writeFile, 
} from './utils.js'

export class ConfigApplier {

	constructor( aiName, personality ) {

		this.aiName      = aiName
		this.personality = personality
		this.texts       = {
			configSaved   : 'Personality configuration saved at: ',
			configContent : `You are an AI assistant with the following characteristics:
  - Tone: ${this.personality.tone}
  - Formality: ${this.personality.formality}
  - Main topics: ${this.personality.topics.join( ', ' )}
  - Handling difficult questions: ${this.personality.difficulty_handling}
  - Type of humor: ${this.personality.humor}
  - General description: ${this.personality.general_description}
  
  You should greet the user and introduce yourself according to this configuration. Mention that you have been set up to primarily talk about ${this.personality.topics.join( ', ' )} and that the user can ask you anything about these topics.
  
  Remember to maintain this personality and thematic focus in all your interactions.`,
		}
		this.filesFolder = getAppTempDir( generateUniqueFileId() )
	
	}

	async apply() {

		const fileName      = sanitizeFileName( `${appID}_${this.aiName.replace( ':', '_' )}.txt` )
		const configPath    = joinPath( this.filesFolder, fileName )
		const configContent = this.texts.configContent

		await ensureDirectoryExists( this.filesFolder )
		await writeFile( configPath, configContent )
    
		console.log( `${this.texts.configSaved}${configPath}` )
		return configPath
	
	}

}
