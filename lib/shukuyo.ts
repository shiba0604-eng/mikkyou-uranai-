/**
 * 宿曜占星術（二十七宿）計算エンジン
 * =========================================
 * コンセプト: 「避凶（ひきょう）」― 運気を下げる行動を徹底的に避ける
 *
 * 宿曜道（密教占星術）は吉を追うより凶を避けることに本質がある。
 * 本モジュールは六害宿・宿の凶日・相性の凶判定を中心に設計する。
 *
 * ## 計算原理
 * - 月は約27.32日で地球を一周する
 * - その軌道上を27等分した区画を「宿（しゅく）」と呼ぶ
 * - 生年月日の「本命宿」と今日の「当日宿」の組み合わせで吉凶を判定
 *
 * ## 六害宿（ろくがいしゅく）
 * 本命宿から数えて特定の距離にある6つの宿。
 * これらの日は行動を避けるべき「大凶日」とされる。
 * 距離: +5, +6, +7, +14, +20, +21（宿曜経に基づく）
 */

// ─────────────────────────────────────────
// 型定義
// ─────────────────────────────────────────

export type ShukuElement = "金" | "日" | "火" | "水" | "木" | "土" | "月";
export type ShukuNature = "安" | "危" | "中";
export type AvoidanceLevel = "大凶" | "凶" | "注意" | "平" | "中吉" | "吉" | "大吉";

/** 宿の基本データ */
export interface Shuku {
  index: number;        // 0〜26
  name: string;         // 日本語名（例: 角宿）
  reading: string;      // 読み
  sanskrit: string;     // サンスクリット名
  element: ShukuElement;// 守護星（七曜）
  nature: ShukuNature;  // 宿の本質（安・危・中）
  /** この宿の日に絶対避けるべき行動 */
  avoidActions: string[];
  /** この宿の日に行うと凶が増す事柄 */
  dangerAreas: string[];
  /** 吉方向（この宿の日にやっても良いこと） */
  safeActions: string[];
  keywords: string[];
}

/** 六害宿判定結果 */
export interface RikkaiResult {
  isRikkai: boolean;
  /** 六害の種類（どの害か） */
  rikkaType: RikkaiType | null;
  severity: 1 | 2 | 3; // 1=最大凶, 2=大凶, 3=凶
  description: string;
  /** この日に絶対やってはいけないこと */
  absoluteAvoid: string[];
}

export type RikkaiType =
  | "衰（おとろえ）"   // +5: 物事が衰える
  | "壊（こわれ）"     // +6: 破壊・崩壊
  | "危（き）"         // +7: 身の危険
  | "成（なる）"       // +14: 表面上は吉に見えて実は罠
  | "収（おさまり）"   // +20: 収縮・損失
  | "開（ひらく）";    // +21: 開きすぎて空洞化

/** 相性判定結果 */
export interface CompatibilityResult {
  type: CompatibilityType;
  score: number;        // 0〜100（低いほど凶）
  isHarmful: boolean;   // 真の凶相性かどうか
  avoidReason: string | null;
  description: string;
}

export type CompatibilityType =
  | "同宿"   // 距離0:  最強の縁
  | "命合"   // 距離4:  生涯の縁（最吉）
  | "業合"   // 距離9:  深い縁（吉）
  | "胎合"   // 距離13: 恋愛の縁（吉）
  | "安合"   // 距離5:  安定の縁（中吉）※六害と重なる場合は要注意
  | "衰"     // 距離5:  衰退（凶）
  | "壊"     // 距離6:  破壊（大凶）
  | "危"     // 距離7:  危険（大凶）
  | "成"     // 距離14: 罠（凶）
  | "収"     // 距離20: 損失（凶）
  | "開"     // 距離21: 空洞化（凶）
  | "平";    // その他: 普通

/** 今日の総合凶判定 */
export interface DangerAssessment {
  date: string;
  birthShuku: Shuku;
  todayShuku: Shuku;
  avoidanceLevel: AvoidanceLevel;
  /** 今日の危険スコア（0=安全, 100=最大凶） */
  dangerScore: number;
  rikkai: RikkaiResult;
  compatibility: CompatibilityResult;
  /** 今日絶対やってはいけない行動（優先度順） */
  topAvoids: string[];
  /** 比較的安全な行動 */
  safeActions: string[];
  /** 一言警告メッセージ */
  warningMessage: string;
  /** 今日のお守り真言（凶を祓う） */
  protectiveMantra: string;
}

