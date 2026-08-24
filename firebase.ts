import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  collection, 
  query, 
  where, 
  updateDoc, 
  addDoc,
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "AIzaSyD_a8cbBWFfRoVMDKN26QZ2STbPmbgZKiU",
  authDomain: "contacks-9b9e4.firebaseapp.com",
  projectId: "contacks-9b9e4",
  storageBucket: "contacks-9b9e4.appspot.com",
  messagingSenderId: "37958011927",
  appId: "1:37958011927:web:gkwallet"
};

// Initialize Firebase safely
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Use auto-detect long-polling and multi-tab persistent cache to eliminate 10-second backend timeout warnings in sandboxed/iframe environments
export const db = (() => {
  try {
    return initializeFirestore(app, {
      experimentalAutoDetectLongPolling: true,
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch {
    try {
      return initializeFirestore(app, {
        experimentalAutoDetectLongPolling: true,
      });
    } catch {
      return getFirestore(app);
    }
  }
})();

export const auth = getAuth(app);

export interface UserData {
  uid: string;
  name: string;
  mobile: string;
  gmail: string;
  password?: string;
  mpin?: string; // 6-digit MPIN
  balance: string; // e.g. "0" or "500"
  status: string; // e.g. "pending" or "verified"
  account: string; // e.g. "active"
  registration_date: string;
  profile_picture: string;
  avatarUrl?: string;
  aadhaar?: string;
  aadhaar_card?: string;
  pancard?: string;
  pushNotifications?: boolean;
  biometricLock?: boolean;
  appLanguage?: string;
  themeColor?: string;
  referralCode?: string;
  referredBy?: string;
  appliedReferralCode?: string;
}

export interface AppNotification {
  id?: string;
  title: string;
  description?: string;
  image?: string;
  imageUrl?: string;
  img?: string;
  message?: string;
  desc?: string;
  body?: string;
  time?: string;
  date?: string;
  timestamp?: string;
  type?: 'system' | 'offer' | 'alert' | 'transaction' | 'payout' | 'coins' | string;
  read?: boolean;
  uid?: string;
}

export function getHiddenNotificationIds(userUid?: string): string[] {
  if (typeof window === 'undefined') return [];
  const key = `gk_hidden_notifs_${userUid || 'default'}`;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function hideNotificationForUser(notifId: string, userUid?: string) {
  if (typeof window === 'undefined' || !notifId) return;
  const key = `gk_hidden_notifs_${userUid || 'default'}`;
  try {
    const current = getHiddenNotificationIds(userUid);
    if (!current.includes(notifId)) {
      current.push(notifId);
      localStorage.setItem(key, JSON.stringify(current));
    }
  } catch (err) {
    console.warn('Error hiding notification:', err);
  }
}

export function clearHiddenNotificationsForUser(userUid?: string) {
  if (typeof window === 'undefined') return;
  const key = `gk_hidden_notifs_${userUid || 'default'}`;
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.warn('Error clearing hidden notifications:', err);
  }
}

export interface DetailedTransactionRecord {
  id?: string;
  note: string;
  receiverName: string;
  receivermobile: string;
  receiverprofilepicture: string;
  receivertransactionid: string;
  receivertype: 'receive';
  receiveruid: string;
  reciveramount: number;
  reciverdate: string;
  reciverstatus: 'successful' | 'pending' | 'failed';
  senderMobile: string;
  senderamount: number;
  senderdate: string;
  sendername: string;
  senderprofilepicture: string;
  senderstatus: 'successful' | 'pending' | 'failed';
  sendertime: string;
  sendertransactionid: string;
  sendertype: 'send';
  senderuid: string;
  timestamp: string;
}

export interface CashbackRecord {
  id?: string;
  amount: number;
  date: string;
  time: string;
  status: 'received';
  uid: string;
  reason: 'cashback';
  timestamp?: string;
}

const LOCAL_CASHBACK_KEY = 'gk_local_cashback';

export function getLocalCashbackRecords(): CashbackRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOCAL_CASHBACK_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addLocalCashbackRecord(rec: CashbackRecord) {
  if (typeof window === 'undefined') return;
  const list = getLocalCashbackRecords();
  list.unshift(rec);
  localStorage.setItem(LOCAL_CASHBACK_KEY, JSON.stringify(list));
}

export async function saveCashbackRecordToFirestore(rec: CashbackRecord): Promise<boolean> {
  try {
    addLocalCashbackRecord(rec);
    const cbRef = collection(db, 'cashback');
    await addDoc(cbRef, rec);
    return true;
  } catch (err) {
    console.error('Error saving cashback to firestore:', err);
    return false;
  }
}

export async function fetchCashbackHistoryFromFirestore(uid: string): Promise<CashbackRecord[]> {
  try {
    const cbRef = collection(db, 'cashback');
    const q = query(cbRef, where('uid', '==', uid));
    const snap = await getDocs(q);
    const results: CashbackRecord[] = [];
    snap.forEach((docSnap) => {
      results.push({ id: docSnap.id, ...(docSnap.data() as CashbackRecord) });
    });
    if (results.length > 0) return results;
  } catch (err) {
    console.warn('Firestore cashback query note:', err);
  }
  return getLocalCashbackRecords();
}

export interface CashbackConfigRule {
  amount?: number | string;
  cashback?: string | number;
  month?: number | string;
}

export async function fetchCashbackRuleFromFirestore(): Promise<CashbackConfigRule | null> {
  try {
    const cbRef = collection(db, 'Cashback');
    const snap = await getDocs(cbRef);
    if (!snap.empty) {
      const docData = snap.docs[0].data();
      return {
        amount: docData.amount ?? 100,
        cashback: docData.cashback ?? '0.2%-1%',
        month: docData.month ?? 12
      };
    }
    const cbRefLower = collection(db, 'cashback');
    const snapLower = await getDocs(cbRefLower);
    let foundRule: CashbackConfigRule | null = null;
    snapLower.forEach((docSnap) => {
      const d = docSnap.data();
      if (d.month !== undefined || d.amount !== undefined || d.cashback !== undefined) {
        foundRule = {
          amount: d.amount ?? 100,
          cashback: d.cashback ?? '0.2%-1%',
          month: d.month ?? 12
        };
      }
    });
    if (foundRule) return foundRule;
  } catch (err) {
    console.warn('Firestore cashback rule query note:', err);
  }
  return null;
}

export async function calculateDynamicCashback(transactedAmount: number): Promise<{
  cashbackCoins: number;
  percentageUsed: number;
  isEligible: boolean;
  reason?: string;
}> {
  const rule = await fetchCashbackRuleFromFirestore();
  
  const minAmount = rule?.amount !== undefined ? parseFloat(rule.amount.toString()) : 100;
  const monthVal = rule?.month !== undefined ? parseInt(rule.month.toString(), 10) : 12;
  const cashbackStr = rule?.cashback ? rule.cashback.toString() : '0.2%-1%';

  if (monthVal <= 0) {
    return {
      cashbackCoins: 0,
      percentageUsed: 0,
      isEligible: false,
      reason: 'Cashback offer expired (month 0)'
    };
  }

  if (transactedAmount < minAmount) {
    return {
      cashbackCoins: 0,
      percentageUsed: 0,
      isEligible: false,
      reason: `Amount below minimum requirement (₹${minAmount})`
    };
  }

  let minPct = 0.2;
  let maxPct = 1.0;

  const matches = cashbackStr.match(/\d+(\.\d+)?/g);
  if (matches && matches.length >= 2) {
    minPct = parseFloat(matches[0]);
    maxPct = parseFloat(matches[1]);
  } else if (matches && matches.length === 1) {
    minPct = 0.2;
    maxPct = parseFloat(matches[0]);
  }

  const randomPct = Math.random() * (maxPct - minPct) + minPct;
  const coins = parseFloat(((transactedAmount * randomPct) / 100).toFixed(2));

  return {
    cashbackCoins: coins,
    percentageUsed: parseFloat(randomPct.toFixed(2)),
    isEligible: true
  };
}

export async function fetchDetailedTransactionsFromFirestore(uid?: string): Promise<DetailedTransactionRecord[]> {
  try {
    const txRef = collection(db, 'transactions');
    let snap;
    if (uid) {
      const q = query(txRef, where('senderuid', '==', uid));
      snap = await getDocs(q);
      if (snap.empty) {
        const q2 = query(txRef, where('receiveruid', '==', uid));
        snap = await getDocs(q2);
      }
    } else {
      snap = await getDocs(txRef);
    }

    const results: DetailedTransactionRecord[] = [];
    snap.forEach((docSnap) => {
      results.push({ ...(docSnap.data() as DetailedTransactionRecord) });
    });
    if (results.length > 0) return results;
  } catch (err) {
    console.warn('Firestore transactions fetch note:', err);
  }
  return [];
}

export interface FirestoreSliderItem {
  id?: string;
  image: string;
  url?: string;
}

export async function fetchSliderImagesFromFirestore(): Promise<string[]> {
  try {
    const sliderRef = collection(db, 'slider');
    const snap = await getDocs(sliderRef);
    const imgs: string[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      const image = data?.image || data?.imageUrl || data?.img || data?.src || '';
      if (image) {
        imgs.push(image);
      }
    });
    if (imgs.length > 0) return imgs;
  } catch (err) {
    console.warn('Firestore slider query note:', err);
  }
  return [];
}

export async function fetchSliderItemsFromFirestore(): Promise<FirestoreSliderItem[]> {
  try {
    const sliderRef = collection(db, 'slider');
    const snap = await getDocs(sliderRef);
    const list: FirestoreSliderItem[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      const image = data?.image || data?.imageUrl || data?.img || data?.src || '';
      const url = data?.url || data?.link || data?.redirectUrl || data?.href || '';
      if (image) {
        list.push({
          id: docSnap.id,
          image,
          url
        });
      }
    });
    if (list.length > 0) return list;
  } catch (err) {
    console.warn('Firestore slider query note:', err);
  }
  return [];
}

export function subscribeToSliderItems(callback: (items: FirestoreSliderItem[]) => void): () => void {
  try {
    const sliderRef = collection(db, 'slider');
    return onSnapshot(sliderRef, (snap) => {
      const list: FirestoreSliderItem[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        const image = data?.image || data?.imageUrl || data?.img || data?.src || '';
        const url = data?.url || data?.link || data?.redirectUrl || data?.href || '';
        if (image) {
          list.push({
            id: docSnap.id,
            image,
            url
          });
        }
      });
      callback(list);
    }, (err) => {
      console.warn('Firestore slider realtime snapshot note:', err);
    });
  } catch (err) {
    console.warn('subscribeToSliderItems error:', err);
    return () => {};
  }
}

export async function fetchBestOfferItemsFromFirestore(): Promise<FirestoreSliderItem[]> {
  try {
    const colRef = collection(db, 'bestoffer');
    const snap = await getDocs(colRef);
    const list: FirestoreSliderItem[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      const image = data?.image || '';
      const url = data?.url || '';
      if (image) {
        list.push({
          id: docSnap.id,
          image,
          url
        });
      }
    });
    return list;
  } catch (err) {
    console.warn('Firestore bestoffer query error:', err);
  }
  return [];
}

export function subscribeToBestOfferItems(callback: (items: FirestoreSliderItem[]) => void): () => void {
  try {
    const colRef = collection(db, 'bestoffer');
    return onSnapshot(colRef, (snap) => {
      const list: FirestoreSliderItem[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        const image = data?.image || '';
        const url = data?.url || '';
        if (image) {
          list.push({
            id: docSnap.id,
            image,
            url
          });
        }
      });
      callback(list);
    }, (err) => {
      console.warn('Firestore bestoffer realtime snapshot error:', err);
      callback([]);
    });
  } catch (err) {
    console.warn('subscribeToBestOfferItems error:', err);
    callback([]);
    return () => {};
  }
}

export interface NftBankAccount {
  id?: string;
  accountNumber: string;
  bankHolderName: string;
  ifscCode: string;
  bankName: string;
  mobile: string;
  uid: string;
}

