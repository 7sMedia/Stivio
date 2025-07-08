"use client";

import React from "react";

export default function DropboxConnectButton() {
  const dropboxClientId = process.env.NEXT_PUBLIC_DROPBOX_CLIENT_ID;
  const redirectUri = process.env.NEXT_PUBLIC_DROPBOX_REDIRECT_URI;

  const handleConnect = () => {
    if (!dropboxClientId || !redirectUri) {
      alert("Dropbox config missing in .env");
      return;
    }

    const authUrl = `https://www.dropbox.com/oauth2/authorize?client_id=${dropboxClientId}&response_type=code&token_access_type=offline&redirect_uri=${redirectUri}`;
    window.location.href = authUrl;
  };

  return (
    <button
      onClick={handleConnect}
      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow"
    >
      Connect Dropbox
    </button>
  );
}