// ─────────────────────────────────────────
// 二十七宿の定義（避凶特化データ）
// ─────────────────────────────────────────

export const SHUKU_LIST: Shuku[] = [
  {
    index: 0, name: "角宿", reading: "かくしゅく", sanskrit: "Citrā",
    element: "金", nature: "安",
    avoidActions: ["独断での大きな決定", "強引な押しつけ"],
    dangerAreas: ["過信", "独走"],
    safeActions: ["新規プロジェクト立ち上げ", "計画策定", "リーダーとして動く"],
    keywords: ["始まり", "創造", "龍", "先駆け"],
  },
  {
    index: 1, name: "亢宿", reading: "こうしゅく", sanskrit: "Svātī",
    element: "金", nature: "危",
    avoidActions: ["新規事業の開始", "重要な交渉", "引越し", "手術"],
    dangerAreas: ["対人トラブル", "契約", "金銭の貸し借り"],
    safeActions: ["現状維持", "内省", "計画の見直し"],
    keywords: ["試練", "障壁", "忍耐", "停滞"],
  },
  {
    index: 2, name: "氐宿", reading: "ていしゅく", sanskrit: "Viśākhā",
    element: "土", nature: "中",
    avoidActions: ["衝動的な決断", "喧嘩・口論"],
    dangerAreas: ["人間関係の摩擦", "急いだ行動"],
    safeActions: ["熟慮", "計画", "基礎固め"],
    keywords: ["選択", "分岐点", "決断"],
  },
  {
    index: 3, name: "房宿", reading: "ぼうしゅく", sanskrit: "Anurādhā",
    element: "日", nature: "安",
    avoidActions: ["孤立行動", "人との縁を切ること"],
    dangerAreas: ["依存しすぎ", "流されること"],
    safeActions: ["人脈構築", "チームワーク", "縁を結ぶ活動"],
    keywords: ["豊穣", "縁", "調和", "友情"],
  },
  {
    index: 4, name: "心宿", reading: "しんしゅく", sanskrit: "Jyeṣṭhā",
    element: "月", nature: "危",
    avoidActions: ["感情的な言動", "衝動的な行動", "深夜の重要決断"],
    dangerAreas: ["感情の暴走", "精神的不安定", "霊的な場所への不用意な訪問"],
    safeActions: ["瞑想", "静養", "内省", "祈り"],
    keywords: ["変革", "洞察", "月", "内省"],
  },
  {
    index: 5, name: "尾宿", reading: "びしゅく", sanskrit: "Mūla",
    element: "火", nature: "安",
    avoidActions: ["過去への執着", "しがらみにとらわれた行動"],
    dangerAreas: ["執着", "未練"],
    safeActions: ["継続中の作業", "家族との時間", "地道な努力"],
    keywords: ["根源", "継続", "家族", "大地"],
  },
  {
    index: 6, name: "箕宿", reading: "きしゅく", sanskrit: "Pūrvāṣāḍhā",
    element: "水", nature: "中",
    avoidActions: ["一か所への集中投資", "固執"],
    dangerAreas: ["散漫", "落ち着きのなさ"],
    safeActions: ["柔軟な対応", "情報収集", "軽い移動"],
    keywords: ["風", "変化", "適応", "流れ"],
  },
  {
    index: 7, name: "斗宿", reading: "としゅく", sanskrit: "Uttarāṣāḍhā",
    element: "金", nature: "安",
    avoidActions: ["高慢な態度", "周囲を見下す言動"],
    dangerAreas: ["過信", "傲慢"],
    safeActions: ["目標に向けた集中行動", "勝負", "実力発揮"],
    keywords: ["勝利", "達成", "名誉", "星"],
  },
  {
    index: 8, name: "牛宿", reading: "ごしゅく", sanskrit: "Śravaṇa",
    element: "金", nature: "危",
    avoidActions: ["無理な奉仕", "過労", "大きな投資", "旅行"],
    dangerAreas: ["損失", "苦労", "体力の消耗"],
    safeActions: ["現状維持", "休息", "内省"],
    keywords: ["誠実", "奉仕", "忍耐", "牛"],
  },
  {
    index: 9, name: "女宿", reading: "じょしゅく", sanskrit: "Dhaniṣṭhā",
    element: "土", nature: "中",
    avoidActions: ["感情的な自己犠牲", "無理な我慢"],
    dangerAreas: ["感情的になりすぎ", "自己犠牲"],
    safeActions: ["芸術活動", "創作", "感性を活かした仕事"],
    keywords: ["芸術", "感性", "技巧", "美"],
  },
  {
    index: 10, name: "虚宿", reading: "きょしゅく", sanskrit: "Śatabhiṣā",
    element: "日", nature: "危",
    avoidActions: ["孤独に追い込む行動", "新規の重要な約束", "派手な行動"],
    dangerAreas: ["喪失", "孤独", "精神的不安定"],
    safeActions: ["静養", "瞑想", "一人での内省"],
    keywords: ["再生", "空", "神秘", "静寂"],
  },
  {
    index: 11, name: "危宿", reading: "きしゅく", sanskrit: "Pūrvābhādrapadā",
    element: "月", nature: "危",
    avoidActions: ["高所・危険な場所への訪問", "無謀な挑戦", "油断した行動", "車の運転を伴う長距離移動"],
    dangerAreas: ["事故", "怪我", "高所からの転落", "油断"],
    safeActions: ["慎重な行動のみ", "リスク管理", "安全確認"],
    keywords: ["警戒", "慎重", "試練", "覚悟"],
  },
  {
    index: 12, name: "室宿", reading: "しつしゅく", sanskrit: "Uttarābhādrapadā",
    element: "火", nature: "安",
    avoidActions: ["変化への抵抗", "新しいことへの拒絶"],
    dangerAreas: ["保守的すぎる判断", "変化の機会を逃す"],
    safeActions: ["家・拠点の整備", "安定した関係の構築", "基盤固め"],
    keywords: ["安住", "家庭", "安定", "基盤"],
  },
  {
    index: 13, name: "壁宿", reading: "へきしゅく", sanskrit: "Revatī",
    element: "水", nature: "安",
    avoidActions: ["閉鎖的な態度", "頑固な主張"],
    dangerAreas: ["頑固", "孤立"],
    safeActions: ["旅行", "完成作業", "守護を意識した行動"],
    keywords: ["守護", "完成", "旅", "境界"],
  },
  {
    index: 14, name: "奎宿", reading: "けいしゅく", sanskrit: "Aśvinī",
    element: "木", nature: "安",
    avoidActions: ["優柔不断な先送り", "批判的すぎる発言"],
    dangerAreas: ["批判しすぎ", "動けない状態"],
    safeActions: ["学習", "文章作成", "創造的な活動"],
    keywords: ["文芸", "学問", "創造", "知性"],
  },
  {
    index: 15, name: "婁宿", reading: "ろうしゅく", sanskrit: "Bharaṇī",
    element: "金", nature: "安",
    avoidActions: ["欲張りな行動", "散財", "見境ない交際"],
    dangerAreas: ["過度な欲", "散財"],
    safeActions: ["縁結び", "交渉", "人を集める活動"],
    keywords: ["集合", "縁結び", "財", "交渉"],
  },
  {
    index: 16, name: "胃宿", reading: "いしゅく", sanskrit: "Kṛttikā",
    element: "土", nature: "中",
    avoidActions: ["ケチすぎる行動", "必要な投資を渋る"],
    dangerAreas: ["頑固", "吝嗇（りんしょく）"],
    safeActions: ["貯蓄", "資産管理", "堅実な行動"],
    keywords: ["蓄積", "保管", "堅実", "安全"],
  },
  {
    index: 17, name: "昴宿", reading: "ぼうしゅく", sanskrit: "Rohiṇī",
    element: "日", nature: "危",
    avoidActions: ["孤立する行動", "感情的な爆発", "集団からの離脱"],
    dangerAreas: ["孤立", "感情的になりすぎ"],
    safeActions: ["集中作業", "精密な仕事", "深化"],
    keywords: ["集中", "精密", "繊細", "深化"],
  },
  {
    index: 18, name: "畢宿", reading: "ひつしゅく", sanskrit: "Mṛgaśīrṣa",
    element: "月", nature: "中",
    avoidActions: ["強引すぎる交渉", "無理な押しつけ"],
    dangerAreas: ["強引さ", "トラブル"],
    safeActions: ["実行", "交渉", "行動力が必要な仕事"],
    keywords: ["実行", "捕獲", "行動力", "成果"],
  },
  {
    index: 19, name: "觜宿", reading: "ししゅく", sanskrit: "Ārdrā",
    element: "火", nature: "危",
    avoidActions: ["言い過ぎ", "口論", "SNSへの感情的投稿", "重要な交渉・プレゼン"],
    dangerAreas: ["口争い", "誤解", "言葉によるトラブル"],
    safeActions: ["沈黙を守る", "メール返信の慎重な確認", "傾聴"],
    keywords: ["言葉", "誤解", "表現", "声"],
  },
  {
    index: 20, name: "参宿", reading: "さんしゅく", sanskrit: "Punarvasū",
    element: "水", nature: "安",
    avoidActions: ["向こう見ずな行動", "無計画な突進"],
    dangerAreas: ["喧嘩", "無謀"],
    safeActions: ["勝負", "挑戦", "前進が必要な行動"],
    keywords: ["勇気", "突破", "勝負", "前進"],
  },
  {
    index: 21, name: "井宿", reading: "せいしゅく", sanskrit: "Puṣya",
    element: "木", nature: "安",
    avoidActions: ["慢心", "浪費", "感謝を忘れた行動"],
    dangerAreas: ["慢心", "浪費"],
    safeActions: ["財運を活かした行動", "人望を集める活動", "感謝を示す"],
    keywords: ["恵み", "財運", "人望", "豊穣"],
  },
  {
    index: 22, name: "鬼宿", reading: "きしゅく", sanskrit: "Āśleṣā",
    element: "金", nature: "危",
    avoidActions: ["怨恨を抱えた行動", "霊的な場所への不用意な訪問", "因縁のある人との接触", "葬儀・弔事以外の重要行事"],
    dangerAreas: ["怨念", "因縁", "不吉な兆候", "霊的トラブル"],
    safeActions: ["祈祷・お祓い", "先祖供養", "静かな内省"],
    keywords: ["霊験", "変化", "因縁", "転換"],
  },
  {
    index: 23, name: "柳宿", reading: "りゅうしゅく", sanskrit: "Maghā",
    element: "土", nature: "危",
    avoidActions: ["悲観的な思考への耽溺", "無理な行動全般", "医療行為（急を要さない手術など）"],
    dangerAreas: ["悲観", "病気", "損失", "精神的疲労"],
    safeActions: ["静養", "感情を整える作業", "音楽鑑賞"],
    keywords: ["感受性", "悲哀", "流れ", "癒し"],
  },
  {
    index: 24, name: "星宿", reading: "せいしゅく", sanskrit: "Pūrvaphalgunī",
    element: "日", nature: "危",
    avoidActions: ["傲慢な態度", "孤立を招く言動", "批判・中傷"],
    dangerAreas: ["孤立", "傲慢", "批判"],
    safeActions: ["個性を活かした独立行動", "輝きを内側に向けた作業"],
    keywords: ["輝き", "孤高", "個性", "独立"],
  },
  {
    index: 25, name: "張宿", reading: "ちょうしゅく", sanskrit: "Uttaraphalgunī",
    element: "月", nature: "安",
    avoidActions: ["過信による拡張しすぎ", "身の丈を超えた計画"],
    dangerAreas: ["過信", "拡張しすぎ"],
    safeActions: ["実力発揮", "拡大行動", "繁栄を目指す活動"],
    keywords: ["拡大", "繁栄", "飛躍", "発展"],
  },
  {
    index: 26, name: "翼宿", reading: "よくしゅく", sanskrit: "Hasta",
    element: "火", nature: "危",
    avoidActions: ["無計画な遠出", "体力を無視した行動", "旅行での油断"],
    dangerAreas: ["疲弊", "消耗", "旅先でのトラブル"],
    safeActions: ["短距離の移動のみ", "体力温存", "休息を優先"],
    keywords: ["翼", "旅", "飛翔", "変遷"],
  },
];

