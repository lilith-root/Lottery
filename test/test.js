const Lottery = artifacts.require("Lottery");
const { expect } = require("chai");

contract("Lottery", (accounts) => {
  let instance;

  before(async () => {
    instance = await Lottery.deployed();
  });

  it("should allow players to invest 3 ether", async () => {
    const investment = web3.utils.toWei("3", "ether");
    await instance.invest({ from: accounts[0], value: investment });
    const balance = await instance.getBalance({ from: accounts[0] });
    expect(balance).to.be.equal(investment);
  });

  it("should not allow admin to invest", async () => {
    const investment = web3.utils.toWei("3", "ether");
    try {
      await instance.invest({ from: accounts[1], value: investment });
    } catch (err) {
      expect(err.reason).to.be.equal("Admin cannot invest");
    }
  });

  it("should select a winner and transfer funds", async () => {
    const initialBalance = await instance.getBalance({ from: accounts[0] });
    const investment = web3.utils.toWei("3", "ether");
    await instance.invest({ from: accounts[1], value: investment });
    await instance.invest({ from: accounts[2], value: investment });
    await instance.invest({ from: accounts[3], value: investment });
    await instance.selectWinner({ from: accounts[0] });
    const finalBalance = await instance.getBalance({ from: accounts[0] });
    expect(finalBalance).to.be.equal("0");
    expect(finalBalance).to.not.be.equal(initialBalance);
  });
});
