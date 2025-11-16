# Spawcoin Theme - Web3 & Crypto Features

## Overview

The Spawcoin theme now includes comprehensive Web3 wallet integration, token purchase functionality, and a complete airdrop system. This document explains how to set up and use these features.

## Features Added

### 1. **Web3 Wallet Integration**
- MetaMask connection support
- WalletConnect compatibility
- Automatic network detection and switching
- Real-time token balance display
- Multi-network support (Ethereum, BSC, Polygon, Arbitrum, Optimism, Base)

### 2. **Token Purchase System**
- Buy token widget
- DEX integration (Uniswap/PancakeSwap)
- Add token to wallet functionality

### 3. **Airdrop System**
- Complete airdrop claim page
- Social media verification tasks
- Database tracking for claims
- Admin dashboard for managing claims
- CSV export functionality

### 4. **Page Builder Support**
- Full Gutenberg (Block Editor) compatibility
- Elementor support
- Drag & drop page customization

### 5. **Shortcodes for Easy Integration**
- `[spawcoin_wallet_connect]` - Wallet connection button
- `[spawcoin_buy_button]` - Buy token button
- `[spawcoin_purchase_widget]` - Full purchase widget
- `[spawcoin_balance]` - Display user's token balance

---

## Setup Guide

### Step 1: Configure Web3 Settings

1. Log in to WordPress admin
2. Go to **Appearance → Customize → Web3 & Token Settings**
3. Configure the following:

   - **Token Contract Address**: Your SPAWN token contract address (e.g., `0x123...`)
   - **Blockchain Network**: Select your network (Ethereum, BSC, Polygon, etc.)
   - **Buy Token Link**: Your Uniswap/PancakeSwap URL
   - **Enable Airdrop**: Check to enable airdrop functionality
   - **Airdrop Amount**: Tokens per user (e.g., 1000)

4. Click "Publish" to save

### Step 2: Create Airdrop Page

1. Go to **Pages → Add New**
2. Give it a title: "Airdrop" or "Free Tokens"
3. In **Page Attributes**, select Template: **Airdrop Page**
4. Publish the page
5. Visit the page to see the airdrop interface

### Step 3: Configure Social Media Links

1. Go to **Appearance → Customize → Social Media Links**
2. Add your social media URLs:
   - Twitter/X URL (required for airdrop)
   - Telegram URL
   - Discord URL
   - Instagram URL
   - YouTube URL
3. These will appear on the airdrop page for social tasks

---

## Using Shortcodes

### Wallet Connect Button

Add anywhere in posts/pages/widgets:

```
[spawcoin_wallet_connect]
```

With custom text:

```
[spawcoin_wallet_connect text="Connect MetaMask"]
```

### Buy Token Button

```
[spawcoin_buy_button]
```

Custom text and class:

```
[spawcoin_buy_button text="Purchase SPAWN" class="custom-class"]
```

### Token Purchase Widget

Full widget with wallet connection and buy options:

```
[spawcoin_purchase_widget]
```

### Token Balance Display

Show user's current token balance:

```
[spawcoin_balance]
```

---

## Airdrop Management

### Viewing Claims

1. In WordPress admin, go to **Airdrops** in the sidebar
2. View all airdrop claims with:
   - Wallet addresses
   - Claim amounts
   - Claim dates
   - Status (Pending/Completed/Failed)

### Exporting Claims

1. Go to **Airdrops**
2. Click "Export to CSV"
3. Download the CSV file with all claim data
4. Use this to process token distributions

### Processing Airdrops

The theme tracks claims in the database. You'll need to:

1. Export claims as CSV
2. Use the wallet addresses to send tokens via your preferred method:
   - Smart contract batch transfer
   - Manual MetaMask sends
   - Third-party airdrop tools (e.g., Disperse.app)

---

## Supported Networks

The theme supports the following blockchain networks:

| Network | Chain ID | Best For |
|---------|----------|----------|
| **Ethereum Mainnet** | 1 | Maximum credibility, highest fees |
| **BNB Smart Chain** | 56 | Low fees, fast transactions |
| **Polygon** | 137 | Very low fees, fast |
| **Arbitrum** | 42161 | L2 scaling, lower fees |
| **Optimism** | 10 | L2 scaling, lower fees |
| **Base** | 8453 | Coinbase L2, growing ecosystem |

### Changing Networks

Users can switch networks:
1. Connect wallet
2. If on wrong network, they'll be prompted to switch
3. MetaMask will ask to approve the network change
4. Theme automatically adds network to MetaMask if needed

---

## Drag & Drop Page Building

### Using Gutenberg (Block Editor)

1. Edit any page
2. Click "+" to add blocks
3. Use any default blocks or install block plugins
4. Wide alignment and responsive embeds supported

### Using Elementor (Plugin Required)

1. Install **Elementor** plugin (free or pro)
2. Edit any page with Elementor
3. Drag and drop sections, widgets, and modules
4. Theme styles will automatically apply
5. Supported on pages, posts, and team member post type

### Recommended Page Builders

- **Elementor** (Most popular, free)
- **Gutenberg** (Built into WordPress)
- **Beaver Builder** (Professional option)
- **WPBakery** (Classic option)

---

## Web3 Wallet Connection Flow

### For Users:

1. **Connect Wallet**
   - Click "Connect Wallet" button
   - MetaMask popup appears
   - Approve connection
   - Wallet address displayed

