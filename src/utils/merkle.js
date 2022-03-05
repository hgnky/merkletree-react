import Web3 from "web3";
import { ethers, BigNumber } from "ethers";
import keccak256 from 'keccak256';
import MerkleTree from 'merkletreejs';
import { toast } from 'react-toastify';
import { getCSVData } from "./data";
import { contractAddress } from "../config";
import contractAbi from '../artifacts/contracts/Merkle.sol/MerkleContract.json';

function generateLeaf(address, value) {
    // return keccak256(address, value);
    return Buffer.from(
        ethers.utils
            .solidityKeccak256(["address", "uint256"], [address, value])
            .slice(2),
        "hex"
    );
}

export const getMerkleTree = async () => {
    const airdrop = await getCSVData();

    const merkleTree = new MerkleTree(
        Object.entries(airdrop).map(([address, tokens]) =>
            generateLeaf(
                ethers.utils.getAddress(address),
                ethers.utils.parseUnits(tokens.toString(), 9).toString()
            )
        ),
        keccak256,
        { sortPairs: true }
    );

    return merkleTree;
    // Object.entries(airdrop).map(([address, amount]) => console.log(`${address}, ${amount}`));
    // const leafNodes = Object.entries(airdrop).map(([address, amount]) => keccak256(address, amount));
    // const merkleTree = new MerkleTree(leafNodes, keccak256, { sortPairs: true });
    // console.log("Root Hash: ", merkleTree.getHexRoot())
    // return merkleTree;
}


export const getAirdropAmount = async (address) => {
    try {
        const airdrop = await getCSVData();
        if (address in airdrop) {
            return airdrop[address];
        }
        return 0;
    } catch (err) {
        console.log(err)
    }
}

export const claimAirdrop = async (address) => {
    if (!address) {
        throw new Error("Not Authenticated");
    }
    const airdrop_amount = await getAirdropAmount(address);
    if (Number(airdrop_amount) === 0) {
        toast.error("Your address is not in whitelist");
        return;
    }

    const tokenContract = getContract();
    const formattedAddress = ethers.utils.getAddress(address);
    const amount = ethers.utils.parseUnits(airdrop_amount, 9).toString();

    const leaf = generateLeaf(formattedAddress, amount);
    const merkleTree = await getMerkleTree();
    const proof = merkleTree.getHexProof(leaf);

    try {
        const tx = await tokenContract.methods.claim(formattedAddress, amount, proof)
            .send({ from: address });
        console.log(tx)
        toast.success("Claim success");
    } catch (err) {
        console.log(err)
    }
}

export const getContract = () => {
    const web3 = new Web3(Web3.givenProvider);
    const contract = new web3.eth.Contract(contractAbi.abi, contractAddress);
    return contract;
}