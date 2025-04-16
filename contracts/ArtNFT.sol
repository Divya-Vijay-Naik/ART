// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract ArtNFT is ERC721URIStorage {
    uint256 private _tokenIdCounter;

    event Minted(address indexed to, uint256 indexed tokenId);

    constructor() ERC721("ArtNFT", "ART") {}

    function mintNFT(address to, string memory uri) public returns (uint256) {
        require(to != address(0), "Cannot mint to zero address");
        require(bytes(uri).length > 0, "Token URI is empty");

        uint256 newItemId = _tokenIdCounter;
        _safeMint(to, newItemId);
        _setTokenURI(newItemId, uri);
        _tokenIdCounter++;

        emit Minted(to, newItemId);
        return newItemId;
    }
}
