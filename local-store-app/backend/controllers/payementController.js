const pool = require('../db');

const checkout = async (req, res) => {
  const {
    amount,
    paymentMethod,
    transactionId,
    status,
    cardNumberLastFour,
    cardBrand,
    cardholderName,
    cardExpiryMonth,
    cardExpiryYear,
    cardCvv,
    billingAddress,
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO payments (amount, payment_date, payment_method, transaction_id, status, 
        card_number_last_four, card_brand, cardholder_name, card_expiry_month, 
        card_expiry_year, card_cvv, billing_address
      ) VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *`,
      [
        amount,
        paymentMethod,
        transactionId,
        status,
        cardNumberLastFour,
        cardBrand,
        cardholderName,
        cardExpiryMonth,
        cardExpiryYear,
        cardCvv,
        billingAddress,
      ]
    );

    res.status(201).json({
      message: 'Payment recorded successfully',
      payment: result.rows[0],
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { checkout };