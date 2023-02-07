# HashUp SDK for React

This is official HashUp protocol SDK for React. You can use it to make your own marketplace using our protocol.

## Installation

```bash
# Using NPM  
npm install @hashup-it/hashup-react-sdk

# Using Yarn  
yarn add @hashup-it/hashup-react-sdk
```

## Usage

At top of the file import `useHashup` hook from our SDK.

```js  
import { useHashup } from "@hashup-it/hashup-react-sdk"  
```  

Now declare it in your component

```js  
function App() {

	const { buyGame } = useHashup()

	return (<div className="App">/*Your app code*/</div>)
}  
```  

---

### `setMarketplace()` function

accepts a single argument:

- address of your own marketplace

```js  
...
const { setMarketplace } = useHashup()

function handleSetMarketplace() {
	const marketplace = "0x714EF5c429ce9bDD0cAC3631D30474bd04e954Dc"; // Overwrite the default HashUp marketplace with yours

	setMarketplace(marketplace)
}

...
```  

Sets up your marketplace address.

---

### `buyGame()` function

accepts two arguments:

- ERC20 token address of license you want to buy
- [how many licenses you want to buy]
- [game metadata to auto-save the token in user's wallet]

```js  
...
const { buyGame } = useHashup()

function handleBuy() {
	const license = "0x6cbf4648d1f326585f7aa768913991efc0f2b952" // Specify address of license you want to buy
	const amount = "200" // Specify amount of license you want to buy  

	buyGame(license, amount)
}

...
```  

Clicking on button will now open MetaMask window. If user is not connected it will ask him to connect, then request
approve (if needed).  
After successfull approval it will request license buy transaction. It will take specified amount of USDT from user
account and send licenses to his wallet.

---

### `setReferrer()` function

accepts a single argument:

- address of the transaction referrer

```js  
...
const { setReferrer } = useHashup()

function handleSetReferrer() {
	const referrer = "0x486dFb71b0CaB4f16Aa760b868EBaFF17f0a6535"; // Set a 

	setReferrer(referrer)
}

...
```  

Sets up an address of someone referring a purchase.

Example use case: A person generates a referral link pointing to your website. Then, some other person after clicking it
purchases a game, automatically triggering a referral action (handled by our protocol) along with the transaction.

---

### `approve()` function

```js  
...
const { approve } = useHashup()

function handleApprove() {
	approve()
}

...
```  

Triggers manual payment token approval.
Example use case:
![](https://i.ibb.co/Xpg9cZ4/Screenshot-2023-01-25-at-1-31-06-AM.png)

## Hook Interface

```typescript  
interface UseHashupOutput {
    /**
     * Allows for ahead-of-time payment approval. Called automatically by `buyGame()`.
     */
    approve: () => Promise<void>

    /**
     * Purchases a license. Defaults to one token bought, i.e. 100 units.
     * @param address address of ERC20 licence about to be bought
     * @param amount amount of token units bought (unit is 0.01 of a token)
     */
    buyGame: (address: string, amount?: string) => Promise<string | void>

    /**
     * HashUp-protocol lifecycle state. Affected by `buyGame()` method call.
     * @default BuyStage.NOT_STARTED
     */
    buyingStage: BuyStage

    /**
     * HashUp-protocol wallet connection init status
     */
    isEthereumLoading: boolean

    /**
     * HashUp-protocol network compatibility status
     */
    isNetworkValid: boolean

    /**
     * Sets a custom marketplace. Defaults to HashUp.
     * @param marketplace marketplace's blockchain address
     */
    setMarketplace: React.Dispatch<React.SetStateAction<string>>

    /**
     * Sets a reflink variable. Affects `buyGame()` method call.
     * @param referrer purchase referrer's blockchain address
     */
    setReferrer: React.Dispatch<React.SetStateAction<string>>
}
```

## Class Diagram

![hashup-react-sdk UML](https://i.ibb.co/nrwx3zy/src.png)

## Building

1. `yarn install`
2. revision bump
3. `yarn build`
4. `npm publish --access public`

## Where to get license data?

All games listed on HashUp protocol are available at https://open-api.hashup.it/v1/tokens endpoint of our public API.

For example:

- `https://open-api.hashup.it/v1/tokens/<chain|chainId>` – to get all polygon tokens
  example: https://open-api.hashup.it/v1/tokens/137/
- `https://open-api.hashup.it/v1/token/<chain|chainId>/<address>` – to get a specific token
  example: https://open-api.hashup.it/v1/token/137/0x6cbf4648d1f326585f7aa768913991efc0f2b952

You can check full API specification at [wiki.hashup.it](https://wiki.hashup.it/get-started/the-hashup-api).
