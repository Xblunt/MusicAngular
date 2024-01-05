
const route = '/api';
 const config = {
    target: "http://localhost:8080",
    changeorigin: true,
    secure: false,
    loglevel: "debug",
  };

const PROXY_CONFIG = {
  [route]: config,
}
module.exports = PROXY_CONFIG
