// Simple script to check GumDrop contract status
import * as fcl from "@onflow/fcl";

fcl.config({
  "accessNode.api": "https://rest-mainnet.onflow.org"
});

async function main() {
  try {
    console.log('\n🔗 Querying SemesterZero @ 0x807c3d470888cc48...\n');
    
    const isActive = await fcl.query({
      cadence: `
        import SemesterZero from 0x807c3d470888cc48
        
        access(all) fun main(): Bool {
          if SemesterZero.activeGumDrop == nil {
            return false
          }
          
          let drop = SemesterZero.activeGumDrop!
          let now = getCurrentBlock().timestamp
          return now >= drop.startTime && now <= drop.endTime
        }
      `
    });
    
    console.log('DROP STATUS:', isActive ? '✅ ACTIVE' : '❌ INACTIVE');
    
    if (isActive) {
      const dropInfo = await fcl.query({
        cadence: `
          import SemesterZero from 0x807c3d470888cc48
          
          access(all) fun main(): {String: AnyStruct}? {
            if SemesterZero.activeGumDrop == nil {
              return nil
            }
            
            let drop = SemesterZero.activeGumDrop!
            let now = getCurrentBlock().timestamp
            
            return {
              "startTime": drop.startTime,
              "endTime": drop.endTime,
              "timeRemaining": drop.endTime > now ? drop.endTime - now : 0.0
            }
          }
        `
      });
      
      if (dropInfo) {
        console.log('Start:', new Date(dropInfo.startTime * 1000).toLocaleString());
        console.log('End:', new Date(dropInfo.endTime * 1000).toLocaleString());
        const hours = Math.floor(dropInfo.timeRemaining / 3600);
        const minutes = Math.floor((dropInfo.timeRemaining % 3600) / 60);
        console.log(`Time Remaining: ${hours}h ${minutes}m`);
      }
      
      console.log('\n✅ Button should be visible!\n');
    } else {
      console.log('\n❌ The Halloween button won\'t show because activeGumDrop is nil or expired');
      console.log('💡 Admin needs to call startGumDrop() on SemesterZero contract\n');
    }
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.log('\n🔍 Contract may not be deployed or missing activeGumDrop\n');
  }
  
  process.exit(0);
}

main();