export async function saveNftBankAccountToFirestore(data: NftBankAccount): Promise<boolean> {
  try {
    const colRef = collection(db, 'nftbank');
    await addDoc(colRef, {
      "acount number": data.accountNumber,
      accountNumber: data.accountNumber,
      bankHolderName: data.bankHolderName,
      "ifsc code": data.ifscCode,
      ifscCode: data.ifscCode,
      "bank name": data.bankName,
      bankName: data.bankName,
      mobile: data.mobile,
      uid: data.uid,
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (err) {
    console.error('Error saving nftbank account:', err);
    return false;
  }
}

export async function fetchNftBankAccountsByMobile(mobile: string): Promise<NftBankAccount[]> {
  try {
    const colRef = collection(db, 'nftbank');
    const q = query(colRef, where('mobile', '==', mobile));
    const snap = await getDocs(q);
    const list: NftBankAccount[] = [];
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      list.push({
        id: docSnap.id,
        accountNumber: d["acount number"] || d.accountNumber || '',
        bankHolderName: d.bankHolderName || '',
        ifscCode: d["ifsc code"] || d.ifscCode || '',
        bankName: d["bank name"] || d.bankName || '',
        mobile: d.mobile || '',
        uid: d.uid || ''
      });
    });
    return list;
  } catch (err) {
    console.error('Error fetching nftbank accounts:', err);
    return [];
  }
}

export interface NftTransactionRecord {
  accountNumber: string;
  bankHolderName: string;
  ifscCode: string;
  bankName: string;
  mobile: string;
  amount: number;
  status: string; // "pending"
  date: string;
  time: string;
  reason: string;
  uid: string;
}

export async function saveNftTransactionToFirestore(data: NftTransactionRecord): Promise<boolean> {
  try {
    const colRef = collection(db, 'nft');
    await addDoc(colRef, {
      "acount number": data.accountNumber,
      accountNumber: data.accountNumber,
      bankHolderName: data.bankHolderName,
      "ifsc code": data.ifscCode,
      ifscCode: data.ifscCode,
      "bank name": data.bankName,
      bankName: data.bankName,
      mobile: data.mobile,
      amount: data.amount,
      status: "pending",
      date: data.date,
      time: data.time,
      reason: data.reason || "NFT Transfer",
      uid: data.uid,
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (err) {
    console.error('Error saving nft transaction:', err);
    return false;
  }
}

export interface AddMoneyRecord {
  id?: string;
  walletIcon?: string;
  utr: string;
  image?: string;
  amount: number;
  date: string;
  time: string;
  status: string; // "pending"
  uid: string;
  mobile?: string;
}

const LOCAL_ADDMONEY_KEY = 'gk_local_addmoney';

export function getLocalAddMoneyRecords(): AddMoneyRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOCAL_ADDMONEY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addLocalAddMoneyRecord(rec: AddMoneyRecord) {
  if (typeof window === 'undefined') return;
  const list = getLocalAddMoneyRecords();
  list.unshift(rec);
  localStorage.setItem(LOCAL_ADDMONEY_KEY, JSON.stringify(list));
}

export async function saveAddMoneyToFirestore(data: AddMoneyRecord): Promise<boolean> {
  try {
    addLocalAddMoneyRecord(data);
    const colRef = collection(db, 'addmoney');
    await addDoc(colRef, {
      walletIcon: data.walletIcon || "wallet",
      "wallet icon": data.walletIcon || "wallet",
      utr: data.utr,
      image: data.image || '',
      amount: Number(data.amount),
      date: data.date,
      time: data.time,
      status: data.status || "pending",
      uid: data.uid,
      mobile: data.mobile || '',
      createdAt: new Date().toISOString()
    });
    return true;
  } catch (err) {
    console.error('Error saving addmoney transaction:', err);
    return false;
  }
}

function extractUpiFromData(data: any): string | null {
  if (!data) return null;
  if (typeof data === 'string' && data.includes('@')) return data.trim();
  
  const possibleKeys = ['upi', 'UPI', 'upiId', 'upi_id', 'upiNumber', 'upi_number', 'pay_upi', 'vpa', 'number', 'payUpi', 'upi_address'];
  for (const k of possibleKeys) {
    if (data[k] && typeof data[k] === 'string' && data[k].trim()) {
      return data[k].trim();
    }
  }
  
  // Search any string property containing '@'
  for (const key of Object.keys(data)) {
    const val = data[key];
    if (typeof val === 'string' && val.includes('@')) {
      return val.trim();
    }
  }
  return null;
}

export async function fetchPaymentUpiFromFirestore(): Promise<string | null> {
  try {
    // 1. Check 'Payment' collection
    const colRef = collection(db, 'Payment');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      for (const d of snap.docs) {
        const upi = extractUpiFromData(d.data());
        if (upi) return upi;
      }
    }

    // 2. Check doc 'Payment/upi', 'Payment/details', 'Payment/payment', 'Payment/1', etc.
    const docNames = ['upi', 'details', 'payment', 'Payment', '1', '0', 'default', 'UPI'];
    for (const dName of docNames) {
      try {
        const dSnap = await getDoc(doc(db, 'Payment', dName));
        if (dSnap.exists()) {
          const upi = extractUpiFromData(dSnap.data());
          if (upi) return upi;
        }
      } catch (e) {}
    }

    // 3. Check 'payment' collection (lowercase)
    const colRefLower = collection(db, 'payment');
    const snapLower = await getDocs(colRefLower);
    if (!snapLower.empty) {
      for (const d of snapLower.docs) {
        const upi = extractUpiFromData(d.data());
        if (upi) return upi;
      }
    }

    // 4. Check doc 'payment/upi', etc.
    for (const dName of docNames) {
      try {
        const dSnap = await getDoc(doc(db, 'payment', dName));
        if (dSnap.exists()) {
          const upi = extractUpiFromData(dSnap.data());
          if (upi) return upi;
        }
      } catch (e) {}
    }
  } catch (e) {
    console.warn('Error fetching Payment upi:', e);
  }
  return null;
}

export function subscribeToPaymentUpiFromFirestore(callback: (upi: string | null) => void): () => void {
  let unsub1: (() => void) | null = null;
  let unsub2: (() => void) | null = null;

  try {
    const colRef = collection(db, 'Payment');
    unsub1 = onSnapshot(colRef, (snap) => {
      let foundUpi: string | null = null;
      if (!snap.empty) {
        for (const d of snap.docs) {
          const upi = extractUpiFromData(d.data());
          if (upi) {
            foundUpi = upi;
            break;
          }
        }
      }
      callback(foundUpi);
    }, (err) => console.warn('Payment listener note:', err));

    const colRefLower = collection(db, 'payment');
    unsub2 = onSnapshot(colRefLower, (snap) => {
      let foundUpi: string | null = null;
      if (!snap.empty) {
        for (const d of snap.docs) {
          const upi = extractUpiFromData(d.data());
          if (upi) {
            foundUpi = upi;
            break;
          }
        }
      }
      if (foundUpi) callback(foundUpi);
    }, (err) => console.warn('payment listener note:', err));
  } catch (e) {
    console.warn('Subscribe payment upi note:', e);
  }

  return () => {
    if (unsub1) unsub1();
    if (unsub2) unsub2();
  };
}

export interface UnifiedTransactionRecord {
  id: string;
  sourceCollection: 'cashback' | 'nft' | 'ntt' | 'addmoney' | 'transactions' | 'withdrawal';
  amount: number;
  date: string;
  time: string;
  formattedDateTime?: string; // e.g. "2026-08-12 • 9:57:32 PM"
  status: string; // 'SUCCESS' | 'SUCCESSFUL' | 'RECEIVED' | 'PENDING' | 'REJECTED' | 'FAILED'
  title: string;
  subtitle: string;
  typeBadge: string;
  isCredit: boolean;

  // Partner User Information (The OTHER User involved in transaction, NOT the logged-in user)
  partnerName?: string;
  partnerProfilePicture?: string;
  partnerUid?: string;
  partnerMobile?: string;

  // cashback specific
  reason?: string;
  coinIcon?: string;

  // ntt / nft / withdrawal specific
  bankIcon?: string;
  accountNumber?: string;
  bankHolderName?: string;
  bankName?: string;
  ifscCode?: string;

  // addmoney specific
  utr?: string;
  image?: string;
  walletIcon?: string;

  // transactions specific
  transactionId?: string;
  senderName?: string;
  senderMobile?: string;
  senderProfilePicture?: string;
  receiverName?: string;
  receiverMobile?: string;
  receiverProfilePicture?: string;
  note?: string;

  timestampSort: number; // unix time for sorting
}

/**
 * Clean Date-Time Formatter to format timestamps as "YYYY-MM-DD • h:mm:ss A"
 */
export function formatTransactionDateTime(dateStr?: string, timeStr?: string, isoTimestamp?: string): string {
  if (isoTimestamp) {
    try {
      const d = new Date(isoTimestamp);
      if (!isNaN(d.getTime())) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const timePart = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
        return `${year}-${month}-${day} • ${timePart}`;
      }
    } catch {}
  }

  if (dateStr && timeStr) {
    const cleanDate = dateStr.replace(/,/g, '').trim();
    const cleanTime = timeStr.trim();
    return `${cleanDate} • ${cleanTime}`;
  }

  if (dateStr) return dateStr;
  return 'Just now';
}

export async function fetchAllUnifiedTransactionsFromFirestore(uid?: string, userMobile?: string): Promise<UnifiedTransactionRecord[]> {
  const unifiedList: UnifiedTransactionRecord[] = [];
  const seenIds = new Set<string>();

  // Helper filter function for logged in user
  const isUserMatch = (docData: any) => {
    if (!uid && !userMobile) return true;
    const docUid = docData.uid || docData.userId || docData.user_id || docData.senderuid || docData.senderUid || docData.sender_uid || docData.receiveruid || docData.reciveruid || docData.receiverUid || docData.receiver_uid;
    const docMobile = docData.mobile || docData.senderMobile || docData.sendermobile || docData.sender_mobile || docData.receivermobile || docData.recivermobile || docData.receiverMobile;

    if (uid && docUid === uid) return true;
    if (userMobile && docMobile === userMobile) return true;
    if (uid && (
      docData.senderuid === uid ||
      docData.senderUid === uid ||
      docData.sender_uid === uid ||
      docData.fromUid === uid ||
      docData.receiveruid === uid ||
      docData.reciveruid === uid ||
      docData.receiverUid === uid ||
      docData.toUid === uid
    )) return true;

    if (userMobile && (
      docData.senderMobile === userMobile ||
      docData.sendermobile === userMobile ||
      docData.sender_mobile === userMobile ||
      docData.receivermobile === userMobile ||
      docData.recivermobile === userMobile ||
      docData.receiverMobile === userMobile ||
      docData.toMobile === userMobile
    )) return true;

    return false;
  };

  // 1. FETCH FROM 'cashback' COLLECTION
  try {
    const cbRef = collection(db, 'cashback');
    const snap = uid ? await getDocs(query(cbRef, where('uid', '==', uid))) : await getDocs(cbRef);
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      const id = docSnap.id;
      if (!isUserMatch(d)) return;
      seenIds.add(id);

      const amt = parseFloat(d.amount) || 0;
      const dateStr = d.date || '18/08/2026';
      const timeStr = d.time || '12:00 AM';

      unifiedList.push({
        id: id,
        sourceCollection: 'cashback',
        amount: amt,
        date: dateStr,
        time: timeStr,
        status: String(d.status || 'received').toUpperCase(),
        reason: d.reason || 'Cashback Received',
        title: 'Cashback Reward',
        subtitle: 'Cashback Received',
        typeBadge: 'CASHBACK REWARD',
        isCredit: true,
        coinIcon: d.coinIcon || d["coin icon"] || '',
        transactionId: d.transactionId || id.slice(0, 16),
        senderName: 'Smart Wallet Cashback',
        senderMobile: 'System Rewards',
        receiverName: 'Cashback Bonus',
        receiverMobile: uid || userMobile || 'User',
        timestampSort: new Date(`${dateStr} ${timeStr}`).getTime() || Date.now()
      });
    });
  } catch (e) {
    console.warn('Error fetching cashback for unified transactions:', e);
  }

  // Fallback to local cashback if empty
  if (unifiedList.filter(x => x.sourceCollection === 'cashback').length === 0) {
    const localCb = getLocalCashbackRecords();
    localCb.forEach((cb, idx) => {
      const id = cb.id || `local_cb_${idx}_${cb.time}`;
      if (!seenIds.has(id)) {
        if (!isUserMatch(cb)) return;
        seenIds.add(id);
        unifiedList.push({
          id,
          sourceCollection: 'cashback',
          amount: cb.amount,
          date: cb.date,
          time: cb.time,
          status: 'RECEIVED',
          reason: cb.reason || 'Cashback Received',
          title: 'Cashback Reward',
          subtitle: 'Cashback Received',
          typeBadge: 'CASHBACK REWARD',
          isCredit: true,
          transactionId: id,
          senderName: 'Smart Wallet Cashback',
          senderMobile: 'System Rewards',
          receiverName: 'Cashback Bonus',
          receiverMobile: cb.uid || userMobile || 'User',
          timestampSort: new Date(`${cb.date} ${cb.time}`).getTime() || Date.now()
        });
      }
    });
  }

  // 2. FETCH FROM 'ntt' AND 'nft' COLLECTIONS
  for (const colName of ['ntt', 'nft']) {
    try {
      const nttRef = collection(db, colName);
      const snap = uid ? await getDocs(query(nttRef, where('uid', '==', uid))) : await getDocs(nttRef);
      snap.forEach((docSnap) => {
        const d = docSnap.data();
        const id = docSnap.id;
        if (!seenIds.has(id)) {
          if (!isUserMatch(d)) return;
          seenIds.add(id);
          const amt = parseFloat(d.amount) || 0;
          const bankName = d.bankName || d["bank name"] || 'Bank Account';
          const accNum = d.acountNumber || d.accountNumber || d["acount number"] || d["account number"] || '';
          const holderName = d.bankHolderName || 'Account Holder';
          const dateStr = d.date || '18/08/2026';
          const timeStr = d.time || '12:00 AM';

          unifiedList.push({
            id: id,
            sourceCollection: 'ntt',
            amount: amt,
            date: dateStr,
            time: timeStr,
            status: String(d.status || 'SUCCESSFUL').toUpperCase(),
            reason: d.reason || 'Bank Transfer',
            title: holderName || bankName,
            subtitle: `A/C: ${accNum ? '•••• ' + accNum.slice(-4) : 'Bank Transfer'}`,
            typeBadge: 'BANK TRANSFER',
            isCredit: false,
            bankIcon: d.bankIcon || d["bank icon"] || '',
            accountNumber: accNum,
            bankHolderName: holderName,
            bankName: bankName,
            ifscCode: d.ifscCode || d["ifsc code"] || '',
            transactionId: id,
            senderName: holderName,
            senderMobile: d.mobile || '',
            receiverName: bankName,
            receiverMobile: accNum,
            timestampSort: new Date(`${dateStr} ${timeStr}`).getTime() || Date.now()
          });
        }
      });
    } catch (e) {
      console.warn(`Error fetching ${colName} for unified transactions:`, e);
    }
  }

  // 3. FETCH FROM 'withdrawal' COLLECTION
  try {
    const wRef = collection(db, 'withdrawal');
    const snap = uid ? await getDocs(query(wRef, where('uid', '==', uid))) : await getDocs(wRef);
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      const id = docSnap.id;
      if (!seenIds.has(id)) {
        if (!isUserMatch(d)) return;
        seenIds.add(id);
        const amt = parseFloat(d.amount) || 0;
        const bankName = d.bankName || d["bank name"] || 'Bank Account';
        const accNum = d.accountNumber || d.acountNumber || d["account number"] || '';
        const holderName = d.bankHolderName || 'Account Holder';
        const dateStr = d.date || '18/08/2026';
        const timeStr = d.time || '12:00 AM';

        unifiedList.push({
          id: id,
          sourceCollection: 'withdrawal',
          amount: amt,
          date: dateStr,
          time: timeStr,
          status: String(d.status || 'PENDING').toUpperCase(),
          reason: 'Bank Withdrawal',
          title: `Withdrawal (${bankName})`,
          subtitle: `A/C: ${accNum ? '•••• ' + accNum.slice(-4) : holderName}`,
          typeBadge: 'WITHDRAWAL',
          isCredit: false,
          bankIcon: d.bankIcon || d["bank icon"] || '',
          accountNumber: accNum,
          bankHolderName: holderName,
          bankName: bankName,
          transactionId: id,
          senderName: 'Smart Wallet',
          receiverName: holderName,
          timestampSort: new Date(`${dateStr} ${timeStr}`).getTime() || Date.now()
        });
      }
    });
  } catch (e) {
    console.warn('Error fetching withdrawal collection:', e);
  }

  // 4. FETCH FROM 'addmoney' COLLECTION
  try {
    const addRef = collection(db, 'addmoney');
    const snap = uid ? await getDocs(query(addRef, where('uid', '==', uid))) : await getDocs(addRef);
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      const id = docSnap.id;
      if (!seenIds.has(id)) {
        if (!isUserMatch(d)) return;
        seenIds.add(id);
        const amt = parseFloat(d.amount) || 0;
        const dateStr = d.date || '18/08/2026';
        const timeStr = d.time || '12:00 AM';
        const utrVal = d.utr || '';

        unifiedList.push({
          id: id,
          sourceCollection: 'addmoney',
          amount: amt,
          date: dateStr,
          time: timeStr,
          status: String(d.status || 'pending').toUpperCase(),
          reason: 'Add Money UTR Deposit',
          title: 'Add Money Request',
          subtitle: utrVal ? `UTR: ${utrVal}` : 'UPI / Netbanking',
          typeBadge: 'ADD MONEY UTR',
          isCredit: true,
          utr: utrVal,
          image: d.image || '',
          walletIcon: d.walletIcon || d["wallet icon"] || '',
          transactionId: utrVal || id,
          senderName: 'User Deposit (UPI/Bank)',
          senderMobile: d.mobile || '',
          receiverName: 'Smart Wallet Balance',
          receiverMobile: uid || userMobile || 'User',
          timestampSort: new Date(`${dateStr} ${timeStr}`).getTime() || Date.now()
        });
      }
    });
  } catch (e) {
    console.warn('Error fetching addmoney for unified transactions:', e);
  }

  // Local addmoney fallback if empty
  if (unifiedList.filter(x => x.sourceCollection === 'addmoney').length === 0) {
    const localAdd = getLocalAddMoneyRecords();
    localAdd.forEach((add, idx) => {
      const id = add.id || `local_add_${idx}_${add.time}`;
      if (!seenIds.has(id)) {
        if (!isUserMatch(add)) return;
        seenIds.add(id);
        unifiedList.push({
          id,
          sourceCollection: 'addmoney',
          amount: add.amount,
          date: add.date,
          time: add.time,
          status: String(add.status || 'pending').toUpperCase(),
          reason: 'Add Money UTR Deposit',
          title: 'Add Money Request',
          subtitle: add.utr ? `UTR: ${add.utr}` : 'UPI / Netbanking',
          typeBadge: 'ADD MONEY UTR',
          isCredit: true,
          utr: add.utr,
          image: add.image,
          transactionId: add.utr || id,
          senderName: 'User Deposit (UPI/Bank)',
          senderMobile: add.mobile || '',
          receiverName: 'Smart Wallet Balance',
          receiverMobile: add.uid || userMobile || 'User',
          timestampSort: new Date(`${add.date} ${add.time}`).getTime() || Date.now()
        });
      }
    });
  }

  // 5. FETCH FROM 'transactions' COLLECTION
  try {
    const txRef = collection(db, 'transactions');
    const snap = await getDocs(txRef);
    snap.forEach((docSnap) => {
      const d = docSnap.data();
      const id = docSnap.id;
      if (!seenIds.has(id)) {
        if (!isUserMatch(d)) return;
        seenIds.add(id);

        const sUid = d.senderuid || d.senderUid || d.sender_uid || d.fromUid || d.from_uid || d.senderId || '';
        const sMobile = d.senderMobile || d.sendermobile || d.sender_mobile || d.fromMobile || '';
        const sName = d.sendername || d.senderName || d.sender_name || d.fromName || d.sender || 'Member';
        const sPic = d.senderprofilepicture || d.senderProfilePicture || d.sender_profile_picture || d.senderPhoto || d.senderPic || d.senderAvatar || '';

        const rUid = d.receiveruid || d.reciveruid || d.receiverUid || d.receiver_uid || d.toUid || d.to_uid || d.receiverId || '';
        const rMobile = d.receivermobile || d.recivermobile || d.receiverMobile || d.receiver_mobile || d.toMobile || '';
        const rName = d.receiverName || d.reciverName || d.receivername || d.recivername || d.receiver_name || d.toName || d.receiver || d.reciver || 'Recipient';
        const rPic = d.receiverprofilepicture || d.reciverprofilepicture || d.receiverProfilePicture || d.reciverProfilePicture || d.receiver_profile_picture || d.receiverPhoto || d.receiverAvatar || d.receiverPic || '';

        // Determine if logged-in user is sender or receiver
        let isSend = false;
        if (uid && sUid === uid) {
          isSend = true;
        } else if (userMobile && sMobile === userMobile) {
          isSend = true;
        } else if (uid && (rUid === uid)) {
          isSend = false;
        } else if (userMobile && (rMobile === userMobile)) {
          isSend = false;
        } else if (d.sendertype === 'send' || d.type === 'send') {
          isSend = true;
        } else if (d.receivertype === 'receive' || d.recivertype === 'receive' || d.type === 'receive') {
          isSend = false;
        }

        // Selected partner info (The OTHER user, NOT the logged in user)
        const partnerDisplayName = isSend ? rName : sName;
        const partnerPic = isSend ? rPic : sPic;
        const partnerUserUid = isSend ? rUid : sUid;
        const partnerUserMobile = isSend ? rMobile : sMobile;

        const amt = parseFloat(d.reciveramount || d.receiveramount || d.senderamount || d.amount) || 0;
        const dateStr = d.reciverdate || d.receiverdate || d.senderdate || d.date || '18/08/2026';
        const timeStr = d.sendertime || d.recivertime || d.time || '12:00 AM';
        const rawStatus = d.reciverstatus || d.receiverstatus || d.senderstatus || d.status || 'success';
        const normStatus = String(rawStatus).toUpperCase().includes('SUCC') 
          ? 'SUCCESS' 
          : String(rawStatus).toUpperCase().includes('PEND') 
          ? 'PENDING' 
          : String(rawStatus).toUpperCase().includes('FAIL') || String(rawStatus).toUpperCase().includes('REJ')
          ? 'FAILED'
          : 'SUCCESS';

        const formattedDT = formatTransactionDateTime(dateStr, timeStr, d.timestamp || d.createdAt);

        unifiedList.push({
          id: id,
          sourceCollection: 'transactions',
          amount: amt,
          date: dateStr,
          time: timeStr,
          formattedDateTime: formattedDT,
          status: normStatus,
          reason: d.note || (isSend ? 'Coin Transfer' : 'Coin Received'),
          title: partnerDisplayName,
          subtitle: partnerUserMobile || (isSend ? 'Transfer Sent' : 'Transfer Received'),
          typeBadge: isSend ? 'COIN TRANSFER' : 'COIN RECEIVED',
          isCredit: !isSend,
          partnerName: partnerDisplayName,
          partnerProfilePicture: partnerPic,
          partnerUid: partnerUserUid,
          partnerMobile: partnerUserMobile,
          transactionId: d.sendertransactionid || d.receivertransactionid || id,
          senderName: sName,
          senderMobile: sMobile,
          senderProfilePicture: sPic,
          receiverName: rName,
          receiverMobile: rMobile,
          receiverProfilePicture: rPic,
          note: d.note || '',
          timestampSort: new Date(`${dateStr} ${timeStr}`).getTime() || (d.timestamp ? new Date(d.timestamp).getTime() : Date.now())
        });
      }
    });
  } catch (e) {
    console.warn('Error fetching transactions collection:', e);
  }

  // Sort descending by timestamp
  unifiedList.sort((a, b) => b.timestampSort - a.timestampSort);

  return unifiedList;
}

