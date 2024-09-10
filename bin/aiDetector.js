import { execSync } from './utils.js'

export class AIDetector {

	texts = {
		errorNoModels : `No models found in Ollama list.
    Possible solutions:
    1. Ensure Ollama is correctly installed.
    2. Run 'ollama pull <model-name>' to download models.
    3. Check your internet connection or repository access.`,
	}
	async #getModelNames(){

		const output = execSync( 'ollama list', { encoding: 'utf-8' } )
		const lines  = output.split( '\n' ).filter( line => line.trim() )
      
		const modelLines = lines.slice( 1 ) 
		const models     = modelLines.map( line => {

			const parts = line.split( /\s+/ ) // Split by whitespace
			return parts[ 0 ] // The model name is the first part
    
		} )

		return models

	}
	async detectAI() {

		try {

			const models = await this.#getModelNames()

			if ( models.length > 0 ) {

				return {
					name   : 'ollama',
					models : models,
				}
			
			}else {

				throw new Error( this.texts.errorNoModels )
			
			}
		
		} catch ( error ) {

			console.error( 'Error detecting Ollama:', error.message )
		
		}
		return null
	
	}

}
