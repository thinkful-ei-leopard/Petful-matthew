const app = require('./modules/app/app');
const config = require('./config');

app.listen(config.PORT, () => {
  console.log(`[petful-server] Listening on ${ config.PORT }.`);
});
