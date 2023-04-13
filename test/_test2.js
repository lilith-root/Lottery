// Mutation Testing for Lottery Contract

const Lottery = artifacts.require("Lottery");

contract("Lottery", accounts => {
  let instance;

  beforeEach(async () => {
    instance = await Lottery.new();
  });

  it("should add a participant when invest() function is called", async () => {
    const admin = accounts[0];
    const player = accounts[1];
    await instance.invest({ from: player, value: web3.utils.toWei("3", "ether") });
    const players = await instance.players(0);
    assert.equal(players, player, "Player was not added to the contract");
  });

  it("should not allow the admin to invest in the lottery", async () => {
    const admin = accounts[0];
    await expectRevert(instance.invest({ from: admin, value: web3.utils.toWei("3", "ether") }), "Admin cannot invest");
  });

  it("should not allow a participant to invest less than 3 ether", async () => {
    const admin = accounts[0];
    const player = accounts[1];
    await expectRevert(instance.invest({ from: player, value: web3.utils.toWei("2", "ether") }), "To join invest 3 ether");
  });

  it("should select a winner when selectWinner() function is called", async () => {
    const admin = accounts[0];
    const player1 = accounts[1];
    const player2 = accounts[2];
    const player3 = accounts[3];
    await instance.invest({ from: player1, value: web3.utils.toWei("3", "ether") });
    await instance.invest({ from: player2, value: web3.utils.toWei("3", "ether") });
    await instance.invest({ from: player3, value: web3.utils.toWei("3", "ether") });
    const initialBalance = await web3.eth.getBalance(instance.address);
    await instance.selectWinner({ from: admin });
    const finalBalance = await web3.eth.getBalance(instance.address);
    const players = await instance.players(0);
    assert.equal(finalBalance.toString(), "0", "Contract balance was not transferred to winner");
    assert.notEqual(initialBalance.toString(), finalBalance.toString(), "Winner was not selected");
    assert.ok(players == null || players.length == 0, "Players were not reset");
  });
});

// Mutation Testing
const Mutations = require("mutation-testing-elements").Mutations;
const mutations = new Mutations({ provider: web3.currentProvider });

describe("Mutation Testing", () => {
  it("should run mutation tests", async () => {
    const results = await mutations.mutateAndTest(["Lottery"], {
      timeoutMs: 60000,
      testFrameworkOptions: { provider: web3.currentProvider },
    });
    const totalMutants = results.reduce((sum, file) => sum + file.mutants.length, 0);
    const killedMutants = results.reduce((sum, file) => sum + file.killed, 0);
    console.log(`Total mutants: ${totalMutants}`);
    console.log(`Killed mutants: ${killedMutants}`);
    console.log(`Mutation score: ${((killedMutants / totalMutants) * 100).toFixed(2)}%`);
  });
});

/*
This code uses the mutation-testing-elements library to perform mutation testing on the Lottery contract.
It runs a set of mutation tests on the contract and reports the number of mutants, the number of killed mutants, and the mutation score.
This can be addressed by adding proper input validation and checking for potential vulnerabilities during development and testing phases of the smart contract.
*/
