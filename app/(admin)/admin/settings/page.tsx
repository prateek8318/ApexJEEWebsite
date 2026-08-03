"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Bell, 
  Lock, 
  User, 
  Globe, 
  Mail, 
  Smartphone, 
  Shield, 
  Save
} from "lucide-react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFC] pb-10">
      <div className="px-8 mt-8 max-w-[1400px] mx-auto grid grid-cols-12 gap-8">
        
        {/* Settings Sidebar */}
        <div className="col-span-12 md:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sticky top-28">
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => setActiveTab("general")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "general"
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Globe size={18} />
                General
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "security"
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Shield size={18} />
                Security
              </button>
              <button
                onClick={() => setActiveTab("notifications")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "notifications"
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <Bell size={18} />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === "profile"
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <User size={18} />
                Profile Info
              </button>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="col-span-12 md:col-span-9">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
            
            {activeTab === "general" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">General Settings</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage your platform's basic information.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Platform Name</Label>
                    <Input defaultValue="Apex JEE" className="h-11 bg-slate-50/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Support Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <Input defaultValue="support@apexjee.com" className="h-11 pl-9 bg-slate-50/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Contact Phone</Label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <Input defaultValue="+91 98765 43210" className="h-11 pl-9 bg-slate-50/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Timezone</Label>
                    <select className="w-full h-11 px-3 rounded-md border border-slate-200 bg-slate-50/50 text-sm outline-none focus:border-indigo-500">
                      <option>Asia/Kolkata (IST)</option>
                      <option>America/New_York (EST)</option>
                      <option>Europe/London (GMT)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Security</h2>
                  <p className="text-sm text-slate-500 mt-1">Update your password and secure your account.</p>
                </div>
                
                <div className="max-w-md space-y-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Current Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <Input type="password" placeholder="••••••••" className="h-11 pl-9 bg-slate-50/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <Input type="password" placeholder="••••••••" className="h-11 pl-9 bg-slate-50/50" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <Input type="password" placeholder="••••••••" className="h-11 pl-9 bg-slate-50/50" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Notification Preferences</h2>
                  <p className="text-sm text-slate-500 mt-1">Choose what alerts you want to receive.</p>
                </div>
                
                <div className="space-y-4">
                  {[
                    { title: "New Student Registrations", desc: "Get notified when a new student joins the platform." },
                    { title: "Payment Alerts", desc: "Receive alerts for successful subscriptions and failures." },
                    { title: "Doubt Forum Activity", desc: "Daily summary of unanswered doubts in the forum." },
                    { title: "System Updates", desc: "Important updates regarding platform maintenance." }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <div>
                        <p className="font-semibold text-slate-800">{item.title}</p>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer" defaultChecked={idx < 2} />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Profile Information</h2>
                  <p className="text-sm text-slate-500 mt-1">Manage your personal admin profile.</p>
                </div>
                
                <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                  <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-sm flex items-center justify-center relative group cursor-pointer overflow-hidden">
                    <User size={40} className="text-slate-400 group-hover:opacity-0 transition-opacity" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-semibold">Upload</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">Profile Picture</h3>
                    <p className="text-sm text-slate-500 mt-1">PNG, JPG up to 2MB</p>
                    <div className="mt-3 flex gap-3">
                      <Button variant="outline" size="sm" className="h-8">Change</Button>
                      <Button variant="ghost" size="sm" className="h-8 text-red-500 hover:text-red-600 hover:bg-red-50">Remove</Button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Full Name</Label>
                    <Input defaultValue="Admin User" className="h-11 bg-slate-50/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">Role</Label>
                    <Input defaultValue="Super Admin" disabled className="h-11 bg-slate-100 text-slate-500" />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-10 pt-6 border-t border-slate-100 flex justify-end">
              <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 h-11 rounded-lg font-bold shadow-md hover:shadow-lg transition-all"
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Save size={18} />
                    Save Changes
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
