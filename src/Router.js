import { useState, useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Button } from 'reactstrap';

import Home from './pages/Home';
import TransactionsList from './pages/TransactionsList';
import TransactionSuccess from './pages/TransactionSuccess';

function Router() {
  const id = localStorage.getItem('walletId') || '';
  const [walletId, setWalletId] = useState(id);
  const [isNewWalletClicked, setIsNewWalletClicked] = useState(false);

  useEffect(() => {
    setIsNewWalletClicked(false);
  }, [walletId]);

  const updateWallet = (transactionId) => {
    setWalletId(transactionId);
  }

  const createNewWallet = () => {
    setIsNewWalletClicked(true);
    localStorage.removeItem('walletId');
    setWalletId('');
  }

  return (
    <div className='container'>
      <div>
        {walletId && <Button color="primary" className="new-wallet-btn" onClick={createNewWallet}>Create New Wallet</Button>}
      </div>
      <div className='main-container'>
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Home walletId={walletId} updateWallet={updateWallet}/>} />
            <Route exact path="/transaction-success" element={<TransactionSuccess walletId={walletId} newWalletClicked={isNewWalletClicked} />} />
            <Route exact path="/transactions" element={<TransactionsList newWalletClicked={isNewWalletClicked} />} />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default Router;