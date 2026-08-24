import re

with open("components/FullScreenViews.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Locate the start of HistoryScreen
start_match = re.search(r"export function HistoryScreen\(\{", content)
if not start_match:
    print("Error: Could not locate start of HistoryScreen!")
    exit(1)

start_idx = start_match.start()

# Locate the start of SendToNftScreen section
end_match = re.search(r"/\* ====================================================================\s+6\.\s+SEND TO NFT FULL SCREEN VIEW", content)
if not end_match:
    print("Error: Could not locate end of HistoryScreen section!")
    exit(1)

end_idx = end_match.start()

new_history_code = """export function HistoryScreen({
  isOpen,
  onClose,
  user,
  history,
  onUserUpdate
}: {
  isOpen: boolean;
  onClose: () => void;
  user?: UserData;
  history?: any[];
  onUserUpdate?: (updatedUser: UserData) => void;
}) {
  const [unifiedList, setUnifiedList] = useState<UnifiedTransactionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReceiptRecord, setSelectedReceiptRecord] = useState<UnifiedTransactionRecord | null>(null);

  // Tabs: 'all' | 'payments' | 'addmoney' | 'withdrawal'
  const [activeTab, setActiveTab] = useState<'all' | 'payments' | 'addmoney' | 'withdrawal'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // New section/tab state: 'kyc' | 'history' | 'settlement'
  const [activeSection, setActiveSection] = useState<'kyc' | 'history' | 'settlement'>('history');

  // Filter floating popover & states
  const [isFilterFloatingOpen, setIsFilterFloatingOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | 'received' | 'sent'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'rejected' | 'failed' | 'successful'>('all');
  const [startDateFilter, setStartDateFilter] = useState('');
  const [endDateFilter, setEndDateFilter] = useState('');

  // Balance adjustment state
  const [adjustVolume, setAdjustVolume] = useState('');
  const [adjustLoading, setAdjustLoading] = useState(false);

  // Edit Profile modal state inside this screen
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.gmail || '');

  // KYC state
  const [kycRecord, setKycRecord] = useState<KycData | null>(null);
  const [kycLoading, setKycLoading] = useState(false);
  const [kycAadhaar, setKycAadhaar] = useState('');
  const [kycPan, setKycPan] = useState('');
  const [kycState, setKycState] = useState('');
  const [kycDistrict, setKycDistrict] = useState('');
  const [kycPincode, setKycPincode] = useState('');
  const [kycAddress, setKycAddress] = useState('');

  // Bank & Settlement states
  const [bankDetails, setBankDetails] = useState<UserBankDetails | null>(null);
  const [bankLoading, setBankLoading] = useState(false);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [holderName, setHolderName] = useState(user?.name || '');
  const [bankName, setBankName] = useState('');
  const [accountNum, setAccountNum] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [coinsInput, setCoinsInput] = useState('');
  const [isSubmittingWithdrawal, setIsSubmittingWithdrawal] = useState(false);

  const themeColor = user?.themeColor || '#6495ED';

  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    async function loadData() {
      setIsLoading(true);
      try {
        const records = await fetchAllUnifiedTransactionsFromFirestore(user?.uid, user?.mobile);
        if (isMounted) {
          setUnifiedList(records);
        }
      } catch (err) {
        console.warn('Error loading history records:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    // Load KYC record
    async function loadKyc() {
      if (!user?.uid) return;
      setKycLoading(true);
      try {
        const record = await fetchKycFromFirestore(user.uid);
        if (isMounted && record) {
          setKycRecord(record);
          setKycAadhaar(record.aadharCard || '');
          setKycPan(record.pancard || '');
          setKycState(record.state || '');
          setKycDistrict(record.distinct || '');
          setKycPincode(record.pincode || '');
          setKycAddress(record.address || '');
        }
      } catch (err) {
        console.warn('Error loading kyc record:', err);
      } finally {
        if (isMounted) setKycLoading(false);
      }
    }

    // Load Bank details
    async function loadBank() {
      if (!user?.uid) return;
      setBankLoading(true);
      try {
        const record = await fetchBankDetailsFromFirestore(user.uid);
        if (isMounted && record) {
          setBankDetails(record);
          setHolderName(record.bankHolderName || user.name || '');
          setBankName(record.bankName || '');
          setAccountNum(record.accountNumber || '');
          setIfsc(record.ifscCode || '');
        }
      } catch (err) {
        console.warn('Error loading bank details:', err);
      } finally {
        if (isMounted) setBankLoading(false);
      }
    }

    loadData();
    loadKyc();
    loadBank();

    return () => {
      isMounted = false;
    };
  }, [isOpen, user?.uid, user?.mobile, user?.name]);

  if (!isOpen) return null;

  function parseDateString(dateStr: string | undefined): Date | null {
    if (!dateStr) return null;
    if (dateStr.includes('T')) {
      const d = new Date(dateStr);
      return isNaN(d.getTime()) ? null : d;
    }
    const parts = dateStr.split(/[\\/\\-]/);
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      let year = parseInt(parts[2], 10);
      if (year < 100) year += 2000;
      const d = new Date(year, month, day);
      return isNaN(d.getTime()) ? null : d;
    }
    const fallback = new Date(dateStr);
    return isNaN(fallback.getTime()) ? null : fallback;
  }

  // Handle Balance Adjustments (+ Add Funds / - Deduct Funds)
  const handleBalanceAdjust = async (isAdd: boolean) => {
    const vol = parseFloat(adjustVolume);
    if (isNaN(vol) || vol <= 0) {
      alert('Please enter a valid positive adjustment volume!');
      return;
    }
    if (!user?.uid) return;

    setAdjustLoading(true);
    try {
      const currentBalNum = parseFloat(user.balance || '0');
      const newBalNum = isAdd ? (currentBalNum + vol) : (currentBalNum - vol);
      if (!isAdd && newBalNum < 0) {
        alert('Deduction cannot result in a negative balance!');
        setAdjustLoading(false);
        return;
      }

      const updated = await updateUserProfileInFirestore(user.uid, {
        balance: newBalNum.toFixed(2)
      });
      if (onUserUpdate) {
        onUserUpdate(updated);
      }
      setAdjustVolume('');
      if (isAdd) {
        playCashInAudio();
      } else {
        synthSuccessChime();
      }
    } catch (err) {
      console.error('Error adjusting balance:', err);
      alert('Failed to adjust balance in Firestore database!');
    } finally {
      setAdjustLoading(false);
    }
  };

  // Handle Profile save
  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      alert('Name cannot be empty!');
      return;
    }
    if (!user?.uid) return;

    try {
      const updated = await updateUserProfileInFirestore(user.uid, {
        name: editName.trim(),
        gmail: editEmail.trim()
      });
      if (onUserUpdate) {
        onUserUpdate(updated);
      }
      setIsEditProfileOpen(false);
      playSuccessAudio();
    } catch (err) {
      console.error(err);
      alert('Failed to save profile!');
    }
  };

  // Handle Save KYC Details
  const handleSaveKycDetails = async () => {
    if (!kycAadhaar.trim() || !kycPan.trim() || !kycState.trim() || !kycDistrict.trim() || !kycPincode.trim() || !kycAddress.trim()) {
      alert('Please fill in all KYC details!');
      return;
    }
    if (kycAadhaar.replace(/\\s/g, '').length !== 12 || !/^\\d+$/.test(kycAadhaar.replace(/\\s/g, ''))) {
      alert('Aadhaar number must be exactly 12 digits!');
      return;
    }
    if (kycPan.trim().length !== 10) {
      alert('PAN card number must be exactly 10 characters!');
      return;
    }
    if (!user?.uid) return;

    setKycLoading(true);
    try {
      const kycData: KycData = {
        uid: user.uid,
        name: user.name || 'Rajes Roy',
        mobile: user.mobile || '9074363297',
        gmail: user.gmail || 'skjiyaul842@gmail.com',
        aadharCard: kycAadhaar.trim(),
        pancard: kycPan.trim().toUpperCase(),
        state: kycState.trim(),
        distinct: kycDistrict.trim(),
        pincode: kycPincode.trim(),
        address: kycAddress.trim(),
        status: 'successful'
      };

      await saveKycToFirestore(kycData);
      setKycRecord(kycData);

      const updatedUser = await updateUserProfileInFirestore(user.uid, {
        status: 'successful',
        aadhaar: kycAadhaar.trim(),
        pancard: kycPan.trim().toUpperCase()
      });
      if (onUserUpdate) {
        onUserUpdate(updatedUser);
      }

      playSuccessAudio();
      alert('KYC details saved and marked as Successful!');
    } catch (err) {
      console.error('Error saving KYC:', err);
      alert('Failed to save KYC details in Firestore!');
    } finally {
      setKycLoading(false);
    }
  };

  // Handle Save Bank Details
  const handleSaveBankDetails = async () => {
    if (!holderName.trim() || !bankName.trim() || !accountNum.trim() || !ifsc.trim()) {
      alert('Please fill in all bank details!');
      return;
    }
    if (!user?.uid) return;

    setBankLoading(true);
    try {
      const newDetails: UserBankDetails = {
        accountNumber: accountNum.trim(),
        bankHolderName: holderName.trim(),
        bankName: bankName.trim(),
        ifscCode: ifsc.trim().toUpperCase(),
        uid: user.uid
      };
      await saveBankDetailsToFirestore(newDetails);
      setBankDetails(newDetails);
      setIsBankModalOpen(false);
      playSuccessAudio();
      alert('Bank details updated successfully!');
    } catch (err) {
      console.error('Error saving bank details:', err);
      alert('Failed to save bank details!');
    } finally {
      setBankLoading(false);
    }
  };

  // Handle Submit Withdrawal
  const handleSubmitWithdrawal = async () => {
    const coins = parseFloat(coinsInput);
    if (isNaN(coins) || coins < 100) {
      alert('Minimum withdrawal requirement is 100 coins!');
      return;
    }
    const currentBal = parseFloat(user?.balance || '0');
    if (coins > currentBal) {
      alert('Insufficient available balance to complete withdrawal!');
      return;
    }
    if (!bankDetails) {
      alert('Please set your active Bank Account details first!');
      return;
    }
    if (!user?.uid) return;

    setIsSubmittingWithdrawal(true);
    try {
      const reqRecord: WithdrawalRequestRecord = {
        amount: coins,
        bankHolderName: bankDetails.bankHolderName,
        bankName: bankDetails.bankName,
        accountNumber: bankDetails.accountNumber,
        ifscCode: bankDetails.ifscCode,
        uid: user.uid,
        mobile: user.mobile || '9074363297',
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      await saveWithdrawalRequestToFirestore(reqRecord);

      const nextBal = (currentBal - coins).toFixed(2);
      const updated = await updateUserProfileInFirestore(user.uid, {
        balance: nextBal
      });
      if (onUserUpdate) {
        onUserUpdate(updated);
      }

      setCoinsInput('');
      playSuccessAudio();
      alert('Withdrawal request submitted successfully! Funds will clear within 24 hours.');
    } catch (err) {
      console.error('Error in withdrawal:', err);
      alert('Failed to submit withdrawal request!');
    } finally {
      setIsSubmittingWithdrawal(false);
    }
  };

  // Filter Logic
  const filteredRecords = unifiedList.filter((item) => {
    // 1. Tab filtering inside History tab
    if (activeTab === 'all') {
      // Show all
    } else if (activeTab === 'payments') {
      if (!['ntt', 'nft', 'cashback', 'transactions'].includes(item.sourceCollection)) return false;
    } else if (activeTab === 'addmoney') {
      if (item.sourceCollection !== 'addmoney') return false;
    } else if (activeTab === 'withdrawal') {
      if (item.sourceCollection !== 'withdrawal' && item.typeBadge !== 'WITHDRAWAL') return false;
    }

    // 2. Type filter (Receive Money vs Send Money buttons inside floating box)
    if (typeFilter === 'received') {
      if (!item.isCredit && item.amount < 0) return false;
    } else if (typeFilter === 'sent') {
      if (item.isCredit || item.amount > 0) return false;
    }

    // 3. Status filter (from any filter menu)
    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        if (!item.status.includes('PENDING')) return false;
      } else if (statusFilter === 'rejected') {
        if (!item.status.includes('REJECT')) return false;
      } else if (statusFilter === 'failed') {
        if (!item.status.includes('FAIL')) return false;
      } else if (statusFilter === 'successful') {
        if (
          !item.status.includes('SUCCESS') &&
          !item.status.includes('RECEIV') &&
          !item.status.includes('COMPLET')
        ) return false;
      }
    }

    // 4. Date range filter
    if (startDateFilter || endDateFilter) {
      const itemDate = parseDateString(item.date || item.formattedDateTime);
      if (itemDate) {
        if (startDateFilter) {
          const start = new Date(startDateFilter);
          start.setHours(0,0,0,0);
          if (itemDate < start) return false;
        }
        if (endDateFilter) {
          const end = new Date(endDateFilter);
          end.setHours(23,59,59,999);
          if (itemDate > end) return false;
        }
      }
    }

    // 5. Search text filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchSub = item.subtitle?.toLowerCase().includes(q);
      const matchUtr = item.utr?.toLowerCase().includes(q);
      const matchAmt = item.amount?.toString().includes(q);
      return matchTitle || matchSub || matchUtr || matchAmt;
    }

    return true;
  });

  const handleResetFilters = () => {
    setTypeFilter('all');
    setStatusFilter('all');
    setStartDateFilter('');
    setEndDateFilter('');
    setSearchQuery('');
  };

  // Elegant Print window statement layout generator
  const handlePrintHistory = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Popup blocker prevented opening the invoice print window!');
      return;
    }

    const rowsHtml = filteredRecords.map((item, idx) => {
      const isCredit = item.isCredit || item.amount > 0;
      const amtStr = Math.abs(item.amount).toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `
        <tr class="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
          <td class="py-3 px-4 font-bold text-slate-700 text-xs">${idx + 1}</td>
          <td class="py-3 px-4 text-xs">
            <div class="font-extrabold text-slate-900">${item.title || 'Transaction'}</div>
            <div class="text-[10px] text-slate-400 font-semibold">${item.sourceCollection?.toUpperCase() || 'WALLET'}</div>
          </td>
          <td class="py-3 px-4 text-xs font-semibold text-slate-500">${item.formattedDateTime || `${item.date} • ${item.time}`}</td>
          <td class="py-3 px-4 text-xs font-mono text-slate-500">${item.utr || item.id || 'N/A'}</td>
          <td class="py-3 px-4 text-xs text-right font-extrabold ${isCredit ? 'text-emerald-600' : 'text-slate-800'}">
            ${isCredit ? '+' : '-'} ₹${amtStr}
          </td>
        </tr>
      `;
    }).join('');

    const csvContent = "No,Title,Type,Date/Time,UTR/ID,Amount (INR)\\n" + 
      filteredRecords.map((item, idx) => {
        const isCredit = item.isCredit || item.amount > 0;
        const amt = (isCredit ? '' : '-') + Math.abs(item.amount);
        return `${idx + 1},"${item.title || 'Transaction'}","${item.sourceCollection || 'wallet'}","${item.formattedDateTime || `${item.date} ${item.time}`}","${item.utr || item.id}","${amt}"`;
      }).join("\\n");

    const csvDataUri = "data:text/csv;charset=utf-8," + encodeURIComponent(csvContent);
    const invoiceImgUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${user?.uid || 'gk'}`;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GK Wallet - Statement Invoice Summary</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Plus Jakarta Sans', sans-serif; }
          </style>
        </head>
        <body class="bg-slate-50 min-h-screen text-slate-900 p-6 md:p-12">
          <div class="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
            <div class="h-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500"></div>
            <div class="p-6 md:p-8 space-y-8">
              <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-slate-100">
                <div class="space-y-1">
                  <div class="flex items-center gap-2">
                    <span class="w-3 h-3 rounded-full bg-blue-600"></span>
                    <h1 class="text-xl font-black tracking-tight text-slate-900">GK WALLET STATEMENT</h1>
                  </div>
                  <p class="text-xs font-bold text-slate-400">Statement invoice generated in real-time</p>
                </div>
                <div class="relative inline-block text-left w-full md:w-auto">
                  <button id="exportBtn" onclick="toggleDropdown()" class="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-3 rounded-2xl shadow-md active:scale-95 transition-all inline-flex items-center justify-between md:justify-center gap-2 cursor-pointer">
                    <span>Download Formats</span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"></path></svg>
                  </button>
                  <div id="dropdownMenu" class="hidden absolute right-0 mt-2 w-full md:w-56 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 overflow-hidden divide-y divide-slate-50">
                    <button onclick="triggerDownload('pdf')" class="w-full p-3.5 hover:bg-slate-50 text-left text-xs font-extrabold text-slate-700 flex items-center gap-3">
                      <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9v-2h2v2zm0-4H9V8h2v4zm4 4h-2V8h2v8z"/></svg>
                      <span>PDF Document</span>
                    </button>
                    <button onclick="triggerDownload('excel')" class="w-full p-3.5 hover:bg-slate-50 text-left text-xs font-extrabold text-slate-700 flex items-center gap-3">
                      <svg class="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                      <span>Excel Spreadsheet</span>
                    </button>
                    <button onclick="triggerDownload('sheets')" class="w-full p-3.5 hover:bg-slate-50 text-left text-xs font-extrabold text-slate-700 flex items-center gap-3">
                      <svg class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
                      <span>Google Sheets (CSV Format)</span>
                    </button>
                  </div>
                </div>
              </div>

              <div id="loaderBox" class="hidden bg-slate-900/40 backdrop-blur-xs fixed inset-0 flex flex-col items-center justify-center gap-4 z-50">
                <div class="bg-white p-6 rounded-3xl shadow-2xl border border-slate-100 flex flex-col items-center gap-3 text-center max-w-xs mx-4">
                  <div class="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <h4 class="text-sm font-extrabold text-slate-900">Generating Document...</h4>
                  <p class="text-xs text-slate-400 font-semibold">Please wait while your file is optimized for Android & desktop download.</p>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div class="space-y-1.5">
                  <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Account Holder Details</h3>
                  <div class="text-sm font-black text-slate-900">${user?.name || 'Rajes Roy'}</div>
                  <div class="text-xs font-semibold text-slate-500 font-mono">${user?.mobile || '9074363297'}</div>
                  <div class="text-xs font-semibold text-slate-500">${user?.gmail || 'skjiyaul842@gmail.com'}</div>
                </div>
                <div class="space-y-1.5 md:text-right">
                  <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Document Summary</h3>
                  <div class="text-sm font-black text-slate-900">Available Balance: ₹${user?.balance || '0.00'}</div>
                  <div class="text-xs font-semibold text-slate-500">Total Transactions: ${filteredRecords.length}</div>
                  <div class="text-xs font-semibold text-slate-500 font-mono">Invoice Date: ${new Date().toLocaleDateString('en-IN')}</div>
                </div>
              </div>

              <div class="flex flex-col md:flex-row items-center gap-6 bg-blue-50/50 p-5 rounded-2xl border border-blue-100/50">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent('https://gkwallet.com/invoice/' + (user?.uid || '9074'))}" class="w-24 h-24 rounded-xl border border-blue-100 shadow-xs"/>
                <div class="space-y-1 text-center md:text-left">
                  <h4 class="text-xs font-black text-blue-900 uppercase tracking-wide">Secure Invoice Verification</h4>
                  <p class="text-xs text-blue-700/80 font-medium font-semibold">Scan this QR code to verify this statement's integrity. Underlying signature securely encrypted inside Firestore servers.</p>
                  <div class="text-[10px] font-mono font-bold text-blue-600 pt-1">
                    Invoice Image URL: <a href="${invoiceImgUrl}" target="_blank" class="underline hover:text-blue-800">${invoiceImgUrl}</a>
                  </div>
                </div>
              </div>

              <div class="border border-slate-100 rounded-2xl overflow-hidden shadow-2xs">
                <div class="overflow-x-auto">
                  <table class="w-full text-left border-collapse">
                    <thead>
                      <tr class="bg-slate-50 border-b border-slate-100">
                        <th class="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-wider w-12">#</th>
                        <th class="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Transaction Info</th>
                        <th class="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">Date & Time</th>
                        <th class="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-wider">UTR / ID</th>
                        <th class="py-3 px-4 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${rowsHtml || '<tr><td colspan="5" class="py-8 text-center text-slate-400 text-xs font-bold">No transactions found matching active filters.</td></tr>'}
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="text-center pt-4 text-[10px] text-slate-400 font-bold border-t border-slate-100">
                This is a computer-generated transaction statement of GK Wallet and does not require physical signature.
              </div>
            </div>
          </div>

          <script>
            function toggleDropdown() {
              const menu = document.getElementById('dropdownMenu');
              menu.classList.toggle('hidden');
            }
            window.onclick = function(event) {
              if (!event.target.closest('#exportBtn') && !event.target.closest('#dropdownMenu')) {
                document.getElementById('dropdownMenu').classList.add('hidden');
              }
            }
            function triggerDownload(format) {
              document.getElementById('dropdownMenu').classList.add('hidden');
              const loader = document.getElementById('loaderBox');
              loader.classList.remove('hidden');

              setTimeout(() => {
                loader.classList.add('hidden');
                if (format === 'pdf') {
                  window.print();
                } else if (format === 'excel') {
                  const link = document.createElement('a');
                  link.href = "${csvDataUri}";
                  link.setAttribute('download', 'GK_Wallet_Statement_${user?.name || 'Rajes_Roy'}.csv');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } else if (format === 'sheets') {
                  const link = document.createElement('a');
                  link.href = "${csvDataUri}";
                  link.setAttribute('download', 'GK_Wallet_GoogleSheets_Export_${user?.name || 'Rajes_Roy'}.csv');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  alert('Google Sheets friendly format downloaded. Open this CSV file directly in your Google Sheets mobile app!');
                }
              }, 1200);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#f8fafc] text-slate-900 flex flex-col w-full h-full min-h-screen overflow-y-auto animate-fade-in pb-10">
      {/* Top Header Navigation matching the beautiful screenshot */}
      <div className="sticky top-0 z-30 bg-white px-4 py-3.5 flex items-center justify-between border-b border-slate-100 shadow-2xs">
        <button
          onClick={onClose}
          type="button"
          className="flex items-center gap-2 text-slate-800 font-extrabold hover:text-slate-900 active:scale-95 transition-all"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          <span className="text-sm tracking-tight">Back to Users</span>
        </button>

        {/* Center Title */}
        <h2 className="hidden sm:block text-base font-black text-slate-900">
          Account Management Panel
        </h2>

        {/* Top-Right Edit Profile Button with Pencil Overlay */}
        <button
          onClick={() => {
            setEditName(user?.name || '');
            setEditEmail(user?.gmail || '');
            setIsEditProfileOpen(true);
          }}
          type="button"
          className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black px-4 py-2.5 rounded-xl transition-all active:scale-95 border border-slate-200/50"
        >
          <Pencil className="w-3.5 h-3.5" />
          <span>Edit Profile</span>
        </button>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-4 pt-4 pb-8 space-y-6">
        
        {/* Profile Card & Financial operations side-by-side on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* User profile Card */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-4 flex flex-col justify-between">
            <div className="flex items-start gap-4">
              <div className="relative shrink-0">
                <div className="w-16 h-16 rounded-full bg-slate-100 border-2 border-slate-200 overflow-hidden flex items-center justify-center">
                  {user?.profile_picture || user?.avatarUrl ? (
                    <img
                      src={user?.profile_picture || user?.avatarUrl}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="font-black text-xl text-slate-700">
                      {user?.name ? user.name.charAt(0).toUpperCase() : 'R'}
                    </div>
                  )}
                </div>
                {/* Pending / Active status indicator overlay */}
                <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-xs ${
                  user?.status === 'successful' || user?.status === 'verified' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                </span>
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-black text-slate-900 truncate">
                    {user?.name || 'Rajes Roy'}
                  </h3>
                  <span className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    user?.status === 'successful' || user?.status === 'verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {user?.status || 'pending'}
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-400 font-mono">
                  Mobile: {user?.mobile || '9074363297'}
                </p>
                <p className="text-xs font-semibold text-slate-400 truncate">
                  Email: {user?.gmail || 'skjiyaul842@gmail.com'}
                </p>
              </div>
            </div>

            {/* Balances detail */}
            <div className="pt-3 border-t border-slate-100/80 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Available Balance</span>
                <span style={{ color: themeColor }} className="text-xl font-black font-mono">
                  ₹{parseFloat(user?.balance || '0').toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">ID (UID)</span>
                <span className="text-xs font-black font-mono text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                  {user?.uid || 'guest_user'}
                </span>
              </div>
            </div>
          </div>

          {/* Financial Parameters & balance adjust operations */}
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-1">
                Financial parameters & operations
              </h3>
              <h4 className="text-sm font-black text-slate-900 tracking-tight">
                Adjust Balance (Firestore transaction)
              </h4>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <span className="absolute left-4 top-3.5 font-bold text-sm text-slate-400 font-mono">₹</span>
                <input
                  type="number"
                  value={adjustVolume}
                  onChange={(e) => setAdjustVolume(e.target.value)}
                  placeholder="Adjustment volume..."
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-extrabold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-offset-0 transition-all font-mono"
                />
              </div>

              {/* Action Buttons in Grid */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleBalanceAdjust(true)}
                  disabled={adjustLoading}
                  type="button"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 px-3 rounded-2xl active:scale-95 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 shrink-0 stroke-[2.5]" />
                  <span>+ Add Funds</span>
                </button>

                <button
                  onClick={() => handleBalanceAdjust(false)}
                  disabled={adjustLoading}
                  type="button"
                  className="w-full bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white font-extrabold text-xs py-3.5 px-3 rounded-2xl active:scale-95 transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Minus className="w-4 h-4 shrink-0 stroke-[2.5]" />
                  <span>- Deduct Funds</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* 3-Column Tab Bar Switcher - Perfect Responsive Design for Mobile Devices */}
        <div className="grid grid-cols-3 gap-2 bg-slate-200/60 p-1.5 rounded-2xl border border-slate-300/40 shadow-2xs">
          {(['kyc', 'history', 'settlement'] as const).map((sec) => (
            <button
              key={sec}
              onClick={() => {
                setActiveSection(sec);
                setIsFilterFloatingOpen(false);
              }}
              type="button"
              className={`py-3.5 rounded-xl font-black text-xs transition-all uppercase tracking-wider text-center cursor-pointer ${
                activeSection === sec
                  ? 'text-white shadow-xs'
                  : 'bg-transparent text-slate-500 hover:text-slate-800'
              }`}
              style={activeSection === sec ? { backgroundColor: themeColor } : undefined}
            >
              {sec}
            </button>
          ))}
        </div>

        {/* SECTION 1: KYC OPERATIONS */}
        {activeSection === 'kyc' && (
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Identity Verification</h3>
                <p className="text-xs text-slate-400 font-semibold">Verify identity documents and update verified status.</p>
              </div>
              <span className={`text-xs font-black px-3.5 py-1 rounded-full uppercase tracking-wider ${
                user?.status === 'successful' || user?.status === 'verified'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {user?.status || 'pending'}
              </span>
            </div>

            {kycLoading ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                <Loader2 style={{ color: themeColor }} className="w-8 h-8 animate-spin" />
                <span className="text-xs font-bold text-slate-500">Retrieving KYC details...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                      Aadhaar Card Number (12 digits)
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      value={kycAadhaar}
                      onChange={(e) => setKycAadhaar(e.target.value.replace(/\\D/g, ''))}
                      placeholder="e.g. 901234567890"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold font-mono focus:outline-none focus:ring-1 focus:ring-offset-0 transition-all text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">
                      PAN Card Number (10 alphanumeric)
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      value={kycPan}
                      onChange={(e) => setKycPan(e.target.value)}
                      placeholder="e.g. ABCDE1234F"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold font-mono focus:outline-none focus:ring-1 focus:ring-offset-0 transition-all text-slate-900 uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">State</label>
                    <input
                      type="text"
                      value={kycState}
                      onChange={(e) => setKycState(e.target.value)}
                      placeholder="State"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-offset-0 transition-all text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">District</label>
                    <input
                      type="text"
                      value={kycDistrict}
                      onChange={(e) => setKycDistrict(e.target.value)}
                      placeholder="District"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-offset-0 transition-all text-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">Pincode</label>
                    <input
                      type="text"
                      maxLength={6}
                      value={kycPincode}
                      onChange={(e) => setKycPincode(e.target.value.replace(/\\D/g, ''))}
                      placeholder="6 digits Pincode"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold font-mono focus:outline-none focus:ring-1 focus:ring-offset-0 transition-all text-slate-900"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">Full Address</label>
                  <textarea
                    rows={2}
                    value={kycAddress}
                    onChange={(e) => setKycAddress(e.target.value)}
                    placeholder="Enter permanent billing address..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:outline-none focus:ring-1 focus:ring-offset-0 transition-all text-slate-900 resize-none"
                  />
                </div>

                <div className="pt-3">
                  <button
                    onClick={handleSaveKycDetails}
                    type="button"
                    style={{ backgroundColor: themeColor }}
                    className="w-full sm:w-auto text-white font-black py-3.5 px-8 rounded-2xl shadow-md active:scale-95 transition-all text-xs cursor-pointer flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>Save & Verify KYC</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: TRANSACTION HISTORY OPERATIONS (Has Filter & Printer icon in active header context) */}
        {activeSection === 'history' && (
          <div className="space-y-4">
            
            {/* Real-time search, filter popover trigger and Print triggers */}
            <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight">Ledger & Transaction Logs</h3>
                  <p className="text-xs text-slate-400 font-semibold">Monitor, filter, and print detailed financial history.</p>
                </div>

                {/* Filter and Printer controls in context */}
                <div className="flex items-center gap-2">
                  
                  {/* PRINT BUTTON */}
                  <button
                    onClick={handlePrintHistory}
                    title="Print and Export Statement"
                    className="h-11 px-4 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer text-xs font-extrabold shadow-2xs"
                  >
                    <Printer className="w-4 h-4 stroke-[2.5]" />
                    <span>Print Ledger</span>
                  </button>

                  {/* FILTER TRIGGER BUTTON */}
                  <div className="relative">
                    <button
                      onClick={() => setIsFilterFloatingOpen(!isFilterFloatingOpen)}
                      className={`h-11 px-4 rounded-2xl border flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer text-xs font-extrabold shadow-2xs ${
                        typeFilter !== 'all' || statusFilter !== 'all' || startDateFilter || endDateFilter
                          ? 'text-white'
                          : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50'
                      }`}
                      style={(typeFilter !== 'all' || statusFilter !== 'all' || startDateFilter || endDateFilter) ? { backgroundColor: themeColor, borderColor: themeColor } : undefined}
                    >
                      <SlidersHorizontal className="w-4 h-4" />
                      <span>Filters</span>
                    </button>

                    {/* FLOATING FILTER BOX - ABSOLUTELY POSITIONED POPOVER CARD */}
                    {isFilterFloatingOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-3xl shadow-2xl p-4 z-40 space-y-4 animate-fade-in divide-y divide-slate-100">
                        
                        {/* Box Header */}
                        <div className="flex items-center justify-between pb-2">
                          <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Filter Criteria</h4>
                          <button
                            onClick={() => setIsFilterFloatingOpen(false)}
                            className="w-6 h-6 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Transaction Type Filters: Receive vs Send */}
                        <div className="pt-3 space-y-1.5">
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Transaction Type</span>
                          <div className="grid grid-cols-3 gap-1.5">
                            {(['all', 'received', 'sent'] as const).map((t) => (
                              <button
                                key={t}
                                onClick={() => setTypeFilter(t)}
                                type="button"
                                className={`py-2 px-1 rounded-xl text-[10px] font-black uppercase transition-all truncate ${
                                  typeFilter === t
                                    ? 'text-white shadow-xs'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                                style={typeFilter === t ? { backgroundColor: themeColor } : undefined}
                              >
                                {t === 'all' ? 'All' : t === 'received' ? 'Receive' : 'Send'}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Date Pickers for Start and End dates */}
                        <div className="pt-3 space-y-2">
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Date Range Filter</span>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-slate-400 block">Start Date</span>
                              <div className="relative">
                                <Calendar className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                                <input
                                  type="date"
                                  value={startDateFilter}
                                  onChange={(e) => setStartDateFilter(e.target.value)}
                                  className="w-full pl-7 pr-1.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[9px] font-bold text-slate-900 focus:outline-none font-mono"
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <span className="text-[9px] font-bold text-slate-400 block">End Date</span>
                              <div className="relative">
                                <Calendar className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-400" />
                                <input
                                  type="date"
                                  value={endDateFilter}
                                  onChange={(e) => setEndDateFilter(e.target.value)}
                                  className="w-full pl-7 pr-1.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-[9px] font-bold text-slate-900 focus:outline-none font-mono"
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status Filter */}
                        <div className="pt-3 space-y-1.5">
                          <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Status Badge</span>
                          <select
                            value={statusFilter}
                            onChange={(e: any) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold text-slate-700 outline-none"
                          >
                            <option value="all">ALL STATUSES</option>
                            <option value="successful">SUCCESSFUL</option>
                            <option value="pending">PENDING</option>
                            <option value="failed">FAILED</option>
                            <option value="rejected">REJECTED</option>
                          </select>
                        </div>

                        {/* Reset / Apply Actions */}
                        <div className="pt-3 flex items-center justify-between">
                          <button
                            onClick={handleResetFilters}
                            type="button"
                            className="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-wider underline cursor-pointer"
                          >
                            Clear All
                          </button>
                          <button
                            onClick={() => setIsFilterFloatingOpen(false)}
                            type="button"
                            style={{ backgroundColor: themeColor }}
                            className="text-white text-[10px] font-black uppercase tracking-wider px-4 py-2 rounded-xl shadow-md cursor-pointer"
                          >
                            Apply Filter
                          </button>
                        </div>

                      </div>
                    )}
                  </div>

                </div>
              </div>

              {/* Real-time search query bar */}
              <div className="relative">
                <Search className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by title, UTR, reason, cashback reference..."
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-offset-0 transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Segmented Inner Category Tabs: All, Payments, Add Money, Withdrawal */}
            <div className="bg-white p-1 rounded-2xl border border-slate-200/90 shadow-2xs grid grid-cols-4 gap-1">
              {(['all', 'payments', 'addmoney', 'withdrawal'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  type="button"
                  className={`py-2 rounded-xl font-black text-[10px] uppercase transition-all text-center cursor-pointer ${
                    activeTab === tab
                      ? 'text-white shadow-xs'
                      : 'bg-transparent text-slate-500 hover:text-slate-800'
                  }`}
                  style={activeTab === tab ? { backgroundColor: themeColor } : undefined}
                >
                  {tab === 'all' ? 'All' : tab === 'payments' ? 'Payments' : tab === 'addmoney' ? 'Cash In' : 'Withdraw'}
                </button>
              ))}
            </div>

            {/* List transactions view */}
            {isLoading ? (
              <div className="bg-white rounded-3xl p-10 text-center border border-slate-100 shadow-xs flex flex-col items-center justify-center gap-3">
                <Loader2 style={{ color: themeColor }} className="w-8 h-8 animate-spin" />
                <p className="text-xs font-bold text-slate-500">Loading transactions...</p>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-100 shadow-xs flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                  <History className="w-6 h-6" />
                </div>
                <p className="text-sm font-black text-slate-700">No transactions found</p>
                <p className="text-xs text-slate-400 max-w-xs font-semibold">
                  No records match your selected filters or search query. Try widening filters.
                </p>
                {(typeFilter !== 'all' || statusFilter !== 'all' || startDateFilter || endDateFilter || searchQuery) && (
                  <button
                    onClick={handleResetFilters}
                    style={{ color: themeColor }}
                    className="mt-2 text-xs font-black hover:underline cursor-pointer uppercase tracking-wider"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRecords.map((item) => {
                  const isCredit = item.isCredit || item.amount > 0;
                  const formattedAmt = Math.abs(item.amount).toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  });

                  let statusPillClass = 'bg-emerald-100/80 text-emerald-700';
                  let statusLabel = item.status || 'SUCCESSFUL';

                  if (item.status.includes('PENDING')) {
                    statusPillClass = 'bg-amber-100 text-amber-800';
                    statusLabel = 'PENDING';
                  } else if (item.status.includes('REJECT') || item.status.includes('FAIL')) {
                    statusPillClass = 'bg-rose-100 text-rose-700';
                    statusLabel = item.status.includes('REJECT') ? 'REJECTED' : 'FAILED';
                  } else if (item.status.includes('RECEIV')) {
                    statusPillClass = 'bg-emerald-100/90 text-emerald-800';
                    statusLabel = 'RECEIVED';
                  } else {
                    statusPillClass = 'bg-emerald-100/80 text-emerald-700';
                    statusLabel = 'SUCCESSFUL';
                  }

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedReceiptRecord(item)}
                      className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs flex items-center justify-between hover:border-slate-300 hover:shadow-xs active:scale-[0.99] transition-all cursor-pointer select-none group"
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        {item.sourceCollection === 'transactions' ? (
                          item.receiverProfilePicture || item.senderProfilePicture ? (
                            <img
                              src={item.receiverProfilePicture || item.senderProfilePicture}
                              alt="User Profile"
                              className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-100"
                            />
                          ) : (
                            <div 
                              style={{ backgroundColor: `${themeColor}12`, color: themeColor }}
                              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 font-black text-sm"
                            >
                              {item.title ? item.title.charAt(0).toUpperCase() : 'U'}
                            </div>
                          )
                        ) : item.sourceCollection === 'cashback' ? (
                          <div style={{ backgroundColor: `${themeColor}12` }} className="w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                            <Coins style={{ color: themeColor }} className="w-6 h-6 animate-pulse" />
                          </div>
                        ) : item.sourceCollection === 'addmoney' ? (
                          <div style={{ backgroundColor: `${themeColor}12` }} className="w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                            <Wallet style={{ color: themeColor }} className="w-6 h-6" />
                          </div>
                        ) : (
                          <div style={{ backgroundColor: `${themeColor}12` }} className="w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                            <Building2 style={{ color: themeColor }} className="w-6 h-6" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <h4 className="text-sm font-black text-slate-900 truncate">
                            {item.title || 'Transaction'}
                          </h4>
                          <p className="text-xs text-slate-500 font-semibold mt-0.5 truncate flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{item.formattedDateTime || `${item.date} • ${item.time}`}</span>
                          </p>
                          {item.subtitle && item.subtitle !== item.title ? (
                            <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          ) : null}
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex flex-col items-end">
                        <span
                          className={`text-sm sm:text-base font-black font-mono ${isCredit ? 'text-emerald-600' : 'text-slate-800'}`}
                        >
                          {isCredit ? `+ ₹${formattedAmt}` : `- ₹${formattedAmt}`}
                        </span>
                        <span className={`mt-1 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${statusPillClass}`}>
                          {statusLabel}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SECTION 3: BANK SETTLEMENT */}
        {activeSection === 'settlement' && (
          <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 tracking-tight">Bank Account Settlement</h3>
                <p className="text-xs text-slate-400 font-semibold">Verify and cash out your coin balance directly into standard banks.</p>
              </div>
              <button
                onClick={() => setIsBankModalOpen(true)}
                type="button"
                className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-black px-4 py-2 rounded-xl active:scale-95 transition-all border border-slate-200/50"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Link Bank</span>
              </button>
            </div>

            {bankLoading ? (
              <div className="p-8 text-center flex flex-col items-center justify-center gap-2">
                <Loader2 style={{ color: themeColor }} className="w-8 h-8 animate-spin" />
                <span className="text-xs font-bold text-slate-500">Retrieving linked bank details...</span>
              </div>
            ) : bankDetails ? (
              <div className="space-y-6">
                {/* Linked Bank Card */}
                <div style={{ backgroundColor: `${themeColor}08`, border: `2px solid ${themeColor}20` }} className="rounded-2xl p-4 flex justify-between items-start">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-wider block" style={{ color: themeColor }}>Linked Active Bank</span>
                    <h4 className="text-sm font-black text-slate-900">{bankDetails.bankName}</h4>
                    <p className="text-xs font-bold text-slate-600 font-mono">A/C: {bankDetails.accountNumber}</p>
                    <p className="text-xs font-semibold text-slate-500">IFSC: {bankDetails.ifscCode}</p>
                    <p className="text-xs font-semibold text-slate-400 font-mono">Holder: {bankDetails.bankHolderName}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">ACTIVE</span>
                </div>

                {/* Coin Cashout Request form */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-black text-slate-700 uppercase tracking-wide">Enter Withdrawal Coins Volume</label>
                    <div className="relative">
                      <Coins className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        value={coinsInput}
                        onChange={(e) => setCoinsInput(e.target.value.replace(/\\D/g, ''))}
                        placeholder="Minimum 100 coins"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleSubmitWithdrawal}
                    disabled={isSubmittingWithdrawal}
                    type="button"
                    style={{ backgroundColor: themeColor }}
                    className="w-full text-white font-black py-4 px-4 rounded-2xl shadow-md active:scale-95 transition-all text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <span>Request Settlement Withdrawal</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200">
                  <Building2 className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-black text-slate-800">No Bank Linked Yet</h4>
                <p className="text-xs text-slate-400 max-w-xs font-semibold">Please link your Indian bank details to proceed with balance settlements & coin conversions.</p>
                <button
                  onClick={() => setIsBankModalOpen(true)}
                  type="button"
                  style={{ backgroundColor: themeColor }}
                  className="mt-2 text-white font-black text-xs px-6 py-3 rounded-xl cursor-pointer active:scale-95 shadow-sm"
                >
                  Link Bank Account Now
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* FILTER DIALOG BACKUP IF NEEDED */}
      {/* (Can keep standard receipt and edit profile modals as children) */}

      {/* EDIT PROFILE MODAL DIALOG */}
      {isEditProfileOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in animate-duration-150">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Edit Account Details</h3>
              <button
                onClick={() => setIsEditProfileOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Full Name</span>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Email Address</span>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                type="button"
                style={{ backgroundColor: themeColor }}
                className="w-full text-white font-black text-xs py-3 rounded-2xl cursor-pointer active:scale-95 shadow-md"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LINK BANK DETAILS MODAL DIALOG */}
      {isBankModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in animate-duration-150">
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wide">Link Bank Details</h3>
              <button
                onClick={() => setIsBankModalOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Bank Holder Name</span>
                <input
                  type="text"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Bank Name</span>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  placeholder="e.g. State Bank of India"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Account Number</span>
                <input
                  type="text"
                  value={accountNum}
                  onChange={(e) => setAccountNum(e.target.value.replace(/\\D/g, ''))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-900"
                />
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">IFSC Code</span>
                <input
                  type="text"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  placeholder="e.g. SBIN0001234"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-900 uppercase"
                />
              </div>

              <button
                onClick={handleSaveBankDetails}
                type="button"
                style={{ backgroundColor: themeColor }}
                className="w-full text-white font-black text-xs py-3 rounded-2xl cursor-pointer active:scale-95 shadow-md"
              >
                Save Bank Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Transaction Receipt Modal */}
      <TransactionReceiptModal
        isOpen={!!selectedReceiptRecord}
        onClose={() => setSelectedReceiptRecord(null)}
        record={selectedReceiptRecord}
        themeColor={themeColor}
      />
    </div>
  );
}"""

# Do replacement
new_content = content[:start_idx] + new_history_code + content[end_idx:]

with open("components/FullScreenViews.tsx", "w", encoding="utf-8") as f:
    f.write(new_content)

print("Replacement successful!")
