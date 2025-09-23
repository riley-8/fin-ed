const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// A simple scenario simulation function
const runSimulation = (currentSavings, monthlyContribution, annualReturn, years) => {
    let futureValue = currentSavings;
    for (let i = 0; i < years * 12; i++) {
        futureValue = (futureValue + monthlyContribution) * (1 + (annualReturn / 12));
    }
    return futureValue;
};

// @route   POST api/scenarios/simulate
// @desc    Run a financial scenario simulation
// @access  Private
router.post('/simulate', auth, (req, res) => {
    const {
        currentSavings = 0,
        monthlyContribution = 0,
        annualReturn = 0.05, // 5% default annual return
        years = 10
    } = req.body;

    try {
        const finalAmount = runSimulation(
            parseFloat(currentSavings),
            parseFloat(monthlyContribution),
            parseFloat(annualReturn),
            parseInt(years)
        );

        res.json({ 
            message: `After ${years} years, your savings could be worth R ${finalAmount.toFixed(2)}.`,
            finalAmount
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;