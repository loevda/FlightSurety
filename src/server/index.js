
import http from 'http'
import app from './server'

const server = app;
let currentApp = app.app;
server.app.listen(3000);

if (module.hot) {
 module.hot.accept('./server', () => {
  server.removeListener('request', currentApp);
  server.on('request', app);
  currentApp = app;
 })
}
