const { Command } = require('discord-akairo');
const { poll } = require('../../../lib/constants');

class PollCommand extends Command {
    constructor() {
        super('poll', {
            aliases: ['poll', 'vote'],
            category: 'Utility',
            description: {
                content: 'Create a poll in your server with some options for people to vote on.\nYou can use the flag \`--delete\` anywhere in the message to automatically delete the invocation message as long as Rada has permission to manage messages.',
                permissions: ['EMBED_LINKS', 'MANAGE_MESSAGES (ℹ)']
            },
            args: [{
                id: 'options',
                type: 'string',
                match: 'rest',
                default: null
            },
            {
                id: 'silent',
                match: 'flag',
                flag: '--delete',
                unordered: true
            }]
        });
    }

    async exec(message, { options, silent }) {
        let embed = this.client.util.embed()
            .setTitle(`Poll created by ${message.author.username}`)
            .setThumbnail(this.client.avatar)
            .setColor(this.client.color)
            .setTimestamp();
        if (!options) {
            return message.responder.error('**You must enter a minimum of 2 poll options**');
        }
        const opt = options.split(/,\s*/);
        if (opt.length > 10) {
            return message.responder.error('**You must only enter a maximum of 10 poll options**');
        }
        if (opt.length < 2) {
			return message.responder.error('**You must enter a minimum of 2 poll options**');
        }
        const pollMap = opt.map((option, idx) => `\`Option ${idx + 1}:\` ${option}`).join('\n');
        if (pollMap.length > 2048) {
            return message.responder.error(`**Your options are too long, please shorten them**`);
        }
        if (silent && message.guild.me.permissions.has('MANAGE_MESSAGES')) {
            await message.delete();
        }
        embed.setDescription(pollMap);
        return message.channel.send(embed).then(async message => {
			for (let i = 0; i < opt.length; i++) {
				await message.react(poll[i + 1]);
			}
		});
    }
}

module.exports = PollCommand;