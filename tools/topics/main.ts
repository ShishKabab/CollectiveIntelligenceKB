import fs from 'fs'
import path from 'path'
import jsYaml from 'js-yaml'
import { parseArguments, Arguments } from "./args"
import * as commands from './commands'
import COMMANDS from './commands'

export async function loadTopic(name : string) {
    const topicDirPath = path.join(__dirname, '../../topics')
    const topicFilePath = path.join(topicDirPath, `${name}.yaml`)
    const topicFileContent = fs.readFileSync(topicFilePath)
    const topic = jsYaml.safeLoad(topicFileContent.toString())
    return topic
}

export async function main() {
    const args = parseArguments()
    const deps : commands.CommandDependencies = { storage: { getTopic: loadTopic } }
    for (const [commandName, commandArgs] of Object.entries(args)) {
        COMMANDS[commandName as keyof commands.Commands](commandArgs as any, deps)
    }
    // if (args.issueConnections) {
    //     await COMMANDS.issueConnections(args.issueConnections, deps)
    // }
}

if(require.main === module) {
    main()
}
