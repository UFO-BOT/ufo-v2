import Discord, {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonInteraction, ButtonStyle,
    EmbedBuilder, Guild,
    GuildMember, ModalBuilder, ModalSubmitInteraction,
    SelectMenuBuilder,
    SelectMenuInteraction,
    SnowflakeUtil, TextInputBuilder,
    TextInputStyle
} from "discord.js";
import AbstractInteraction from "@/abstractions/AbstractInteraction";
import Interaction from "@/types/interactions/Interaction";
import Balance from "@/types/database/Balance";
import interactions from "@/properties/interactions.json";
import InteractionExecutionResult from "@/types/interactions/InteractionExecutionResult";
import GuildSettingsCache from "@/types/GuildSettingsCache";

interface JackpotInteractionComponents {
    enter: ButtonBuilder
}

interface JackpotInteractionData {
    member: GuildMember
    balance: Balance
    bet: number
    numbers: Array<number>
}

type JackpotInteractionAction = 'enter' | 'numbers'

export default class JackpotInteraction extends AbstractInteraction implements Interaction {
    public declare data: JackpotInteractionData
    public lifetime = 300000
    protected components: JackpotInteractionComponents
    protected props = interactions.Jackpot[this.settings.language.interface]

    constructor(users: Array<string>, data: JackpotInteractionData, settings: GuildSettingsCache) {
        super(users, data, settings);
        this.components = {
            enter: new ButtonBuilder()
                .setCustomId(`${this.id}-enter`)
                .setStyle(ButtonStyle.Primary)
                .setLabel(this.props.buttons.enter.label),
        }
        this.embed = new EmbedBuilder()
            .setColor(global.constants.colors.system)
            .setAuthor({name: this.props.embed.author, iconURL: data.member.displayAvatarURL()})
            .setDescription(this.props.embed.description)
            .addFields([
                {name: this.props.embed.bet, value: this.data.bet.toString() + this.settings.moneysymb, inline: true}
            ])
    }

    public async execute(interaction: Discord.Interaction, action: JackpotInteractionAction): Promise<InteractionExecutionResult> {
        if (action === "enter") return this.enter()
        else return this.numbers(interaction as ModalSubmitInteraction)
    }

    public async end() {
        await this.data.balance.reload()
        this.data.balance.balance += this.data.bet;
        await this.data.balance.save()
    }

    private enter(): InteractionExecutionResult {
        let modal = new ModalBuilder()
            .setCustomId(`${this.id}-numbers`)
            .setTitle(this.props.modal.enter)
        let numbersInput = new TextInputBuilder()
            .setCustomId(`numbers`)
            .setLabel(this.props.modal.enterNumbers)
            .setStyle(TextInputStyle.Short)
        modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(numbersInput))
        return {modal: modal}
    }

    private async numbers(interaction: ModalSubmitInteraction): Promise<InteractionExecutionResult> {
        let numbers = interaction.fields.getTextInputValue("numbers")
        let numbersArray = numbers.split(" ").map(num => parseInt(num));
        if (numbersArray.length < 7) return {
            error: {
                type: "other",
                options: {text: this.props.errors.invalidNumbersAmount}
            }
        }
        if (numbersArray.find(num => isNaN(num) || num < 1 || num > 50) !== undefined) return {
            error: {
                type: "other",
                options: {text: this.props.errors.invalidNumbers}
            }
        }
        if(numbersArray.filter((num, i) => numbersArray.indexOf(num) !== i).length) return {
            error: {
                type: "other",
                options: {text: this.props.errors.numbersRepeat}
            }
        }
        let guessed = 0;
        let guessedString = "";
        let multipliers = [0, 1.3, 1.5, 2, 2.5, 3, 4, 5]
        numbersArray.forEach(num => {
            if(this.data.numbers.includes(num)) {
                guessed++;
                guessedString += ("**" + num + "** ");
            }
            else guessedString += (num + " ");
        })
        let gain = Math.round(this.data.bet * multipliers[guessed]);
        await this.data.balance.reload();
        this.data.balance.balance += gain;
        await this.data.balance.save();
        this.embed
            .setColor(guessed === 0 ? global.constants.colors.error : (guessed < 5 ? global.constants.colors.warning :
            global.constants.colors.success))
            .setFields([
                {name: this.props.embed.made, value: this.data.numbers.join(" ")},
                {name: this.props.embed.entered, value: guessedString},
                {name: this.props.embed.guessed, value: guessed.toString()},
                {name: this.props.embed.bet, value: this.data.bet + this.settings.moneysymb, inline: true},
                {name: this.props.embed.multiplier, value: "x" + multipliers[guessed], inline: true},
                {name: this.props.embed.multiplier, value: gain + this.settings.moneysymb, inline: true}
            ])
        let result = guessed === 0 ? `-${this.data.bet}` : `+${gain}` + this.settings.moneysymb;
        this.embed.setDescription(`**${this.props.embed.result}:** ${result}\n` +
        `**${this.props.embed.currentBalance}:** ${this.data.balance.balance}${this.settings.moneysymb}`)
        return {action: "update", ended: true}
    }
}