// ─────────────────────────────────────────
// ユリウス通日 (JD) 変換
// ─────────────────────────────────────────

function toJulianDay(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12);
  const y = year + 4800 - a;
  const m = month + 12 * a - 3;
  return (
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  );
}

// 基準日: 2000年1月1日 = 角宿(index=0)
const BASE_JD = toJulianDay(2000, 1, 1);

function calcShukuIndex(year: number, month: number, day: number): number {
  const jd = toJulianDay(year, month, day);
  const diff = jd - BASE_JD;
  return ((diff % 27) + 27) % 27;
}

// ─────────────────────────────────────────
// 宿の取得
// ─────────────────────────────────────────

/** 生年月日から本命宿を取得 */
export function getBirthShuku(year: number, month: number, day: number): Shuku {
  return SHUKU_LIST[calcShukuIndex(year, month, day)];
}

/** 指定日（デフォルト: 今日）の当日宿を取得 */
export function getTodayShuku(date?: Date): Shuku {
  const d = date ?? new Date();
  return SHUKU_LIST[calcShukuIndex(d.getFullYear(), d.getMonth() + 1, d.getDate())];
}

// ─────────────────────────────────────────
// 六害宿（ろくがいしゅく）判定 ← 避凶の核心
// ─────────────────────────────────────────

