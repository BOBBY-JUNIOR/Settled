// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {BillSplitter} from "../src/BillSplitter.sol";

contract BillSplitterTest is Test {
    BillSplitter internal splitter;

    address internal alice = makeAddr("alice");
    address internal bob = makeAddr("bob");
    address internal charlie = makeAddr("charlie");
    address internal outsider = makeAddr("outsider");

    function setUp() public {
        splitter = new BillSplitter();
        vm.deal(alice, 100 ether);
        vm.deal(bob, 100 ether);
        vm.deal(charlie, 100 ether);
        vm.deal(outsider, 100 ether);
    }

    function _createTwoPartyBill(uint256 amount) internal returns (uint256 billId) {
        address[] memory participants = new address[](2);
        participants[0] = alice;
        participants[1] = bob;
        uint256[] memory shares = new uint256[](2);
        shares[0] = 5000;
        shares[1] = 5000;

        vm.prank(alice);
        billId = splitter.createBill("March rent", amount, participants, shares);
    }

    function test_happyPath_createConfirmSettle() public {
        uint256 amount = 12 ether;
        uint256 billId = _createTwoPartyBill(amount);

        uint256 aliceBefore = alice.balance;
        uint256 bobBefore = bob.balance;

        vm.prank(alice);
        splitter.confirm(billId);
        vm.prank(bob);
        splitter.confirm(billId);

        assertTrue(splitter.isFullyConfirmed(billId));

        vm.prank(alice);
        splitter.settle{value: amount}(billId);

        (,,,,, bool settled) = splitter.getBill(billId);
        assertTrue(settled);

        // Alice paid 12 ether, received 6 back → net -6
        assertEq(alice.balance, aliceBefore - amount + 6 ether);
        assertEq(bob.balance, bobBefore + 6 ether);
    }

    function test_revert_wrongParticipantConfirms() public {
        uint256 billId = _createTwoPartyBill(1 ether);

        vm.prank(outsider);
        vm.expectRevert(BillSplitter.NotParticipant.selector);
        splitter.confirm(billId);
    }

    function test_revert_settleBeforeAllConfirmed() public {
        uint256 billId = _createTwoPartyBill(1 ether);

        vm.prank(alice);
        splitter.confirm(billId);

        vm.prank(alice);
        vm.expectRevert(BillSplitter.NotFullyConfirmed.selector);
        splitter.settle{value: 1 ether}(billId);
    }

    function test_revert_incorrectMsgValue() public {
        uint256 billId = _createTwoPartyBill(2 ether);

        vm.prank(alice);
        splitter.confirm(billId);
        vm.prank(bob);
        splitter.confirm(billId);

        vm.prank(alice);
        vm.expectRevert(BillSplitter.IncorrectPayment.selector);
        splitter.settle{value: 1 ether}(billId);
    }

    function test_revert_sharesDoNotSumTo10000() public {
        address[] memory participants = new address[](2);
        participants[0] = alice;
        participants[1] = bob;
        uint256[] memory shares = new uint256[](2);
        shares[0] = 6000;
        shares[1] = 3000;

        vm.prank(alice);
        vm.expectRevert(BillSplitter.SharesMustSumTo10000.selector);
        splitter.createBill("Bad shares", 1 ether, participants, shares);
    }

    function test_revert_settleTwice() public {
        uint256 amount = 1 ether;
        uint256 billId = _createTwoPartyBill(amount);

        vm.prank(alice);
        splitter.confirm(billId);
        vm.prank(bob);
        splitter.confirm(billId);

        vm.prank(alice);
        splitter.settle{value: amount}(billId);

        vm.prank(bob);
        vm.expectRevert(BillSplitter.AlreadySettled.selector);
        splitter.settle{value: amount}(billId);
    }

    function test_unevenSplit() public {
        address[] memory participants = new address[](2);
        participants[0] = alice;
        participants[1] = bob;
        uint256[] memory shares = new uint256[](2);
        shares[0] = 7000;
        shares[1] = 3000;

        uint256 amount = 10 ether;
        vm.prank(alice);
        uint256 billId = splitter.createBill("Utilities", amount, participants, shares);

        vm.prank(alice);
        splitter.confirm(billId);
        vm.prank(bob);
        splitter.confirm(billId);

        uint256 bobBefore = bob.balance;
        vm.prank(charlie);
        splitter.settle{value: amount}(billId);

        assertEq(bob.balance, bobBefore + 3 ether);
    }

    function test_isConfirmed() public {
        uint256 billId = _createTwoPartyBill(1 ether);
        assertFalse(splitter.isConfirmed(billId, alice));
        vm.prank(alice);
        splitter.confirm(billId);
        assertTrue(splitter.isConfirmed(billId, alice));
        assertFalse(splitter.isConfirmed(billId, bob));
    }

    function test_settle_distributesRoundingDustToLast() public {
        address[] memory participants = new address[](3);
        participants[0] = alice;
        participants[1] = bob;
        participants[2] = charlie;
        uint256[] memory shares = new uint256[](3);
        shares[0] = 3333;
        shares[1] = 3333;
        shares[2] = 3334;

        // Amount that does not divide evenly by share math for first two.
        uint256 amount = 100;
        vm.prank(alice);
        uint256 billId = splitter.createBill("Dust", amount, participants, shares);

        vm.prank(alice);
        splitter.confirm(billId);
        vm.prank(bob);
        splitter.confirm(billId);
        vm.prank(charlie);
        splitter.confirm(billId);

        uint256 aliceBefore = alice.balance;
        uint256 bobBefore = bob.balance;
        uint256 charlieBefore = charlie.balance;

        vm.prank(outsider);
        splitter.settle{value: amount}(billId);

        uint256 aliceGot = alice.balance - aliceBefore;
        uint256 bobGot = bob.balance - bobBefore;
        uint256 charlieGot = charlie.balance - charlieBefore;

        assertEq(aliceGot + bobGot + charlieGot, amount);
        assertEq(address(splitter).balance, 0);
        assertEq(aliceGot, (amount * 3333) / 10_000);
        assertEq(bobGot, (amount * 3333) / 10_000);
        assertEq(charlieGot, amount - aliceGot - bobGot);
    }

    function test_revert_emptyTitle() public {
        address[] memory participants = new address[](2);
        participants[0] = alice;
        participants[1] = bob;
        uint256[] memory shares = new uint256[](2);
        shares[0] = 5000;
        shares[1] = 5000;

        vm.prank(alice);
        vm.expectRevert(BillSplitter.InvalidTitle.selector);
        splitter.createBill("", 1 ether, participants, shares);
    }

    function test_revert_duplicateParticipant() public {
        address[] memory participants = new address[](2);
        participants[0] = alice;
        participants[1] = alice;
        uint256[] memory shares = new uint256[](2);
        shares[0] = 5000;
        shares[1] = 5000;

        vm.prank(alice);
        vm.expectRevert(BillSplitter.DuplicateParticipant.selector);
        splitter.createBill("Dup", 1 ether, participants, shares);
    }
}
