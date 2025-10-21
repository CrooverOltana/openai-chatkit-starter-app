'use client';

import { ChatKit, useChatKit } from '@openai/chatkit-react';

export default function BriefPage() {
  const { control } = useChatKit({
    api: {
      // ← 型を公式定義に合わせる（null許容）／必ず string を返す
      async getClientSecret(currentClientSecret: string | null): Promise<string> {
        // currentClientSecret は「まだ有効ならそのまま使ってね」というヒント用ですが
        // スターターでは毎回サーバに新規発行を依頼する実装でOKです。
        const res = await fetch('/api/create-session', {
          method: 'POST',
          // vercel のビルド/キャッシュ環境でも毎回取りにいく
          cache: 'no-store'
        });
        const json = await res.json();
        // スターターのAPIは通常 { client_secret: string } を返します。
        // リポジトリによっては clientSecret という camelCase の場合もあるので両対応。
        const secret = (json.client_secret ?? json.clientSecret) as string | undefined;
        if (typeof secret !== 'string' || !secret) {
          throw new Error('create-session API から client_secret が返ってきませんでした。');
        }
        return secret;
      },
    },
  });

return (
  <div style={{ padding: 24 }}>
    <h1 style={{ fontSize: 20, marginBottom: 12 }}>記事ブリーフ</h1>

    {/* ChatKitの入れ物に確実な高さを与える */}
    <div style={{ height: 720, width: '100%', border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
      <ChatKit control={control} />
    </div>

    {/* デバッグ手順メモ（消してOK）:
       1) DevTools > Network で /api/create-session の結果を確認
       2) Status が 200 で、JSONに client_secret or clientSecret があるか
       3) 失敗なら Vercel の環境変数 OPENAI_API_KEY を再確認
    */}
  </div>
);
}
