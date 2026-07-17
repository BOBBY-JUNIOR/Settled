// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title BillSplitter
/// @notice Onchain shared-expense bills: create → confirm → settle → permanent receipt.
contract BillSplitter {
    struct Bill {
        address creator;
        string title;
        uint256 totalAmount;
        address[] participants;
        uint256[] shares; // basis points, must sum to 10000
        mapping(address => bool) confirmed;
        mapping(address => bool) isParticipant;
        bool settled;
        bool exists;
    }

    uint256 public nextBillId;
    mapping(uint256 => Bill) private bills;

    event BillCreated(
        uint256 indexed billId,
        address indexed creator,
        string title,
        uint256 totalAmount,
        address[] participants,
        uint256[] shares
    );
    event BillConfirmed(uint256 indexed billId, address indexed participant);
    event BillSettled(uint256 indexed billId, uint256 totalAmount);

    error InvalidTitle();
    error InvalidAmount();
    error InvalidParticipants();
    error SharesMismatch();
    error SharesMustSumTo10000();
    error DuplicateParticipant();
    error ZeroAddress();
    error BillNotFound();
    error AlreadySettled();
    error NotParticipant();
    error AlreadyConfirmed();
    error NotFullyConfirmed();
    error IncorrectPayment();
    error TransferFailed();

    function createBill(
        string calldata title,
        uint256 totalAmount,
        address[] calldata participants,
        uint256[] calldata shares
    ) external returns (uint256 billId) {
        if (bytes(title).length == 0) revert InvalidTitle();
        if (totalAmount == 0) revert InvalidAmount();
        if (participants.length < 2 || participants.length > 5) revert InvalidParticipants();
        if (participants.length != shares.length) revert SharesMismatch();

        uint256 shareSum;
        for (uint256 i = 0; i < participants.length; i++) {
            if (participants[i] == address(0)) revert ZeroAddress();
            if (shares[i] == 0) revert SharesMismatch();
            shareSum += shares[i];
        }
        if (shareSum != 10_000) revert SharesMustSumTo10000();

        billId = nextBillId++;
        Bill storage bill = bills[billId];
        bill.creator = msg.sender;
        bill.title = title;
        bill.totalAmount = totalAmount;
        bill.exists = true;

        for (uint256 i = 0; i < participants.length; i++) {
            address p = participants[i];
            if (bill.isParticipant[p]) revert DuplicateParticipant();
            bill.isParticipant[p] = true;
            bill.participants.push(p);
            bill.shares.push(shares[i]);
        }

        emit BillCreated(billId, msg.sender, title, totalAmount, participants, shares);
    }

    function confirm(uint256 billId) external {
        Bill storage bill = bills[billId];
        if (!bill.exists) revert BillNotFound();
        if (bill.settled) revert AlreadySettled();
        if (!bill.isParticipant[msg.sender]) revert NotParticipant();
        if (bill.confirmed[msg.sender]) revert AlreadyConfirmed();

        bill.confirmed[msg.sender] = true;
        emit BillConfirmed(billId, msg.sender);
    }

    function settle(uint256 billId) external payable {
        Bill storage bill = bills[billId];
        if (!bill.exists) revert BillNotFound();
        if (bill.settled) revert AlreadySettled();
        if (!_isFullyConfirmed(bill)) revert NotFullyConfirmed();
        if (msg.value != bill.totalAmount) revert IncorrectPayment();

        // Mark settled before transfers (checks-effects-interactions).
        bill.settled = true;

        uint256 len = bill.participants.length;
        uint256 remaining = bill.totalAmount;
        for (uint256 i = 0; i < len; i++) {
            // Last participant receives any rounding dust so the contract holds no dust.
            uint256 payout = i == len - 1
                ? remaining
                : (bill.totalAmount * bill.shares[i]) / 10_000;
            if (i != len - 1) {
                remaining -= payout;
            }
            if (payout == 0) continue;
            (bool ok, ) = bill.participants[i].call{value: payout}("");
            if (!ok) revert TransferFailed();
        }

        emit BillSettled(billId, bill.totalAmount);
    }

    function getBill(uint256 billId)
        external
        view
        returns (
            address creator,
            string memory title,
            uint256 totalAmount,
            address[] memory participants,
            uint256[] memory shares,
            bool settled
        )
    {
        Bill storage bill = bills[billId];
        if (!bill.exists) revert BillNotFound();
        return (
            bill.creator,
            bill.title,
            bill.totalAmount,
            bill.participants,
            bill.shares,
            bill.settled
        );
    }

    function isFullyConfirmed(uint256 billId) external view returns (bool) {
        Bill storage bill = bills[billId];
        if (!bill.exists) revert BillNotFound();
        return _isFullyConfirmed(bill);
    }

    function isConfirmed(uint256 billId, address participant) external view returns (bool) {
        Bill storage bill = bills[billId];
        if (!bill.exists) revert BillNotFound();
        return bill.confirmed[participant];
    }

    function isParticipant(uint256 billId, address account) external view returns (bool) {
        Bill storage bill = bills[billId];
        if (!bill.exists) revert BillNotFound();
        return bill.isParticipant[account];
    }

    function _isFullyConfirmed(Bill storage bill) internal view returns (bool) {
        uint256 len = bill.participants.length;
        for (uint256 i = 0; i < len; i++) {
            if (!bill.confirmed[bill.participants[i]]) return false;
        }
        return true;
    }
}
