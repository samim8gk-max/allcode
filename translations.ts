export type LanguageCode = 'English' | 'বাংলা' | 'Hindi';

export interface Translations {
  // Common & Header
  appTitle: string;
  settings: string;
  back: string;
  cancel: string;
  save: string;
  close: string;
  loading: string;
  success: string;
  status: string;
  verified: string;
  pending: string;
  
  // Home Screen
  totalBalance: string;
  addCoins: string;
  sendCoins: string;
  sendCoin: string;
  checkCoin: string;
  receiveCoins: string;
  history: string;
  scanToPay: string;
  sendToNft: string;
  payMerchant: string;
  passbook: string;
  quickActions: string;
  services: string;
  referEarn: string;
  platinumSavings: string;
  settlement: string;
  transactionReport: string;
  kycVerification: string;
  videoTutorials: string;
  logout: string;
  recentTransactions: string;
  viewAll: string;
  welcomeBack: string;
  accountActive: string;
  addMoney: string;
  home: string;
  notifications: string;
  profile: string;

  // Bills & Recharge
  rechargeAndBills: string;
  mobileRecharge: string;
  dthRecharge: string;
  prepaidPostpaid: string;
  electricityBill: string;
  licInsurance: string;
  payMonthlyBill: string;
  bestOffers: string;

  // Tutorial
  watchVideoTutorial: string;
  tutorialSubtitle: string;
  watchNow: string;
  
  // Settings Screen
  appSettings: string;
  applicationPreferences: string;
  appPreferencesDesc: string;
  securityNotifications: string;
  pushNotifications: string;
  pushNotifsDesc: string;
  biometricLock: string;
  biometricLockDesc: string;
  appLanguage: string;
  themeColor: string;
  themeColorDesc: string;
  saveSettingsReturn: string;
  settingsSavedSuccess: string;
  
  // Biometric
  biometricPromptTitle: string;
  biometricPromptDesc: string;
  biometricScanTouch: string;
  biometricUnlock: string;
  biometricFailed: string;
  touchSensorToUnlock: string;
  verifyFingerprint: string;
}

