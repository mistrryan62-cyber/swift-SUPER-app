/**
 * =====================================================================
 * SWIFT SUPER-APP - MAIN LAYOUT COMPONENT (v8.0)
 * =====================================================================
 * Kerangka tata letak antarmuka utama (Header, Navigation, Content Wrapper).
 *
import React from 'react';
export default function MainLayout({ children, activeTab, onTabChange }) {
    return (
      {/* Header Ekosistem SWIFT */}
SWIFT
v8.0
Ecosystem Active
{/* Konten Utama */}
{children}
{/* Navigasi Bawah / Tab Bar */}
onTabChange('home')}
className={  
🏠
Beranda
onTabChange('orders')}
className={
flex flex-col items-center text-xs font-semibold ${activeTab === 'orders' ? 'text-blue-600' : 'text-slate-400'}}  
💳
Dompet
onTabChange('profile')}
className={
  flex flex-col items-center text-xs font-semibold ${activeTab === 'profile' ? 'text-blue-600' : 'text-slate-400'}}
⚙️
Profil
);
}
