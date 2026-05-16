"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiLock,
  FiMapPin,
  FiCreditCard,
  FiBell,
  FiShield,
  FiTrash2,
  FiChevronRight,
  FiEdit3,
  FiPlus,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

export default function AccountSettingsPage() {
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);


  const [activeTab, setActiveTab] = useState("personal");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingPersonal, setLoadingPersonal] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeTab]);

  const [personalInfo, setPersonalInfo] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: (session?.user as any)?.mobile || "",
  });

  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    smsAlerts: false,
  });

  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState<string>(() => {
    try {
      return localStorage.getItem("privacy.profileVisibility") ?? "Private";
    } catch {
      return "Private";
    }
  });
  const [shareWithPartners, setShareWithPartners] = useState<boolean>(() => {
    try {
      return localStorage.getItem("privacy.shareWithPartners") === "true";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("privacy.profileVisibility", profileVisibility);
    } catch {}
  }, [profileVisibility]);

  useEffect(() => {
    try {
      localStorage.setItem("privacy.shareWithPartners", String(shareWithPartners));
    } catch {}
  }, [shareWithPartners]);

  // Sync form with session when session data changes
  useEffect(() => {
    if (session?.user) {
      setPersonalInfo({
        name: session.user.name || "",
        email: session.user.email || "",
        phone: (session.user as any).mobile || "",
      });
    }
  }, [session?.user?.name, session?.user?.email, (session?.user as any)?.mobile]);

  const requestDataExport = async () => {
    setExporting(true);
    try {
      const res = await fetch("/api/account/export");
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        alert("Export failed: " + (error?.error || res.statusText));
        return;
      }
      const json = await res.json();
      const payload = json.data ?? json;
      const filename = `sahakari-data-export-${new Date().toISOString().slice(0,10)}.json`;
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export data.");
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Permanently delete your account? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert("Account deletion failed: " + (json?.error || res.statusText));
        setDeleting(false);
        return;
      }
      alert("Your account has been deleted. Signing out...");
      await signOut({ callbackUrl: "/" });
    } catch (err) {
      console.error(err);
      alert("Failed to delete account.");
    } finally {
      setDeleting(false);
    }
  };

  const tabs = [
    { id: "personal", label: "Personal Information", icon: FiUser },
    { id: "security", label: "Security & Password", icon: FiLock },
    { id: "addresses", label: "Addresses", icon: FiMapPin },
    { id: "payment", label: "Payment Methods", icon: FiCreditCard },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "privacy", label: "Privacy & Data", icon: FiShield },
  ];

  // Addresses (persisted to localStorage for now)
  const [addresses, setAddresses] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem("account.addresses");
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      {
        id: "1",
        type: "Home",
        name: session?.user?.name || "John Doe",
        address: "123 Main Street, Apartment 4B",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400001",
        phone: (session?.user as any)?.mobile || "9876543210",
        isDefault: true,
      },
      {
        id: "2",
        type: "Work",
        name: session?.user?.name || "John Doe",
        address: "456 Business Park, Office 201",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400002",
        phone: (session?.user as any)?.mobile || "9876543210",
        isDefault: false,
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem("account.addresses", JSON.stringify(addresses));
    } catch {}
  }, [addresses]);

  const [showAddAddress, setShowAddAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<any>({
    type: "Home",
    name: session?.user?.name || "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: (session?.user as any)?.mobile || "",
    isDefault: false,
  });

  const generateId = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

  const startAddAddress = () => {
    setAddressForm({
      type: "Home",
      name: session?.user?.name || "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      phone: (session?.user as any)?.mobile || "",
      isDefault: false,
    });
    setEditingAddressId(null);
    setShowAddAddress(true);
  };

  const startEditAddress = (addr: any) => {
    setAddressForm({ ...addr });
    setEditingAddressId(addr.id);
    setShowAddAddress(true);
  };

  const saveAddress = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editingAddressId) {
      setAddresses((prev) => prev.map((a) => (a.id === editingAddressId ? { ...a, ...addressForm } : a)));
    } else {
      const newAddr = { ...addressForm, id: generateId(), isDefault: addressForm.isDefault || addresses.length === 0 };
      setAddresses((prev) => (newAddr.isDefault ? [newAddr, ...prev.map((a) => ({ ...a, isDefault: false }))] : [...prev, newAddr]));
    }
    setShowAddAddress(false);
    setEditingAddressId(null);
  };

  const deleteAddress = (id: string) => {
    if (!confirm("Delete this address?")) return;
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
  };

  // Payment methods (persisted to localStorage for now)
  const [paymentMethods, setPaymentMethods] = useState<any[]>(() => {
    try {
      const raw = localStorage.getItem("account.paymentMethods");
      if (raw) return JSON.parse(raw);
    } catch {}
    return [
      { id: "pm1", type: "Credit Card", last4: "4321", expiry: "12/26", brand: "Visa", isDefault: true },
      { id: "pm2", type: "UPI", upiId: "john.doe@upi", isDefault: false },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem("account.paymentMethods", JSON.stringify(paymentMethods));
    } catch {}
  }, [paymentMethods]);

  const [showAddPayment, setShowAddPayment] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState<any>({ type: "Credit Card", brand: "", last4: "", expiry: "", upiId: "", isDefault: false });

  const startAddPayment = () => {
    setPaymentForm({ type: "Credit Card", brand: "", last4: "", expiry: "", upiId: "", isDefault: false });
    setEditingPaymentId(null);
    setShowAddPayment(true);
  };

  const startEditPayment = (pm: any) => {
    setPaymentForm({ ...pm });
    setEditingPaymentId(pm.id);
    setShowAddPayment(true);
  };

  const savePayment = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (editingPaymentId) {
      setPaymentMethods((prev) => prev.map((p) => (p.id === editingPaymentId ? { ...p, ...paymentForm } : p)));
    } else {
      const newPm = { ...paymentForm, id: generateId(), isDefault: paymentForm.isDefault || paymentMethods.length === 0 };
      setPaymentMethods((prev) => (newPm.isDefault ? [newPm, ...prev.map((p) => ({ ...p, isDefault: false }))] : [...prev, newPm]));
    }
    setShowAddPayment(false);
    setEditingPaymentId(null);
  };

  const deletePayment = (id: string) => {
    if (!confirm("Delete this payment method?")) return;
    setPaymentMethods((prev) => prev.filter((p) => p.id !== id));
  };

  const setDefaultPayment = (id: string) => setPaymentMethods((prev) => prev.map((p) => ({ ...p, isDefault: p.id === id })));

  const handlePersonalInfoUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoadingPersonal(true);
    
    try {
      const res = await fetch("/api/account/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: personalInfo.name,
          phone: personalInfo.phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to update profile");
        return;
      }

      // Update local state with the returned data
      if (data.data) {
        setPersonalInfo({
          name: data.data.name || personalInfo.name,
          email: data.data.email || personalInfo.email,
          phone: data.data.mobile || personalInfo.phone,
        });
      }

      // Refresh the session to update NextAuth session data
      await updateSession();

      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to update profile. Please try again.");
    } finally {
      setLoadingPersonal(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (passwordData.new !== passwordData.confirm) {
      setErrorMessage("New passwords don't match!");
      return;
    }

    if (passwordData.new.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return;
    }

    setLoadingPassword(true);

    try {
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: passwordData.current,
          newPassword: passwordData.new,
          confirmPassword: passwordData.confirm,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to change password");
        return;
      }

      setSuccessMessage("Password changed successfully!");
      setPasswordData({ current: "", new: "", confirm: "" });
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to change password. Please try again.");
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Show loading / unauthenticated states after hooks are declared
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Verifying your session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account preferences and information</p>
        </div>

        {/* Success and Error Messages */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
            ✓ {successMessage}
          </div>
        )}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            ✕ {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? "bg-blue-50 text-blue-700 border border-blue-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <Icon size={18} />
                      <span className="text-sm font-medium">{tab.label}</span>
                      <FiChevronRight
                        size={14}
                        className={`ml-auto transition-transform ${
                          activeTab === tab.id ? "rotate-90" : ""
                        }`}
                      />
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {/* Personal Information */}
              {activeTab === "personal" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
                  <form onSubmit={handlePersonalInfoUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={personalInfo.name}
                          onChange={(e) => setPersonalInfo(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo(prev => ({ ...prev, phone: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Email changes require verification
                      </p>
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={loadingPersonal}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {loadingPersonal ? "Saving..." : "Save Changes"}
                      </button>
                      <button
                        type="button"
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Security & Password */}
              {activeTab === "security" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Change Password</h2>
                  <form onSubmit={handlePasswordChange} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.current}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.new}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirm}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                        </button>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        disabled={loadingPassword}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                      >
                        {loadingPassword ? "Changing..." : "Change Password"}
                      </button>
                      <button
                        type="button"
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>

                  <div className="mt-8 pt-8 border-t border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                    <p className="text-gray-600 mb-4">
                      Add an extra layer of security to your account by enabling two-factor authentication.
                    </p>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              )}

              {/* Addresses */}
              {activeTab === "addresses" && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Delivery Addresses</h2>
                    <button
                      onClick={startAddAddress}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <FiPlus size={16} />
                      Add New Address
                    </button>
                  </div>

                  {/* Add / Edit form */}
                  {showAddAddress && (
                    <form onSubmit={saveAddress} className="mb-4 border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          placeholder="Type (Home/Work)"
                          value={addressForm.type}
                          onChange={(e) => setAddressForm((p: any) => ({ ...p, type: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded"
                        />
                        <input
                          placeholder="Full name"
                          value={addressForm.name}
                          onChange={(e) => setAddressForm((p: any) => ({ ...p, name: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded"
                        />
                        <input
                          placeholder="Phone"
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm((p: any) => ({ ...p, phone: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded"
                        />
                      </div>

                      <div>
                        <input
                          placeholder="Street address"
                          value={addressForm.address}
                          onChange={(e) => setAddressForm((p: any) => ({ ...p, address: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <input
                          placeholder="City"
                          value={addressForm.city}
                          onChange={(e) => setAddressForm((p: any) => ({ ...p, city: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded"
                        />
                        <input
                          placeholder="State"
                          value={addressForm.state}
                          onChange={(e) => setAddressForm((p: any) => ({ ...p, state: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded"
                        />
                        <input
                          placeholder="Pincode"
                          value={addressForm.pincode}
                          onChange={(e) => setAddressForm((p: any) => ({ ...p, pincode: e.target.value }))}
                          className="px-3 py-2 border border-gray-300 rounded"
                        />
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={addressForm.isDefault}
                            onChange={(e) => setAddressForm((p: any) => ({ ...p, isDefault: e.target.checked }))}
                          />
                          <span className="text-sm">Set as default</span>
                        </label>
                      </div>

                      <div className="flex gap-4">
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                          {editingAddressId ? "Save" : "Add address"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddAddress(false);
                            setEditingAddressId(null);
                          }}
                          className="px-4 py-2 border border-gray-300 rounded-lg"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium text-gray-900">{address.type}</span>
                              {address.isDefault && (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Default</span>
                              )}
                            </div>
                            <p className="text-gray-700 mb-1">{address.name}</p>
                            <p className="text-gray-600 text-sm">{address.address}, {address.city}, {address.state} - {address.pincode}</p>
                            <p className="text-gray-600 text-sm">{address.phone}</p>
                          </div>
                          <div className="flex gap-2 items-center">
                            <button onClick={() => startEditAddress(address)} className="p-2 text-gray-400 hover:text-gray-600">
                              <FiEdit3 size={16} />
                            </button>
                            {!address.isDefault && (
                              <>
                                <button onClick={() => setDefaultAddress(address.id)} className="px-2 py-1 text-xs bg-gray-100 rounded">Make default</button>
                                <button onClick={() => deleteAddress(address.id)} className="p-2 text-red-400 hover:text-red-600">
                                  <FiTrash2 size={16} />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Payment Methods */}
              {activeTab === "payment" && (
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Payment Methods</h2>
                    <button onClick={startAddPayment} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <FiPlus size={16} />
                      Add Payment Method
                    </button>
                  </div>

                  {/* Add / Edit payment form */}
                  {showAddPayment && (
                    <form onSubmit={savePayment} className="mb-4 border border-gray-200 rounded-lg p-4 space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <select value={paymentForm.type} onChange={(e) => setPaymentForm((p: any) => ({ ...p, type: e.target.value }))} className="px-3 py-2 border border-gray-300 rounded">
                          <option>Credit Card</option>
                          <option>UPI</option>
                        </select>

                        {paymentForm.type === "Credit Card" ? (
                          <>
                            <input placeholder="Brand" value={paymentForm.brand} onChange={(e) => setPaymentForm((p: any) => ({ ...p, brand: e.target.value }))} className="px-3 py-2 border border-gray-300 rounded" />
                            <input placeholder="Last 4 digits" value={paymentForm.last4} onChange={(e) => setPaymentForm((p: any) => ({ ...p, last4: e.target.value }))} className="px-3 py-2 border border-gray-300 rounded" />
                            <input placeholder="Expiry (MM/YY)" value={paymentForm.expiry} onChange={(e) => setPaymentForm((p: any) => ({ ...p, expiry: e.target.value }))} className="px-3 py-2 border border-gray-300 rounded" />
                          </>
                        ) : (
                          <input placeholder="UPI ID" value={paymentForm.upiId} onChange={(e) => setPaymentForm((p: any) => ({ ...p, upiId: e.target.value }))} className="px-3 py-2 border border-gray-300 rounded col-span-2" />
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked={paymentForm.isDefault} onChange={(e) => setPaymentForm((p: any) => ({ ...p, isDefault: e.target.checked }))} />
                          <span className="text-sm">Set as default</span>
                        </label>
                      </div>

                      <div className="flex gap-4">
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">{editingPaymentId ? "Save" : "Add"}</button>
                        <button type="button" onClick={() => { setShowAddPayment(false); setEditingPaymentId(null); }} className="px-4 py-2 border border-gray-300 rounded-lg">Cancel</button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div key={method.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <FiCreditCard size={20} className="text-gray-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{method.type === "Credit Card" ? `${method.brand} **** ${method.last4}` : method.upiId}</p>
                              <p className="text-gray-600 text-sm">{method.type === "Credit Card" ? `Expires ${method.expiry}` : "UPI ID"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            {method.isDefault && (<span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">Default</span>)}
                            <button onClick={() => startEditPayment(method)} className="p-2 text-gray-400 hover:text-gray-600"><FiEdit3 size={16} /></button>
                            {!method.isDefault && (
                              <>
                                <button onClick={() => setDefaultPayment(method.id)} className="px-2 py-1 text-xs bg-gray-100 rounded">Make default</button>
                                <button onClick={() => deletePayment(method.id)} className="p-2 text-red-400 hover:text-red-600"><FiTrash2 size={16} /></button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Order Updates</h3>
                        <p className="text-gray-600 text-sm">Get notified about order status changes</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.orderUpdates}
                          onChange={(e) => handleNotificationChange("orderUpdates", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Promotional Offers</h3>
                        <p className="text-gray-600 text-sm">Receive special offers and discounts</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.promotions}
                          onChange={(e) => handleNotificationChange("promotions", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">Newsletter</h3>
                        <p className="text-gray-600 text-sm">Weekly newsletter with product updates</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.newsletter}
                          onChange={(e) => handleNotificationChange("newsletter", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">SMS Alerts</h3>
                        <p className="text-gray-600 text-sm">Receive important updates via SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications.smsAlerts}
                          onChange={(e) => handleNotificationChange("smsAlerts", e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Privacy & Data */}
              {activeTab === "privacy" && (
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Privacy & Data</h2>

                  <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Data Export</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Download a copy of all your personal data and order history.
                      </p>
                      <button
                        onClick={requestDataExport}
                        disabled={exporting}
                        className={`px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ${
                          exporting ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      >
                        {exporting ? "Preparing..." : "Request Data Export"}
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Data Deletion</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Permanently delete your account and all associated data. This action cannot be undone.
                      </p>
                      <button
                        onClick={handleDeleteAccount}
                        disabled={deleting}
                        className={`px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors ${
                          deleting ? "opacity-60 cursor-not-allowed" : ""
                        }`}
                      >
                        <FiTrash2 size={16} className="inline mr-2" />
                        {deleting ? "Deleting..." : "Delete Account"}
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Privacy Settings</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        Control how your data is used and shared.
                      </p>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Profile visibility</span>
                          <select
                            value={profileVisibility}
                            onChange={(e) => setProfileVisibility(e.target.value)}
                            className="px-3 py-1 border border-gray-300 rounded text-sm"
                          >
                            <option>Public</option>
                            <option>Friends only</option>
                            <option>Private</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-700">Data sharing with partners</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              className="sr-only peer"
                              checked={shareWithPartners}
                              onChange={(e) => setShareWithPartners(e.target.checked)}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}