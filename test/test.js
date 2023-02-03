const Lottery = artifacts.require("Lottery");

contract("Lottery", accounts => {
  let lottery;
  const [admin, player1, player2, attacker] = accounts;

  beforeEach(async () => {
    lottery = await Lottery.new({ from: admin });
  });

  it("should allow players to invest 3 ether", async () => {
    await lottery.invest({ from: player1, value: 3 ether });
    assert.equal(await web3.eth.getBalance(lottery.address), 3 ether);
  });

  it("should only allow the admin to call selectWinner", async () => {
    await lottery.invest({ from: player1, value: 3 ether });
    await truffleAssert.reverts(
      lottery.selectWinner({ from: player1 }),
      "Only Admin can call function"
    );
    await lottery.selectWinner({ from: admin });
    assert.equal(await web3.eth.getBalance(lottery.address), 0);
  });

  it("should not allow the admin to invest", async () => {
    await truffleAssert.reverts(
      lottery.invest({ from: admin, value: 3 ether }),
      "Admin cannot invest"
    );
  });

  it("should only allow investment of 3 ether", async () => {
    await truffleAssert.reverts(
      lottery.invest({ from: player1, value: 2 ether }),
      "To join invest 3 ether"
    );
  });

  it("should not allow re-entry of the same player", async () => {
    await lottery.invest({ from: player1, value: 3 ether });
    await truffleAssert.reverts(
      lottery.invest({ from: player1, value: 3 ether }),
      "Admin cannot invest"
    );
  });

  it("should only allow players to join if the contract has sufficient balance", async () => {
    await web3.eth.sendTransaction({ from: attacker, to: lottery.address, value: 2 ether });
    await truffleAssert.reverts(
      lottery.invest({ from: player1, value: 3 ether }),
      "To join invest 3 ether"
    );
  });

  it("should only allow a winner to be selected if there are players", async () => {
    await truffleAssert.reverts(
      lottery.selectWinner({ from: admin }),
      "No players joined"
    );
  });
});