/**
 * 六害宿の定義
 * 本命宿から以下の距離にある宿が「六害宿」
 *
 * | 距離 | 名称 | 意味 | 重症度 |
 * |------|------|------|--------|
 * |  +5  | 衰   | 衰退・消耗 | 凶(3) |
 * |  +6  | 壊   | 破壊・崩壊 | 大凶(2) |
 * |  +7  | 危   | 身の危険   | 大凶(2) |
 * | +14  | 成   | 表面吉の罠 | 凶(3) |
 * | +20  | 収   | 収縮・損失 | 凶(3) |
 * | +21  | 開   | 空洞化     | 凶(3) |
 *
 * 特に +6（壊）と +7（危）は「最大凶」の扱い
 */
const RIKKAI_MAP: Record<number, { type: RikkaiType; severity: 1 | 2 | 3; absoluteAvoid: string[] }> = {
  5: {
    type: "衰（おとろえ）",
    severity: 3,
    absoluteAvoid: [
      "新規ビジネスの立ち上げ",
      "重要な契約・サイン",
      "大きな出費",
    ],
  },
  6: {
    type: "壊（こわれ）",
    severity: 2,
    absoluteAvoid: [
      "結婚・入籍",
      "開業・創業",
      "大きな買い物（家・車など）",
      "手術・医療処置",
      "重要な契約",
    ],
  },
  7: {
    type: "危（き）",
    severity: 2,
    absoluteAvoid: [
      "車・バイクの運転（特に長距離）",
      "高所作業・危険な場所への訪問",
      "冒険的な行動",
      "新規投資",
      "手術",
    ],
  },
  14: {
    type: "成（なる）",
    severity: 3,
    absoluteAvoid: [
      "見かけ上うまくいっている話への飛びつき",
      "甘い話・うまい話",
      "衝動的な決断",
    ],
  },
  20: {
    type: "収（おさまり）",
    severity: 3,
    absoluteAvoid: [
      "投資・ギャンブル",
      "大きな財産移動",
      "事業拡大",
    ],
  },
  21: {
    type: "開（ひらく）",
    severity: 3,
    absoluteAvoid: [
      "秘密の開示",
      "新しい人間関係への全力投資",
      "開業・移転",
    ],
  },
};

