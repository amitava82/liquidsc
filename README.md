## How to run
- Install Latest Node
- `npm install`
- change relavent config in `config/default.json`
- run `webpack` for client build
- `node app.js` to start server
- App will run on port `3000` `http://localhost:3000`

### Env variables

- `EXTERNAL_HOST` - for site URL eg. `http://google.com` without tailing slash
- `ADMIN_EMAIL` - for admin email for sending notificaiton email to admin

### Useful info
- `\templates` folder has email templates.
- `\server` is server side code
- `\client` is client code