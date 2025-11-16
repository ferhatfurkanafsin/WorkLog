import { useState, useEffect } from 'react';
import './WalletConnect.css';

/**
 * WalletConnect Block Component
 * TON Network wallet connection (TonKeeper, TonHub, etc.)
 *
 * Props:
 * - position: 'fixed-top' | 'inline' (default: 'fixed-top')
 * - network: 'mainnet' | 'testnet' (default: 'mainnet')
 * - onConnect: Callback function when wallet connects
 * - onDisconnect: Callback function when wallet disconnects
 */
function WalletConnect({
  position = 'fixed-top',
  network = 'mainnet',
  onConnect = () => {},
  onDisconnect = () => {}
}) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletProvider, setWalletProvider] = useState(null);
  const [showWalletOptions, setShowWalletOptions] = useState(false);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    // Check if wallet was previously connected
    const savedWallet = localStorage.getItem('ton_wallet_address');
    if (savedWallet) {
      setWalletAddress(savedWallet);
      fetchBalance(savedWallet);
    }
  }, []);

  const connectWallet = async (provider) => {
    setIsConnecting(true);
    setShowWalletOptions(false);

    try {
      // In production, integrate with TonConnect SDK
      // For now, this is a placeholder implementation

      if (provider === 'tonkeeper') {
        // TonKeeper connection logic
        // const tonkeeper = new TonConnect({ network });
        // const address = await tonkeeper.connect();

        // Placeholder for demonstration
        const mockAddress = 'UQ' + Math.random().toString(36).substring(2, 15) + 'mock';
        setWalletAddress(mockAddress);
        setWalletProvider('TonKeeper');
        localStorage.setItem('ton_wallet_address', mockAddress);
        localStorage.setItem('ton_wallet_provider', 'TonKeeper');

        // Fetch balance
        await fetchBalance(mockAddress);

        // Call onConnect callback
        onConnect({ address: mockAddress, provider: 'TonKeeper' });

      } else if (provider === 'tonhub') {
        // TonHub connection logic
        const mockAddress = 'UQ' + Math.random().toString(36).substring(2, 15) + 'hub';
        setWalletAddress(mockAddress);
        setWalletProvider('TonHub');
        localStorage.setItem('ton_wallet_address', mockAddress);
        localStorage.setItem('ton_wallet_provider', 'TonHub');

        await fetchBalance(mockAddress);
        onConnect({ address: mockAddress, provider: 'TonHub' });
      }

    } catch (error) {
      console.error('Wallet connection error:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setWalletAddress(null);
    setWalletProvider(null);
    setBalance(null);
    localStorage.removeItem('ton_wallet_address');
    localStorage.removeItem('ton_wallet_provider');
    onDisconnect();
  };

  const fetchBalance = async (address) => {
    try {
      // In production, fetch real balance from TON blockchain
      // For now, mock balance
      const mockBalance = (Math.random() * 1000).toFixed(2);
      setBalance(mockBalance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      alert('Address copied to clipboard!');
    }
  };

  return (
    <div className={`wallet-connect ${position}`}>
      {!walletAddress ? (
        <div className="wallet-not-connected">
          <button
            className="wallet-connect-btn"
            onClick={() => setShowWalletOptions(!showWalletOptions)}
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>

          {showWalletOptions && (
            <div className="wallet-options-dropdown">
              <h4>Choose Wallet</h4>
              <button
                className="wallet-option tonkeeper"
                onClick={() => connectWallet('tonkeeper')}
              >
                <div className="wallet-icon">📱</div>
                <div className="wallet-info">
                  <span className="wallet-name">TonKeeper</span>
                  <span className="wallet-desc">Mobile & Extension</span>
                </div>
              </button>
              <button
                className="wallet-option tonhub"
                onClick={() => connectWallet('tonhub')}
              >
                <div className="wallet-icon">🔷</div>
                <div className="wallet-info">
                  <span className="wallet-name">TonHub</span>
                  <span className="wallet-desc">Mobile Wallet</span>
                </div>
              </button>
              <button
                className="wallet-option generic"
                onClick={() => connectWallet('other')}
              >
                <div className="wallet-icon">💼</div>
                <div className="wallet-info">
                  <span className="wallet-name">Other TON Wallet</span>
                  <span className="wallet-desc">WalletConnect</span>
                </div>
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="wallet-connected">
          <div className="wallet-info-display">
            <div className="wallet-address-section">
              <span className="wallet-provider-badge">{walletProvider}</span>
              <span className="wallet-address" onClick={copyAddress} title="Click to copy">
                {formatAddress(walletAddress)}
              </span>
            </div>
            {balance !== null && (
              <div className="wallet-balance">
                <span className="balance-label">Balance:</span>
                <span className="balance-amount">{balance} TON</span>
              </div>
            )}
          </div>
          <button className="wallet-disconnect-btn" onClick={disconnectWallet}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}

export default WalletConnect;
