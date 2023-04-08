const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'help',
    description: 'This command prints the help message!',
    async execute(message, args, Discord) {
        const helpEmbed = new EmbedBuilder()
            .setTitle('Help page')
            .setDescription('This is the help page for the ArYorne bot!')
            .addFields([
                {
                    name: 'a!kick', 
                    value: 'kicks people'
                },
                {
                    name: 'a!ban', 
                    value: 'bans people'
                },
                {
                    name: 'a!clear [amount of messages]', 
                    value: 'clears messages'
                },
                {
                    name: 'a!ping', 
                    value: 'replies \'pong!\''
                },
            ])
            .setFooter({
                iconURL: 'https://cdn.discordapp.com/avatars/735785354208084018/2920dbe4e33a7af8fd63e7918a7e8892.webp',
                text: 'Slash commands are still under development!'
            });
        message.channel.send({ embeds: [ helpEmbed ] });
    }
}