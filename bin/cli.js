#!/usr/bin/env node

import { AIDetector }    from './aiDetector.js'
import { ConfigApplier } from './configApplier.js'
import { Personality }   from './personality.js'
import {
	ask,
	chmod,
	joinPath,
	writeFile, 
	spawnSync,
	appID,
	sanitizeFileName,
} from './utils.js'

class AIConfigurator {

	texts = {
		detectedModelsHeader       : 'Ollama detected with the following models:',
		selectModelPrompt          : 'Select the model you want to configure:',
		modelSelectionConfirmation : 'You have selected the model:',
		personalityConfigApplied   : '\nPersonality configuration applied.',
		startScriptCreated         : '\nA custom start script has been created:',
		autoRunPrompt              : 'Do you want to run automatically?',
		autoRunConfirmation        : 'To start the AI with the personality configuration, run:',
		exitMessage                : '\nTo exit the conversation, type \'exit\' when prompted for your input.',
		noModelsDetected           : 'No Ollama models detected. Please ensure Ollama is installed and that you have downloaded at least one model.',
		errorMessage               : 'Error:',
		startScriptTemplate        : ( configPath, selectedModel ) => `
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
    `.trim(),
	}

	detector = new AIDetector()

	async run() {

		try {

			const detectedAI = await this.detector.detectAI()

			if ( detectedAI && detectedAI.models.length > 0 ) {

				console.log( this.texts.detectedModelsHeader )
				detectedAI.models.forEach( ( model, index ) => {

					console.log( `${index + 1}. ${model}` )
				
				} )

				const { selectedModel } = await ask( [ {
					type    : 'list',
					name    : 'selectedModel',
					message : this.texts.selectModelPrompt,
					choices : detectedAI.models,
				} ] )

				console.log( `${this.texts.modelSelectionConfirmation} ${selectedModel}` )

				const personality = new Personality()
				await personality.askQuestions()

				const applier    = new ConfigApplier( selectedModel, personality )
				const configPath = await applier.apply()

				console.log( this.texts.personalityConfigApplied )

				// Create and save the start script
				const startScript         = this.texts.startScriptTemplate( configPath, selectedModel )
				const startScriptFilename = sanitizeFileName( `${appID}_start_${selectedModel.replace( ':', '_' )}.sh` )
				const startScriptPath     = joinPath( applier.filesFolder, startScriptFilename )
				await writeFile( startScriptPath, startScript )
				await chmod( startScriptPath, '755' )

				console.log( `${this.texts.startScriptCreated} ${startScriptPath}` )

				const { modeAuto } = await ask( [ {
					type    : 'confirm',
					name    : 'modeAuto',
					message : this.texts.autoRunPrompt,
					default : false,
				} ] )

				if ( modeAuto ) {

					spawnSync( `bash "${startScriptPath}"`, {
						shell : true,
						stdio : 'inherit',
					} )
				
				} else {

					console.log( this.texts.autoRunConfirmation )
					console.log( `bash ${startScriptPath}` )
				
				}

				console.log( this.texts.exitMessage )

			} else {

				console.log( this.texts.noModelsDetected )
			
			}

		} catch ( error ) {

			console.error( this.texts.errorMessage, error.message )
		
		}
	
	}

}

const configurator = new AIConfigurator()
configurator.run()