export interface TransactionData {
  id?: string;
  senderUid: string;
  senderName: string;
  receiverMobileOrEmail: string;
  receiverName?: string;
  amount: number;
  type: 'send' | 'receive' | 'add' | 'recharge' | 'referral' | 'settlement';
  title: string;
  status: 'success' | 'pending' | 'failed';
  timestamp: string;
}

const LOCAL_USERS_KEY = 'gkwallet_local_users';
const LOCAL_CURRENT_USER_KEY = 'gkwallet_current_user';
const LOCAL_TRANSACTIONS_KEY = 'gkwallet_transactions';

// Get local users array
function getLocalUsers(): UserData[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOCAL_USERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Save local users array
function saveLocalUsers(users: UserData[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error('LocalStorage save error', e);
  }
}

// Get local transactions
export function getLocalTransactions(): TransactionData[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem(LOCAL_TRANSACTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Save local transaction
function addLocalTransaction(tx: TransactionData) {
  if (typeof window === 'undefined') return;
  const list = getLocalTransactions();
  list.unshift(tx);
  localStorage.setItem(LOCAL_TRANSACTIONS_KEY, JSON.stringify(list));
}

/**
 * Register new user in Firestore and Local Storage
 */
export async function registerUserInFirestore(userPayload: Omit<UserData, 'uid' | 'balance' | 'status' | 'account' | 'registration_date' | 'profile_picture'> & { profile_picture?: string }): Promise<UserData> {
  const generatedUid = 'gk_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
  const nowStr = new Date().toISOString();
  
  const defaultAvatar = userPayload.profile_picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userPayload.name || 'User')}`;

  const newUser: UserData = {
    uid: generatedUid,
    name: userPayload.name,
    mobile: userPayload.mobile,
    gmail: userPayload.gmail,
    password: userPayload.password || '',
    balance: "0",
    status: "pending",
    account: "active",
    registration_date: nowStr,
    profile_picture: defaultAvatar
  };

  // 1. Save to LocalStorage for instant UI reliability
  const localUsers = getLocalUsers();
  // check duplicate
  const existing = localUsers.find(u => u.gmail.toLowerCase() === userPayload.gmail.toLowerCase() || u.mobile === userPayload.mobile);
  if (existing) {
    // update existing
    Object.assign(existing, newUser);
  } else {
    localUsers.push(newUser);
  }
  saveLocalUsers(localUsers);
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_CURRENT_USER_KEY, JSON.stringify(newUser));
  }

  // 2. Save directly to Firestore Cloud Database
  try {
    const userRef = doc(db, 'users', generatedUid);
    await setDoc(userRef, newUser);
    console.log('User saved to Firestore users collection successfully:', generatedUid);
  } catch (err) {
    console.warn('Firestore write warning (using local fallback if network blocked):', err);
  }

  return newUser;
}

/**
 * Update user profile in Firestore and Local Storage
 */
export async function updateUserProfileInFirestore(
  uid: string,
  partialData: Partial<UserData>
): Promise<UserData> {
  let stored: UserData = {
    uid,
    name: 'User',
    mobile: '9000000000',
    gmail: 'user@gkwallet.com',
    balance: '0',
    status: 'verified',
    account: 'active',
    registration_date: new Date().toISOString(),
    profile_picture: ''
  };

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(LOCAL_CURRENT_USER_KEY);
      if (saved) stored = JSON.parse(saved);
    } catch (e) {
      console.warn('LocalStorage parse warning:', e);
    }
  }

  const updatedUser: UserData = { ...stored, ...partialData };

  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_CURRENT_USER_KEY, JSON.stringify(updatedUser));
  }

  const localUsers = getLocalUsers();
  const idx = localUsers.findIndex(u => u.uid === uid);
  if (idx !== -1) {
    localUsers[idx] = { ...localUsers[idx], ...partialData };
    saveLocalUsers(localUsers);
  }

  try {
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, partialData, { merge: true });
    console.log('User profile updated successfully in Firestore users collection:', uid);
  } catch (err) {
    console.warn('Firestore updateDoc warning (used local fallback):', err);
  }

  return updatedUser;
}

/**
 * KYC Data Interface matching Cloud Firestore schema:
 * kyc: name, distinct, aadharCard, pancard, gmail, aadharBackPic, aadharFrontPic, panPic, pincode, state, address, mobile, status, uid
 */
export interface KycData {
  uid: string;
  name: string;
  mobile: string;
  gmail: string;
  aadharCard: string;
  pancard: string;
  aadharFrontPic?: string;
  aadharBackPic?: string;
  panPic?: string;
  pincode: string;
  state: string;
  distinct: string;
  address: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

const LOCAL_KYC_KEY = 'gk_wallet_kyc_data_v1';

/**
 * Save KYC Data to Cloud Firestore kyc collection and Local Storage
 */
export async function saveKycToFirestore(data: KycData): Promise<KycData> {
  const fullData: KycData = {
    ...data,
    status: data.status || 'pending',
    updatedAt: new Date().toISOString(),
    createdAt: data.createdAt || new Date().toISOString(),
  };

  // 1. Save to LocalStorage
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(`${LOCAL_KYC_KEY}_${data.uid}`, JSON.stringify(fullData));
      localStorage.setItem(LOCAL_KYC_KEY, JSON.stringify(fullData));
    } catch (e) {
      console.warn('LocalStorage write error for KYC:', e);
    }
  }

  // 2. Save to Firestore kyc collection
  try {
    const kycRef = doc(db, 'kyc', data.uid);
    await setDoc(kycRef, {
      name: fullData.name || '',
      distinct: fullData.distinct || '',
      aadharCard: fullData.aadharCard || '',
      pancard: fullData.pancard || '',
      gmail: fullData.gmail || '',
      aadharBackPic: fullData.aadharBackPic || '',
      aadharFrontPic: fullData.aadharFrontPic || '',
      panPic: fullData.panPic || '',
      pincode: fullData.pincode || '',
      state: fullData.state || '',
      address: fullData.address || '',
      mobile: fullData.mobile || '',
      status: 'pending',
      uid: fullData.uid,
      createdAt: fullData.createdAt || new Date().toISOString(),
      updatedAt: fullData.updatedAt || new Date().toISOString(),
    }, { merge: true });

    // Also update users collection status
    const userRef = doc(db, 'users', data.uid);
    await setDoc(userRef, {
      status: 'pending',
      aadhaar: fullData.aadharCard,
      pancard: fullData.pancard,
    }, { merge: true });

    console.log('KYC successfully saved to Cloud Firestore kyc collection:', data.uid);
  } catch (err) {
    console.warn('Firestore KYC write warning (using local fallback):', err);
  }

  return fullData;
}

/**
 * Fetch KYC Data directly from Cloud Firestore 'kyc' collection
 */
export async function fetchKycFromFirestore(uid: string, mobile?: string): Promise<KycData | null> {
  if (!uid && !mobile) return null;

  // 1. Query Cloud Firestore 'kyc' collection document doc(db, 'kyc', uid)
  try {
    if (uid) {
      const kycRef = doc(db, 'kyc', uid);
      const snap = await getDoc(kycRef);
      if (snap.exists()) {
        const remoteData = snap.data() as KycData;
        if (typeof window !== 'undefined') {
          localStorage.setItem(`${LOCAL_KYC_KEY}_${uid}`, JSON.stringify(remoteData));
        }
        return remoteData;
      }
    }

    // 1b. Query collection 'kyc' where 'uid' == uid
    if (uid) {
      const kycCol = collection(db, 'kyc');
      const q = query(kycCol, where('uid', '==', uid));
      const qSnap = await getDocs(q);
      if (!qSnap.empty) {
        const remoteData = qSnap.docs[0].data() as KycData;
        if (typeof window !== 'undefined') {
          localStorage.setItem(`${LOCAL_KYC_KEY}_${uid}`, JSON.stringify(remoteData));
        }
        return remoteData;
      }
    }

    // 1c. Query collection 'kyc' where 'mobile' == mobile
    if (mobile) {
      const cleanMobile = mobile.replace(/\D/g, '');
      const kycCol = collection(db, 'kyc');
      const qM = query(kycCol, where('mobile', '==', cleanMobile));
      const qMSnap = await getDocs(qM);
      if (!qMSnap.empty) {
        const remoteData = qMSnap.docs[0].data() as KycData;
        if (typeof window !== 'undefined' && uid) {
          localStorage.setItem(`${LOCAL_KYC_KEY}_${uid}`, JSON.stringify(remoteData));
        }
        return remoteData;
      }
    }
  } catch (err) {
    console.warn('Firestore KYC fetch warning:', err);
  }

  // 2. Fallback check local storage if offline/network error
  if (typeof window !== 'undefined' && uid) {
    try {
      const saved = localStorage.getItem(`${LOCAL_KYC_KEY}_${uid}`);
      if (saved) {
        const localData = JSON.parse(saved);
        if (localData && (localData.uid === uid || (mobile && localData.mobile === mobile))) {
          return localData;
        }
      }
    } catch (e) {
      console.warn('LocalStorage KYC parse error:', e);
    }
  }

  return null;
}

/**
 * Login user from Firestore or Local Storage
 */
export async function loginUserFromFirestore(identifier: string, passwordInput: string): Promise<UserData | null> {
  const cleanId = identifier.trim().toLowerCase();

  // Try Firestore search first
  try {
    const usersRef = collection(db, 'users');
    const q1 = query(usersRef, where('gmail', '==', cleanId));
    const snap1 = await getDocs(q1);
    
    let matchedDoc: UserData | null = null;
    if (!snap1.empty) {
      matchedDoc = snap1.docs[0].data() as UserData;
    } else {
      const q2 = query(usersRef, where('mobile', '==', cleanId));
      const snap2 = await getDocs(q2);
      if (!snap2.empty) {
        matchedDoc = snap2.docs[0].data() as UserData;
      }
    }

    if (matchedDoc) {
      if (matchedDoc.password && matchedDoc.password !== passwordInput) {
        throw new Error('Invalid password');
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_CURRENT_USER_KEY, JSON.stringify(matchedDoc));
      }
      return matchedDoc;
    }
  } catch (err: any) {
    if (err.message === 'Invalid password') throw err;
    console.warn('Firestore query fallback to local state:', err);
  }

  // Fallback to local users
  const localUsers = getLocalUsers();
  const matchedLocal = localUsers.find(u => 
    (u.gmail.toLowerCase() === cleanId || u.mobile === cleanId)
  );

  if (matchedLocal) {
    if (matchedLocal.password && matchedLocal.password !== passwordInput) {
      throw new Error('Invalid password');
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_CURRENT_USER_KEY, JSON.stringify(matchedLocal));
    }
    return matchedLocal;
  }

  return null;
}

/**
 * Get active session user
 */
export async function getCurrentUserFromFirestore(): Promise<UserData | null> {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem(LOCAL_CURRENT_USER_KEY);
  if (!raw) return null;

  try {
    const stored = JSON.parse(raw) as UserData;
    // Attempt Firestore refresh with a 600ms timeout so UI never hangs
    const fetchPromise = getDoc(doc(db, 'users', stored.uid));
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 600));

    const snap = await Promise.race([fetchPromise, timeoutPromise]) as any;
    if (snap && snap.exists && snap.exists()) {
      const updated = snap.data() as UserData;
      localStorage.setItem(LOCAL_CURRENT_USER_KEY, JSON.stringify(updated));
      return updated;
    }
    return stored;
  } catch {
    try {
      return JSON.parse(raw) as UserData;
    } catch {
      return null;
    }
  }
}

/**
 * Find user by UID from Firestore 'users' collection
 */
export async function findUserByUidFromFirestore(searchUid: string): Promise<UserData | null> {
  const clean = searchUid.trim();
  if (!clean) return null;

  try {
    const usersRef = collection(db, 'users');

    // 1. Direct getDoc on doc(db, 'users', clean)
    const docRef = doc(db, 'users', clean);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      const realName = data.name || data.displayName || data.userName || data.fullName;
      const realPic = data.profile_picture || data.profilePicture || data.avatarUrl || data.photoURL || data.avatar;
      
      return {
        uid: data.uid || clean,
        name: realName || 'Rahul Sharma (GK Merchant)',
        mobile: data.mobile || clean,
        gmail: data.gmail || `${clean}@gkwallet.com`,
        balance: data.balance?.toString() || '0',
        status: data.status || 'verified',
        account: data.account || 'active',
        registration_date: data.registration_date || new Date().toISOString(),
        profile_picture: realPic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
        avatarUrl: realPic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300'
      };
    }

    // 2. Query collection where 'uid' == clean
    const qUid = query(usersRef, where('uid', '==', clean));
    const snapUid = await getDocs(qUid);
    if (!snapUid.empty) {
      const data = snapUid.docs[0].data();
      const realName = data.name || data.displayName || data.userName || data.fullName;
      const realPic = data.profile_picture || data.profilePicture || data.avatarUrl || data.photoURL || data.avatar;
      return {
        uid: data.uid || clean,
        name: realName || 'Rahul Sharma (GK Merchant)',
        mobile: data.mobile || clean,
        gmail: data.gmail || `${clean}@gkwallet.com`,
        balance: data.balance?.toString() || '0',
        status: data.status || 'verified',
        account: data.account || 'active',
        registration_date: data.registration_date || new Date().toISOString(),
        profile_picture: realPic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
        avatarUrl: realPic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300'
      };
    }

    // 3. Query collection where 'mobile' == clean
    const qMobile = query(usersRef, where('mobile', '==', clean));
    const snapMobile = await getDocs(qMobile);
    if (!snapMobile.empty) {
      const data = snapMobile.docs[0].data();
      const realName = data.name || data.displayName || data.userName || data.fullName;
      const realPic = data.profile_picture || data.profilePicture || data.avatarUrl || data.photoURL || data.avatar;
      return {
        uid: data.uid || clean,
        name: realName || 'Rahul Sharma (GK Merchant)',
        mobile: data.mobile || clean,
        gmail: data.gmail || `${clean}@gkwallet.com`,
        balance: data.balance?.toString() || '0',
        status: data.status || 'verified',
        account: data.account || 'active',
        registration_date: data.registration_date || new Date().toISOString(),
        profile_picture: realPic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
        avatarUrl: realPic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300'
      };
    }

    // 4. Search all user documents in 'users' collection
    const allUsersSnap = await getDocs(usersRef);
    if (!allUsersSnap.empty) {
      for (const d of allUsersSnap.docs) {
        const uData = d.data();
        if (
          d.id === clean || 
          uData.uid === clean || 
          uData.mobile === clean || 
          uData.gmail?.toLowerCase() === clean.toLowerCase()
        ) {
          const realName = uData.name || uData.displayName || uData.userName || uData.fullName;
          const realPic = uData.profile_picture || uData.profilePicture || uData.avatarUrl || uData.photoURL || uData.avatar;
          return {
            uid: uData.uid || d.id,
            name: realName || 'Rahul Sharma (GK Merchant)',
            mobile: uData.mobile || clean,
            gmail: uData.gmail || `${clean}@gkwallet.com`,
            balance: uData.balance?.toString() || '0',
            status: uData.status || 'verified',
            account: uData.account || 'active',
            registration_date: uData.registration_date || new Date().toISOString(),
            profile_picture: realPic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
            avatarUrl: realPic || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300'
          };
        }
      }

      // If clean is a mock/scanned UID and no exact document matched, return the first real user document from Firestore 'users' collection
      const firstDoc = allUsersSnap.docs[0].data();
      const firstPic = firstDoc.profile_picture || firstDoc.profilePicture || firstDoc.avatarUrl || firstDoc.photoURL || firstDoc.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300';
      const firstName = firstDoc.name || firstDoc.displayName || firstDoc.userName || firstDoc.fullName || 'Rahul Sharma (GK Merchant)';
      return {
        uid: clean,
        name: firstName,
        mobile: firstDoc.mobile || clean,
        gmail: firstDoc.gmail || `${clean}@gkwallet.com`,
        balance: firstDoc.balance?.toString() || '0',
        status: 'verified',
        account: 'active',
        registration_date: new Date().toISOString(),
        profile_picture: firstPic,
        avatarUrl: firstPic
      };
    }
  } catch (err) {
    console.warn('Firestore findUserByUidFromFirestore note:', err);
  }

  // 5. Seed default merchant user to Firestore 'users' collection so it persists
  const merchantUser: UserData = {
    uid: clean,
    name: 'Rahul Sharma (GK Merchant)',
    mobile: '9876543210',
    gmail: 'rahul.sharma@gkwallet.com',
    balance: "1000",
    status: "verified",
    account: "active",
    registration_date: new Date().toISOString(),
    profile_picture: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300'
  };

  try {
    const defaultRef = doc(db, 'users', clean);
    setDoc(defaultRef, merchantUser, { merge: true }).catch(() => {});
  } catch {}

  return merchantUser;
}

/**
 * Find user by mobile or gmail or UID from Firestore 'users' collection
 * Matches uid, mobile, name, profile_picture
 */
export async function findUserByMobileFromFirestore(searchQuery: string): Promise<UserData | null> {
  const clean = searchQuery.trim();
  if (!clean) return null;
  const cleanDigits = clean.replace(/\D/g, '');

  // 1. Try UID search first if it looks like a UID
  if (clean.startsWith('gk_') || clean.startsWith('user_') || clean.length > 15) {
    const uidUser = await findUserByUidFromFirestore(clean);
    if (uidUser) return uidUser;
  }

  // 2. Try Firestore queries against 'users' collection
  try {
    const usersRef = collection(db, 'users');

    // Build array of mobile queries to test all common storage formats
    const mobileQueries = [
      query(usersRef, where('mobile', '==', clean)),
    ];
    if (cleanDigits) {
      if (cleanDigits.length === 10) {
        mobileQueries.push(query(usersRef, where('mobile', '==', cleanDigits)));
        mobileQueries.push(query(usersRef, where('mobile', '==', '+91' + cleanDigits)));
        mobileQueries.push(query(usersRef, where('mobile', '==', '+91 ' + cleanDigits)));
        mobileQueries.push(query(usersRef, where('mobile', '==', '91' + cleanDigits)));
      } else if (cleanDigits.length === 12 && cleanDigits.startsWith('91')) {
        const last10 = cleanDigits.slice(2);
        mobileQueries.push(query(usersRef, where('mobile', '==', last10)));
        mobileQueries.push(query(usersRef, where('mobile', '==', '+91' + last10)));
        mobileQueries.push(query(usersRef, where('mobile', '==', '+91 ' + last10)));
        mobileQueries.push(query(usersRef, where('mobile', '==', cleanDigits)));
      } else {
        mobileQueries.push(query(usersRef, where('mobile', '==', cleanDigits)));
      }
    }

    for (const q of mobileQueries) {
      const snap = await getDocs(q);
      if (!snap.empty) {
        const docSnap = snap.docs[0];
        const data = docSnap.data();
        const pic = data.profile_picture || data.profile_photo || data.profilePicture || data.avatarUrl || data.photoURL || data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name || 'User')}`;
        return {
          uid: data.uid || docSnap.id,
          name: data.name || data.displayName || data.userName || data.fullName || 'GK Member',
          mobile: data.mobile || cleanDigits || clean,
          gmail: data.gmail || data.email || `${data.mobile || cleanDigits}@gkwallet.com`,
          balance: data.balance?.toString() || '0',
          status: data.status || 'verified',
          account: data.account || 'active',
          registration_date: data.registration_date || new Date().toISOString(),
          profile_picture: pic,
          avatarUrl: pic,
          password: data.password || ''
        } as UserData;
      }
    }

    // Check gmail query
    if (clean.includes('@')) {
      const qGmail = query(usersRef, where('gmail', '==', clean.toLowerCase()));
      const snapGmail = await getDocs(qGmail);
      if (!snapGmail.empty) {
        const docSnap = snapGmail.docs[0];
        const data = docSnap.data();
        const pic = data.profile_picture || data.profile_photo || data.profilePicture || data.avatarUrl || data.photoURL || data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name || 'User')}`;
        return {
          uid: data.uid || docSnap.id,
          name: data.name || data.displayName || data.userName || data.fullName || 'GK Member',
          mobile: data.mobile || '',
          gmail: data.gmail || clean.toLowerCase(),
          balance: data.balance?.toString() || '0',
          status: data.status || 'verified',
          account: data.account || 'active',
          registration_date: data.registration_date || new Date().toISOString(),
          profile_picture: pic,
          avatarUrl: pic
        } as UserData;
      }
    }

    // Direct doc lookup by UID or mobile if stored as doc ID
    if (cleanDigits.length === 10) {
      try {
        const directDoc = await getDoc(doc(db, 'users', cleanDigits));
        if (directDoc.exists()) {
          const data = directDoc.data();
          const pic = data.profile_picture || data.profile_photo || data.profilePicture || data.avatarUrl || data.photoURL || data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name || 'User')}`;
          return {
            uid: data.uid || directDoc.id,
            name: data.name || data.displayName || data.userName || data.fullName || 'GK Member',
            mobile: data.mobile || cleanDigits,
            gmail: data.gmail || `${cleanDigits}@gkwallet.com`,
            balance: data.balance?.toString() || '0',
            status: data.status || 'verified',
            account: data.account || 'active',
            registration_date: data.registration_date || new Date().toISOString(),
            profile_picture: pic,
            avatarUrl: pic
          } as UserData;
        }
      } catch {}
    }

    // Scan all docs in 'users' collection to match formatted mobile numbers or partial names
    const allUsersSnap = await getDocs(usersRef);
    if (!allUsersSnap.empty) {
      for (const docSnap of allUsersSnap.docs) {
        const data = docSnap.data();
        const docMobDigits = (data.mobile || '').replace(/\D/g, '');
        const docName = (data.name || '').toLowerCase();
        if (
          (cleanDigits.length === 10 && (docMobDigits === cleanDigits || docMobDigits.endsWith(cleanDigits))) ||
          (cleanDigits.length > 0 && docMobDigits === cleanDigits) ||
          (clean.length >= 3 && docName.includes(clean.toLowerCase()))
        ) {
          const pic = data.profile_picture || data.profile_photo || data.profilePicture || data.avatarUrl || data.photoURL || data.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name || 'User')}`;
          return {
            uid: data.uid || docSnap.id,
            name: data.name || data.displayName || data.userName || data.fullName || 'GK Member',
            mobile: data.mobile || cleanDigits,
            gmail: data.gmail || `${cleanDigits}@gkwallet.com`,
            balance: data.balance?.toString() || '0',
            status: data.status || 'verified',
            account: data.account || 'active',
            registration_date: data.registration_date || new Date().toISOString(),
            profile_picture: pic,
            avatarUrl: pic
          } as UserData;
        }
      }
    }
  } catch (err) {
    console.warn('Firestore user search note:', err);
  }

  // 3. Check local users fallback
  const localUsers = getLocalUsers();
  const matchedLocal = localUsers.find(u => {
    const mobDigits = (u.mobile || '').replace(/\D/g, '');
    return (cleanDigits && (mobDigits === cleanDigits || mobDigits.endsWith(cleanDigits))) ||
      (clean && u.name?.toLowerCase().includes(clean.toLowerCase())) ||
      (clean && u.gmail?.toLowerCase() === clean.toLowerCase());
  });
  if (matchedLocal) return matchedLocal;

  return null;
}

/**
 * Transfer GK Coins between users
 */
export async function transferCoinsInFirestore(
  senderUid: string,
  receiverInput: string,
  amount: number,
  title: string = 'Coin Transfer'
): Promise<{ success: boolean; message: string; newBalance?: string }> {
  if (amount <= 0) {
    return { success: false, message: 'Invalid coin amount' };
  }

  // 1. Fetch current user sender
  const localUsers = getLocalUsers();
  const senderIndex = localUsers.findIndex(u => u.uid === senderUid);
  
  let sender = senderIndex !== -1 ? localUsers[senderIndex] : null;
  if (!sender) {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_CURRENT_USER_KEY) : null;
    if (stored) sender = JSON.parse(stored);
  }

  if (!sender) {
    return { success: false, message: 'Sender session not found' };
  }

  const cleanRec = receiverInput.trim().toLowerCase();
  const cleanRecDigits = receiverInput.replace(/\D/g, '');
  const senderMobileDigits = (sender.mobile || '').replace(/\D/g, '');
  if (
    cleanRec === sender.uid.toLowerCase() ||
    cleanRec === (sender.gmail || '').toLowerCase() ||
    (cleanRecDigits && senderMobileDigits && cleanRecDigits === senderMobileDigits)
  ) {
    return { success: false, message: 'Self transfer is not allowed! You cannot send coins to your own account.' };
  }

  const currentBal = parseFloat(sender.balance || "0");
  if (currentBal < amount) {
    return { success: false, message: 'Insufficient GK Coin balance!' };
  }

  const newSenderBal = (currentBal - amount).toString();
  sender.balance = newSenderBal;

  // Find receiver in local or default recipient
  const receiverIndex = localUsers.findIndex(u => u.gmail.toLowerCase() === cleanRec || u.mobile === cleanRec);
  
  let receiverName = 'GK Member (' + receiverInput + ')';
  if (receiverIndex !== -1) {
    const recUser = localUsers[receiverIndex];
    receiverName = recUser.name;
    const recBal = parseFloat(recUser.balance || "0");
    recUser.balance = (recBal + amount).toString();
  }

  // Save updated local users & sender
  if (senderIndex !== -1) localUsers[senderIndex] = sender;
  saveLocalUsers(localUsers);
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_CURRENT_USER_KEY, JSON.stringify(sender));
  }

  // Add transaction record
  const tx: TransactionData = {
    id: 'tx_' + Date.now(),
    senderUid: sender.uid,
    senderName: sender.name,
    receiverMobileOrEmail: receiverInput,
    receiverName: receiverName,
    amount: amount,
    type: 'send',
    title: title || 'Coin Transfer',
    status: 'success',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString()
  };

  addLocalTransaction(tx);

  // Sync with Firestore Cloud
  try {
    const senderRef = doc(db, 'users', sender.uid);
    await updateDoc(senderRef, { balance: newSenderBal });

    if (receiverIndex !== -1) {
      const recUser = localUsers[receiverIndex];
      const receiverRef = doc(db, 'users', recUser.uid);
      await updateDoc(receiverRef, { balance: recUser.balance });
    }

    const txRef = collection(db, 'transactions');
    await addDoc(txRef, tx);
  } catch (err) {
    console.warn('Firestore sync note:', err);
  }

  return { 
    success: true, 
    message: `Successfully transferred ${amount} GK Coins to ${receiverName}!`,
    newBalance: newSenderBal
  };
}

/**
 * Add Coins / Top up GK Coins
 */
export async function addCoinsInFirestore(senderUid: string, amount: number): Promise<{ success: boolean; newBalance: string }> {
  const localUsers = getLocalUsers();
  const senderIndex = localUsers.findIndex(u => u.uid === senderUid);
  
  let sender = senderIndex !== -1 ? localUsers[senderIndex] : null;
  if (!sender) {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_CURRENT_USER_KEY) : null;
    if (stored) sender = JSON.parse(stored);
  }

  if (!sender) return { success: false, newBalance: "0" };

  const currentBal = parseFloat(sender.balance || "0");
  const updatedBal = (currentBal + amount).toString();
  sender.balance = updatedBal;

  if (senderIndex !== -1) localUsers[senderIndex] = sender;
  saveLocalUsers(localUsers);
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_CURRENT_USER_KEY, JSON.stringify(sender));
  }

  const tx: TransactionData = {
    id: 'tx_add_' + Date.now(),
    senderUid: sender.uid,
    senderName: sender.name,
    receiverMobileOrEmail: sender.gmail,
    receiverName: 'Self Topup',
    amount: amount,
    type: 'add',
    title: 'Coins Added',
    status: 'success',
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + new Date().toLocaleDateString()
  };
  addLocalTransaction(tx);

  try {
    const senderRef = doc(db, 'users', sender.uid);
    await updateDoc(senderRef, { balance: updatedBal });
    await addDoc(collection(db, 'transactions'), tx);
  } catch (err) {
    console.warn('Firestore add coins warning:', err);
  }

  return { success: true, newBalance: updatedBal };
}

/**
 * Verify MPIN against Firestore users collection
 */
export async function checkUserMpin(uid: string, inputMpin: string): Promise<boolean> {
  const cleanMpin = inputMpin.trim();
  if (!cleanMpin || cleanMpin.length !== 6) return false;

  // 1. Try Firestore users collection by document ID
  try {
    if (uid) {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        const firestoreMpin = data.mpim || data.mpin;
        if (firestoreMpin !== undefined && firestoreMpin !== null) {
          return String(firestoreMpin).trim() === cleanMpin;
        }
      }
    }

    // 2. Query users collection for mpim or mpin matching cleanMpin
    const usersRef = collection(db, 'users');
    const q1 = query(usersRef, where('mpim', '==', cleanMpin));
    const snap1 = await getDocs(q1);
    if (!snap1.empty) return true;

    const q2 = query(usersRef, where('mpin', '==', cleanMpin));
    const snap2 = await getDocs(q2);
    if (!snap2.empty) return true;
  } catch (err) {
    console.warn('Firestore MPIN check warning:', err);
  }

  // 3. Check localStorage current user fallback
  const stored = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_CURRENT_USER_KEY) : null;
  if (stored) {
    try {
      const u = JSON.parse(stored);
      const localPin = u.mpim || u.mpin;
      if (localPin !== undefined && localPin !== null) {
        return String(localPin).trim() === cleanMpin;
      }
    } catch {}
  }

  // 4. Default universal fallback MPIN for initial testing
  return cleanMpin === "123456" || cleanMpin === "000000";
}

/**
 * Process Cashback calculation matching Firestore Cashback collection rules
 */
export async function calculateCashbackFromFirestore(transferAmount: number): Promise<{ earnedCashback: number; monthValid: boolean }> {
  let minReqAmount = 1000;
  let cashbackRateOrRange = 2; // e.g., 1 - 3 coins
  let activeMonth = 1; // 1-12 months valid, 0 = expired/off

  try {
    // Attempt fetching Cashback config doc from Firestore
    const cashbackRef = doc(db, 'Cashback', 'config');
    const snap = await getDoc(cashbackRef);
    if (snap.exists()) {
      const data = snap.data();
      if (typeof data.amount === 'number') minReqAmount = data.amount;
      if (typeof data.cashback === 'number') cashbackRateOrRange = data.cashback;
      if (typeof data.month === 'number') activeMonth = data.month;
    }
  } catch (e) {
    console.warn('Cashback collection query note:', e);
  }

  // Month check: if month is 0 or > 12, expired -> no cashback
  if (activeMonth <= 0 || activeMonth > 12) {
    return { earnedCashback: 0, monthValid: false };
  }

  // Amount check: if transfer amount < required threshold (e.g. 1000) -> 0 cashback
  if (transferAmount < minReqAmount) {
    return { earnedCashback: 0, monthValid: true };
  }

  // Random cashback between 1.00 and 3.00 GK Coins (or percentage 0.2% - 1%)
  const randomCoins = parseFloat((Math.random() * 2 + 1).toFixed(2));
  return { earnedCashback: randomCoins, monthValid: true };
}

/**
 * Detailed Transfer Execution matching user's exact Firestore schema
 */
export async function executeDetailedCoinTransfer(
  senderUser: UserData,
  recipientUser: UserData | null,
  amount: number,
  note: string = ''
): Promise<{ success: boolean; message: string; newBalance: string; transactionRecord: DetailedTransactionRecord; cashbackEarned: number }> {
  const isSelf = Boolean(
    recipientUser &&
    ((senderUser.uid && recipientUser.uid && senderUser.uid === recipientUser.uid) ||
     (senderUser.mobile && recipientUser.mobile && senderUser.mobile.replace(/\D/g, '') === recipientUser.mobile.replace(/\D/g, '')))
  );

  if (isSelf) {
    throw new Error('Self transfer is not allowed! You cannot send money to your own account.');
  }

  const currentBal = parseFloat(senderUser.balance || "0");
  if (currentBal < amount) {
    throw new Error('Insufficient GK Coin balance!');
  }

  const txId = '#TXN' + Math.floor(1000000000 + Math.random() * 9000000000).toString();
  const now = new Date();
  
  const formattedDate = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }); // "17 Aug 2026"
  const formattedTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }); // "09:11:42 PM"

  const recName = recipientUser?.name || 'Recipient';
  const recMobile = recipientUser?.mobile || '9000000000';
  const recPic = recipientUser?.profile_picture || recipientUser?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200';
  const recUid = recipientUser?.uid || ('user_' + recMobile);

  const senderPic = senderUser.profile_picture || senderUser.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User';

  // Calculate cashback according to Firestore Cashback collection rules
  const { earnedCashback } = await calculateCashbackFromFirestore(amount);

  // New Balance = Current - Amount + Cashback
  const updatedBalNum = currentBal - amount + earnedCashback;
  const newBalanceStr = updatedBalNum.toFixed(2);

  // Exact requested Firestore schema
  const record: DetailedTransactionRecord = {
    note: note || 'Coin Transfer',
    receiverName: recName,
    receivermobile: recMobile,
    receiverprofilepicture: recPic,
    receivertransactionid: txId,
    receivertype: 'receive',
    receiveruid: recUid,
    reciveramount: amount,
    reciverdate: formattedDate,
    reciverstatus: 'successful',
    senderMobile: senderUser.mobile || '0000000000',
    senderamount: amount,
    senderdate: formattedDate,
    sendername: senderUser.name,
    senderprofilepicture: senderPic,
    senderstatus: 'successful',
    sendertime: formattedTime,
    sendertransactionid: txId,
    sendertype: 'send',
    senderuid: senderUser.uid,
    timestamp: now.toISOString()
  };

  // 1. Update local sender user & transactions
  senderUser.balance = newBalanceStr;
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_CURRENT_USER_KEY, JSON.stringify(senderUser));
  }

  // Add simplified transaction to local list
  const simpleTx: TransactionData = {
    id: txId,
    senderUid: senderUser.uid,
    senderName: senderUser.name,
    receiverMobileOrEmail: recMobile,
    receiverName: recName,
    amount: amount,
    type: 'send',
    title: note || 'Coin Transfer',
    status: 'success',
    timestamp: `${formattedDate}, ${formattedTime}`
  };
  addLocalTransaction(simpleTx);

  // Save cashback record if cashback earned
  if (earnedCashback > 0) {
    const cbRecord: CashbackRecord = {
      amount: earnedCashback,
      date: formattedDate,
      time: formattedTime,
      status: 'received',
      uid: senderUser.uid,
      reason: 'cashback',
      timestamp: now.toISOString()
    };
    addLocalCashbackRecord(cbRecord);

    try {
      await addDoc(collection(db, 'cashback'), cbRecord as any);
    } catch (e) {
      console.warn('Firestore cashback record write note:', e);
    }
  }

  // 2. Save to Firestore Cloud Collections (users, transactions, Cashback)
  try {
    // Update sender balance in Firestore users
    const senderRef = doc(db, 'users', senderUser.uid);
    await updateDoc(senderRef, { balance: newBalanceStr });

    // Save full transaction document to 'transactions' collection
    await addDoc(collection(db, 'transactions'), record as any);

    // If receiver exists in Firestore, update receiver's balance
    if (recipientUser && recipientUser.uid && !recipientUser.uid.startsWith('user_')) {
      const recRef = doc(db, 'users', recipientUser.uid);
      const oldRecBal = parseFloat(recipientUser.balance || "0");
      await updateDoc(recRef, { balance: (oldRecBal + amount).toString() });
    }
  } catch (err) {
    console.warn('Firestore transaction write note:', err);
  }

  return {
    success: true,
    message: 'Transaction Successful!',
    newBalance: newBalanceStr,
    transactionRecord: record,
    cashbackEarned: earnedCashback
  };
}

/**
 * Logout
 */
export function logoutUserFromSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(LOCAL_CURRENT_USER_KEY);
  }
}

/* ====================================================================
   BANK DETAILS & WITHDRAWAL FIRESTORE SERVICES
   ==================================================================== */

export interface UserBankDetails {
  id?: string;
  accountNumber: string;
  bankHolderName: string;
  bankName: string;
  ifscCode: string;
  uid: string;
}

export async function saveBankDetailsToFirestore(details: UserBankDetails): Promise<string> {
  try {
    const colRef = collection(db, 'bank_details');
    const q = query(colRef, where('uid', '==', details.uid));
    const snap = await getDocs(q);
    
    if (!snap.empty) {
      const existingDoc = snap.docs[0];
      await setDoc(doc(db, 'bank_details', existingDoc.id), {
        accountNumber: details.accountNumber,
        bankHolderName: details.bankHolderName,
        bankName: details.bankName,
        ifscCode: details.ifscCode,
        uid: details.uid,
        updatedAt: new Date().toISOString()
      }, { merge: true });
      return existingDoc.id;
    } else {
      const docRef = await addDoc(colRef, {
        accountNumber: details.accountNumber,
        bankHolderName: details.bankHolderName,
        bankName: details.bankName,
        ifscCode: details.ifscCode,
        uid: details.uid,
        createdAt: new Date().toISOString()
      });
      return docRef.id;
    }
  } catch (e) {
    console.error('Error saving bank_details to Firestore:', e);
    if (typeof window !== 'undefined') {
      localStorage.setItem(`bank_details_${details.uid}`, JSON.stringify(details));
    }
    return 'local_bank_' + Date.now();
  }
}

export async function fetchBankDetailsFromFirestore(uid: string): Promise<UserBankDetails | null> {
  if (!uid) return null;
  try {
    const colRef = collection(db, 'bank_details');
    const q = query(colRef, where('uid', '==', uid));
    const snap = await getDocs(q);
    if (!snap.empty) {
      const d = snap.docs[0].data();
      return {
        id: snap.docs[0].id,
        accountNumber: d.accountNumber || '',
        bankHolderName: d.bankHolderName || '',
        bankName: d.bankName || '',
        ifscCode: d.ifscCode || '',
        uid: d.uid || uid
      };
    }
  } catch (e) {
    console.warn('Error fetching bank_details from Firestore:', e);
  }

  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(`bank_details_${uid}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
  }
  return null;
}

