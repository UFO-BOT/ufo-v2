import Discord, {
    ButtonBuilder,
    ButtonInteraction, ButtonStyle,
    EmbedBuilder,
    GuildMember,
    SelectMenuBuilder,
    SelectMenuInteraction,
    SnowflakeUtil
} from "discord.js";
import AbstractInteraction from "@/abstractions/AbstractInteraction";
import Interaction from "@/types/interactions/Interaction";
import Balance from "@/types/database/Balance";
import interactions from "@/properties/interactions.json";
import InteractionExecutionResult from "@/types/interactions/InteractionExecutionResult";
import GuildSettingsCache from "@/types/GuildSettingsCache";

type Equipment = 'helmet'
    | 'armor'
    | 'scope'
    | 'medKit'
    | 'grenade'

type GameAction = 'start'
    | 'miss'
    | 'leg'
    | 'body'
    | 'head'
    | 'medKit'
    | 'grenade'

interface Player {
    member: GuildMember
    balance: Balance
    hp: number
    equipment: Set<Equipment>
}

interface DuelInteractionComponents {
    accept?: ButtonBuilder
    menu?: SelectMenuBuilder
    shoot?: ButtonBuilder
    medKit?: ButtonBuilder
    grenade?: ButtonBuilder
}

interface DuelInteractionData {
    bet: number,
    players: Array<Player>
    turn?: number
    accepted?: boolean
}

type DuelInteractionAction = 'accept' | 'equipment' | 'medKit'

export default class DuelInteraction extends AbstractInteraction implements Interaction {
    public declare data: DuelInteractionData
    public lifetime = 300000
    protected components: DuelInteractionComponents
    protected props = interactions.Duel[this.settings.language.interface]

    constructor(users: Array<string>, data: DuelInteractionData, settings: GuildSettingsCache) {
        super(users, data, settings);
        this.components = {
            accept: new ButtonBuilder()
                .setCustomId(`${this.id}-accept`)
                .setStyle(ButtonStyle.Primary)
                .setLabel(this.props.buttons.accept.label)
                .setEmoji(this.props.buttons.accept.emoji)
        }
        this.embed = new EmbedBuilder()
            .setColor(this.constants.colors.system)
            .setAuthor({name: this.props.embed.author})
            .setDescription(this.props.embed.acceptDescription
                .replace("{{opponent}}", this.data.players[1].member.toString())
                .replace("{{bet}}", this.data.bet + this.settings.moneysymb)
                .replace("{{member}}", this.data.players[0].member.toString())
            )
    }

    public async execute(interaction: Discord.Interaction, action: DuelInteractionAction): Promise<InteractionExecutionResult> {
        if(action === "accept") return this.accept()
        if(action === "equipment") return this.equipment(interaction as SelectMenuInteraction)
        else {
            this[action]();
            let player = this.data.players.find(pl => pl.hp <= 0)
            if(player) {
                await this.finish(player);
                return {action: "update", ended: true}
            }
            return {action: "update"}
        }
    }

    public async end() {
        await this.data.players[0].balance.reload()
        this.data.players[0].balance.balance += this.data.bet;
        await this.data.players[0].balance.save()
        if (this.data.accepted) {
            await this.data.players[1].balance.reload()
            this.data.players[1].balance.balance++;
            await this.data.players[1].balance.save()
        }
    }

    private async accept(): Promise<InteractionExecutionResult> {
        await this.data.players[1].balance.reload()
        if (this.data.players[1].balance.balance < this.data.bet) return {
            error: {
                type: "notEnoughMoney",
                options: {money: this.data.players[1].balance.balance}
            }
        }
        this.data.players[1].balance.balance -= this.data.bet;
        await this.data.players[1].balance.save();
        this.embed.setDescription(this.props.embed.equipment + "\n"
        + this.props.embed.chooses + ": " + this.data.players[0].member.toString())
        this.components = {
            menu: new SelectMenuBuilder()
                .setCustomId(`${this.id}-equipment`)
                .setPlaceholder(this.props.equipment.placeholder)
                .addOptions(this.props.equipment.options)
                .setMinValues(0)
                .setMaxValues(2)
        }
        this.data.accepted = true;
        this.data.turn = 0;
        this.users = [this.data.players[0].member.id];
        return {action: "update"}
    }

