/**
 * Spawcoin Web3 Wallet Integration
 * Supports MetaMask, WalletConnect, and other Web3 wallets
 *
 * @package Spawcoin
 */

(function($) {
    'use strict';

    // Global variables
    let web3;
    let userAccount;
    let contractInstance;
    const config = window.spawcoinConfig || {};

    /**
     * Web3 Wallet Manager
     */
    const SpawcoinWallet = {

        /**
         * Initialize wallet connection
         */
        init: function() {
            this.checkWalletConnection();
            this.bindEvents();
            this.updateUI();
        },

        /**
         * Bind event listeners
         */
        bindEvents: function() {
            // Connect wallet button
            $(document).on('click', '.connect-wallet-btn', (e) => {
                e.preventDefault();
                this.connectWallet();
            });

            // Disconnect wallet button
            $(document).on('click', '.disconnect-wallet-btn', (e) => {
                e.preventDefault();
                this.disconnectWallet();
            });

            // Buy token button
            $(document).on('click', '.buy-token-btn', (e) => {
                e.preventDefault();
                this.openBuyLink();
            });

            // Claim airdrop button
            $(document).on('click', '.claim-airdrop-btn', (e) => {
                e.preventDefault();
                this.claimAirdrop();
            });

            // Add token to wallet
            $(document).on('click', '.add-token-btn', (e) => {
                e.preventDefault();
                this.addTokenToWallet();
            });

            // Listen for account changes
            if (window.ethereum) {
                window.ethereum.on('accountsChanged', (accounts) => {
                    this.handleAccountsChanged(accounts);
                });

                window.ethereum.on('chainChanged', (chainId) => {
                    window.location.reload();
                });
            }
        },

        /**
         * Check if wallet is already connected
         */
        checkWalletConnection: async function() {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    const accounts = await window.ethereum.request({
                        method: 'eth_accounts'
                    });

                    if (accounts.length > 0) {
                        userAccount = accounts[0];
                        web3 = new Web3(window.ethereum);
                        this.updateUI(true);
                    }
                } catch (error) {
                    console.error('Error checking wallet connection:', error);
                }
            }
        },

        /**
         * Connect wallet (MetaMask)
         */
        connectWallet: async function() {
            if (typeof window.ethereum === 'undefined') {
                this.showNotification('Please install MetaMask to connect your wallet!', 'error');
                window.open('https://metamask.io/download/', '_blank');
                return;
            }

            try {
                // Show loading state
                $('.connect-wallet-btn').addClass('loading').text('Connecting...');

                // Request account access
                const accounts = await window.ethereum.request({
                    method: 'eth_requestAccounts'
                });

                userAccount = accounts[0];
                web3 = new Web3(window.ethereum);

                // Check if on correct network
                const chainId = await web3.eth.getChainId();
                const expectedChainId = parseInt(config.chainId);

                if (chainId !== expectedChainId) {
                    await this.switchNetwork(expectedChainId);
                }

                this.updateUI(true);
                this.showNotification('Wallet connected successfully!', 'success');

                // Store connection in session
                sessionStorage.setItem('walletConnected', 'true');

            } catch (error) {
                console.error('Error connecting wallet:', error);
                this.showNotification('Failed to connect wallet: ' + error.message, 'error');
            } finally {
                $('.connect-wallet-btn').removeClass('loading').text('Connect Wallet');
            }
        },

        /**
         * Disconnect wallet
         */
        disconnectWallet: function() {
            userAccount = null;
            web3 = null;
            contractInstance = null;
            sessionStorage.removeItem('walletConnected');
            this.updateUI(false);
            this.showNotification('Wallet disconnected', 'info');
        },

        /**
         * Handle account changes
         */
        handleAccountsChanged: function(accounts) {
            if (accounts.length === 0) {
                this.disconnectWallet();
            } else if (accounts[0] !== userAccount) {
                userAccount = accounts[0];
                this.updateUI(true);
                this.showNotification('Account changed', 'info');
            }
        },

        /**
         * Switch network
         */
        switchNetwork: async function(chainId) {
            const chainIdHex = '0x' + chainId.toString(16);

            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: chainIdHex }],
                });
            } catch (switchError) {
                // Chain not added, try to add it
                if (switchError.code === 4902) {
                    const networkParams = this.getNetworkParams(chainId);
                    if (networkParams) {
                        try {
                            await window.ethereum.request({
                                method: 'wallet_addEthereumChain',
                                params: [networkParams],
                            });
                        } catch (addError) {
                            throw new Error('Failed to add network');
                        }
                    }
                } else {
                    throw switchError;
                }
            }
        },

        /**
         * Get network parameters for adding to MetaMask
         */
        getNetworkParams: function(chainId) {
            const networks = {
                56: {
                    chainId: '0x38',
                    chainName: 'BNB Smart Chain',
                    nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
                    rpcUrls: ['https://bsc-dataseed.binance.org/'],
                    blockExplorerUrls: ['https://bscscan.com/']
                },
                137: {
                    chainId: '0x89',
                    chainName: 'Polygon',
                    nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 },
                    rpcUrls: ['https://polygon-rpc.com/'],
                    blockExplorerUrls: ['https://polygonscan.com/']
                },
                42161: {
                    chainId: '0xa4b1',
                    chainName: 'Arbitrum One',
                    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
                    blockExplorerUrls: ['https://arbiscan.io/']
                },
                8453: {
                    chainId: '0x2105',
                    chainName: 'Base',
                    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
                    rpcUrls: ['https://mainnet.base.org'],
                    blockExplorerUrls: ['https://basescan.org/']
                }
            };

            return networks[chainId] || null;
        },

        /**
         * Update UI based on wallet connection status
         */
        updateUI: function(connected = false) {
            if (connected && userAccount) {
                const shortAddress = this.shortenAddress(userAccount);

                $('.wallet-address').text(shortAddress).show();
                $('.connect-wallet-btn').hide();
                $('.disconnect-wallet-btn').show();
                $('.wallet-connected-content').show();
                $('.wallet-disconnected-content').hide();

                // Update balance if contract address is set
                if (config.contractAddress) {
                    this.updateTokenBalance();
                }
            } else {
                $('.wallet-address').hide();
                $('.connect-wallet-btn').show();
                $('.disconnect-wallet-btn').hide();
                $('.wallet-connected-content').hide();
                $('.wallet-disconnected-content').show();
                $('.token-balance').text('0');
            }
        },

        /**
         * Shorten wallet address for display
         */
        shortenAddress: function(address) {
            return address.substring(0, 6) + '...' + address.substring(address.length - 4);
        },

        /**
         * Get token balance
         */
        updateTokenBalance: async function() {
            if (!config.contractAddress || !userAccount || !web3) return;

            try {
                const minABI = [
                    {
                        "constant": true,
                        "inputs": [{"name": "_owner", "type": "address"}],
                        "name": "balanceOf",
                        "outputs": [{"name": "balance", "type": "uint256"}],
                        "type": "function"
                    },
                    {
                        "constant": true,
                        "inputs": [],
                        "name": "decimals",
                        "outputs": [{"name": "", "type": "uint8"}],
                        "type": "function"
                    }
                ];

                const contract = new web3.eth.Contract(minABI, config.contractAddress);
                const balance = await contract.methods.balanceOf(userAccount).call();
                const decimals = await contract.methods.decimals().call();

                const formattedBalance = (balance / Math.pow(10, decimals)).toFixed(2);
                $('.token-balance').text(formattedBalance);

            } catch (error) {
                console.error('Error getting token balance:', error);
            }
        },

        /**
         * Add token to MetaMask
         */
        addTokenToWallet: async function() {
            if (!config.contractAddress) {
                this.showNotification('Token contract address not configured', 'error');
                return;
            }

            try {
                await window.ethereum.request({
                    method: 'wallet_watchAsset',
                    params: {
                        type: 'ERC20',
                        options: {
                            address: config.contractAddress,
                            symbol: config.tokenSymbol,
                            decimals: config.tokenDecimals,
                        },
                    },
                });

                this.showNotification('Token added to wallet!', 'success');
            } catch (error) {
                console.error('Error adding token:', error);
                this.showNotification('Failed to add token to wallet', 'error');
            }
        },

        /**
         * Open buy link (DEX)
         */
        openBuyLink: function() {
            const buyLink = config.buyLink || $('#spawcoin-buy-link').data('url');

            if (buyLink) {
                window.open(buyLink, '_blank');
            } else {
                this.showNotification('Buy link not configured', 'error');
            }
        },

        /**
         * Claim airdrop
         */
        claimAirdrop: async function() {
            if (!userAccount) {
                this.showNotification('Please connect your wallet first', 'warning');
                return;
            }

            // Check if social tasks are completed
            const twitterFollowed = $('#twitter-follow').prop('checked');
            const telegramJoined = $('#telegram-join').prop('checked');

            if (!twitterFollowed || !telegramJoined) {
                this.showNotification('Please complete all social tasks first', 'warning');
                return;
            }

            try {
                $('.claim-airdrop-btn').addClass('loading').text('Processing...');

                // Submit airdrop claim to backend
                const response = await $.ajax({
                    url: config.ajaxUrl,
                    method: 'POST',
                    data: {
                        action: 'spawcoin_claim_airdrop',
                        nonce: config.nonce,
                        wallet_address: userAccount,
                    }
                });

                if (response.success) {
                    this.showNotification(response.data.message, 'success');
                    $('.airdrop-status').html('<p class="success">Airdrop claimed! Tokens will be sent to your wallet.</p>');
                } else {
                    this.showNotification(response.data.message || 'Claim failed', 'error');
                }

            } catch (error) {
                console.error('Error claiming airdrop:', error);
                this.showNotification('Failed to claim airdrop. Please try again.', 'error');
            } finally {
                $('.claim-airdrop-btn').removeClass('loading').text('Claim Airdrop');
            }
        },

        /**
         * Show notification
         */
        showNotification: function(message, type = 'info') {
            // Create notification element if it doesn't exist
            if (!$('.web3-notification').length) {
                $('body').append('<div class="web3-notification"></div>');
            }

            const notification = $('.web3-notification');
            notification
                .removeClass('success error warning info')
                .addClass(type)
                .html('<p>' + message + '</p>')
                .fadeIn()
                .delay(4000)
                .fadeOut();
        }
    };

    /**
     * Initialize on document ready
     */
    $(document).ready(function() {
        SpawcoinWallet.init();
    });

    // Make SpawcoinWallet globally accessible
    window.SpawcoinWallet = SpawcoinWallet;

})(jQuery);
