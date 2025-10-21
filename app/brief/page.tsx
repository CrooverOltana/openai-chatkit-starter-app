'use client';

import { ChatKit, useChatKit } from '@openai/chatkit-react';

export default function BriefPage() {
  // 1) useChatKit を「client_secret を取得する関数」で初期化
  const { control } = useChatKit({
    api: {
      async getClientSecret(currentClientSecret?: string) {
        // 初回 or 期限切れ時はサーバーのセッション作成APIを叩く
        const res = await fetch('/api/create-session', { method: 'POST' });
        const { client_secret } = await res.json();
        return client_secret;
      },
    },
  });

  // 2) 必要になったらフォーム用のウィジェット連携をここに足せます
  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, marginBottom: 12 }}>記事ブリーフ</h1>
      <ChatKit control={control} className="h-[700px] w-full" />
    </div>
  );
}
