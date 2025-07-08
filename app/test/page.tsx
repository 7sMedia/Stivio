// ✅ File: app/test/page.tsx

"use client";
import { useEffect, useState } from "react";

export default function TestDropboxAuthPage() {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // TEMP user ID for testing (copy from Supabase dashboard > Users > ID column)
    setUserId("REPLACE_THIS_WITH_ACTUAL_USER_ID");
  }, []);

  const startOAuth = () => {
    if (!userId) return;
    const url = `/api/dropbox/auth?user_id=${userId}`;
    window.location.href = url;
  };

  return (
    <div className="p-10 text-white">
      <h1 className="text-2xl font-bold mb-4">Test Dropbox OAuth</h1>
      <button
        onClick={startOAuth}
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded"
      >
        Connect Dropbox
      </button>
    </div>
  );
}