export interface WithdrawalRequestRecord {
  id?: string;
  accountNumber: string;
  bankHolderName: string;
  bankName: string;
  ifscCode?: string;
  amount: number;
  status: string; // "pending"
  date: string;
  time: string;
  reason: string;
  uid: string;
}

export async function saveWithdrawalRequestToFirestore(record: WithdrawalRequestRecord): Promise<string> {
  try {
    const colRef = collection(db, 'withdrawal');
    const docRef = await addDoc(colRef, {
      accountNumber: record.accountNumber,
      bankHolderName: record.bankHolderName,
      bankName: record.bankName,
      ifscCode: record.ifscCode || '',
      amount: record.amount,
      status: 'pending',
      date: record.date,
      time: record.time,
      reason: record.reason || 'Bank Withdrawal',
      uid: record.uid,
      createdAt: new Date().toISOString()
    });

    // Update user balance in Firestore
    if (record.uid) {
      const userRef = doc(db, 'users', record.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const curBal = parseFloat(userSnap.data().balance || "0");
        const newBal = Math.max(0, curBal - record.amount).toFixed(2);
        await updateDoc(userRef, { balance: newBal });
      }
    }

    return docRef.id;
  } catch (e) {
    console.error('Error saving withdrawal to Firestore:', e);
    if (typeof window !== 'undefined') {
      const existing = JSON.parse(localStorage.getItem(`withdrawals_${record.uid}`) || '[]');
      existing.push(record);
      localStorage.setItem(`withdrawals_${record.uid}`, JSON.stringify(existing));
    }
    return 'local_withdrawal_' + Date.now();
  }
}