/** 六害宿判定 */
export function calcRikkai(birthShuku: Shuku, todayShuku: Shuku): RikkaiResult {
  // 本命宿から当日宿までの距離（前向き・後向き両方チェック）
  const fwd = (todayShuku.index - birthShuku.index + 27) % 27;
  const bwd = (birthShuku.index - todayShuku.index + 27) % 27;

  // 前向き方向のチェック
  const entry = RIKKAI_MAP[fwd] ?? RIKKAI_MAP[bwd];
  const distance = RIKKAI_MAP[fwd] ? fwd : bwd;

  if (!entry) {
    return {
      isRikkai: false,
      rikkaType: null,
      severity: 3,
      description: "六害宿には該当しません。",
      absoluteAvoid: [],
    };
  }

  const severityLabel = entry.severity === 1 ? "最大凶" : entry.severity === 2 ? "大凶" : "凶";

  return {
    isRikkai: true,
    rikkaType: entry.type,
    severity: entry.severity,
    description: `今日は本命宿から${distance}宿離れた「${entry.type}」にあたります。${severityLabel}の日です。慎重に行動してください。`,
    absoluteAvoid: entry.absoluteAvoid,
  };
}

// ─────────────────────────────────────────
// 相性・二宿間の吉凶判定
// ─────────────────────────────────────────

