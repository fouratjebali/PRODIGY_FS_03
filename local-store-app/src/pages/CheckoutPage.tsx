import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCreditCard, faUser, faCalendarAlt, faLock, faMapMarkerAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const CheckoutPage = () => {
    const [cardNumber, setCardNumber] = useState('');
    const [cardType, setCardType] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    const [billingAddress, setBillingAddress] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const location = useLocation(); 
    const total = location.state?.amount || 0;

    const navigate = useNavigate();

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];
        
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        
        if (parts.length) {
            return parts.join(' ');
        } else {
            return value;
        }
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatCardNumber(e.target.value);
        setCardNumber(formattedValue);
        
        const firstDigit = formattedValue.charAt(0);
        if (firstDigit === '4') {
            setCardType('Visa');
        } else if (firstDigit === '5') {
            setCardType('Mastercard');
        } else if (firstDigit === '3') {
            setCardType('American Express');
        } else {
            setCardType('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);
        setError(null);

        const [monthName, year] = expiryDate.split(' ');
        const month = new Date(`${monthName} 1`).getMonth() + 1;
    
        try {
            const response = await fetch('http://localhost:5000/api/payments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: total, 
                    paymentMethod: 'Credit Card',
                    transactionId: `TRANS_${Date.now()}`, 
                    status: 'Success', 
                    cardNumberLastFour: cardNumber.slice(-4),
                    cardBrand: cardType,
                    cardholderName: nameOnCard,
                    cardExpiryMonth: month.toString(),
                    cardExpiryYear: year,
                    cardCvv: cvv, 
                    billingAddress,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Payment failed. Please check your details and try again.');
            }
    
            const data = await response.json();
            console.log('Payment successful:', data);
            setNotification('Payment successful! Thank you for your purchase.');
            setTimeout(() => {
                setNotification(null);
                navigate('/');
            }, 3000);
        } catch (err) {
            console.error('Error during payment:', err);
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="cursor-pointer absolute top-4 left-4 text-gray-600 hover:text-gray-800 flex items-center"
            >
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back
            </button>
            {/* Notification */}
            {notification && (
                <div className="fixed top-4 right-4 z-50 w-80 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-lg flex items-start justify-between">
                    <div>
                        <p className="font-medium">Success!</p>
                        <p>{notification}</p>
                    </div>
                    <button 
                        onClick={() => setNotification(null)} 
                        className="text-green-700 hover:text-green-900 ml-4"
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
            )}

            <div className="max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-gray-900">Secure Checkout</h1>
                    <p className="mt-2 text-sm text-gray-600">Complete your purchase with confidence</p>
                </div>

                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="p-6 sm:p-8">
                        {error && (
                            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name on Card */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name on Card</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faUser} className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={nameOnCard}
                                        onChange={(e) => setNameOnCard(e.target.value)}
                                        className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                                        placeholder="John Smith"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Card Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FontAwesomeIcon icon={faCreditCard} className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={cardNumber}
                                        onChange={handleCardNumberChange}
                                        className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                                        placeholder="4242 4242 4242 4242"
                                        maxLength={19}
                                        required
                                    />
                                    {cardType && (
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <img 
                                                src={`https://logo.clearbit.com/${cardType.toLowerCase()}.com`} 
                                                alt={cardType} 
                                                className="h-6 w-6"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Expiry Date */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FontAwesomeIcon icon={faCalendarAlt} className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="month"
                                            value={expiryDate}
                                            onChange={(e) => setExpiryDate(e.target.value)}
                                            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* CVV */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FontAwesomeIcon icon={faLock} className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={cvv}
                                            onChange={(e) => setCvv(e.target.value.replace(/[^0-9]/g, ''))}
                                            className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                                            placeholder="123"
                                            maxLength={4}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Billing Address */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Billing Address</label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <textarea
                                        value={billingAddress}
                                        onChange={(e) => setBillingAddress(e.target.value)}
                                        className="focus:ring-green-500 focus:border-green-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
                                        rows={3}
                                        placeholder="123 Main St, City, Country"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={isProcessing}
                                    className={`cursor-pointer w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${isProcessing ? 'bg-[#213448]' : 'bg-[#213448] hover:bg-green-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200`}
                                >
                                    {isProcessing ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processing...
                                        </>
                                    ) : 'Pay Securely'}
                                </button>
                            </div>

                            <div className="flex items-center justify-center">
                                <div className="flex items-center">
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                    <span className="ml-2 text-xs text-gray-500">Payments are secure and encrypted</span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;