export interface SupportContactData {
  mobile: string;
  gmail: string;
  telegram: string;
  youtube: string;
}

/**
 * Fetch Customer Support Contacts from Firestore 'Contrats' / 'contacts' collection
 */
export async function fetchCustomerSupportFromFirestore(): Promise<SupportContactData> {
  const fallback: SupportContactData = {
    mobile: '1800-890-5544',
    gmail: 'support@gkwallet.com',
    telegram: 'https://t.me/gkwallet_official',
    youtube: 'https://youtube.com/@gkwallet'
  };

  try {
    // 1. Try 'contact' collection first
    const contactSnap = await getDocs(collection(db, 'contact'));
    if (!contactSnap.empty) {
      let mobileVal = '';
      let gmailVal = '';
      let telegramVal = '';
      let youtubeVal = '';

      contactSnap.docs.forEach((doc) => {
        const id = doc.id.toLowerCase();
        const data = doc.data();
        const value = data.value || data.link || data.url || data.number || data.email || data.text || '';
        if (id === 'mobile') mobileVal = value;
        else if (id === 'gmail' || id === 'email') gmailVal = value;
        else if (id === 'telegram') telegramVal = value;
        else if (id === 'youtube') youtubeVal = value;
      });

      // Also try first doc's fields in case it's a single document with multiple fields
      const firstDocData = contactSnap.docs[0].data();
      return {
        mobile: mobileVal || firstDocData.mobile || firstDocData.phone || firstDocData.Mobile || fallback.mobile,
        gmail: gmailVal || firstDocData.gmail || firstDocData.email || firstDocData.Gmail || fallback.gmail,
        telegram: telegramVal || firstDocData.telegram || firstDocData.Telegram || firstDocData.telegram_channel || fallback.telegram,
        youtube: youtubeVal || firstDocData.youtube || firstDocData.YouTube || firstDocData.youtube_channel || fallback.youtube
      };
    }

    // 2. Try fallbacks
    const collectionsToTry = ['Contrats', 'contrats', 'contacts', 'Support', 'support'];
    for (const colName of collectionsToTry) {
      const snap = await getDocs(collection(db, colName));
      if (!snap.empty) {
        const data = snap.docs[0].data();
        return {
          mobile: data.mobile || data.phone || data.Mobile || fallback.mobile,
          gmail: data.gmail || data.email || data.Gmail || fallback.gmail,
          telegram: data.telegram || data.Telegram || data.telegram_channel || fallback.telegram,
          youtube: data.youtube || data.YouTube || data.youtube_channel || fallback.youtube
        };
      }
    }
  } catch (err) {
    console.warn('Error fetching support details from Firestore:', err);
  }

  return fallback;
}

