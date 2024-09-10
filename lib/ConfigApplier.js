const fs = require('fs').promises;
const path = require('path');

class ConfigApplier {
  constructor(aiName, personality) {
    this.aiName = aiName;
    this.personality = personality;
  }

  async apply() {
    const configPath = path.join(process.cwd(), `${this.aiName.replace(':', '_')}_personality.txt`);
    const configContent = this.generateConfig();
    await fs.writeFile(configPath, configContent);
    console.log(`Personality configuration saved at: ${configPath}`);
    return configPath;
  }

  generateConfig() {
    return `You are an AI assistant with the following characteristics:
- Tone: ${this.personality.tone}
- Formality: ${this.personality.formality}
- Main topics: ${this.personality.topics.join(', ')}
- Handling difficult questions: ${this.personality.difficulty_handling}
- Type of humor: ${this.personality.humor}
- General description: ${this.personality.general_description}

You should greet the user and introduce yourself according to this configuration. Mention that you have been set up to primarily talk about ${this.personality.topics.join(', ')} and that the user can ask you anything about these topics.

Remember to maintain this personality and thematic focus in all your interactions.`;
  }
}

module.exports = ConfigApplier;
