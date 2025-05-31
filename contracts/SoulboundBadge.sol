// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract SoulboundBadge is ERC721, Ownable {
    using Strings for uint256;

    string  private _baseTokenURI;
    uint256 private _nextTokenId = 1;

    // ---------- новинка: храним список токенов для каждого владельца ----------
    mapping(address => uint256[]) private _ownedTokens;

    mapping(address => bool) public trustedContract;

    constructor(string memory baseURI, address admin)
    ERC721("Soulbound Donation Badge", "SDB")
    Ownable(admin)
    { _baseTokenURI = baseURI; }

    modifier onlyTrusted() {
        require(trustedContract[msg.sender], "Not trusted");
        _;
    }

    function mint(address to,uint256 /*tier*/,uint256 /*amount*/)
    external
    onlyTrusted
    returns (uint256 tid)
    { tid = _safeMintInternal(to); }

    function safeMint(address to) external onlyTrusted returns (uint256) {
        return _safeMintInternal(to);
    }

    function _safeMintInternal(address to) private returns (uint256 tid) {
        tid = _nextTokenId;
        _safeMint(to, tid);
        _nextTokenId += 1;
    }

    /* ---------------------- soul-bound + учёт токенов ---------------------- */
    function _update(address to,uint256 tokenId,address auth)
    internal override returns (address from)
    {
        // Soul-bound check ДО изменения состояния
        if (to != address(0) && auth != address(0)) revert("Soulbound: non-transferable");
        from = super._update(to, tokenId, auth);

        // Обновляем _ownedTokens для from и to адресов
        if (from != address(0)) {
            // Удаляем tokenId из списка токенов отправителя
            uint256[] storage fromTokens = _ownedTokens[from];
            for (uint256 i = 0; i < fromTokens.length; i++) {
                if (fromTokens[i] == tokenId) {
                    // Заменяем найденный токен последним элементом и удаляем последний
                    fromTokens[i] = fromTokens[fromTokens.length - 1];
                    fromTokens.pop();
                    break;
                }
            }
        }

        if (to != address(0)) {
            // Добавляем tokenId в список токенов получателя
            _ownedTokens[to].push(tokenId);
        }
    }

    /* ----------------------- публичные геттеры ---------------------------- */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        return _ownedTokens[owner];
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    function tokenURI(uint256 id) public view override returns (string memory) {
        _requireOwned(id);
        return string.concat(_baseURI(), Strings.toString(id), ".json");
    }
    /* ---------- trusted contracts mgmt ---------- */
    function setTrusted(address addr, bool status) external onlyOwner {
        trustedContract[addr] = status;
        emit TrustedUpdated(addr, status);
    }
    event TrustedUpdated(address indexed addr, bool status);
}
