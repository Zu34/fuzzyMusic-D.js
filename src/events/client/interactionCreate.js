module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
      if (!interaction.isCommand()) return;
  
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
  
      try {
        await command.execute(interaction, client);
      } catch (error) {
        console.error(`❌ Error executing command ${interaction.commandName}:`, error);
        const content = 'There was an error while executing this command.';
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content, ephemeral: true });
        } else {
          await interaction.reply({ content: "Message", flags: 64 }); // 64 = EPHEMERAL

        }
      }
    },
  };
  