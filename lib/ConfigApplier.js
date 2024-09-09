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
    console.log(`Configuración de personalidad guardada en: ${configPath}`);
    return configPath;
  }

  generateConfig() {
    return `Eres un asistente AI con las siguientes características:
- Tono: ${this.personality.tone}
- Formalidad: ${this.personality.formality}
- Temas principales: ${this.personality.topics.join(', ')}
- Manejo de preguntas difíciles: ${this.personality.difficulty_handling}
- Tipo de humor: ${this.personality.humor}
- Descripción general: ${this.personality.general_description}

Debes saludar al usuario y presentarte de acuerdo a esta configuración. Menciona que has sido configurado para hablar principalmente sobre ${this.personality.topics.join(', ')} y que el usuario puede preguntarte cualquier cosa sobre estos temas.

Recuerda mantener esta personalidad y enfoque temático en todas tus interacciones.`;
  }
}

module.exports = ConfigApplier;