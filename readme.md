# Variable, Library & Common function
- ```const Web3 = require('web3')```;
- ```const web3Client = new Web3(deployer.provider)```;
- Unlock Account: ```web3Client.personal.unlockAccount(account, passphrase, duration);```
- ``` let crowdsale =  new web3.eth.Contract(jsonInterfaceCrowdsale[, address][, options])```
- Owner account on geth: ``` const ownerAddress = "0xa103879943d8db38f2048bd21c51f9c84950c087"```
- Account Wallet: ```const multisigAddress = "0x000660F5DA9c38AE146c53DD8DD2C7DaCE1a315A"```

# Releasing a token
One way function to release the tokens to the wild.
Can be called only from the release agent that is the final ICO contract. It is only called if the crowdsale has been success (first milestone reached).
```javascript
let token =  new web3.eth.Contract(jsonInterfaceCrowdsaleToken [, address][, options]);
let contractAddress = token.address  // 0x539F46FC65a827ABaE4Ae654D330F30219B7B2Cb
let txId = await token.releaseTokenTransfer({"from": ownerAddress})
```
# Transfering tokens
The address where we are transfering tokens into:
```let buddyAddress = "0x47FcAB60823D13B73F372b689faA9D3e8b0C48b5"```
How many tokens we transfer: ```amount = 1000```
```javascript
await contract.transfer(buddyAddress, amount, {"from": ownerAddress})
```
# Setup the ICO contract for a presale

```javascript
let preSale =  new web3.eth.Contract(jsonInterfacePresaleFundCollector [, address][, options]);
let txId = await preSale.transact.setCrowdsale(address) // address is crowdsale.address

```

# Change pricing strategy
```javascript
// Allow to (re)set pricing strategy.
txId = await crowdsale.setPricingStrategy("0x", {"from": ownerAddress})
```
# Buy token
```Javascript
let txId = await crowdsale.buy({"from": account, "value": to_wei(2, "ether")})
```
# Resetting token sale end time
```Javascript
function getUnixTime(x) {
return moment.tz(x, "America/Los_Angeles").valueOf() / 1000;
}
let txId = await crowdsale.setEndsAt(getUnixTime("2018-01-11T00:00:00"),{"from": account})
```

# Reset token name and symbol
```Javascript
let txId = await token.setTokenInformation("New Name", "New Symbol", {"from": ownerAddress})
```
# Reset upgrade master
```Javascript
let txId = await token.setUpgradeMaster(teamMultisig, {"from": ownerAddress})
```
# Finalizing a crowdsale

```Javascript
let BonusFinalizeAgent = await new web3.eth.Contract(jsonInterfaceBonusFinalizeAgent [, address][, options]);
let finalizeAgent = await BonusFinalizeAgent(await crowdsale.finalizeAgent());
// Safety check that Crodsale is using our pricing strategy
let txId = crowdsale.finalize({"from": ownerAddress})
```
