import * as fcl from "@onflow/fcl";
import React, { useContext, useReducer } from "react";
import txStatusReducer, {
  initialState,
  TX_STATUS,
} from "reducers/TxStatusReducer";

interface FclTransactionContextType {
  state: {
    txStatus: TX_STATUS;
    txMessage: string;
    txName?: string;
  };
  dispatch: React.Dispatch<any>;
  executeTx: (tx: () => Promise<string>, txName?: string) => void;
  resetState: () => void;
}

const FclTransactionContext =
  React.createContext<FclTransactionContextType>(null);

export const useFclTransactionContext = () => useContext(FclTransactionContext);

export const FclTransactionProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(txStatusReducer, initialState);

  const resetState = () => {
    dispatch({ type: "RESET", txStatus: TX_STATUS.DEFAULT });
  };

  const executeTx = async (tx: () => Promise<string>, txName = "") => {
    let unsub;
    try {
      // Check for mobile device
      const isMobile = typeof window !== 'undefined' && (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent) ||
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0
      );
      
      if (isMobile) {
        console.log('📱 Mobile transaction detected - applying enhanced configuration');
        
        // Apply mobile-specific FCL configuration before transaction
        await fcl.config()
          .put("discovery.wallet.method", "POP/RPC")
          .put("challenge.handshake", "https://fcl-discovery.onflow.org/authn")
          .put("fcl.eventPollRate", 2500)
          .put("sdk.transport", "HTTP/POST");
      }

      dispatch({
        type: "UPDATE_STATUS",
        txStatus: TX_STATUS.STARTED,
        txName: txName,
      });

      const txId = await tx();

      dispatch({
        type: "UPDATE_STATUS",
        txStatus: TX_STATUS.PENDING,
        txName: txName,
      });
      console.log(txId);
      unsub = await fcl.tx(txId).subscribe((newState) => {
        console.log("executeTx STATE CHANGED", newState);
      });

      // txStatus returns either `success` or `error`
      const txStatus = await fcl.tx(txId).onceSealed();

      // When transaction succeeds, `txStatus` will be an Object:
      // see `SAMPLE_TX_STATUS_SUCCESS` at the end of this file
      if (txStatus && txStatus.status === 4) {
        dispatch({
          type: "UPDATE_STATUS",
          txStatus: TX_STATUS.SUCCESS,
          txName: txName,
        });
        // printing tx data for now, since we might want to look at the transaction events
        console.log("txStatus", txStatus);
      } else {
        console.log("txStatus", txStatus);
        dispatch({
          type: "UPDATE_STATUS",
          txStatus: TX_STATUS.ERROR,
          txName: txName,
        });
      }
    } catch (error) {
      console.error(error);
      
      // Enhanced mobile error handling
      let errorMessage = error.toString();
      
      if (typeof window !== 'undefined' && 
          /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent)) {
        
        if (errorMessage.includes('ErrInvalidRequest') || errorMessage.includes('Transaction not supported')) {
          errorMessage = 'Mobile wallet connection issue. Please ensure your wallet app is updated and try connecting again.';
        } else if (errorMessage.includes('User rejected') || errorMessage.includes('cancelled')) {
          errorMessage = 'Transaction cancelled by user.';
        } else {
          errorMessage = 'Mobile transaction failed. Please check your wallet connection and try again.';
        }
      }
      
      dispatch({
        type: "UPDATE_STATUS",
        txStatus: TX_STATUS.ERROR,
        txMessage: errorMessage,
        txName: txName,
      });
    } finally {
      if (unsub) {
        unsub();
      }
    }
  };

  return (
    <FclTransactionContext.Provider
      value={{ state, dispatch, executeTx, resetState }}
    >
      {children}
    </FclTransactionContext.Provider>
  );
};
