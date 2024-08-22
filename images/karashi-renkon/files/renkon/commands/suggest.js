import { ReflectCommands } from "./commands.js";

export class Suggester {
  constructor(toolCallURL, commands) {
    this.commands = commands;
    this.toolCall = new ReflectCommands(toolCallURL);
  }

  async suggest(input) {
    const result = await this.toolCall.run("suggest", {
      input,
      commands: await this.commands.index,
    });
    console.log("result", result);
    if (result.error) {
      throw new Error(`Suggestion error: ${result.error}`);
    }
    return result.choices;
  }

  async run({ command, parameters }) {
    return await this.commands.run(command, parameters);
  }

  async suggestAndRun(input) {
    const choices = await this.suggest(input);
    if (choices.length === 0) {
      return null;
    }
    return await this.run(choices[0]);
  }
}
