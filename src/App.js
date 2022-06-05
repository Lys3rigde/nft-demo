import './App.css';
import {useState, useEffect} from "react";
import {BigNumber, ethers} from 'ethers'
import NFTDemo from './NFTDemo.json'

function App() {
  const [isConnected, setIsConnected] = useState(false); // wallet connection state
  const [accountAddress, setAccountAddress] = useState(''); //metamask account address
  const [haveMetamask, setHaveMetamask] = useState(true); //check for installed metamask plug-in
  const [accountBalance, setAccountBalance] = useState(''); // metamask account balance
  const [mintAmount, setMintAmount] = useState(1);
  const [mintPrice, setMintPrice] = useState(0) // state for mintPrice
  const { ethereum } = window; // metamask plugin adds ethereum object into global window object
  const provider = new ethers.providers.Web3Provider(ethereum);
  const NFTDemoAddress = '0xb243cd875A479694AfB52433FEA7fCCd7257E45b'; //address of our deployed smart contract


  useEffect(() => {
    const checkMetamaskAvailability = async () => {
      if (!ethereum) {
        setHaveMetamask(false);
      }
      setHaveMetamask(true);
    };
    checkMetamaskAvailability();
  }, []); //useEffect for checking availability metamask plug-in and changing state


  const connectWallet = async () => {
    try {
      if (!ethereum) {
        setHaveMetamask(false);
      } // when metamsk plug-in is not installed window.etherium will be equals undefined
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      }); //request for getting metamask accounts
      let balance = await provider.getBalance(accounts[0]);
      let bal = ethers.utils.formatEther(balance); //balance formatter from BigNumber to number?
      setAccountBalance(bal);
      setAccountAddress(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
    }
  };

  const handleMint = async () => {
    if (ethereum) {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        NFTDemoAddress,
        NFTDemo.abi,
        signer
      );
      try {
        const response = await contract.mint(BigNumber.from(mintAmount), {
          value: ethers.utils.parseEther((0.001 * mintAmount).toString()),
          gasLimit: 500000,
        });
        console.log('response', response);
      } catch(err) {
       console.log(err);
      }
    }
  }

  const handleGetMintPrice = async () => {
    if (ethereum) {
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        NFTDemoAddress,
        NFTDemo.abi,
        signer
      );
      try {
        const response = await contract.getMintPrice();
        console.log('response', response);
        setMintPrice(ethers.utils.formatEther(response._hex)); //price formatter from BigNumber heximal value to decimal number
        // setMintPrice()
      } catch(err) {
        console.log(err);
      }
    }
  }

  const handleDecrement = () => {
    if(mintAmount <= 1) return
    setMintAmount(mintAmount - 1)
  }

  const handleIncrement = () => {
    if(mintAmount >= 3) return
    setMintAmount(mintAmount + 1)
  }

  return (
    <div className="App-header">
      <header>
        <span>address: {accountAddress.slice(0, 4)}...{accountAddress.slice(38, 42)}</span><span>balance: {accountBalance}</span>
        <button onClick={connectWallet} disabled={isConnected}>connect to metamask</button>
      </header>
      <main>
        {isConnected ? (
          <>
            <div>
              <button onClick={handleDecrement}>-</button>
              <input type="number" value={mintAmount}/>
              <button onClick={handleIncrement}>+</button>
            </div>
          <button onClick={handleMint}>Mint</button>
            </>
        ) : <span>connect your wallet</span>}

        <div>
          <button onClick={handleGetMintPrice}>get mint price</button>
          <span>{mintPrice === 0 ? "use button" : mintPrice}</span>
        </div>
      </main>
    </div>
  );
}

export default App;





