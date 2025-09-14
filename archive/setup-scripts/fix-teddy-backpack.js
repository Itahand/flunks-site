// Script to add teddy backpack functionality to JocksHouseMain.tsx
const fs = require('fs');

const filePath = 'src/windows/Locations/JocksHouseMain.tsx';

// Read the current file
let content = fs.readFileSync(filePath, 'utf8');

// Add the useBackpackAccess import
if (!content.includes('import { useBackpackAccess }')) {
  content = content.replace(
    'import { trackDigitalLockAttempt } from "utils/digitalLockTracking";',
    'import { trackDigitalLockAttempt } from "utils/digitalLockTracking";\nimport { useBackpackAccess } from "hooks/useBackpackAccess";'
  );
}

// Add the backpack access hook to the main function
if (!content.includes('const { hasBackpackBase } = useBackpackAccess();')) {
  content = content.replace(
    'const [gumClaimed, setGumClaimed] = useState(false);',
    'const [gumClaimed, setGumClaimed] = useState(false);\n  const { hasBackpackBase } = useBackpackAccess();'
  );
}

// Add the new teddy backpack function
const newFunction = `
  const openTeddyBackpackAccess = () => {
    // Check if user has teddy backpack
    const hasTeddyBackpack = hasBackpackBase('Teddy');
    
    if (hasTeddyBackpack) {
      // Show the fortune message for users with teddy backpack
      openWindow({
        key: "teddy-backpack-access",
        window: (
          <DraggableResizeableWindow
            windowsId="teddy-backpack-access"
            headerTitle="🎒 Teddy Backpack"
            onClose={() => closeWindow("teddy-backpack-access")}
            initialWidth="400px"
            initialHeight="300px"
            resizable={false}
          >
            <div className="p-6 text-center bg-gradient-to-br from-orange-100 to-red-100 h-full flex flex-col justify-center">
              <div className="text-6xl mb-4">🎒</div>
              <h2 className="text-xl font-bold mb-4 text-orange-800">Teddy Backpack</h2>
              <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-orange-200">
                <p className="text-lg font-medium text-gray-800 italic">
                  "Good things come to those who wait"
                </p>
              </div>
            </div>
          </DraggableResizeableWindow>
        ),
      });
    } else {
      // Show access denied message
      openWindow({
        key: "teddy-backpack-denied",
        window: (
          <DraggableResizeableWindow
            windowsId="teddy-backpack-denied"
            headerTitle="🚫 Access Denied"
            onClose={() => closeWindow("teddy-backpack-denied")}
            initialWidth="400px"
            initialHeight="250px"
            resizable={false}
          >
            <div className="p-6 text-center bg-gradient-to-br from-red-100 to-gray-100 h-full flex flex-col justify-center">
              <div className="text-6xl mb-4">🚫</div>
              <h2 className="text-xl font-bold mb-4 text-red-800">Access Denied</h2>
              <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-red-200">
                <p className="text-lg font-medium text-gray-800">
                  Users must have a teddy backpack to access this area.
                </p>
              </div>
            </div>
          </DraggableResizeableWindow>
        ),
      });
    }
  };
`;

// Add the function before openTimeBasedAccessDemo
if (!content.includes('const openTeddyBackpackAccess')) {
  content = content.replace(
    '  const openTimeBasedAccessDemo = () => {',
    newFunction + '\n  const openTimeBasedAccessDemo = () => {'
  );
}

// Update the button to call the new function
content = content.replace(
  'onClick={() => openBackpackAccessDemo()}',
  'onClick={() => openTeddyBackpackAccess()}'
);

// Update the button text and title
content = content.replace(
  'title="Get a fortune cookie message"\n                >\n                  🥠 Fortune Cookie',
  'title="Access requires Teddy Backpack"\n                >\n                  🎒 Teddy Backpack'
);

// Write the updated content back to the file
fs.writeFileSync(filePath, content);

console.log('✅ Added teddy backpack functionality to JocksHouseMain.tsx');
