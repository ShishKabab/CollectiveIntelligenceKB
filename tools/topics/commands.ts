import { Arguments } from "./args";
import { Storage } from "./storage";

export interface CommandDependencies {
    storage : Storage
}
export type Command<Args extends Arguments> = (args : Args, dependencies : CommandDependencies) => Promise<void>
export type Commands = { [CommandName in keyof Arguments]: (args: Arguments[CommandName], dependencies: CommandDependencies) => Promise<void> }

export const COMMANDS : Commands = {
    findIssues: async (args : Arguments['findIssues'], dependencies : CommandDependencies) => {
        const topic = await dependencies.storage.getTopic(args.topic)

        const connected = new Set()
        for (const issueConnectionContainer of topic["issue-connections"]) {
            connected.add(issueConnectionContainer.issue)
            for (const issueConnection of issueConnectionContainer.connections) {
                if (typeof issueConnection === 'string') {
                    connected.add(issueConnection)
                } else {
                    for (const [issueReference, issueConnectionDetails] of Object.entries(issueConnection)) {
                        connected.add(issueReference)
                    }
                }
            }
        }

        const allIssues = new Set(topic.issues)
        const unconnectedIssues = new Set([...allIssues].filter(issue => !connected.has(issue)))
        console.log([...unconnectedIssues].join('\n'))
    },
}

export default COMMANDS