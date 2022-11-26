import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input, Row, Col } from 'reactstrap';
import axios from 'axios';
import { isEmpty } from 'lodash';

import Loader from '../components/Loader';
import TransactionsLogo from '../assets/transactions.svg';
import WalletTransactionsLogo from '../assets/walletTransactions.svg';

function Transactions(props) {
    const { walletId } = props;
    let navigate = useNavigate();
    const [transactionType, setTransactionType] = useState('');
    const [amount, setAmount] = useState(0);
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [walletDetails, setWalletDetails] = useState({});

    useEffect(() => {
        getWalletDetails();
    }, []);

    const getWalletDetails = async () => {
        try {
            setError('');
            const options = {
                method: "GET",
                headers: {
                    "Access-Control-Allow-Origin": "*"
                },
                url: `https://wallet-transaction-app.herokuapp.com/wallet/${walletId}`
            }

            setLoading(true);
            let res = await axios(options);
            res = res.data && res.data;
            setWalletDetails(res);
            setLoading(false);
        } catch (error) {
            setError(error.message || 'Error while getting wallet details');
            setLoading(false);
        }
    }


    const commonStyle = {
        padding: "2px 8px",
        textAlign: "left",
        boxShadow: "none",
        marginTop: '10px',
        marginLeft: '12px',
        fontSize: "16px"
    }

    const creditBtnStyle = {
        border: '2px solid #74D29F',
        color: transactionType === 'credit' ? "white" : "#74D29F",
        background: transactionType === 'credit' ? "#74D29F" : "white",
        ...commonStyle
    };

    const debitBtnStyle = {
        border: '2px solid #D27474',
        color: transactionType === 'debit' ? "white" : "#D27474",
        background: transactionType === 'debit' ? "#D27474" : "white",
        ...commonStyle
    };

    const performTransaction = async () => {
        try {
            setError('');
            if (amount && transactionType && description) {
                let options = {
                    method: "POST",
                    url: `https://wallet-transaction-app.herokuapp.com/transact/${walletId}`,
                    headers: {
                        "Access-Control-Allow-Origin": "*"
                    },
                    data: {
                        amount: transactionType === 'credit' ? `${amount}` : `-${amount}`,
                        description
                    }
                };

                setLoading(true);
                let res = await axios(options);
                res = res.data && res.data.body;
                navigate('/transaction-success', { state: res });
            } else {
                setError("Please fill the details and select transaction type before proceeding.");
                setLoading(false);
                return;
            }
        } catch (error) {
            let errorMessage = (error.response && error.response.data && error.response.data.message) || error.message;
            setError(errorMessage || "Transaction failed !");
            setLoading(false);
        }
    }

    return (
        <div>
            {loading && <Loader />}
            {error && <div style={{ marginTop: '10px', marginBottom: '30px' }}>
                <div class="alert alert-danger" role="alert">
                    {error}
                </div>
            </div>}

            <div className="card-body-wallet">
                {!isEmpty(walletDetails) &&
                    <div className="wallet-info">
                        <div className="wallet-headers">Wallet Details</div>
                        <img className="card-img" src={TransactionsLogo} alt="wallet-logo" />
                        <p ><strong>Wallet Id:</strong> {walletId}</p>
                        <p><strong>Name:</strong> {walletDetails.name}</p>
                        <p><strong>Balance: </strong>&#x20b9;{walletDetails.balance}</p>
                        <p><u><a href={`/transactions?walletId=${walletId}`}>View Transaction List</a></u></p>
                    </div>}
                <div className="setup-form">
                    <Form className="form">
                        <div className="wallet-headers"> Wallet Transaction</div>
                        <img className="card-img" src={WalletTransactionsLogo} alt="wallet-logo" />
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="balance">Transaction Amount</Label>
                                    <Input
                                        type="number"
                                        name="balance"
                                        id="balance"
                                        required={true}
                                        style={{ fontSize: "16px" }}
                                        onChange={(e) => setAmount(e.target.value)}
                                    />
                                </FormGroup></Col>
                            <Col md={6}>
                                <FormGroup className="transactions">
                                    <div><Label for="type">Transaction Type:</Label></div>
                                    <div>
                                        <Button size="md" className="credit-btn" style={creditBtnStyle} onClick={() => setTransactionType('credit')}>Credit</Button> {"    "}
                                        <Button size="md" className="debit-btn" style={debitBtnStyle} onClick={() => setTransactionType('debit')}>Debit</Button>
                                    </div>

                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="description">Description</Label>
                                    <Input
                                        type="text"
                                        name="description"
                                        id="description"
                                        required={true}
                                        style={{ fontSize: "16px" }}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                </FormGroup></Col>
                        </Row>
                        <Button className="submit-button" color="success" onClick={performTransaction}>Submit</Button>
                    </Form>
                </div>
            </div>
        </div>
    );
}

export default Transactions;
