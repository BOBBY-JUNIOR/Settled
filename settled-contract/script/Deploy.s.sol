// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {BillSplitter} from "../src/BillSplitter.sol";

contract Deploy is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        BillSplitter splitter = new BillSplitter();
        console2.log("BillSplitter deployed at:", address(splitter));

        vm.stopBroadcast();
    }
}