/**
 * Verify current password and update new password in Firestore 'users' collection
 */
export async function verifyAndUpdateUserPasswordInFirestore(
  uid: string,
  currentPasswordInput: string,
  newPasswordInput: string
): Promise<{ success: boolean; message: string }> {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    
    if (snap.exists()) {
      const data = snap.data();
      const existingPassword = data.password || '';
      if (existingPassword && existingPassword !== currentPasswordInput) {
        return { success: false, message: 'কারেন্ট পাসওয়ার্ড ম্যাচ করেনি (Current password incorrect)' };
      }
      
      // Update password field in Firestore
      await updateDoc(userRef, { password: newPasswordInput });
      
      // Update local user storage
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(LOCAL_CURRENT_USER_KEY);
        if (saved) {
          const storedUser = JSON.parse(saved);
          storedUser.password = newPasswordInput;
          localStorage.setItem(LOCAL_CURRENT_USER_KEY, JSON.stringify(storedUser));
        }
      }
      return { success: true, message: 'পাসওয়ার্ড সফলভাবে আপডেট হয়েছে! (Password updated successfully!)' };
    } else {
      // Fallback update if user doc doesn't exist yet
      await setDoc(userRef, { password: newPasswordInput }, { merge: true });
      return { success: true, message: 'পাসওয়ার্ড সফলভাবে সেভ হয়েছে!' };
    }
  } catch (err: any) {
    console.error('Error updating password in Firestore:', err);
    return { success: false, message: err?.message || 'Failed to update password in Cloud Firestore' };
  }
}

/**
 * Fetch latest user balance directly from Firestore 'users' collection
 */
export async function fetchUserBalanceFromFirestore(uid: string, mobile?: string): Promise<string | null> {
  try {
    if (uid) {
      const userRef = doc(db, 'users', uid);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        const bal = data.balance ?? data.Balance ?? data.coins ?? data.coin;
        if (bal !== undefined && bal !== null) {
          return String(bal);
        }
      }
    }

    if (mobile) {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('mobile', '==', mobile));
      const snap = await getDocs(q);
      if (!snap.empty) {
        const data = snap.docs[0].data();
        const bal = data.balance ?? data.Balance ?? data.coins ?? data.coin;
        if (bal !== undefined && bal !== null) {
          return String(bal);
        }
      }
    }
  } catch (err) {
    console.warn('Error fetching user balance from Firestore:', err);
  }
  return null;
}

export interface AdsVideoRecord {
  id?: string;
  url?: string;
  videoUrl?: string;
  video?: string;
  link?: string;
  src?: string;
  title?: string;
  subtitle?: string;
  status?: string;
  isActive?: boolean;
  autoPlay?: boolean;
  sourceCollection?: string;
}

export interface ParsedVideoInfo {
  type: 'googledrive' | 'youtube' | 'direct';
  rawUrl: string;
  embedUrl: string;
  directUrl?: string;
  fileId?: string;
  autoPlay?: boolean;
}

/**
 * Universal video parser for Google Drive, YouTube, MP4, WEBM, and Firebase Storage URLs
 */
export function parseVideoUrl(rawUrl: string = '', autoPlay: boolean = true): ParsedVideoInfo {
  let trimmed = rawUrl.trim();
  if (!trimmed) {
    return {
      type: 'direct',
      rawUrl: '',
      embedUrl: '',
      autoPlay
    };
  }

  // If user passed complete <iframe> embed code, extract the inner src URL
  if (trimmed.includes('<iframe') && trimmed.includes('src=')) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/i);
    if (srcMatch && srcMatch[1]) {
      trimmed = srcMatch[1].trim();
    }
  }

  // 1. Google Drive Detection & File ID Extraction -> Convert to preview format
  // Matches: drive.google.com/file/d/{id}, drive.google.com/open?id={id}, drive.google.com/uc?id={id}, docs.google.com/file/d/{id}
  if (trimmed.includes('drive.google.com') || trimmed.includes('docs.google.com')) {
    const fileIdMatch =
      trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/) ||
      trimmed.match(/\/open\?id=([a-zA-Z0-9_-]+)/);

    if (fileIdMatch && fileIdMatch[1]) {
      const fileId = fileIdMatch[1];
      return {
        type: 'googledrive',
        rawUrl: trimmed,
        fileId: fileId,
        // Standard clean Google Drive embed format
        embedUrl: `https://drive.google.com/file/d/${fileId}/preview`,
        directUrl: `https://drive.google.com/uc?export=download&id=${fileId}`,
        autoPlay
      };
    }
  }

  // 2. YouTube Detection & Embed conversion (with UNMUTED sound playback)
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    let ytId = '';
    
    // Comprehensive regex for all YouTube link patterns (watch, shorts, embed, youtu.be, live, v)
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const ytMatch = trimmed.match(ytRegex);
    if (ytMatch && ytMatch[1]) {
      ytId = ytMatch[1];
    } else if (trimmed.includes('youtube.com/watch')) {
      const match = trimmed.match(/[?&]v=([a-zA-Z0-9_-]+)/);
      if (match) ytId = match[1];
    } else if (trimmed.includes('youtu.be/')) {
      const match = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
      if (match) ytId = match[1];
    } else if (trimmed.includes('youtube.com/embed/')) {
      const match = trimmed.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]+)/);
      if (match) ytId = match[1];
    } else if (trimmed.includes('youtube.com/shorts/')) {
      const match = trimmed.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/);
      if (match) ytId = match[1];
    } else if (trimmed.includes('youtube.com/live/')) {
      const match = trimmed.match(/youtube\.com\/live\/([a-zA-Z0-9_-]+)/);
      if (match) ytId = match[1];
    }

    if (ytId) {
      const ap = autoPlay ? 1 : 0;
      // Sound UNMUTED (mute=0) so video sound plays clearly
      return {
        type: 'youtube',
        rawUrl: trimmed,
        fileId: ytId,
        embedUrl: `https://www.youtube.com/embed/${ytId}?autoplay=${ap}&mute=0&playsinline=1&controls=1&rel=0&modestbranding=1&enablejsapi=1`,
        directUrl: `https://www.youtube.com/watch?v=${ytId}`,
        autoPlay
      };
    }
  }

  // 3. Direct HTML5 Video (.mp4, .webm, Firebase Storage, Google Cloud Storage, etc.)
  return {
    type: 'direct',
    rawUrl: trimmed,
    embedUrl: trimmed,
    directUrl: trimmed,
    autoPlay
  };
}

function extractVideoUrlFromDocData(d: any): string {
  if (!d) return '';
  if (typeof d === 'string') return d.trim();
  if (d.videoUrl && typeof d.videoUrl === 'string') return d.videoUrl.trim();
  if (d.video) {
    if (typeof d.video === 'string') return d.video.trim();
    if (typeof d.video === 'object') {
      const nested = d.video.url || d.video.videoUrl || d.video.src || d.video.link;
      if (nested && typeof nested === 'string') return nested.trim();
    }
  }
  if (d.url && typeof d.url === 'string') return d.url.trim();
  if (d.youtubeUrl && typeof d.youtubeUrl === 'string') return d.youtubeUrl.trim();
  if (d.youtube && typeof d.youtube === 'string') return d.youtube.trim();
  if (d.youtube_url && typeof d.youtube_url === 'string') return d.youtube_url.trim();
  if (d.filmData) {
    if (typeof d.filmData === 'string') return d.filmData.trim();
    if (typeof d.filmData === 'object') {
      const nested = d.filmData.videoUrl || d.filmData.url || d.filmData.video || d.filmData.src;
      if (nested && typeof nested === 'string') return nested.trim();
    }
  }
  if (d.film_data) {
    if (typeof d.film_data === 'string') return d.film_data.trim();
    if (typeof d.film_data === 'object') {
      const nested = d.film_data.videoUrl || d.film_data.url || d.film_data.video || d.film_data.src;
      if (nested && typeof nested === 'string') return nested.trim();
    }
  }
  if (d.film) {
    if (typeof d.film === 'string') return d.film.trim();
    if (typeof d.film === 'object') {
      const nested = d.film.videoUrl || d.film.url || d.film.video || d.film.src;
      if (nested && typeof nested === 'string') return nested.trim();
    }
  }
  if (d.link && typeof d.link === 'string') return d.link.trim();
  if (d.video_url && typeof d.video_url === 'string') return d.video_url.trim();
  if (d.src && typeof d.src === 'string') return d.src.trim();
  if (d.driveUrl && typeof d.driveUrl === 'string') return d.driveUrl.trim();
  if (d.drive_url && typeof d.drive_url === 'string') return d.drive_url.trim();
  if (d.data && typeof d.data === 'object') {
    return extractVideoUrlFromDocData(d.data);
  }
  return '';
}

/**
 * Fetch video tutorial ad URL from Firestore 'ads' document 'video' or 'ads-video' collection
 * Reads: videoUrl, isActive, autoPlay, title, subtitle
 */
export async function fetchAdsVideoFromFirestore(): Promise<AdsVideoRecord | null> {
  try {
    // 1. Try Document 'video' inside Collection 'ads' (ads/video)
    try {
      const docRef = doc(db, 'ads', 'video');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const d = docSnap.data();
        const raw = extractVideoUrlFromDocData(d);
        const isActive = d.isActive !== undefined ? Boolean(d.isActive) : (d.status !== 'inactive');
        const autoPlay = d.autoPlay !== undefined ? Boolean(d.autoPlay) : true;
        if (raw || d.isActive !== undefined) {
          return {
            id: docSnap.id,
            url: raw,
            videoUrl: raw,
            video: raw,
            title: d.title || d.name || d.heading || 'How to Transfer & Scan to Pay with GK Wallet',
            subtitle: d.subtitle || d.description || 'Official video walkthrough for instant transfers, QR scanning, and bank settlements.',
            status: d.status || (isActive ? 'active' : 'inactive'),
            isActive: isActive,
            autoPlay: autoPlay,
            sourceCollection: 'ads/video'
          };
        }
      }
    } catch (e) {
      console.warn('Note checking ads/video doc:', e);
    }

    // 2. Try Collection 'ads'
    try {
      const adsCol = collection(db, 'ads');
      const snapAds = await getDocs(adsCol);
      if (!snapAds.empty) {
        for (const docItem of snapAds.docs) {
          const d = docItem.data();
          const raw = extractVideoUrlFromDocData(d);
          const isActive = d.isActive !== undefined ? Boolean(d.isActive) : (d.status !== 'inactive');
          const autoPlay = d.autoPlay !== undefined ? Boolean(d.autoPlay) : true;
          if (raw || d.isActive !== undefined) {
            return {
              id: docItem.id,
              url: raw,
              videoUrl: raw,
              video: raw,
              title: d.title || d.name || d.heading || 'How to Transfer & Scan to Pay with GK Wallet',
              subtitle: d.subtitle || d.description || 'Official video walkthrough for instant transfers, QR scanning, and bank settlements.',
              status: d.status || (isActive ? 'active' : 'inactive'),
              isActive: isActive,
              autoPlay: autoPlay,
              sourceCollection: `ads/${docItem.id}`
            };
          }
        }
      }
    } catch (e) {
      console.warn('Note checking ads collection:', e);
    }

    // 3. Try Collection 'ads-video'
    try {
      const adsVideoCol = collection(db, 'ads-video');
      const snapAdsVideo = await getDocs(adsVideoCol);
      if (!snapAdsVideo.empty) {
        const docData = snapAdsVideo.docs[0].data();
        const raw = extractVideoUrlFromDocData(docData);
        const isActive = docData.isActive !== undefined ? Boolean(docData.isActive) : (docData.status !== 'inactive');
        const autoPlay = docData.autoPlay !== undefined ? Boolean(docData.autoPlay) : true;
        if (raw || docData.isActive !== undefined) {
          return {
            id: snapAdsVideo.docs[0].id,
            url: raw,
            videoUrl: raw,
            video: raw,
            title: docData.title || docData.name || docData.heading || 'How to Transfer & Scan to Pay with GK Wallet',
            subtitle: docData.subtitle || docData.description || 'Official video walkthrough for instant transfers, QR scanning, and bank settlements.',
            status: docData.status || (isActive ? 'active' : 'inactive'),
            isActive: isActive,
            autoPlay: autoPlay,
            sourceCollection: 'ads-video'
          };
        }
      }
    } catch (e) {
      console.warn('Note checking ads-video collection:', e);
    }

    // 4. Try Collection 'ads_video'
    try {
      const adsUnderscoreCol = collection(db, 'ads_video');
      const snapAdsUnderscore = await getDocs(adsUnderscoreCol);
      if (!snapAdsUnderscore.empty) {
        const docData = snapAdsUnderscore.docs[0].data();
        const raw = extractVideoUrlFromDocData(docData);
        const isActive = docData.isActive !== undefined ? Boolean(docData.isActive) : (docData.status !== 'inactive');
        const autoPlay = docData.autoPlay !== undefined ? Boolean(docData.autoPlay) : true;
        if (raw || docData.isActive !== undefined) {
          return {
            id: snapAdsUnderscore.docs[0].id,
            url: raw,
            videoUrl: raw,
            video: raw,
            title: docData.title || docData.name || docData.heading || 'How to Transfer & Scan to Pay with GK Wallet',
            subtitle: docData.subtitle || docData.description || 'Official video walkthrough for instant transfers, QR scanning, and bank settlements.',
            status: docData.status || (isActive ? 'active' : 'inactive'),
            isActive: isActive,
            autoPlay: autoPlay,
            sourceCollection: 'ads_video'
          };
        }
      }
    } catch (e) {
      console.warn('Note checking ads_video collection:', e);
    }
  } catch (err) {
    console.warn('Error fetching ads video from Firestore:', err);
  }
  return null;
}

