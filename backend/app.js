require("dotenv").config();

const { createSupabaseClients } = require("./config/supabase");
const { createApp } = require("./createApp");

const app = createApp(createSupabaseClients());

module.exports = app;
