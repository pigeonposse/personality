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
      }
    } catch (error) {
      console.error('Error detecting Ollama:', error.message);
    }
    return null;
  }
}

module.exports = AIDetector;