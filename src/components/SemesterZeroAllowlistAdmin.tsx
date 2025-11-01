import React, { useState, useEffect } from 'react';

interface AllowlistEntry {
  id: number;
  wallet_address: string;
  added_by: string;
  added_at: string;
  reason?: string;
}

interface SemesterZeroAllowlistAdminProps {
  onClose?: () => void;
}

const SemesterZeroAllowlistAdmin: React.FC<SemesterZeroAllowlistAdminProps> = ({ onClose }) => {
  const [allowlist, setAllowlist] = useState<AllowlistEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [newWallets, setNewWallets] = useState('');
  const [addReason, setAddReason] = useState('');

  // Load allowlist
  const loadAllowlist = async () => {
    if (!adminKey.trim()) {
      setMessage('❌ Admin key required');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/semester-zero-allowlist?admin_key=${encodeURIComponent(adminKey)}`);
      const data = await response.json();

      if (data.success) {
        setAllowlist(data.data || []);
        setMessage(`✅ Loaded ${data.data?.length || 0} entries`);
      } else {
        setMessage(`❌ ${data.error}`);
        setAllowlist([]);
      }
    } catch (error) {
      setMessage('❌ Failed to load allowlist');
      console.error('Error loading allowlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Add wallets to allowlist
  const addWallets = async () => {
    if (!adminKey.trim() || !newWallets.trim()) {
      setMessage('❌ Admin key and wallet addresses required');
      return;
    }

    try {
      setIsLoading(true);

      // Parse wallet addresses (support multiple formats)
      const wallets = newWallets
        .split(/[,\n\r\s]+/)
        .map(w => w.trim())
        .filter(w => w.length > 0)
        .filter(w => w.startsWith('0x') && w.length === 18); // Basic Flow address validation

      if (wallets.length === 0) {
        setMessage('❌ No valid wallet addresses found');
        return;
      }

      const response = await fetch('/api/semester-zero-allowlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallets,
          admin_key: adminKey,
          added_by: 'admin',
          reason: addReason || 'Manual admin addition'
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ Added ${wallets.length} wallets to allowlist`);
        setNewWallets('');
        setAddReason('');
        loadAllowlist(); // Refresh the list
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Failed to add wallets');
      console.error('Error adding wallets:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove wallet from allowlist
  const removeWallet = async (walletAddress: string) => {
    if (!adminKey.trim()) {
      setMessage('❌ Admin key required');
      return;
    }

    if (!confirm(`Remove ${walletAddress} from allowlist?`)) {
      return;
    }

    try {
      setIsLoading(true);

      const response = await fetch('/api/semester-zero-allowlist', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: walletAddress,
          admin_key: adminKey
        })
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ Removed ${walletAddress} from allowlist`);
        loadAllowlist(); // Refresh the list
      } else {
        setMessage(`❌ ${data.error}`);
      }
    } catch (error) {
      setMessage('❌ Failed to remove wallet');
      console.error('Error removing wallet:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-red-900 via-purple-900 to-indigo-900 text-white min-h-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-white mb-2" style={{ fontFamily: 'Cooper Black, Georgia, serif' }}>
          🔐 Semester Zero Allowlist Admin
        </h2>
        <p className="text-purple-200 text-sm">Manage wallet allowlist for Chapter 5 collections</p>
      </div>

      {/* Admin Key Input */}
      <div className="bg-black bg-opacity-30 p-4 rounded-lg mb-4">
        <label className="block text-sm font-semibold mb-2">Admin Key:</label>
        <div className="flex gap-2">
          <input
            type="password"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter admin key..."
            className="flex-1 px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-purple-400 focus:outline-none"
          />
          <button
            onClick={loadAllowlist}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold transition-colors"
          >
            Load
          </button>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className="bg-yellow-900 bg-opacity-50 border border-yellow-500 p-3 rounded-lg mb-4">
          <p className="text-yellow-200 text-sm">{message}</p>
        </div>
      )}

      {/* Add Wallets Section */}
      <div className="bg-black bg-opacity-30 p-4 rounded-lg mb-4">
        <h3 className="text-lg font-bold mb-3">Add Wallets to Allowlist</h3>
        
        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Wallet Addresses (one per line or comma-separated):</label>
          <textarea
            value={newWallets}
            onChange={(e) => setNewWallets(e.target.value)}
            placeholder="0x1234567890abcdef&#10;0xabcdef1234567890&#10;..."
            className="w-full h-24 px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-purple-400 focus:outline-none resize-none"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-semibold mb-1">Reason (optional):</label>
          <input
            type="text"
            value={addReason}
            onChange={(e) => setAddReason(e.target.value)}
            placeholder="e.g., Early access members, NFT holders, etc."
            className="w-full px-3 py-2 bg-gray-800 text-white rounded border border-gray-600 focus:border-purple-400 focus:outline-none"
          />
        </div>

        <button
          onClick={addWallets}
          disabled={isLoading || !adminKey.trim() || !newWallets.trim()}
          className="w-full py-2 px-4 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded font-semibold transition-colors"
        >
          {isLoading ? '⏳ Adding...' : '➕ Add Wallets'}
        </button>
      </div>

      {/* Allowlist Display */}
      {allowlist.length > 0 && (
        <div className="bg-black bg-opacity-30 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-3">Current Allowlist ({allowlist.length} entries)</h3>
          
          <div className="max-h-64 overflow-y-auto">
            {allowlist.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 mb-2 bg-gray-800 bg-opacity-50 rounded border border-gray-600"
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-mono text-green-300 truncate">
                    {entry.wallet_address}
                  </div>
                  <div className="text-xs text-gray-400">
                    Added {new Date(entry.added_at).toLocaleDateString()} by {entry.added_by}
                    {entry.reason && <span> • {entry.reason}</span>}
                  </div>
                </div>
                
                <button
                  onClick={() => removeWallet(entry.wallet_address)}
                  disabled={isLoading}
                  className="ml-3 px-2 py-1 bg-red-600 hover:bg-red-500 disabled:bg-gray-600 text-white rounded text-xs font-semibold transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Close Button */}
      {onClose && (
        <div className="mt-6 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default SemesterZeroAllowlistAdmin;