import React, { useEffect, useRef } from 'react';

interface PhoenixPaymentProps {
  walletAddress: string;
  amount: string;
  onClose: () => void;
  onComplete: (success: boolean, transactionId?: string) => void;
}

export const PhoenixPayment: React.FC<PhoenixPaymentProps> = ({
  walletAddress,
  amount,
  onClose,
  onComplete,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Handle messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security
      if (event.origin !== 'http://localhost:5173') return;
      
      if (event.data?.type === 'PAYMENT_COMPLETE') {
        onComplete(true, event.data.transactionId);
      } else if (event.data?.type === 'PAYMENT_FAILED') {
        onComplete(false);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Clean up
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onComplete]);

  return (
    <div className="phoenix-payment-container">
      <div className="payment-overlay">
        <div className="payment-modal">
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close payment window"
          >
            &times;
          </button>
          <iframe
            ref={iframeRef}
            src={`http://localhost:5173/?address=${walletAddress}&amount=${amount}`}
            className="teller-iframe"
            title="Phoenix Payment"
            allow="clipboard-write"
          />
        </div>
      </div>
      <style jsx>{`
        .phoenix-payment-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 1000;
        }
        
        .payment-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .payment-modal {
          position: relative;
          background-color: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }
        
        .close-button {
          position: absolute;
          top: -15px;
          right: -15px;
          background-color: #333;
          color: white;
          border: none;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          font-size: 18px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
        }
        
        .teller-iframe {
          width: 350px;
          height: 600px;
          border: none;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
      `}</style>
    </div>
  );
};

export default PhoenixPayment; 