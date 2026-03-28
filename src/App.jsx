import React, { useState } from 'react';

const TradeJournal = () => {
    const [trades, setTrades] = useState([]);
    const [tradeData, setTradeData] = useState({ symbol: '', date: '', result: '', notes: '' });
    const [checklist, setChecklist] = useState({ strategy: false, analysis: false, riskManagement: false });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTradeData({ ...tradeData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setChecklist({ ...checklist, [name]: checked });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setTrades([...trades, {...tradeData, checklist }]);
        setTradeData({ symbol: '', date: '', result: '', notes: '' });
        setChecklist({ strategy: false, analysis: false, riskManagement: false });
    };

    return (
        <div>
            <h1>Trade Journal</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" name="symbol" value={tradeData.symbol} onChange={handleChange} placeholder="Stock Symbol" required />
                <input type="date" name="date" value={tradeData.date} onChange={handleChange} required />
                <input type="text" name="result" value={tradeData.result} onChange={handleChange} placeholder="Trade Result" required />
                <textarea name="notes" value={tradeData.notes} onChange={handleChange} placeholder="Additional Notes"></textarea>
                <div>
                    <label>
                        <input type="checkbox" name="strategy" checked={checklist.strategy} onChange={handleCheckboxChange} />
                        Followed Trading Strategy
                    </label>
                    <label>
                        <input type="checkbox" name="analysis" checked={checklist.analysis} onChange={handleCheckboxChange} />
                        Conducted Analysis
                    </label>
                    <label>
                        <input type="checkbox" name="riskManagement" checked={checklist.riskManagement} onChange={handleCheckboxChange} />
                        Implemented Risk Management
                    </label>
                </div>
                <button type="submit">Add Trade</button>
            </form>
            <ul>
                {trades.map((trade, index) => (
                    <li key={index}> 
                        <strong>{trade.symbol}</strong> - {trade.date} - {trade.result} <br />
                        Notes: {trade.notes} <br />
                        Checklist: <br />
                        - Strategy: {trade.checklist.strategy ? '✔️' : '❌'} <br />
                        - Analysis: {trade.checklist.analysis ? '✔️' : '❌'} <br />
                        - Risk Management: {trade.checklist.riskManagement ? '✔️' : '❌'} <br />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TradeJournal;