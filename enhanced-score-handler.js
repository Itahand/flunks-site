// Quick Fix: Enhanced Score Submission with Better Error Handling
// Add this to FlappyFlunkWindow.tsx useEffect

useEffect(() => {
  const handler = (event: MessageEvent) => {
    if (event.data?.type === 'FLAPPY_SCORE') {
      const score = event.data.score;
      console.log('🎮 Score received:', score);
      
      fcl.currentUser().snapshot().then((user: any) => {
        console.log('👤 User snapshot:', { 
          hasUser: !!user, 
          hasAddr: !!user?.addr, 
          addr: user?.addr 
        });
        
        const wallet = user?.addr;
        if (!wallet) {
          console.warn('❌ No wallet connected - score not submitted:', score);
          // Could show a toast notification here
          return;
        }
        
        console.log('📮 Submitting score:', { wallet, score });
        
        fetch('/api/flappyflunk-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ wallet, score }),
        })
        .then(response => {
          console.log('📊 Score API response status:', response.status);
          if (!response.ok) {
            return response.text().then(text => {
              throw new Error(`API Error ${response.status}: ${text}`);
            });
          }
          return response.json();
        })
        .then(data => {
          console.log('✅ Score submitted successfully:', data);
        })
        .catch(error => {
          console.error('❌ Score submission failed:', error);
        });
      }).catch(authError => {
        console.error('❌ Auth error:', authError);
      });
    }
  };

  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
}, []);
