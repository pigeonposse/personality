const inquirer = require('inquirer');

class Personality {
  constructor() {
    this.tone = null;
    this.formality = null;
    this.topics = [];
    this.difficulty_handling = null;
    this.humor = null;
    this.general_description = null;
  }

  async askQuestions() {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'tone',
        message: 'What overall tone would you prefer for the AI?',
        choices: ['Friendly', 'Formal', 'Humorous', 'Serious', 'Motivational', 'Reflective']
      },
      {
        type: 'list',
        name: 'formality',
        message: 'Choose the level of formality the AI should have:',
        choices: ['Informal', 'Semi-formal', 'Formal', 'Context-dependent']
      },
      {
        type: 'checkbox',
        name: 'topics',
        message: 'Select the main topics the AI should be knowledgeable in (you can choose more than one):',
        choices: [
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
          'Science'
        ]
      },
      {
        type: 'list',
        name: 'creativity',
        message: 'What level of creativity would you like in the AI’s responses?',
        choices: ['Highly creative', 'Balanced', 'Conservative', 'Literal']
      },
      {
        type: 'list',
        name: 'humor',
        message: 'What type of humor (if any) should the AI use?',
        choices: ['Sarcastic', 'Light', 'Clever', 'Dark', 'No humor']
      },
      {
        type: 'list',
        name: 'empathy',
        message: 'What level of empathy should the AI show in conversations?',
        choices: ['Highly empathetic', 'Moderate empathy', 'Objective', 'Cold']
      },
      {
        type: 'list',
        name: 'problem_solving',
        message: 'How should the AI approach complex problems or delicate questions?',
        choices: [
          'With tact and diplomacy',
          'With direct and clear answers',
          'Avoid diving too deep',
          'Analyze all aspects in detail'
        ]
      },
      {
        type: 'input',
        name: 'quirks',
        message: 'Would you like to add any quirks or distinctive behaviors to the AI? (e.g., speaking in metaphors, using pop culture references):'
      },
      {
        type: 'input',
        name: 'general_description',
        message: 'Describe your overall vision for the AI’s personality and areas of interest:'
      }
    ]);

    Object.assign(this, answers);
  }
}

module.exports = Personality;