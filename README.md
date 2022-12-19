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

At top of the file import `useHashup` hook from our sdk.

```js
import { useHashup } from "@hashup-it/hashup-react-sdk"
```

Now declare it in your component 

```js
function App() {

  const { buyGame } = useHashup()


  return (
    <div className="App">
        //Your app code
    </div>
  );
}
```

`buyGame()` function accepts two arguments 
- ERC20 token address of license you want to buy
- how many licenses you want to buy


```js
function App() {

  const { buyGame } = useHashup()


  const licenseAddress = "0x123 ... abc" // Specify address of license you want to buy
  const licenseAmount = 2 // Specify amount of licenses you want to buy

  function handleLicenseBuy() { 
      buyGame(licenseAddress, licenseAmount)
  }

  return (
    <div className="App">
       <button onClick={handleLicenseBuy}>Buy 2 copies of game</button>
    </div>
  );
}
```

Clicking on button will now open MetaMask window. If user is not connected it will ask him to connect, then request approve.
After successfull approval it will request license buy transaction. It will take specified amount of USDT from user account and send licenses to his wallet. 

## Where to get license data? 

All games listed on HashUp protocol are available at 
```hashup-api-link``` endpoint of our public API. 

You can check full API specification at ```link-to-api-docs```
