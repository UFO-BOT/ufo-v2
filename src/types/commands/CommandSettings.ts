export default interface CommandSettings {
    name: string
    enabled: boolean
    deleteUsage: boolean
    allowedRoles: Array<string>
    forbiddenRoles: Array<string>
    allowedChannels: Array<string>
    forbiddenChannels: Array<string>
}