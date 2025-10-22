import { ColorScheme, StartScreenPrompt, ThemeOption } from "@openai/chatkit";

/** Agent Builder で発行された Workflow ID（環境変数から参照） */
export const WORKFLOW_ID =
  process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID?.trim() ?? "";

/** セッション発行エンドポイント（Starter 既定値のまま） */
export const CREATE_SESSION_ENDPOINT = "/api/create-session";

/** スタート画面のクイック質問（必要に応じて増減OK） */
export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "何ができますか？",
    prompt: "あなたは何ができますか？",
    icon: "circle-question",
  },
  {
    label: "初期設定の手順を知りたい",
    prompt: "テーマの初期設定の手順を教えてください。",
    icon: "wand-magic-sparkles",
  },
  {
    label: "ライセンス認証",
    prompt: "ライセンス認証のやり方を教えてください。",
    icon: "key",
  },
];

/** 入力欄のプレースホルダ */
export const PLACEHOLDER_INPUT = "ご質問をどうぞ";

/** スタート画面の見出し（挨拶） */
export const GREETING = "本日どのようなご用件でしょうか？";

/**
 * テーマ設定（ライト/ダークで自動切替）
 * 必要に応じて brand color や角丸を微調整してください。
 */
export const getThemeConfig = (theme: ColorScheme): ThemeOption => ({
  color: {
    grayscale: {
      hue: 220,
      tint: 6,
      shade: theme === "dark" ? -1 : -4,
    },
    accent: {
      // 主要カラー（ライトでは濃色、ダークでは淡色）
      primary: theme === "dark" ? "#f1f5f9" : "#0f172a",
      level: 1,
    },
  },
  // 角丸。「round」はやや大きめ。xl/lg/sm/none なども可
  radius: "round",
  // 他のオプションは chatkit.studio/playground で確認できます
});
