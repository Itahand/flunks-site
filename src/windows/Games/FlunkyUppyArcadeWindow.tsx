import React, { useState } from "react";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

const FlunkyUppyArcadeWindow: React.FC = () => {
  const { primaryWallet } = useDynamicContext();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [imageLoadError, setImageLoadError] = useState(false);

  const handleFlowEntry = async () => {
    if (!primaryWallet?.address) {
      setMessage("Please connect your Flow wallet first!");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/flunky-uppy-entry-tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          walletAddress: primaryWallet.address,
          username: "FlunksPlayer", // Could be enhanced with actual username
          userAgent: navigator.userAgent,
          referrer: document.referrer || window.location.href,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("Entry recorded! Launching Flunky Uppy...");
        
        // Redirect to the Flow game after a brief delay
        setTimeout(() => {
          window.open("https://flow.com/flunky-uppy", "_blank");
        }, 1500);
      } else {
        setMessage(`Error: ${result.error || "Failed to record entry"}`);
      }
    } catch (error) {
      console.error("Failed to track entry:", error);
      setMessage("Failed to connect to tracking system.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-b from-purple-900 to-black text-white p-6 flex flex-col items-center justify-between overflow-hidden">
      {/* Arcade Machine Image */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="relative max-w-full max-h-full">
          {!imageLoadError ? (
            <img
              src="/images/arcade/flunky-uppy-machine.png"
              alt="Flunky Uppy Arcade Machine"
              className="max-w-full max-h-full object-contain"
              style={{
                filter: "drop-shadow(0 0 20px rgba(255, 107, 53, 0.5))",
                imageRendering: "pixelated",
              }}
              onError={() => {
                setImageLoadError(true);
              }}
            />
          ) : (
            <div 
              className="arcade-fallback"
              style={{
                width: '200px', 
                height: '300px', 
                background: 'linear-gradient(45deg, #FF6B35, #F7931E)',
                border: '4px solid #FFD700',
                borderRadius: '20px 20px 10px 10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                fontFamily: '"Press Start 2P", monospace',
                textAlign: 'center',
                position: 'relative',
              }}
            >
              {/* Screen */}
              <div style={{
                width: '120px',
                height: '80px',
                background: '#000',
                border: '3px solid #333',
                borderRadius: '10px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#00ff00',
                lineHeight: '1.2'
              }}>
                🎮<br/>FLUNKY<br/>UPPY
              </div>
              
              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '10px',
                marginBottom: '10px'
              }}>
                <div style={{width: '20px', height: '20px', background: '#ff0000', borderRadius: '50%', border: '2px solid #fff'}}></div>
                <div style={{width: '20px', height: '20px', background: '#0000ff', borderRadius: '50%', border: '2px solid #fff'}}></div>
              </div>
              
              {/* Joystick */}
              <div style={{
                width: '80px',
                height: '80px',
                background: '#333',
                border: '3px solid #666',
                borderRadius: '50%',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '30px',
                  height: '30px',
                  background: '#666',
                  borderRadius: '50%',
                  border: '2px solid #999'
                }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Game Info and Controls */}
      <div className="w-full bg-black bg-opacity-60 p-4 rounded-lg border border-orange-500 text-center space-y-4">
        <h2 className="text-2xl font-bold text-orange-400 mb-2">
          🦘 FLUNKY UPPY
        </h2>
        
        <p className="text-sm text-gray-300 mb-4">
          Jump your way to victory in this high-energy arcade adventure! 
          Connect your Flow wallet to track your progress and compete on the leaderboards.
        </p>

        {message && (
          <div className={`p-3 rounded ${
            message.includes("Error") || message.includes("Failed") 
              ? "bg-red-900 border border-red-500 text-red-200"
              : "bg-green-900 border border-green-500 text-green-200"
          }`}>
            {message}
          </div>
        )}

        <div className="space-y-3">
          {primaryWallet?.address ? (
            <>
              <div className="text-xs text-gray-400 break-all">
                Connected: {primaryWallet.address.slice(0, 8)}...{primaryWallet.address.slice(-6)}
              </div>
              
              <button
                onClick={handleFlowEntry}
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-bold text-lg transition-all duration-200 ${
                  isLoading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-400 hover:to-yellow-400 hover:scale-105 shadow-lg"
                } text-white border-2 border-orange-300`}
              >
                {isLoading ? "🔄 Recording Entry..." : "🚀 ENTER GAME"}
              </button>
            </>
          ) : (
            <div className="text-center space-y-3">
              <p className="text-yellow-400 text-sm">
                Connect your Flow wallet to play!
              </p>
              <div className="opacity-50">
                <button
                  disabled
                  className="w-full py-3 px-4 rounded-lg font-bold text-lg bg-gray-600 cursor-not-allowed text-gray-400 border-2 border-gray-500"
                >
                  🔒 CONNECT WALLET FIRST
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 mt-4">
          <p>🏆 High Score Tracking • 🎯 Achievement System • 🔥 Live Leaderboards</p>
        </div>
      </div>
    </div>
  );
};

export default FlunkyUppyArcadeWindow;