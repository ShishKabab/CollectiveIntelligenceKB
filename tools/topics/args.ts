import camelCase from 'lodash/camelCase'
import yargs from 'yargs'

export interface Arguments {
    findIssues: {
        topic: string
        connected?: boolean
        requireReasons?: boolean
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
        .argv

    const command = args._[0]
    return {[camelCase(command)]: args}
}
