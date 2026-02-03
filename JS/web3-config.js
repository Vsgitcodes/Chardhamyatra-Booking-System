// ===================================
// WEB3 CONFIGURATION
// ===================================

const CONFIG = {
    // PASTE YOUR CONTRACT ADDRESS HERE
    contractAddress: "0xYOUR_CONTRACT_ADDRESS_HERE",
    
    // Ganache Local Network
    network: {
        chainId: '0x539', // 1337 in hex
        chainName: 'Ganache Local',
        rpcUrls: ['http://127.0.0.1:7545'],
        nativeCurrency: {
            name: 'Ether',
            symbol: 'ETH',
            decimals: 18
        }
    },
    
    // Contract ABI - Replace with your full ABI
    contractABI: [
        {
            "inputs": [],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
        {
            "anonymous": false,
            "inputs": [
                {"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"},
                {"indexed": false, "internalType": "string", "name": "name", "type": "string"},
                {"indexed": false, "internalType": "uint256", "name": "totalPrice", "type": "uint256"}
            ],
            "name": "PackageAdded",
            "type": "event"
        },
        {
            "anonymous": false,
            "inputs": [
                {"indexed": false, "internalType": "uint256", "name": "id", "type": "uint256"},
                {"indexed": false, "internalType": "address", "name": "user", "type": "address"}
            ],
            "name": "PackageBooked",
            "type": "event"
        },
        {
            "inputs": [
                {"internalType": "string", "name": "_name", "type": "string"},
                {"internalType": "string[]", "name": "_serviceNames", "type": "string[]"},
                {"internalType": "address[]", "name": "_providers", "type": "address[]"},
                {"internalType": "uint256[]", "name": "_prices", "type": "uint256[]"}
            ],
            "name": "addPackage",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "uint256", "name": "_id", "type": "uint256"}],
            "name": "bookPackage",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "uint256", "name": "_id", "type": "uint256"}],
            "name": "getPackage",
            "outputs": [
                {"internalType": "string", "name": "", "type": "string"},
                {"internalType": "uint256", "name": "", "type": "uint256"},
                {"internalType": "bool", "name": "", "type": "bool"},
                {"internalType": "address", "name": "", "type": "address"}
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {"internalType": "uint256", "name": "_id", "type": "uint256"},
                {"internalType": "uint256", "name": "_index", "type": "uint256"}
            ],
            "name": "getService",
            "outputs": [
                {"internalType": "string", "name": "", "type": "string"},
                {"internalType": "address", "name": "", "type": "address"},
                {"internalType": "uint256", "name": "", "type": "uint256"},
                {"internalType": "bool", "name": "", "type": "bool"}
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "uint256", "name": "_id", "type": "uint256"}],
            "name": "getServiceCount",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "owner",
            "outputs": [{"internalType": "address", "name": "", "type": "address"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "packageCount",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {"internalType": "uint256", "name": "_id", "type": "uint256"},
                {"internalType": "uint256", "name": "_index", "type": "uint256"}
            ],
            "name": "markServiceComplete",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "withdrawPayments",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [{"internalType": "address", "name": "", "type": "address"}],
            "name": "balances",
            "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
            "stateMutability": "view",
            "type": "function"
        }
    ]
};

// Global variables
let web3;
let contract;
let currentAccount = '';
let accountRole = 'customer';

// Initialize Web3
async function initWeb3() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(CONFIG.contractABI, CONFIG.contractAddress);
        console.log('✅ Web3 initialized');
        return true;
    } else {
        console.log('❌ MetaMask not found');
        return false;
    }
}

// Export for global use
window.CONFIG = CONFIG;
window.initWeb3 = initWeb3;