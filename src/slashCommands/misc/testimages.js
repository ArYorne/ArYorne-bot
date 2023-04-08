const { SlashCommandBuilder } = require('discord.js');

const dotenv = require('dotenv');
dotenv.config();

const { ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require('discord.js');

// Prepare connection to OpenAI API
const { Configuration, OpenAIApi } = require('openai');
const configuration = new Configuration ({
	organization: process.env.OPENAI_ORG,
	apiKey: process.env.OPENAI_KEY,
});
const openai = new OpenAIApi(configuration);

const { EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('image_test')
		.setDescription('Testing images sending'),
	async execute(interaction) {
		await interaction.deferReply();

		try {
            const imageUrls = [
                'https://picsum.photos/500/500',
                'https://picsum.photos/500/400',
                'https://picsum.photos/400/500',
                'https://picsum.photos/400/400'
            ];
			const gptEmbeds = [];
			for ( let i = 0; i < 4; i++) {
				if ( i == 0 ) {
					gptEmbeds[i] = new EmbedBuilder().setTitle('Result').setDescription('Image testing to send multiple images!').setImage(imageUrls[i]).setFooter({ iconURL: 'https://cdn.discordapp.com/avatars/735785354208084018/2920dbe4e33a7af8fd63e7918a7e8892.webp', text: 'Slash commands are still under development!' });
				} else {
					gptEmbeds[i] = new EmbedBuilder().setImage(imageUrls[i]);
				}
			}
			const embedsTest = [
                new EmbedBuilder().setURL("https://example.org/").setImage("https://picsum.photos/500/500")
                    .setTitle("title").setDescription("desc").setFooter({ text: "footer" }),
                new EmbedBuilder().setURL("https://example.org/").setImage("https://picsum.photos/500/400"),
                new EmbedBuilder().setURL("https://example.org/").setImage("https://picsum.photos/400/500"),
            ];
            await interaction.editReply({ embeds: gptEmbeds });
		} catch(err) {
			return await interaction.editReply({ content: `Error: ${err}`})
		}
	},
};
