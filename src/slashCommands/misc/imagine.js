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
		.setName('imagine')
		.setDescription('Generates image using GPT!')
		.addStringOption(option => option.setName('prompt').setDescription('Prompt to send to GPT AI').setRequired(true))
		.addIntegerOption(option => option.setName('amount')
										.setDescription('Amount of images to generate')
										.setRequired(true)
										.addChoices(
											{ name: '1', value: 1 },
											{ name: '2', value: 2 },
											{ name: '3', value: 3 },
											{ name: '4', value: 4 },
											{ name: '5', value: 5 },
											{ name: '6', value: 6 },
											{ name: '7', value: 7 },
											{ name: '8', value: 8 },
											{ name: '9', value: 9 },
											{ name: '10', value: 10 },
										))
		.addStringOption(option => option.setName('resolution')
										.setDescription('Resolution of the generated image')
										.setRequired(true)
										.addChoices(
											{ name: '1024', value: '1024x1024'},
											{ name: '512', value: '512x512'},
											{ name: '256', value: '256x256'},
										)),
	async execute(interaction) {
		await interaction.deferReply();

		try {
			const response = await openai.createImage({
				prompt: interaction.options.get('prompt').value,
				n: interaction.options.get('amount').value,
				size: interaction.options.get('resolution').value,
			});

			const imageUrls = [];
			const gptEmbeds = [];
			for ( let i = 0; i < interaction.options.get('amount').value; i++) {
				imageUrls[i] = response.data.data[i].url;
				if ( i == 0 ) {
					gptEmbeds[i] = new EmbedBuilder()
										.setTitle('Result')
										.setDescription(interaction.options.get('prompt').value)
										.setImage(imageUrls[i])
										.setFooter({
											iconURL: 'https://cdn.discordapp.com/avatars/735785354208084018/2920dbe4e33a7af8fd63e7918a7e8892.webp',
                							text: 'Slash commands are still under development!'
										});
				} else {
					gptEmbeds[i] = new EmbedBuilder().setImage(imageUrls[i]);
				}
			}
			image_url = response.data.data[0].url;
			const lastBtn = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('last')
					.setLabel('\:arrow_left:')
					.setStyle(ButtonStyle.Primary),
			);
			const nextBtn = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('next')
					.setLabel('\:arrow_right:')
					.setStyle(ButtonStyle.Primary),
			);
			const gptEmbed = new EmbedBuilder()
				.setTitle('Result')
				.setDescription(interaction.options.get('prompt').value)
				.setImage(image_url)
			// await interaction.editReply({ embeds: [gptEmbed] });
			await interaction.editReply({ embeds: gptEmbeds });
			// interaction.reply(image_url);
		} catch(err) {
			return await interaction.editReply({ content: `Error: ${err}`})
		}
	},
};
