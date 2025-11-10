import React, { useEffect, useState } from 'react';
import RevealTester from '../components/admin/RevealTester';

const RevealTestPage: React.FC = () => {
  const [isFlunksBuild, setIsFlunksBuild] = useState(false);

  useEffect(() => {
    // Only show on flunks-build.vercel.app
    const hostname = window.location.hostname;
    setIsFlunksBuild(hostname === 'flunks-build.vercel.app' || hostname === 'localhost');
  }, []);

  if (!isFlunksBuild) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        textAlign: 'center',
        padding: '40px'
      }}>
        <div>
          <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>🔒</h1>
          <h2>Access Denied</h2>
          <p>This page is only available on flunks-build.vercel.app</p>
        </div>
      </div>
    );
  }

  return <RevealTester />;
};

export default RevealTestPage;
