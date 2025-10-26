// Check if FlunksGumDrop contract has an active drop
const fcl = require("@onflow/fcl");

fcl.config({
  "accessNode.api": "https://rest-mainnet.onflow.org",
  "0xFlunksGumDrop": "0x807c3d470888cc48"
});

async function checkGumDropStatus() {
  try {
    console.log('🔗 Querying FlunksGumDrop contract on mainnet...');
    console.log('📍 Contract address: 0x807c3d470888cc48');
    
    const dropInfo = await fcl.query({
      cadence: `
        import FlunksGumDrop from 0x807c3d470888cc48
        
        pub fun main(): {String: AnyStruct}? {
          return FlunksGumDrop.getGumDropInfo()
        }
      `
    });
    
    console.log('\n📦 GumDrop Status:');
    console.log('='.repeat(50));
    console.log('Active:', dropInfo?.isActive || false);
    console.log('Start Time:', dropInfo?.startTime ? new Date(dropInfo.startTime * 1000).toLocaleString() : 'N/A');
    console.log('End Time:', dropInfo?.endTime ? new Date(dropInfo.endTime * 1000).toLocaleString() : 'N/A');
    console.log('Time Remaining:', dropInfo?.timeRemaining || 0, 'seconds');
    console.log('GUM Per Flunk:', dropInfo?.gumPerFlunk || 0);
    console.log('Current Time:', dropInfo?.currentTime ? new Date(dropInfo.currentTime * 1000).toLocaleString() : 'N/A');
    console.log('='.repeat(50));
    
    if (dropInfo?.isActive) {
      console.log('\n✅ DROP IS ACTIVE! The button should show.');
      const hours = Math.floor(dropInfo.timeRemaining / 3600);
      const minutes = Math.floor((dropInfo.timeRemaining % 3600) / 60);
      console.log(`⏰ Time remaining: ${hours}h ${minutes}m`);
    } else {
      console.log('\n❌ NO ACTIVE DROP. The button will be hidden.');
      console.log('💡 Admin needs to call startDrop() on the contract.');
    }
    
  } catch (error) {
    console.error('\n❌ Error querying contract:', error);
    console.log('\n🔍 Possible issues:');
    console.log('1. Contract not deployed at 0x807c3d470888cc48');
    console.log('2. Contract missing getGumDropInfo() function');
    console.log('3. Network connectivity issue');
  }
}

checkGumDropStatus();
