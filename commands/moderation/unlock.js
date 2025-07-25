const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const path = require('path');
const config = require(path.resolve(__dirname, '../../config.json'));

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('🔓 Unlock the current channel'),

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
      SendMessages: null
    });

    const embed = new EmbedBuilder()
      .setTitle('🔓 Channel Unlocked')
      .setDescription(`Channel <#${channel.id}> was unlocked by ${interaction.user}`)
      .setColor('Green')
      .setTimestamp();

    interaction.reply({ embeds: [embed] });

    const logChannel = await interaction.guild.channels.fetch(config.LockLogsChannelID).catch(() => null);
    if (logChannel) logChannel.send({ embeds: [embed] });
  }
};