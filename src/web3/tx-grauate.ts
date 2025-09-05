import * as fcl from "@onflow/fcl";

const TRANSACTION: string = `import FlunksGraduationV2 from 0x807c3d470888cc48

transaction(tokenID: UInt64) {
    prepare(signer: auth(SaveValue, Capabilities, Storage, BorrowValue) &Account) {
      FlunksGraduationV2.graduateFlunk(owner: signer, tokenID: tokenID)
    }
}`;

interface GraduateOpts {
  tokenID: number;
}

// prettier-ignore
export function graduate({tokenID}: GraduateOpts) {
    return async () => {
      // Enhanced mobile transaction handling
      const isMobile = typeof window !== 'undefined' && (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent) || 
        'ontouchstart' in window || 
        navigator.maxTouchPoints > 0
      );
      
      if (isMobile) {
        console.log('📱 Executing mobile-optimized graduation transaction');
        
        // Apply mobile-specific FCL configuration
        fcl.config()
          .put("discovery.wallet.method", "POP/RPC")
          .put("challenge.handshake", "https://fcl-discovery.onflow.org/authn")
          .put("fcl.limit", 9999)
          .put("fcl.proposer", fcl.authz)
          .put("fcl.payer", fcl.authz)
          .put("fcl.authorizations", [fcl.authz]);
      }
      
      return await fcl.mutate({
        cadence: TRANSACTION as string,
        args: (arg, t) => [
          arg(tokenID, t.UInt64),
        ],
        // @ts-ignore
        authorizations: [fcl.authz],
        limit: 9999,
        // Add mobile-specific transaction properties
        ...(isMobile && {
          proposer: fcl.authz,
          payer: fcl.authz,
          authorizations: [fcl.authz],
        })
      });
    };
  }
