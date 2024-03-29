import {ApplicationCommandOptionType, EmbedBuilder} from "discord.js";

import AbstractCommand from "@/abstractions/commands/AbstractCommand";
import Command from "@/types/commands/Command";

import CommandOption from "@/types/commands/CommandOption";
import CommandCategory from "@/types/commands/CommandCategory";
import CommandExecutionContext from "@/types/commands/CommandExecutionContext";
import CommandExecutionResult from "@/types/commands/CommandExecutionResult";
import CommandOptionValidationType from "@/types/commands/CommandOptionValidationType";

interface LayoutCommandDTO {
    text: string
}

export default class LayoutCommand extends AbstractCommand implements Command {
    public config = {
        ru: {
            name: "раскладка",
            description: 'Изменяет раскладку введенного текста',
            aliases: ['раскладка-клавиатуры', 'рк', 'т']
        },
        en: {
            name: "keyboard-layout",
            description: 'Changes keyboard layout of entered text',
            aliases: ['layout', 'kl', 't']
        }
    }
    public options: Array<CommandOption> = [
        {
            type: ApplicationCommandOptionType.String,
            validationType: CommandOptionValidationType.LongString,
            name: "text",
            config: {
                ru: {
                    name: "текст",
                    description: "Текст для изменения его раскладки"
                },
                en: {
                    name: "text",
                    description: "Text to change its keyboard layout"
                }
            },
            required: true
        }
    ]
    public category = CommandCategory.Utilities;

    public async execute(ctx: CommandExecutionContext<LayoutCommandDTO>): Promise<CommandExecutionResult> {
        let text = ctx.args.text;
        let content = text.split('');
        let result = '';
        for(let i = 0; i < content.length; i++) {
            result += this.layouts.en[this.layouts.ru.indexOf(content[i])] ??
                this.layouts.ru[this.layouts.en.indexOf(content[i])] ??
                content[i]
        }
        let embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: ctx.response.data.embed.author, iconURL: ctx.member.displayAvatarURL()})
            .setDescription(result)
        return {reply: {embeds: [embed]}}
    }

    private layouts = {
        ru: [
            'й', 'ц', 'у', 'к', 'е', 'н',
            'г', 'ш', 'щ', 'з', 'х', 'ъ',
            'ф', 'ы', 'в', 'а', 'п', 'р',
            'о', 'л', 'д', 'ж', 'э', 'я',
            'ч', 'с', 'м', 'и', 'т', 'ь',
            'б', 'ю', '.',
            'Й', 'Ц', 'У', 'К', 'Е', 'Н',
            'Г', 'Ш', 'Щ', 'З', 'Х', 'Ъ',
            'Ф', 'Ы', 'В', 'А', 'П', 'Р',
            'О', 'Л', 'Д', 'Ж', 'Э', 'Я',
            'Ч', 'С', 'М', 'И', 'Т', 'Ь',
            'Б', 'Ю', '.', '?'
        ],
        en: [
            'q', 'w', 'e', 'r', 't', 'y',
            'u', 'i', 'o', 'p', '[', ']',
            'a', 's', 'd', 'f', 'g', 'h',
            'j', 'k', 'l', ';', "'", 'z',
            'x', 'c', 'v', 'b', 'n', 'm',
            ',', '.', '/',  'Q', 'W', 'E', 'R', 'T', 'Y',
            'U', 'I', 'O', 'P', '[', ']',
            'A', 'S', 'D', 'F', 'G', 'H',
            'J', 'K', 'L', ';', "'", 'Z',
            'X', 'C', 'V', 'B', 'N', 'M',
            ',', '.', '/', '&'
        ]
    }
}