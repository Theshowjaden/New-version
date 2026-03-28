import React, { useState, useEffect } from 'react';

const App = () => {
    const [trades, setTrades] = useState([]);
    const [preTradeForm, setPreTradeForm] = useState({ symbol: '', size: '', entry: '' });
    const [postTradeForm, setPostTradeForm] = useState({ exit: '', profitLoss: '' });
    const [isDarkTheme, setIsDarkTheme] = useState(true);

    const loadTrades = () => {
        const storedTrades = JSON.parse(localStorage.getItem('trades')) || [];
        setTrades(storedTrades);
    };

    useEffect(() => {
        loadTrades();
    }, []);

    const handlePreTradeChange = (e) => {
        setPreTradeForm({ ...preTradeForm, [e.target.name]: e.target.value });
    };

    const handlePostTradeChange = (e) => {
        setPostTradeForm({ ...postTradeForm, [e.target.name]: e.target.value });
    };

    const handlePreTradeSubmit = (e) => {
        e.preventDefault();
        const newTrade = { ...preTradeForm, id: Date.now() }
        setTrades([...trades, newTrade]);
        setPreTradeForm({ symbol: '', size: '', entry: '' });
        localStorage.setItem('trades', JSON.stringify([...trades, newTrade]));
    };

    const handlePostTradeSubmit = (e) => {
        e.preventDefault();
        const updatedTrades = trades.map(trade => {
            if (trade.id === postTradeForm.id) {
                return { ...trade, exit: postTradeForm.exit, profitLoss: postTradeForm.profitLoss };
            }
            return trade;
        });
        setTrades(updatedTrades);
        setPostTradeForm({ exit: '', profitLoss: '' });
        localStorage.setItem('trades', JSON.stringify(updatedTrades));
    };

    return (
        <div style={{ backgroundColor: isDarkTheme ? '#282c34' : '#fff', color: isDarkTheme ? '#fff' : '#000', minHeight: '100vh', padding: '20px' }}>
            <h1>SMC Trade Journal</h1>
            <button onClick={() => setIsDarkTheme(!isDarkTheme)}>Toggle Theme</button>
            <h2>Pre-Trade Checklist</h2>
            <form onSubmit={handlePreTradeSubmit}>
                <input type="text" name="symbol" value={preTradeForm.symbol} onChange={handlePreTradeChange} placeholder="Symbol" required />
                <input type="number" name="size" value={preTradeForm.size} onChange={handlePreTradeChange} placeholder="Size" required />
                <input type="number" name="entry" value={preTradeForm.entry} onChange={handlePreTradeChange} placeholder="Entry Price" required />
                <button type="submit">Submit Pre-Trade</button>
            </form>
            <h2>Post-Trade Checklist</h2>
            <form onSubmit={handlePostTradeSubmit}>
                <input type="number" name="exit" value={postTradeForm.exit} onChange={handlePostTradeChange} placeholder="Exit Price" required />
                <input type="number" name="profitLoss" value={postTradeForm.profitLoss} onChange={handlePostTradeChange} placeholder="Profit/Loss" required />
                <button type="submit">Submit Post-Trade</button>
            </form>
            <h2>Trade History</h2>
            <ul>
                {trades.map((trade) => (
                    <li key={trade.id}>
                        {trade.symbol} - {trade.size} shares at ${trade.entry} | Exit: ${trade.exit} | P/L: ${trade.profitLoss}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default App;