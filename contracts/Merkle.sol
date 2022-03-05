// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract MerkleContract is ERC20 {
    using SafeMath for uint256;

    bytes32 public immutable merkleRoot;

    uint8 private _decimals = 9;
    uint256 private _totalSupply = 1000 * 10**6 * 10**9;

    mapping(address => bool) public claimed;

    constructor(
        string memory _name,
        string memory _symbol,
        bytes32 _merkleRoot
    ) ERC20(_name, _symbol) {
        merkleRoot = _merkleRoot; // Update root
    }

    event Claim(address indexed to, uint256 amount);

    function claim(
        address to,
        uint256 amount,
        bytes32[] calldata proof
    ) external {
        require(!claimed[to], "Already claimed");

        bytes32 leaf = keccak256(abi.encodePacked(to, amount));
        bool isValidLeaf = MerkleProof.verify(proof, merkleRoot, leaf);

        require(isValidLeaf, "Not permission for this address");

        claimed[to] = true;

        _mint(to, amount.div(10**9));

        emit Claim(to, amount.div(10**9));
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }

    function getClaimedStatus() public view returns (bool) {
        return claimed[msg.sender];
    }
}
