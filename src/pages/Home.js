import { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';

import Transactions from "./Transactions";
import Loader from '../components/Loader';
import WalletLogo from '../assets/wallet.svg';

function Home(props) {
    const { walletId = '', updateWallet } = props;
    const [userName, setUserName] = useState('');
    const [balance, setBalance] = useState(0);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [transactionId, setTransactionId] = useState('');

    useEffect(() => {
        if (transactionId) {
            localStorage.setItem('walletId', transactionId);
        }
    }, [transactionId]);

    useEffect(() => {
        setTransactionId('');
    }, [walletId])

    const setupWallet = async () => {
        try {
            setError('');
            if (userName && balance) {
                const options = {
                    method: "POST",
                    url: "https://wallet-transaction-app.herokuapp.com/setup",
                    data: {
                        name: userName,
                        balance
                    }
                };

                setLoading(true);
                let res = await axios(options);
                res = res.data && res.data.body;
                setTransactionId(res.transactionId);
                res.transactionId && updateWallet(res.transactionId);
                setLoading(false);
            } else {
                setError('Please fill the details before proceeding');
            }
        } catch (error) {
            let errorMessage = (error.response && error.response.data && error.response.data.message) || error.message;
            setError(errorMessage || "Wallet set up failed !");
            setLoading(false);
        }
    }

    const setUpWallet = () => {
        return (
            <>
                {loading && <Loader />}
                {error && <div style={{ marginTop: '10px', marginBottom: '30px' }}>
                    <div class="alert alert-danger" role="alert">
                        {error}
                    </div>
                </div>}

                <div className="setup-form">
                    <div className="wallet-headers"> Set Up Wallet</div>
                    <img className="card-img" src={WalletLogo} alt="wallet-logo" />
                    <Form className="wallet-setup-form">
                        <FormGroup>
                            <Label for="userName">Username</Label>
                            <Input
                                type="text"
                                name="username"
                                id="username"
                                style={{ fontSize: "16px" }}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="balance">Balance</Label>
                            <Input
                                type="number"
                                name="balance"
                                id="balance"
                                style={{ fontSize: "16px" }}
                                onChange={(e) => setBalance(e.target.value)}
                            />
                        </FormGroup>
                        <Button className="submit-button" color="success" onClick={setupWallet}>Submit</Button>
                    </Form>
                </div>
            </>
        )
    }

    return (
        <div>
            {(walletId || transactionId) && <Transactions walletId={transactionId || walletId} />}
            {!(walletId || transactionId) && setUpWallet()}
        </div>
    );
}

export default Home;
