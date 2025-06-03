require('dotenv').config();
require('./src/bot');
const connectToDatabase = require('./src/database/connect');
(async () => {
    await connectToDatabase();
    // Then start your bot
    client.login(process.env.TOKEN);
  })();