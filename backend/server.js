require("dotenv").config();

const { createSupabaseClients } = require("./config/supabase");
const { createApp } = require("./Createapp");
const app = createApp(createSupabaseClients());
const port = Number(process.env.PORT || 5000);

if (require.main === module) {
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535");
  }
  app.listen(port, () => {
    console.info(`Eko Tejas backend listening on port ${port}`);
  });
}

module.exports = app;