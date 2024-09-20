import { initCache } from './utils/cache.js'
import {
	blue,
	gray,
	green,
	italic,
	link, 
}   from './utils/color.js'
import {
	existsFlag,
	existsSpecificFlag,
	getFlagValue, 
} from './utils/flags.js'
import {
	execSync,
	generateUniqueFileId,
	getAppTempDir,
	userLang, 
	chmod,
	joinPath,
	writeFile, 
	spawnSync,
	appID,
	sanitizeFileName,
	ensureDirectoryExists,
} from './utils/main.js'
import {
	binName,
	description,
	homepage,
	productName, 
	version,
} from './utils/pkg.js'
import {
	text,
	select,
	group,
	intro,
	outro,
	cancel, 
	note,
	log,
	confirm,
} from './utils/process.js'

export class Personality {

	ID = {
		selectedModel      : 'selectedModel',
		tone               : 'tone',
		formality          : 'formality', 
		topics             : 'topics',
		creativity         : 'creativity',
		humor              : 'humor',
		empathy            : 'empathy',
		problemSolving     : 'problemSolving',
		responseLength     : 'responseLength',
		quirks             : 'quirks',
		generalDescription : 'generalDescription',
		modeAuto           : 'modeAuto',
	}

	constructor( { answers = {} } ) {

		this.texts   = {
			cancelMsg           : 'Hasta la vista. 👋',
			outroMsg            : 'Perfectly created AI model! ✨',
			errorUndefined      : 'Undefined error!!',
			errorCreatingConfig : 'Error creating configuration',
			errorNoModels       : `No models found in Ollama list.
Possible solutions:
1. Ensure Ollama is correctly installed.
2. Run 'ollama pull <model-name>' to download models.
3. Check your internet connection or repository access.`,
			autoRunConfirmation : 'To start the AI with the personality configuration, run:',
			helpInfo            : ( {
				binName, description,
			} ) => `
${description}

Usage: ${binName} [options]

Options:
	--help                          Show this help message
	--selectedModel=<model>         Select the AI model to configure
	--tone=<tone>                   Set the overall tone of the AI (e.g. Friendly, Formal, Humorous, etc.)
	--formality=<level>             Choose the formality level (Informal, Semi-formal, Formal, etc.)
	--topics=<topic1,topic2,...>    Select main topics (e.g. Technology, Sports, Finance, etc.)
	--creativity=<level>            Define the level of creativity (Highly creative, Balanced, etc.)
	--humor=<type>                  Specify the type of humor (Sarcastic, Light, Clever, etc.)
	--empathy=<level>               Set empathy level (Highly empathetic, Moderate empathy, Objective, etc.)
	--problemSolving=<style>        Define how the AI solves problems (With tact, With direct answers, etc.)
	--responseLength=<length>       Choose response length (Short, Medium, Long, Infinite)
	--quirks=<quirk>                Add quirks (e.g. speaking in metaphors, using pop culture references)
	--generalDescription=<desc>     Provide a general description for the AI's personality
	--modeAuto                      Automatically run the AI after configuration is done

Examples:
	${binName} --selectedModel=llama-2 --tone=Friendly --formality=Informal
`,
			configContent : ( personality, userLang ) => `You are an AI assistant with the following characteristics:
- Tone: ${personality.tone}
- Formality: ${personality.formality}
- Main topic: ${personality.topics}
- Handling difficult questions: ${personality.difficultyHandling}
- Type of humor: ${personality.humor}
- General description: ${personality.generalDescription}
- The user's language is ${userLang}, if you don't know this language, respond in English.
- The text cannot exceed this word limit: ${personality.responseLength}

You should greet the user and introduce yourself according to this configuration. Mention that you have been set up to primarily talk about ${personality.topics} and that the user can ask you anything about these topics.

Remember to maintain this personality and thematic focus in all your interactions.`,
		}
		const models = this.#getModels()
		this.props   = {
			[ this.ID.selectedModel ] : models,
			[ this.ID.tone ]          : [
				'Friendly',
				'Formal',
				'Humorous',
				'Serious',
				'Motivational',
				'Reflective',
			],
			[ this.ID.formality ] : [
				'Informal',
				'Semi-formal',
				'Formal',
				'Context-dependent',
			],
			[ this.ID.topics ] : [
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
			[ this.ID.creativity ] : [
				'Highly creative',
				'Balanced',
				'Conservative',
				'Literal',
			],
			[ this.ID.humor ] : [
				'Sarcastic',
				'Light',
				'Clever',
				'Dark',
				'No humor',
			],
			[ this.ID.empathy ] : [
				'Highly empathetic',
				'Moderate empathy',
				'Objective',
				'Cold',
			],
			[ this.ID.problemSolving ] : [
				'With tact and diplomacy',
				'With direct and clear answers',
				'Avoid diving too deep',
				'Analyze all aspects in detail',
			],
			[ this.ID.responseLength ] : [
				'Short (250 words)',
				'Medium (500 words)',
				'Long (1000 words)',
				'Infinite (+1000 words)',
			],
			[ this.ID.quirks ]             : 'speaking in metaphors, using pop culture references',
			[ this.ID.generalDescription ] : '',
			[ this.ID.modeAuto ]           : false,
		}
		
		this.questions = {
			[ this.ID.selectedModel ]      : 'Select the model you want to configure:',
			[ this.ID.tone ]               : 'What overall tone would you prefer for the AI?',
			[ this.ID.formality ]          : 'Choose the level of formality the AI should have:',
			[ this.ID.topics ]             : 'Select the main topics the AI should be knowledgeable in (you can choose more than one):',
			[ this.ID.creativity ]         : 'What level of creativity would you like in the AI\'s responses?',
			[ this.ID.humor ]              : 'What type of humor (if any) should the AI use?',
			[ this.ID.empathy ]            : 'What level of empathy should the AI show in conversations?',
			[ this.ID.problemSolving ]     : 'How should the AI approach complex problems or delicate questions?',
			[ this.ID.responseLength ]     : 'What response length would you prefer?',
			[ this.ID.quirks ]             : 'Would you like to add any quirks or distinctive behaviors to the AI? (e.g., speaking in metaphors, using pop culture references):',
			[ this.ID.generalDescription ] : 'Describe your overall vision for the AI\'s personality and areas of interest:',
			[ this.ID.modeAuto ]           : 'Do you want to run automatically?',
		}
		
		const getAnsw = ( answers, id ) => [ id ] in answers && this.props[ id ].includes( answers[ id ] ) ? answers[ id ] : undefined
		if( answers && typeof answers === 'object' )
			this.answers = {
				[ this.ID.selectedModel ]      : getAnsw( answers, this.ID.selectedModel ),
				[ this.ID.tone ]               : getAnsw( answers, this.ID.tone ),
				[ this.ID.formality ]          : getAnsw( answers, this.ID.formality ),
				[ this.ID.topics ]             : getAnsw( answers, this.ID.topics ),
				[ this.ID.creativity ]         : getAnsw( answers, this.ID.creativity ),
				[ this.ID.humor ]              : getAnsw( answers, this.ID.humor ),
				[ this.ID.empathy ]            : getAnsw( answers, this.ID.empathy ),
				[ this.ID.problemSolving ]     : getAnsw( answers, this.ID.problemSolving ),
				[ this.ID.responseLength ]     : getAnsw( answers, this.ID.responseLength ),
				[ this.ID.quirks ]             : [ this.ID.quirks ] in answers ? answers.quirks : undefined,
				[ this.ID.generalDescription ] : [ this.ID.generalDescription ] in answers ? answers.generalDescription : undefined,
				[ this.ID.modeAuto ]           : [ this.ID.modeAuto ] in answers ? true : undefined,
			}
		else 
			this.answers = {
				[ this.ID.selectedModel ]      : undefined,
				[ this.ID.tone ]               : undefined,
				[ this.ID.formality ]          : undefined,
				[ this.ID.topics ]             : undefined,
				[ this.ID.creativity ]         : undefined,
				[ this.ID.humor ]              : undefined,
				[ this.ID.empathy ]            : undefined,
				[ this.ID.problemSolving ]     : undefined,
				[ this.ID.responseLength ]     : undefined,
				[ this.ID.quirks ]             : undefined,
				[ this.ID.generalDescription ] : undefined, 
				[ this.ID.modeAuto ]           : undefined,
			}
		this.isHelp = existsFlag( 'help' )
		this.flags  = {
			[ this.ID.selectedModel ]      : existsSpecificFlag( this.ID.selectedModel, this.props.selectedModel ),
			[ this.ID.tone ]               : existsSpecificFlag( this.ID.tone, this.props.tone ),
			[ this.ID.formality ]          : existsSpecificFlag( this.ID.formality, this.props.formality ),
			[ this.ID.topics ]             : existsSpecificFlag( this.ID.topics, this.props.topics ),
			[ this.ID.creativity ]         : existsSpecificFlag( this.ID.creativity, this.props.creativity ),
			[ this.ID.humor ]              : existsSpecificFlag( this.ID.humor, this.props.humor ),
			[ this.ID.empathy ]            : existsSpecificFlag( this.ID.empathy, this.props.empathy ),
			[ this.ID.problemSolving ]     : existsSpecificFlag( this.ID.problemSolving, this.props.problemSolving ),
			[ this.ID.responseLength ]     : existsSpecificFlag( this.ID.responseLength, this.props.responseLength ),
			[ this.ID.quirks ]             : getFlagValue( this.ID.quirks ), 
			[ this.ID.generalDescription ] : getFlagValue( this.ID.generalDescription ), 
			[ this.ID.modeAuto ]           : existsFlag( this.ID.modeAuto ),
		}

		this.cache = initCache( {
			id     : 'questions',
			values : {
				[ this.ID.tone ]               : this.props.tone[ 0 ],
				[ this.ID.formality ]          : this.props.formality[ 0 ], 
				[ this.ID.topics ]             : this.props.topics[ 0 ], 
				[ this.ID.creativity ]         : this.props.creativity[ 0 ], 
				[ this.ID.humor ]              : this.props.humor[ 0 ], 
				[ this.ID.empathy ]            : this.props.empathy[ 0 ],
				[ this.ID.problemSolving ]     : this.props.problemSolving[ 0 ], 
				[ this.ID.responseLength ]     : this.props.responseLength[ 0 ],
				[ this.ID.quirks ]             : this.props.quirks, 
				[ this.ID.generalDescription ] : this.props.generalDescription, 
				[ this.ID.modeAuto ]           : this.props.modeAuto,
			},
		} )

		this.userLang    = userLang
		this.filesFolder = getAppTempDir( generateUniqueFileId() )

	}

	#getModels() {

		const output = execSync( 'ollama list', { encoding: 'utf-8' } )
		const lines  = output.split( '\n' ).filter( line => line.trim() )

		const models = lines.slice( 1 ).map( line => {

			const [ modelName ] = line.trim().split( /\s+/ )
			return modelName
		
		} )

		return models && models.length > 0 ? models : undefined
	
	}

