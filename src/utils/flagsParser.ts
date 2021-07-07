import CommandFlag from "@/types/CommandFlag";

export default function flagsParse(flags: Array<CommandFlag>, args: Array<string>): Record<string, boolean | string> {
    if (!flags) return {};

    let usedFlags: Record<string, boolean | string> = {};
    flags.forEach(flag => {
        flag.usages.forEach(usage => {
            let arg = args.find(a => a.split('=')[0] === usage)
            if (arg) {
                args.splice(args.indexOf(arg), 1)
                usedFlags[flag.name] = arg.split('=')[1] || true;
            }
        })
    })

    return usedFlags;
}