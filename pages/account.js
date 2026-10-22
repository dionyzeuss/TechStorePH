// pages/account.js

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Account() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  // State for editing name
  const [editingName, setEditingName] = useState(false);
  const [fullName, setFullName] = useState(session?.user?.name || '');
  const [nameUpdateMessage, setNameUpdateMessage] = useState('');

  // State for editing address
  const [editingAddress, setEditingAddress] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [addressUpdateMessage, setAddressUpdateMessage] = useState('');

  // State for editing password
  const [editingPassword, setEditingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordUpdateMessage, setPasswordUpdateMessage] = useState('');

  useEffect(() => {
    setIsMounted(true);
    if (session?.user?.id) {
      fetchUserData(session.user.id);
    }
  }, [session]);

  useEffect(() => {
    if (isMounted && status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router, isMounted]);

  const fetchUserData = async (userId) => {
    try {
      const response = await fetch(`/api/user-data?userId=${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setShippingAddress(userData.address || '');
      } else {
        console.error('Failed to fetch user data');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleEditName = () => {
    setEditingName(true);
    setNameUpdateMessage('');
  };

  const handleSaveName = async () => {
    try {
      const response = await fetch('/api/change-name', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newFullName: fullName }),
      });
      const data = await response.json();
      setNameUpdateMessage(data.message || (response.ok ? 'Name updated' : 'Failed to update name'));
      if (response.ok) {
        setEditingName(false);
      }
    } catch (error) {
      console.error('Error updating name:', error);
      setNameUpdateMessage('Error updating name. Please try again.');
    }
  };

  const handleEditAddress = () => {
    setEditingAddress(true);
    setAddressUpdateMessage('');
  };

  const handleSaveAddress = async () => {
    try {
      const response = await fetch('/api/change-address', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newAddress: shippingAddress }),
      });
      const data = await response.json();
      setAddressUpdateMessage(data.message || (response.ok ? 'Address updated' : 'Failed to update address'));
      if (response.ok) {
        setEditingAddress(false);
      }
    } catch (error) {
      console.error('Error updating address:', error);
      setAddressUpdateMessage('Error updating address. Please try again.');
    }
  };

  const handleEditPassword = () => {
    setEditingPassword(true);
    setPasswordUpdateMessage('');
    setOldPassword('');
    setNewPassword('');
  };

  const handleSavePassword = async () => {
    if (!oldPassword || !newPassword) {
      setPasswordUpdateMessage('Please fill both passwords.');
      return;
    }
    try {
      const response = await fetch('/api/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const data = await response.json();
      setPasswordUpdateMessage(data.message || (response.ok ? 'Password updated' : 'Failed to update password'));
      if (response.ok) {
        setEditingPassword(false);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordUpdateMessage('Error updating password. Please try again.');
    }
  };

  if (!isMounted || status === 'loading' || status === 'unauthenticated' || !session) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f7f7f7' }}>
      {status === 'loading' ? <p style={{ color: '#777' }}>Loading session...</p> : <p style={{ color: 'red' }}>Not authenticated.</p>}
    </div>;
  }

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px', color: '#333' }}>Account Settings</h1>
      <p style={{ color: '#555', marginBottom: '20px' }}>Manage your account details.</p>

      <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>Change Name</h2>
        {!editingName ? (
          <button style={{ backgroundColor: '#007bff', color: 'white', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', border: 'none' }} onClick={handleEditName}>Edit Name</button>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginRight: '10px' }}
            />
            <button style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', border: 'none' }} onClick={handleSaveName}>Save Name</button>
            {nameUpdateMessage && <p style={{ marginLeft: '10px', color: nameUpdateMessage.includes('Failed') ? 'red' : 'green' }}>{nameUpdateMessage}</p>}
          </div>
        )}
        {!editingName && <p style={{ color: '#555', marginTop: '10px' }}>To change your password, {session?.user?.name || 'Click Edit'}</p>}
      </div>

      <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>Change Address</h2>
        {!editingAddress ? (
          <button style={{ backgroundColor: '#007bff', color: 'white', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', border: 'none' }} onClick={handleEditAddress}>Edit Address</button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <textarea
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              rows="3"
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '10px' }}
            />
            <button style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', border: 'none' }} onClick={handleSaveAddress}>Save Address</button>
            {addressUpdateMessage && <p style={{ marginTop: '10px', color: addressUpdateMessage.includes('Failed') ? 'red' : 'green' }}>{addressUpdateMessage}</p>}
          </div>  
        )}
        {!editingAddress && <p style={{ color: '#555', marginTop: '10px' }}>To change your password: {shippingAddress || 'Click Edit'}</p>}
      </div>

      <div style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '15px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#333', marginBottom: '10px' }}>Change Password</h2>
        {!editingPassword ? (
          <button style={{ backgroundColor: '#007bff', color: 'white', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', border: 'none' }} onClick={handleEditPassword}>Edit Password</button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '10px' }}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', marginBottom: '10px' }}
            />
            <button style={{ backgroundColor: '#28a745', color: 'white', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', border: 'none' }} onClick={handleSavePassword}>Save Password</button>
            {passwordUpdateMessage && <p style={{ marginTop: '10px', color: passwordUpdateMessage.includes('Failed') ? 'red' : 'green' }}>{passwordUpdateMessage}</p>}
          </div>
        )}
        {!editingPassword && <p style={{ color: '#555', marginTop: '10px' }}>To change your password, click Edit.</p>}
      </div>

      <button style={{ backgroundColor: '#dc3545', color: 'white', padding: '10px 15px', borderRadius: '4px', cursor: 'pointer', border: 'none' }} onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}