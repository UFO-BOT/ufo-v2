export default interface InteractionExecutionResult {
    action: 'update' | 'reply'
    ephemeral?: boolean
    ended?: boolean
}