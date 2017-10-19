/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */

const path = require('path');
const Params = require('./params');
const config = require('../lib/config');

const DEFAULT_PATH = config.DEFAULT_PATH;
const COMMANDS = {
  s: ['int', 2],
  w: ['int', 1],
  h: ['int', 1],
  q: ['int', 1],
};

function buildParams(cachedDir) {
  const parsed = path.parse(cachedDir);
  const image = parsed.base;
  const imageType = parsed.ext.substr(1);

  let args = parsed.dir.split('/');
  if (args[0] !== DEFAULT_PATH) {
    throw new Error('You are looking for the wrong directory.');
  }

  // Map each option to the given parameter
  const cmds = {};
  let cmdCount = 0;
  args = args.slice(1);
  args.forEach((arg, index) => {
    if (!(arg in COMMANDS)) {
      return;
    }
    const cmd = COMMANDS[arg];
    switch (cmd[0]) {
      case 'int': {
        const parameters = args.slice(index + 1, index + 1 + cmd[1]);
        const isAllNumbers = parameters.every(parameter => !isNaN(parseInt(parameter, 10)));
        if (!isAllNumbers) {
          throw new Error('Your request is malformed.');
        }
        cmds[arg] = parameters;
        cmdCount += 1 + cmd[1];
        break;
      }
      case 'str': {
        break;
      }
      default: {
        break;
      }
    }
  });

  const originalDir = `${args.slice(cmdCount).join('/')}/${image}`;
  const params = new Params();
  params.parseCmds(cmds);
  const width = params.width;
  const height = params.height;
  const quality = params.quality;

  return {
    cachedDir,
    originalDir,
    width,
    height,
    quality,
    imageType,
  };
}

module.exports = {
  buildParams,
};

