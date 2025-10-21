'use client';

import { useState } from 'react';
import { ChatKit, useChatKit } from '@openai/chatkit-react';

export default function BriefPage() {
  // ---- ChatKit 初期化（既存どおり） ----
  const { control } = useChatKit({
    api: {
      async getClientSecret(currentClientSecret: string | null): Promise<string> {
        const res = await fetch('/api/create-session', { method: 'POST', cache: 'no-store' });
        const json = await res.json();
        const secret = (json.client_secret ?? json.clientSecret) as string | undefined;
        if (!secret) throw new Error('create-session API から client_secret が返りませんでした。');
        return secret;
      },
    },
  });

  // ---- フォーム状態 ----
  const [keyword, setKeyword] = useState('');
  const [audience, setAudience] = useState('');
  const [goal, setGoal] = useState('');
  const [tone, setTone] = useState('実務的');
  const [targetLength, setTargetLength] = useState(4000);
  const [convEnabled, setConvEnabled] = useState(true);
  const [headingDepth, setHeadingDepth] = useState('H2_H3');

  // ---- 送信：collector が読める形で最初のメッセージを投げる ----
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // collector が最初のユーザーメッセージから brief を拾う想定なら、
    // JSONをそのままテキストにして投げるのが手堅い（パースしやすい）
    const brief = {
      keyword,
      audience,
      goal,
      tone,
      target_length: Number(targetLength),
      conversation_rule: { enabled: Boolean(convEnabled), position: 'after_h2', turns: 1 },
      heading_depth: headingDepth,
    };

    // ChatKitの入力欄にテキストを送る（ユーザーメッセージとして）
    // ※ ラッパーのAPI名は実装バージョンで異なることがあるため、
    //   既存スターターで用意されている「メッセージ送信」メソッドに合わせてください。
    //   代表的には control.chat.send(text) や control.sendMessage(text) 等。
    //   無い場合は、まずはユーザーがコピペできるよう下に表示でもOK。
    const text = `BRIEF_JSON:\n\`\`\`json\n${JSON.stringify(brief, null, 2)}\n\`\`\`\nこのブリーフに基づいて記事生成を開始して。`;
    // 例: （存在するメソッド名に読み替えてください）
    // await control.chat.send(text);

    // 暫定：送信手段が未確認の場合は、アラートでコピペを促す
    alert('下のチャットに次のテキストを貼って送信してください：\n\n' + text);
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 20, marginBottom: 12 }}>記事ブリーフ</h1>

      {/* ---- 上部にフォーム ---- */}
      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12, marginBottom: 16, maxWidth: 820 }}>
        <label>キーワード<input value={keyword} onChange={e=>setKeyword(e.target.value)} required style={{width:'100%'}}/></label>
        <label>想定読者<input value={audience} onChange={e=>setAudience(e.target.value)} style={{width:'100%'}}/></label>
        <label>記事の狙い<textarea value={goal} onChange={e=>setGoal(e.target.value)} rows={3} style={{width:'100%'}}/></label>
        <label>トーン
          <select value={tone} onChange={e=>setTone(e.target.value)}>
            <option>やさしい</option><option>実務的</option><option>カジュアル</option>
            <option>フォーマル</option><option>元気</option><option>落ち着き</option>
          </select>
        </label>
        <label>目標文字数<input type="number" value={targetLength} onChange={e=>setTargetLength(Number(e.target.value))} min={1200} max={10000}/></label>
        <label><input type="checkbox" checked={convEnabled} onChange={e=>setConvEnabled(e.target.checked)}/> 各H2後に会話を挿入</label>
        <label>見出し構成
          <select value={headingDepth} onChange={e=>setHeadingDepth(e.target.value)}>
            <option value="H2_only">H2_only</option>
            <option value="H2_H3">H2_H3</option>
          </select>
        </label>
        <button type="submit">この内容で記事生成を開始</button>
      </form>

      {/* ---- 下にChatKit本体（高さ固定） ---- */}
      <div style={{ height: 720, width: '100%', border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
        <ChatKit control={control} />
      </div>
    </div>
  );
}