2. **Check Balance**
   - Automatically loads SPAWN balance
   - Shows current network
   - Option to add token to wallet

3. **Buy Tokens**
   - Click "Buy SPAWN"
   - Redirects to DEX (Uniswap/PancakeSwap)
   - Complete purchase on DEX

4. **Claim Airdrop**
   - Visit airdrop page
   - Connect wallet
   - Complete social tasks
   - Check task boxes
   - Click "Claim Airdrop"
   - Confirmation message displayed

### Technical Flow:

```
User clicks "Connect Wallet"
    ↓
MetaMask prompts for permission
    ↓
User approves
    ↓
Web3.js initializes with user's wallet
    ↓
Check network (switch if needed)
    ↓
Load token balance from smart contract
    ↓
Display wallet info and balance
```

---

## Security Features

### Built-in Security

- **Nonce verification** for all AJAX requests
- **Wallet address validation** (0x format, 40 chars)
- **Duplicate claim prevention** (one per wallet)
- **XSS protection** on all outputs
- **SQL injection prevention** (prepared statements)

### Best Practices

1. **Never store private keys** in the theme or database
2. **Verify contract address** before deployment
3. **Test on testnet first** (Goerli, Mumbai, etc.)
4. **Set airdrop limits** to prevent abuse
5. **Monitor claims** regularly in admin dashboard

---

## Customization

### Styling the Wallet UI

All wallet components use CSS classes:

```css
.connect-wallet-btn { }
.wallet-address { }
.token-balance { }
.web3-notification { }
```

Edit in **Appearance → Customize → Additional CSS** or `style.css`

### Changing Token Symbol

In **Appearance → Customize → Web3 & Token Settings** or edit `functions.php`:

```php
'tokenSymbol' => 'SPAWN',
'tokenDecimals' => 18,
```

### Custom Airdrop Logic

Edit `spawcoin_claim_airdrop()` function in `functions.php` to add:
- Email verification
- Captcha
- Referral tracking
- Custom validation rules

---

##  Common Issues & Solutions

### Issue: "Please install MetaMask"
**Solution**: User needs to install MetaMask extension/app

### Issue: "Wrong network" error
**Solution**: Theme will auto-prompt to switch. User needs to approve.

### Issue: "Wallet already claimed"
**Solution**: Each wallet can only claim once. This is intentional anti-abuse.

### Issue: Balance shows as "0"
**Solution**:
- Check contract address is correct
- Ensure user has tokens
- Verify network is correct

### Issue: Airdrop button does nothing
**Solution**:
- Check wallet is connected
- Verify all social tasks are checked
- Check browser console for JavaScript errors

---

## API Reference

### JavaScript Global Object

```javascript
window.SpawcoinWallet

Methods:
- SpawcoinWallet.connectWallet()
- SpawcoinWallet.disconnectWallet()
- SpawcoinWallet.updateTokenBalance()
- SpawcoinWallet.addTokenToWallet()
- SpawcoinWallet.claimAirdrop()
```

### PHP Configuration

```php
// Get current settings
get_theme_mod('spawcoin_contract_address')
get_theme_mod('spawcoin_chain_id')
get_theme_mod('spawcoin_buy_link')
get_theme_mod('spawcoin_airdrop_enabled')
get_theme_mod('spawcoin_airdrop_amount')
```

---

## Testing Your Setup

### Testnet Testing (Recommended)

Before going live, test on testnets:

1. **Deploy test token** on Goerli (Ethereum) or Mumbai (Polygon)
2. **Update contract address** with test contract
3. **Switch MetaMask** to testnet
4. **Test wallet connection**
5. **Test airdrop claims**
6. **Verify database entries**

### Test Faucets

Get test tokens:
- Ethereum Goerli: https://goerlifaucet.com/
- Polygon Mumbai: https://faucet.polygon.technology/
- BSC Testnet: https://testnet.binance.org/faucet-smart

---

## Performance Optimization

### Script Loading

Web3 libraries load only when needed:
- Web3.js: 1.8.0 (CDN)
- Ethers.js: 5.7.2 (CDN)
- Custom wallet script: Enqueued last

### Database Optimization

Airdrop claims table uses:
- Indexed wallet_address for fast lookups
- Unique constraint to prevent duplicates
- Efficient queries with prepare() statements

---

## Future Enhancements

Potential additions you can make:

- [ ] Staking functionality
- [ ] NFT gallery integration
- [ ] Token swap widget
- [ ] Price charts (CoinGecko/CoinMarketCap API)
- [ ] Referral system
- [ ] Whitelist/presale functionality
- [ ] Multi-token support
- [ ] DAO voting integration

---

## Support & Resources

### Documentation
- WordPress Codex: https://codex.wordpress.org/
- Web3.js Docs: https://web3js.readthedocs.io/
- Ethers.js Docs: https://docs.ethers.org/
- MetaMask Docs: https://docs.metamask.io/

### Testing Tools
- Remix IDE: https://remix.ethereum.org/
- Hardhat: https://hardhat.org/
- Disperse.app: https://disperse.app/ (batch sends)

### Block Explorers
- Etherscan: https://etherscan.io/
- BscScan: https://bscscan.com/
- PolygonScan: https://polygonscan.com/

---

**Built with Web3 in mind for the Spawcoin community** 🚀
