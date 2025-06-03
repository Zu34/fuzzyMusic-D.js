module.exports = {
    name: 'error',
    execute(channel, error) {
      console.error('❌ DisTube Error:', error);
      if (channel?.send) {
        channel.send(`❌ An error occurred: \`${error.message || error.toString()}\``);
      }
    }
  };
  