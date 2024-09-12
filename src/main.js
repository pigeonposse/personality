import { Personality } from './personality.js'

/**
 * Initializes and runs the Personality configuration process.
 *
 * @param   {object}        [answers]                    - Optional object containing the initial answers for personality configuration.
 * @param   {string}        [answers.selectedModel]      - The selected AI model to configure.
 * @param   {string}        [answers.tone]               - The overall tone for the AI (e.g., Friendly, Formal, Humorous).
 * @param   {string}        [answers.formality]          - The formality level (e.g., Informal, Semi-formal, Formal).
 * @param   {string[]}      [answers.topics]             - Array of main topics for the AI to focus on (e.g., Technology, Sports).
 * @param   {string}        [answers.creativity]         - The level of creativity in responses (e.g., Highly creative, Balanced).
 * @param   {string}        [answers.humor]              - The type of humor used by the AI (e.g., Sarcastic, Light).
 * @param   {string}        [answers.empathy]            - The level of empathy (e.g., Highly empathetic, Objective).
 * @param   {string}        [answers.problemSolving]     - The approach to solving problems (e.g., With tact, Direct answers).
 * @param   {string}        [answers.responseLength]     - The length of responses (e.g., Short, Medium, Long, Infinite).
 * @param   {string}        [answers.quirks]             - Any distinctive behaviors or quirks (e.g., speaking in metaphors).
 * @param   {string}        [answers.generalDescription] - A general description of the AI's personality and focus areas.
 * @param   {boolean}       [answers.modeAuto]           - Whether to automatically run the AI after configuration.
 * @returns {Promise<void>}                              - A promise that resolves when the configuration and setup process completes.
 * @example import { personality } from '../src/main.js'
 * personality( { modeAuto: true } )
 *
 */
export const personality = async( answers = undefined ) => {

	const p = new Personality( { answers } )
	await p.run()

}