	async #createConfigFiles(){

		const fileName            = sanitizeFileName( `${appID}_${this.answers.selectedModel.replace( ':', '_' )}.txt` )
		const configPath          = joinPath( this.filesFolder, fileName )
		const configContent       = this.texts.configContent( this.answers, this.userLang )
		const startScriptFilename = sanitizeFileName( `${appID}_start_${this.answers.selectedModel.replace( ':', '_' )}.sh` )
		const startScriptPath     = joinPath( this.filesFolder, startScriptFilename )
		
		const startScriptTemplate = ( configPath, selectedModel ) => `
#!/bin/bash
CONFIG_FILE="${configPath}"
if [ ! -f "$CONFIG_FILE" ]; then
echo "Error: Configuration file does not exist: $CONFIG_FILE"
  exit 1
fi
PERSONALITY_PROMPT=$(cat "$CONFIG_FILE")

# Start Ollama with the personality prompt
echo "$PERSONALITY_PROMPT" | ollama run ${selectedModel} -

# Loop to maintain conversation
while true; do
  echo -n "You: "
  read -r USER_INPUT
  if [ "$USER_INPUT" = "exit" ]; then
      echo "Thank you for using the customized AI. Goodbye!"
      break
  fi
  echo "$USER_INPUT" | ollama run ${selectedModel} -
done
    `.trim()
		const startScript         = startScriptTemplate( configPath, this.answers.selectedModel )
		try {

			await ensureDirectoryExists( this.filesFolder )
			await writeFile( configPath, configContent )
			await writeFile( startScriptPath, startScript )
			await chmod( startScriptPath, '755' )
		
		}catch( e ){

			throw Error( this.texts.errorCreatingConfig )
		
		}
		if ( this.answers.modeAuto ) {

			outro( this.texts.outroMsg )
			spawnSync( `bash "${startScriptPath}"`, {
				shell : true,
				stdio : 'inherit',
			} )
		
		}else {

			outro( this.texts.outroMsg )
			await note( `${this.texts.autoRunConfirmation}\nbash "${startScriptPath}"` )
		
		}
	
	}
	async run() {

		try {

			if( this.isHelp ) {

				console.log( this.texts.helpInfo( {
					binName,
					description,
				} ) )
				return
			
			}

			if ( !( this.props.selectedModel && this.props.selectedModel.length > 0 ) ) throw Error( this.texts.errorNoModels )
			
			const successRes = ( id, initValue ) => log.success( this.questions[ id ] + ':\n' + gray( initValue ) )
			const choiceFN   = ( id, cache = true ) => async () => {

				const initValue = this.flags[ id ] || this.answers[ id ]
				if( initValue !== undefined ) {

					successRes( id, initValue )
					return initValue
			
				}
	
				return await select( {
					message : this.questions[ id ], 
					options : this.props[ id ].map( model => ( {
						label : model,
						value : model, 
					} ) ),
					initialValue : cache ? this.cache.get( id ) : undefined,
				} ) 
	
			}
			
			await group( {
				intro : async () =>{
		
					console.log()
					await intro( '😊 ' + productName ) 
					await note( 
						`${description}.\n\nVersion:       ${green( italic( version ) )}\nDocumentation: ${blue( link( homepage ) )}`, 
					)
			
				},
				[ this.ID.selectedModel ]  : choiceFN( this.ID.selectedModel, false ),
				[ this.ID.tone ]           : choiceFN( this.ID.tone ),
				[ this.ID.formality ]      : choiceFN( this.ID.formality ),
				[ this.ID.topics ]         : choiceFN( this.ID.topics ),
				[ this.ID.creativity ]     : choiceFN( this.ID.creativity ),
				[ this.ID.humor ]          : choiceFN( this.ID.humor ),
				[ this.ID.empathy ]        : choiceFN( this.ID.empathy ),
				[ this.ID.problemSolving ] : choiceFN( this.ID.problemSolving ),
				[ this.ID.responseLength ] : choiceFN( this.ID.responseLength ),
				[ this.ID.quirks ]         : async () => {

					const initValue = this.flags[ this.ID.quirks ] || this.answers.quirks
					if( initValue !== undefined ) {

						successRes( this.ID.quirks, initValue )
						return initValue
				
					}
					return await text( {
						message      : this.questions.quirks, 
						initialValue : this.cache.get( this.ID.quirks ),
					} )
		
				},
				[ this.ID.generalDescription ] : async () => {

					const initValue = this.flags[ this.ID.generalDescription ] || this.answers.generalDescription
					if( initValue !== undefined ) {

						successRes( this.ID.generalDescription, initValue )
						return initValue
				
					}
					return await text( {
						message      : this.questions.generalDescription, 
						initialValue : this.cache.get( this.ID.generalDescription ),
					} )
		
				},
				[ this.ID.modeAuto ] : async () => {

					const initValue = this.flags[ this.ID.modeAuto ] || this.answers.modeAuto
					if( initValue !== undefined ) {

						successRes( this.ID.modeAuto, initValue )
						return initValue
				
					}
					return await confirm( {
						message      : this.questions.modeAuto, 
						initialValue : this.cache.get( this.ID.modeAuto ),
					} )
		
				},
				// result 
				process : async ( { results } ) =>{
					
					this.cache.set( results )
					this.answers = results

					await this.#createConfigFiles()
				
				},
			}, {
				onCancel : ( ) => {
		
					cancel( this.texts.cancelMsg )
					process.exit( 0 )
				
				},
			} )
		
		}catch( e ){

			log.error( e.message || this.errorUndefined )
		
		}
	
	}

}
