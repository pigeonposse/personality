const { execSync } = require('child_process');

class AIDetector {
  async detectAI() {
    try {
      const output = execSync('ollama list', { encoding: 'utf-8' });
      const models = output.split('\n').filter(line => line.trim()).map(line => line.split(' ')[0]);
      if (models.length > 0) {
        return {
          name: 'ollama',
          models: models
        };
      }else {
        throw new Error(`No models found in Ollama list.
          Possible solutions:
          1. Ensure Ollama is correctly installed.
          2. Run 'ollama pull <model-name>' to download models.
          3. Check your internet connection or repository access.`);
      }
    } catch (error) {
      console.error('Error detecting Ollama:', error.message);
    }
    return null;
  }
}

module.exports = AIDetector;