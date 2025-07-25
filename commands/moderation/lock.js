const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const path = require('path');
const config = require(path.resolve(__dirname, '../../config.json'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('🔒 Lock the current channel'),

  async execute(interaction) {
const allowedRoles = config.LockRoleIDs; // this should be an array of IDs

const hasPermission = interaction.member.roles.cache.some(role =>
  allowedRoles.includes(role.id)
);

if (!hasPermission) {
  return interaction.reply({ content: '❌ You do not have permission to use this command.', ephemeral: true });
}

    const channel = interaction.channel;

    await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
      SendMessages: false
    });

    const embed = new EmbedBuilder()
      .setTitle('🔒 Channel Locked')
      .setDescription(`Channel <#${channel.id}> was locked by ${interaction.user}`)
      .setColor('Red')
      .setTimestamp();

    interaction.reply({ embeds: [embed] });

    const logChannel = await interaction.guild.channels.fetch(config.LockLogsChannelID).catch(() => null);
    if (logChannel) logChannel.send({ embeds: [embed] });
  }
};