export const translations: Record<LanguageCode, Translations> = {
  English: {
    appTitle: 'GK Wallet',
    settings: 'App Settings',
    back: 'Back',
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close',
    loading: 'Loading...',
    success: 'Success',
    status: 'Status',
    verified: 'Verified',
    pending: 'Pending',
    
    totalBalance: 'Total Balance',
    addCoins: 'Add Coins',
    sendCoins: 'Send Coins',
    sendCoin: 'Send Coin',
    checkCoin: 'Check Coin',
    receiveCoins: 'Receive Coins',
    history: 'History',
    scanToPay: 'Scan to Pay',
    sendToNft: 'Send To NFT',
    payMerchant: 'Pay QR',
    passbook: 'Passbook',
    quickActions: 'Quick Actions',
    services: 'Wallet Services',
    referEarn: 'Refer & Earn',
    platinumSavings: 'Platinum Savings',
    settlement: 'Settlement',
    transactionReport: 'Transaction Reports',
    kycVerification: 'KYC Verification',
    videoTutorials: 'Video Tutorials',
    logout: 'Log Out',
    recentTransactions: 'Recent Transactions',
    viewAll: 'View All',
    welcomeBack: 'Welcome Back',
    accountActive: 'Active Account',
    addMoney: 'Add Money',
    home: 'Home',
    notifications: 'Notifications',
    profile: 'Profile',

    rechargeAndBills: 'Recharge & Bills',
    mobileRecharge: 'Mobile Recharge',
    dthRecharge: 'DTH Recharge',
    prepaidPostpaid: 'Prepaid / Postpaid',
    electricityBill: 'Electricity Bill',
    licInsurance: 'LIC Insurance',
    payMonthlyBill: 'Pay monthly bill',
    bestOffers: 'Best Offers',

    watchVideoTutorial: 'Watch Video Tutorial',
    tutorialSubtitle: 'Learn how to make fast and secure digital payments',
    watchNow: 'Watch Now',
    
    appSettings: 'App Settings',
    applicationPreferences: 'Application Preferences',
    appPreferencesDesc: 'Customize security, language, theme, and push notifications',
    securityNotifications: 'Security & Notifications',
    pushNotifications: 'Push Notifications',
    pushNotifsDesc: 'Instant alerts for Coin transfers & bank payouts',
    biometricLock: 'Biometric Fingerprint Lock',
    biometricLockDesc: 'Require fingerprint/Face ID upon app start',
    appLanguage: 'App Language (ভাষা)',
    themeColor: 'App Theme Color',
    themeColorDesc: 'Select your preferred accent colour for the entire app',
    saveSettingsReturn: 'Save Settings & Return',
    settingsSavedSuccess: 'Settings saved to Firestore successfully!',
    
    biometricPromptTitle: 'Biometric Authentication',
    biometricPromptDesc: 'Touch the fingerprint sensor to unlock your GK Wallet',
    biometricScanTouch: 'Touch Fingerprint Sensor',
    biometricUnlock: 'Unlock with Fingerprint',
    biometricFailed: 'Fingerprint not recognized. Try again.',
    touchSensorToUnlock: 'Touch the fingerprint sensor to unlock your GK Wallet and access account features.',
    verifyFingerprint: 'Verify Fingerprint',
  },
  'বাংলা': {
    appTitle: 'জিকে ওয়ালেট',
    settings: 'অ্যাপ সেটিংস',
    back: 'ফিরে যান',
    cancel: 'বাতিল',
    save: 'সংরক্ষণ করুন',
    close: 'বন্ধ করুন',
    loading: 'লোড হচ্ছে...',
    success: 'সফল',
    status: 'স্ট্যাটাস',
    verified: 'যাচাইকৃত',
    pending: 'পেন্ডিং',
    
    totalBalance: 'মোট ব্যালেন্স',
    addCoins: 'কয়েন যোগ করুন',
    sendCoins: 'কয়েন পাঠান',
    sendCoin: 'কয়েন পাঠান',
    checkCoin: 'কয়েন চেক',
    receiveCoins: 'কয়েন গ্রহণ',
    history: 'হিস্ট্রি',
    scanToPay: 'স্ক্যান করে পে',
    sendToNft: 'এনএফটিতে পাঠান',
    payMerchant: 'কিউআর পে',
    passbook: 'পাসবুক',
    quickActions: 'কুইক অ্যাকশন',
    services: 'ওয়ালেট সেবাসমূহ',
    referEarn: 'রেফার এবং আয়',
    platinumSavings: 'প্লাটিনাম সেভিংস',
    settlement: 'সেটেলমেন্ট',
    transactionReport: 'লেনদেন রিপোর্ট',
    kycVerification: 'কেওয়াইসি ভেরিফিকেশন',
    videoTutorials: 'ভিডিও টিউটোরিয়াল',
    logout: 'লগআউট',
    recentTransactions: 'সাম্প্রতিক লেনদেন',
    viewAll: 'সব দেখুন',
    welcomeBack: 'স্বাগতম',
    accountActive: 'সক্রিয় একাউন্ট',
    addMoney: 'টাকা যোগ করুন',
    home: 'হোম',
    notifications: 'নোটিফিকেশন',
    profile: 'প্রোফাইল',

    rechargeAndBills: 'রিচার্জ ও বিল',
    mobileRecharge: 'মোবাইল রিচার্জ',
    dthRecharge: 'ডিটিএইচ রিচার্জ',
    prepaidPostpaid: 'প্রিপেইড / পোস্টপেইড',
    electricityBill: 'বিদ্যুৎ বিল',
    licInsurance: 'এলআইসি',
    payMonthlyBill: 'মাসিক বিল পরিশোধ করুন',
    bestOffers: 'বেস্ট অফার',

    watchVideoTutorial: 'ভিডিও টিউটোরিয়াল দেখুন',
    tutorialSubtitle: 'দ্রুত এবং নিরাপদ ডিজিটাল পেমেন্ট শিখুন',
    watchNow: 'এখন দেখুন',
    
    appSettings: 'অ্যাপ সেটিংস',
    applicationPreferences: 'অ্যাপ্লিকেশন পছন্দসমূহ',
    appPreferencesDesc: 'নিরাপত্তা, ভাষা, থিম কালার এবং পুশ নোটিফিকেশন কাস্টমাইজ করুন',
    securityNotifications: 'নিরাপত্তা ও নোটিফিকেশন',
    pushNotifications: 'পুশ নোটিফিকেশন',
    pushNotifsDesc: 'কয়েন ট্রান্সফার ও ব্যাংক পে-আউটের তাত্ক্ষণিক অ্যালার্ট',
    biometricLock: 'বায়োমেট্রিক ফিঙ্গারপ্রিন্ট লক',
    biometricLockDesc: 'অ্যাপ খোলার সময় ফিঙ্গারপ্রিন্ট লক সক্রিয় রাখুন',
    appLanguage: 'অ্যাপের ভাষা (Language)',
    themeColor: 'অ্যাপ থিম কালার',
    themeColorDesc: 'পুরো অ্যাপের জন্য পছন্দের কালার নির্বাচন করুন',
    saveSettingsReturn: 'সেটিংস সেভ করুন ও ফিরে যান',
    settingsSavedSuccess: 'সেটিংস ফায়ারবেস ক্লাউড ফায়ারস্টোরে সেভ হয়েছে!',
    
    biometricPromptTitle: 'বায়োমেট্রিক অথেন্টিকেশন',
    biometricPromptDesc: 'জিকে ওয়ালেট আনলক করতে ফিঙ্গারপ্রিন্ট সেন্সরে স্পর্শ করুন',
    biometricScanTouch: 'ফিঙ্গারপ্রিন্ট সেন্সর স্পর্শ করুন',
    biometricUnlock: 'ফিঙ্গারপ্রিন্ট দিয়ে আনলক করুন',
    biometricFailed: 'ফিঙ্গারপ্রিন্ট মেলেনি। আবার চেষ্টা করুন।',
    touchSensorToUnlock: 'আপনার জিকে ওয়ালেট সুরক্ষিত ও আনলক করতে ফিঙ্গারপ্রিন্ট সেন্সরে স্পর্শ করুন।',
    verifyFingerprint: 'ফিঙ্গারপ্রিন্ট যাচাই করুন',
  },
  Hindi: {
    appTitle: 'जीके वॉलेट',
    settings: 'ऐप सेटिंग्स',
    back: 'वापस जाएं',
    cancel: 'रद्द करें',
    save: 'सेव करें',
    close: 'बंद करें',
    loading: 'लोड हो रहा है...',
    success: 'सफल',
    status: 'स्थिति',
    verified: 'सत्यापित',
    pending: 'लंबित',
    
    totalBalance: 'कुल बैलेंस',
    addCoins: 'कॉइन जोड़ें',
    sendCoins: 'कॉइन भेजें',
    sendCoin: 'कॉइन भेजें',
    checkCoin: 'कॉइन चेक करें',
    receiveCoins: 'कॉइन प्राप्त करें',
    history: 'इतिहास',
    scanToPay: 'स्कैन कर भुगतान करें',
    sendToNft: 'एनएफटी भेजें',
    payMerchant: 'क्यूआर भुगतान',
    passbook: 'पासबुक',
    quickActions: 'त्वरित कार्रवाई',
    services: 'वॉलेट सेवाएं',
    referEarn: 'रेफर और कमाएं',
    platinumSavings: 'प्लेटिनम बचत',
    settlement: 'सेटलमेंट',
    transactionReport: 'लेन-देन रिपोर्ट',
    kycVerification: 'केवाईसी सत्यापन',
    videoTutorials: 'वीडियो ट्यूटोरियल',
    logout: 'लॉग आउट',
    recentTransactions: 'हाल के लेन-देन',
    viewAll: 'सभी देखें',
    welcomeBack: 'वापसी पर स्वागत है',
    accountActive: 'सक्रिय खाता',
    addMoney: 'पैसे जोड़ें',
    home: 'होम',
    notifications: 'सूचनाएं',
    profile: 'प्रोफाइल',

    rechargeAndBills: 'रिचार्ज और बिल',
    mobileRecharge: 'मोबाइल रिचार्ज',
    dthRecharge: 'डीटीएच रिचार्ज',
    prepaidPostpaid: 'प्रीपेड / पोस्टपेड',
    electricityBill: 'बिजली बिल',
    licInsurance: 'एलआईसी',
    payMonthlyBill: 'मासिक बिल का भुगतान करें',
    bestOffers: 'बेस्ट ऑफर्स',

    watchVideoTutorial: 'वीडियो ट्यूटोरियल देखें',
    tutorialSubtitle: 'फास्ट और सुरक्षित डिजिटल भुगतान सीखें',
    watchNow: 'अभी देखें',
    
    appSettings: 'ऐप सेटिंग्स',
    applicationPreferences: 'एप्लिकेशन प्राथमिकताएं',
    appPreferencesDesc: 'सुरक्षा, भाषा, थीम और पुश नोटिफिकेशन कस्टमाइज़ करें',
    securityNotifications: 'सुरक्षा और नोटिफिकेशन',
    pushNotifications: 'पुश नोटिफिकेशन',
    pushNotifsDesc: 'कॉइन ट्रांसफर और बैंक पेआउट के तत्काल अलर्ट',
    biometricLock: 'बायोमेट्रिक फिंगरप्रिंट लॉक',
    biometricLockDesc: 'ऐप शुरू होने पर फिंगरप्रिंट लॉक आवश्यक करें',
    appLanguage: 'ऐप की भाषा (भाषा)',
    themeColor: 'ऐप थीम रंग',
    themeColorDesc: 'पूरे ऐप के लिए अपना पसंदीदा थीम रंग चुनें',
    saveSettingsReturn: 'सेटिंग्स सेव करें और वापस जाएं',
    settingsSavedSuccess: 'सेटिंग्स सफलतापूर्वक सेव हो गई!',
    
    biometricPromptTitle: 'बायोमेट्रिक प्रमाणीकरण',
    biometricPromptDesc: 'अपना जीके वॉलेट अनलॉक करने के लिए फिंगरप्रिंट सेंसर को छुएं',
    biometricScanTouch: 'फिंगरप्रिंट सेंसर को स्पर्श करें',
    biometricUnlock: 'फिंगरप्रिंट से अनलॉक करें',
    biometricFailed: 'फिंगरप्रिंट पहचाना नहीं गया। पुनः प्रयास करें।',
    touchSensorToUnlock: 'वॉलेट अनलॉक करने के लिए कृपया फिंगरप्रिंट सेंसर को स्पर्श करें।',
    verifyFingerprint: 'फिंगरप्रिंट सत्यापित करें',
  },
};

export function getTranslation(lang: LanguageCode | string = 'English'): Translations {
  if (lang === 'বাংলা' || lang === 'bn' || lang === 'Bengali') return translations['বাংলা'];
  if (lang === 'Hindi' || lang === 'hi' || lang === 'हिन्दी') return translations['Hindi'];
  return translations.English;
}
