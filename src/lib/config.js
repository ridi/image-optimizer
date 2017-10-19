/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */

const config = (() => {
  const configPath = `../../${process.env.CONFIG}`;
  return require(configPath);
})();

module.exports = config;
