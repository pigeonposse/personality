#!/usr/bin/env node

const { Personality, AIDetector, ConfigApplier } = require('../index');
const fs = require('node:fs').promises;
const path = require('node:path');
const inquirer = require('inquirer');
const {spawnSync} = require('node:child_process');   


async function main() {
  try {
    const detector = new AIDetector();
    const detectedAI = await detector.detectAI();
    
    if (detectedAI && detectedAI.models.length > 0) {
      console.log(`Ollama detected with the following models:`);
      detectedAI.models.forEach((model, index) => {
        console.log(`${index + 1}. ${model}`);
      });

      const { selectedModel } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedModel',
          message: 'Select the model you want to configure:',
          choices: detectedAI.models
        }
      ]);

      console.log(`You have selected the model: ${selectedModel}`);
      
      const personality = new Personality();
      await personality.askQuestions();
      
      const applier = new ConfigApplier(selectedModel, personality);
      const configPath = await applier.apply();
      
      console.log('\nPersonality configuration applied.');
      
      // Create a custom and interactive start script
      const startScript = `
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
      `.trim();
      
      const startScriptPath = path.join(process.cwd(), `start_${selectedModel.replace(':', '_')}_with_personality.sh`);
      await fs.writeFile(startScriptPath, startScript);
      await fs.chmod(startScriptPath, '755');
      
      console.log(`\nA custom start script has been created: ${startScriptPath}`);

      const { modeAuto } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'modeAuto',
          message: 'Do you want to run automatically?',
          default: false
        }
      ]);

      if (modeAuto) {
          spawnSync(`bash "${startScriptPath}"`, {
            shell : true,
            stdio : 'inherit',
          });
          if (result.error) {
            console.error(`Error running the script: ${result.error.message}`);
          }
      } else {
        console.log(`To start the AI with the personality configuration, run:`);
        console.log(`bash ${startScriptPath}`);
      }

      console.log(`\nTo exit the conversation, type 'exit' when prompted for your input.`);
    } else {
      console.log('No Ollama models detected. Please ensure Ollama is installed and that you have downloaded at least one model.');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