/**
 * 二宿間の相性を判定
 * 宿曜道の七種合・六害を統合
 */
export function calcCompatibility(a: Shuku, b: Shuku): CompatibilityResult {
  const fwd = (b.index - a.index + 27) % 27;
  const bwd = (a.index - b.index + 27) % 27;
  const minDiff = Math.min(fwd, bwd);

  // 七種合（吉）
  if (minDiff === 0) return { type: "同宿", score: 100, isHarmful: false, avoidReason: null, description: "同宿。最も強い縁。深い相互理解と強い結びつき。" };
  if (minDiff === 4 || minDiff === 23) return { type: "命合", score: 90, isHarmful: false, avoidReason: null, description: "命合。生涯を通じて助け合える最良の相性。" };
  if (minDiff === 9 || minDiff === 18) return { type: "業合", score: 80, isHarmful: false, avoidReason: null, description: "業合。深いカルマで結ばれた成長をもたらす相性。" };
  if (minDiff === 13 || minDiff === 14) return { type: "胎合", score: 75, isHarmful: false, avoidReason: null, description: "胎合。恋愛・結婚に向いた深い縁。" };

  // 六害（凶）
  if (fwd === 6 || bwd === 6) return {
    type: "壊", score: 15, isHarmful: true,
    avoidReason: "壊の相性。関係が深まるほど破壊的になる。ビジネスパートナー・恋愛には要注意。",
    description: "壊宿の相性。表面上は縁があるように見えるが、長期的に見ると破滅を招きやすい。",
  };
  if (fwd === 7 || bwd === 7) return {
    type: "危", score: 10, isHarmful: true,
    avoidReason: "危の相性。身の危険につながる縁。特に重要な決断を共にするのは避けるべき。",
    description: "危宿の相性。最も注意が必要。関わるほどリスクが高まる組み合わせ。",
  };
  if (fwd === 5 || bwd === 5) return {
    type: "衰", score: 30, isHarmful: true,
    avoidReason: "衰の相性。一緒にいると互いのエネルギーが消耗していく。",
    description: "衰宿の相性。共にいることで疲弊しやすい。適度な距離感を保つことが吉。",
  };
  if (fwd === 20 || bwd === 20) return {
    type: "収", score: 25, isHarmful: true,
    avoidReason: "収の相性。金銭・財産に関して損失を招きやすい組み合わせ。",
    description: "収宿の相性。財運に悪影響が出やすい。金銭の絡む関係は特に注意。",
  };
  if (fwd === 21 || bwd === 21) return {
    type: "開", score: 35, isHarmful: true,
    avoidReason: "開の相性。関係が広がるように見えて実は空洞化していく。",
    description: "開宿の相性。表面的な繁栄の裏で関係が希薄になりやすい。",
  };
  if (fwd === 14 || bwd === 14) return {
    type: "成", score: 40, isHarmful: true,
    avoidReason: "成の相性。うまくいっているように見えて罠がある。過信は禁物。",
    description: "成宿の相性。一見良縁に見えるが落とし穴がある。慎重な見極めが必要。",
  };

  // 安合（中吉 ※六害と重複しない場合）
  if (minDiff === 5) return { type: "安合", score: 65, isHarmful: false, avoidReason: null, description: "安合。穏やかで安定した縁。" };

  // 中立
  if (minDiff <= 3) return { type: "平", score: 55, isHarmful: false, avoidReason: null, description: "近い宿同士。共鳴しやすい関係。" };

  return { type: "平", score: 50, isHarmful: false, avoidReason: null, description: "特別な吉凶なし。努力次第で良い関係を築ける。" };
}

// ─────────────────────────────────────────
// 今日の総合危険度評価（避凶の中核）
// ─────────────────────────────────────────

