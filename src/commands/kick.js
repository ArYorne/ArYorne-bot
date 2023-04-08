module.exports = {
    name: 'kick',
    description: 'This command kicks users!',
    execute(message, args) {
        const member = message.mentions.users.first();
        if (member) {
            const memberTarget = message.guild.members.cache.get(member.id);
            memberTarget.kick();
            message.channel.send('User has been kicked.');
        } else {
            message.channel.send('You cannot kick that member.');
        }  
    }
}