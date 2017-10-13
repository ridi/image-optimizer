

const getTimestamp = () => parseInt(new Date().getTime() / 1000, 10);

const info = (message) => {
  console.info(`${message} - ${getTimestamp()}`);
};

module.exports = {
  info,
};
