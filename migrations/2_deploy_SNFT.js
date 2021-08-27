const SNFT = artifacts.require("SNFT");

module.exports = function (deployer) {
  deployer.deploy(SNFT);
};
