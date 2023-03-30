import {ApplicationCommandOptionType, EmbedBuilder} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";

import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import MakeError from "@/utils/MakeError";

interface RandomCommandDTO {
    smallest: number
    largest: number
}

export default class RandomCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "рандом",
            description: 'Генерирует случайное число между указанными наименьшим и наибольшим числами',
            aliases: ['случайное-число', 'ранд']
        },
        en: {
            name: "random",
            description: 'Generates a random number between specified smallest and largest number',
            aliases: ['random-number', 'rand']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.Integer,
            name: "smallest",
            config: {
                ru: {
                    name: "наименьшее",
                    description: "Наименьшее число"
                },
                en: {
                    name: "smallest",
                    description: "Smallest number"
                }
            },
            required: true
        },
        {
            type: ApplicationCommandOptionType.Integer,
            name: "largest",
            config: {
                ru: {
                    name: "наибольшее",
                    description: "Наибольшее число"
                },
                en: {
                    name: "largest",
                    description: "Largest number"
                }
            },
            required: true
        }
    ]
    public category = CommandCategory.Utilities;

    public async execute(ctx: CommandExecutionContext<RandomCommandDTO>): Promise<CommandExecutionResult> {
        let smallest = ctx.args.smallest;
        let largest = ctx.args.largest;
        if (smallest > largest) return {
            error: {
                type: "other",
                options: {text: ctx.response.data.errors.invalidEnds}
            }
        }
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: ctx.response.data.embed.author, iconURL: ctx.member.displayAvatarURL()})
            .addFields({
                name: ctx.response.data.embed.result,
                value: '```' + Math.round(smallest + (largest - smallest) * Math.random()) + '```'
            })
        return {reply: {embeds: [embed]}}
    }
}