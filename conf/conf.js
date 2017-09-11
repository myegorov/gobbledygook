const Path = require('path');

const ROOT_PATH = Path.resolve(__dirname, '..'),
      SRC_DIR = 'src';


let SHOST,
    SPORT,
    ISPROD=false;

if (process.env.NODE_ENV === 'dev') {
  SHOST = process.env.HOST || '0.0.0.0';
  SPORT = process.env.PORT || 3000;
} else {
  SHOST = process.env.HOST || '0.0.0.0';
  SPORT = process.env.PORT || 80;
  ISPROD = true;
}

const config = {
  paths: {
    root: ROOT_PATH,
    source: Path.join(ROOT_PATH, SRC_DIR),
  },
  server: {
    host: SHOST,
    port: SPORT
  },
  prodEnv: ISPROD,
  name: require(Path.resolve(ROOT_PATH, 'package.json')).name,
  version: require(Path.resolve(ROOT_PATH, 'package.json')).version
};

module.exports = Object.freeze(config);
