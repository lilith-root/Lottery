// Certainly, here's an example test suite written in JavaScript using the Mocha testing framework and the Chai assertion library:

const Lottery = artifacts.require("Lottery");

contract("Lottery", (accounts) => {
  let lotteryInstance;
  const admin = accounts[0];
  const player1 = accounts[1];
  const player2 = accounts[2];

  before(async () => {
    lotteryInstance = await Lottery.new({ from: admin });
  });

  it("should allow a player to invest", async () => {
    const investmentAmount = web3.utils.toWei("3", "ether");
    await lotteryInstance.invest({ from: player1, value: investmentAmount });
    const players = await lotteryInstance.players();
    assert.equal(players.length, 1, "Player was not added");
    assert.equal(players[0], player1, "Incorrect player address");
  });

  it("should not allow the admin to invest", async () => {
    const investmentAmount = web3.utils.toWei("3", "ether");
    try {
      await lotteryInstance.invest({ from: admin, value: investmentAmount });
      assert.fail("Admin was able to invest");
    } catch (error) {
      assert.include(
        error.message,
        "Admin cannot invest",
        "Incorrect error message"
      );
    }
  });

  it("should not allow a player to invest less than 3 ether", async () => {
    const investmentAmount = web3.utils.toWei("2", "ether");
    try {
      await lotteryInstance.invest({ from: player2, value: investmentAmount });
      assert.fail("Player was able to invest less than 3 ether");
    } catch (error) {
      assert.include(
        error.message,
        "To join invest 3 ether",
        "Incorrect error message"
      );
    }
  });

  it("should select a winner and transfer the contract balance to them", async () => {
    const investmentAmount1 = web3.utils.toWei("3", "ether");
    const investmentAmount2 = web3.utils.toWei("3", "ether");
    await lotteryInstance.invest({ from: player1, value: investmentAmount1 });
    await lotteryInstance.invest({ from: player2, value: investmentAmount2 });
    const initialBalance = await web3.eth.getBalance(lotteryInstance.address);
    await lotteryInstance.selectWinner({ from: admin });
    const finalBalance = await web3.eth.getBalance(lotteryInstance.address);
    const winner = await lotteryInstance.winner();
    assert.equal(finalBalance.toString(), "0", "Contract balance was not transferred");
    assert.include(
      initialBalance.toString(),
      winner.prize.toString(),
      "Incorrect prize amount"
    );
  });
});

/*
This test suite checks that:

1.A player can invest in the lottery by sending 3 ether
2.The admin is not able to invest in the lottery
3.A player is not able to invest less than 3 ether
4.When the admin selects a winner, the contract balance is transferred to the winner's address.
*/