    private equipment(interaction: SelectMenuInteraction): InteractionExecutionResult {
        this.data.players[this.data.turn].equipment = new Set(interaction.values as Array<Equipment>);
        this.data.turn = Number(!this.data.turn)
        this.embed.setDescription(this.props.embed.equipment + "\n"
            + this.props.embed.chooses + ": " + this.data.players[this.data.turn].member.toString())
        this.users = [this.data.players[this.data.turn].member.id]
        if(!this.data.turn) {
            this.data.turn = Number(!this.data.turn)
            this.setButtons()
            this.action('start')
        }
        return {action: "update"}
    }

    private async finish(player: Player) {
        let winner = this.data.players[Number(!this.data.players.indexOf(player))];
        await winner.balance.reload();
        winner.balance.balance += this.data.bet * 2;
        await winner.balance.save();
        this.embed.setDescription(this.embed.data.description.split("\n")[0] + "\n" +
        `**${this.props.embed.winner}:** ${winner.member.toString()}\n` +
        `**${winner.member.user.tag}:** +${this.data.bet}${this.settings.moneysymb}\n` +
        `**${player.member.user.tag}:** -${this.data.bet}${this.settings.moneysymb}`)
    }

    private shoot() {
        let scope = this.data.players[this.data.turn].equipment.has("scope");
        let helmet = this.data.players[Number(!this.data.turn)].equipment.has("helmet")
        let armor = this.data.players[Number(!this.data.turn)].equipment.has("armor")
        let shoot = Math.round(Math.random()*100)
        if(shoot < (scope ? 25 : 50)) {
            this.action("miss")
        }
        else {
            let part = Math.round(Math.random()*100)
            let shotPart: 'leg' | 'body' | 'head';
            if(scope) shotPart = part <= 40 ? 'leg' : (part > 40 && part < 95 ? 'body' : 'head')
            else shotPart = part <= 20 ? 'leg' : (part > 20 && part < 90 ? 'body' : 'head')
            let hp;
            switch (shotPart) {
                case "leg":
                    hp = Math.floor(1+Math.random()*14);
                    break;
                case "body":
                    hp = armor ? Math.floor(5+Math.random()*20) : Math.floor(10+Math.random()*25);
                    break;
                case "head":
                    hp = helmet ? 60 : 100;
            }
            this.data.players[Number(!this.data.turn)].hp -= hp;
            if(this.data.players[Number(!this.data.turn)].hp < 0) this.data.players[Number(!this.data.turn)].hp = 0;
            this.action(shotPart, hp);
        }
    }

    private medKit() {
        this.data.players[this.data.turn].hp += 50;
        if(this.data.players[this.data.turn].hp > 100) this.data.players[this.data.turn].hp = 100;
        this.data.players[this.data.turn].equipment.delete("medKit")
        this.action("medKit")
    }

    private grenade() {
        let damage = Math.floor(20+Math.random()*60)
        this.data.players[Number(!this.data.turn)].hp -= damage;
        if(this.data.players[Number(!this.data.turn)].hp < 0) this.data.players[Number(!this.data.turn)].hp = 0;
        this.data.players[this.data.turn].equipment.delete("grenade")
        this.action("grenade", damage);
    }

    private action(action: GameAction, hp?: number) {
        this.data.turn = Number(!this.data.turn)
        this.embed
            .setDescription(this.props.embed.actions[action].replace("{{hp}}", hp?.toString()) +
                `\n${this.props.embed.turn}: ${this.data.players[this.data.turn].member.toString()}`)
            .setFields(this.data.players.map((player, i) => {return {
                name: this.data.players[i].member.user.tag,
                value: this.data.players[i].hp + "HP",
                inline: true
            }}))
        this.users = [this.data.players[this.data.turn].member.id]
        this.setButtons()
    }

    private setButtons() {
        this.components = {
            shoot: new ButtonBuilder()
                .setCustomId(`${this.id}-shoot`)
                .setStyle(ButtonStyle.Primary)
                .setLabel(this.props.buttons.shoot.label)
                .setEmoji(this.props.buttons.shoot.emoji),
            medKit: new ButtonBuilder()
                .setCustomId(`${this.id}-medKit`)
                .setStyle(ButtonStyle.Success)
                .setLabel(this.props.buttons.medKit.label)
                .setEmoji(this.props.buttons.medKit.emoji)
                .setDisabled(!this.data.players[this.data.turn].equipment.has("medKit")),
            grenade: new ButtonBuilder()
                .setCustomId(`${this.id}-grenade`)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(this.props.buttons.grenade.label)
                .setEmoji(this.props.buttons.grenade.emoji)
                .setDisabled(!this.data.players[this.data.turn].equipment.has("grenade"))
        }
    }
}