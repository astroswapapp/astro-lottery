// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

import "./interfaces/IRandomNumberGenerator.sol";
import "./interfaces/IWagyuSwapLottery.sol";

contract RandomNumberGenerator is IRandomNumberGenerator, Ownable {
    using SafeERC20 for IERC20;

    address public wagyuSwapLottery;
    uint32 public randomResult;
    uint256 public latestLotteryId;
    uint256 public seed;

    mapping(address => bool) public isTruster;

    /**
     * @notice Request randomness from a user-provided seed
     * @param _seed: seed provided by the PancakeSwap lottery
     */
    function getRandomNumber(uint256 _seed) external override {
        seed = _seed;
    }

    function setTruster(address addr, bool trust) external onlyOwner {
        require(addr != address(0), "Invalid");
        isTruster[addr] = trust;
    }

    /**
     * @notice Set the address for the PancakeSwapLottery
     * @param _wagyuSwapLottery: address of the PancakeSwap lottery
     */
    function setLotteryAddress(address _wagyuSwapLottery) external onlyOwner {
        wagyuSwapLottery = _wagyuSwapLottery;
    }

    /**
     * @notice View latestLotteryId
     */
    function viewLatestLotteryId() external view override returns (uint256) {
        return latestLotteryId;
    }

    /**
     * @notice View random result
     */
    function viewRandomResult() external view override returns (uint32) {
        return randomResult;
    }

    /**
     * @notice Callback function used by ChainLink's VRF Coordinator
     */
    function fulfillRandomness(uint256 randomness) external {
        require(isTruster[msg.sender], "Not truster");
        randomResult = uint32(1000000 + (randomness % 1000000));
        latestLotteryId = IWagyuSwapLottery(wagyuSwapLottery).viewCurrentLotteryId();
    }
}
