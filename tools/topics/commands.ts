const printTree = require('print-tree')
const treeify = require('treeify')
import traverse from 'traverse'
import { GraphBuilder, Traversers } from 'graph-builder'
import { Arguments } from "./args";
import { Storage } from "./storage";
import { Topic } from './types/topic';

export interface CommandDependencies {
    storage : Storage
}
export type Command<Args extends Arguments> = (args : Args, dependencies : CommandDependencies) => Promise<void>
export type Commands = { [CommandName in keyof Arguments]: (args: Arguments[CommandName], dependencies: CommandDependencies) => Promise<void> }

export const COMMANDS : Commands = {
    findIssues: async (args, dependencies) => {
        const topic = await dependencies.storage.getTopic(args.topic)

        const connections = getConnectedIssuesRefs(topic)
        const connectedIssues = new Set(Object.keys(connections))

        const allIssues = new Set(topic.issues)
        const unconnectedIssues = new Set([...allIssues].filter(issue => !connectedIssues.has(issue)))
        console.log([...unconnectedIssues].join('\n'))
    },
    issueTree: async (args, dependencies) => {
        const topic = await dependencies.storage.getTopic(args.topic)
        const connections = getConnectedIssuesRefs(topic)

        interface TreeNode {
            [issue : string] : TreeNode | string
        }
        const treeNodes : {[issue : string] : TreeNode} = {}
        for (const issue of Object.keys(connections)) {
            treeNodes[issue] = {}
        }
        for (const [issue, issueConnectionRefs] of Object.entries(connections)) {
            for (const issueConnectionRef of issueConnectionRefs) {
                treeNodes[issue][issueConnectionRef] = treeNodes[issueConnectionRef]
            }
        }
        const cleanedTreeNodes = traverse.map(treeNodes[args.root], function(node : TreeNode) {
            if (!!args.depth && this.level > args.depth) {
                this.remove()
            } else if (this.isLeaf) {
                this.update(null)
            } else if (this.circular) {
                if (this.level === 2 && this.key === args.root) {
                    this.remove()
                } else if (this.parent && this.parent.parent && this.parent.parent.key === this.key) {
                    this.remove()
                } else {
                    this.update('(circular)')
                }
            }
        })
        console.log(treeify.asTree({[args.root]: cleanedTreeNodes}))
    }
}

function getConnectedIssuesRefs(topic : Topic) : {[issue : string]: Set<string>} {
    const connectionRefs : {[issue : string]: Set<string>} = {}
    const addConnectionRef = (left : string, right : string) => {
        (connectionRefs[left] = connectionRefs[left] || new Set()).add(right);
        (connectionRefs[right] = connectionRefs[right] || new Set()).add(left);
    }

    for (const issueConnectionContainer of topic["issue-connections"]) {
        for (const issueConnection of issueConnectionContainer.connections) {
            if (typeof issueConnection === 'string') {
                addConnectionRef(issueConnectionContainer.issue, issueConnection)
            } else {
                for (const [issueReference, issueConnectionDetails] of Object.entries(issueConnection)) {
                    addConnectionRef(issueConnectionContainer.issue, issueReference)
                }
            }
        }
    }

    return connectionRefs
}

export default COMMANDS