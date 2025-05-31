// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./SoulboundBadge.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title  DonationContract
 * @notice Принимает пожертвования в ETH, считает их суммарно для каждого
 *         пользователя, выдаёт/апгрейдит soul-bound бейджи и даёт владельцу
 *         контракта вывести собранные средства.
 */
contract DonationContract is Ownable, ReentrancyGuard {
    /* ──────────────────────── Storage ───────────────────────── */

    /// @dev сумма всех донатов пользователя (wei)
    mapping(address => uint256) public totalDonated;

    /// @dev текущий уровень бейджа пользователя (0 – нет)
    mapping(address => uint8) public ownerToBadge;

    /// @dev soul-bound коллекция
    SoulboundBadge public immutable badge;

    /// @dev адрес, на который выводятся средства (можно поменять)
    address public treasury;

    /// @dev массив порогов в wei (монотонно возрастающий):
    ///      thresholds[0] → Bronze, thresholds[1] → Silver …
    uint256[] public thresholds; // хранится в storage, чтобы читать on-chain

    /* ─────────────────────── Events ─────────────────────────── */
    event Donated(
        address indexed donor,
        uint256 amount,
        uint256 total,
        uint8    newTier
    );

    event TreasuryChanged(address indexed oldTreasury, address indexed newTreasury);
    event Withdrawn(address indexed to, uint256 amount);

    /* ───────────────────── Constructor ──────────────────────── */
    constructor(
        address        _badge,
        address        _treasury,
        uint256[] memory _thresholds
    ) Ownable(msg.sender) {
        require(_badge != address(0) && _treasury != address(0), "zero address");
        require(_thresholds.length > 0, "empty thresholds");

        // проверяем строгий монотонный рост
        for (uint256 i = 1; i < _thresholds.length; ++i) {
            require(_thresholds[i] > _thresholds[i - 1], "thresholds not ascending");
        }

        badge      = SoulboundBadge(_badge);
        treasury   = _treasury;
        thresholds = _thresholds;
    }

    /* ─────────────────────── Public API ─────────────────────── */

    /**
     * @notice Пожертвовать любую сумму. Бейдж апгрейдится,
     *         когда суммарный донат переходит следующий порог.
     */
    function donate() external payable nonReentrant {
        require(msg.value > 0, "zero value");
        totalDonated[msg.sender] += msg.value;

        // вычисляем новый уровень из суммарного доната
        uint8 newTier = _tierFor(totalDonated[msg.sender]);
        uint8 currentTier = ownerToBadge[msg.sender];

        // минтим бейдж, если уровень увеличился
        if (newTier > currentTier) {
            // SoulboundBadge::mint(address to, uint8 id, uint256 amount)
            badge.mint(msg.sender, newTier, 1);
            ownerToBadge[msg.sender] = newTier;
        }

        emit Donated(msg.sender, msg.value, totalDonated[msg.sender], newTier);
        // ETH остаётся на контракте до вызова withdraw()
    }

    /**
     * @notice Выводит весь баланс контракта на указанный адрес treasury.
     *         Только владелец.
     */
    function withdraw() external onlyOwner nonReentrant {
        uint256 amount = address(this).balance;
        require(amount > 0, "nothing to withdraw");

        (bool ok, ) = treasury.call{value: amount}("");
        require(ok, "transfer failed");

        emit Withdrawn(treasury, amount);
    }

    /**
     * @notice Позволяет владельцу поменять treasury-адрес.
     */
    function setTreasury(address newTreasury) external onlyOwner {
        require(newTreasury != address(0), "zero address");
        emit TreasuryChanged(treasury, newTreasury);
        treasury = newTreasury;
    }

    /* ──────────────────── View helpers ──────────────────────── */

    /**
     * @dev Возвращает ID бейджа (1…N) для данной суммы или 0,
     *      если сумма ниже минимального порога.
     */
    function _tierFor(uint256 amount) internal view returns (uint8) {
        // проходим массив с конца, чтобы первым найти максимальный подходящий порог
        for (uint256 i = thresholds.length; i > 0; --i) {
            if (amount >= thresholds[i - 1]) {
                return uint8(i); // ID начинается с 1
            }
        }
        return 0;
    }

    /**
     * @notice Публичная вью-функция: какой ID бейджа получит адрес,
     *         если задонатит ещё `additional` wei.
     */
    function previewTier(address donor, uint256 additional) external view returns (uint8) {
        return _tierFor(totalDonated[donor] + additional);
    }

    /* ──────────────────── Fallback safety ───────────────────── */
    receive() external payable {
        // 0 wei → это dry-run (eth_call) или обычный getBalance
        if (msg.value == 0) return;
        this.donate{value: msg.value}();
    }

    fallback() external payable {
        if (msg.value == 0) return;
        this.donate{value: msg.value}();
    }
}