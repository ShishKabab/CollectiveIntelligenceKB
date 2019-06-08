export interface Topic {
    issues: Issue[]
    'issue-connections': IssueConnectionContainer[]
}

export type Issue = string
export type IssueReference = string

export interface IssueConnectionContainer {
    issue: string
    connections: IssueConnection[]
}

export type IssueConnection = {[issue: string]: IssueConnectionDetails | IssueConnectionReason} | IssueReference
export interface IssueConnectionDetails {
    reasons: IssueConnectionReason
}

export type IssueConnectionReason = string
