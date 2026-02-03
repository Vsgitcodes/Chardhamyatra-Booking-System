// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
 College demo version
 Ganache + Remix compatible
 No stack overflow
 No init code size issue
*/

contract KedarnathBooking {

    address public owner;
    uint256 public packageCount;

    constructor() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only admin");
        _;
    }

    struct Service {
        string name;
        address provider;
        uint256 price; // wei
        bool completed;
    }

    struct Package {
        string packageName;
        address user;
        uint256 totalPrice;
        bool booked;
        Service[] services;
    }

    // 🔒 PRIVATE mapping (important)
    mapping(uint256 => Package) private packages;

    // provider balances
    mapping(address => uint256) public balances;

    // events
    event PackageAdded(uint256 id, string name, uint256 totalPrice);
    event PackageBooked(uint256 id, address user);
    event ServiceCompleted(uint256 id, uint256 serviceIndex, address provider);
    event ProviderWithdraw(address provider, uint256 amount);

    // ================= ADMIN =================
    function addPackage(
        string memory _name,
        string[] memory _serviceNames,
        address[] memory _providers,
        uint256[] memory _prices
    ) external onlyOwner {

        require(
            _serviceNames.length == _providers.length &&
            _providers.length == _prices.length,
            "Array length mismatch"
        );

        Package storage p = packages[packageCount];
        p.packageName = _name;
        p.booked = false;
        p.totalPrice = 0;

        for (uint i = 0; i < _serviceNames.length; i++) {
            p.services.push(
                Service({
                    name: _serviceNames[i],
                    provider: _providers[i],
                    price: _prices[i],
                    completed: false
                })
            );
            p.totalPrice += _prices[i];
        }

        emit PackageAdded(packageCount, _name, p.totalPrice);
        packageCount++;
    }

    // ================= CUSTOMER =================
    function bookPackage(uint256 _id) external payable {
        Package storage p = packages[_id];
        require(!p.booked, "Already booked");
        require(msg.value == p.totalPrice, "Incorrect amount");

        p.booked = true;
        p.user = msg.sender;

        emit PackageBooked(_id, msg.sender);
    }

    // ================= PROVIDER =================
    function markServiceComplete(uint256 _id, uint256 _index) external {
        Package storage p = packages[_id];
        require(p.booked, "Not booked");

        Service storage s = p.services[_index];
        require(msg.sender == s.provider, "Not provider");
        require(!s.completed, "Already completed");

        s.completed = true;
        balances[msg.sender] += s.price;

        emit ServiceCompleted(_id, _index, msg.sender);
    }

    function withdrawPayments() external {
        uint256 amount = balances[msg.sender];
        require(amount > 0, "No balance");

        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);

        emit ProviderWithdraw(msg.sender, amount);
    }

    // ================= VIEW FUNCTIONS =================
    function getPackage(uint256 _id)
        external
        view
        returns (string memory, uint256, bool, address)
    {
        Package storage p = packages[_id];
        return (p.packageName, p.totalPrice, p.booked, p.user);
    }

    function getServiceCount(uint256 _id) external view returns (uint256) {
        return packages[_id].services.length;
    }

    function getService(uint256 _id, uint256 _index)
        external
        view
        returns (string memory, address, uint256, bool)
    {
        Service storage s = packages[_id].services[_index];
        return (s.name, s.provider, s.price, s.completed);
    }
}