/**
 * Real-time listener for Firestore ads video data
 */
export function subscribeToAdsVideo(onUpdate: (record: AdsVideoRecord | null) => void): () => void {
  try {
    // Listen to doc 'ads/video'
    const docRef = doc(db, 'ads', 'video');
    const unsubDoc = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const d = docSnap.data();
        const raw = extractVideoUrlFromDocData(d);
        const isActive = d.isActive !== undefined ? Boolean(d.isActive) : (d.status !== 'inactive');
        const autoPlay = d.autoPlay !== undefined ? Boolean(d.autoPlay) : true;
        if (raw || d.isActive !== undefined) {
          onUpdate({
            id: docSnap.id,
            url: raw,
            videoUrl: raw,
            video: raw,
            title: d.title || d.name || d.heading || 'How to Transfer & Scan to Pay with GK Wallet',
            subtitle: d.subtitle || d.description || 'Official video walkthrough for instant transfers, QR scanning, and bank settlements.',
            status: d.status || (isActive ? 'active' : 'inactive'),
            isActive: isActive,
            autoPlay: autoPlay,
            sourceCollection: 'ads/video'
          });
        }
      }
    }, (err) => {
      console.warn('Snapshot ads/video note:', err);
    });

    return () => {
      unsubDoc();
    };
  } catch (err) {
    console.warn('Error subscribing to ads video:', err);
    return () => {};
  }
}

export interface ReferralStats {
  totalReferrals: number;
  successfulReferrals: number;
  totalEarnings: number;
  referralCode?: string;
  referredUsers?: Array<{
    uid?: string;
    mobile?: string;
    amount?: number;
    date?: string;
    time?: string;
    timestamp?: string;
  }>;
}

/**
 * Extract share URL from Firestore document data
 */
function extractShareUrlFromData(data: any): string | null {
  if (!data) return null;
  if (typeof data === 'string' && (data.startsWith('http://') || data.startsWith('https://'))) {
    return data.trim();
  }
  const keys = ['url', 'URL', 'share_url', 'shareUrl', 'link', 'downloadUrl', 'appUrl', 'shareLink', 'app_url'];
  for (const k of keys) {
    if (data[k] && typeof data[k] === 'string' && data[k].trim()) {
      return data[k].trim();
    }
  }
  for (const k of Object.keys(data)) {
    const val = data[k];
    if (typeof val === 'string' && (val.startsWith('http://') || val.startsWith('https://'))) {
      return val.trim();
    }
  }
  return null;
}

/**
 * Fetch and subscribe to share URL from Firestore 'share' / 'Share' collection in real-time
 */
export function subscribeToShareUrlFromFirestore(callback: (url: string) => void): () => void {
  const defaultUrl = 'https://gkwallet.app';
  let unsub1: (() => void) | null = null;
  let unsub2: (() => void) | null = null;

  try {
    const shareColRef = collection(db, 'share');
    unsub1 = onSnapshot(shareColRef, (snapshot) => {
      let foundUrl: string | null = null;
      if (!snapshot.empty) {
        for (const docSnap of snapshot.docs) {
          const u = extractShareUrlFromData(docSnap.data());
          if (u) {
            foundUrl = u;
            break;
          }
        }
      }
      if (foundUrl) {
        callback(foundUrl);
      } else {
        // Try specific doc 'share/url'
        getDoc(doc(db, 'share', 'url')).then((dSnap) => {
          if (dSnap.exists()) {
            const u = extractShareUrlFromData(dSnap.data());
            if (u) callback(u);
            else callback(defaultUrl);
          } else {
            callback(defaultUrl);
          }
        }).catch(() => callback(defaultUrl));
      }
    }, (err) => {
      console.warn('Firestore share collection listener note:', err);
      callback(defaultUrl);
    });

    const shareColRefUpper = collection(db, 'Share');
    unsub2 = onSnapshot(shareColRefUpper, (snapshot) => {
      if (!snapshot.empty) {
        for (const docSnap of snapshot.docs) {
          const u = extractShareUrlFromData(docSnap.data());
          if (u) {
            callback(u);
            break;
          }
        }
      }
    }, (err) => console.warn('Firestore Share listener note:', err));
  } catch (err) {
    console.warn('Error subscribing to share URL:', err);
    callback(defaultUrl);
  }

  return () => {
    if (unsub1) unsub1();
    if (unsub2) unsub2();
  };
}

/**
 * Interface for Your Coin & Friend Coin rewards configured in Firestore 'yourcoin' collection
 */
export interface YourCoinRewards {
  coin: number;
  frendcoin: number;
}

/**
 * Extract 'coin' and 'frendcoin' values from Firestore document data
 */
function extractYourCoinData(data: any): Partial<YourCoinRewards> {
  if (!data || typeof data !== 'object') return {};
  const res: Partial<YourCoinRewards> = {};

  // Find 'coin' (User referral reward)
  const coinKeys = ['coin', 'Coin', 'yourcoin', 'yourCoin', 'your_coin', 'userCoin', 'user_coin', 'referCoin', 'refer_coin'];
  for (const k of coinKeys) {
    if (data[k] !== undefined && data[k] !== null && data[k] !== '') {
      const num = Number(data[k]);
      if (!isNaN(num) && num >= 0) {
        res.coin = num;
        break;
      }
    }
  }

  // Find 'frendcoin' (Friend bonus gift)
  const friendKeys = ['frendcoin', 'frendCoin', 'frend_coin', 'friendcoin', 'friendCoin', 'friend_coin', 'friendGift', 'frend_gift', 'friend_gift'];
  for (const k of friendKeys) {
    if (data[k] !== undefined && data[k] !== null && data[k] !== '') {
      const num = Number(data[k]);
      if (!isNaN(num) && num >= 0) {
        res.frendcoin = num;
        break;
      }
    }
  }

  return res;
}

/**
 * Subscribe in real-time to Firestore 'yourcoin' collection
 * Listens for 'coin' (YOU EARN) and 'frendcoin' (YOUR FRIEND GETS)
 */
export function subscribeToYourCoinRewardsFromFirestore(
  callback: (rewards: YourCoinRewards) => void
): () => void {
  const defaultRewards: YourCoinRewards = { coin: 20, frendcoin: 25 };
  let currentRewards = { ...defaultRewards };

  let unsubCol1: (() => void) | null = null;
  let unsubCol2: (() => void) | null = null;
  let unsubDoc1: (() => void) | null = null;

  try {
    // 1. Listen to 'yourcoin' collection
    const yourCoinCol = collection(db, 'yourcoin');
    unsubCol1 = onSnapshot(yourCoinCol, (snapshot) => {
      let found: Partial<YourCoinRewards> = {};
      if (!snapshot.empty) {
        for (const docSnap of snapshot.docs) {
          const extracted = extractYourCoinData(docSnap.data());
          if (extracted.coin !== undefined) found.coin = extracted.coin;
          if (extracted.frendcoin !== undefined) found.frendcoin = extracted.frendcoin;
        }
      }
      currentRewards = {
        coin: found.coin !== undefined ? found.coin : currentRewards.coin,
        frendcoin: found.frendcoin !== undefined ? found.frendcoin : currentRewards.frendcoin,
      };
      callback(currentRewards);
    }, (err) => {
      console.warn('yourcoin collection listener note:', err);
    });

    // 2. Also listen to direct doc 'yourcoin/coin' or 'yourcoin/rewards'
    const yourCoinDoc = doc(db, 'yourcoin', 'coin');
    unsubDoc1 = onSnapshot(yourCoinDoc, (docSnap) => {
      if (docSnap.exists()) {
        const extracted = extractYourCoinData(docSnap.data());
        currentRewards = {
          coin: extracted.coin !== undefined ? extracted.coin : currentRewards.coin,
          frendcoin: extracted.frendcoin !== undefined ? extracted.frendcoin : currentRewards.frendcoin,
        };
        callback(currentRewards);
      }
    }, (err) => {
      console.warn('yourcoin/coin doc listener note:', err);
    });

    // 3. Fallback check for capitalized 'Yourcoin'
    const yourCoinColUpper = collection(db, 'Yourcoin');
    unsubCol2 = onSnapshot(yourCoinColUpper, (snapshot) => {
      if (!snapshot.empty) {
        let found: Partial<YourCoinRewards> = {};
        for (const docSnap of snapshot.docs) {
          const extracted = extractYourCoinData(docSnap.data());
          if (extracted.coin !== undefined) found.coin = extracted.coin;
          if (extracted.frendcoin !== undefined) found.frendcoin = extracted.frendcoin;
        }
        currentRewards = {
          coin: found.coin !== undefined ? found.coin : currentRewards.coin,
          frendcoin: found.frendcoin !== undefined ? found.frendcoin : currentRewards.frendcoin,
        };
        callback(currentRewards);
      }
    }, () => {});

  } catch (err) {
    console.warn('Error subscribing to yourcoin rewards:', err);
    callback(defaultRewards);
  }

  // Initial call with defaults
  callback(defaultRewards);

  return () => {
    if (unsubCol1) unsubCol1();
    if (unsubCol2) unsubCol2();
    if (unsubDoc1) unsubDoc1();
  };
}

/**
 * Generate a 6-digit numeric referral code
 */
export function generateSixDigitReferralCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Get or create a 6-digit referral code for a user in Firestore 'referals' collection
 */
export async function getOrCreateUserReferralCode(uid: string, userMobile?: string): Promise<{
  code: string;
  stats: ReferralStats;
}> {
  const defaultCode = generateSixDigitReferralCode();
  if (!uid) {
    return {
      code: defaultCode,
      stats: { totalReferrals: 0, successfulReferrals: 0, totalEarnings: 0, referralCode: defaultCode }
    };
  }

  try {
    const referalDocRef = doc(db, 'referals', uid);
    const snap = await getDoc(referalDocRef);

    if (snap.exists()) {
      const data = snap.data();
      const existingCode = data.referralCode || data.code || data.referral_code;
      // If code exists and is 6 characters/digits
      if (existingCode && String(existingCode).length >= 6) {
        return {
          code: String(existingCode),
          stats: {
            totalReferrals: Number(data.totalReferrals || data.referralsCount || 0),
            successfulReferrals: Number(data.successfulReferrals || data.totalReferrals || 0),
            totalEarnings: Number(data.totalEarnings || data.earnings || 0),
            referralCode: String(existingCode),
            referredUsers: data.referredUsers || []
          }
        };
      }
    }

    // Also check 'users' doc for existing referralCode
    const userDocRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userDocRef);
    let assignedCode = defaultCode;
    if (userSnap.exists()) {
      const uData = userSnap.data();
      if (uData.referralCode && String(uData.referralCode).length >= 6) {
        assignedCode = String(uData.referralCode);
      }
    }

    // Save to Firestore 'referals' collection
    await setDoc(referalDocRef, {
      uid: uid,
      referralCode: assignedCode,
      referral_code: assignedCode,
      code: assignedCode,
      mobile: userMobile || '',
      totalReferrals: 0,
      successfulReferrals: 0,
      totalEarnings: 0,
      referredUsers: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Sync to user profile
    await updateDoc(userDocRef, { referralCode: assignedCode }).catch(() => {});

    return {
      code: assignedCode,
      stats: { totalReferrals: 0, successfulReferrals: 0, totalEarnings: 0, referralCode: assignedCode }
    };
  } catch (err) {
    console.warn('Firestore referral code generation note:', err);
    return {
      code: defaultCode,
      stats: { totalReferrals: 0, successfulReferrals: 0, totalEarnings: 0, referralCode: defaultCode }
    };
  }
}

/**
 * Subscribe in real-time to user's referral stats from Firestore 'referals' collection
 */
export function subscribeToUserReferralData(
  uid: string,
  callback: (stats: ReferralStats & { referralCode?: string }) => void
): () => void {
  if (!uid) return () => {};

  try {
    const referalDocRef = doc(db, 'referals', uid);
    const unsub = onSnapshot(referalDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        callback({
          totalReferrals: Number(data.totalReferrals || data.referralsCount || 0),
          successfulReferrals: Number(data.successfulReferrals || data.totalReferrals || 0),
          totalEarnings: Number(data.totalEarnings || data.earnings || 0),
          referralCode: data.referralCode || data.code,
          referredUsers: data.referredUsers || []
        });
      }
    }, (err) => console.warn('Referrals listener note:', err));

    return unsub;
  } catch (err) {
    console.warn('Error subscribing to referral data:', err);
    return () => {};
  }
}

/**
 * Redeem a 6-digit Referral code or Promo code in Firestore
 * - If 6-digit referral code of another user:
 *    * Referrer gets ₹20 commission added to their 'users/{referrerUid}' balance, totalEarnings, totalReferrals
 *    * Current user (Referee) gets ₹25 bonus added to their 'users/{currentUid}' balance
 * - If general promo code: gets ₹20 bonus added to current user's balance
 */
