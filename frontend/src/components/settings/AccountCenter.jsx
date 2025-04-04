import React, { useState, useEffect } from 'react';
import { 
  FaShieldAlt, 
  FaExchangeAlt, 
  FaCreditCard, 
  FaKey, 
  FaUserAlt, 
  FaCheck, 
  FaSpinner, 
  FaTrash 
} from 'react-icons/fa';
import { useSettings } from '../../context/SettingsContext';
import { useClerk } from '@clerk/clerk-react';
import { toast } from 'react-hot-toast';

const AccountCenter = ({ onClose, initialTab = 'security' }) => {
  const { settings, saveSettings } = useSettings();
  const { signOut, user } = useClerk();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [processing, setProcessing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [connectedAccounts, setConnectedAccounts] = useState({
    bank: false,
    paytm: false,
    upi: false
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [showAddPaymentForm, setShowAddPaymentForm] = useState(false);
  const [newPaymentMethod, setNewPaymentMethod] = useState({
    type: 'credit',
    cardNumber: '',
    nameOnCard: '',
    expiry: '',
    cvv: ''
  });
  
  // Update active tab when initialTab prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);
  
  // Get current theme
  const isDarkMode = settings?.profile?.darkMode ?? true;
  
  // Styling based on theme
  const cardStyle = isDarkMode 
    ? "bg-gray-900 border border-gray-800 border-orange-500 border-l-4 rounded-xl p-6 shadow-lg" 
    : "bg-white border border-gray-200 border-orange-500 border-l-4 rounded-xl p-6 shadow-sm";
    
  const inputStyle = isDarkMode
    ? "w-full p-3 bg-gray-800 border border-gray-700 text-white rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
    : "w-full p-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:border-orange-500 focus:ring-1 focus:ring-orange-500";
  
  const textPrimaryColor = isDarkMode ? "text-white" : "text-gray-900";
  const textSecondaryColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const borderColor = isDarkMode ? "border-gray-800" : "border-gray-200";
  const bgColor = isDarkMode ? "bg-black" : "bg-gray-50";
  const buttonStyle = isDarkMode 
    ? "bg-gray-800 hover:bg-gray-700 text-white"
    : "bg-gray-200 hover:bg-gray-300 text-gray-900";
  
  const tabs = [
    { id: 'security', label: 'Security', icon: <FaShieldAlt /> },
    { id: 'payment', label: 'Payment Methods', icon: <FaCreditCard /> },
    { id: 'connections', label: 'Connected Accounts', icon: <FaExchangeAlt /> },
  ];
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  const handleChangePassword = () => {
    // Validation
    if (!passwordData.currentPassword) {
      toast.error('Please enter your current password');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setProcessing(true);
    
    // Simulate API call to change password
    setTimeout(() => {
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setProcessing(false);
    }, 1500);
  };
  
  const handleToggle2FA = () => {
    if (twoFactorEnabled) {
      // Disable 2FA
      setProcessing(true);
      setTimeout(() => {
        setTwoFactorEnabled(false);
        toast.success('Two-factor authentication disabled');
        setProcessing(false);
      }, 1000);
    } else {
      // Show 2FA setup
      setShowTwoFactorSetup(true);
    }
  };
  
  const handleSetup2FA = () => {
    if (verificationCode.length !== 6) {
      toast.error('Please enter a valid 6-digit verification code');
      return;
    }
    
    setProcessing(true);
    
    // Simulate verification
    setTimeout(() => {
      setTwoFactorEnabled(true);
      setShowTwoFactorSetup(false);
      setVerificationCode('');
      toast.success('Two-factor authentication enabled');
      setProcessing(false);
    }, 1500);
  };
  
  const handlePaymentMethodChange = (e) => {
    const { name, value } = e.target;
    setNewPaymentMethod({
      ...newPaymentMethod,
      [name]: value
    });
  };
  
  const handleAddPaymentMethod = () => {
    // Validation
    if (newPaymentMethod.cardNumber.replace(/\s/g, '').length !== 16) {
      toast.error('Please enter a valid 16-digit card number');
      return;
    }
    
    if (!newPaymentMethod.nameOnCard) {
      toast.error('Please enter the name on card');
      return;
    }
    
    if (!newPaymentMethod.expiry || !newPaymentMethod.expiry.match(/^\d{2}\/\d{2}$/)) {
      toast.error('Please enter a valid expiry date (MM/YY)');
      return;
    }
    
    if (!newPaymentMethod.cvv || newPaymentMethod.cvv.length < 3) {
      toast.error('Please enter a valid CVV');
      return;
    }
    
    setProcessing(true);
    
    // Simulate API call to add payment method
    setTimeout(() => {
      const last4 = newPaymentMethod.cardNumber.slice(-4);
      const newCard = {
        id: Date.now().toString(),
        type: newPaymentMethod.type,
        last4,
        brand: newPaymentMethod.type === 'credit' ? 'Visa' : 'MasterCard',
        expiryDate: newPaymentMethod.expiry
      };
      
      setPaymentMethods([...paymentMethods, newCard]);
      setNewPaymentMethod({
        type: 'credit',
        cardNumber: '',
        nameOnCard: '',
        expiry: '',
        cvv: ''
      });
      setShowAddPaymentForm(false);
      toast.success('Payment method added successfully');
      setProcessing(false);
    }, 1500);
  };
  
  const handleRemovePaymentMethod = (id) => {
    setProcessing(true);
    
    // Simulate API call to remove payment method
    setTimeout(() => {
      setPaymentMethods(paymentMethods.filter(method => method.id !== id));
      toast.success('Payment method removed');
      setProcessing(false);
    }, 1000);
  };
  
  const handleConnectPayment = () => {
    setShowAddPaymentForm(true);
  };
  
  const handleConnectAccount = (provider) => {
    const providerKey = provider.toLowerCase();
    
    if (connectedAccounts[providerKey]) {
      // If already connected, disconnect
      setIsConnecting(true);
      setTimeout(() => {
        setConnectedAccounts({
          ...connectedAccounts,
          [providerKey]: false
        });
        toast.success(`Disconnected from ${provider}`);
        setIsConnecting(false);
      }, 1000);
    } else {
      // Connect
      setIsConnecting(true);
      setTimeout(() => {
        setConnectedAccounts({
          ...connectedAccounts,
          [providerKey]: true
        });
        toast.success(`Successfully connected to ${provider}`);
        setIsConnecting(false);
      }, 1500);
    }
  };
  
  // Render the content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case 'security':
        return (
          <div className="space-y-6">
            <h3 className={`text-xl font-bold ${textPrimaryColor} mb-4`}>Account Security</h3>
            
            <div className={cardStyle}>
              <h4 className={`text-lg font-semibold ${textPrimaryColor} mb-4`}>Change Password</h4>
              
              <div className="space-y-4">
                <div>
                  <label className={`block ${textSecondaryColor} text-sm mb-2`}>Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className={inputStyle}
                  />
                </div>
                
                <div>
                  <label className={`block ${textSecondaryColor} text-sm mb-2`}>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className={inputStyle}
                  />
                </div>
                
                <div>
                  <label className={`block ${textSecondaryColor} text-sm mb-2`}>Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className={inputStyle}
                  />
                </div>
                
                <button
                  onClick={handleChangePassword}
                  disabled={processing}
                  className="w-full p-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-70 flex justify-center items-center"
                >
                  {processing ? <FaSpinner className="animate-spin mr-2" /> : <FaKey className="mr-2" />}
                  {processing ? 'Changing Password...' : 'Change Password'}
                </button>
              </div>
            </div>
            
            <div className={cardStyle}>
              <h4 className={`text-lg font-semibold ${textPrimaryColor} mb-4`}>Two-Factor Authentication</h4>
              
              {showTwoFactorSetup ? (
                <div className="space-y-4">
                  <div className={`p-4 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <p className={textSecondaryColor}>
                      Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
                    </p>
                    <div className="bg-white p-4 w-48 h-48 mx-auto my-4 flex items-center justify-center">
                      <div className="text-black font-mono text-xs text-center">
                        [QR Code Placeholder]<br/>
                        (In a real app, a QR code would be displayed here)
                      </div>
                    </div>
                    <p className={textSecondaryColor}>
                      Or enter this code manually: <span className="font-mono font-bold">ABCD 1234 EFGH 5678</span>
                    </p>
                  </div>
                  
                  <div>
                    <label className={`block ${textSecondaryColor} text-sm mb-2`}>Verification Code</label>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      maxLength={6}
                      placeholder="Enter 6-digit code"
                      className={inputStyle}
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSetup2FA}
                      disabled={processing}
                      className="flex-1 p-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-70 flex justify-center items-center"
                    >
                      {processing ? <FaSpinner className="animate-spin mr-2" /> : <FaCheck className="mr-2" />}
                      Verify
                    </button>
                    
                    <button
                      onClick={() => setShowTwoFactorSetup(false)}
                      disabled={processing}
                      className={`flex-1 p-3 ${buttonStyle} rounded-md disabled:opacity-70`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={`p-4 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                    <div className="flex items-center mb-3">
                      {twoFactorEnabled ? (
                        <FaCheck className="text-green-500 mr-2" />
                      ) : (
                        <FaShieldAlt className={`${textSecondaryColor} mr-2`} />
                      )}
                      <span className={textPrimaryColor}>Two-factor authentication is {twoFactorEnabled ? 'enabled' : 'disabled'}</span>
                    </div>
                    <p className={textSecondaryColor}>
                      {twoFactorEnabled 
                        ? 'Your account is protected with an additional layer of security.' 
                        : 'Enable two-factor authentication for enhanced account security.'}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleToggle2FA}
                    disabled={processing}
                    className={`w-full p-3 ${twoFactorEnabled ? 'bg-red-600 hover:bg-red-700' : 'bg-orange-500 hover:bg-orange-600'} text-white rounded-md disabled:opacity-70 flex justify-center items-center`}
                  >
                    {processing ? <FaSpinner className="animate-spin mr-2" /> : <FaShieldAlt className="mr-2" />}
                    {twoFactorEnabled ? 'Disable' : 'Enable'} Two-Factor Authentication
                  </button>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'payment':
        return (
          <div className="space-y-6">
            <h3 className={`text-xl font-bold ${textPrimaryColor} mb-4`}>Payment Methods</h3>
            
            {showAddPaymentForm ? (
              <div className={cardStyle}>
                <h4 className={`text-lg font-semibold ${textPrimaryColor} mb-4`}>Add Payment Method</h4>
                
                <div className="space-y-4">
                  <div>
                    <label className={`block ${textSecondaryColor} text-sm mb-2`}>Card Type</label>
                    <select
                      name="type"
                      value={newPaymentMethod.type}
                      onChange={handlePaymentMethodChange}
                      className={inputStyle}
                    >
                      <option value="credit">Credit Card</option>
                      <option value="debit">Debit Card</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className={`block ${textSecondaryColor} text-sm mb-2`}>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={newPaymentMethod.cardNumber}
                      onChange={handlePaymentMethodChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className={inputStyle}
                    />
                  </div>
                  
                  <div>
                    <label className={`block ${textSecondaryColor} text-sm mb-2`}>Name on Card</label>
                    <input
                      type="text"
                      name="nameOnCard"
                      value={newPaymentMethod.nameOnCard}
                      onChange={handlePaymentMethodChange}
                      placeholder="John Doe"
                      className={inputStyle}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block ${textSecondaryColor} text-sm mb-2`}>Expiry Date</label>
                      <input
                        type="text"
                        name="expiry"
                        value={newPaymentMethod.expiry}
                        onChange={handlePaymentMethodChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className={inputStyle}
                      />
                    </div>
                    <div>
                      <label className={`block ${textSecondaryColor} text-sm mb-2`}>CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        value={newPaymentMethod.cvv}
                        onChange={handlePaymentMethodChange}
                        placeholder="***"
                        maxLength={4}
                        className={inputStyle}
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-2">
                    <button
                      onClick={handleAddPaymentMethod}
                      disabled={processing}
                      className="flex-1 p-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-70 flex justify-center items-center"
                    >
                      {processing ? <FaSpinner className="animate-spin mr-2" /> : <FaCreditCard className="mr-2" />}
                      {processing ? 'Adding...' : 'Add Payment Method'}
                    </button>
                    
                    <button
                      onClick={() => setShowAddPaymentForm(false)}
                      disabled={processing}
                      className={`flex-1 p-3 ${buttonStyle} rounded-md disabled:opacity-70 flex justify-center items-center`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={cardStyle}>
                <div className="space-y-4">
                  <p className={textSecondaryColor}>
                    Add payment methods to easily pay bills, manage subscriptions, and transfer money.
                  </p>
                  
                  {paymentMethods.length === 0 ? (
                    <div className={`p-4 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                      <p className={`${textPrimaryColor} mb-2 font-medium`}>No payment methods found</p>
                      <p className={textSecondaryColor}>
                        You haven't added any payment methods yet.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {paymentMethods.map(method => (
                        <div 
                          key={method.id} 
                          className={`p-4 rounded-md ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} flex justify-between items-center`}
                        >
                          <div className="flex items-center">
                            <div className={`w-10 h-10 rounded-md flex items-center justify-center ${
                              method.brand === 'Visa' 
                                ? 'bg-blue-800 text-white' 
                                : 'bg-red-700 text-white'
                            }`}>
                              {method.brand === 'Visa' ? 'V' : 'MC'}
                            </div>
                            <div className="ml-3">
                              <div className={textPrimaryColor}>
                                {method.brand} •••• {method.last4}
                              </div>
                              <div className={`text-sm ${textSecondaryColor}`}>
                                Expires {method.expiryDate}
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => handleRemovePaymentMethod(method.id)}
                            disabled={processing}
                            className="text-red-500 hover:text-red-600"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <button
                    onClick={handleConnectPayment}
                    className="w-full p-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 flex justify-center items-center"
                  >
                    <FaCreditCard className="mr-2" />
                    Add Payment Method
                  </button>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'connections':
        return (
          <div className="space-y-6">
            <h3 className={`text-xl font-bold ${textPrimaryColor} mb-4`}>Connected Accounts</h3>
            
            <div className={cardStyle}>
              <p className={textSecondaryColor}>
                Connect your bank accounts and other financial services to automatically import your transactions.
              </p>
              
              <div className="space-y-4 mt-4">
                <button
                  onClick={() => handleConnectAccount('bank')}
                  disabled={isConnecting}
                  className={`w-full p-4 ${buttonStyle} rounded-md flex items-center justify-between`}
                >
                  <div className="flex items-center">
                    <img 
                      src="https://placehold.co/32x32/svg?text=B" 
                      alt="Bank" 
                      className="w-8 h-8 mr-3 rounded-md"
                    />
                    <div className="text-left">
                      <div className={textPrimaryColor}>Connect Bank Account</div>
                      <div className={`text-sm ${textSecondaryColor}`}>Import transactions automatically</div>
                    </div>
                  </div>
                  
                  {isConnecting && connectedAccounts.bank === false ? (
                    <FaSpinner className="animate-spin text-orange-500" />
                  ) : connectedAccounts.bank ? (
                    <div className="flex items-center">
                      <FaCheck className="text-green-500 mr-2" />
                      <span className={`${textSecondaryColor} text-sm`}>Connected</span>
                    </div>
                  ) : null}
                </button>
                
                <button
                  onClick={() => handleConnectAccount('paytm')}
                  disabled={isConnecting}
                  className={`w-full p-4 ${buttonStyle} rounded-md flex items-center justify-between`}
                >
                  <div className="flex items-center">
                    <img 
                      src="https://placehold.co/32x32/blue/white/svg?text=P" 
                      alt="PayTM" 
                      className="w-8 h-8 mr-3 rounded-md"
                    />
                    <div className="text-left">
                      <div className={textPrimaryColor}>Connect PayTM</div>
                      <div className={`text-sm ${textSecondaryColor}`}>Sync your digital wallet</div>
                    </div>
                  </div>
                  
                  {isConnecting && connectedAccounts.paytm === false ? (
                    <FaSpinner className="animate-spin text-orange-500" />
                  ) : connectedAccounts.paytm ? (
                    <div className="flex items-center">
                      <FaCheck className="text-green-500 mr-2" />
                      <span className={`${textSecondaryColor} text-sm`}>Connected</span>
                    </div>
                  ) : null}
                </button>
                
                <button
                  onClick={() => handleConnectAccount('upi')}
                  disabled={isConnecting}
                  className={`w-full p-4 ${buttonStyle} rounded-md flex items-center justify-between`}
                >
                  <div className="flex items-center">
                    <img 
                      src="https://placehold.co/32x32/green/white/svg?text=UPI" 
                      alt="UPI" 
                      className="w-8 h-8 mr-3 rounded-md"
                    />
                    <div className="text-left">
                      <div className={textPrimaryColor}>Connect UPI</div>
                      <div className={`text-sm ${textSecondaryColor}`}>Import UPI transactions</div>
                    </div>
                  </div>
                  
                  {isConnecting && connectedAccounts.upi === false ? (
                    <FaSpinner className="animate-spin text-orange-500" />
                  ) : connectedAccounts.upi ? (
                    <div className="flex items-center">
                      <FaCheck className="text-green-500 mr-2" />
                      <span className={`${textSecondaryColor} text-sm`}>Connected</span>
                    </div>
                  ) : null}
                </button>
              </div>
              
              {Object.values(connectedAccounts).some(v => v) && (
                <div className={`mt-6 p-4 rounded-md ${isDarkMode ? 'bg-green-900/20' : 'bg-green-100'} border border-green-700`}>
                  <div className="flex items-start">
                    <FaCheck className="text-green-500 mr-2 mt-1" />
                    <div>
                      <p className={`font-medium ${textPrimaryColor}`}>Automatic import active</p>
                      <p className={textSecondaryColor}>
                        New transactions from your connected accounts will be imported automatically.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isDarkMode ? 'bg-black bg-opacity-80' : 'bg-gray-200 bg-opacity-75'}`}>
      <div className={`w-full max-w-3xl ${bgColor} rounded-xl shadow-2xl overflow-hidden`}>
        <div className={`flex border-b ${borderColor}`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex-1 py-4 px-4 flex items-center justify-center gap-2 ${
                activeTab === tab.id 
                  ? `${textPrimaryColor} border-b-2 border-orange-500` 
                  : textSecondaryColor
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="p-6">
          {renderContent()}
        </div>
        
        <div className={`p-4 border-t ${borderColor} flex justify-end`}>
          <button
            className={`px-6 py-2 rounded-md ${buttonStyle}`}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountCenter; 