const PROTECTIVE_MANTRAS: Record<ShukuElement, string> = {
  金: "オン・マカラ・ギャ・ソワカ（金星護法真言）",
  日: "オン・アビラウンケン・バザラ・ダト・バン（太陽護法真言）",
  火: "ノウマク・サンマンダ・バザラダン・センダ・マカロシャダ（火曜護法真言）",
  水: "オン・メイキャ・シャラバ・ソワカ（水星護法真言）",
  木: "オン・ベイシラ・マンダヤ・ソワカ（木星護法真言）",
  土: "オン・チチリ・キャウロ・ソワカ（土星護法真言）",
  月: "オン・ソマヤ・ソワカ（月護法真言）",
};

const WARNING_MESSAGES: Record<AvoidanceLevel, string> = {
  大吉: "今日は宿の加護が強い吉日。積極的に動きましょう。",
  吉: "今日は比較的良い運気。慎重さを忘れずに。",
  中吉: "まずまずの運気。大きなリスクは避けつつ行動を。",
  平: "今日は特別な吉凶なし。淡々と過ごすのが吉。",
  注意: "今日は凶のサインあり。重要な決断・行動は明日以降に。",
  凶: "今日は凶日。新規行動・重要決断は避け、現状維持に徹してください。",
  大凶: "今日は大凶日（六害宿）。絶対に避けるべき行動に注意。守護真言を唱えてください。",
};

/**
 * 今日の総合危険度を評価する（避凶アプリのメイン関数）
 */
export function assessDanger(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  targetDate?: Date,
): DangerAssessment {
  const birthShuku = getBirthShuku(birthYear, birthMonth, birthDay);
  const todayShuku = getTodayShuku(targetDate);
  const rikkai = calcRikkai(birthShuku, todayShuku);
  const compatibility = calcCompatibility(birthShuku, todayShuku);

  // 危険スコア計算（高いほど危険）
  let dangerScore = 100 - compatibility.score;
  if (rikkai.isRikkai) {
    const bonus = rikkai.severity === 1 ? 40 : rikkai.severity === 2 ? 30 : 20;
    dangerScore = Math.min(100, dangerScore + bonus);
  }
  // 当日宿自体が「危」の場合は加点
  if (todayShuku.nature === "危") dangerScore = Math.min(100, dangerScore + 10);

  // 回避レベル判定
  let avoidanceLevel: AvoidanceLevel;
  if (dangerScore >= 85) avoidanceLevel = "大凶";
  else if (dangerScore >= 70) avoidanceLevel = "凶";
  else if (dangerScore >= 55) avoidanceLevel = "注意";
  else if (dangerScore >= 40) avoidanceLevel = "平";
  else if (dangerScore >= 25) avoidanceLevel = "中吉";
  else if (dangerScore >= 10) avoidanceLevel = "吉";
  else avoidanceLevel = "大吉";

  // 避けるべき行動を統合・重複排除
  const avoidSet = new Set<string>([
    ...rikkai.absoluteAvoid,
    ...todayShuku.avoidActions,
    ...(rikkai.isRikkai ? birthShuku.avoidActions.slice(0, 2) : []),
  ]);

  const d = targetDate ?? new Date();
  const dateStr = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;

  return {
    date: dateStr,
    birthShuku,
    todayShuku,
    avoidanceLevel,
    dangerScore,
    rikkai,
    compatibility,
    topAvoids: Array.from(avoidSet).slice(0, 5),
    safeActions: todayShuku.safeActions,
    warningMessage: WARNING_MESSAGES[avoidanceLevel],
    protectiveMantra: PROTECTIVE_MANTRAS[birthShuku.element],
  };
}

// ─────────────────────────────────────────
// ユーティリティ
// ─────────────────────────────────────────

/** 今後N日間の危険日一覧を取得（スケジューリング用） */
export function getDangerCalendar(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  days = 30,
): Array<{ date: string; avoidanceLevel: AvoidanceLevel; dangerScore: number; isRikkai: boolean }> {
  const results = [];
  const today = new Date();

  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const assessment = assessDanger(birthYear, birthMonth, birthDay, d);
    results.push({
      date: assessment.date,
      avoidanceLevel: assessment.avoidanceLevel,
      dangerScore: assessment.dangerScore,
      isRikkai: assessment.rikkai.isRikkai,
    });
  }

  return results;
}
