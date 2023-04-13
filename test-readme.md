**SYSTEM TESTING

Sure, here's an example of how you can perform system testing for the Lottery smart contract:

**1.Test case:** Deploy contract and set admin address
Action: Deploy the Lottery contract and set the admin address
Expected result: The admin address is set correctly

**2.Test case:** Player invests 0.3 ether in the contract
Action: A player calls the invest() function and sends 0.3 ether to the contract
Expected result: The player's address is added to the players array and the playerInvested event is emitted with the correct parameters

**3.Test case:** Player tries to invest more or less than 0.3 ether
Action: A player tries to call the invest() function and sends less or more than 0.3 ether to the contract
Expected result: The contract reverts with the correct error message

**4.Test case:** Admin tries to select winner before there are any players
Action: The admin tries to call the selectWinner() function before any players have invested in the contract
Expected result: The contract reverts with the correct error message

**5.Test case:** Admin selects winner and transfers the balance to the winner
Action: The admin calls the selectWinner() function and a winner is selected randomly, then the winner calls the withdraw() function to withdraw the balance
Expected result: The winner's address is added to the winners array, the winnerSelected event is emitted with the correct parameters, and the winner is able to withdraw the balance correctly.

**6.Test case:** Admin tries to select winner multiple times
Action: The admin calls the selectWinner() function multiple times in a row
Expected result: The contract reverts with the correct error message after the first successful call to selectWinner().

**7.Test case:** Player tries to call selectWinner() function
Action: A player tries to call the selectWinner() function
Expected result: The contract reverts with the correct error message.

*These system tests can be written in a testing framework like Mocha and run on a test network like Rinkeby or Kovan to ensure that the contract functions as expected in a real-world scenario.
