// SPDX-License-Identifier: MIT
pragma solidity ^0.4.15;

contract Factory {
    /*
     *  Events
     */
    event ContractInstantiation(address sender, address instantiation);

    /*
     *  Storage
     */
    mapping(address => bool) public isInstantiation;
    mapping(address => address[]) public instantiations;    //이거의 0번째 지갑
    address[] public addrList;

    /*
     * Public functions
     */
    /// @dev Returns number of instantiations by creator.
    /// @param creator Contract creator.
    /// @return Returns number of instantiations by creator.
    function getInstantiationCount(
        address creator
    ) public constant returns (uint) {
        return instantiations[creator].length;
    }

    /*
     * Internal functions
     */
    /// @dev Registers contract in factory registry.
    /// @param instantiation Address of contract instantiation.
    function register(address instantiation) internal {
        isInstantiation[instantiation] = true;
        instantiations[msg.sender].push(instantiation);
        addrList.push(instantiation);
        ContractInstantiation(msg.sender, instantiation);
    }
}
