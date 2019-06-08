import camelCase from 'lodash/camelCase'
import yargs from 'yargs'

export interface Arguments {
    findIssues: {
        topic: string
        connected?: boolean
        requireReasons?: boolean
    },
    issueTree: {
        topic: string
        root: string
        depth: number
    }
}

export function parseArguments() : Partial<Arguments> {
    const args = yargs
        .usage('Usage: topics <command>')
        .command('find-issues <topic>', 'find issues by criteria', ((subcommand : typeof yargs) => {
            subcommand
                .options({
                    connected: { type: 'boolean' },
                    requireReasons: { type: 'boolean' }
                })
        }) as any)
        .command('issue-tree <topic> <root>', 'visualize issue as tree', ((subcommand : typeof yargs) => {
            subcommand
                .options({
                    depth: { type: 'number' }
                })
        }) as any)
        .argv

    const command = args._[0]
    return {[camelCase(command)]: args}
}
