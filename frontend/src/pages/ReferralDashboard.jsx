import { useState, useEffect } from 'react';
import './ReferralDashboard.css';

/**
 * ReferralDashboard Component
 * Shows user's referral stats and allows them to invite friends
 *
 * Props:
 * - userId: Current user's ID
 */
function ReferralDashboard({ userId }) {
  const [referralData, setReferralData] = useState(null);
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (userId) {
      fetchReferralData();
    }
  }, [userId]);

  const fetchReferralData = async () => {
    try {
      const response = await fetch(`/api/referrals/user/${userId}`);
      const data = await response.json();
      setReferralData(data);
      setReferralCode(data.referralCode);
    } catch (error) {
      console.error('Error fetching referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
    navigator.clipboard.writeText(referralLink);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const shareOnSocial = (platform) => {
    const referralLink = `${window.location.origin}/signup?ref=${referralCode}`;
    const message = 'Join me and get airdrop tokens! 🎉';

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + referralLink)}`;
        break;
    }

    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  if (loading) {
    return <div className="referral-loading">Loading referral data...</div>;
  }

  if (!referralData) {
    return <div className="referral-error">Unable to load referral data.</div>;
  }

  return (
    <div className="referral-dashboard">
      <div className="referral-header">
        <h1>Invite Friends & Earn Rewards</h1>
        <p>Share your referral link and earn {referralData.rewardPercentage}% from your friends' purchases!</p>
      </div>

      <div className="referral-stats">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{referralData.totalReferrals || 0}</h3>
            <p>Total Referrals</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{referralData.totalEarnings || 0} TON</h3>
            <p>Total Earnings</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎁</div>
          <div className="stat-content">
            <h3>{referralData.pendingRewards || 0} TON</h3>
            <p>Pending Rewards</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-content">
            <h3>{referralData.activeReferrals || 0}</h3>
            <p>Active Referrals</p>
          </div>
        </div>
      </div>

      <div className="referral-link-section">
        <h2>Your Referral Link</h2>
        <div className="referral-link-container">
          <input
            type="text"
            value={`${window.location.origin}/signup?ref=${referralCode}`}
            readOnly
            className="referral-link-input"
          />
          <button onClick={copyReferralLink} className="copy-btn">
            {copySuccess ? '✓ Copied!' : 'Copy Link'}
          </button>
        </div>

        <div className="share-buttons">
          <h3>Share on Social Media</h3>
          <div className="social-share-btns">
            <button onClick={() => shareOnSocial('twitter')} className="share-btn twitter">
              🐦 Twitter
            </button>
            <button onClick={() => shareOnSocial('facebook')} className="share-btn facebook">
              📘 Facebook
            </button>
            <button onClick={() => shareOnSocial('telegram')} className="share-btn telegram">
              ✈️ Telegram
            </button>
            <button onClick={() => shareOnSocial('whatsapp')} className="share-btn whatsapp">
              💬 WhatsApp
            </button>
          </div>
        </div>
      </div>

      <div className="referral-history">
        <h2>Referral History</h2>
        {referralData.referrals && referralData.referrals.length > 0 ? (
          <div className="referral-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Joined Date</th>
                  <th>Total Purchases</th>
                  <th>Your Earnings</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {referralData.referrals.map(referral => (
                  <tr key={referral.id}>
                    <td>{referral.userName || 'User'}</td>
                    <td>{new Date(referral.createdAt).toLocaleDateString()}</td>
                    <td>{referral.totalPurchases || 0} TON</td>
                    <td>{referral.rewardAmount || 0} TON</td>
                    <td>
                      <span className={`status-badge ${referral.status}`}>
                        {referral.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-referrals">
            <p>You haven't referred anyone yet. Start sharing your link!</p>
          </div>
        )}
      </div>

      <div className="referral-info">
        <h3>How it Works</h3>
        <ol>
          <li>Share your unique referral link with friends</li>
          <li>They sign up using your link and get airdrop tokens</li>
          <li>You earn {referralData.rewardPercentage}% from all their token purchases</li>
          <li>Rewards are automatically added to your account</li>
        </ol>
      </div>
    </div>
  );
}

export default ReferralDashboard;
