// app/brief/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { ChatKit, useChatKit } from '@openai/chatkit-react';

export default function BriefPage() {
  // 1) サーバーのセッションAPIから clientToken を取ってくる
  const [token, setToken] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const res = await fetch('/api/create-session', { method: 'POST' });
      const json = await res.json();
      setToken(json.clientToken);
    })();
  }, []);

  // 2) token を使って ChatKit を初期化
  const { control } = useChatKit(
    token ? { api: { clientToken: token } } : { api: { clientToken: '' } }
  );

  if (!token) return <div>Loading…</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl mb-4">記事ブリーフ</h1>
      {/* ここに後でフォーム用のウィジェット連携を追加できます */}
      <ChatKit control={control} className="h-[700px] w-full" />
    </div>
  );
}