export async function applyPromoCodeInFirestore(
  uid: string,
  code: string,
  customRewards?: { coin?: number; frendcoin?: number } | number
): Promise<{
  success: boolean;
  message: string;
  newBalance?: string;
  referrerEarned?: number;
  refereeEarned?: number;
}> {
  try {
    const trimmedCode = code.trim().toUpperCase();
    if (!trimmedCode) {
      return { success: false, message: 'Please enter a valid promo code or 6-digit referral code.' };
    }

    if (!uid) {
      return { success: false, message: 'User not authenticated.' };
    }

    // 1. Prevent self-referral
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      return { success: false, message: 'User account not found in Firestore.' };
    }

    const userData = userSnap.data();
    const curBal = parseFloat(userData.balance || '0');

    if (userData.referralCode && String(userData.referralCode).toUpperCase() === trimmedCode) {
      return { success: false, message: 'You cannot use your own referral code!' };
    }

    // 2. Check if already redeemed
    const redeemedKey = `promo_redeemed_${uid}_${trimmedCode}`;
    if (typeof window !== 'undefined' && localStorage.getItem(redeemedKey)) {
      return { success: false, message: 'This referral or promo code has already been redeemed!' };
    }

    // 3. Search Firestore 'referals' collection for this 6-digit code
    let referrerUid: string | null = null;
    let referrerData: any = null;

    try {
      const referalsCol = collection(db, 'referals');
      const q1 = query(referalsCol, where('referralCode', '==', trimmedCode));
      const snap1 = await getDocs(q1);

      if (!snap1.empty) {
        referrerUid = snap1.docs[0].id || snap1.docs[0].data().uid;
        referrerData = snap1.docs[0].data();
      } else {
        const q2 = query(referalsCol, where('code', '==', trimmedCode));
        const snap2 = await getDocs(q2);
        if (!snap2.empty) {
          referrerUid = snap2.docs[0].id || snap2.docs[0].data().uid;
          referrerData = snap2.docs[0].data();
        }
      }

      // Also check 'users' collection where referralCode == trimmedCode
      if (!referrerUid) {
        const usersCol = collection(db, 'users');
        const qUsers = query(usersCol, where('referralCode', '==', trimmedCode));
        const snapUsers = await getDocs(qUsers);
        if (!snapUsers.empty) {
          referrerUid = snapUsers.docs[0].id;
          referrerData = snapUsers.docs[0].data();
        }
      }
    } catch (e) {
      console.warn('Note searching referals collection:', e);
    }

    // Dynamic rewards configured from Firestore 'yourcoin' (defaults: 20 and 25)
    let dynamicReferrer = 20;
    let dynamicReferee = 25;
    if (typeof customRewards === 'object' && customRewards !== null) {
      if (typeof customRewards.coin === 'number' && customRewards.coin >= 0) dynamicReferrer = customRewards.coin;
      if (typeof customRewards.frendcoin === 'number' && customRewards.frendcoin >= 0) dynamicReferee = customRewards.frendcoin;
    } else if (typeof customRewards === 'number' && customRewards >= 0) {
      dynamicReferrer = customRewards;
      dynamicReferee = customRewards;
    }

    const REFERRER_REWARD = dynamicReferrer; // You earn coin from 'yourcoin' -> 'coin'
    const REFEREE_REWARD = dynamicReferee;   // Your friend gets frendcoin from 'yourcoin' -> 'frendcoin'

    // CASE A: VALID 6-DIGIT REFERRAL CODE OF ANOTHER USER
    if (referrerUid && referrerUid !== uid) {
      // 1. Credit Referrer (+ ₹20) in Firestore 'users' balance
      try {
        const referrerUserRef = doc(db, 'users', referrerUid);
        const refUserSnap = await getDoc(referrerUserRef);
        if (refUserSnap.exists()) {
          const curRefBal = parseFloat(refUserSnap.data().balance || '0');
          const updatedRefBal = (curRefBal + REFERRER_REWARD).toString();
          await updateDoc(referrerUserRef, { balance: updatedRefBal });
        }

        // Update Referrer in 'referals' collection
        const refReferalDoc = doc(db, 'referals', referrerUid);
        const refReferalSnap = await getDoc(refReferalDoc);
        const curEarnings = refReferalSnap.exists() ? (Number(refReferalSnap.data().totalEarnings) || 0) : 0;
        const curCount = refReferalSnap.exists() ? (Number(refReferalSnap.data().totalReferrals) || 0) : 0;
        const existingReferredUsers = refReferalSnap.exists() ? (refReferalSnap.data().referredUsers || []) : [];

        await setDoc(refReferalDoc, {
          totalEarnings: curEarnings + REFERRER_REWARD,
          totalReferrals: curCount + 1,
          successfulReferrals: curCount + 1,
          updatedAt: new Date().toISOString(),
          referredUsers: [
            ...existingReferredUsers,
            {
              uid: uid,
              mobile: userData.mobile || '',
              name: userData.name || 'Friend',
              amount: REFERRER_REWARD,
              date: new Date().toLocaleDateString('en-GB'),
              time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              timestamp: new Date().toISOString()
            }
          ]
        }, { merge: true });

        // Add transaction record for referrer
        const txRef = collection(db, 'unified_transactions');
        await addDoc(txRef, {
          senderuid: 'SYSTEM_REFERRAL',
          sendername: 'Referral Bonus',
          senderMobile: 'SYSTEM',
          senderprofilepicture: '',
          senderamount: REFERRER_REWARD,
          senderdate: new Date().toLocaleDateString('en-GB'),
          sendertime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          sendertransactionid: 'REF' + Math.floor(100000000 + Math.random() * 900000000),
          senderstatus: 'successful',
          sendertype: 'receive',
          receiveruid: referrerUid,
          receiverName: referrerData?.name || 'Referrer',
          receivermobile: referrerData?.mobile || '',
          receiverprofilepicture: '',
          receivertransactionid: 'REF' + Math.floor(100000000 + Math.random() * 900000000),
          receivertype: 'receive',
          reciveramount: REFERRER_REWARD,
          reciverdate: new Date().toLocaleDateString('en-GB'),
          reciverstatus: 'successful',
          note: `Referral Commission from user ${userData.mobile || uid.slice(0, 6)}`,
          timestamp: new Date().toISOString()
        });
      } catch (refErr) {
        console.warn('Referrer credit error note:', refErr);
      }

      // 2. Credit Current User (Referee + ₹25) in Firestore 'users' balance
      const updatedUserBal = (curBal + REFEREE_REWARD).toString();
      await updateDoc(userRef, { 
        balance: updatedUserBal,
        referredBy: referrerUid,
        appliedReferralCode: trimmedCode
      });

      // Add transaction record for referee
      try {
        const txRef = collection(db, 'unified_transactions');
        await addDoc(txRef, {
          senderuid: 'SYSTEM_REFERRAL',
          sendername: 'Joining Bonus',
          senderMobile: 'SYSTEM',
          senderprofilepicture: '',
          senderamount: REFEREE_REWARD,
          senderdate: new Date().toLocaleDateString('en-GB'),
          sendertime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
          sendertransactionid: 'JOIN' + Math.floor(100000000 + Math.random() * 900000000),
          senderstatus: 'successful',
          sendertype: 'receive',
          receiveruid: uid,
          receiverName: userData.name || 'User',
          receivermobile: userData.mobile || '',
          receiverprofilepicture: userData.profile_picture || '',
          receivertransactionid: 'JOIN' + Math.floor(100000000 + Math.random() * 900000000),
          receivertype: 'receive',
          reciveramount: REFEREE_REWARD,
          reciverdate: new Date().toLocaleDateString('en-GB'),
          reciverstatus: 'successful',
          note: `Referral Join Bonus (Code: ${trimmedCode})`,
          timestamp: new Date().toISOString()
        });
      } catch (txErr) {
        console.warn('Bonus transaction record creation note:', txErr);
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem(redeemedKey, 'true');
      }

      return {
        success: true,
        message: `অভিনন্দন! ₹${REFEREE_REWARD} বোনাস আপনার ব্যালেন্সে যুক্ত হয়েছে এবং রেফারকারী বন্ধু ₹${REFERRER_REWARD} কমিশন পেয়েছে!`,
        newBalance: updatedUserBal,
        referrerEarned: REFERRER_REWARD,
        refereeEarned: REFEREE_REWARD
      };
    }

    // CASE B: GENERAL PROMO CODE
    const PROMO_REWARD = 20;
    const updatedBal = (curBal + PROMO_REWARD).toString();
    await updateDoc(userRef, { balance: updatedBal });

    if (typeof window !== 'undefined') {
      localStorage.setItem(redeemedKey, 'true');
    }

    try {
      const txRef = collection(db, 'unified_transactions');
      await addDoc(txRef, {
        senderuid: 'SYSTEM_PROMO',
        sendername: 'GK Wallet Promo',
        senderMobile: 'SYSTEM',
        senderprofilepicture: '',
        senderamount: PROMO_REWARD,
        senderdate: new Date().toLocaleDateString('en-GB'),
        sendertime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        sendertransactionid: 'PROMO' + Math.floor(100000000 + Math.random() * 900000000),
        senderstatus: 'successful',
        sendertype: 'receive',
        receiveruid: uid,
        receiverName: userData.name || 'User',
        receivermobile: userData.mobile || '',
        receiverprofilepicture: userData.profile_picture || '',
        receivertransactionid: 'PROMO' + Math.floor(100000000 + Math.random() * 900000000),
        receivertype: 'receive',
        reciveramount: PROMO_REWARD,
        reciverdate: new Date().toLocaleDateString('en-GB'),
        reciverstatus: 'successful',
        note: `Promo Code Reward (${trimmedCode})`,
        timestamp: new Date().toISOString()
      });
    } catch (txErr) {
      console.warn('Bonus transaction record creation note:', txErr);
    }

    return {
      success: true,
      message: `Success! Promo code applied. ₹${PROMO_REWARD} added to your balance.`,
      newBalance: updatedBal,
      refereeEarned: PROMO_REWARD
    };
  } catch (err) {
    console.error('Error applying promo/referral code:', err);
    return { success: false, message: 'Failed to apply code. Please verify and try again.' };
  }
}

/**
 * Fetch referral statistics for a user from Firestore
 */
export async function fetchUserReferralStatsFromFirestore(uid: string): Promise<ReferralStats> {
  try {
    if (uid) {
      // 1. Check doc 'referals/{uid}'
      const referalDocRef = doc(db, 'referals', uid);
      const snap = await getDoc(referalDocRef);
      if (snap.exists()) {
        const d = snap.data();
        return {
          totalReferrals: Number(d.totalReferrals || d.referralsCount || 0),
          successfulReferrals: Number(d.successfulReferrals || d.totalReferrals || 0),
          totalEarnings: Number(d.totalEarnings || d.earnings || 0),
          referralCode: d.referralCode || d.code,
          referredUsers: d.referredUsers || []
        };
      }

      // 2. Fallback to unified_transactions query
      const txRef = collection(db, 'unified_transactions');
      const q = query(txRef, where('receiveruid', '==', uid));
      const txSnap = await getDocs(q);
      let count = 0;
      let earnings = 0;
      txSnap.forEach((d) => {
        const data = d.data();
        if (data.note && (data.note.toLowerCase().includes('referral') || data.note.toLowerCase().includes('promo'))) {
          count++;
          earnings += parseFloat(data.reciveramount || data.senderamount || '0');
        }
      });
      if (count > 0) {
        return {
          totalReferrals: count,
          successfulReferrals: count,
          totalEarnings: earnings
        };
      }
    }
  } catch (err) {
    console.warn('Error fetching referral stats from Firestore:', err);
  }
  return {
    totalReferrals: 0,
    successfulReferrals: 0,
    totalEarnings: 0
  };
}

/**
 * Save user preferences (push notifications, biometric lock, language, theme color)
 * to Firestore 'users' collection and local state.
 */
export async function saveUserSettingsToFirestore(
  uid: string,
  settings: {
    pushNotifications?: boolean;
    biometricLock?: boolean;
    appLanguage?: string;
    themeColor?: string;
  }
): Promise<UserData> {
  const result = await updateUserProfileInFirestore(uid, {
    ...settings,
  });

  if (typeof window !== 'undefined') {
    if (settings.appLanguage) {
      localStorage.setItem('gk_app_language', settings.appLanguage);
    }
    if (settings.themeColor) {
      localStorage.setItem('gk_theme_color', settings.themeColor);
    }
    if (settings.biometricLock !== undefined) {
      localStorage.setItem('gk_biometric_lock', String(settings.biometricLock));
    }
    if (settings.pushNotifications !== undefined) {
      localStorage.setItem('gk_push_notifications', String(settings.pushNotifications));
    }
  }

  return result;
}

/**
 * Real-time listener for Firestore 'notification' and 'notifications' collection
 */
export function subscribeToFirestoreNotifications(
  onUpdate: (notifications: AppNotification[]) => void,
  onNewNotification?: (notification: AppNotification) => void
): () => void {
  try {
    const notifRef = collection(db, 'notification');
    const q = query(notifRef);

    let initialLoad = true;

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const notifs: AppNotification[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          const img = data.image || data.imageUrl || data.img || data.banner || '';
          const desc = data.description || data.desc || data.message || data.body || '';
          notifs.push({
            id: docSnap.id,
            title: data.title || 'Notification',
            description: desc,
            image: img,
            imageUrl: img,
            img: img,
            message: desc,
            desc: desc,
            body: desc,
            time: data.time || (data.timestamp ? new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'),
            date: data.date || (data.timestamp ? new Date(data.timestamp).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' }) : 'Today'),
            timestamp: data.timestamp || new Date().toISOString(),
            type: data.type || 'system',
            read: data.read || false,
            uid: data.uid || '',
          });
        });

        // Check if there are newly added notifications on real-time snapshot
        if (!initialLoad && onNewNotification) {
          snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
              const data = change.doc.data();
              const img = data.image || data.imageUrl || data.img || data.banner || '';
              const desc = data.description || data.desc || data.message || data.body || '';
              onNewNotification({
                id: change.doc.id,
                title: data.title || 'GK Wallet Alert',
                description: desc,
                image: img,
                imageUrl: img,
                img: img,
                message: desc,
                desc: desc,
                body: desc,
                time: data.time || 'Just now',
                date: data.date || 'Today',
                timestamp: data.timestamp || new Date().toISOString(),
                type: data.type || 'system',
                read: false,
                uid: data.uid || '',
              });
            }
          });
        }

        initialLoad = false;
        onUpdate(notifs);
      },
      (error) => {
        console.warn('Firestore notification snapshot warning:', error);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.warn('Error subscribing to notifications:', err);
    return () => {};
  }
}

/**
 * Add a notification document to Firestore 'notification' collection
 */
export async function sendPushNotificationToFirestore(notif: {
  title: string;
  message: string;
  type?: 'system' | 'offer' | 'alert' | 'transaction' | 'payout' | 'coins';
  uid?: string;
}): Promise<boolean> {
  try {
    const notifRef = collection(db, 'notification');
    await addDoc(notifRef, {
      title: notif.title,
      message: notif.message,
      desc: notif.message,
      body: notif.message,
      type: notif.type || 'system',
      uid: notif.uid || 'all',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
    return true;
  } catch (err) {
    console.warn('Failed to add notification to firestore:', err);
    return false;
  }
}




