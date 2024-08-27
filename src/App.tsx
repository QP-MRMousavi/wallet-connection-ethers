import React, { useState } from "react";

import { ethers, verifyMessage, toBeHex } from "ethers";

import logo from "./logo.svg";
import "./App.css";
import { isWhiteSpaceLike } from "typescript";
declare global {
  interface Window {
    ethereum?: any;
  }
}
/*
 * for interaction with smart contracts using ethers.js
 * https://docs.ethers.org/v6/single-page/#getting-started__starting-contracts
 */
const App = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedNetwork, setSelectedNetwork] = useState("polygon");
  const [hash, setHash] = useState("");
  const [vHash, setVHash] = useState("");
  const abi = [
    {
      inputs: [
        { internalType: "string", name: "contractName", type: "string" },
        { internalType: "string", name: "contractSymbol", type: "string" },
        { internalType: "string", name: "nftUri", type: "string" },
      ],
      stateMutability: "nonpayable",
      type: "constructor",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: false,
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      name: "ApprovalForAll",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "previousOwner",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "newOwner",
          type: "address",
        },
      ],
      name: "OwnershipTransferred",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        { indexed: true, internalType: "address", name: "to", type: "address" },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "ids",
          type: "uint256[]",
        },
        {
          indexed: false,
          internalType: "uint256[]",
          name: "values",
          type: "uint256[]",
        },
      ],
      name: "TransferBatch",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: true,
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          indexed: true,
          internalType: "address",
          name: "from",
          type: "address",
        },
        { indexed: true, internalType: "address", name: "to", type: "address" },
        {
          indexed: false,
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          indexed: false,
          internalType: "uint256",
          name: "value",
          type: "uint256",
        },
      ],
      name: "TransferSingle",
      type: "event",
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: "string",
          name: "value",
          type: "string",
        },
        { indexed: true, internalType: "uint256", name: "id", type: "uint256" },
      ],
      name: "URI",
      type: "event",
    },
    {
      inputs: [
        { internalType: "address", name: "account", type: "address" },
        { internalType: "uint256", name: "id", type: "uint256" },
      ],
      name: "balanceOf",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address[]", name: "accounts", type: "address[]" },
        { internalType: "uint256[]", name: "ids", type: "uint256[]" },
      ],
      name: "balanceOfBatch",
      outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "account", type: "address" },
        { internalType: "uint256[]", name: "ids", type: "uint256[]" },
      ],
      name: "batchBalanceOfAccount",
      outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "account", type: "address" },
        { internalType: "uint256", name: "id", type: "uint256" },
        { internalType: "uint256", name: "value", type: "uint256" },
      ],
      name: "burn",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "account", type: "address" },
        { internalType: "uint256[]", name: "ids", type: "uint256[]" },
        { internalType: "uint256[]", name: "values", type: "uint256[]" },
      ],
      name: "burnBatch",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "string", name: "contractName", type: "string" },
      ],
      name: "changeName",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "string", name: "contractSymbol", type: "string" },
      ],
      name: "changeSymbol",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "account", type: "address" },
        { internalType: "address", name: "operator", type: "address" },
      ],
      name: "isApprovedForAll",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "lastUriId",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "account", type: "address" },
        { internalType: "uint256", name: "id", type: "uint256" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "mint",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256[]", name: "ids", type: "uint256[]" },
        { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
      ],
      name: "mintBatch",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "name",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "owner",
      outputs: [{ internalType: "address", name: "", type: "address" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "renounceOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256[]", name: "ids", type: "uint256[]" },
        { internalType: "uint256[]", name: "amounts", type: "uint256[]" },
        { internalType: "bytes", name: "data", type: "bytes" },
      ],
      name: "safeBatchTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "from", type: "address" },
        { internalType: "address", name: "to", type: "address" },
        { internalType: "uint256", name: "id", type: "uint256" },
        { internalType: "uint256", name: "amount", type: "uint256" },
        { internalType: "bytes", name: "data", type: "bytes" },
      ],
      name: "safeTransferFrom",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [
        { internalType: "address", name: "operator", type: "address" },
        { internalType: "bool", name: "approved", type: "bool" },
      ],
      name: "setApprovalForAll",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "string", name: "newURI", type: "string" }],
      name: "setURI",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "bytes4", name: "interfaceId", type: "bytes4" }],
      name: "supportsInterface",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "symbol",
      outputs: [{ internalType: "string", name: "", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "tokenId", type: "uint256" }],
      name: "totalSupply",
      outputs: [
        { internalType: "uint256", name: "tokenTotalSupply", type: "uint256" },
      ],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [{ internalType: "uint256", name: "id", type: "uint256" }],
      name: "uri",
      outputs: [{ internalType: "string", name: "tokenURI", type: "string" }],
      stateMutability: "view",
      type: "function",
    },
  ];

  async function changeNetwork(): Promise<void> {
    const networkMap: Record<string, object> = {};
    networkMap["polygon"] = {
      chainId: toBeHex(137).toString(),
      rpcUrls: ["https://polygon-rpc.com"],
      chainName: "Polygon Mainnet",
      nativeCurrency: {
        name: "MATIC",
        symbol: "MATIC",
        decimals: 18,
      },
      blockExplorerUrls: ["https://polygonscan.com/"],
    };
    networkMap["ethereum"] = {
      chainId: "0x1",
      rpcUrls: ["https://eth.llamarpc.com"],
      chainName: "Ethereum Mainnet",
      nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
      },
      blockExplorerUrls: ["https://etherscan.io/"],
    };

    //request for changing network
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [networkMap[selectedNetwork]],
    });
  }
  async function requestAccount() {
    console.log("Requesting account...");

    // ❌ Check if Meta Mask Extension exists
    if (window.ethereum) {
      console.log("detected");

      try {
        // it uses injected provider instead of
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setWalletAddress(accounts[0]);
        await changeNetwork();
      } catch (error) {
        console.log("Error connecting...", error);
      }
    } else {
      alert("Meta Mask not detected");
    }
  }
  // Create a provider to interact with a smart contract
  async function connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const message = "HERE is the auth message with auth key";
      // Signing the message
      const signature = await signer.signMessage(message);
      console.log(
        verifyMessage(message, signature),
        " - signature : ",
        signature
      );
      setHash(signature)
      setVHash(verifyMessage(message, signature))
    }
  }

  const selectNetwork = (event: any) => {
    setSelectedNetwork(event.target.value);
  };
  const checkBalance = () => {
    let url = "https://polygon.llamarpc.com";
    let customHttpProvider = new ethers.JsonRpcProvider(url);
    let contractAddress = "0xe8Bd3f0e767E600d72D433f863496E62a57665d4";
    const contract = new ethers.Contract(
      contractAddress,
      abi,
      customHttpProvider
    );
    let walletAddress = "0x76de186cc58f75Bb425E6072C8E3AaFC3948080D";
    let nftId = 3;
    contract.balanceOf(walletAddress, nftId).then((res) => {
      console.log("nft balance is ", res);
    });
  };
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>choose network</p>
        <select onChange={selectNetwork}>
          <option value="polygon">polygon</option>
          <option value="ethereum">ethereum</option>
        </select>
        <br />
        <button onClick={connectWallet}>Connect Wallet</button>
        <br />
        <button onClick={checkBalance}>balance</button>
        <br />
        <h1 className='wS'>Auth hash</h1>
        <h2>{hash}</h2>
        <h1>Auth hash Verification</h1>
        <h2>{vHash}</h2>
      </header>
    </div>
  );
};

export default App;
