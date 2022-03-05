import { useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { injected, requestChangeNetwork } from './connector';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { claimAirdrop, getAirdropAmount, getContract, getMerkleTree } from './utils/merkle';

function App() {
  const { account, activate, deactivate, active } = useWeb3React();

  const [numTokens, setNumTokens] = useState(0);
  const [symbol, setSymbol] = useState('');
  const [decimals, setDecimals] = useState(9);
  const [claimStatus, setClaimStatus] = useState(false);

  useEffect(() => {
    const getData = async () => {
      const tokens = await getAirdropAmount(account);
      setNumTokens(tokens);
      const tokenContract = getContract();
      const token_symbol = await tokenContract.methods.symbol().call();
      const token_decimals = await tokenContract.methods.decimals().call()
      const claimable = await tokenContract.methods.getClaimedStatus().call({ from: account });

      setClaimStatus(claimable)
      setSymbol(token_symbol)
      setDecimals(token_decimals)
    }
    if (account) {
      getData();
    }
  }, [account])

  const connectWallet = async () => {
    try {
      await activate(injected);
    } catch (err) {
      if (window.ethereum === undefined) {
        alert("Please install Metamask");
        return;
      }
      requestChangeNetwork('0x61')
    }
  }

  const disconnect = () => {
    try {
      deactivate();
    } catch (err) {
      console.log(err)
    }
  }

  const onClaim = async () => {
    try {
      claimAirdrop(account)
      const tokenContract = getContract();
      setClaimStatus(true)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="App">
      <div className='claim-box p-4'>
        <h3 className='text-center mb-4'>Merkle Tree</h3>
        <p className='d-flex justify-content-between aligm-items-center'>
          <span>Address: </span>
          <span>{active ? account : 'Not Connected'}</span>
        </p>
        <p className='d-flex justify-content-between aligm-items-center'>
          <span>Claimable Balance: </span>
          <span>
            {active ? claimStatus ? 'Already Claimed' : `${numTokens / Math.pow(10, decimals)} ${symbol}` : 0}
          </span>
        </p>
        {
          active ? (
            <>
              {
                claimStatus ? (
                  <button className='btn btn-success w-100 my-2' disabled>Claim</button>
                ) : (
                  <button className='btn btn-success w-100 my-2' onClick={onClaim}>Claim</button>
                )
              }
              <button className='btn btn-danger w-100 mt-2' onClick={disconnect}>Disconnect</button>
            </>
          ) : (
            <button className='btn btn-primary w-100 mt-2' onClick={connectWallet}>Connect Wallet</button>
          )
        }
      </div>
      <ToastContainer theme="dark" />
    </div>
  );
}

export default App;
