// Story Mode Image Diagnostics Utility
// Helps identify why Story Mode images fail on live site

export interface ImageDiagnosticResult {
  src: string;
  status: 'success' | 'error' | 'timeout';
  error?: string;
  loadTime?: number;
  responseType?: string;
  finalUrl?: string;
}

export const testImageLoading = async (imageSrc: string, timeoutMs = 10000): Promise<ImageDiagnosticResult> => {
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    const img = new Image();
    let resolved = false;
    
    // Set up timeout
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve({
          src: imageSrc,
          status: 'timeout',
          error: `Image loading timed out after ${timeoutMs}ms`,
          loadTime: Date.now() - startTime
        });
      }
    }, timeoutMs);
    
    img.onload = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve({
          src: imageSrc,
          status: 'success',
          loadTime: Date.now() - startTime,
          finalUrl: img.src
        });
      }
    };
    
    img.onerror = (error) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve({
          src: imageSrc,
          status: 'error',
          error: error.toString(),
          loadTime: Date.now() - startTime,
          finalUrl: img.src
        });
      }
    };
    
    // Start loading
    img.src = imageSrc;
  });
};

export const diagnoseStoryModeImages = async (): Promise<ImageDiagnosticResult[]> => {
  const storyModeImages = [
    '/images/cutscenes/main.png',
    '/images/cutscenes/1.png',
    '/images/cutscenes/2.png',
    '/images/cutscenes/3.png',
    '/images/cutscenes/4.png',
    '/images/cutscenes/5.png',
    '/images/cutscenes/6.png',
    '/images/cutscenes/7.png',
    '/images/cutscenes/8.png',
    '/images/cutscenes/9.png',
    '/images/cutscenes/final.png'
  ];
  
  console.log('🔍 Starting Story Mode image diagnostics...');
  
  const results = await Promise.all(
    storyModeImages.map(src => testImageLoading(src, 5000))
  );
  
  console.log('📊 Story Mode Image Diagnostics Results:');
  results.forEach(result => {
    const status = result.status === 'success' ? '✅' : result.status === 'timeout' ? '⏱️' : '❌';
    console.log(`${status} ${result.src}: ${result.status} (${result.loadTime}ms)${result.error ? ` - ${result.error}` : ''}`);
  });
  
  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const timeoutCount = results.filter(r => r.status === 'timeout').length;
  
  console.log(`📈 Summary: ${successCount} success, ${errorCount} errors, ${timeoutCount} timeouts out of ${results.length} images`);
  
  // Test fallback images
  console.log('🔄 Testing fallback images...');
  const fallbackImages = [
    '/images/backdrops/BLANK.png',
    '/images/backdrops/PIXEL-STATIC.png',
    '/images/backdrops/NIGHT-TIME.png'
  ];
  
  const fallbackResults = await Promise.all(
    fallbackImages.map(src => testImageLoading(src, 3000))
  );
  
  fallbackResults.forEach(result => {
    const status = result.status === 'success' ? '✅' : '❌';
    console.log(`${status} Fallback ${result.src}: ${result.status} (${result.loadTime}ms)`);
  });
  
  return [...results, ...fallbackResults];
};

export const runStoryModeDiagnostics = async () => {
  console.log('🚀 Running comprehensive Story Mode diagnostics...');
  
  // Test current environment
  console.log(`🌍 Environment: ${typeof window !== 'undefined' ? window.location.origin : 'Server-side'}`);
  console.log(`📱 User Agent: ${typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'}`);
  
  // Test image loading
  await diagnoseStoryModeImages();
  
  // Test basic network connectivity
  try {
    const response = await fetch('/images/cutscenes/main.png', { method: 'HEAD' });
    console.log(`🌐 Network test for main.png: Status ${response.status} (${response.statusText})`);
    console.log(`📦 Content-Type: ${response.headers.get('content-type')}`);
    console.log(`📏 Content-Length: ${response.headers.get('content-length')}`);
  } catch (error) {
    console.error('🚫 Network test failed:', error);
  }
  
  console.log('✅ Story Mode diagnostics complete!');
};

// Auto-run diagnostics in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  (window as any).runStoryModeDiagnostics = runStoryModeDiagnostics;
  (window as any).diagnoseStoryModeImages = diagnoseStoryModeImages;
  console.log('🛠️ Story Mode diagnostics available: runStoryModeDiagnostics() and diagnoseStoryModeImages()');
}