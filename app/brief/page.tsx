"use client";

import { ChatKitProvider, Chat, widgets } from "@openai/chatkit";

export default function Page() {
  // ① フォーム定義
  const briefForm: widgets.Form = {
    type: "Form",
    id: "article-brief",
    direction: "col",
    gap: 12,
    items: [
      { type: "TextInput",  key: "keyword", label: "キーワード", required: true, placeholder: "例：WordPress ホームページ 作り方" },
      { type: "TextInput",  key: "audience", label: "想定読者", placeholder: "例：中小企業の担当者" },
      { type: "TextArea",   key: "goal", label: "記事の狙い", placeholder: "例：初心者でも30分で理解できる入門記事" },
      { type: "Select",     key: "tone", label: "トーン", options: ["やさしい","実務的","カジュアル","フォーマル","元気","落ち着き"], value: "実務的" },
      { type: "NumberInput",key: "target_length", label: "目標文字数", min: 1200, max: 10000, value: 4000 },
      { type: "Toggle",     key: "conversation_rule.enabled", label: "各H2後に会話を挿入", value: true },
      { type: "Select",     key: "heading_depth", label: "見出し構成", options: ["H2_only","H2_H3"], value: "H2_H3" },
    ],
    onSubmitAction: {
      type: "RunAgent",
      // ← ここをあなたのAgent BuilderでPublishした slug に置き換え
      agent: { slug: "YOUR_PUBLISHED_AGENT_SLUG" },
      payloadFromForm: (vals) => ({
        brief: {
          keyword: vals.keyword,
          audience: vals.audience,
          goal: vals.goal,
          tone: vals.tone,
          target_length: Number(vals.target_length),
          conversation_rule: {
            enabled: Boolean(vals["conversation_rule.enabled"]),
            position: "after_h2",
            turns: 1,
          },
          heading_depth: vals.heading_depth,
        }
      })
    }
  };

  // ② 初期カード
  const introCard: widgets.Card = {
    type: "Card",
    header: { title: "記事ブリーフの入力", subtitle: "以下を埋めて『記事生成を開始』を押してください。" },
    body: [briefForm],
    footer: { actions: [{ type: "SubmitFormAction", formId: "article-brief", label: "記事生成を開始" }] }
  };

  // ③ 画面
  return (
    <ChatKitProvider>
      <main style={{ maxWidth: 820, margin: "0 auto", padding: 24 }}>
        <Chat title="OLTANA 記事生成アシスタント" initialWidgets={[introCard]} />
      </main>
    </ChatKitProvider>
  );
}
