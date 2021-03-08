// eslint-disable-next-line @typescript-eslint/no-var-requires
const node_env = require('node-env-file');

node_env('development.env');

export const MONGODB_CONNECT_URI = `mongodb+srv://${process.env.DB_LOGIN}:${process.env.DB_PASSWORD}@cluster0.4fp4r.azure.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

export const VK_CLIENT_ID = process.env.VK_CLIENT_ID;
export const VK_CLIENT_SECRET = process.env.VK_CLIENT_SECRET;
export const VK_REDIRECT_URI = process.env.VK_REDIRECT_URI;
