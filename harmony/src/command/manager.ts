import { Command } from '.'

const COMMAND_IDENTIFIER = '!'

export class CommandManager {
  private commands: Array<Function>

  constructor() {
    this.commands = []
  }

  processMessage(message) {
    if(!message.content.startsWith(COMMAND_IDENTIFIER)) {
      return
    }

    var content = <string>message.content.slice(COMMAND_IDENTIFIER.length)
    if(content.length < 1) {
      return
    }

    var name = content.split(' ')[0]
    if(!(name in this.commands)) {
      return
    }

    var commandClass = this.commands[name]
    var argString = content.slice(name.length)


    var runCommand = new Promise(function(resolve) {
        var instance: Command = new commandClass(message, argString)
        instance.execute()
        resolve()
    })

    runCommand
      .catch(function (error) {
        try {
          message.reply(`Failed to execute command \`\`\`${error.stack}\`\`\``)
        }
        catch (e) {
          message.reply(`Failed to execute command, error printing failed with \`\`\`${e.stack}\`\`\``)
        }
      })
  }

  addCommand(name: string, cls: any) {
    if(name in this.commands) {
      throw new Error('Command with this name already exists')
    }
    this.commands[name] = cls
    console.log(`Mapped ${cls.constructor.name} to !${name}`)
  }
}
