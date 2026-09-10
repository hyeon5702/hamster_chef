import * as THREE from "https://unpkg.com/three@0.164.1/build/three.module.js";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-config.js";

const dom = {
  canvas: document.querySelector("#world"),
  startScreen: document.querySelector("#start-screen"),
  startButton: document.querySelector("#start-button"),
  continueButton: document.querySelector("#continue-button"),
  careerButton: document.querySelector("#career-button"),
  leaderboardButton: document.querySelector("#leaderboard-button"),
  tutorialButton: document.querySelector("#tutorial-button"),
  historyButton: document.querySelector("#history-button"),
  authPanel: document.querySelector("#auth-panel"),
  authStatus: document.querySelector("#auth-status"),
  authBanner: document.querySelector("#auth-banner"),
  authForm: document.querySelector("#auth-form"),
  authNicknameField: document.querySelector("#auth-nickname-field"),
  authNickname: document.querySelector("#auth-nickname"),
  authEmail: document.querySelector("#auth-email"),
  authPassword: document.querySelector("#auth-password"),
  authSubmitButton: document.querySelector("#auth-submit-button"),
  authSwitchButton: document.querySelector("#auth-switch-button"),
  logoutButton: document.querySelector("#logout-button"),
  startActions: document.querySelector("#start-actions"),
  hud: document.querySelector("#hud"),
  objective: document.querySelector("#objective"),
  coinCount: document.querySelector("#coin-count"),
  reputationCount: document.querySelector("#reputation-count"),
  timer: document.querySelector("#timer"),
  mapButton: document.querySelector("#map-button"),
  recipeNoteButton: document.querySelector("#recipe-note-button"),
  soundToggle: document.querySelector("#sound-toggle"),
  questTracker: document.querySelector("#quest-tracker"),
  questTitle: document.querySelector("#quest-title"),
  questDetail: document.querySelector("#quest-detail"),
  inventoryBar: document.querySelector("#inventory-bar"),
  tutorialGuide: document.querySelector("#tutorial-guide"),
  tutorialStepLabel: document.querySelector("#tutorial-step-label"),
  tutorialTitle: document.querySelector("#tutorial-title"),
  tutorialCopy: document.querySelector("#tutorial-copy"),
  tutorialExit: document.querySelector("#tutorial-exit"),
  interactionPrompt: document.querySelector("#interaction-prompt"),
  interactionName: document.querySelector("#interaction-name"),
  interactionButton: document.querySelector("#interaction-button"),
  modal: document.querySelector("#modal"),
  closeModal: document.querySelector("#close-modal"),
  modalContent: document.querySelector("#modal-content"),
  resultScreen: document.querySelector("#result-screen"),
  resultKicker: document.querySelector("#result-kicker"),
  resultTitle: document.querySelector("#result-title"),
  resultCopy: document.querySelector("#result-copy"),
  restartButton: document.querySelector("#restart-button"),
  challengeLbScreen: document.querySelector("#challenge-leaderboard-screen"),
  challengeLbTitle: document.querySelector("#challenge-lb-title"),
  challengeLbSummary: document.querySelector("#challenge-lb-summary"),
  challengeLbContent: document.querySelector("#challenge-lb-content"),
  challengeLbExit: document.querySelector("#challenge-lb-exit"),
  toast: document.querySelector("#toast"),
  juiceLayer: document.querySelector("#juice-layer"),
  multiButton: document.querySelector("#multi-button"),
  skinButton: document.querySelector("#skin-button"),
  pvpOpponentHud: document.querySelector("#pvp-opponent-hud"),
  pvpOpponentName: document.querySelector("#pvp-opponent-name"),
  pvpOpponentOrders: document.querySelector("#pvp-opponent-orders"),
  pvpOpponentScore: document.querySelector("#pvp-opponent-score"),
  pvpDebuffNotice: document.querySelector("#pvp-debuff-notice"),
  pvpSabotagePanel: document.querySelector("#pvp-sabotage-panel"),
  pvpRedFlash: document.querySelector("#pvp-red-flash"),
  pvpTiltWrap: document.querySelector("#pvp-tilt-wrap"),
  pvpStarsOverlay: document.querySelector("#pvp-stars-overlay"),
  pvpInkOverlay: document.querySelector("#pvp-ink-overlay"),
  pvpBombHud: document.querySelector("#pvp-bomb-hud"),
};

const INGREDIENTS = [
  {
    id: "cheese",
    name: "도토리 치즈",
    price: 18,
    color: "#f2c94c",
    art: "cheese",
    traits: { savory: 22, creamy: 8 },
  },
  {
    id: "cream",
    name: "구름 크림",
    price: 18,
    color: "#fff4c7",
    art: "cream",
    traits: { creamy: 28 },
  },
  {
    id: "herb",
    name: "초록 허브",
    price: 14,
    color: "#2da66f",
    art: "herb",
    traits: { fresh: 24 },
  },
  {
    id: "carrot",
    name: "꼬마 당근",
    price: 12,
    color: "#f47c45",
    art: "carrot",
    traits: { fresh: 18, sweet: 10 },
  },
  {
    id: "mushroom",
    name: "밤송이 버섯",
    price: 16,
    color: "#9a6b4f",
    art: "mushroom",
    traits: { savory: 16, umami: 24 },
  },
  {
    id: "pepper",
    name: "반짝 고추",
    price: 10,
    color: "#d93d3d",
    art: "pepper",
    traits: { spicy: 30 },
  },
  {
    id: "berry",
    name: "달빛 베리",
    price: 22,
    color: "#7557c8",
    art: "berry",
    unlockReputation: 40,
    traits: { sweet: 22, fresh: 18 },
  },
  {
    id: "market-spice",
    name: "향신 분말",
    price: 24,
    color: "#c85f37",
    art: "pepper",
    unlockDay: 2,
    traits: { savory: 8, spicy: 18 },
  },
  {
    id: "market-cheese",
    name: "고급 치즈",
    price: 30,
    color: "#f4d265",
    art: "cheese",
    unlockDay: 2,
    traits: { savory: 32, creamy: 14 },
  },
  {
    id: "forest-herb",
    name: "숲 허브",
    price: 26,
    color: "#3cb673",
    art: "herb",
    unlockDay: 4,
    traits: { fresh: 32, savory: 8 },
  },
  {
    id: "dew-berry",
    name: "이슬 베리",
    price: 28,
    color: "#8a68db",
    art: "berry",
    unlockDay: 4,
    traits: { sweet: 18, fresh: 20 },
  },
  {
    id: "greenhouse-carrot",
    name: "온실 당근",
    price: 24,
    color: "#ff9a52",
    art: "carrot",
    unlockDay: 6,
    traits: { fresh: 24, sweet: 14 },
  },
  {
    id: "mini-tomato",
    name: "미니 토마토",
    price: 22,
    color: "#da5446",
    art: "berry",
    unlockDay: 6,
    traits: { fresh: 20, sweet: 12 },
  },
];

const TRAIT_LABELS = {
  savory: "고소함",
  creamy: "부드러움",
  fresh: "신선함",
  sweet: "달콤함",
  spicy: "매움",
  umami: "감칠맛",
};

const REQUIRED_SCORE = 80;
const GAME_SECONDS = 300;
const DAY_ORDER_COUNT = 3;
const ORDER_SCORE_STEPS = [75, 80, 85, 90];
const ORDER_COMPLETION_REWARD = 18;
const ABANDON_ORDER_SCORE_PENALTY = 12;
const ABANDON_QUEST_SCORE_PENALTY = 7;
const LEGACY_SAVE_KEY = "hamster-chef-save-v1";
const SKIN_SAVE_KEY = "hamster-chef-skin-v1";
const SKINS = [
  { id: "default", name: "기본 햄스터",  emoji: "🐹", primary: "#d99b61" },
  { id: "cat",     name: "고양이 셰프",  emoji: "🐱", primary: "#e8a060" },
  { id: "rabbit",  name: "토끼 셰프",    emoji: "🐰", primary: "#e8e0d4" },
  { id: "robot",   name: "로봇 셰프",    emoji: "🤖", primary: "#6090b8" },
  { id: "devil",   name: "악당 셰프",    emoji: "😈", primary: "#c03030" },
  { id: "wizard",  name: "마법사 셰프",  emoji: "🧙", primary: "#5c3a8a" },
];
const SHARED_SETTINGS_KEY = "hamster-chef-shared-settings-v1";
const CHALLENGE_SAVE_KEY = "hamster-chef-challenge-save-v1";
const CAREER_SAVE_KEY = "hamster-chef-career-save-v1";
const MIGRATION_KEY_PREFIX = "hamster-chef-migrated-";
const ADMIN_CODE = "hamster";
const BASE_STORAGE_LIMIT = 8;
const REPUTATION_UNLOCKS = {
  berry: 40,
  goldenFondue: 90,
  longService: 150,
};
const ORDER_CHALLENGE_SECONDS = 14;
const ORDER_MAX_MISTAKES = 1;
const ORDER_DISHES = [
  "별빛 크림 스튜",
  "숲속 버섯 플레이트",
  "당근 크림볼",
  "황금 치즈 퐁듀",
  "화산 토마토 라구",
  "이슬 베리 글레이즈 샐러드",
  "온실 당근 수프",
];
const ORDER_REQUESTS = ["매운맛 제외", "신선한 향 강조", "부드럽게 조리", "고소함 많이", "소스 따로", "치즈 추가"];
const DEFAULT_MUSIC_VOLUME = 0.2;
const DEFAULT_EFFECTS_VOLUME = 0.85;
const BGM_AUDIO_PATH = "./assets/audio/hamster-chef-bgm.mp3";
const PANIC_BGM_PATH = "./assets/audio/minute-de-panique.mp3";
const PANIC_BGM_THRESHOLD = 60; // 남은 시간(초) 이하일 때 긴박한 BGM 전환

// 카메라 — 방향키로 플레이어 주위를 공전시킨다.
// 기본값은 기존 고정 오프셋 (0, 7.2, 10.8)과 같은 거리·각도라서 회전을 건드리지 않으면 이전과 동일한 화면이 나온다.
const CAMERA_DISTANCE = Math.hypot(10.8, 7.2);
const CAMERA_BASE_PITCH = Math.atan2(7.2, 10.8);
const CAMERA_MIN_PITCH = THREE.MathUtils.degToRad(10);
const CAMERA_MAX_PITCH = THREE.MathUtils.degToRad(72);
const CAMERA_YAW_SPEED = 2.1;   // rad/s
const CAMERA_PITCH_SPEED = 1.3; // rad/s
const CAMERA_UP_AXIS = new THREE.Vector3(0, 1, 0);

// PvP 멀티 챌린지
const PVP_SABOTAGE_COOLDOWNS_MS = { trip: 45000, ink: 45000, bomb: 35000 };
const PVP_TRIP_DURATION_MS = 5000;
const PVP_INK_DURATION_MS = 5000;
const PVP_BOMB_DURATION_MS = 30000;
const PVP_BOMB_PENALTY_SLOW_MS = 15000;
const PVP_SCORE_BROADCAST_INTERVAL_MS = 2500;
const PVP_ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const PVP_RESULT_WAIT_MS = 5000;
// 스테이션 위치 (xz) — 폭탄 생성 시 충돌 방지용
const STATION_OCCUPIED_XZS = [
  [3.8, 0.6], [-1.8, -1.2], [-7.4, 1.8],
  [0, 5.6], [8, 2.5], [7.4, -5.4], [4.6, -5.7], [-7.8, -5.8],
  [-5.5, 3.25], [-2.2, 3.25], [2.2, 3.25], [5.5, 3.25], // 다이닝 테이블
];
const BOMB_SPAWN_CANDIDATES = [
  [-4, -4], [0, -4], [4, -4],
  [-5, -2], [-3, -2], [1, -2], [3, -2], [5, -2],
  [-5, 0], [-3, 0], [0, 0], [1, -3], [-1, -3], [3, -3],
  [-1, -5], [1, -5], [-3, -5], [3, -5],
  [-6, 1], [6, 1], [-6, -1], [6, -1],
];
const BGM_VOLUME_SCALE = 1 / 6;
const EFFECTS_VOLUME_SCALE = 2.25;

const ORDER_DISH_ART = {
  "별빛 크림 스튜": ["cream", "cheese", "herb"],
  "숲속 버섯 플레이트": ["mushroom", "herb", "cheese"],
  "당근 크림볼": ["carrot", "cream", "berry"],
  "황금 치즈 퐁듀": ["market-cheese", "cream", "berry"],
  "화산 토마토 라구": ["pepper", "mini-tomato", "market-spice"],
  "이슬 베리 글레이즈 샐러드": ["dew-berry", "forest-herb", "herb"],
  "온실 당근 수프": ["greenhouse-carrot", "cream", "mini-tomato"],
};

const CUSTOMER_PREFERENCES = [
  { name: "부드러운 맛 선호", description: "부드러움이 충분하면 +5점", trait: "creamy", threshold: 28, bonus: 5 },
  { name: "신선한 향 선호", description: "신선함이 충분하면 +5점", trait: "fresh", threshold: 26, bonus: 5 },
  { name: "고소한 풍미 선호", description: "고소함이 충분하면 +5점", trait: "savory", threshold: 28, bonus: 5 },
  { name: "매운맛 민감", description: "매움이 높으면 -8점", trait: "spicy", limit: 12, penalty: 8 },
  {
    name: "동네 미식가",
    description: "고소함이 충분하면 +8점, 판매가가 크게 오릅니다.",
    trait: "savory",
    threshold: 32,
    bonus: 8,
    unlockCareerLevel: 2,
    saleBonusMultiplier: 0.15,
  },
  {
    name: "엄격한 평론가",
    description: "신선함을 정확히 맞추면 +10점, 판매가가 크게 오릅니다.",
    trait: "fresh",
    threshold: 34,
    bonus: 10,
    unlockCareerLevel: 3,
    saleBonusMultiplier: 0.22,
  },
];

const DAILY_EVENTS = [
  { name: "평온한 영업", description: "특별한 변수 없이 차분하게 영업합니다.", ingredientDiscount: 0, rewardBonus: 0, requiredDelta: 0, reputationBonus: 0 },
  { name: "장날", description: "재료 가격이 3코인 할인됩니다.", ingredientDiscount: 3, rewardBonus: 0, requiredDelta: 0, reputationBonus: 0 },
  { name: "바쁜 점심", description: "주문 목표가 3점 오르지만 보상이 8코인 늘어납니다.", ingredientDiscount: 0, rewardBonus: 8, requiredDelta: 3, reputationBonus: 1 },
  { name: "비 오는 날", description: "따뜻한 스튜 주문 목표가 5점 낮아집니다.", ingredientDiscount: 0, rewardBonus: 0, requiredDelta: 0, reputationBonus: 0, recipeRequiredDeltas: { "starlight-stew": -5 } },
  { name: "버섯 축제", description: "버섯 플레이트 주문 목표가 5점 낮아지고 평판 보너스가 붙습니다.", ingredientDiscount: 0, rewardBonus: 0, requiredDelta: 0, reputationBonus: 2, recipeRequiredDeltas: { "forest-mushroom": -5 } },
  { name: "미슐랭 시찰", description: "목표가 5점 오르지만 평판 보상이 크게 늘어납니다.", ingredientDiscount: 0, rewardBonus: 5, requiredDelta: 5, reputationBonus: 5, unlockReputation: REPUTATION_UNLOCKS.goldenFondue },
];

const UPGRADES = [
  { id: "shoes", name: "빠른 신발", description: "이동 속도가 단계마다 12% 증가합니다.", baseCost: 35 },
  { id: "tools", name: "좋은 조리도구", description: "요리 미니게임 점수에 단계마다 +4점.", baseCost: 45 },
  { id: "supplier", name: "재료 거래처", description: "재료 가격이 단계마다 2코인 할인됩니다.", baseCost: 40 },
  { id: "regulars", name: "단골 알림판", description: "주문 완료 평판이 단계마다 +2 증가합니다.", baseCost: 50 },
  { id: "fridge", name: "튼튼한 냉장고", description: "재료 보관 한도가 단계마다 4칸 늘어납니다.", baseCost: 32 },
  { id: "research", name: "레시피 연구", description: "레시피 노트가 단계마다 더 정확한 힌트를 보여줍니다.", baseCost: 38 },
  { id: "assistant", name: "알바 햄스터", description: "영업 중 일정 시간마다 코인과 평판을 조금 벌어옵니다.", baseCost: 70, unlockReputation: 40 },
  { id: "signboard", name: "새 간판", description: "성장 모드 판매가가 단계마다 5% 증가합니다.", baseCost: 58, careerOnly: true, unlockDay: 2 },
  { id: "plating", name: "고급 플레이팅", description: "성장 모드에서 85점 이상 요리는 평판이 단계마다 +1 추가됩니다.", baseCost: 64, careerOnly: true, unlockDay: 3 },
  { id: "hospitality", name: "환대 매뉴얼", description: "성장 모드 손님 요구 점수가 단계마다 3점 완화됩니다.", baseCost: 72, careerOnly: true, unlockDay: 4 },
  { id: "reservations", name: "예약 장부", description: "성장 모드에서 고급 손님이 찾아올 확률이 올라갑니다.", baseCost: 84, careerOnly: true, unlockDay: 5 },
];

const REPUTATION_TIERS = [
  { min: 0, name: "동네 식당" },
  { min: 40, name: "인기 식당" },
  { min: 90, name: "별 하나 식당" },
  { min: 150, name: "햄스터 미슐랭" },
];

const RECIPES = [
  {
    id: "starlight-stew",
    name: "별빛 크림 스튜",
    hint: "고소하고 부드러운 맛을 중심으로, 마지막에 산뜻함을 살리면 별빛처럼 맑아집니다.",
    warning: "매운맛이 올라오면 크림 향이 흐려집니다.",
    needs: { savory: 25, creamy: 35, fresh: 24 },
    penalty: { trait: "spicy", limit: 18, points: 14 },
    bonus: null,
  },
  {
    id: "forest-mushroom",
    name: "숲속 버섯 플레이트",
    unlockDay: 2,
    hint: "버섯의 감칠맛을 살리고 고소함과 신선함으로 숲길 같은 여운을 만듭니다.",
    warning: "달콤함은 살짝 있으면 좋지만 주인공이 되면 안 됩니다.",
    needs: { umami: 28, savory: 28, fresh: 24 },
    penalty: { trait: "spicy", limit: 28, points: 6 },
    bonus: { trait: "sweet", threshold: 10, points: 5 },
  },
  {
    id: "carrot-cream",
    name: "당근 크림볼",
    unlockDay: 4,
    hint: "당근의 달콤함과 크림의 부드러움을 둥글게 묶고, 신선한 향으로 마무리합니다.",
    warning: "매운맛은 이 요리와 거의 어울리지 않습니다.",
    needs: { sweet: 20, creamy: 28, fresh: 28 },
    penalty: { trait: "spicy", limit: 8, points: 20 },
    bonus: null,
  },
  {
    id: "golden-fondue",
    name: "황금 치즈 퐁듀",
    hint: "진한 고소함과 부드러움을 크게 살리고, 달콤한 향으로 끝맛을 둥글게 만듭니다.",
    warning: "신선함이 너무 낮으면 무거운 맛으로 평가됩니다.",
    unlockReputation: REPUTATION_UNLOCKS.goldenFondue,
    unlockDay: 7,
    needs: { savory: 42, creamy: 34, sweet: 22 },
    penalty: { trait: "spicy", limit: 16, points: 12 },
    bonus: { trait: "fresh", threshold: 18, points: 4 },
  },
  {
    id: "volcano-ragu",
    name: "화산 토마토 라구",
    unlockDay: 6,
    hint: "토마토의 산뜻함 위에 향신 풍미와 강한 매운맛을 분명하게 올리는 뜨거운 메뉴입니다.",
    warning: "크림이 많아지면 날카로운 화산 같은 인상이 무뎌집니다.",
    needs: { spicy: 26, fresh: 22, savory: 16 },
    penalty: { trait: "creamy", limit: 20, points: 8 },
    bonus: { trait: "umami", threshold: 12, points: 5 },
  },
  {
    id: "dew-glaze-salad",
    name: "이슬 베리 글레이즈 샐러드",
    unlockDay: 4,
    hint: "차가운 이슬처럼 신선한 향과 베리의 달콤함을 얇게 입혀 상큼하게 마무리합니다.",
    warning: "매운 기운이 올라오면 샐러드의 맑은 인상이 빠르게 깨집니다.",
    needs: { fresh: 34, sweet: 20, savory: 8 },
    penalty: { trait: "spicy", limit: 10, points: 12 },
    bonus: { trait: "creamy", threshold: 10, points: 4 },
  },
  {
    id: "greenhouse-soup",
    name: "온실 당근 수프",
    unlockDay: 6,
    hint: "온실 채소의 단맛과 부드러운 질감을 살리되, 마지막 향은 가볍고 산뜻해야 합니다.",
    warning: "매운 기운이 들어오면 수프의 포근한 균형이 쉽게 무너집니다.",
    needs: { sweet: 24, fresh: 26, creamy: 22 },
    penalty: { trait: "spicy", limit: 8, points: 10 },
    bonus: { trait: "savory", threshold: 10, points: 4 },
  },
];

const QUESTS = [
  { id: "errand", name: "주문표 전달", pay: 20, summary: "게시판의 주문표를 주방 카운터에 전달합니다." },
  { id: "dishwash", name: "반짝 접시 정리", pay: 25, summary: "싱크대에서 접시 5장을 닦습니다." },
  { id: "stock", name: "재료 상자 정리", pay: 30, summary: "식당 바닥의 상자 3개를 선반으로 옮깁니다." },
  // ── 신규 ────────────────────────────────────────────────
  { id: "sort", name: "재료 선별", pay: 28, summary: "선반에서 상한 재료 2개를 찾아 골라냅니다." },
  { id: "water", name: "화분 물 주기", pay: 26, summary: "상점 앞 화분 4개에 물을 80~95% 구간에 맞춥니다." },
];

const CHALLENGE_QUEST_IDS = QUESTS.map((quest) => quest.id);

const CAREER_REGIONS = [
  {
    id: "restaurant",
    name: "식당 주방",
    unlockDay: 1,
    description: "요리, 평가, 업그레이드, 일 게시판이 모두 있는 기본 운영 구역입니다.",
    short: "운영 거점",
    sky: "#8bd4d0",
    fog: "#8bd4d0",
  },
  {
    id: "market",
    name: "중앙 시장",
    unlockDay: 2,
    description: "오늘의 특가 재료를 흥정 미니게임으로 더 싸게 들여올 수 있습니다.",
    short: "흥정과 특가",
    sky: "#e2bf6d",
    fog: "#e5c984",
  },
  {
    id: "forest",
    name: "버섯 숲",
    unlockDay: 4,
    description: "채집 포인트를 기억해 무료 재료와 희귀 숲 재료를 확보합니다.",
    short: "기억 채집",
    sky: "#89b68b",
    fog: "#9bc29b",
  },
  {
    id: "greenhouse",
    name: "옥상 온실",
    unlockDay: 6,
    description: "작물을 심고 관리해 안정적인 재료 공급처를 키웁니다.",
    short: "재배와 수확",
    sky: "#8dc9b1",
    fog: "#9fd4bf",
  },
];

const CAREER_MARKET_INGREDIENTS = ["market-cheese", "market-spice", "cream", "berry"];

const GREENHOUSE_CROPS = [
  { ingredientId: "herb", name: "초록 허브 화분", unlockDay: 6, yieldAmount: 2 },
  { ingredientId: "greenhouse-carrot", name: "온실 당근 화분", unlockDay: 6, yieldAmount: 2 },
  { ingredientId: "mini-tomato", name: "미니 토마토 화분", unlockDay: 7, yieldAmount: 3 },
];

function normalizeSkinId(skinId) {
  return SKINS.some((skin) => skin.id === skinId) ? skinId : "default";
}

const state = {
  running: false,
  gameOver: false,
  selectedSkin: normalizeSkinId(localStorage.getItem(SKIN_SAVE_KEY) || "default"),
  paused: false,
  modalOpen: false,
  modalStopsMusic: false,
  modalReturn: null,
  coins: 12,
  timeLeft: GAME_SECONDS,
  inventory: {},
  selectedIngredients: [],
  recipeRecords: {},
  targetRecipe: null,
  day: 0,
  reputation: 0,
  upgrades: {},
  history: [],
  savedActiveDay: null,
  helperCooldown: 0,
  cameraYaw: 0,
  cameraPitch: CAMERA_BASE_PITCH,
  adminEnabled: false,
  adminGhostRecording: false, // 관리자 토글: 다음 솔로 챌린지 시작 시 고스트 녹화를 켠다
  ghostRecorder: null,        // { startedAt, positions: [[t,x,z,ry], ...], orders: [{t,orders,score}, ...] }
  dailyEvent: null,
  orderQueue: [],
  orderIndex: 0,
  serviceStats: null,
  currentQuest: null,
  lastChallengeQuestId: null,
  pendingDish: null,
  lastJudgement: null,
  minigame: null,
  scoreboardConclusion: null,
  orderTimer: null,
  soundEnabled: true,
  musicVolume: DEFAULT_MUSIC_VOLUME,
  effectsVolume: DEFAULT_EFFECTS_VOLUME,
  tutorialMode: false,
  tutorialStep: 0,
  tutorialStartPosition: null,
  tutorialLastRenderedStep: -1,
  authUser: null,
  authReady: false,
  authBusy: false,
  profileNickname: "",
  remoteChallengeProgress: null,
  remoteCareerProgress: null,
  personalChallengeRecord: null,
  careerStats: null,
  careerData: null,
  regionActivity: null,
  authMode: "login",
  authMessage: "",
  authBannerType: "warning",
  gameMode: "challenge",
  // PvP
  pvpRoom: null,         // { roomCode, isHost, opponentId, opponentNickname }
  pvpOpponent: null,     // { nickname, orders, score, done }
  pvpSabotageCooldowns: {},  // { type: expiryTimestamp }
  pvpScoreBroadcastTimer: 0,
  pvpDoneWaitTimer: null,
  pvpTripUntil: 0,       // timestamp: 이동 불가 종료 시점
  _pvpTripTimeout: null, // trip 디버프 failsafe setTimeout id
  _pvpStarsTimeout: null, // 별 오버레이 hide setTimeout id
  // 화면 흔들기 — PvP 넘어뜨리기와 juice 연출(요리 완벽 판정 등)이 공유한다.
  cameraShake: { remainingMs: 0, durationMs: 650, magnitude: 0.28 },
  pvpSlowUntil: 0,       // timestamp: 이동속도 50% 감소 종료 시점
  pvpBombs: [],          // [{ id, mesh, spark, interactable, expiresAt, fromNickname }]
  pvpInkActive: false,
};

const keys = new Set();
const clock = new THREE.Clock();
const pointer = new THREE.Vector2();
const interactables = [];
// 카메라를 돌려도 정면을 유지해야 하는 평면 간판들. 벽에 붙은 장식 간판은 넣지 않는다.
const billboards = [];
const billboardWorldPos = new THREE.Vector3();
const stations = {};
const worldObjects = {};
const boundaries = { minX: -10.5, maxX: 10.5, minZ: -7.5, maxZ: 7.5 };

let scene;
let camera;
let renderer;
let player;
let playerCarryMesh;
let helperHamster;
let currentInteractable = null;
let audioCtx;
let bgmAudio;
let panicBgmAudio;
let restartMusicOnNextPlay = true;
let panicBgmActive = false;
let toastTimer;
let toastHideTimer;
let supabase;
let questArrow = null;

init();

function init() {
  state.adminEnabled = new URLSearchParams(window.location.search).get("admin") === ADMIN_CODE;
  loadSettings();
  setupScene();
  setupInput();
  syncSoundToggle();
  refreshStartActions();
  void initAuth();
  updateHud();
  window.addEventListener("beforeunload", handleBeforeUnload);
  window.addEventListener("pagehide", handleBeforeUnload);
  animate();
}

function handleBeforeUnload() {
  restartMusicOnNextPlay = true;
  if (!bgmAudio) return;
  bgmAudio.pause();
  try {
    bgmAudio.currentTime = 0;
  } catch {
    // Ignore browsers that block currentTime updates during unload.
  }
}

function normalizeSupabaseUrl(value) {
  const raw = (value || "").trim();
  if (!raw || raw.startsWith("YOUR_")) return "";

  const dashboardMatch = raw.match(/supabase\.com\/dashboard\/project\/([a-z0-9]+)/i);
  if (dashboardMatch?.[1]) {
    return `https://${dashboardMatch[1]}.supabase.co`;
  }

  return raw.replace(/\/+$/, "");
}

function isSupabaseConfigured() {
  return Boolean(normalizeSupabaseUrl(SUPABASE_URL)) && !SUPABASE_ANON_KEY.startsWith("YOUR_");
}

function getSupabase() {
  if (!isSupabaseConfigured()) return null;
  if (!supabase) {
    supabase = createClient(normalizeSupabaseUrl(SUPABASE_URL), SUPABASE_ANON_KEY);
  }
  return supabase;
}

async function initAuth() {
  syncAuthUi();
  const client = getSupabase();
  if (!client) {
    state.authReady = true;
    syncAuthUi("Supabase URL과 anon key를 `src/supabase-config.js`에 입력하면 회원가입과 DB 저장이 켜집니다.");
    refreshStartActions();
    return;
  }

  try {
    const { data } = await client.auth.getSession();
    await applySession(data.session);
    client.auth.onAuthStateChange((_event, session) => {
      void applySession(session);
    });
  } catch (error) {
    console.error(error);
    syncAuthUi("인증 초기화에 실패했습니다. Supabase 설정과 네트워크를 확인해주세요.");
  } finally {
    state.authReady = true;
    syncAuthUi();
    refreshStartActions();
  }
}

async function applySession(session) {
  state.authUser = session?.user || null;
  if (!state.authUser) {
    state.profileNickname = "";
    state.remoteChallengeProgress = null;
    state.remoteCareerProgress = null;
    state.history = [];
    state.savedActiveDay = null;
    state.authMode = "login";
    refreshStartActions();
    syncAuthUi();
    return;
  }

  await ensureProfile();
  await hydrateRemoteState();
  await migrateLegacyDataIfNeeded();
  await hydrateRemoteState();
  refreshStartActions();
  syncAuthUi();

  // 신규 계정이면 튜토리얼 자동 시작
  const tutorialSeenKey = `hamster_tutorial_seen_${state.authUser.id}`;
  const isNewAccount =
    state.history.length === 0 && !hasPlayableProgress(getSavedProgress("challenge"));
  if (isNewAccount && !localStorage.getItem(tutorialSeenKey)) {
    localStorage.setItem(tutorialSeenKey, "1");
    startTutorialGame();
  }
}

function setupScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#8bd4d0");
  scene.fog = new THREE.Fog("#8bd4d0", 20, 46);

  camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 8.6, 11.5);

  renderer = new THREE.WebGLRenderer({ canvas: dom.canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const hemi = new THREE.HemisphereLight("#fff5d7", "#4b8079", 2.4);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight("#fff1bd", 2.2);
  sun.position.set(-6, 10, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.near = 0.5;
  sun.shadow.camera.far = 36;
  sun.shadow.camera.left = -16;
  sun.shadow.camera.right = 16;
  sun.shadow.camera.top = 16;
  sun.shadow.camera.bottom = -16;
  scene.add(sun);

  const warmLamp = new THREE.PointLight("#ffbc63", 45, 18);
  warmLamp.position.set(0, 4.5, -1.4);
  scene.add(warmLamp);

  createRestaurant();
  createStations();
  createPlayer();
  createHelperHamster();
  createDecor();
  createCareerRegionDecor();
  createQuestArrow();

  window.addEventListener("resize", onResize);
}

function createRestaurant() {
  const floor = mesh(
    new THREE.BoxGeometry(23, 0.28, 17),
    mat("#f5d88b", { roughness: 0.9 }),
    [0, -0.15, 0],
  );
  floor.receiveShadow = true;
  scene.add(floor);

  const rug = mesh(new THREE.BoxGeometry(5.8, 0.05, 3.4), mat("#ef5b4f"), [0, 0.03, 4.6]);
  rug.receiveShadow = true;
  scene.add(rug);

  addWall([0, 1.25, -8.4], [23.4, 2.5, 0.32], "#ed9f78");
  addWall([-11.4, 1.25, 0], [0.32, 2.5, 17], "#f4bb7e");
  addWall([11.4, 1.25, 0], [0.32, 2.5, 17], "#f4bb7e");

  for (let x = -8; x <= 8; x += 4) {
    const plank = mesh(new THREE.BoxGeometry(0.08, 0.04, 16.6), mat("#d89a5f"), [x, 0.06, 0]);
    scene.add(plank);
  }

  const sign = makeLabelBoard("HAMSTER\nCHEF", "#277d85", "#fff8e8");
  sign.position.set(0, 2.85, -8.62);
  scene.add(sign);
}

function addWall(position, scale, color) {
  const wall = mesh(new THREE.BoxGeometry(scale[0], scale[1], scale[2]), mat(color), position);
  wall.receiveShadow = true;
  scene.add(wall);
}

function createStations() {
  stations.board = createStation({
    id: "board",
    label: "일 게시판",
    position: [-7.8, 0, -5.8],
    color: "#5e426d",
    marker: "#f5c84b",
    action: () => openQuestBoard(),
  });

  stations.shop = createStation({
    id: "shop",
    label: "재료 상점",
    position: [7.4, 0, -5.4],
    color: "#2da66f",
    marker: "#fff8e8",
    action: () => openShop(),
  });

  stations.upgrade = createStation({
    id: "upgrade",
    label: "업그레이드",
    position: [4.6, 0, -5.7],
    color: "#5e426d",
    marker: "#fff8e8",
    action: () => openUpgradeShop(),
  });

  stations.kitchen = createStation({
    id: "kitchen",
    label: "조리대",
    position: [3.8, 0, 0.6],
    color: "#ef5b4f",
    marker: "#fff8e8",
    action: () => openCooking(),
  });

  stations.judge = createStation({
    id: "judge",
    label: "평가 테이블",
    position: [0, 0, 5.6],
    color: "#277d85",
    marker: "#f5c84b",
    action: () => openJudge(),
  });

  stations.sink = createStation({
    id: "sink",
    label: "싱크대",
    position: [-7.4, 0, 1.8],
    color: "#70b7d2",
    marker: "#fff8e8",
    action: () => handleSink(),
  });

  stations.counter = createStation({
    id: "counter",
    label: "주방 카운터",
    position: [-1.8, 0, -1.2],
    color: "#c77c4a",
    marker: "#fff8e8",
    action: () => handleCounter(),
  });

  stations.shelf = createStation({
    id: "shelf",
    label: "재료 선반",
    position: [8, 0, 2.5],
    color: "#8d6a4f",
    marker: "#f5c84b",
    action: () => handleShelf(),
  });
}

function createStation({ id, label, position, color, marker, action }) {
  const group = new THREE.Group();
  group.position.set(...position);

  const base = mesh(new THREE.BoxGeometry(2, 0.78, 1.2), mat(color), [0, 0.39, 0]);
  group.add(base);

  const top = mesh(new THREE.BoxGeometry(2.16, 0.18, 1.34), mat("#fff8e8"), [0, 0.88, 0]);
  group.add(top);

  const markerMesh = mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.12, 18), mat(marker), [0, 1.06, 0]);
  group.add(markerMesh);

  const labelBoard = makeLabelBoard(label, color, "#fff8e8");
  labelBoard.position.set(0, 1.65, 0);
  group.add(labelBoard);
  billboards.push(labelBoard);

  scene.add(group);

  const station = {
    id,
    label,
    defaultLabel: label,
    defaultColor: color,
    defaultMarker: marker,
    group,
    position: group.position,
    radius: 2.2,
    action,
    defaultAction: action,
    markerMesh,
    base,
    labelBoard,
  };
  interactables.push(station);
  return station;
}

function createQuestArrow() {
  const group = new THREE.Group();
  const cone = mesh(new THREE.ConeGeometry(0.28, 0.55, 8), mat("#f5c84b"), [0, 0, 0]);
  cone.rotation.z = Math.PI;
  group.add(cone);
  const stem = mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.28, 8), mat("#f5c84b"), [0, 0.42, 0]);
  group.add(stem);
  group.visible = false;
  scene.add(group);
  questArrow = group;
}

const QUEST_STATION_MAP = {
  dishwash: "sink", errand: "counter", stock: "shelf",
  sort: "shelf", water: "shop",
};

function updateQuestArrow() {
  if (!questArrow) return;
  const quest = state.currentQuest;
  if (!quest || quest.completed) { questArrow.visible = false; return; }
  const stationKey = QUEST_STATION_MAP[quest.id];
  const station = stationKey ? stations[stationKey] : null;
  if (station?.group) {
    const p = station.group.position;
    questArrow.position.set(p.x, 3.1, p.z);
    questArrow.visible = true;
  } else {
    questArrow.visible = false;
  }
}

function createDecor() {
  for (const x of [-5.5, -2.2, 2.2, 5.5]) {
    const table = new THREE.Group();
    table.position.set(x, 0, 3.25);
    table.add(mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.2, 20), mat("#fff8e8"), [0, 0.74, 0]));
    table.add(mesh(new THREE.CylinderGeometry(0.14, 0.18, 0.72, 10), mat("#8d6a4f"), [0, 0.36, 0]));
    table.add(mesh(new THREE.BoxGeometry(0.32, 0.32, 0.32), mat("#ef5b4f"), [0.35, 0.98, 0.15]));
    scene.add(table);
  }

  for (let i = 0; i < 6; i += 1) {
    const pot = new THREE.Group();
    pot.position.set(-9 + i * 3.6, 0, -7.5);
    pot.add(mesh(new THREE.CylinderGeometry(0.26, 0.34, 0.46, 14), mat("#c77c4a"), [0, 0.23, 0]));
    pot.add(mesh(new THREE.SphereGeometry(0.32, 12, 8), mat(i % 2 ? "#2da66f" : "#277d85"), [0, 0.62, 0]));
    scene.add(pot);
  }
}

function createCareerRegionDecor() {
  worldObjects.regionDecor = {
    restaurant: new THREE.Group(),
    market: new THREE.Group(),
    forest: new THREE.Group(),
    greenhouse: new THREE.Group(),
  };

  const market = worldObjects.regionDecor.market;
  for (const x of [-6.8, -2.2, 2.4, 6.9]) {
    const stall = new THREE.Group();
    stall.position.set(x, 0, -3.6 + (x % 2 === 0 ? 0.6 : 0));
    stall.add(mesh(new THREE.BoxGeometry(1.8, 0.2, 1.4), mat("#fff8e8"), [0, 1.2, 0]));
    stall.add(mesh(new THREE.BoxGeometry(1.7, 0.12, 1.3), mat("#ef5b4f"), [0, 1.42, 0]));
    stall.add(mesh(new THREE.BoxGeometry(1.5, 0.6, 1.1), mat("#c77c4a"), [0, 0.48, 0]));
    stall.add(mesh(new THREE.BoxGeometry(0.28, 1.12, 0.28), mat("#8d6a4f"), [-0.66, 0.56, -0.42]));
    stall.add(mesh(new THREE.BoxGeometry(0.28, 1.12, 0.28), mat("#8d6a4f"), [0.66, 0.56, -0.42]));
    stall.add(mesh(new THREE.BoxGeometry(0.28, 1.12, 0.28), mat("#8d6a4f"), [-0.66, 0.56, 0.42]));
    stall.add(mesh(new THREE.BoxGeometry(0.28, 1.12, 0.28), mat("#8d6a4f"), [0.66, 0.56, 0.42]));
    market.add(stall);
  }

  const forest = worldObjects.regionDecor.forest;
  for (const [x, z, trunkColor, leafColor] of [
    [-7.8, -4.6, "#7a5538", "#4b9d5a"],
    [-4.2, 5.2, "#7a5538", "#63b56f"],
    [4.6, -4.9, "#7a5538", "#5ea966"],
    [7.4, 4.8, "#7a5538", "#438b50"],
  ]) {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);
    tree.add(mesh(new THREE.CylinderGeometry(0.24, 0.34, 1.5, 10), mat(trunkColor), [0, 0.75, 0]));
    tree.add(mesh(new THREE.SphereGeometry(0.9, 14, 10), mat(leafColor), [0, 1.95, 0]));
    forest.add(tree);
  }
  for (const [x, z, color] of [
    [-2.4, -2.7, "#9a6b4f"],
    [2.8, 3.2, "#af7b53"],
    [0.6, -4.2, "#7b5a44"],
    [5.8, 0.8, "#8d6b4a"],
  ]) {
    forest.add(mesh(new THREE.CylinderGeometry(0.32, 0.44, 0.42, 14), mat(color), [x, 0.2, z]));
  }

  const greenhouse = worldObjects.regionDecor.greenhouse;
  for (const x of [-5.8, 0, 5.8]) {
    const bed = new THREE.Group();
    bed.position.set(x, 0, 3.8);
    bed.add(mesh(new THREE.BoxGeometry(2.4, 0.44, 1.4), mat("#a36f4f"), [0, 0.22, 0]));
    bed.add(mesh(new THREE.BoxGeometry(2.08, 0.16, 1.08), mat("#5f9a62"), [0, 0.52, 0]));
    greenhouse.add(bed);
  }
  for (const x of [-6.4, -3.2, 0, 3.2, 6.4]) {
    const arch = new THREE.Group();
    arch.position.set(x, 0, -4.1);
    arch.add(mesh(new THREE.BoxGeometry(0.12, 2, 0.12), mat("#d7f0e7"), [-0.8, 1, 0]));
    arch.add(mesh(new THREE.BoxGeometry(0.12, 2, 0.12), mat("#d7f0e7"), [0.8, 1, 0]));
    arch.add(mesh(new THREE.BoxGeometry(1.72, 0.12, 0.12), mat("#d7f0e7"), [0, 1.96, 0]));
    greenhouse.add(arch);
  }

  Object.values(worldObjects.regionDecor).forEach((group) => {
    group.visible = false;
    scene.add(group);
  });
}

function createPlayer() {
  player = buildSkinMesh(state.selectedSkin || "default");
  player.position.set(0, 0, 0);
  scene.add(player);
}

function rebuildPlayer() {
  const pos = player?.position.clone();
  const rotY = player?.rotation.y ?? 0;
  if (player) scene.remove(player);
  player = buildSkinMesh(state.selectedSkin || "default");
  if (pos) player.position.copy(pos);
  player.rotation.y = rotY;
  scene.add(player);
}

function addChefHat(g, baseColor = "#fff8e8", puffColor = "#ffffff", py = 1.58) {
  g.add(mesh(new THREE.CylinderGeometry(0.26, 0.30, 0.22, 18), mat(baseColor), [0, py, 0.02]));
  for (const ox of [-0.18, 0, 0.18])
    g.add(mesh(new THREE.SphereGeometry(0.17, 12, 8), mat(puffColor), [ox, py + 0.16, 0.02]));
}

function buildSkinMesh(skinId) {
  const g = new THREE.Group();

  if (skinId === "cat") {
    // ── 고양이 셰프 ──
    const body = mesh(new THREE.SphereGeometry(0.54, 20, 14), mat("#e8a060"), [0, 0.62, 0]);
    body.scale.set(1.0, 0.95, 0.86); g.add(body);
    const belly = mesh(new THREE.SphereGeometry(0.36, 16, 12), mat("#ffd8a0"), [0, 0.54, 0.33]);
    belly.scale.set(1, 0.88, 0.55); g.add(belly);
    const head = mesh(new THREE.SphereGeometry(0.43, 20, 14), mat("#e8a060"), [0, 1.18, 0.06]); g.add(head);
    const snout = mesh(new THREE.SphereGeometry(0.16, 12, 10), mat("#ffd8a0"), [0, 1.12, 0.44]);
    snout.scale.set(1.1, 0.75, 0.72); g.add(snout);
    // 꼬리
    const tail = mesh(new THREE.SphereGeometry(0.18, 12, 8), mat("#e8a060"), [0, 0.42, -0.54]);
    tail.scale.set(0.55, 0.55, 1.1); g.add(tail);
    for (const side of [-1, 1]) {
      // 삼각 귀
      const ear = mesh(new THREE.ConeGeometry(0.14, 0.32, 8), mat("#e8a060"), [side * 0.32, 1.52, 0]);
      ear.rotation.z = side * 0.15; g.add(ear);
      const innerEar = mesh(new THREE.ConeGeometry(0.08, 0.22, 8), mat("#ffb0b0"), [side * 0.32, 1.53, 0.04]);
      innerEar.rotation.z = side * 0.15; g.add(innerEar);
      // 눈 + 반짝임
      g.add(mesh(new THREE.SphereGeometry(0.04, 10, 8), mat("#1a1020"), [side * 0.15, 1.24, 0.45]));
      g.add(mesh(new THREE.SphereGeometry(0.015, 6, 6), mat("#ffffff"), [side * 0.16, 1.255, 0.48]));
      // 앞발
      const paw = mesh(new THREE.SphereGeometry(0.13, 12, 8), mat("#d09050"), [side * 0.42, 0.60, 0.22]);
      paw.scale.set(0.8, 1.2, 0.7); g.add(paw);
      // 수염 3개
      for (let w = -1; w <= 1; w++) {
        const wh = mesh(new THREE.BoxGeometry(0.26, 0.013, 0.013), mat("#b07838"), [side * 0.35, 1.10 + w * 0.04, 0.44]);
        g.add(wh);
      }
    }
    g.add(mesh(new THREE.SphereGeometry(0.04, 10, 8), mat("#cc3366"), [0, 1.15, 0.57]));
    addChefHat(g);

  } else if (skinId === "rabbit") {
    // ── 토끼 셰프 ──
    const body = mesh(new THREE.SphereGeometry(0.55, 20, 14), mat("#e8e0d4"), [0, 0.62, 0]);
    body.scale.set(1.02, 0.96, 0.88); g.add(body);
    const belly = mesh(new THREE.SphereGeometry(0.37, 16, 12), mat("#fbf5ee"), [0, 0.54, 0.34]);
    belly.scale.set(1, 0.86, 0.53); g.add(belly);
    const head = mesh(new THREE.SphereGeometry(0.45, 20, 14), mat("#efe7db"), [0, 1.20, 0.08]); g.add(head);
    const snout = mesh(new THREE.SphereGeometry(0.17, 12, 10), mat("#fff8f1"), [0, 1.13, 0.47]);
    snout.scale.set(1.16, 0.76, 0.74); g.add(snout);
    for (const side of [-1, 1]) {
      const ear = mesh(new THREE.CylinderGeometry(0.09, 0.10, 0.62, 12), mat("#efe7db"), [side * 0.31, 1.74, 0.02]);
      ear.rotation.z = side * 0.12; g.add(ear);
      const earTip = mesh(new THREE.SphereGeometry(0.09, 10, 8), mat("#efe7db"), [side * 0.33, 2.06, 0.02]);
      earTip.rotation.z = side * 0.12; g.add(earTip);
      const innerEar = mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.46, 10), mat("#f4b6c6"), [side * 0.313, 1.74, 0.06]);
      innerEar.rotation.z = side * 0.12; g.add(innerEar);
      g.add(mesh(new THREE.SphereGeometry(0.05, 10, 8), mat("#221a1d"), [side * 0.15, 1.25, 0.46]));
      const paw = mesh(new THREE.SphereGeometry(0.13, 12, 8), mat("#d8cec0"), [side * 0.43, 0.60, 0.24]);
      paw.scale.set(0.8, 1.16, 0.70); g.add(paw);
    }
    const nose = mesh(new THREE.SphereGeometry(0.036, 10, 8), mat("#e58aa3"), [0, 1.15, 0.59]); g.add(nose);
    const smile = mesh(new THREE.TorusGeometry(0.046, 0.010, 8, 18, Math.PI), mat("#7a6466"), [0, 1.08, 0.60]);
    smile.rotation.x = Math.PI * 0.54; g.add(smile);
    addChefHat(g, "#fff8e8", "#ffffff", 1.62);

  } else if (skinId === "robot") {
    // ── 로봇 셰프 ──
    const body = mesh(new THREE.BoxGeometry(1.1, 0.95, 0.76), mat("#6090b8"), [0, 0.65, 0]); g.add(body);
    // 가슴 패널
    g.add(mesh(new THREE.BoxGeometry(0.60, 0.50, 0.04), mat("#4070a0"), [0, 0.68, 0.39]));
    for (let i = 0; i < 3; i++)
      g.add(mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.04, 8),
        new THREE.MeshStandardMaterial({ color: [0xff4040, 0x40ff80, 0x4080ff][i], emissive: [0xff4040, 0x40ff80, 0x4080ff][i], emissiveIntensity: 0.6 }),
        [-0.15 + i * 0.15, 0.78, 0.42]));
    // 목
    g.add(mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.18, 10), mat("#5080a0"), [0, 1.12, 0.02]));
    // 머리
    g.add(mesh(new THREE.BoxGeometry(0.82, 0.72, 0.76), mat("#6090b8"), [0, 1.60, 0.04]));
    g.add(mesh(new THREE.BoxGeometry(0.30, 0.04, 0.04), mat("#304050"), [0, 1.44, 0.42]));
    for (const side of [-1, 1]) {
      g.add(mesh(new THREE.BoxGeometry(0.18, 0.12, 0.05), mat("#203040"), [side * 0.18, 1.62, 0.42]));
      g.add(mesh(new THREE.BoxGeometry(0.12, 0.07, 0.04),
        new THREE.MeshStandardMaterial({ color: 0x00eeff, emissive: 0x00eeff, emissiveIntensity: 1.5 }),
        [side * 0.18, 1.62, 0.44]));
      // 팔
      const paw = mesh(new THREE.BoxGeometry(0.22, 0.26, 0.22), mat("#5080a0"), [side * 0.60, 0.60, 0.12]); g.add(paw);
    }
    // 안테나
    g.add(mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.38, 8), mat("#80a8c8"), [0, 1.98, 0.04]));
    g.add(mesh(new THREE.SphereGeometry(0.06, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0xff4400, emissive: 0xff4400, emissiveIntensity: 1.2 }), [0, 2.19, 0.04]));
    // 로봇 모자 (플랫 플레이트)
    g.add(mesh(new THREE.BoxGeometry(0.90, 0.10, 0.84), mat("#405060"), [0, 2.00, 0.02]));

  } else if (skinId === "devil") {
    // ── 악당 셰프 ──
    const body = mesh(new THREE.SphereGeometry(0.56, 20, 14), mat("#c03030"), [0, 0.62, 0]);
    body.scale.set(1.02, 0.96, 0.88); g.add(body);
    // 망토
    const cape = mesh(new THREE.SphereGeometry(0.64, 16, 12), mat("#1a1a2e"), [0, 0.72, -0.26]);
    cape.scale.set(1.12, 1.32, 0.38); g.add(cape);
    const belly = mesh(new THREE.SphereGeometry(0.36, 16, 12), mat("#e06060"), [0, 0.54, 0.33]);
    belly.scale.set(1, 0.86, 0.52); g.add(belly);
    const head = mesh(new THREE.SphereGeometry(0.44, 20, 14), mat("#cc2828"), [0, 1.20, 0.06]); g.add(head);
    const snout = mesh(new THREE.SphereGeometry(0.17, 12, 10), mat("#e05050"), [0, 1.14, 0.46]);
    snout.scale.set(1.2, 0.78, 0.76); g.add(snout);
    for (const side of [-1, 1]) {
      // 뿔 (더 크고 날카롭게, 뒤로 약간 휨)
      const horn = mesh(new THREE.ConeGeometry(0.11, 0.56, 8), mat("#8b1c1c"), [side * 0.26, 1.68, 0.02]);
      horn.rotation.z = side * 0.38;
      horn.rotation.x = -0.18;
      g.add(horn);
      // 눈 (발광)
      g.add(mesh(new THREE.SphereGeometry(0.04, 10, 8),
        new THREE.MeshStandardMaterial({ color: 0xff8800, emissive: 0xff5500, emissiveIntensity: 0.8 }),
        [side * 0.15, 1.26, 0.46]));
      const paw = mesh(new THREE.SphereGeometry(0.13, 12, 8), mat("#b02828"), [side * 0.43, 0.60, 0.22]);
      paw.scale.set(0.8, 1.2, 0.7); g.add(paw);
      // 등 날개 (뒤쪽 BoxGeometry)
      const wingBase = mesh(new THREE.BoxGeometry(0.07, 0.34, 0.07), mat("#12122a"), [side * 0.34, 1.04, -0.38]);
      g.add(wingBase);
      const wingBlade = mesh(new THREE.BoxGeometry(0.26, 0.60, 0.04), mat("#1e1e3a"), [side * 0.52, 1.14, -0.36]);
      wingBlade.rotation.z = side * -0.28; g.add(wingBlade);
      const wingTip = mesh(new THREE.ConeGeometry(0.06, 0.24, 6), mat("#12122a"), [side * 0.66, 1.44, -0.36]);
      wingTip.rotation.z = side * -0.5; g.add(wingTip);
    }
    g.add(mesh(new THREE.SphereGeometry(0.045, 10, 8), mat("#7a0000"), [0, 1.16, 0.58]));
    // 악마 왕관
    g.add(mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.20, 18), mat("#1a1a2e"), [0, 1.60, 0.02]));
    for (const ox of [-0.18, 0, 0.18])
      g.add(mesh(new THREE.ConeGeometry(0.056, 0.22, 6), mat("#8b1c1c"), [ox, 1.82, 0.02]));

  } else if (skinId === "wizard") {
    // ── 마법사 셰프 ──
    // 로브 (세로 긴 직사각형)
    const robe = mesh(new THREE.BoxGeometry(0.96, 1.30, 0.52), mat("#3d2060"), [0, 0.50, -0.08]);
    g.add(robe);
    const body = mesh(new THREE.SphereGeometry(0.56, 20, 14), mat("#5c3a8a"), [0, 0.62, 0]);
    body.scale.set(1.02, 0.96, 0.88); g.add(body);
    const belly = mesh(new THREE.SphereGeometry(0.36, 16, 12), mat("#8060b0"), [0, 0.54, 0.33]);
    belly.scale.set(1, 0.86, 0.52); g.add(belly);
    // 별 장식 (몸통)
    for (const [sx, sy, sz] of [[0.30, 0.80, 0.36], [-0.28, 0.96, 0.30], [0.10, 0.50, 0.40]]) {
      g.add(mesh(new THREE.SphereGeometry(0.055, 6, 6),
        new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffaa00, emissiveIntensity: 0.9 }), [sx, sy, sz]));
    }
    const head = mesh(new THREE.SphereGeometry(0.44, 20, 14), mat("#6644a0"), [0, 1.18, 0.08]); g.add(head);
    const snout = mesh(new THREE.SphereGeometry(0.17, 12, 10), mat("#8060b0"), [0, 1.12, 0.46]);
    snout.scale.set(1.2, 0.78, 0.76); g.add(snout);
    for (const side of [-1, 1]) {
      const ear = mesh(new THREE.SphereGeometry(0.15, 12, 8), mat("#5c3a8a"), [side * 0.36, 1.44, 0]);
      ear.scale.set(0.9, 1.1, 0.68); g.add(ear);
      g.add(mesh(new THREE.SphereGeometry(0.04, 10, 8),
        new THREE.MeshStandardMaterial({ color: 0xaa60ff, emissive: 0x8040ff, emissiveIntensity: 0.5 }),
        [side * 0.14, 1.24, 0.47]));
      const paw = mesh(new THREE.SphereGeometry(0.13, 12, 8), mat("#5c3a8a"), [side * 0.43, 0.60, 0.24]);
      paw.scale.set(0.8, 1.2, 0.7); g.add(paw);
    }
    g.add(mesh(new THREE.SphereGeometry(0.045, 10, 8), mat("#3d1060"), [0, 1.15, 0.59]));
    // 마법사 모자 (챙 + 원뿔)
    g.add(mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.08, 18), mat("#2a1050"), [0, 1.58, 0.02]));
    g.add(mesh(new THREE.ConeGeometry(0.24, 0.76, 18), mat("#2a1050"), [0, 2.02, 0.02]));
    g.add(mesh(new THREE.SphereGeometry(0.07, 6, 6),
      new THREE.MeshStandardMaterial({ color: 0xffd700, emissive: 0xffaa00, emissiveIntensity: 1.0 }), [0, 2.42, 0.04]));

  } else {
    // ── 기본 햄스터 ──
    const body = mesh(new THREE.SphereGeometry(0.56, 20, 14), mat("#d99b61"), [0, 0.62, 0]);
    body.scale.set(1.02, 0.96, 0.88); g.add(body);
    const belly = mesh(new THREE.SphereGeometry(0.38, 16, 12), mat("#ffe2ae"), [0, 0.54, 0.35]);
    belly.scale.set(1, 0.86, 0.52); g.add(belly);
    const head = mesh(new THREE.SphereGeometry(0.44, 20, 14), mat("#e5aa72"), [0, 1.18, 0.08]); g.add(head);
    const snout = mesh(new THREE.SphereGeometry(0.17, 12, 10), mat("#ffe2ae"), [0, 1.12, 0.46]);
    snout.scale.set(1.2, 0.78, 0.76); g.add(snout);
    for (const side of [-1, 1]) {
      const ear = mesh(new THREE.SphereGeometry(0.16, 12, 8), mat("#d68e5d"), [side * 0.36, 1.46, 0]);
      ear.scale.set(0.9, 1.1, 0.68); g.add(ear);
      g.add(mesh(new THREE.SphereGeometry(0.035, 10, 8), mat("#221a1d"), [side * 0.14, 1.24, 0.47]));
      const paw = mesh(new THREE.SphereGeometry(0.13, 12, 8), mat("#c98154"), [side * 0.43, 0.6, 0.24]);
      paw.scale.set(0.8, 1.2, 0.7); g.add(paw);
    }
    g.add(mesh(new THREE.SphereGeometry(0.045, 10, 8), mat("#5b2d32"), [0, 1.15, 0.59]));
    addChefHat(g);
  }

  // 들고 있는 아이템 메시 (공통)
  playerCarryMesh = mesh(new THREE.BoxGeometry(0.42, 0.34, 0.42), mat("#b77b45"), [0, 1.02, 0.72]);
  playerCarryMesh.visible = false;
  g.add(playerCarryMesh);
  return g;
}

function createHelperHamster() {
  helperHamster = new THREE.Group();
  helperHamster.position.set(-3.2, 0, -4.4);
  helperHamster.visible = false;

  const body = mesh(new THREE.SphereGeometry(0.34, 16, 10), mat("#c98b5d"), [0, 0.38, 0]);
  body.scale.set(1, 0.88, 0.86);
  helperHamster.add(body);
  helperHamster.add(mesh(new THREE.SphereGeometry(0.26, 16, 10), mat("#e3aa76"), [0, 0.78, 0.05]));
  helperHamster.add(mesh(new THREE.BoxGeometry(0.42, 0.08, 0.34), mat("#fff8e8"), [0, 1.04, 0.02]));
  for (const side of [-1, 1]) {
    helperHamster.add(mesh(new THREE.SphereGeometry(0.04, 8, 6), mat("#221a1d"), [side * 0.1, 0.82, 0.27]));
  }
  scene.add(helperHamster);
}

function setupInput() {
  dom.startButton.addEventListener("click", startGame);
  if (dom.continueButton) {
    dom.continueButton.addEventListener("click", continueGame);
  }
  dom.careerButton.addEventListener("click", openCareerModePreview);
  dom.leaderboardButton.addEventListener("click", () => void openChallengeLeaderboardModal());
  dom.tutorialButton.addEventListener("click", startTutorialGame);
  dom.historyButton.addEventListener("click", openHistoryModal);
  dom.multiButton.addEventListener("click", openMultiChallengeModal);
  dom.skinButton?.addEventListener("click", openSkinSelector);
  dom.pvpSabotagePanel.querySelectorAll("[data-sabotage]").forEach((btn) => {
    btn.addEventListener("click", () => sendSabotage(btn.dataset.sabotage));
  });
  dom.mapButton.addEventListener("click", openCareerMapModal);
  dom.authSubmitButton.addEventListener("click", () => void handleAuthSubmit());
  dom.authSwitchButton.addEventListener("click", handleAuthSwitch);
  dom.logoutButton.addEventListener("click", () => void handleLogout());
  dom.restartButton.addEventListener("click", () => {
    if (state.tutorialMode) {
      endTutorialMode("튜토리얼을 마쳤습니다. 이제 새 게임으로 시작해보세요.");
    } else {
      restartGame();
    }
  });
  dom.challengeLbExit.addEventListener("click", exitChallengeLeaderboardScreen);
  dom.closeModal.addEventListener("click", closeModal);
  dom.interactionButton.addEventListener("click", interact);
  document.getElementById("defuse-action-btn")?.addEventListener("click", attemptDefuseHit);
  dom.recipeNoteButton.addEventListener("click", openRecipeNote);
  dom.soundToggle.addEventListener("click", toggleSound);
  dom.tutorialExit.addEventListener("click", () => endTutorialMode("튜토리얼을 종료했습니다."));

  window.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === "a") {
      event.preventDefault();
      state.adminEnabled = true;
      openAdminPanel();
      return;
    }

    if (state.minigame?.active && (event.key === " " || event.key === "Enter")) {
      event.preventDefault();
      handleCookingMiniGameAction();
      return;
    }

    if (event.key === "Tab" && state.running && !state.gameOver) {
      event.preventDefault();
      if (!state.minigame?.active) openRecipeNote();
      return;
    }

    if (event.key.toLowerCase() === "m" && state.running && state.gameMode === "career" && !state.gameOver) {
      event.preventDefault();
      openCareerMapModal();
      return;
    }

    if (state.modalOpen && state.currentQuest?.id === "water") {
      const k = event.key;
      if (k === "ArrowLeft" || k === "a" || k === "A") {
        event.preventDefault();
        const q = state.currentQuest;
        q.selectedPlant = (q.selectedPlant - 1 + q.plants.length) % q.plants.length;
        updateWaterUI();
        return;
      }
      if (k === "ArrowRight" || k === "d" || k === "D") {
        event.preventDefault();
        const q = state.currentQuest;
        q.selectedPlant = (q.selectedPlant + 1) % q.plants.length;
        updateWaterUI();
        return;
      }
    }

    if (state.modalOpen && state.currentQuest?.id === "sort") {
      if (event.key === "ArrowLeft" || event.key === "f" || event.key === "F") {
        event.preventDefault();
        judgeSortItem(false);
        return;
      }
      if (event.key === "ArrowRight" || event.key === "g" || event.key === "G") {
        event.preventDefault();
        judgeSortItem(true);
        return;
      }
    }

    if (event.key === "Escape") {
      if (state.modalOpen) {
        closeModal();
        return;
      }
      // 실제 PvP는 계속 막는다 — 살아있는 상대가 있는 매치를 혼자 일시정지하면
      // 불공평하다. 고스트는 상대가 스크립트뿐이라 막을 이유가 없다.
      const pvpBlocksPause = state.pvpRoom && !state.pvpRoom.isGhost;
      if (state.running && !state.gameOver && !state.minigame?.active && !pvpBlocksPause) {
        event.preventDefault();
        openPauseMenu();
      }
      return;
    }

    if (event.key.toLowerCase() === "e" || event.key === "Enter") {
      if (defuseMiniGame) { attemptDefuseHit(); return; }
      if (!state.modalOpen && state.running) interact();
    }

    // 방향키는 카메라 회전에 쓰므로 페이지 스크롤로 새지 않게 막는다.
    if (event.key.startsWith("Arrow") && state.running && !state.modalOpen) {
      event.preventDefault();
    }

    keys.add(event.key.toLowerCase());
  });

  window.addEventListener("keyup", (event) => {
    keys.delete(event.key.toLowerCase());
  });

  window.addEventListener("pointermove", (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
  });
}

function getDefaultAuthMessage(configured, loggedIn, nickname) {
  if (!configured) {
    return "Supabase URL과 anon key를 설정하면 회원가입과 DB 저장이 활성화됩니다.";
  }
  if (loggedIn) {
    return `${nickname} 계정으로 저장이 연결되었습니다.`;
  }
  if (state.authMode === "signup") {
    return "새 계정을 만들면 저장 데이터가 이 계정에 연결됩니다.";
  }
  return "로그인하면 저장 데이터가 계정에 연결됩니다.";
}

function mapAuthErrorMessage(message = "") {
  const normalized = String(message).toLowerCase();
  if (!normalized) return "인증 중 오류가 발생했습니다.";
  if (normalized.includes("invalid login credentials")) return "이메일 또는 비밀번호가 올바르지 않습니다.";
  if (normalized.includes("email not confirmed")) return "이메일 인증이 아직 완료되지 않았습니다. 받은 편지함에서 인증 메일을 먼저 확인해주세요.";
  if (normalized.includes("user already registered")) return "이미 가입된 이메일입니다. 로그인으로 진행해주세요.";
  if (normalized.includes("password should be at least")) return "비밀번호는 8자 이상이어야 합니다.";
  if (normalized.includes("invalid email")) return "이메일 형식이 올바르지 않습니다.";
  if (normalized.includes("signup is disabled")) return "현재 회원가입이 비활성화되어 있습니다. Supabase 인증 설정을 확인해주세요.";
  if (normalized.includes("email rate limit exceeded")) return "인증 메일 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.";
  return message;
}

function setAuthMessage(message = "", type = "warning") {
  state.authMessage = message;
  state.authBannerType = type;
}

function setAuthMode(mode, message = "") {
  state.authMode = mode;
  setAuthMessage(message, mode === "signup" ? "warning" : "warning");
  syncAuthUi();
}

function syncAuthUi(message) {
  if (typeof message === "string") setAuthMessage(message);
  const configured = isSupabaseConfigured();
  const loggedIn = Boolean(state.authUser);
  const nickname = state.profileNickname || state.authUser?.user_metadata?.nickname || "햄스터 셰프";
  const authMessage = state.authMessage || getDefaultAuthMessage(configured, loggedIn, nickname);

  dom.authStatus.textContent = configured
    ? (loggedIn ? `${nickname} 님 환영합니다` : state.authMode === "signup" ? "회원가입" : "로그인")
    : "Supabase 연결 필요";
  dom.authBanner.textContent = authMessage;
  dom.authBanner.className = `auth-banner auth-banner-${state.authBannerType}`;
  dom.authBanner.classList.toggle("hidden", !authMessage);
  dom.authForm.classList.toggle("hidden", loggedIn || !configured);
  dom.logoutButton.classList.toggle("hidden", !loggedIn);
  dom.startActions.classList.toggle("hidden", !loggedIn);
  dom.authNicknameField.classList.toggle("hidden", state.authMode !== "signup");
  dom.authSubmitButton.textContent = state.authMode === "signup" ? "회원가입" : "로그인";
  dom.authSwitchButton.textContent = state.authMode === "signup" ? "로그인으로 돌아가기" : "회원가입하기";

  const disabled = state.authBusy || !configured;
  dom.authNickname.disabled = disabled;
  dom.authEmail.disabled = disabled;
  dom.authPassword.disabled = disabled;
  dom.authSubmitButton.disabled = disabled;
  dom.authSwitchButton.disabled = state.authBusy;
  dom.logoutButton.disabled = state.authBusy;
}

function setAuthBusy(busy) {
  state.authBusy = busy;
  syncAuthUi();
}

function handleAuthSwitch() {
  if (state.authMode === "signup") {
    setAuthMode("login");
    return;
  }
  setAuthMode("signup");
}

async function handleAuthSubmit() {
  if (state.authMode === "signup") {
    await handleSignup();
    return;
  }
  await handleLogin();
}

async function handleSignup() {
  const client = getSupabase();
  if (!client) {
    syncAuthUi("먼저 `src/supabase-config.js`에 Supabase 값을 입력해주세요.");
    return;
  }

  const email = dom.authEmail.value.trim();
  const password = dom.authPassword.value;
  const nickname = dom.authNickname.value.trim() || "햄스터 셰프";
  if (!email || password.length < 8) {
    setAuthMessage("회원가입하려면 이메일과 8자 이상의 비밀번호가 필요합니다. 가입 후에는 이메일 인증을 마친 뒤 로그인해야 합니다.", "warning");
    syncAuthUi();
    return;
  }

  setAuthBusy(true);
  try {
    const { data, error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { nickname },
        emailRedirectTo: window.location.origin,
      },
    });
    if (error) throw error;

    if (data.session) {
      setAuthMessage("회원가입과 로그인이 완료되었습니다.", "success");
      showToast("회원가입과 로그인이 완료되었습니다.");
    } else {
      setAuthMode("login", "회원가입이 완료되었습니다. 이메일 인증 메일을 확인하고, 인증을 끝낸 뒤 로그인해주세요.");
    }
  } catch (error) {
    console.error(error);
    setAuthMessage(mapAuthErrorMessage(error.message || "회원가입 중 오류가 발생했습니다."), "error");
    syncAuthUi();
  } finally {
    setAuthBusy(false);
  }
}

async function handleLogin() {
  const client = getSupabase();
  if (!client) {
    syncAuthUi("먼저 `src/supabase-config.js`에 Supabase 값을 입력해주세요.");
    return;
  }

  const email = dom.authEmail.value.trim();
  const password = dom.authPassword.value;
  if (!email || !password) {
    setAuthMessage("이메일과 비밀번호를 입력해주세요.", "warning");
    syncAuthUi();
    return;
  }

  setAuthBusy(true);
  try {
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    setAuthMessage("로그인되었습니다.", "success");
    showToast("로그인되었습니다.");
  } catch (error) {
    console.error(error);
    setAuthMessage(mapAuthErrorMessage(error.message || "로그인 중 오류가 발생했습니다."), "error");
    syncAuthUi();
  } finally {
    setAuthBusy(false);
  }
}

async function handleLogout() {
  const client = getSupabase();
  if (!client) return;
  setAuthBusy(true);
  try {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    setAuthMode("login", "로그아웃되었습니다.");
    state.authBannerType = "success";
    showToast("로그아웃되었습니다.");
  } catch (error) {
    console.error(error);
    setAuthMessage(mapAuthErrorMessage(error.message || "로그아웃 중 오류가 발생했습니다."), "error");
    syncAuthUi();
  } finally {
    setAuthBusy(false);
  }
}

function readLocalJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "null");
  } catch {
    return null;
  }
}

function writeLocalJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getLegacyLocalProgress() {
  return readLocalJson(LEGACY_SAVE_KEY);
}

function getSharedSettingsData() {
  return readLocalJson(SHARED_SETTINGS_KEY) || getLegacyLocalProgress();
}

function getLocalModeProgress(mode = "challenge") {
  if (mode === "career") return readLocalJson(CAREER_SAVE_KEY);
  return readLocalJson(CHALLENGE_SAVE_KEY) || getLegacyLocalProgress();
}

function getSavedProgress(mode = "challenge") {
  if (mode === "career") {
    return state.authUser ? state.remoteCareerProgress : getLocalModeProgress("career");
  }
  return state.authUser ? state.remoteChallengeProgress : getLocalModeProgress("challenge");
}

function hasPlayableProgress(data) {
  if (!data) return false;
  return Boolean(
    data.activeDay
    || data.day
    || data.reputation
    || (data.history && data.history.length)
    || (data.inventory && Object.keys(data.inventory).length)
    || (data.upgrades && Object.keys(data.upgrades).length),
  );
}

function persistSettings() {
  const data = {
    soundEnabled: state.soundEnabled,
    musicVolume: state.musicVolume,
    effectsVolume: state.effectsVolume,
  };
  writeLocalJson(SHARED_SETTINGS_KEY, data);
  if (state.authUser) {
    void saveRemoteSettings();
  }
  refreshStartActions();
}

function loadSettings() {
  const data = getSharedSettingsData();
  if (!data) return;
  state.soundEnabled = data.soundEnabled ?? true;
  state.musicVolume = clampVolume(data.musicVolume, DEFAULT_MUSIC_VOLUME);
  state.effectsVolume = clampVolume(data.effectsVolume, DEFAULT_EFFECTS_VOLUME);
}

function saveProgress() {
  if (state.tutorialMode) {
    persistSettings();
    return;
  }

  if (state.gameMode === "career") {
    saveCareerProgress();
    return;
  }

  const data = {
    coins: state.coins,
    inventory: state.inventory,
    recipeRecords: state.recipeRecords,
    reputation: state.reputation,
    upgrades: state.upgrades,
    history: state.history,
    day: state.day,
    activeDay: state.running && !state.gameOver
      ? {
          day: state.day,
          timeLeft: state.timeLeft,
          orderIndex: state.orderIndex,
          dailyEvent: state.dailyEvent?.name,
          orderQueue: state.orderQueue.map((order) => ({
            recipeId: order.recipe.id,
            requiredScore: order.requiredScore,
            customer: order.customer.name,
          })),
        }
      : null,
  };
  if (state.authUser) {
    state.remoteChallengeProgress = { ...data, history: state.history };
    void saveRemoteProgress(data);
  } else {
    writeLocalJson(CHALLENGE_SAVE_KEY, data);
  }
  refreshStartActions();
}

function loadProgress() {
  const data = getSavedProgress("challenge");
  if (!hasPlayableProgress(data)) return false;
  state.coins = data.coins ?? 12;
  state.inventory = data.inventory || {};
  state.recipeRecords = data.recipeRecords || {};
  state.reputation = data.reputation || 0;
  state.upgrades = data.upgrades || {};
  state.history = data.history || [];
  state.day = data.day || 0;
  state.savedActiveDay = data.activeDay || null;
  syncSoundToggle();
  return true;
}

function createCareerStats(data = {}) {
  return {
    customersServed: data.customersServed || 0,
    totalSales: data.totalSales || 0,
    bestDishScore: data.bestDishScore || 0,
    dishesServed: data.dishesServed || 0,
  };
}

function createGreenhouseBed(data = {}, index = 0) {
  return {
    slot: index,
    cropId: data.cropId || null,
    stage: data.stage || 0,
    quality: data.quality || 0,
    lastManagedDay: data.lastManagedDay || 0,
    ready: Boolean(data.ready),
  };
}

function createMarketOffer(day = 1) {
  const ingredientId = CAREER_MARKET_INGREDIENTS[(day - 1) % CAREER_MARKET_INGREDIENTS.length];
  return {
    ingredientId,
    bundlePrice: 18 + Math.min(20, day * 2),
    quantity: day >= 5 ? 3 : 2,
    day,
  };
}

function createCareerData(data = {}) {
  const unlockedRegions = Array.from(new Set(["restaurant", ...(data.unlockedRegions || [])]));
  const greenhouse = Array.from({ length: 3 }, (_, index) => createGreenhouseBed(data.greenhouse?.[index], index));
  return {
    currentRegion: data.currentRegion || "restaurant",
    unlockedRegions,
    greenhouse,
    marketOffer: data.marketOffer || createMarketOffer(data.day || 1),
    lastUnlockCheckDay: data.lastUnlockCheckDay || 0,
  };
}

function saveCareerProgress() {
  const data = {
    coins: state.coins,
    inventory: state.inventory,
    recipeRecords: state.recipeRecords,
    reputation: state.reputation,
    upgrades: state.upgrades,
    day: state.day,
    careerStats: state.careerStats || createCareerStats(),
    careerData: state.careerData || createCareerData({ day: state.day }),
    activeDay: state.running && !state.gameOver
      ? {
          day: state.day,
          dailyEvent: state.dailyEvent?.name,
          orderQueue: state.orderQueue.map((order) => ({
            recipeId: order.recipe.id,
            requiredScore: order.requiredScore,
            customer: order.customer.name,
          })),
        }
      : null,
  };
  state.remoteCareerProgress = data;
  writeLocalJson(CAREER_SAVE_KEY, data);
  refreshStartActions();
}

function loadCareerProgress() {
  const data = getSavedProgress("career");
  if (!hasPlayableProgress(data)) return false;
  state.coins = data.coins ?? 35;
  state.inventory = data.inventory || {};
  state.recipeRecords = data.recipeRecords || {};
  state.reputation = data.reputation || 0;
  state.upgrades = data.upgrades || {};
  state.day = data.day || 0;
  state.careerStats = createCareerStats(data.careerStats);
  state.careerData = createCareerData({ ...data.careerData, day: data.day || 0 });
  unlockCareerRegions(0, state.day || 0);
  ensureCareerMarketOffer();
  state.savedActiveDay = data.activeDay || null;
  return true;
}

async function ensureProfile() {
  const client = getSupabase();
  if (!client || !state.authUser) return;

  const fallbackNickname = state.authUser.user_metadata?.nickname || "햄스터 셰프";
  await client.from("profiles").upsert({
    id: state.authUser.id,
    nickname: fallbackNickname,
    updated_at: new Date().toISOString(),
  });
  state.profileNickname = fallbackNickname;
}

async function hydrateRemoteState() {
  const client = getSupabase();
  if (!client || !state.authUser) return;

  const userId = state.authUser.id;
  const [profileRes, settingsRes, saveRes, historyRes] = await Promise.all([
    client.from("profiles").select("nickname").eq("id", userId).maybeSingle(),
    client.from("game_settings").select("*").eq("user_id", userId).maybeSingle(),
    client.from("game_saves").select("*").eq("user_id", userId).maybeSingle(),
    client.from("service_history").select("*").eq("user_id", userId).order("day", { ascending: true }),
  ]);

  if (profileRes.data?.nickname) state.profileNickname = profileRes.data.nickname;

  if (settingsRes.data) {
    state.soundEnabled = settingsRes.data.sound_enabled ?? state.soundEnabled;
    state.musicVolume = clampVolume(settingsRes.data.music_volume, state.musicVolume);
    state.effectsVolume = clampVolume(settingsRes.data.effects_volume, state.effectsVolume);
    syncSoundToggle();
    syncMusicVolume();
  }

  state.history = (historyRes.data || []).map((entry) => ({
    day: entry.day,
    won: entry.won,
    event: entry.event,
    completed: entry.completed,
    total: entry.total,
    bestScore: entry.best_score,
    coins: entry.coins,
    reputation: entry.reputation,
    dishes: entry.dishes || [],
  }));

  state.remoteChallengeProgress = saveRes.data
    ? {
        coins: saveRes.data.coins,
        inventory: saveRes.data.inventory || {},
        recipeRecords: saveRes.data.recipe_records || {},
        reputation: saveRes.data.reputation,
        upgrades: saveRes.data.upgrades || {},
        history: state.history,
        day: saveRes.data.day || 0,
        soundEnabled: state.soundEnabled,
        musicVolume: state.musicVolume,
        effectsVolume: state.effectsVolume,
        activeDay: saveRes.data.active_day || null,
      }
    : {
        day: state.history.at(-1)?.day || 0,
        soundEnabled: state.soundEnabled,
        musicVolume: state.musicVolume,
        effectsVolume: state.effectsVolume,
        history: state.history,
      };
  state.remoteCareerProgress = getLocalModeProgress("career");
}

async function saveRemoteSettings() {
  const client = getSupabase();
  if (!client || !state.authUser) return;
  const { error } = await client.from("game_settings").upsert({
    user_id: state.authUser.id,
    sound_enabled: state.soundEnabled,
    music_volume: state.musicVolume,
    effects_volume: state.effectsVolume,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error(error);
}

async function saveRemoteProgress(data) {
  const client = getSupabase();
  if (!client || !state.authUser) return;
  const { error } = await client.from("game_saves").upsert({
    user_id: state.authUser.id,
    day: data.day,
    coins: data.coins,
    reputation: data.reputation,
    inventory: data.inventory,
    recipe_records: data.recipeRecords,
    upgrades: data.upgrades,
    active_day: data.activeDay,
    updated_at: new Date().toISOString(),
  });
  if (error) console.error(error);
}

async function saveHistoryEntry(entry) {
  const client = getSupabase();
  if (!client || !state.authUser) return;
  const { error } = await client.from("service_history").upsert({
    user_id: state.authUser.id,
    day: entry.day,
    won: entry.won,
    event: entry.event,
    completed: entry.completed,
    total: entry.total,
    best_score: entry.bestScore,
    coins: entry.coins,
    reputation: entry.reputation,
    dishes: entry.dishes,
  }, { onConflict: "user_id,day" });
  if (error) console.error(error);
}

function getProfileDisplayName() {
  return state.profileNickname || state.authUser?.user_metadata?.nickname || "햄스터 셰프";
}

function getChallengeRunScore() {
  const dishes = state.serviceStats?.dishes || [];
  const gross = dishes.reduce((total, dish) => total + (dish.score || 0), 0);
  return Math.max(0, gross - (state.serviceStats?.penaltyScore || 0));
}

function applyChallengePenalty(points) {
  if (!state.serviceStats || points <= 0) return 0;
  state.serviceStats.penaltyScore = (state.serviceStats.penaltyScore || 0) + points;
  return points;
}

function makeReplacementOrder(previousRecipeId = getCurrentOrder()?.recipe?.id || null) {
  if (state.gameMode === "career") {
    let recipe = pickTargetRecipe();
    const recipes = getUnlockedRecipes();
    if (recipe.id === previousRecipeId && recipes.length > 1) {
      recipe = recipes[(recipes.findIndex((item) => item.id === recipe.id) + 1) % recipes.length] || recipe;
    }
    return {
      recipe,
      requiredScore: THREE.MathUtils.clamp(
        applyDailyRequiredScore(recipe, 72 + Math.min(18, state.day) - getUpgradeLevel("hospitality") * 3),
        60,
        96,
      ),
      customer: pickCustomerPreference(),
    };
  }
  return makeChallengeOrder(previousRecipeId);
}

function replaceCurrentOrder(previousRecipeId = getCurrentOrder()?.recipe?.id || null) {
  const replacement = makeReplacementOrder(previousRecipeId);
  state.orderQueue[Math.min(state.orderIndex, state.orderQueue.length - 1)] = replacement;
  state.targetRecipe = replacement.recipe;
  return replacement;
}

function abandonCurrentOrder() {
  const currentOrder = getCurrentOrder();
  if (!currentOrder) return;
  const penalty = applyChallengePenalty(ABANDON_ORDER_SCORE_PENALTY);
  state.selectedIngredients = [];
  state.pendingDish = null;
  state.lastJudgement = null;
  state.scoreboardConclusion = null;
  replaceCurrentOrder(currentOrder.recipe?.id || null);
  updateHud();
  saveProgress();
  closeModal(false, true);
  openModal(`
    <h2>요리를 포기했습니다</h2>
    <p>현재 주문을 포기하고 다른 요리를 받았습니다.</p>
    <article class="choice-card">
      <h3>챌린지 점수 -${penalty}</h3>
      <p>새 주문은 <strong>${getTargetRecipe().name}</strong>입니다. 목표는 <strong>${getRequiredScore()}점 이상</strong>입니다.</p>
      <button type="button" data-close-abandon-order="true">확인</button>
    </article>
  `);
  dom.modalContent.querySelector('[data-close-abandon-order]')?.addEventListener('click', () => closeModal());
}

function abandonCurrentQuest() {
  const quest = state.currentQuest;
  if (!quest) return;
  const penalty = applyChallengePenalty(ABANDON_QUEST_SCORE_PENALTY);
  if (quest.frameId) {
    cancelAnimationFrame(quest.frameId);
    quest.frameId = null;
  }
  clearOrderChallengeTimer();
  clearCrates();
  playerCarryMesh.visible = false;
  const previousQuestId = quest.id;
  state.currentQuest = null;
  state.lastChallengeQuestId = previousQuestId;
  if (state.gameMode === "challenge") {
    assignRandomChallengeQuest({ excludeId: previousQuestId, toast: false });
    updateHud();
    saveProgress();
    closeModal(false, true);
    openModal(`
      <h2>일을 포기했습니다</h2>
      <p>현재 일을 포기하고 다른 랜덤 일을 받았습니다.</p>
      <article class="choice-card">
        <h3>챌린지 점수 -${penalty}</h3>
        <p>새 일은 <strong>${state.currentQuest?.name || "없음"}</strong>입니다.</p>
        <p>${state.currentQuest?.detail || "게시판에서 확인해보세요."}</p>
        <button type="button" data-close-abandon-quest="true">확인</button>
      </article>
    `);
    dom.modalContent.querySelector('[data-close-abandon-quest]')?.addEventListener('click', () => closeModal());
    return;
  }
  updateHud();
  saveProgress();
  closeModal(false, true);
  openQuestBoard();
}

function openAbandonOrderConfirm() {
  openModal(`
    <h2>요리를 포기할까요?</h2>
    <p>현재 주문을 포기하고 다른 요리를 받습니다.</p>
    <article class="choice-card">
      <h3>챌린지 점수 -${ABANDON_ORDER_SCORE_PENALTY}</h3>
      <p>포기하면 현재 주문이 교체됩니다. 정말 진행할까요?</p>
      <div class="mode-actions">
        <button type="button" class="primary-action" data-confirm-abandon-order="true">포기하기</button>
        <button type="button" class="primary-action secondary-action" data-cancel-abandon-order="true">계속 요리하기</button>
      </div>
    </article>
  `);
  dom.modalContent.querySelector('[data-confirm-abandon-order]')?.addEventListener('click', abandonCurrentOrder);
  dom.modalContent.querySelector('[data-cancel-abandon-order]')?.addEventListener('click', openCooking);
}

function openAbandonQuestConfirm() {
  openModal(`
    <h2>일을 포기할까요?</h2>
    <p>현재 일을 포기하고 다른 일을 받습니다.</p>
    <article class="choice-card">
      <h3>챌린지 점수 -${ABANDON_QUEST_SCORE_PENALTY}</h3>
      <p>진행 중인 일은 사라집니다. 정말 포기할까요?</p>
      <div class="mode-actions">
        <button type="button" class="primary-action" data-confirm-abandon-quest="true">포기하기</button>
        <button type="button" class="primary-action secondary-action" data-cancel-abandon-quest="true">계속하기</button>
      </div>
    </article>
  `);
  dom.modalContent.querySelector('[data-confirm-abandon-quest]')?.addEventListener('click', abandonCurrentQuest);
  dom.modalContent.querySelector('[data-cancel-abandon-quest]')?.addEventListener('click', openQuestBoard);
}

function getChallengeOrderNumber() {
  return (state.serviceStats?.completedOrders || 0) + 1;
}

function buildChallengeRecordPayload() {
  const completedOrders = state.serviceStats?.completedOrders || 0;
  return {
    user_id: state.authUser?.id,
    nickname: getProfileDisplayName(),
    challenge_score: getChallengeRunScore(),
    best_dish_score: state.serviceStats?.bestScore || 0,
    clear_time_seconds: getElapsedSeconds(),
    completed_orders: completedOrders,
    total_orders: completedOrders,
    day_reached: state.day || 0,
    updated_at: new Date().toISOString(),
  };
}

function isBetterChallengeRecord(next, current) {
  if (!current) return true;
  return (
    next.challenge_score > current.challenge_score
    || (
      next.challenge_score === current.challenge_score
      && (
        next.completed_orders > current.completed_orders
        || (
          next.completed_orders === current.completed_orders
          && (
            next.best_dish_score > current.best_dish_score
            || (
              next.best_dish_score === current.best_dish_score
              && next.clear_time_seconds < current.clear_time_seconds
            )
          )
        )
      )
    )
  );
}

function mapChallengeRecord(row) {
  if (!row) return null;
  return {
    userId: row.user_id,
    nickname: row.nickname || "햄스터 셰프",
    challengeScore: row.challenge_score || 0,
    bestDishScore: row.best_dish_score || 0,
    clearTimeSeconds: row.clear_time_seconds || 0,
    completedOrders: row.completed_orders || 0,
    totalOrders: row.total_orders || 0,
    dayReached: row.day_reached || 0,
    updatedAt: row.updated_at || "",
  };
}

function getLeaderboardSetupHelp() {
  return {
    title: "Supabase 랭킹 테이블 설정 필요",
    body: "Supabase SQL Editor에서 `supabase/challenge_leaderboard.sql` 내용을 한 번 실행하면 챌린지 랭킹이 바로 동작합니다.",
    code: `create table if not exists public.challenge_leaderboard (
  user_id uuid primary key references auth.users(id) on delete cascade,
  nickname text not null default '햄스터 셰프',
  challenge_score integer not null default 0,
  best_dish_score integer not null default 0,
  clear_time_seconds integer not null default 0,
  completed_orders integer not null default 0,
  total_orders integer not null default 0,
  day_reached integer not null default 0,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.challenge_leaderboard enable row level security;

drop policy if exists "challenge_leaderboard_select_all" on public.challenge_leaderboard;
drop policy if exists "challenge_leaderboard_insert_own" on public.challenge_leaderboard;
drop policy if exists "challenge_leaderboard_update_own" on public.challenge_leaderboard;

create policy "challenge_leaderboard_select_all"
on public.challenge_leaderboard
for select
to authenticated
using (true);

create policy "challenge_leaderboard_insert_own"
on public.challenge_leaderboard
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "challenge_leaderboard_update_own"
on public.challenge_leaderboard
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);`,
  };
}

function mapLeaderboardError(error) {
  const message = `${error?.message || ""} ${error?.details || ""} ${error?.hint || ""}`.toLowerCase();
  if (message.includes("challenge_leaderboard") && (message.includes("does not exist") || message.includes("could not find the table") || message.includes("schema cache"))) {
    return getLeaderboardSetupHelp();
  }
  if (message.includes("permission denied") || message.includes("row-level security")) {
    return {
      title: "Supabase 권한 설정 확인 필요",
      body: "`supabase/challenge_leaderboard.sql`의 정책까지 함께 실행해야 랭킹 조회와 저장이 동작합니다.",
      code: null,
    };
  }
  return {
    title: "랭킹 데이터를 불러오지 못했습니다",
    body: "Supabase 연결 상태와 랭킹 테이블 설정을 확인해주세요.",
    code: null,
  };
}

async function saveChallengeLeaderboardEntry() {
  const client = getSupabase();
  if (!client || !state.authUser || !state.serviceStats) return;
  const payload = buildChallengeRecordPayload();
  const { data: existing, error: existingError } = await client
    .from("challenge_leaderboard")
    .select("*")
    .eq("user_id", state.authUser.id)
    .maybeSingle();
  if (existingError) {
    console.error(existingError);
    return;
  }
  if (!isBetterChallengeRecord(payload, existing)) {
    state.personalChallengeRecord = mapChallengeRecord(existing);
    return;
  }

  const { error } = await client.from("challenge_leaderboard").upsert(payload);
  if (error) {
    console.error(error);
    return;
  }
  state.personalChallengeRecord = mapChallengeRecord(payload);
}

async function fetchChallengeLeaderboard(limit = 10) {
  const client = getSupabase();
  if (!client || !state.authUser) {
    return { entries: [], personal: null, error: "로그인 후 챌린지 랭킹을 확인할 수 있습니다." };
  }

  const [entriesRes, personalRes] = await Promise.all([
    client
      .from("challenge_leaderboard")
      .select("*")
      .order("challenge_score", { ascending: false })
      .order("completed_orders", { ascending: false })
      .order("best_dish_score", { ascending: false })
      .order("clear_time_seconds", { ascending: true })
      .limit(limit),
    client
      .from("challenge_leaderboard")
      .select("*")
      .eq("user_id", state.authUser.id)
      .maybeSingle(),
  ]);

  if (entriesRes.error || personalRes.error) {
    const sourceError = entriesRes.error || personalRes.error;
    console.error(sourceError);
    const help = mapLeaderboardError(sourceError);
    return {
      entries: [],
      personal: null,
      error: help.body,
      errorTitle: help.title,
      errorCode: help.code,
    };
  }

  const entries = (entriesRes.data || []).map(mapChallengeRecord).filter(Boolean);
  const personal = mapChallengeRecord(personalRes.data);
  state.personalChallengeRecord = personal;
  return { entries, personal, error: "", errorTitle: "", errorCode: "" };
}

async function clearRemotePlayableProgress() {
  const client = getSupabase();
  if (!client || !state.authUser) return;
  const userId = state.authUser.id;
  const { error: saveError } = await client.from("game_saves").delete().eq("user_id", userId);
  if (saveError) throw saveError;
}

async function clearRemoteData() {
  const client = getSupabase();
  if (!client || !state.authUser) return;
  await Promise.all([
    client.from("game_saves").delete().eq("user_id", state.authUser.id),
    client.from("game_settings").delete().eq("user_id", state.authUser.id),
    client.from("service_history").delete().eq("user_id", state.authUser.id),
    client.from("challenge_leaderboard").delete().eq("user_id", state.authUser.id),
  ]);
  state.remoteChallengeProgress = null;
  state.remoteCareerProgress = null;
  state.personalChallengeRecord = null;
  state.history = [];
  refreshStartActions();
}

async function migrateLegacyDataIfNeeded() {
  if (!state.authUser) return;
  const markerKey = `${MIGRATION_KEY_PREFIX}${state.authUser.id}`;
  if (localStorage.getItem(markerKey)) return;

  const legacy = getLegacyLocalProgress();
  if (!hasPlayableProgress(legacy) && !legacy?.soundEnabled) return;
  if (hasPlayableProgress(state.remoteChallengeProgress) || state.history.length) {
    writeLocalJson(CHALLENGE_SAVE_KEY, legacy);
    writeLocalJson(SHARED_SETTINGS_KEY, {
      soundEnabled: legacy?.soundEnabled ?? state.soundEnabled,
      musicVolume: clampVolume(legacy?.musicVolume, state.musicVolume),
      effectsVolume: clampVolume(legacy?.effectsVolume, state.effectsVolume),
    });
    localStorage.setItem(markerKey, "done");
    return;
  }

  state.remoteChallengeProgress = {
    ...(state.remoteChallengeProgress || {}),
    ...legacy,
    history: legacy?.history || [],
  };

  state.soundEnabled = legacy?.soundEnabled ?? state.soundEnabled;
  state.musicVolume = clampVolume(legacy?.musicVolume, state.musicVolume);
  state.effectsVolume = clampVolume(legacy?.effectsVolume, state.effectsVolume);
  syncSoundToggle();
  syncMusicVolume();
  writeLocalJson(CHALLENGE_SAVE_KEY, legacy);
  writeLocalJson(SHARED_SETTINGS_KEY, {
    soundEnabled: state.soundEnabled,
    musicVolume: state.musicVolume,
    effectsVolume: state.effectsVolume,
  });

  await saveRemoteSettings();
  if (hasPlayableProgress(legacy)) await saveRemoteProgress(legacy);
  for (const entry of legacy?.history || []) {
    await saveHistoryEntry(entry);
  }
  localStorage.setItem(markerKey, "done");
}

function refreshStartActions() {
  const loggedIn = Boolean(state.authUser);
  const hasCareerSave = loggedIn && hasPlayableProgress(getSavedProgress("career"));
  dom.startButton.disabled = !loggedIn;
  dom.leaderboardButton.disabled = !loggedIn;
  dom.historyButton.disabled = !loggedIn;
  dom.multiButton.disabled = !loggedIn;
  dom.careerButton.disabled = !loggedIn;
  if (dom.continueButton) {
    dom.continueButton.disabled = !loggedIn;
    dom.continueButton.classList.add("hidden");
  }
  dom.startActions.classList.toggle("hidden", !loggedIn);
}

function openCareerModePreview() {
  if (!state.authUser) {
    syncAuthUi("성장 모드를 열려면 먼저 로그인해주세요.");
    return;
  }

  const hasCareerSave = hasPlayableProgress(getSavedProgress("career"));
  openModal(`
    <h2>성장 모드</h2>
    <p>제한 시간 없이 손님 주문을 이어서 받고, 코인과 평판을 쌓아 식당을 차근차근 키우는 운영형 모드입니다. 중앙 시장, 버섯 숲, 옥상 온실이 운영 일수에 따라 열립니다.</p>
    <div class="score-split">
      <span>시간 제한 없음</span>
      <span>손님 주문 무한 순환</span>
      <span>업그레이드 유지</span>
      <span>지역 이동 가능</span>
    </div>
    <article class="choice-card">
      <h3>${hasCareerSave ? "이전 운영 기록이 있습니다" : "새로운 식당 운영을 시작합니다"}</h3>
      <p>${hasCareerSave ? "이어서 운영하거나 새로 시작할 수 있습니다." : "첫 손님부터 천천히 주문을 받아 식당을 키워보세요."}</p>
      <div class="mode-actions">
        <button type="button" data-career-action="start">${hasCareerSave ? "새 운영 시작" : "성장 모드 시작"}</button>
        ${hasCareerSave ? '<button type="button" data-career-action="continue">이어서 운영하기</button>' : ""}
      </div>
    </article>
  `);

  dom.modalContent.querySelectorAll("[data-career-action]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.careerAction === "continue") {
        continueCareerGame();
      } else {
        startCareerGame();
      }
    });
  });
}

function openCareerMapModal() {
  if (state.gameMode !== "career" || !state.running || state.gameOver) return;
  if (!state.careerData) state.careerData = createCareerData({ day: state.day });
  const cards = CAREER_REGIONS.map((region) => {
    const unlocked = isCareerRegionUnlocked(region.id);
    const active = state.careerData.currentRegion === region.id;
    return `
      <article class="choice-card region-card ${active ? "active-region-card" : ""} ${unlocked ? "" : "muted-record"}">
        <h3>${region.name}${active ? " · 현재 지역" : ""}</h3>
        <p>${region.description}</p>
        <p><strong>${region.short}</strong></p>
        ${unlocked
          ? `<button type="button" data-region-travel="${region.id}" ${active ? "disabled" : ""}>${active ? "머무는 중" : "이동하기"}</button>`
          : `<p>${region.unlockDay}일차에 해금됩니다.</p>`}
      </article>
    `;
  }).join("");

  openModal(`
    <h2>성장 모드 지도</h2>
    <p>지역마다 운영 방식이 다릅니다. 식당은 조리와 판매, 시장은 흥정, 숲은 채집, 온실은 재배를 맡습니다.</p>
    <div class="grid-list">${cards}</div>
  `, { returnTo: "resume-game" });

  dom.modalContent.querySelectorAll("[data-region-travel]").forEach((button) => {
    button.addEventListener("click", () => {
      travelToCareerRegion(button.dataset.regionTravel);
    });
  });
}

function travelToCareerRegion(regionId) {
  if (!isCareerRegionUnlocked(regionId)) {
    showToast("아직 해금되지 않은 지역입니다.");
    return;
  }
  if (state.currentQuest && !state.currentQuest.completed && regionId !== "restaurant") {
    showToast("진행 중인 일을 마무리한 뒤 다른 지역으로 이동할 수 있습니다.");
    return;
  }
  if (!state.careerData) state.careerData = createCareerData({ day: state.day });
  state.careerData.currentRegion = regionId;
  player.position.set(0, 0, 0);
  player.rotation.y = 0;
  closeModal(false, true);
  applyCareerRegionState();
  updateEventVisuals();
  updateHud();
  saveProgress();
  showToast(`${getCareerRegionName(regionId)}로 이동했습니다.`);
}

function openMarketRegion() {
  if (state.gameMode !== "career") return;
  ensureCareerMarketOffer();
  const offer = state.careerData.marketOffer;
  const ingredient = INGREDIENTS.find((item) => item.id === offer.ingredientId) || INGREDIENTS[0];
  openModal(`
    <h2>중앙 시장</h2>
    <p>시장 상인과 흥정해 오늘의 추천 재료를 묶음으로 가져옵니다. 초록 구간에 맞추면 더 싸고 더 많이 얻을 수 있습니다.</p>
    <article class="choice-card">
      ${ingredientImage(ingredient)}
      <h3>오늘의 특가 · ${ingredient.name}</h3>
      <p>${formatTraits(ingredient.traits)}</p>
      <p><strong>${offer.quantity}개 묶음 기본가 ${offer.bundlePrice}코인</strong></p>
      <button type="button" data-market-start="true" ${state.coins < Math.max(6, Math.floor(offer.bundlePrice * 0.75)) ? "disabled" : ""}>흥정 시작</button>
    </article>
  `, { returnTo: "resume-game" });

  const startButton = dom.modalContent.querySelector("[data-market-start]");
  if (startButton) {
    startButton.addEventListener("click", startMarketBargainGame);
  }
}

function startMarketBargainGame() {
  ensureCareerMarketOffer();
  const offer = state.careerData.marketOffer;
  const minPossible = Math.max(6, Math.floor(offer.bundlePrice * 0.75));
  if (state.coins < minPossible) {
    showToast(`흥정을 시작하려면 최소 ${minPossible}코인이 필요합니다.`);
    return;
  }
  clearRegionActivity();
  state.regionActivity = {
    type: "market",
    position: 12,
    direction: 1,
    offer,
  };

  const render = () => {
    if (!state.regionActivity || state.regionActivity.type !== "market") return;
    dom.modalContent.innerHTML = `
      <h2>시장 흥정</h2>
      <p>움직이는 표시를 초록 구간에 맞춰 멈추세요. 더 정확할수록 더 싼 가격과 보너스 수량을 얻습니다.</p>
      <div class="bargain-track">
        <div class="bargain-zone bargain-zone-good"></div>
        <div class="bargain-zone bargain-zone-perfect"></div>
        <div id="market-pointer" class="bargain-pointer" style="left:${state.regionActivity.position}%"></div>
      </div>
      <article class="choice-card">
        <h3>${getIngredientName(offer.ingredientId)} · ${offer.quantity}개 묶음</h3>
        <p>기본가 ${offer.bundlePrice}코인</p>
        <button type="button" data-market-stop="true">지금 멈추기</button>
      </article>
    `;
    const stopButton = dom.modalContent.querySelector("[data-market-stop]");
    if (stopButton) stopButton.addEventListener("click", resolveMarketBargainGame);
  };

  const tick = () => {
    const activity = state.regionActivity;
    if (!activity || activity.type !== "market") return;
    activity.position += activity.direction * 1.8;
    if (activity.position >= 92 || activity.position <= 8) activity.direction *= -1;
    const pointerEl = dom.modalContent.querySelector("#market-pointer");
    if (pointerEl) pointerEl.style.left = `${activity.position}%`;
    activity.frameId = requestAnimationFrame(tick);
  };

  render();
  state.regionActivity.frameId = requestAnimationFrame(tick);
}

function resolveMarketBargainGame() {
  const activity = state.regionActivity;
  if (!activity || activity.type !== "market") return;
  const distance = Math.abs(activity.position - 50);
  let discountRate = 0.1;
  let bonusQuantity = 0;
  let label = "무난";
  if (distance <= 5) {
    discountRate = 0.25;
    bonusQuantity = 1;
    label = "Perfect";
  } else if (distance <= 15) {
    discountRate = 0.18;
    label = "Good";
  }
  const cost = Math.max(6, Math.round(activity.offer.bundlePrice * (1 - discountRate)));
  const intendedAmount = activity.offer.quantity + bonusQuantity;
  const availableSpace = Math.max(0, getStorageLimit() - getInventoryCount());
  const added = Math.min(availableSpace, intendedAmount);
  if (state.coins < cost || added <= 0) {
    clearRegionActivity();
    playFail();
    showToast(added <= 0 ? "냉장고가 가득 차 거래를 완료하지 못했습니다." : "코인이 부족해 거래를 완료하지 못했습니다.");
    openMarketRegion();
    return;
  }
  state.coins -= cost;
  addInventoryAmount(activity.offer.ingredientId, added);
  state.careerData.marketOffer = createMarketOffer(state.day + state.serviceStats.completedOrders + 1);
  clearRegionActivity();
  playCoin();
  updateHud();
  saveProgress();
  openModal(`
    <h2>거래 완료</h2>
    <article class="choice-card">
      <h3>${label} 흥정</h3>
      <p>${getIngredientName(activity.offer.ingredientId)} ${added}개를 ${cost}코인에 들여왔습니다.</p>
      <p>${bonusQuantity ? "보너스 수량 1개를 함께 받았습니다." : "다음 시장에서는 더 정확한 타이밍을 노려보세요."}</p>
      <button type="button" data-market-close="true">계속 보기</button>
    </article>
  `, { returnTo: "resume-game" });
  const closeButton = dom.modalContent.querySelector("[data-market-close]");
  if (closeButton) closeButton.addEventListener("click", openMarketRegion);
}

function openForestRegion() {
  if (state.gameMode !== "career") return;
  openModal(`
    <h2>버섯 숲</h2>
    <p>반짝였던 채집 포인트를 기억해서 눌러보세요. 많이 맞힐수록 무료 재료와 희귀 숲 재료를 가져옵니다.</p>
    <article class="choice-card">
      <h3>채집 준비 완료</h3>
      <p>운영 일수가 늘수록 기억해야 할 포인트가 조금씩 늘어납니다.</p>
      <button type="button" data-forest-start="true">채집 시작</button>
    </article>
  `, { returnTo: "resume-game" });
  const startButton = dom.modalContent.querySelector("[data-forest-start]");
  if (startButton) startButton.addEventListener("click", startForestForageGame);
}

function startForestForageGame() {
  clearRegionActivity();
  const targetCount = Math.min(5, 3 + Math.floor(state.day / 3));
  const positions = Array.from({ length: 9 }, (_, index) => index).sort(() => Math.random() - 0.5).slice(0, targetCount);
  state.regionActivity = {
    type: "forest",
    phase: "memorize",
    targets: positions,
    chosen: [],
    mistakes: 0,
  };
  renderForestForageGame();
  state.regionActivity.timeoutId = setTimeout(() => {
    if (!state.regionActivity || state.regionActivity.type !== "forest") return;
    state.regionActivity.phase = "guess";
    renderForestForageGame();
  }, 1400);
}

function renderForestForageGame() {
  const activity = state.regionActivity;
  if (!activity || activity.type !== "forest") return;
  const tiles = Array.from({ length: 9 }, (_, index) => {
    const revealed = activity.phase === "memorize" && activity.targets.includes(index);
    const chosen = activity.chosen.includes(index);
    return `
      <button
        type="button"
        class="forage-tile ${revealed ? "forage-tile-revealed" : ""} ${chosen ? "forage-tile-chosen" : ""}"
        data-forest-tile="${index}"
        ${activity.phase !== "guess" || chosen ? "disabled" : ""}
      >${revealed || chosen ? "✦" : "?"}</button>
    `;
  }).join("");
  dom.modalContent.innerHTML = `
    <h2>숲 채집</h2>
    <p>${activity.phase === "memorize" ? "반짝이는 포인트를 기억하세요." : `정답 ${activity.targets.length}개 중 ${activity.chosen.filter((index) => activity.targets.includes(index)).length}개 발견 · 실수 ${activity.mistakes}/2`}</p>
    <div class="forage-grid">${tiles}</div>
  `;
  dom.modalContent.querySelectorAll("[data-forest-tile]").forEach((button) => {
    button.addEventListener("click", () => chooseForestTile(Number(button.dataset.forestTile)));
  });
}

function chooseForestTile(index) {
  const activity = state.regionActivity;
  if (!activity || activity.type !== "forest" || activity.phase !== "guess") return;
  activity.chosen.push(index);
  if (!activity.targets.includes(index)) {
    activity.mistakes += 1;
    playFail();
  } else {
    playWork();
  }
  const correctCount = activity.chosen.filter((tile) => activity.targets.includes(tile)).length;
  if (correctCount >= activity.targets.length || activity.mistakes >= 2 || activity.chosen.length >= activity.targets.length + 2) {
    finishForestForageGame();
    return;
  }
  renderForestForageGame();
}

function finishForestForageGame() {
  const activity = state.regionActivity;
  if (!activity || activity.type !== "forest") return;
  const correctCount = activity.chosen.filter((tile) => activity.targets.includes(tile)).length;
  const herbAdded = addInventoryAmount("forest-herb", Math.max(1, correctCount - 1));
  const mushroomAdded = addInventoryAmount("mushroom", Math.max(1, Math.floor(correctCount / 2)));
  const berryAdded = correctCount >= activity.targets.length - 1 ? addInventoryAmount("dew-berry", 1) : 0;
  clearRegionActivity();
  playCoin();
  updateHud();
  saveProgress();
  openModal(`
    <h2>채집 완료</h2>
    <article class="choice-card">
      <h3>${correctCount}/${activity.targets.length} 포인트 발견</h3>
      <p>숲 허브 ${herbAdded}개, 버섯 ${mushroomAdded}개${berryAdded ? `, 이슬 베리 ${berryAdded}개` : ""}를 얻었습니다.</p>
      <button type="button" data-forest-close="true">한 번 더 보기</button>
    </article>
  `, { returnTo: "resume-game" });
  const closeButton = dom.modalContent.querySelector("[data-forest-close]");
  if (closeButton) closeButton.addEventListener("click", openForestRegion);
}

function openGreenhouseRegion() {
  if (state.gameMode !== "career") return;
  if (!state.careerData) state.careerData = createCareerData({ day: state.day });
  const beds = state.careerData.greenhouse.map((bed, index) => renderGreenhouseBedCard(bed, index)).join("");
  openModal(`
    <h2>옥상 온실</h2>
    <p>화분을 심고 관리해 식당에서 쓸 재료를 길러냅니다. 운영이 한 번 지날 때마다 작물이 조금씩 자랍니다.</p>
    <div class="grid-list greenhouse-grid">${beds}</div>
  `, { returnTo: "resume-game" });

  dom.modalContent.querySelectorAll("[data-greenhouse-plant]").forEach((button) => {
    button.addEventListener("click", () => {
      plantGreenhouseCrop(Number(button.dataset.greenhousePlant), button.dataset.cropId);
      openGreenhouseRegion();
    });
  });
  dom.modalContent.querySelectorAll("[data-greenhouse-manage]").forEach((button) => {
    button.addEventListener("click", () => startGreenhouseCareGame(Number(button.dataset.greenhouseManage)));
  });
  dom.modalContent.querySelectorAll("[data-greenhouse-harvest]").forEach((button) => {
    button.addEventListener("click", () => {
      harvestGreenhouseCrop(Number(button.dataset.greenhouseHarvest));
      openGreenhouseRegion();
    });
  });
}

function renderGreenhouseBedCard(bed, index) {
  if (!bed.cropId) {
    const cropButtons = GREENHOUSE_CROPS
      .filter((crop) => state.day >= crop.unlockDay)
      .map((crop) => `<button type="button" data-greenhouse-plant="${index}" data-crop-id="${crop.ingredientId}">${crop.name}</button>`)
      .join("");
    return `
      <article class="choice-card greenhouse-card">
        <h3>${index + 1}번 화분</h3>
        <p>비어 있습니다. 심을 작물을 골라보세요.</p>
        <div class="stack-buttons">${cropButtons || "<p>아직 심을 수 있는 작물이 없습니다.</p>"}</div>
      </article>
    `;
  }

  const crop = GREENHOUSE_CROPS.find((item) => item.ingredientId === bed.cropId);
  const stageLabel = bed.ready ? "수확 가능" : `${bed.stage}/2 단계`;
  return `
    <article class="choice-card greenhouse-card">
      <h3>${index + 1}번 화분 · ${crop?.name || getIngredientName(bed.cropId)}</h3>
      <p>성장 ${stageLabel} · 관리 점수 ${bed.quality}</p>
      <div class="mode-actions">
        ${bed.ready
          ? `<button type="button" data-greenhouse-harvest="${index}">수확하기</button>`
          : `<button type="button" data-greenhouse-manage="${index}">관리하기</button>`}
      </div>
    </article>
  `;
}

function plantGreenhouseCrop(index, cropId) {
  const bed = state.careerData?.greenhouse?.[index];
  if (!bed) return;
  bed.cropId = cropId;
  bed.stage = 0;
  bed.quality = 0;
  bed.ready = false;
  bed.lastManagedDay = state.day;
  playWork();
  saveProgress();
  showToast(`${getIngredientName(cropId)} 화분을 심었습니다.`);
}

function startGreenhouseCareGame(index) {
  const bed = state.careerData?.greenhouse?.[index];
  if (!bed || !bed.cropId) return;
  clearRegionActivity();
  const needs = ["물", "빛", "환기"].sort(() => Math.random() - 0.5);
  state.regionActivity = {
    type: "greenhouse",
    bedIndex: index,
    needs,
    step: 0,
    correct: 0,
  };
  renderGreenhouseCareGame();
}

function renderGreenhouseCareGame() {
  const activity = state.regionActivity;
  if (!activity || activity.type !== "greenhouse") return;
  const currentNeed = activity.needs[activity.step];
  dom.modalContent.innerHTML = `
    <h2>온실 관리</h2>
    <p>작물 상태를 보고 가장 필요한 관리를 골라주세요. ${activity.step + 1}/3 단계입니다.</p>
    <article class="choice-card">
      <h3>지금 가장 필요한 것: ${currentNeed}</h3>
      <div class="pause-grid">
        <button type="button" data-greenhouse-action="물">물 주기</button>
        <button type="button" data-greenhouse-action="빛">빛 조절</button>
        <button type="button" data-greenhouse-action="환기">환기 열기</button>
      </div>
    </article>
  `;
  dom.modalContent.querySelectorAll("[data-greenhouse-action]").forEach((button) => {
    button.addEventListener("click", () => chooseGreenhouseAction(button.dataset.greenhouseAction));
  });
}

function chooseGreenhouseAction(action) {
  const activity = state.regionActivity;
  if (!activity || activity.type !== "greenhouse") return;
  if (action === activity.needs[activity.step]) {
    activity.correct += 1;
    playWork();
  } else {
    playFail();
  }
  activity.step += 1;
  if (activity.step >= activity.needs.length) {
    finishGreenhouseCareGame();
    return;
  }
  renderGreenhouseCareGame();
}

function finishGreenhouseCareGame() {
  const activity = state.regionActivity;
  if (!activity || activity.type !== "greenhouse") return;
  const bed = state.careerData?.greenhouse?.[activity.bedIndex];
  if (!bed) return;
  bed.quality += activity.correct;
  bed.lastManagedDay = state.day;
  if (activity.correct >= 2) {
    bed.stage = Math.min(2, bed.stage + 1);
  }
  if (bed.stage >= 2) bed.ready = true;
  clearRegionActivity();
  saveProgress();
  showToast(activity.correct >= 2 ? "작물 상태가 좋아졌습니다." : "조금 더 세심한 관리가 필요합니다.");
  openGreenhouseRegion();
}

function harvestGreenhouseCrop(index) {
  const bed = state.careerData?.greenhouse?.[index];
  if (!bed?.cropId || !bed.ready) return;
  const crop = GREENHOUSE_CROPS.find((item) => item.ingredientId === bed.cropId);
  const amount = (crop?.yieldAmount || 2) + Math.min(2, Math.floor(bed.quality / 2));
  const added = addInventoryAmount(bed.cropId, amount);
  if (added <= 0) {
    playFail();
    showToast("냉장고가 가득 차 수확물을 담을 수 없습니다.");
    return;
  }
  bed.cropId = null;
  bed.stage = 0;
  bed.quality = 0;
  bed.ready = false;
  bed.lastManagedDay = state.day;
  playCoin();
  saveProgress();
  updateHud();
  showToast(`${getIngredientName(crop?.ingredientId || "")} ${added}개를 수확했습니다.`);
}

async function openChallengeLeaderboardModal() {
  openModal(`
    <h2>챌린지 랭킹</h2>
    <p>전역 챌린지 랭킹을 불러오는 중입니다...</p>
  `);

  const { entries, personal, error } = await fetchChallengeLeaderboard();
  if (!state.modalOpen) return;

  if (error) {
    dom.modalContent.innerHTML = `
      <h2>챌린지 랭킹</h2>
      <article class="choice-card">
        <h3>준비 확인 필요</h3>
        <p>${error}</p>
      </article>
    `;
    return;
  }

  const rows = entries.length
    ? entries
        .map(
          (entry, index) => `
            <div class="scoreboard-row ${entry.userId === state.authUser?.id ? "player-score-row" : ""}">
              <strong>${index + 1}등</strong>
              <span>${entry.nickname}</span>
              <b>${entry.completedOrders}개 · ${entry.challengeScore}점</b>
              <em>최고 ${entry.bestDishScore}점</em>
            </div>
          `,
        )
        .join("")
    : `<article class="choice-card"><h3>랭킹 없음</h3><p>아직 등록된 챌린지 기록이 없습니다. 제한 시간 안에 주문을 완성해 첫 기록을 남겨보세요.</p></article>`;

  const personalCard = personal
    ? `
      <article class="choice-card">
        <h3>내 최고 기록</h3>
        <p>${personal.nickname} · 완료 주문 ${personal.completedOrders}개 · 누적 ${personal.challengeScore}점</p>
        <p>최고 단일 요리 ${personal.bestDishScore}점</p>
      </article>
    `
    : `
      <article class="choice-card">
        <h3>내 최고 기록</h3>
        <p>아직 챌린지 기록이 없습니다. 제한 시간 안에 주문을 완성하면 여기에 최고 기록이 남습니다.</p>
      </article>
    `;

  dom.modalContent.innerHTML = `
    <h2>챌린지 랭킹</h2>
    <p>완료 주문 수가 많은 순으로 정렬되며, 동점이면 누적 점수와 최고 단일 요리 점수로 순위가 갈립니다.</p>
    ${personalCard}
    <div class="scoreboard-list">${rows}</div>
  `;
}

async function showChallengeLeaderboardScreen() {
  dom.challengeLbContent.innerHTML = "";
  dom.challengeLbSummary.innerHTML = "";
  dom.challengeLbScreen.classList.remove("hidden");

  const stats = state.serviceStats;
  if (stats?.completedOrders) {
    const totalScore = getChallengeRunScore();
    dom.challengeLbSummary.innerHTML = [
      `<span class="challenge-lb-stat">완료 ${stats.completedOrders}개</span>`,
      `<span class="challenge-lb-stat">누적 ${totalScore}점</span>`,
      `<span class="challenge-lb-stat">최고 ${stats.bestScore}점</span>`,
    ].join("");
  }

  const { entries, personal, error } = await fetchChallengeLeaderboard();

  if (error) {
    dom.challengeLbContent.innerHTML = `<article class="mode-card"><p>${error}</p></article>`;
    return;
  }

  const personalCard = personal ? `
    <article class="mode-card">
      <h3 style="margin:0;font-size:18px;font-weight:900;opacity:0.7">내 최고 기록</h3>
      <p>${personal.nickname} · 완료 ${personal.completedOrders}개 · 누적 ${personal.challengeScore}점 · 최고 ${personal.bestDishScore}점</p>
    </article>` : "";

  const rows = entries.length
    ? entries.map((entry, i) => `
        <div class="scoreboard-row ${entry.userId === state.authUser?.id ? "player-score-row" : ""}">
          <strong>${i + 1}등</strong>
          <span>${entry.nickname}</span>
          <b>${entry.completedOrders}개 · ${entry.challengeScore}점</b>
          <em>최고 ${entry.bestDishScore}점</em>
        </div>`).join("")
    : `<article class="mode-card"><p>아직 등록된 기록이 없습니다. 제한 시간 안에 주문을 완성해 첫 기록을 남겨보세요.</p></article>`;

  dom.challengeLbContent.innerHTML = personalCard + `<div class="scoreboard-list">${rows}</div>`;
}

function exitChallengeLeaderboardScreen() {
  dom.challengeLbScreen.classList.add("hidden");
  dom.startScreen.classList.remove("hidden");
  dom.startScreen.classList.add("screen-visible");
  refreshStartActions();
  syncAuthUi();
}

function openSkinSelector() {
  const cur = normalizeSkinId(state.selectedSkin || "default");
  const listItems = SKINS.map(s => `
    <button class="skin-list-card${s.id === cur ? " skin-card-selected" : ""}" data-skin="${s.id}" type="button">
      <span class="skin-card-dot" style="background:${s.primary}"></span>
      <span class="skin-list-name">${s.emoji} ${s.name}</span>
      ${s.id === cur ? '<span class="skin-card-check">✓</span>' : ""}
    </button>`).join("");
  openModal(`
    <h2 style="margin:0 0 12px">캐릭터 스킨</h2>
    <div class="skin-selector-wrap">
      <div class="skin-preview-pane">
        <canvas id="skin-preview-canvas" style="width:200px;height:300px;display:block"></canvas>
      </div>
      <div class="skin-list-pane">${listItems}</div>
    </div>
    <p style="margin:10px 0 0;opacity:.5;font-size:12px;text-align:center">스킨을 선택하면 바로 적용됩니다.</p>
  `);

  // mini Three.js preview renderer
  const canvas = document.getElementById("skin-preview-canvas");
  const pvRenderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  pvRenderer.setClearColor(0x000000, 0);
  const pvPxRatio = Math.min(devicePixelRatio, 2);
  pvRenderer.setPixelRatio(pvPxRatio);
  pvRenderer.setSize(200, 300, false); // false = CSS 건드리지 않음
  canvas.style.width = "200px";
  canvas.style.height = "300px";

  const pvScene = new THREE.Scene();
  const pvCamera = new THREE.PerspectiveCamera(42, 200 / 300, 0.1, 50);
  pvCamera.position.set(0, 1.15, 4.0);
  pvCamera.lookAt(0, 1.0, 0);

  pvScene.add(new THREE.AmbientLight(0xffffff, 0.75));
  const pvDir = new THREE.DirectionalLight(0xffffff, 1.0);
  pvDir.position.set(2, 4, 3);
  pvScene.add(pvDir);
  const pvFill = new THREE.DirectionalLight(0xaaccff, 0.3);
  pvFill.position.set(-2, 1, -2);
  pvScene.add(pvFill);

  let pvMesh = null;

  function loadPvSkin(skinId) {
    if (pvMesh) pvScene.remove(pvMesh);
    const savedCarry = playerCarryMesh;
    pvMesh = buildSkinMesh(skinId);
    playerCarryMesh = savedCarry;
    pvMesh.position.set(0, -0.1, 0);
    pvScene.add(pvMesh);
  }

  loadPvSkin(cur);

  skinPreview = { raf: null, renderer: pvRenderer, scene: pvScene, camera: pvCamera, mesh: null };
  function animatePv() {
    skinPreview.raf = requestAnimationFrame(animatePv);
    if (pvMesh) pvMesh.rotation.y += 0.014;
    pvRenderer.render(pvScene, pvCamera);
  }
  animatePv();

  dom.modalContent.querySelectorAll("[data-skin]").forEach(btn => {
    btn.addEventListener("mouseenter", () => loadPvSkin(btn.dataset.skin));
    btn.addEventListener("click", () => {
      const id = normalizeSkinId(btn.dataset.skin);
      state.selectedSkin = id;
      localStorage.setItem(SKIN_SAVE_KEY, id);
      closeModal();
      rebuildPlayer();
      showToast(`${SKINS.find(s => s.id === id)?.name || id} 선택!`);
    });
  });
}

function openHistoryModal() {
  const saved = getSavedProgress("challenge");
  const history = state.history?.length ? state.history : saved?.history || [];
  const rows = history.length
    ? history
        .slice(-8)
        .reverse()
        .map(
          (run) => `
            <div class="scoreboard-row history-row">
              <strong>${run.day}회차</strong>
              <span>${run.event}</span>
              <b>${run.completed}개 · ${Math.max(0, (run.dishes?.reduce((total, dish) => total + (dish.score || 0), 0) || 0) - (run.penaltyScore || 0))}점</b>
              <em>최고 ${run.bestScore}점</em>
            </div>
          `,
        )
        .join("")
    : `<article class="choice-card"><h3>기록 없음</h3><p>챌린지를 마치면 이곳에 최근 도전 기록이 남습니다.</p></article>`;

  openModal(`
    <h2>도전 기록</h2>
    <p>최근 챌린지의 주문 수, 누적 점수, 최고 접시 기록을 확인합니다.</p>
    <div class="scoreboard-list">${rows}</div>
  `);
}

function openPauseMenu() {
  if (!state.running || state.gameOver || state.minigame?.active) return;
  state.paused = true;
  dom.interactionPrompt.classList.add("hidden");

  const exitLabel = state.tutorialMode ? "튜토리얼 종료" : "저장하고 나가기";
  openModal(`
    <h2>일시정지</h2>
    <p>영업을 잠시 멈췄습니다. 설정을 조정하거나 시작 화면으로 나갈 수 있습니다.</p>
    <div class="pause-grid">
      <button type="button" data-pause-action="resume">계속하기</button>
      <button type="button" data-pause-action="save-exit">${exitLabel}</button>
      <button type="button" data-pause-action="toggle-sound">${state.soundEnabled ? "소리 끄기" : "소리 켜기"}</button>
      <button type="button" data-pause-action="help">조작법 보기</button>
    </div>
    <div class="admin-grid pause-settings">
      <label class="admin-field pause-field">
        <span>배경음 볼륨 <strong id="pause-music-volume">${formatVolumePercent(state.musicVolume)}</strong></span>
        <input type="range" min="0" max="100" value="${Math.round(state.musicVolume * 100)}" data-volume-slider="music" />
      </label>
      <label class="admin-field pause-field">
        <span>효과음 볼륨 <strong id="pause-effects-volume">${formatVolumePercent(state.effectsVolume)}</strong></span>
        <input type="range" min="0" max="100" value="${Math.round(state.effectsVolume * 100)}" data-volume-slider="effects" />
      </label>
    </div>
    <article class="choice-card pause-summary-card">
      <h3>현재 목표</h3>
      <p>${getObjectiveSummary()}</p>
    </article>
  `, { returnTo: "resume-game", stopMusic: true });
  bindPauseMenuEvents();
}

function bindPauseMenuEvents() {
  dom.modalContent.querySelectorAll("[data-pause-action]").forEach((button) => {
    button.addEventListener("click", () => handlePauseMenuAction(button.dataset.pauseAction));
  });

  dom.modalContent.querySelectorAll("[data-volume-slider]").forEach((input) => {
    input.addEventListener("input", () => updateVolumeSetting(input.dataset.volumeSlider, Number(input.value)));
    input.addEventListener("change", () => {
      if (input.dataset.volumeSlider === "effects" && state.soundEnabled) playClick();
    });
  });
}

function handlePauseMenuAction(action) {
  if (action === "resume") {
    resumeFromPauseMenu();
    return;
  }

  if (action === "save-exit") {
    // 고스트 대결 도중이면 일반 저장·종료 대신 leavePvpRoom()으로 보낸다 —
    // 재생 타이머·상대 메시·상대 HUD까지 정리해야 해서 saveAndExitToStartScreen()
    // 하나로는 부족하다(그 함수는 pvpRoom을 모른다).
    if (state.pvpRoom) {
      void leavePvpRoom();
    } else {
      saveAndExitToStartScreen();
    }
    return;
  }

  if (action === "toggle-sound") {
    toggleSound();
    openPauseMenu();
    return;
  }

  if (action === "help") {
    openPauseHelp();
  }
}

function openPauseHelp() {
  openModal(`
    <h2>조작법</h2>
    <p>잠시 쉬는 동안 기본 조작과 영업 흐름을 다시 확인할 수 있습니다.</p>
    <div class="grid-list">
      <article class="choice-card">
        <h3>이동</h3>
        <p><strong>WASD</strong>로 이동하고 <strong>Shift</strong>로 빠르게 달립니다.</p>
      </article>
      <article class="choice-card">
        <h3>시점</h3>
        <p><strong>← →</strong>로 카메라를 돌리고 <strong>↑ ↓</strong>로 내려다보는 각도를 조절합니다. 이동 방향은 돌린 화면을 기준으로 맞춰집니다.</p>
      </article>
      <article class="choice-card">
        <h3>상호작용</h3>
        <p><strong>E</strong> 또는 <strong>Enter</strong>로 게시판, 상점, 조리대, 평가 테이블을 사용합니다.</p>
      </article>
      <article class="choice-card">
        <h3>레시피 노트</h3>
        <p><strong>Tab</strong>으로 현재 주문 레시피, 목표 점수, 손님 취향을 다시 확인할 수 있습니다.</p>
      </article>
      <article class="choice-card">
        <h3>영업 흐름</h3>
        <p>일 게시판에서 코인을 벌고 재료를 산 뒤, 조리대에서 요리하고 평가 테이블에서 점수를 받으면 됩니다.</p>
      </article>
    </div>
  `, { returnTo: "pause-menu" });
}

function updateVolumeSetting(type, rawValue) {
  const nextValue = clampVolume(rawValue / 100, type === "music" ? DEFAULT_MUSIC_VOLUME : DEFAULT_EFFECTS_VOLUME);
  if (type === "music") {
    state.musicVolume = nextValue;
    const output = dom.modalContent.querySelector("#pause-music-volume");
    if (output) output.textContent = formatVolumePercent(nextValue);
    syncMusicVolume();
  } else {
    state.effectsVolume = nextValue;
    const output = dom.modalContent.querySelector("#pause-effects-volume");
    if (output) output.textContent = formatVolumePercent(nextValue);
  }
  persistSettings();
}

function resumeFromPauseMenu() {
  state.paused = false;
  closeModal(false, true);
  playClick();
}

function saveAndExitToStartScreen() {
  if (state.tutorialMode) {
    endTutorialMode("튜토리얼을 종료했습니다.");
    return;
  }

  saveProgress();
  state.running = false;
  state.gameOver = false;
  state.paused = false;
  state.modalOpen = false;
  state.modalStopsMusic = false;
  state.modalReturn = null;
  stopMusic();
  closeModal(false, true);
  dom.hud.classList.add("hidden");
  dom.questTracker.classList.add("hidden");
  dom.inventoryBar.classList.add("hidden");
  dom.interactionPrompt.classList.add("hidden");
  dom.tutorialGuide.classList.add("hidden");
  dom.resultScreen.classList.add("hidden");
  dom.startScreen.classList.remove("hidden");
  dom.startScreen.classList.add("screen-visible");
  refreshStartActions();
  showToast("진행 상황을 저장하고 시작 화면으로 돌아갔습니다.");
}

function updateTutorialGuide() {
  if (!state.tutorialMode || !player) return;
  if (!state.tutorialStartPosition) state.tutorialStartPosition = player.position.clone();

  if (state.tutorialStep === 0 && player.position.distanceTo(state.tutorialStartPosition) > 1.1) {
    setTutorialStep(1);
  }

  if (state.tutorialStep === 1 && state.currentQuest) {
    setTutorialStep(2);
  }

  if (state.tutorialStep === 2 && !state.currentQuest && state.coins >= 50) {
    setTutorialStep(3);
  }

  if (state.tutorialStep === 3 && getInventoryCount() >= 3) {
    setTutorialStep(4);
  }

  if (state.tutorialStep === 4 && state.pendingDish) {
    setTutorialStep(5);
  }

  if (state.tutorialStep === 5 && state.lastJudgement) {
    setTutorialStep(6);
  }

  renderTutorialGuide();
}

function setTutorialStep(step) {
  state.tutorialStep = Math.max(state.tutorialStep, step);
  state.tutorialLastRenderedStep = -1;
}

function renderTutorialGuide(force = false) {
  if (!state.tutorialMode) return;
  if (!force && state.tutorialLastRenderedStep === state.tutorialStep) return;

  const step = getTutorialStepContent();
  dom.tutorialStepLabel.textContent = `튜토리얼 ${Math.min(state.tutorialStep + 1, 7)}/7`;
  dom.tutorialTitle.textContent = step.title;
  dom.tutorialCopy.innerHTML = step.copy;
  dom.tutorialExit.textContent = step.done ? "시작 화면으로" : "튜토리얼 종료";
  dom.tutorialGuide.classList.remove("hidden");
  state.tutorialLastRenderedStep = state.tutorialStep;
}

function getTutorialStepContent() {
  const recipe = getTargetRecipe();
  const suggestion = getTutorialIngredientSuggestion(recipe);

  if (state.tutorialStep === 0) {
    return {
      title: "먼저 움직여보기",
      copy: "<strong>WASD</strong>로 햄스터를 움직여보세요. <strong>Shift</strong>를 누르면 더 빠르게 달립니다. <strong>방향키</strong>로는 카메라를 돌려 볼 수 있습니다.",
    };
  }

  if (state.tutorialStep === 1) {
    return {
      title: "일 게시판에서 코인 벌기",
      copy: "왼쪽 뒤편의 <strong>일 게시판</strong>으로 가서 <strong>E</strong> 또는 <strong>Enter</strong>를 누르세요. 처음에는 <strong>반짝 접시 정리</strong>나 <strong>주문표 전달</strong>처럼 간단한 일을 골라보세요.",
    };
  }

  if (state.tutorialStep === 2) {
    return {
      title: `${state.currentQuest?.name || "일"} 진행하기`,
      copy: getTutorialQuestCopy(),
    };
  }

  if (state.tutorialStep === 3) {
    return {
      title: "재료 상점에서 장보기",
      copy: `오른쪽 뒤편의 <strong>재료 상점</strong>에서 목표 요리 재료를 사세요. 이번 목표는 <strong>${recipe.name}</strong>이고 추천 조합은 <strong>${suggestion}</strong>입니다.`,
    };
  }

  if (state.tutorialStep === 4) {
    return {
      title: "조리대에서 요리하기",
      copy: `중앙 오른쪽의 <strong>조리대</strong>로 가서 재료 3개를 넣고 요리하세요.<br>
미니게임 종류에 따라 조작이 달라집니다:
<ul style="margin:6px 0 0 16px;padding:0;font-size:0.92em;line-height:1.7">
  <li><strong>타이밍</strong> — 게이지가 구간에 들어올 때 Space / 클릭</li>
  <li><strong>온도 조절</strong> — 불 키우기·줄이기 버튼으로 60~80°C 유지</li>
  <li><strong>재료 썰기</strong> — 칼이 초록 구간에 왔을 때 Space / 썰기 버튼</li>
  <li><strong>물 끓이기</strong> — 불 조절 버튼으로 적정 온도 구간 유지</li>
  <li><strong>반죽 치기</strong> — 제한시간 안에 버튼을 최대한 많이 눌러요</li>
  <li><strong>플레이팅</strong> — 떨어지는 재료를 접시 구역에서 클릭으로 받아요</li>
</ul>`,
    };
  }

  if (state.tutorialStep === 5) {
    return {
      title: "평가 테이블로 가져가기",
      copy: "아래쪽의 <strong>평가 테이블</strong>로 가서 완성한 요리를 제출하세요. 재료 점수와 미니게임 점수가 합쳐져 최종 점수가 나옵니다.",
    };
  }

  return {
    title: "튜토리얼 완료",
    copy: "좋아요. 코인 벌기, 재료 구매, 요리, 평가까지 한 번 돌아봤습니다. 이제 일반 새 게임에서 영업을 이어갈 준비가 됐습니다.",
    done: true,
  };
}

function getTutorialQuestCopy() {
  const quest = state.currentQuest;
  if (!quest) return "일을 완료하면 재료를 살 코인이 충분해집니다.";
  if (quest.id === "dishwash") {
    return "왼쪽의 <strong>싱크대</strong>로 가세요. 더러운 접시를 중앙으로 드래그하고, 수세미로 문질러 깨끗하게 만든 뒤 오른쪽 칸에 놓으면 됩니다.";
  }
  if (quest.id === "errand") {
    return "왼쪽 중앙의 <strong>주방 카운터</strong>로 가세요. 주문표의 테이블 번호, 요리 이름, 요청 문구를 외운 뒤 같은 주문표를 고르면 됩니다.";
  }
  if (quest.id === "stock") {
    return "바닥의 <strong>재료 상자</strong>를 찾아 들고, 오른쪽의 <strong>재료 선반</strong>에 올려두세요. 상자 3개를 정리하면 완료됩니다.";
  }
  if (quest.id === "sort") {
    return "오른쪽의 <strong>재료 선반</strong>으로 가서 <strong>E</strong>를 누르세요. 컨베이어 벨트에 올라오는 재료를 보고, 정상이면 <strong>통과(F)</strong>, 상한 재료(💨 표시)면 <strong>불량(G)</strong>을 눌러 선별하세요. 틀리면 목숨이 줄어드니 집중하세요!";
  }
  if (quest.id === "water") {
    return "오른쪽 앞쪽의 <strong>화분</strong>으로 가서 <strong>E</strong>를 누르세요. 화분을 선택한 뒤 <strong>물 따르기 💧</strong> 버튼을 눌러 물을 주세요. 물이 <strong>넘치거나 완전히 마르지</strong> 않도록 4개 화분을 모두 관리하면 됩니다.";
  }
  return "화면 왼쪽 아래 현재 일 안내를 보면서 일을 완료해보세요.";
}

function getTutorialIngredientSuggestion(recipe) {
  if (recipe.id === "forest-mushroom") return "밤송이 버섯 + 도토리 치즈 + 초록 허브";
  if (recipe.id === "carrot-cream") return "꼬마 당근 + 꼬마 당근 + 구름 크림";
  return "도토리 치즈 + 구름 크림 + 초록 허브";
}

function openAdminPanel() {
  if (!state.adminEnabled) {
    showToast("관리자모드 조건이 맞지 않습니다.");
    return;
  }

  const eventOptions = DAILY_EVENTS.map(
    (event) => `<option value="${event.name}" ${state.dailyEvent?.name === event.name ? "selected" : ""}>${event.name}</option>`,
  ).join("");
  const recipeOptions = getUnlockedRecipes()
    .map(
      (recipe) => `<option value="${recipe.id}" ${getTargetRecipe().id === recipe.id ? "selected" : ""}>${recipe.name}</option>`,
    )
    .join("");
  const upgradeRows = UPGRADES.map(
    (upgrade) => `
      <label class="admin-field">
        <span>${upgrade.name}</span>
        <input type="number" min="0" max="3" value="${getUpgradeLevel(upgrade.id)}" data-admin-upgrade="${upgrade.id}" />
      </label>
    `,
  ).join("");

  openModal(`
    <h2>관리자모드</h2>
    <p>테스트용 패널입니다. URL에 ?admin=${ADMIN_CODE}를 붙이거나 Ctrl+Shift+A로 열 수 있습니다.</p>
    <div class="admin-grid">
      <label class="admin-field">
        <span>코인</span>
        <input type="number" id="admin-coins" value="${state.coins}" />
      </label>
      <label class="admin-field">
        <span>평판</span>
        <input type="number" id="admin-reputation" value="${state.reputation}" />
      </label>
      <label class="admin-field">
        <span>남은 시간(초)</span>
        <input type="number" id="admin-time" value="${Math.round(state.timeLeft)}" />
      </label>
      <label class="admin-field">
        <span>주문 번호</span>
        <input type="number" id="admin-order-index" min="1" max="${Math.max(1, state.orderQueue.length)}" value="${Math.min(state.orderIndex + 1, Math.max(1, state.orderQueue.length))}" />
      </label>
      <label class="admin-field">
        <span>현재 이벤트</span>
        <select id="admin-event">${eventOptions}</select>
      </label>
      <label class="admin-field">
        <span>현재 레시피</span>
        <select id="admin-recipe">${recipeOptions}</select>
      </label>
    </div>
    <article class="choice-card">
      <h3>업그레이드 단계</h3>
      <div class="admin-grid">${upgradeRows}</div>
    </article>
    <div class="admin-actions">
      <button type="button" data-admin-action="apply">적용</button>
      <button type="button" data-admin-action="fill-ingredients">재료 채우기</button>
      <button type="button" data-admin-action="pass-dish">현재 주문 95점 요리 생성</button>
      <button type="button" data-admin-action="complete-day">오늘 영업 즉시 정산</button>
      <button type="button" data-admin-action="clear-save">저장 초기화</button>
      <button type="button" data-admin-action="toggle-ghost-recording">
        🎬 고스트 녹화: ${state.adminGhostRecording ? "ON (다음 솔로 챌린지부터)" : "OFF"}
      </button>
    </div>
  `);

  dom.modalContent.querySelectorAll("[data-admin-action]").forEach((button) => {
    button.addEventListener("click", () => handleAdminAction(button.dataset.adminAction));
  });
}

function handleAdminAction(action) {
  if (action === "apply") {
    applyAdminValues();
    showToast("관리자 값이 적용되었습니다.");
    openAdminPanel();
    return;
  }

  if (action === "fill-ingredients") {
    for (const ingredient of getUnlockedIngredients()) {
      state.inventory[ingredient.id] = Math.max(state.inventory[ingredient.id] || 0, 5);
    }
    updateHud();
    saveProgress();
    showToast("해금된 재료를 5개씩 채웠습니다.");
    openAdminPanel();
    return;
  }

  if (action === "pass-dish") {
    createAdminPassingDish();
    updateHud();
    saveProgress();
    showToast("평가 테이블에서 제출할 95점 요리를 만들었습니다.");
    closeModal(false, true);
    return;
  }

  if (action === "complete-day") {
    finishGame(true, makeServiceSummary(true, "관리자 정산"));
    return;
  }

  if (action === "clear-save") {
    localStorage.removeItem(LEGACY_SAVE_KEY);
    localStorage.removeItem(CHALLENGE_SAVE_KEY);
    localStorage.removeItem(CAREER_SAVE_KEY);
    state.history = [];
    if (state.authUser) void clearRemoteData();
    refreshStartActions();
    showToast("저장 데이터를 초기화했습니다.");
    openAdminPanel();
    return;
  }

  if (action === "toggle-ghost-recording") {
    state.adminGhostRecording = !state.adminGhostRecording;
    showToast(
      state.adminGhostRecording
        ? "고스트 녹화 ON — 다음 솔로 챌린지 시작부터 기록합니다."
        : "고스트 녹화 OFF.",
    );
    openAdminPanel();
  }
}

function applyAdminValues() {
  state.coins = Math.max(0, Number(dom.modalContent.querySelector("#admin-coins")?.value || state.coins));
  state.reputation = Math.max(0, Number(dom.modalContent.querySelector("#admin-reputation")?.value || state.reputation));
  state.timeLeft = Math.max(1, Number(dom.modalContent.querySelector("#admin-time")?.value || state.timeLeft));
  state.orderIndex = THREE.MathUtils.clamp(
    Number(dom.modalContent.querySelector("#admin-order-index")?.value || 1) - 1,
    0,
    Math.max(0, state.orderQueue.length - 1),
  );

  const eventName = dom.modalContent.querySelector("#admin-event")?.value;
  state.dailyEvent = DAILY_EVENTS.find((event) => event.name === eventName) || state.dailyEvent || pickDailyEvent();
  const recipeId = dom.modalContent.querySelector("#admin-recipe")?.value;
  const recipe = RECIPES.find((item) => item.id === recipeId);
  if (recipe && state.orderQueue[state.orderIndex]) {
    state.orderQueue[state.orderIndex].recipe = recipe;
    state.orderQueue[state.orderIndex].requiredScore = applyDailyRequiredScore(recipe, ORDER_SCORE_STEPS[state.orderIndex] || REQUIRED_SCORE);
    state.targetRecipe = recipe;
  }

  dom.modalContent.querySelectorAll("[data-admin-upgrade]").forEach((input) => {
    state.upgrades[input.dataset.adminUpgrade] = THREE.MathUtils.clamp(Number(input.value || 0), 0, 3);
  });
  updateEventVisuals();
  updateHelperVisibility();
  updateHud();
  saveProgress();
}

function createAdminPassingDish() {
  const order = getCurrentOrder();
  state.pendingDish = {
    name: order.recipe.name,
    recipe: order.recipe,
    requiredScore: order.requiredScore,
    orderNumber: state.orderIndex + 1,
    ingredients: getUnlockedIngredients().slice(0, 3),
    traits: { ...order.recipe.needs },
    materialScore: 95,
    miniGameScore: 95,
    preferenceScore: 0,
    upgradeScore: getUpgradeLevel("tools") * 4,
    timingResults: [{ label: "Admin" }],
    score: 95,
  };
}

// ── 고스트 리플레이 녹화 (관리자 전용) ──────────────────────
// PLAN.md E 항목: 실제 PvP 판이 아니라 솔로 챌린지 플레이를 녹화해 정적 JSON으로
// 내보낸다. 재생기는 이 파일의 positions/orders를 opponentTargetX/Z/RY와
// state.pvpOpponent에 직접 흘려넣는다(가짜 Realtime 채널 없이).
const GHOST_SAMPLE_INTERVAL_MS = 250;
let ghostSampleTimer = 0;

function startGhostRecording() {
  state.ghostRecorder = { startedAt: performance.now(), positions: [], orders: [] };
  ghostSampleTimer = 0;
}

function recordGhostFrame(dt) {
  const rec = state.ghostRecorder;
  if (!rec || !player) return;
  ghostSampleTimer += dt * 1000;
  if (ghostSampleTimer < GHOST_SAMPLE_INTERVAL_MS) return;
  ghostSampleTimer = 0;
  const t = Math.round(performance.now() - rec.startedAt);
  // [t, x, z, ry] — 객체 대신 배열로 저장해 JSON 용량을 줄인다.
  rec.positions.push([
    t,
    Math.round(player.position.x * 100) / 100,
    Math.round(player.position.z * 100) / 100,
    Math.round(player.rotation.y * 1000) / 1000,
  ]);
}

function recordGhostOrderSnapshot() {
  const rec = state.ghostRecorder;
  if (!rec) return;
  rec.orders.push({
    t: Math.round(performance.now() - rec.startedAt),
    orders: state.serviceStats?.completedOrders || 0,
    score: getChallengeRunScore(),
  });
}

// 녹화를 JSON 파일로 다운로드한다. 파일명을 assets/ghosts/<난이도>.json으로
// 바꿔 저장소에 커밋하면 그대로 고스트 프로필의 recording으로 쓸 수 있다.
function exportGhostRecording() {
  const rec = state.ghostRecorder;
  state.ghostRecorder = null;
  state.adminGhostRecording = false;
  if (!rec || rec.positions.length === 0) return;

  const payload = {
    recordedAt: new Date().toISOString(),
    durationMs: rec.positions.at(-1)?.[0] || 0,
    positions: rec.positions,
    orders: rec.orders,
  };
  const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `ghost-recording-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(`고스트 녹화 저장 완료 (${rec.positions.length}개 위치, ${rec.orders.length}개 주문). 다운로드된 파일을 assets/ghosts/에 커밋하세요.`);
}

async function startGame() {
  if (!state.authUser) {
    syncAuthUi("새 게임을 시작하려면 먼저 회원가입 또는 로그인이 필요합니다.");
    return;
  }
  state.gameMode = "challenge";
  const existingHistory = [...(state.history || [])].slice(-20);
  try {
    localStorage.removeItem(LEGACY_SAVE_KEY);
    localStorage.removeItem(CHALLENGE_SAVE_KEY);
    await clearRemotePlayableProgress();
  } catch (error) {
    console.error(error);
    showToast("기존 저장 정리에 실패했지만 새 게임을 시작합니다.");
  }
  state.tutorialMode = false;
  dom.tutorialGuide.classList.add("hidden");
  state.running = false;
  state.gameOver = false;
  state.paused = false;
  state.modalOpen = false;
  state.modalStopsMusic = false;
  state.modalReturn = null;
  state.remoteChallengeProgress = {
    day: (existingHistory.at(-1)?.day || 0) + 1,
    coins: 12,
    inventory: {},
    recipeRecords: {},
    reputation: 0,
    upgrades: {},
    history: existingHistory,
    activeDay: null,
  };
  state.coins = 12;
  state.timeLeft = GAME_SECONDS;
  state.inventory = {};
  state.selectedIngredients = [];
  state.recipeRecords = {};
  state.reputation = 0;
  state.upgrades = {};
  state.careerStats = null;
  state.history = existingHistory;
  state.savedActiveDay = null;
  state.dailyEvent = null;
  state.orderQueue = [];
  state.orderIndex = 0;
  state.serviceStats = null;
  state.currentQuest = null;
  state.lastChallengeQuestId = null;
  state.pendingDish = null;
  state.lastJudgement = null;
  state.minigame = null;
  state.scoreboardConclusion = null;
  state.day = (existingHistory.at(-1)?.day || 0) + 1;
  clearOrderChallengeTimer();
  state.orderTimer = null;
  player.position.set(0, 0, 0);
  player.rotation.y = 0;
  clearCrates();
  playerCarryMesh.visible = false;
  dom.resultScreen.classList.add("hidden");
  dom.challengeLbScreen.classList.add("hidden");
  resetServiceDay();
  resetMusicPlayback();
  startRunningDay();
  // PvP 매치는 startChallengeGamePvp()가 이 함수를 내부적으로 호출한다 — 그때는
  // 호출 시점에 state.pvpRoom이 이미 채워져 있으므로 솔로 실행과 구분할 수 있다.
  // 고스트는 솔로 판을 녹화한 것이므로 PvP 매치 중엔 녹화를 시작하지 않는다.
  const recordingNow = state.adminGhostRecording && !state.pvpRoom;
  if (recordingNow) startGhostRecording();
  showToast(
    `${recordingNow ? "🎬 고스트 녹화 중 · " : ""}챌린지 시작: ${getTargetRecipe().name} · ${getCustomerPreference().name} · 게시판에서 첫 일을 받으세요.`,
  );
}

function startCareerGame() {
  closeModal(false, true);
  state.gameMode = "career";
  state.tutorialMode = false;
  dom.tutorialGuide.classList.add("hidden");
  state.running = false;
  state.gameOver = false;
  state.paused = false;
  state.modalOpen = false;
  state.modalStopsMusic = false;
  state.modalReturn = null;
  state.remoteCareerProgress = {
    day: 0,
    coins: 35,
    inventory: {},
    recipeRecords: {},
    reputation: 0,
    upgrades: {},
    careerData: createCareerData({ day: 0 }),
    activeDay: null,
  };
  state.coins = 35;
  state.timeLeft = GAME_SECONDS;
  state.inventory = {};
  state.selectedIngredients = [];
  state.recipeRecords = {};
  state.reputation = 0;
  state.upgrades = {};
  state.careerStats = createCareerStats();
  state.careerData = createCareerData({ day: 0 });
  state.savedActiveDay = null;
  state.dailyEvent = null;
  state.orderQueue = [];
  state.orderIndex = 0;
  state.serviceStats = {
    completedOrders: 0,
    failedJudgements: 0,
    bestScore: 0,
    coinsEarned: 0,
    reputationEarned: 0,
    dishes: [],
    penaltyScore: 0,
  };
  state.currentQuest = null;
  state.pendingDish = null;
  state.lastJudgement = null;
  state.minigame = null;
  state.scoreboardConclusion = null;
  state.day = 0;
  clearOrderChallengeTimer();
  state.orderTimer = null;
  player.position.set(0, 0, 0);
  player.rotation.y = 0;
  clearCrates();
  playerCarryMesh.visible = false;
  dom.resultScreen.classList.add("hidden");
  resetServiceDay();
  resetMusicPlayback();
  startRunningDay();
  showToast(`${state.day}일차 운영 시작: ${getTargetRecipe().name}`);
}

function continueCareerGame() {
  if (!state.authUser) {
    syncAuthUi("성장 모드를 이어하려면 로그인해주세요.");
    return;
  }
  closeModal(false, true);
  state.gameMode = "career";
  state.tutorialMode = false;
  if (!loadCareerProgress()) {
    showToast("이어서 운영할 성장 모드 기록이 없습니다.");
    closeModal();
    return;
  }
  if (!state.careerData) state.careerData = createCareerData({ day: state.day });
  if (!restoreCareerProgress()) resetServiceDay();
  startRunningDay();
  showToast(`${state.day}일차 운영 재개: ${getTargetRecipe().name}`);
}

function startTutorialGame() {
  // 튜토리얼 시작 기록 — 신규 계정 자동 시작 중복 방지
  if (state.authUser) {
    localStorage.setItem(`hamster_tutorial_seen_${state.authUser.id}`, "1");
  }
  state.gameMode = "tutorial";
  state.tutorialMode = true;
  state.tutorialStep = 0;
  state.tutorialLastRenderedStep = -1;
  state.tutorialStartPosition = null;
  state.coins = 35;
  state.inventory = {};
  state.recipeRecords = {};
  state.reputation = 0;
  state.upgrades = {};
  state.history = [];
  state.savedActiveDay = null;
  state.day = 1;
  state.timeLeft = GAME_SECONDS;
  state.selectedIngredients = [];
  state.currentQuest = null;
  state.pendingDish = null;
  state.lastJudgement = null;
  state.minigame = null;
  state.scoreboardConclusion = null;
  clearOrderChallengeTimer();
  clearCrates();
  player.position.set(0, 0, 0);
  player.rotation.y = 0;
  playerCarryMesh.visible = false;
  setupTutorialOrder();
  resetMusicPlayback();
  startRunningDay();
  renderTutorialGuide(true);
  showToast("튜토리얼 플레이를 시작합니다.");
}

function setupTutorialOrder() {
  const recipe = RECIPES[0];
  state.dailyEvent = DAILY_EVENTS[0];
  state.orderIndex = 0;
  state.orderQueue = [
    {
      recipe,
      requiredScore: 70,
      customer: CUSTOMER_PREFERENCES.find((preference) => preference.name === "부드러운 맛 선호") || CUSTOMER_PREFERENCES[0],
    },
  ];
  state.targetRecipe = recipe;
  state.serviceStats = {
    completedOrders: 0,
    failedJudgements: 0,
    bestScore: 0,
    coinsEarned: 0,
    reputationEarned: 0,
    dishes: [],
    penaltyScore: 0,
  };
}

function endTutorialMode(message) {
  if (state.minigame?.frameId) cancelAnimationFrame(state.minigame.frameId);
  clearOrderChallengeTimer();
  clearCrates();
  state.tutorialMode = false;
  state.tutorialStep = 0;
  state.tutorialLastRenderedStep = -1;
  state.tutorialStartPosition = null;
  state.running = false;
  state.gameOver = false;
  state.paused = false;
  state.modalOpen = false;
  state.modalStopsMusic = false;
  state.modalReturn = null;
  state.coins = 12;
  state.timeLeft = GAME_SECONDS;
  state.inventory = {};
  state.selectedIngredients = [];
  state.recipeRecords = {};
  state.reputation = 0;
  state.upgrades = {};
  state.careerStats = null;
  state.history = [];
  state.savedActiveDay = null;
  state.dailyEvent = null;
  state.orderQueue = [];
  state.orderIndex = 0;
  state.serviceStats = null;
  state.currentQuest = null;
  state.pendingDish = null;
  state.lastJudgement = null;
  state.minigame = null;
  state.scoreboardConclusion = null;
  playerCarryMesh.visible = false;
  stopMusic();
  closeModal(false, true);
  dom.hud.classList.add("hidden");
  dom.questTracker.classList.add("hidden");
  dom.inventoryBar.classList.add("hidden");
  dom.interactionPrompt.classList.add("hidden");
  dom.tutorialGuide.classList.add("hidden");
  dom.resultScreen.classList.add("hidden");
  dom.startScreen.classList.remove("hidden");
  dom.startScreen.classList.add("screen-visible");
  loadProgress();
  refreshStartActions();
  updateHud();
  if (message) showToast(message);
}

function continueGame() {
  if (!state.authUser) {
    syncAuthUi("이어하기를 사용하려면 로그인해주세요.");
    return;
  }
  state.gameMode = "challenge";
  state.tutorialMode = false;
  if (!loadProgress()) {
    showToast("이어할 기록이 없습니다.");
    return;
  }
  if (!restoreActiveDay()) resetServiceDay();
  startRunningDay();
  showToast(`챌린지 이어하기: ${getTargetRecipe().name} · ${getCustomerPreference().name}`);
}

function restoreActiveDay() {
  const active = state.savedActiveDay;
  if (!active?.orderQueue?.length) return false;
  state.day = active.day || state.day || 1;
  // 제한 시간을 줄이기 전에 저장된 판은 남은 시간이 GAME_SECONDS보다 클 수 있다.
  state.timeLeft = Math.min(active.timeLeft || GAME_SECONDS, GAME_SECONDS);
  state.orderIndex = active.orderIndex || 0;
  state.dailyEvent = DAILY_EVENTS.find((event) => event.name === active.dailyEvent) || pickDailyEvent();
  state.orderQueue = active.orderQueue
    .map((order) => ({
      recipe: RECIPES.find((recipe) => recipe.id === order.recipeId) || RECIPES[0],
      requiredScore: order.requiredScore || REQUIRED_SCORE,
      customer: CUSTOMER_PREFERENCES.find((preference) => preference.name === order.customer) || pickCustomerPreference(),
    }))
    .filter((order) => order.recipe);
  state.targetRecipe = getCurrentOrder().recipe;
  state.serviceStats = {
    completedOrders: state.orderIndex,
    failedJudgements: 0,
    bestScore: 0,
    coinsEarned: 0,
    reputationEarned: 0,
    dishes: [],
    penaltyScore: 0,
  };
  state.savedActiveDay = null;
  return true;
}

function restoreCareerProgress() {
  const active = state.savedActiveDay;
  if (!active?.orderQueue?.length) return false;
  state.day = active.day || state.day || 1;
  state.orderIndex = 0;
  state.dailyEvent = DAILY_EVENTS.find((event) => event.name === active.dailyEvent) || pickDailyEvent();
  state.orderQueue = active.orderQueue
    .map((order) => ({
      recipe: RECIPES.find((recipe) => recipe.id === order.recipeId) || RECIPES[0],
      requiredScore: order.requiredScore || REQUIRED_SCORE,
      customer: CUSTOMER_PREFERENCES.find((preference) => preference.name === order.customer) || pickCustomerPreference(),
    }))
    .filter((order) => order.recipe);
  state.targetRecipe = state.orderQueue[0]?.recipe || pickTargetRecipe();
  state.serviceStats = state.serviceStats || {
    completedOrders: 0,
    failedJudgements: 0,
    bestScore: 0,
    coinsEarned: 0,
    reputationEarned: 0,
    dishes: [],
    penaltyScore: 0,
  };
  state.savedActiveDay = null;
  return Boolean(state.orderQueue.length);
}

function startRunningDay() {
  dom.startScreen.classList.add("hidden");
  dom.startScreen.classList.remove("screen-visible");
  dom.hud.classList.remove("hidden");
  dom.questTracker.classList.remove("hidden");
  dom.inventoryBar.classList.remove("hidden");
  dom.tutorialGuide.classList.toggle("hidden", !state.tutorialMode);
  state.running = true;
  state.gameOver = false;
  state.paused = false;
  state.cameraYaw = 0;
  state.cameraPitch = CAMERA_BASE_PITCH;
  ensureAudio();
  playClick();
  startMusic();
  applyCareerRegionState();
  updateEventVisuals();
  updateHelperVisibility();
  updateHud();
  saveProgress();
}

function restartGame() {
  void startGame();
}

function toggleSound() {
  state.soundEnabled = !state.soundEnabled;
  syncSoundToggle();
  if (state.soundEnabled) {
    ensureAudio();
    startMusic();
    playClick();
  } else {
    stopMusic();
  }
  persistSettings();
}

function animate() {
  // requestAnimationFrame은 try 바깥에 위치 — 어떤 예외가 발생해도 루프가 멈추지 않음
  requestAnimationFrame(animate);

  const dt = Math.min(clock.getDelta(), 0.05);
  try {
    if (state.running && !state.gameOver && !state.paused) {
      updatePlayer(dt);
      updateTimer(dt);
      updateInteractables();
      animateMarkers(dt);
      updateHelperHamster(dt);
      updateTutorialGuide();
      updateQuestArrow();
      updatePvpFrame(dt);
      recordGhostFrame(dt);
      updateGhostPlayback();
      if (questArrow?.visible) {
        questArrow.position.y = 3.1 + Math.sin(performance.now() * 0.003) * 0.22;
      }
    }
    updateCamera(dt);
    updatePvpStarsOverlayPosition();
    renderer.render(scene, camera);
  } catch (e) {
    console.error("[animate] exception caught:", e);
  }
}

function updatePlayer(dt) {
  if (state.modalOpen) return;
  if (state.pvpTripUntil && Date.now() < state.pvpTripUntil) {
    // 넘어뜨리기 스턴 — 이동 불가, 캐릭터 흔들기
    player.rotation.z = Math.sin(performance.now() * 0.018) * 0.45;
    return;
  }
  if (state.pvpTripUntil && Date.now() >= state.pvpTripUntil) {
    state.pvpTripUntil = 0;
    player.rotation.z = 0;
  }

  const dir = new THREE.Vector3();
  if (keys.has("w")) dir.z -= 1;
  if (keys.has("s")) dir.z += 1;
  if (keys.has("a")) dir.x -= 1;
  if (keys.has("d")) dir.x += 1;

  if (dir.lengthSq() > 0) {
    // 카메라를 돌려놓은 만큼 입력도 함께 돌린다. W는 언제나 "화면에서 위쪽".
    dir.normalize().applyAxisAngle(CAMERA_UP_AXIS, state.cameraYaw);
    const speedMultiplier = 1 + getUpgradeLevel("shoes") * 0.12;
    const slowPenalty = (state.pvpSlowUntil && Date.now() < state.pvpSlowUntil) ? 0.5 : 1;
    const speed = (keys.has("shift") ? 5.4 : 3.6) * speedMultiplier * slowPenalty;
    player.position.addScaledVector(dir, speed * dt);
    player.position.x = THREE.MathUtils.clamp(player.position.x, boundaries.minX, boundaries.maxX);
    player.position.z = THREE.MathUtils.clamp(player.position.z, boundaries.minZ, boundaries.maxZ);

    const targetAngle = Math.atan2(dir.x, dir.z);
    player.rotation.y = lerpAngle(player.rotation.y, targetAngle, 0.22);
    player.position.y = Math.sin(performance.now() * 0.012) * 0.035;
  } else {
    player.position.y = THREE.MathUtils.lerp(player.position.y, 0, 0.12);
  }
}

function updateCamera(dt) {
  // 방향키로 카메라 공전. 모달·미니게임 중에는 방향키가 그쪽 UI 조작에 쓰이므로 회전시키지 않는다.
  if (state.running && !state.gameOver && !state.paused && !state.modalOpen) {
    if (keys.has("arrowleft")) state.cameraYaw += CAMERA_YAW_SPEED * dt;
    if (keys.has("arrowright")) state.cameraYaw -= CAMERA_YAW_SPEED * dt;
    if (keys.has("arrowup")) {
      state.cameraPitch = Math.min(CAMERA_MAX_PITCH, state.cameraPitch + CAMERA_PITCH_SPEED * dt);
    }
    if (keys.has("arrowdown")) {
      state.cameraPitch = Math.max(CAMERA_MIN_PITCH, state.cameraPitch - CAMERA_PITCH_SPEED * dt);
    }
  }

  const lookAt = player ? player.position.clone().add(new THREE.Vector3(0, 0.95, 0)) : new THREE.Vector3();
  const cosPitch = Math.cos(state.cameraPitch);
  const orbit = new THREE.Vector3(
    Math.sin(state.cameraYaw) * cosPitch * CAMERA_DISTANCE,
    Math.sin(state.cameraPitch) * CAMERA_DISTANCE,
    Math.cos(state.cameraYaw) * cosPitch * CAMERA_DISTANCE,
  );
  const parallax = new THREE.Vector3(pointer.x * 0.9, pointer.y * 0.25, 0)
    .applyAxisAngle(CAMERA_UP_AXIS, state.cameraYaw);
  const target = lookAt.clone().add(orbit).add(parallax);
  camera.position.lerp(target, 1 - Math.pow(0.001, dt));

  // 화면 흔들기 — THREE.js 카메라를 직접 흔든다. PvP 넘어뜨리기와 juice 연출이 공유.
  // CSS transform 방식은 ① canvas-shake가 3D뷰만 흔들고 오버레이는 제자리라 어색,
  // ② pvp-tilt-wrap에 transform이 걸리면 position:fixed 자식의 containing block이 깨짐.
  // 카메라 자체를 흔들면 project()로 계산되는 별 오버레이 위치도 함께 흔들려 자연스럽다.
  if (state.cameraShake.remainingMs > 0) {
    const shake = state.cameraShake;
    shake.remainingMs = Math.max(0, shake.remainingMs - dt * 1000);
    const t = shake.remainingMs / shake.durationMs; // 1(시작)→0(종료)
    const now = performance.now();
    camera.position.x += (Math.sin(now * 0.083) * 0.6 + Math.sin(now * 0.19) * 0.4) * t * shake.magnitude;
    camera.position.y += (Math.cos(now * 0.067) * 0.6 + Math.cos(now * 0.15) * 0.4) * t * shake.magnitude * 0.5;
  }

  camera.lookAt(lookAt);
  updateBillboards();
}

// 간판이 평면이라 카메라를 돌리면 옆면만 보인다. Y축만 돌려 글자를 항상 정면으로 세운다.
function updateBillboards() {
  if (!billboards.length) return;
  for (const board of billboards) {
    board.getWorldPosition(billboardWorldPos);
    board.rotation.y = Math.atan2(
      camera.position.x - billboardWorldPos.x,
      camera.position.z - billboardWorldPos.z,
    );
  }
}

function updateTimer(dt) {
  if (state.gameMode === "career") return;
  const prevTimeLeft = state.timeLeft;
  state.timeLeft = Math.max(0, state.timeLeft - dt);
  if (state.timeLeft <= 0) {
    finishGame(true, makeServiceSummary(true, "제한 시간이 끝났습니다."));
  }
  // 1분 이하로 처음 진입할 때 긴박한 BGM으로 전환
  if (prevTimeLeft > PANIC_BGM_THRESHOLD && state.timeLeft <= PANIC_BGM_THRESHOLD) {
    syncMusicPlayback();
  }
  updateHud();
}

function updateInteractables() {
  let nearest = null;
  let nearestDistance = Infinity;

  for (const item of interactables) {
    if (item.disabled || item.group?.visible === false) continue;
    const distance = player.position.distanceTo(item.position);
    if (distance < item.radius && distance < nearestDistance) {
      nearest = item;
      nearestDistance = distance;
    }
  }

  currentInteractable = nearest;
  if (nearest && !state.modalOpen) {
    dom.interactionName.textContent = nearest.label;
    dom.interactionPrompt.classList.remove("hidden");
  } else {
    dom.interactionPrompt.classList.add("hidden");
  }
}

function animateMarkers(dt) {
  const t = performance.now() * 0.004;
  for (const item of interactables) {
    if (item.markerMesh) {
      item.markerMesh.position.y = 1.06 + Math.sin(t + item.position.x) * 0.04;
      item.markerMesh.rotation.y += dt * 1.4;
    }
  }

  if (worldObjects.crates) {
    for (const crate of worldObjects.crates) {
      if (!crate.group.visible) continue;
      crate.group.rotation.y += dt * 0.45;
    }
  }
}

function updateHelperHamster(dt) {
  if (!helperHamster) return;
  updateHelperVisibility();
  if (!helperHamster.visible) return;

  const t = performance.now() * 0.001;
  helperHamster.position.x = -3.2 + Math.sin(t * 0.7) * 1.8;
  helperHamster.position.z = -4.4 + Math.cos(t * 0.9) * 0.8;
  helperHamster.rotation.y = Math.sin(t) * 0.5;
  helperHamster.position.y = Math.sin(t * 8) * 0.025;

  state.helperCooldown = Math.max(0, (state.helperCooldown || 0) - dt);
  if (state.helperCooldown <= 0) {
    const level = getUpgradeLevel("assistant");
    const coins = 4 + level * 3;
    const reputation = level;
    state.coins += coins;
    state.reputation += reputation;
    if (state.serviceStats) {
      state.serviceStats.coinsEarned += coins;
      state.serviceStats.reputationEarned += reputation;
    }
    state.helperCooldown = Math.max(18, 38 - level * 6);
    updateHud();
    saveProgress();
    showToast(`알바 햄스터가 ${coins}코인과 평판 +${reputation}을 벌어왔습니다.`);
  }
}

function updateHelperVisibility() {
  if (helperHamster) helperHamster.visible = state.running && getUpgradeLevel("assistant") > 0;
}

function setStationPresentation(station, { label, color, marker, action, disabled = false }) {
  if (!station) return;
  station.label = label || station.defaultLabel;
  station.action = action || station.defaultAction;
  station.disabled = disabled;
  station.base.material.color.set(color || station.defaultColor);
  station.markerMesh.material.color.set(marker || station.defaultMarker);
  if (station.labelBoard) {
    station.group.remove(station.labelBoard);
    const boardIdx = billboards.indexOf(station.labelBoard);
    if (boardIdx >= 0) billboards.splice(boardIdx, 1);
  }
  station.labelBoard = makeLabelBoard(station.label, color || station.defaultColor, "#fff8e8");
  station.labelBoard.position.set(0, 1.65, 0);
  station.group.add(station.labelBoard);
  billboards.push(station.labelBoard);
}

function resetRestaurantStations() {
  Object.values(stations).forEach((station) => {
    if (station.group) station.group.visible = true;
    setStationPresentation(station, {
      label: station.defaultLabel,
      color: station.defaultColor,
      marker: station.defaultMarker,
      action: station.defaultAction,
      disabled: false,
    });
  });
}

function applyChallengeStationState() {
  if (state.gameMode !== "challenge" || state.tutorialMode) return;
  [stations.upgrade].forEach((station) => {
    if (!station) return;
    station.disabled = true;
    if (station.group) station.group.visible = false;
  });
}

function applyCareerRegionState() {
  if (state.gameMode !== "career") {
    resetRestaurantStations();
    if (worldObjects.regionDecor) {
      Object.values(worldObjects.regionDecor).forEach((group) => {
        group.visible = false;
      });
    }
    applyChallengeStationState();
    return;
  }

  if (!state.careerData) state.careerData = createCareerData({ day: state.day });
  const region = getCareerRegion();
  if (worldObjects.regionDecor) {
    Object.entries(worldObjects.regionDecor).forEach(([id, group]) => {
      group.visible = id === region.id;
    });
  }

  resetRestaurantStations();
  if (region.id === "restaurant") return;

  setStationPresentation(stations.board, {
    label: "지역 지도",
    color: "#5e426d",
    marker: "#f5c84b",
    action: openCareerMapModal,
  });

  if (region.id === "market") {
    setStationPresentation(stations.shop, {
      label: "시장 흥정",
      color: "#c77c4a",
      marker: "#f5c84b",
      action: openMarketRegion,
    });
  } else if (region.id === "forest") {
    setStationPresentation(stations.shop, {
      label: "숲 채집",
      color: "#4a995b",
      marker: "#fff8e8",
      action: openForestRegion,
    });
  } else if (region.id === "greenhouse") {
    setStationPresentation(stations.shop, {
      label: "온실 관리",
      color: "#4e9a88",
      marker: "#fff8e8",
      action: openGreenhouseRegion,
    });
  }

  [stations.upgrade, stations.kitchen, stations.judge, stations.sink, stations.counter, stations.shelf].forEach((station) => {
    if (!station) return;
    station.disabled = true;
  });
}

function updateEventVisuals() {
  const eventName = state.dailyEvent?.name || "";
  let sky = "#8bd4d0";
  let fog = "#8bd4d0";
  if (eventName === "비 오는 날") {
    sky = "#7fa9c4";
    fog = "#8fb2c9";
  } else if (eventName === "장날") {
    sky = "#93d0a7";
    fog = "#93d0a7";
  } else if (eventName === "버섯 축제") {
    sky = "#b69bd6";
    fog = "#b69bd6";
  } else if (eventName === "바쁜 점심" || eventName === "미슐랭 시찰") {
    sky = "#f0b574";
    fog = "#f0b574";
  }
  if (state.gameMode === "career") {
    const region = getCareerRegion();
    sky = region.sky;
    fog = region.fog;
  }
  scene.background = new THREE.Color(sky);
  scene.fog = new THREE.Fog(fog, 20, 46);
  document.body.dataset.event = eventName;
}

function interact() {
  if (!currentInteractable || state.gameOver) return;
  ensureAudio();
  playClick();
  currentInteractable.action(currentInteractable);
}

function openQuestBoard() {
  if (state.gameMode === "challenge") {
    const busy = state.currentQuest && !state.currentQuest.completed;
    if (busy) {
      openModal(`
        <h2>일 게시판</h2>
        <p>현재 진행 중인 랜덤 일을 먼저 마무리하세요.</p>
        <article class="choice-card">
          <h3>${state.currentQuest.name}</h3>
          <p>${state.currentQuest.detail}</p>
          <p><strong>보상 ${state.currentQuest.pay}코인</strong></p>
          <div class="mode-actions">
            <button type="button" data-open-history="true">기록 보기</button>
            <button type="button" class="secondary-action" data-abandon-quest="true">일 포기</button>
          </div>
        </article>
      `);
      const historyButton = dom.modalContent.querySelector("[data-open-history]");
      if (historyButton) historyButton.addEventListener("click", openHistoryModal);
      dom.modalContent.querySelector("[data-abandon-quest]")?.addEventListener("click", openAbandonQuestConfirm);
      return;
    }

    assignRandomChallengeQuest({ excludeId: state.lastChallengeQuestId });
    closeModal(false, true);
    openModal(`
      <h2>일 게시판</h2>
      <p>오늘의 잡일이 랜덤으로 배정되었습니다.</p>
      <article class="choice-card">
        <h3>${state.currentQuest.name}</h3>
        <p>${state.currentQuest.detail}</p>
        <p><strong>보상 ${state.currentQuest.pay}코인</strong></p>
        <button type="button" data-close-board="true">확인</button>
      </article>
    `);
    const closeButton = dom.modalContent.querySelector("[data-close-board]");
    if (closeButton) closeButton.addEventListener("click", () => closeModal());
    return;
  }

  const busy = state.currentQuest && !state.currentQuest.completed;
  openModal(`
    <h2>일 게시판</h2>
    <p>코인을 벌면 재료를 살 수 있습니다. 한 번에 하나의 일만 진행됩니다.</p>
    <article class="choice-card">
      <h3>도전 기록</h3>
      <p>최근 챌린지의 완료 주문 수와 점수 흐름을 확인합니다.</p>
      <button type="button" data-open-history="true">기록 보기</button>
    </article>
    ${busy ? `
      <article class="choice-card">
        <h3>${state.currentQuest.name}</h3>
        <p>${state.currentQuest.detail}</p>
        <p><strong>챌린지 점수 -${ABANDON_QUEST_SCORE_PENALTY}</strong></p>
        <button type="button" class="secondary-action" data-abandon-quest="true">일 포기</button>
      </article>
    ` : ""}
    <div class="grid-list">
      ${QUESTS.map(
        (quest) => `
        <article class="choice-card">
          <h3>${quest.name}</h3>
          <p>${quest.summary}</p>
          <p><strong>보상 ${quest.pay}코인</strong></p>
          <button type="button" data-quest="${quest.id}" ${busy ? "disabled" : ""}>
            ${busy ? "진행 중" : "수락"}
          </button>
        </article>
      `,
      ).join("")}
    </div>
  `);

  dom.modalContent.querySelectorAll("[data-quest]").forEach((button) => {
    button.addEventListener("click", () => {
      startQuest(button.dataset.quest);
      closeModal();
    });
  });
  const historyButton = dom.modalContent.querySelector("[data-open-history]");
  if (historyButton) historyButton.addEventListener("click", openHistoryModal);
  dom.modalContent.querySelector("[data-abandon-quest]")?.addEventListener("click", openAbandonQuestConfirm);
}

function startQuest(id, options = {}) {
  const quest = QUESTS.find((item) => item.id === id);
  if (!quest) return;

  if (id === "dishwash") {
    state.currentQuest = {
      id,
      name: quest.name,
      pay: quest.pay,
      progress: 0,
      total: 5,
      plateInBasin: false,
      plateClean: false,
      scrubProgress: 0,
      detail: "싱크대에서 접시를 닦으세요.",
    };
  }

  if (id === "errand") {
    const order = makeErrandOrder();
    state.currentQuest = {
      id,
      name: quest.name,
      pay: quest.pay,
      progress: 0,
      total: 1,
      order,
      detail: `${order.table}번 테이블 주문을 기억해서 카운터에 전달하세요.`,
    };
  }

  if (id === "stock") {
    state.currentQuest = {
      id,
      name: quest.name,
      pay: quest.pay,
      progress: 0,
      total: 3,
      carrying: false,
      detail: "상자를 찾아 선반에 올려두세요.",
    };
    spawnCrates();
  }

  if (id === "sort") {
    const pool = INGREDIENTS.slice(0, 8);
    const queue = Array.from({ length: 10 }, () => ({
      ingredient: pool[Math.floor(Math.random() * pool.length)],
      spoiled: false,
    }));
    const spoiledSet = new Set();
    while (spoiledSet.size < 3) spoiledSet.add(Math.floor(Math.random() * queue.length));
    queue.forEach((item, i) => { if (spoiledSet.has(i)) item.spoiled = true; });
    state.currentQuest = {
      id, name: quest.name, pay: quest.pay,
      queue, currentIdx: 0, lives: 3, itemTimer: 100, frameId: null, judging: false,
      detail: "재료 선반에서 상한 재료를 골라내세요",
    };
  }

  if (id === "water") {
    state.currentQuest = {
      id, name: quest.name, pay: quest.pay,
      plants: Array.from({ length: 4 }, (_, i) => ({
        level: 15 + Math.floor(Math.random() * 30),
        dryRate: [0.018, 0.024, 0.02, 0.026][i],
        overflowed: false,
      })),
      selectedPlant: 0,
      frameId: null,
      detail: "상점에서 화분에 물을 주세요.",
    };
  }

  updateHud();
  if (options.toast !== false) showToast(`${quest.name}을 시작했습니다.`);
}

function pickRandomChallengeQuestId(excludeId = null) {
  const pool = CHALLENGE_QUEST_IDS.filter((id) => id !== excludeId);
  const source = pool.length ? pool : CHALLENGE_QUEST_IDS;
  return source[Math.floor(Math.random() * source.length)] || null;
}

function assignRandomChallengeQuest(options = {}) {
  if (state.gameMode !== "challenge" || state.tutorialMode) return;
  const nextId = pickRandomChallengeQuestId(options.excludeId || null);
  if (!nextId) return;
  startQuest(nextId, { toast: false });
  if (options.toast !== false) showToast(`이번 일: ${state.currentQuest?.name}`);
}

function handleSink() {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "dishwash") {
    showToast("지금은 닦을 접시가 없습니다.");
    return;
  }

  openSinkWorkstation();
}

function openSinkWorkstation() {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "dishwash") return;

  renderSinkWorkstation();
}

function renderSinkWorkstation() {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "dishwash") return;

  const dirtyCount = Math.max(0, quest.total - quest.progress - (quest.plateInBasin ? 1 : 0));
  const cleanCount = quest.progress;
  const dirtyPlate = dirtyCount
    ? `
      <div class="plate-count-card">
        ${plateImage("dirty", { draggable: true, label: "더러운 접시" })}
        <span class="plate-count-badge">남은 접시 ${dirtyCount}장</span>
      </div>
    `
    : `<span class="empty-slot">남은 접시 없음</span>`;
  const cleanPlate = cleanCount
    ? `
      <div class="plate-count-card">
        ${plateImage("clean", { label: "닦은 접시" })}
        <span class="plate-count-badge clean-count-badge">닦은 접시 ${cleanCount}장</span>
      </div>
    `
    : `<span class="empty-slot">아직 없습니다</span>`;
  const basinContent = getSinkBasinContent(quest);
  const progress = Math.round(quest.scrubProgress || 0);

  openModal(`
    <h2>반짝 접시 정리</h2>
    <p>더러운 접시를 중앙 싱크대로 옮긴 뒤, 수세미로 문질러 깨끗하게 만들고 오른쪽 칸에 놓으세요.</p>
    <div class="sink-workbench">
      <section class="sink-column dirty-column">
        <h3>더러워진 접시</h3>
        <div class="plate-stack">${dirtyPlate}</div>
      </section>
      <section class="sink-basin" data-sink-basin="true">
        ${basinContent}
        <strong>${quest.progress}/${quest.total}</strong>
        <div class="scrub-meter"><span style="width:${progress}%"></span></div>
      </section>
      <section class="sink-column clean-column" data-clean-drop="true">
        <h3>닦인 접시</h3>
        <div class="plate-stack">${cleanPlate}</div>
      </section>
    </div>
  `);

  bindSinkWorkstationEvents();
}

function getSinkBasinContent(quest) {
  if (!quest.plateInBasin) {
    return `
      <div class="sink-drop-zone">
        <span class="water-icon">≈</span>
        <b>접시를 여기로 드래그</b>
      </div>
    `;
  }

  const grime = Math.max(0, 1 - (quest.scrubProgress || 0) / 100);
  if (quest.plateClean) {
    return `
      <div class="basin-clean-ready">
        ${plateImage("clean", { draggable: true, label: "닦인 접시" })}
        <b>오른쪽 칸으로 옮기세요</b>
      </div>
    `;
  }

  return `
    <div class="scrub-area">
      ${plateImage("dirty", { grime, label: "접시" })}
      <button class="sponge" type="button" data-sponge="true">수세미</button>
      <b>수세미를 누른 채 문지르세요</b>
    </div>
  `;
}

function plateImage(type, options = {}) {
  const draggable = options.draggable ? ` draggable="true"` : "";
  const dataAttr = options.draggable
    ? type === "dirty"
      ? ` data-dirty-plate="true"`
      : ` data-clean-plate="true"`
    : "";
  const grime =
    type === "dirty"
      ? `<span class="grime-layer" style="opacity:${options.grime ?? 1}"></span>`
      : "";
  const shine = type === "clean" ? `<span class="plate-shine"></span>` : "";

  return `
    <div class="plate-image ${type}-plate-image"${draggable}${dataAttr} aria-label="${options.label || "접시"}">
      <span class="plate-rim"></span>
      <span class="plate-center"></span>
      ${grime}
      ${shine}
    </div>
  `;
}

function bindSinkWorkstationEvents() {
  dom.modalContent.querySelectorAll("[data-dirty-plate]").forEach((plate) => {
    plate.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", "dirty-plate");
    });
  });

  const basin = dom.modalContent.querySelector("[data-sink-basin]");
  if (basin) {
    basin.addEventListener("dragover", (event) => event.preventDefault());
    basin.addEventListener("drop", (event) => {
      event.preventDefault();
      if (event.dataTransfer.getData("text/plain") === "dirty-plate") {
        moveDirtyPlateToBasin();
      }
    });
  }

  const cleanPlate = dom.modalContent.querySelector("[data-clean-plate]");
  if (cleanPlate) {
    cleanPlate.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", "clean-plate");
    });
  }

  const cleanDrop = dom.modalContent.querySelector("[data-clean-drop]");
  if (cleanDrop) {
    cleanDrop.addEventListener("dragover", (event) => event.preventDefault());
    cleanDrop.addEventListener("drop", (event) => {
      event.preventDefault();
      if (event.dataTransfer.getData("text/plain") === "clean-plate") {
        placeCleanPlate();
      }
    });
  }

  const sponge = dom.modalContent.querySelector("[data-sponge]");
  if (sponge) {
    let last = null;
    const scrub = (event) => {
      if (!last) return;
      const dx = event.clientX - last.x;
      const dy = event.clientY - last.y;
      last = { x: event.clientX, y: event.clientY };
      scrubPlate(Math.min(9, Math.hypot(dx, dy) * 0.35));
    };
    const stop = () => {
      last = null;
      window.removeEventListener("pointermove", scrub);
      window.removeEventListener("pointerup", stop);
    };
    sponge.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      last = { x: event.clientX, y: event.clientY };
      window.addEventListener("pointermove", scrub);
      window.addEventListener("pointerup", stop);
    });
  }
}

function moveDirtyPlateToBasin() {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "dishwash" || quest.plateInBasin) return;

  quest.plateInBasin = true;
  quest.plateClean = false;
  quest.scrubProgress = 0;
  quest.detail = "수세미로 접시를 문지르세요.";
  playWork();
  updateHud();
  renderSinkWorkstation();
}

function scrubPlate(amount) {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "dishwash" || !quest.plateInBasin || quest.plateClean) return;

  quest.scrubProgress = Math.min(100, (quest.scrubProgress || 0) + amount);
  const meter = dom.modalContent.querySelector(".scrub-meter span");
  const grime = dom.modalContent.querySelector(".scrub-area .grime-layer");
  if (meter) meter.style.width = `${Math.round(quest.scrubProgress)}%`;
  if (grime) grime.style.opacity = String(Math.max(0, 1 - quest.scrubProgress / 100));

  if (quest.scrubProgress >= 100) {
    quest.plateClean = true;
    quest.detail = "깨끗한 접시를 오른쪽 칸에 놓으세요.";
    playCoin();
    updateHud();
    renderSinkWorkstation();
  }
}

function placeCleanPlate() {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "dishwash") return;
  if (!quest.plateInBasin || !quest.plateClean) return;

  quest.progress += 1;
  quest.plateInBasin = false;
  quest.plateClean = false;
  quest.scrubProgress = 0;
  quest.detail = `접시 ${quest.progress}/${quest.total}장 완료`;
  playWork();

  if (quest.progress >= quest.total) {
    const pay = quest.pay;
    completeQuest();
    openModal(`
      <h2>접시 정리 완료</h2>
      <p>모든 접시가 반짝입니다. 보상 ${pay}코인을 받았습니다.</p>
      <article class="choice-card">
        <h3>주방이 한결 밝아졌어요</h3>
        <p>이제 상점에서 재료를 사거나 다른 일을 받을 수 있습니다.</p>
        <button type="button" data-close-sink="true">닫기</button>
      </article>
    `);
    const closeButton = dom.modalContent.querySelector("[data-close-sink]");
    closeButton.addEventListener("click", () => closeModal());
  } else {
    updateHud();
    renderSinkWorkstation();
  }
}

function handleCounter() {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "errand") {
    showToast("카운터는 조리 준비를 기다리고 있습니다.");
    return;
  }

  openOrderDelivery();
}

function makeErrandOrder() {
  return {
    table: Math.floor(Math.random() * 4) + 1,
    dish: ORDER_DISHES[Math.floor(Math.random() * ORDER_DISHES.length)],
    request: ORDER_REQUESTS[Math.floor(Math.random() * ORDER_REQUESTS.length)],
  };
}

function renderOrderDishImage(dishName, extraClass = "") {
  const artClassName = ["order-dish-art", extraClass].filter(Boolean).join(" ");
  let content = "";
  if (dishName === "별빛 크림 스튜") {
    content = `
      <div class="order-dish-stew">
        <span class="stew-swirl"></span>
        <span class="stew-leaf"></span>
        <span class="stew-star"></span>
      </div>
    `;
  } else if (dishName === "숲속 버섯 플레이트") {
    content = `
      <div class="order-dish-mushroom-plate">
        <span class="mushroom-cap mushroom-cap-large"></span>
        <span class="mushroom-cap mushroom-cap-small"></span>
        <span class="mushroom-stem mushroom-stem-large"></span>
        <span class="mushroom-stem mushroom-stem-small"></span>
        <span class="forest-herb-leaf"></span>
      </div>
    `;
  } else if (dishName === "당근 크림볼") {
    content = `
      <div class="order-dish-carrot-bowl">
        <span class="carrot-ball carrot-ball-left"></span>
        <span class="carrot-ball carrot-ball-center"></span>
        <span class="carrot-ball carrot-ball-right"></span>
        <span class="carrot-leaf"></span>
      </div>
    `;
  } else {
    const ingredientIds = ORDER_DISH_ART[dishName] || ["cream", "cheese", "herb"];
    content = ingredientIds
      .map((id) => INGREDIENTS.find((ingredient) => ingredient.id === id))
      .filter(Boolean)
      .map((ingredient) => `
        <div class="order-dish-dot" style="background:${ingredient.color}"></div>
      `)
      .join("");
    content = `<div class="order-dish-food">${content}</div>`;
  }
  return `
    <div class="${artClassName}" aria-hidden="true">
      <div class="order-dish-plate">
        ${content}
      </div>
    </div>
  `;
}

function openOrderDelivery() {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "errand") return;

  renderOrderMemory();
}

function renderOrderMemory() {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "errand") return;

  clearOrderChallengeTimer();
  quest.orderMistakes = 0;
  quest.orderChoiceStarted = false;
  quest.orderOptions = null;
  quest.detail = "주문을 외운 뒤 카운터 표를 고르세요.";
  updateHud();

  openModal(`
    <h2>주문표 전달</h2>
    <p>손님 주문을 외운 뒤 주문표를 접습니다. 이후에는 원본이 가려지고, 비슷한 후보 중 같은 주문표를 골라야 합니다.</p>
    <article class="order-memory-card">
      <span>손님 주문</span>
      <div class="order-memory-row">
        <strong>${quest.order.table}번 테이블</strong>
        ${renderOrderDishImage(quest.order.dish, "order-dish-art-large")}
      </div>
      <b>${quest.order.dish}</b>
      <p>${quest.order.request}</p>
    </article>
    <article class="choice-card order-briefing">
      <h3>외울 것</h3>
      <p>테이블 번호, 요리 이름, 요청 문구 3가지를 모두 맞춰야 합니다. 틀린 주문표를 한 번만 골라도 즉시 실패하며 시간이 끝나도 보상이 사라집니다.</p>
      <button type="button" data-start-order-challenge="true">주문표 접기</button>
    </article>
  `);

  const startButton = dom.modalContent.querySelector("[data-start-order-challenge]");
  startButton.addEventListener("click", startOrderChallenge);
}

function startOrderChallenge() {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "errand") return;

  clearOrderChallengeTimer();
  quest.orderChoiceStarted = true;
  quest.orderMistakes = 0;
  quest.orderSecondsLeft = ORDER_CHALLENGE_SECONDS;
  quest.orderOptions = makeOrderOptions(quest.order);
  quest.detail = "제한 시간 안에 같은 주문표를 고르세요.";
  updateHud();
  renderOrderChoices();
  state.orderTimer = setInterval(tickOrderChallenge, 1000);
}

function renderOrderChoices() {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "errand") return;

  const options = quest.orderOptions || makeOrderOptions(quest.order);
  quest.orderOptions = options;
  openModal(`
    <h2>주문표 전달</h2>
    <p>원본 주문표는 접었습니다. 기억한 내용과 같은 표를 고르세요.</p>
    <div class="order-challenge-bar">
      <strong>남은 시간 <span id="order-countdown">${quest.orderSecondsLeft}</span>초</strong>
      <span>실수 ${quest.orderMistakes}/${ORDER_MAX_MISTAKES}</span>
    </div>
    <div class="grid-list">
      ${options
        .map(
          (option, index) => `
          <article class="choice-card order-ticket">
            <span class="order-ticket-table">${option.table}번 테이블</span>
            ${renderOrderDishImage(option.dish)}
            <h3>${option.dish}</h3>
            <p>${option.request}</p>
            <button type="button" data-order-option="${index}">전달</button>
          </article>
        `,
        )
        .join("")}
    </div>
  `);

  dom.modalContent.querySelectorAll("[data-order-option]").forEach((button) => {
    button.addEventListener("click", () => chooseOrderTicket(options[Number(button.dataset.orderOption)], button));
  });
}

function makeOrderOptions(correct) {
  const options = [
    correct,
    { table: correct.table, dish: correct.dish, request: pickDifferent(ORDER_REQUESTS, correct.request) },
    { table: correct.table, dish: pickDifferent(ORDER_DISHES, correct.dish), request: correct.request },
    { table: pickDifferent([1, 2, 3, 4], correct.table), dish: correct.dish, request: correct.request },
  ];

  while (options.length < 5) {
    const option = {
      table: Math.floor(Math.random() * 4) + 1,
      dish: ORDER_DISHES[Math.floor(Math.random() * ORDER_DISHES.length)],
      request: ORDER_REQUESTS[Math.floor(Math.random() * ORDER_REQUESTS.length)],
    };
    const exists = options.some(
      (item) => item.table === option.table && item.dish === option.dish && item.request === option.request,
    );
    if (!exists) options.push(option);
  }

  return options.sort(() => Math.random() - 0.5);
}

function pickDifferent(items, current) {
  const candidates = items.filter((item) => item !== current);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function tickOrderChallenge() {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "errand" || !quest.orderChoiceStarted) {
    clearOrderChallengeTimer();
    return;
  }

  quest.orderSecondsLeft = Math.max(0, quest.orderSecondsLeft - 1);
  const countdown = dom.modalContent.querySelector("#order-countdown");
  if (countdown) countdown.textContent = String(quest.orderSecondsLeft);

  if (quest.orderSecondsLeft <= 0) {
    failOrderDelivery("시간이 끝나 주문표를 놓쳤습니다.");
  }
}

function clearOrderChallengeTimer() {
  if (state.orderTimer) {
    clearInterval(state.orderTimer);
    state.orderTimer = null;
  }
}

function chooseOrderTicket(option, button) {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "errand") return;

  const correct =
    option.table === quest.order.table &&
    option.dish === quest.order.dish &&
    option.request === quest.order.request;

  if (!correct) {
    quest.orderMistakes = (quest.orderMistakes || 0) + 1;
    playFail();
    if (button) {
      button.disabled = true;
      button.textContent = "아님";
    }
    const mistakeLabel = dom.modalContent.querySelector(".order-challenge-bar span");
    if (mistakeLabel) mistakeLabel.textContent = `실수 ${quest.orderMistakes}/${ORDER_MAX_MISTAKES}`;
    if (quest.orderMistakes >= ORDER_MAX_MISTAKES) {
      failOrderDelivery("주문표를 한 번 잘못 골라 실패했습니다.");
      return;
    }
    showToast("비슷하지만 다른 주문표입니다. 남은 후보를 다시 보세요.");
    return;
  }

  clearOrderChallengeTimer();
  quest.progress = 1;
  playWork();
  const pay = quest.pay;
  completeQuest();
  openModal(`
    <h2>주문 전달 완료</h2>
    <p>정확한 주문표를 주방에 전달했습니다. 보상 ${pay}코인을 받았습니다.</p>
    <article class="choice-card">
      <h3>좋은 기억력입니다</h3>
      <p>손님 요청이 주방에 정확히 도착했어요.</p>
      <button type="button" data-close-order="true">닫기</button>
    </article>
  `);
  const closeButton = dom.modalContent.querySelector("[data-close-order]");
  closeButton.addEventListener("click", () => closeModal());
}

function failOrderDelivery(reason) {
  const failedQuestId = state.currentQuest?.id || "errand";
  clearOrderChallengeTimer();
  playFail();
  state.currentQuest = null;
  state.lastChallengeQuestId = failedQuestId;
  updateHud();
  openModal(`
    <h2>주문 전달 실패</h2>
    <p>${reason} 이번 주문은 보상을 받을 수 없습니다.</p>
    <article class="choice-card">
      <h3>다시 게시판으로</h3>
      <p>일 게시판에서 상호작용해 다음 랜덤 일을 받아보세요.</p>
      <button type="button" data-close-order="true">닫기</button>
    </article>
  `);
  const closeButton = dom.modalContent.querySelector("[data-close-order]");
  closeButton.addEventListener("click", () => closeModal());
}

function handleShelf() {
  const quest = state.currentQuest;
  if (quest?.id === "sort") { openSortQuest(); return; }
  if (!quest || quest.id !== "stock") {
    showToast("선반은 조용히 정리되어 있습니다.");
    return;
  }

  if (!quest.carrying) {
    showToast("먼저 상자를 들어야 합니다.");
    return;
  }

  quest.carrying = false;
  playerCarryMesh.visible = false;
  quest.progress += 1;
  playPaper();

  if (quest.progress >= quest.total) {
    completeQuest();
  } else {
    quest.detail = `상자 ${quest.progress}/${quest.total}개 정리 완료`;
    updateHud();
  }
}

function spawnCrates() {
  clearCrates();
  const crateCandidates = [
    [-6.4, 0, 5.7],
    [-4.3, 0, 5.8],
    [-1.4, 0, 5.1],
    [1.8, 0, 5.0],
    [4.9, 0, 4.2],
    [6.4, 0, 3.1],
    [-6.2, 0, -0.9],
    [-3.6, 0, -0.4],
    [0.4, 0, -1.0],
    [3.8, 0, -0.6],
  ];
  const cratePositions = crateCandidates
    .slice()
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  worldObjects.crates = cratePositions.map((position, index) => {
    const group = new THREE.Group();
    group.position.set(...position);
    group.add(mesh(new THREE.BoxGeometry(0.68, 0.52, 0.68), mat("#b77b45"), [0, 0.26, 0]));
    group.add(mesh(new THREE.BoxGeometry(0.72, 0.08, 0.1), mat("#f5c84b"), [0, 0.55, 0]));
    scene.add(group);

    const item = {
      id: `crate-${index}`,
      label: "재료 상자",
      group,
      position: group.position,
      radius: 1.45,
      action: () => pickCrate(item),
    };
    interactables.push(item);
    return item;
  });
}

function pickCrate(crate) {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "stock") {
    showToast("지금은 상자를 옮길 일이 없습니다.");
    return;
  }

  if (quest.carrying) {
    showToast("이미 상자를 들고 있습니다.");
    return;
  }

  crate.disabled = true;
  crate.group.visible = false;
  quest.carrying = true;
  playerCarryMesh.visible = true;
  quest.detail = "선반에 상자를 올려두세요.";
  playPaper();
  updateHud();
}

function clearCrates() {
  if (!worldObjects.crates) return;
  for (const crate of worldObjects.crates) {
    scene.remove(crate.group);
    const index = interactables.indexOf(crate);
    if (index >= 0) interactables.splice(index, 1);
  }
  worldObjects.crates = [];
}

// ── 재료 선별 (sort) ─────────────────────────────────────

function openSortQuest() {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "sort") return;

  const item = quest.queue[quest.currentIdx];
  if (!item) return;

  const livesHtml = "❤️".repeat(quest.lives) + "🖤".repeat(3 - quest.lives);
  const spoiledClass = item.spoiled ? " sort-belt-spoiled" : "";
  const spoiledBadge = item.spoiled ? `<span class="sort-spoiled-badge">💨</span>` : "";
  openModal(`
    <h2>재료 선별</h2>
    <p>신선한 재료는 통과, 상한 재료는 버리세요. <small>상한 재료는 빛이 바래고 💨 표시가 있어요.</small></p>
    <div class="sort-belt-stage">
      <div class="sort-belt-meta">
        <span class="sort-belt-lives">${livesHtml}</span>
        <span class="sort-progress-label">${quest.currentIdx + 1} / ${quest.queue.length}</span>
      </div>
      <div class="sort-belt-item${spoiledClass}" id="sort-belt-item">
        ${spoiledBadge}
        ${ingredientImage(item.ingredient)}
        <span class="sort-name">${item.ingredient.name}</span>
      </div>
      <div class="sort-timer-bar">
        <div class="sort-timer-fill" id="sort-timer-fill" style="width:${quest.itemTimer}%"></div>
      </div>
      <div class="sort-belt-actions">
        <button type="button" class="sort-pass-btn" id="sort-pass">✓ 통과</button>
        <button type="button" class="sort-reject-btn" id="sort-reject">✗ 버리기</button>
      </div>
    </div>
  `);

  dom.modalContent.querySelector("#sort-pass")?.addEventListener("click", () => judgeSortItem(false));
  dom.modalContent.querySelector("#sort-reject")?.addEventListener("click", () => judgeSortItem(true));

  if (!quest.frameId) animateSort();
}

function judgeSortItem(rejected) {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "sort" || quest.judging) return;
  quest.judging = true;
  cancelAnimationFrame(quest.frameId);
  quest.frameId = null;

  const item = quest.queue[quest.currentIdx];
  const correct = rejected === item.spoiled;
  if (!correct) {
    quest.lives = Math.max(0, quest.lives - 1);
    showToast(rejected ? "신선한 재료를 버렸어요!" : "상한 재료를 통과시켰어요!");
  }

  quest.currentIdx++;
  quest.itemTimer = 100;
  quest.judging = false;

  if (quest.lives <= 0) {
    closeModal();
    showToast("실패! 다시 선반에서 도전해보세요.");
    state.currentQuest = null;
    updateHud();
    return;
  }

  if (quest.currentIdx >= quest.queue.length) {
    completeQuest();
    closeModal();
    return;
  }

  openSortQuest();
}

function animateSort() {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "sort" || !state.modalOpen) {
    if (quest) quest.frameId = null;
    return;
  }

  quest.itemTimer = Math.max(0, quest.itemTimer - 0.65);
  const fill = dom.modalContent.querySelector("#sort-timer-fill");
  if (fill) fill.style.width = `${quest.itemTimer}%`;

  if (quest.itemTimer <= 0 && !quest.judging) {
    judgeSortItem(false);
    return;
  }

  quest.frameId = requestAnimationFrame(animateSort);
}

// ── 화분 물 주기 (water) ─────────────────────────────────

const WATER_TARGET_MIN = 62;
const WATER_TARGET_MAX = 87;
const WATER_OVERFLOW = 95;
const WATER_PLANT_EMOJI = ["🌵", "🌿", "🪴", "🌸"];

function openWaterQuest() {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "water") return;

  const plantsHtml = quest.plants.map((p, i) => {
    const sel = quest.selectedPlant === i;
    const inZone = p.level >= WATER_TARGET_MIN && p.level <= WATER_TARGET_MAX && !p.overflowed;
    return `
      <div class="water-plant${sel ? " water-plant-selected" : ""}" id="wplant-${i}">
        <span class="water-label">${WATER_PLANT_EMOJI[i]}</span>
        <div class="water-gauge-wrap${p.overflowed ? " water-overflow" : inZone ? " water-good" : ""}" id="wgauge-${i}">
          <div class="water-gauge-fill${p.overflowed ? " water-overflow" : inZone ? " water-good" : ""}"
               id="wfill-${i}" style="height:${Math.min(p.level, 100)}%"></div>
          <div class="water-target-zone"
               style="bottom:${WATER_TARGET_MIN}%;height:${WATER_TARGET_MAX - WATER_TARGET_MIN}%"></div>
        </div>
        <span class="water-pct" id="wpct-${i}">${Math.round(p.level)}%</span>
      </div>`;
  }).join("");

  const allGood = quest.plants.every((p) => p.level >= WATER_TARGET_MIN && p.level <= WATER_TARGET_MAX && !p.overflowed);
  const canAngle = (quest.selectedPlant / (quest.plants.length - 1) - 0.5) * 44;

  openModal(`
    <h2>화분 물 주기</h2>
    <p>◀ ▶ 로 화분을 선택하고 <strong>물 따르기</strong> 버튼을 눌러 물을 주세요. 화분은 천천히 마릅니다.</p>
    <div class="water-tilt-stage">
      <div class="water-can" id="water-can" style="transform:rotate(${canAngle}deg)">🪣</div>
      <div class="water-plants-row" id="water-plants-row">${plantsHtml}</div>
      <div class="water-tilt-controls">
        <button type="button" class="water-tilt-btn" id="water-tilt-left">◀</button>
        <span id="water-selected-label">화분 ${quest.selectedPlant + 1}</span>
        <button type="button" class="water-tilt-btn" id="water-tilt-right">▶</button>
      </div>
      <button type="button" class="water-pour-btn" id="water-pour">물 따르기 💧</button>
    </div>
    <p id="water-status" style="font-weight:800;margin:8px 0">${allGood ? "모두 좋아요! 완료를 눌러주세요." : "초록 구간에 맞추세요."}</p>
    <div class="water-footer-actions">
      <button type="button" id="water-complete" ${allGood ? "" : "disabled"}>완료</button>
      <button type="button" class="water-reset-btn" id="water-reset">🔄 초기화</button>
    </div>
  `);

  dom.modalContent.querySelector("#water-tilt-left")?.addEventListener("click", () => {
    quest.selectedPlant = (quest.selectedPlant - 1 + quest.plants.length) % quest.plants.length;
    updateWaterUI();
  });
  dom.modalContent.querySelector("#water-tilt-right")?.addEventListener("click", () => {
    quest.selectedPlant = (quest.selectedPlant + 1) % quest.plants.length;
    updateWaterUI();
  });
  dom.modalContent.querySelector("#water-pour")?.addEventListener("click", () => {
    const p = quest.plants[quest.selectedPlant];
    if (!p || p.overflowed) return;
    p.level = Math.min(100, p.level + 14);
    if (p.level >= WATER_OVERFLOW) { p.overflowed = true; p.level = 100; playFail(); }
    else playWork();
    const can = dom.modalContent.querySelector("#water-can");
    if (can) {
      can.classList.add("water-can-pour");
      setTimeout(() => can?.classList.remove("water-can-pour"), 220);
    }
    updateWaterUI();
  });
  dom.modalContent.querySelector("#water-reset")?.addEventListener("click", () => {
    quest.plants = Array.from({ length: 4 }, (_, i) => ({
      level: 15 + Math.floor(Math.random() * 30),
      dryRate: [0.018, 0.024, 0.02, 0.026][i],
      overflowed: false,
    }));
    quest.selectedPlant = 0;
    updateWaterUI();
  });
  dom.modalContent.querySelector("#water-complete")?.addEventListener("click", () => {
    cancelAnimationFrame(quest.frameId);
    quest.frameId = null;
    completeQuest();
    closeModal();
  });

  if (!quest.frameId) animateWater();
}

function updateWaterUI() {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "water") return;

  const canAngle = (quest.selectedPlant / (quest.plants.length - 1) - 0.5) * 44;
  const can = dom.modalContent.querySelector("#water-can");
  if (can) can.style.transform = `rotate(${canAngle}deg)`;

  const label = dom.modalContent.querySelector("#water-selected-label");
  if (label) label.textContent = `화분 ${quest.selectedPlant + 1}`;

  quest.plants.forEach((p, i) => {
    const fill = dom.modalContent.querySelector(`#wfill-${i}`);
    const gauge = dom.modalContent.querySelector(`#wgauge-${i}`);
    const plant = dom.modalContent.querySelector(`#wplant-${i}`);
    const pct = dom.modalContent.querySelector(`#wpct-${i}`);
    if (!fill || !gauge || !plant) return;
    const inZone = p.level >= WATER_TARGET_MIN && p.level <= WATER_TARGET_MAX && !p.overflowed;
    const cls = p.overflowed ? " water-overflow" : inZone ? " water-good" : "";
    fill.style.height = `${Math.min(p.level, 100)}%`;
    fill.className = `water-gauge-fill${cls}`;
    gauge.className = `water-gauge-wrap${cls}`;
    plant.className = `water-plant${quest.selectedPlant === i ? " water-plant-selected" : ""}`;
    if (pct) pct.textContent = `${Math.round(p.level)}%`;
  });

  const allGood = quest.plants.every((p) => p.level >= WATER_TARGET_MIN && p.level <= WATER_TARGET_MAX && !p.overflowed);
  const completeBtn = dom.modalContent.querySelector("#water-complete");
  const statusEl = dom.modalContent.querySelector("#water-status");
  if (completeBtn) completeBtn.disabled = !allGood;
  if (statusEl) statusEl.textContent = allGood ? "모두 좋아요! 완료를 눌러주세요." : "초록 구간에 맞추세요.";
}

function animateWater() {
  const quest = state.currentQuest;
  if (!quest || quest.id !== "water" || !state.modalOpen) {
    if (quest) quest.frameId = null;
    return;
  }

  quest.plants.forEach((p) => {
    if (p.overflowed) return;
    p.level = Math.max(0, p.level - p.dryRate);
  });

  updateWaterUI();
  quest.frameId = requestAnimationFrame(animateWater);
}

function completeQuest() {
  const quest = state.currentQuest;
  if (!quest) return;

  const pay = quest.pay + getUpgradeLevel("regulars") * 2;
  state.coins += pay;
  if (state.serviceStats) state.serviceStats.coinsEarned += pay;
  state.currentQuest = null;
  state.lastChallengeQuestId = quest.id;
  clearCrates();
  if (quest.frameId) { cancelAnimationFrame(quest.frameId); quest.frameId = null; }
  playerCarryMesh.visible = false;
  if (questArrow) questArrow.visible = false;
  playRewardCoin();
  if (player) {
    const origin = worldToScreen(player.position.clone().add(new THREE.Vector3(0, 1, 0)));
    flyCoinToHud(origin.x, origin.y, pay);
  }
  showToast(`일 완료! ${pay}코인을 받았습니다.${state.gameMode === "challenge" ? " 게시판에서 다음 일을 받아보세요." : ""}`);
  updateHud();
  saveProgress();
}

function openShop() {
  if (state.currentQuest?.id === "water") { openWaterQuest(); return; }
  const ingredients = getUnlockedIngredients();
  const lockedIngredients = INGREDIENTS.filter((ingredient) => !isUnlocked(ingredient));
  openModal(`
    <h2>재료 상점</h2>
    <p>${state.dailyEvent?.name || "오늘"} 효과와 거래처 업그레이드가 재료 가격에 반영됩니다. 보관 ${getInventoryCount()}/${getStorageLimit()} · ${state.gameMode === "career" ? getCareerProgressSummary() : getReputationTier().name}</p>
    <div class="grid-list">
      ${ingredients.map(
        (ingredient) => {
          const price = getIngredientPrice(ingredient);
          const stockout = state.pvpDebuffs?.stockout;
          const isStockedOut = stockout && stockout.ingredientId === ingredient.id && Date.now() < stockout.expiresAt;
          const remainSec = isStockedOut ? Math.ceil((stockout.expiresAt - Date.now()) / 1000) : 0;
          return `
        <article class="choice-card ingredient-card${isStockedOut ? " stockout-card" : ""}">
          ${ingredientImage(ingredient)}
          <h3>${ingredient.name}</h3>
          <p>${formatTraits(ingredient.traits)}</p>
          <p><strong>${price}코인</strong></p>
          <button class="buy-button" type="button" data-buy="${ingredient.id}" ${isStockedOut ? "disabled" : ""}>
            ${isStockedOut ? `품절 (${remainSec}s)` : "구매"}
          </button>
        </article>
      `;
        },
      ).join("")}
      ${lockedIngredients
        .map(
          (ingredient) => `
            <article class="choice-card muted-record">
              <h3>잠긴 재료</h3>
              <p>${ingredient.name}은 ${getUnlockHint(ingredient)}</p>
            </article>
          `,
        )
        .join("")}
    </div>
  `);

  dom.modalContent.querySelectorAll("[data-buy]").forEach((button) => {
    button.addEventListener("click", () => {
      buyIngredient(button.dataset.buy);
      renderShopAgain();
    });
  });
}

function renderShopAgain() {
  updateHud();
  const buttons = dom.modalContent.querySelectorAll("[data-buy]");
  buttons.forEach((button) => {
    const ingredient = INGREDIENTS.find((item) => item.id === button.dataset.buy);
    button.disabled = getIngredientPrice(ingredient) > state.coins;
  });
}

function buyIngredient(id) {
  const ingredient = INGREDIENTS.find((item) => item.id === id);
  if (!ingredient) return;
  if (!isUnlocked(ingredient)) {
    showToast("아직 해금되지 않은 재료입니다.");
    return;
  }
  if (getInventoryCount() >= getStorageLimit()) {
    playFail();
    showToast("냉장고가 가득 찼습니다. 업그레이드로 보관 칸을 늘려보세요.");
    return;
  }

  const price = getIngredientPrice(ingredient);
  if (state.coins < price) {
    playFail();
    showToast("코인이 부족합니다.");
    return;
  }

  state.coins -= price;
  state.inventory[id] = (state.inventory[id] || 0) + 1;
  playCoin();
  showToast(`${ingredient.name}을 샀습니다.`);
  updateHud();
  saveProgress();
}

function getIngredientPrice(ingredient) {
  const discount = getUpgradeLevel("supplier") * 2 + (state.dailyEvent?.ingredientDiscount || 0);
  return Math.max(6, ingredient.price - discount);
}

function openUpgradeShop() {
  const upgrades = getUnlockedUpgrades();
  const lockedUpgrades = UPGRADES.filter((upgrade) => !isUnlocked(upgrade));
  openModal(`
    <h2>식당 업그레이드</h2>
    <p>${state.gameMode === "career" ? "코인을 투자해 판매가, 손님 난이도, 성장 효율을 끌어올립니다. 성장 업그레이드는 일차를 지나며 자연스럽게 열립니다." : "코인을 투자해 다음 주문과 남은 시간 활용을 더 유리하게 만듭니다. 업그레이드는 이번 도전 동안 유지됩니다."}</p>
    <div class="grid-list">
      ${upgrades.map((upgrade) => {
        const level = getUpgradeLevel(upgrade.id);
        const maxed = level >= 3;
        const cost = getUpgradeCost(upgrade);
        return `
          <article class="choice-card">
            <h3>${upgrade.name} Lv.${level}</h3>
            <p>${upgrade.description}</p>
            <p><strong>${maxed ? "최대 단계" : `${cost}코인`}</strong></p>
            <button class="buy-button" type="button" data-upgrade="${upgrade.id}" ${maxed || state.coins < cost ? "disabled" : ""}>
              ${maxed ? "완료" : "강화"}
            </button>
          </article>
        `;
      }).join("")}
      ${lockedUpgrades
        .map(
          (upgrade) => `
            <article class="choice-card muted-record">
              <h3>잠긴 업그레이드</h3>
              <p>${upgrade.name}은 ${getUnlockHint(upgrade)}</p>
            </article>
          `,
        )
        .join("")}
    </div>
  `);

  dom.modalContent.querySelectorAll("[data-upgrade]").forEach((button) => {
    button.addEventListener("click", () => {
      buyUpgrade(button.dataset.upgrade);
      openUpgradeShop();
    });
  });
}

function buyUpgrade(id) {
  const upgrade = UPGRADES.find((item) => item.id === id);
  if (!upgrade) return;
  const level = getUpgradeLevel(id);
  if (level >= 3) return;
  const cost = getUpgradeCost(upgrade);
  if (state.coins < cost) {
    playFail();
    showToast("코인이 부족합니다.");
    return;
  }

  state.coins -= cost;
  state.upgrades[id] = level + 1;
  playCoin();
  updateHud();
  updateHelperVisibility();
  saveProgress();
  showToast(`${upgrade.name}이 Lv.${level + 1}이 되었습니다.`);
}

function getUpgradeLevel(id) {
  return state.upgrades?.[id] || 0;
}

function getUpgradeCost(upgrade) {
  return upgrade.baseCost + getUpgradeLevel(upgrade.id) * 25;
}

function isUnlocked(item) {
  if (state.gameMode === "career") return isCareerItemUnlocked(item);
  return !item.careerOnly;
}

function getUnlockedIngredients() {
  return INGREDIENTS.filter(isUnlocked);
}

function getUnlockedRecipes() {
  if (state.gameMode === "career") {
    return RECIPES.filter((recipe) => isUnlocked(recipe) && isCareerRecipeUnlocked(recipe));
  }
  return RECIPES.filter(isUnlocked);
}

function getUnlockedUpgrades() {
  return UPGRADES.filter(isUnlocked);
}

function getAvailableCustomerPreferences() {
  return CUSTOMER_PREFERENCES.filter((preference) => {
    if (state.gameMode !== "career") return true;
    return isCareerItemUnlocked(preference);
  });
}

function getInventoryCount() {
  return Object.values(state.inventory).reduce((total, count) => total + count, 0);
}

function getStorageLimit() {
  return BASE_STORAGE_LIMIT + getUpgradeLevel("fridge") * 4;
}

function addInventoryAmount(id, amount) {
  const safeAmount = Math.max(0, Math.floor(amount));
  if (!safeAmount) return 0;
  const space = Math.max(0, getStorageLimit() - getInventoryCount());
  const added = Math.min(space, safeAmount);
  if (added <= 0) return 0;
  state.inventory[id] = (state.inventory[id] || 0) + added;
  return added;
}

function pickTargetRecipe() {
  const recipes = getUnlockedRecipes();
  return recipes[Math.floor(Math.random() * recipes.length)] || RECIPES[0];
}

function resetServiceDay() {
  if (state.gameMode === "career") {
    resetCareerService();
    return;
  }
  state.day = Math.max(1, state.day || (state.history.at(-1)?.day || 0) + 1);
  state.orderIndex = 0;
  state.helperCooldown = Math.max(0, 34 - getUpgradeLevel("assistant") * 5);
  state.dailyEvent = pickDailyEvent();
  state.orderQueue = [makeChallengeOrder()];
  state.targetRecipe = state.orderQueue[0].recipe;
  state.serviceStats = {
    completedOrders: 0,
    failedJudgements: 0,
    bestScore: 0,
    coinsEarned: 0,
    reputationEarned: 0,
    dishes: [],
    penaltyScore: 0,
  };
  state.currentQuest = null;
  state.lastChallengeQuestId = null;
}

function makeChallengeOrder(previousRecipeId = state.orderQueue.at(-1)?.recipe?.id || null) {
  const unlockedRecipes = getUnlockedRecipes();
  let recipe = pickTargetRecipe();
  if (recipe.id === previousRecipeId && unlockedRecipes.length > 1) {
    recipe = unlockedRecipes[(unlockedRecipes.findIndex((item) => item.id === recipe.id) + 1) % unlockedRecipes.length] || recipe;
  }
  const completedOrders = state.serviceStats?.completedOrders || 0;
  const baseRequiredScore = 76 + Math.min(18, Math.floor(completedOrders / 2) * 2);
  return {
    recipe,
    requiredScore: applyDailyRequiredScore(recipe, baseRequiredScore),
    customer: pickCustomerPreference(),
  };
}

function queueNextChallengeOrder() {
  state.orderQueue.push(makeChallengeOrder());
}

function resetCareerService() {
  const previousDay = state.day || 0;
  if (!state.careerData) state.careerData = createCareerData({ day: previousDay });
  state.day = (state.day || 0) + 1;
  state.orderIndex = 0;
  state.helperCooldown = Math.max(0, 34 - getUpgradeLevel("assistant") * 5);
  state.dailyEvent = pickDailyEvent();
  advanceGreenhouseBeds(Math.max(1, state.day - previousDay));
  const newlyUnlockedRegions = unlockCareerRegions(previousDay, state.day);
  ensureCareerMarketOffer();
  const recipe = pickTargetRecipe();
  state.orderQueue = [
    {
      recipe,
      requiredScore: THREE.MathUtils.clamp(
        applyDailyRequiredScore(recipe, 72 + Math.min(18, state.day) - getUpgradeLevel("hospitality") * 3),
        60,
        96,
      ),
      customer: pickCustomerPreference(),
    },
  ];
  state.targetRecipe = recipe;
  if (!state.serviceStats) {
    state.serviceStats = {
      completedOrders: 0,
      failedJudgements: 0,
      bestScore: 0,
      coinsEarned: 0,
      reputationEarned: 0,
      dishes: [],
    };
  }
  maybeShowCareerUnlocks(previousDay, state.day, newlyUnlockedRegions);
}

function maybeShowCareerUnlocks(previousDay, currentDay, unlockedRegions = []) {
  const unlockedRecipes = RECIPES.filter((recipe) => recipe.unlockDay && recipe.unlockDay > previousDay && recipe.unlockDay <= currentDay);
  const unlockedUpgrades = UPGRADES.filter((upgrade) => upgrade.careerOnly && upgrade.unlockDay && upgrade.unlockDay > previousDay && upgrade.unlockDay <= currentDay);
  const messages = [
    ...unlockedRegions.map((region) => `새 지역 해금: ${region.name}`),
    ...unlockedRecipes.map((recipe) => `새 레시피 해금: ${recipe.name}`),
    ...unlockedUpgrades.map((upgrade) => `새 성장 업그레이드 해금: ${upgrade.name}`),
  ];
  if (messages.length) {
    showToast(messages.join(" · "));
  }
}

function makeDailyOrders() {
  const orders = [];
  let previousRecipeId = null;
  const orderCount = getDayOrderCount();
  for (let index = 0; index < orderCount; index += 1) {
    let recipe = pickTargetRecipe();
    if (recipe.id === previousRecipeId) {
      const recipes = getUnlockedRecipes();
      recipe = recipes[(recipes.findIndex((item) => item.id === recipe.id) + 1) % recipes.length] || recipe;
    }
    previousRecipeId = recipe.id;
    const baseRequiredScore = ORDER_SCORE_STEPS[index] || REQUIRED_SCORE;
    orders.push({
      recipe,
      requiredScore: applyDailyRequiredScore(recipe, baseRequiredScore),
      customer: pickCustomerPreference(),
    });
  }
  return orders;
}

function getDayOrderCount() {
  return state.reputation >= REPUTATION_UNLOCKS.longService ? 4 : DAY_ORDER_COUNT;
}

function pickDailyEvent() {
  const events = DAILY_EVENTS.filter(isUnlocked);
  return events[Math.floor(Math.random() * events.length)] || DAILY_EVENTS[0];
}

function pickCustomerPreference() {
  const preferences = getAvailableCustomerPreferences();
  if (state.gameMode !== "career") {
    return preferences[Math.floor(Math.random() * preferences.length)] || CUSTOMER_PREFERENCES[0];
  }

  const advanced = preferences.filter((preference) => preference.unlockCareerLevel);
  const basic = preferences.filter((preference) => !preference.unlockCareerLevel);
  const advancedChance = Math.min(0.15 + getUpgradeLevel("reservations") * 0.18, 0.75);
  const pool = advanced.length && Math.random() < advancedChance ? advanced : basic;
  return pool[Math.floor(Math.random() * pool.length)] || preferences[0] || CUSTOMER_PREFERENCES[0];
}

function applyDailyRequiredScore(recipe, baseScore) {
  const event = state.dailyEvent;
  const recipeDelta = event?.recipeRequiredDeltas?.[recipe.id] || 0;
  return THREE.MathUtils.clamp(baseScore + (event?.requiredDelta || 0) + recipeDelta, 60, 95);
}

function getCurrentOrder() {
  if (!state.orderQueue.length) resetServiceDay();
  return state.orderQueue[Math.min(state.orderIndex, state.orderQueue.length - 1)];
}

function getTargetRecipe() {
  const order = getCurrentOrder();
  state.targetRecipe = order.recipe;
  return order.recipe;
}

function getRequiredScore() {
  return getCurrentOrder().requiredScore;
}

function getCustomerPreference() {
  return getCurrentOrder().customer;
}

function getOrderLabel() {
  if (state.gameMode === "challenge") {
    return `${getChallengeOrderNumber()}번째`;
  }
  return `${Math.min(state.orderIndex + 1, state.orderQueue.length)}/${state.orderQueue.length}`;
}

function getCareerRestaurantLevel() {
  return Math.max(1, 1 + Math.floor(state.reputation / 35));
}

function getCareerNextLevelReputation() {
  return getCareerRestaurantLevel() * 35;
}

function getCareerRegion(id = state.careerData?.currentRegion || "restaurant") {
  return CAREER_REGIONS.find((region) => region.id === id) || CAREER_REGIONS[0];
}

function getCareerRegionName(id = state.careerData?.currentRegion || "restaurant") {
  return getCareerRegion(id).name;
}

function getCareerProgressSummary() {
  const stats = state.careerStats || createCareerStats();
  return `${getCareerRegionName()} · 식당 Lv.${getCareerRestaurantLevel()} · 총매출 ${stats.totalSales}코인 · 손님 ${stats.customersServed}명`;
}

function unlockCareerRegions(previousDay = 0, currentDay = state.day || 0) {
  if (!state.careerData) state.careerData = createCareerData({ day: currentDay });
  const newlyUnlocked = [];
  for (const region of CAREER_REGIONS) {
    if (region.unlockDay > previousDay && region.unlockDay <= currentDay && !state.careerData.unlockedRegions.includes(region.id)) {
      state.careerData.unlockedRegions.push(region.id);
      newlyUnlocked.push(region);
    }
  }
  state.careerData.lastUnlockCheckDay = Math.max(state.careerData.lastUnlockCheckDay || 0, currentDay);
  return newlyUnlocked;
}

function isCareerRegionUnlocked(regionId) {
  return Boolean(state.careerData?.unlockedRegions?.includes(regionId));
}

function ensureCareerMarketOffer() {
  if (!state.careerData) state.careerData = createCareerData({ day: state.day });
  if (!state.careerData.marketOffer || state.careerData.marketOffer.day !== state.day) {
    state.careerData.marketOffer = createMarketOffer(state.day || 1);
  }
}

function advanceGreenhouseBeds(dayDelta = 1) {
  if (!state.careerData?.greenhouse?.length || dayDelta <= 0) return;
  for (const bed of state.careerData.greenhouse) {
    if (!bed.cropId || bed.ready) continue;
    bed.stage = Math.min(2, bed.stage + dayDelta);
    if (bed.stage >= 2) bed.ready = true;
  }
}

function isCareerRecipeUnlocked(recipe) {
  return !recipe.unlockDay || state.day >= recipe.unlockDay;
}

function isCareerItemUnlocked(item) {
  if (item.careerOnly && state.gameMode !== "career") return false;
  if (item.unlockDay && state.gameMode === "career" && state.day < item.unlockDay) return false;
  if (item.unlockCareerLevel && state.gameMode === "career" && getCareerRestaurantLevel() < item.unlockCareerLevel) return false;
  if (item.unlockReputation && state.reputation < item.unlockReputation) return false;
  return true;
}

function getUnlockHint(item) {
  if (state.gameMode === "career" && item.unlockDay) {
    return `${item.unlockDay}일차에 해금됩니다.`;
  }
  if (state.gameMode === "career" && item.unlockCareerLevel) {
    return `식당 Lv.${item.unlockCareerLevel}에 해금됩니다.`;
  }
  if (item.unlockReputation) {
    return `평판 ${item.unlockReputation} 이상에서 해금됩니다.`;
  }
  return "아직 해금되지 않았습니다.";
}

function getObjectiveSummary() {
  if (!state.orderQueue.length) {
    return state.gameMode === "career"
      ? "성장 모드에서는 손님 주문을 계속 받아 식당을 키워갑니다."
      : "챌린지 모드에서는 제한 시간 동안 주문을 최대한 많이 완성합니다.";
  }

  if (state.gameMode === "career") {
    const region = getCareerRegion();
    if (region.id === "market") {
      const offer = state.careerData?.marketOffer || createMarketOffer(state.day || 1);
      return `${region.name}: ${getIngredientName(offer.ingredientId)} ${offer.quantity}개 묶음 흥정 가능 · ${getCareerProgressSummary()}`;
    }
    if (region.id === "forest") {
      return `${region.name}: 채집 포인트를 기억해 무료 재료를 모으세요 · ${getCareerProgressSummary()}`;
    }
    if (region.id === "greenhouse") {
      const readyCount = state.careerData?.greenhouse?.filter((bed) => bed.ready).length || 0;
      return `${region.name}: 수확 가능 화분 ${readyCount}개 · ${getCareerProgressSummary()}`;
    }
    return `${state.day}일차 손님: ${getTargetRecipe().name} ${getRequiredScore()}점 이상 · ${getCustomerPreference().name} · ${getCareerProgressSummary()}`;
  }

  return `챌린지 주문 ${getOrderLabel()}: ${getTargetRecipe().name} ${getRequiredScore()}점 이상 · ${getCustomerPreference().name} · 누적 ${getChallengeRunScore()}점 · 완료 ${state.serviceStats?.completedOrders || 0}개`;
}

function openRecipeNote(options = {}) {
  if (!state.running || state.gameOver || state.minigame?.active) return;

  const cards = getUnlockedRecipes().map((recipe) => {
    const record = state.recipeRecords[recipe.id];
    const isTarget = getTargetRecipe().id === recipe.id;
    const research = getUpgradeLevel("research");
    const researchText = makeRecipeResearchText(recipe, record, research);
    const recordText = record
      ? `
        <div class="recipe-record">
          <strong>최고 ${record.bestScore}점</strong>
          <span>최근 ${record.lastScore}점 · ${record.attempts}회 평가</span>
          <span>예상 점수대 ${record.estimatedLow}-${record.estimatedHigh}점</span>
          <span>${record.lastIngredients}</span>
        </div>
      `
      : `<div class="recipe-record muted-record">아직 평가 기록이 없습니다.</div>`;

    return `
      <article class="choice-card recipe-card ${isTarget ? "target-recipe-card" : ""}">
        <h3>${recipe.name}${isTarget ? " · 현재 주문" : ""}</h3>
        <p>${recipe.hint}</p>
        <p>${recipe.warning}</p>
        ${researchText}
        ${recordText}
      </article>
    `;
  }).join("");
  const lockedCards = RECIPES.filter((recipe) => !isUnlocked(recipe))
    .map(
      (recipe) => `
        <article class="choice-card recipe-card muted-record">
          <h3>잠긴 레시피</h3>
          <p>${recipe.name}은 ${state.gameMode === "career" && recipe.unlockDay ? `${recipe.unlockDay}일차부터 주방 노트에 추가됩니다.` : getUnlockHint(recipe)}</p>
        </article>
      `,
    )
    .join("");

  openModal(`
    <h2>레시피 노트</h2>
    <p>${state.gameMode === "career" ? `현재 손님은 ${getTargetRecipe().name}을 원하고, 목표는 ${getRequiredScore()}점 이상입니다. 취향은 ${getCustomerPreference().name}입니다.` : `현재 주문은 ${getOrderLabel()} ${getTargetRecipe().name}, 목표 ${getRequiredScore()}점 이상입니다. 손님 취향은 ${getCustomerPreference().name}입니다.`}</p>
    <article class="choice-card">
      <h3>오늘의 이벤트: ${state.dailyEvent.name}</h3>
      <p>${state.dailyEvent.description}</p>
    </article>
    <div class="grid-list recipe-grid">${cards}${lockedCards}</div>
  `, { returnTo: options.returnTo || null });
}

function makeRecipeResearchText(recipe, record, level) {
  if (level <= 0) return "";
  const needs = Object.entries(recipe.needs)
    .map(([trait]) => TRAIT_LABELS[trait])
    .join(", ");
  if (level === 1) {
    return `<p><strong>연구 Lv.1:</strong> 핵심 맛은 ${needs}입니다.</p>`;
  }
  const amounts = Object.entries(recipe.needs)
    .map(([trait, value]) => `${TRAIT_LABELS[trait]} 약 ${value}`)
    .join(" · ");
  if (level === 2 || !record) {
    return `<p><strong>연구 Lv.2:</strong> ${amounts}</p>`;
  }
  return `<p><strong>연구 Lv.3:</strong> 최근 성공 조합은 ${record.lastIngredients || "아직 없음"}입니다.</p>`;
}

function openCooking() {
  const owned = getUnlockedIngredients().filter((ingredient) => state.inventory[ingredient.id] > 0);
  const selectedCounts = countSelectedIngredients();
  const selectedList = state.selectedIngredients.length
    ? `<div class="selected-list">
        ${state.selectedIngredients
          .map(
            (id, index) => `
              <div class="selected-pill">
                <span>${index + 1}. ${getIngredientName(id)}</span>
                <button type="button" data-remove-selected="${index}">빼기</button>
              </div>
            `,
          )
          .join("")}
      </div>`
    : `<p>아직 없습니다.</p>`;

  openModal(`
    <h2>조리대</h2>
    <p>${state.gameMode === "career" ? "재료 3개를 골라 손님이 원하는 요리를 완성하세요. 좋은 점수를 받을수록 더 많은 코인과 평판을 얻습니다." : "재료 3개를 골라 목표 요리에 맞는 맛의 균형을 만드세요. 같은 재료도 보유 수량만큼 넣을 수 있습니다."}</p>
    <div class="grid-list">
      ${
        owned.length
          ? owned
              .map(
                (ingredient) => {
                  const selectedCount = selectedCounts[ingredient.id] || 0;
          const canAdd =
            state.selectedIngredients.length < 3 && selectedCount < state.inventory[ingredient.id];
          return `
          <article class="choice-card ingredient-card ${selectedCount ? "selected" : ""}">
            ${ingredientImage(ingredient)}
            <h3>${ingredient.name} × ${state.inventory[ingredient.id]}</h3>
            <p>${formatTraits(ingredient.traits)}</p>
            <p>선택 ${selectedCount}/${state.inventory[ingredient.id]}</p>
            <button class="select-button" type="button" data-select="${ingredient.id}" ${canAdd ? "" : "disabled"}>
              ${canAdd ? "추가" : selectedCount ? "수량 한도" : "가득 참"}
            </button>
          </article>
        `;
                },
              )
              .join("")
          : `<p>가방이 비었습니다. 상점에서 재료를 사야 합니다.</p>`
      }
    </div>
    <div class="grid-list">
      <article class="choice-card">
        <h3>선택한 재료</h3>
        ${selectedList}
        <button type="button" data-cook="true" ${state.selectedIngredients.length !== 3 ? "disabled" : ""}>
          요리하기
        </button>
      </article>
      <article class="choice-card">
        <h3>레시피 힌트</h3>
        <p>${state.gameMode === "career" ? `현재 손님은 ${getTargetRecipe().name}, 목표 ${getRequiredScore()}점 이상입니다.` : `현재 주문은 ${getOrderLabel()} ${getTargetRecipe().name}, 목표 ${getRequiredScore()}점 이상입니다.`}</p>
        <p>손님 취향: ${getCustomerPreference().name} · ${getCustomerPreference().description}</p>
        <p>오늘 이벤트: ${state.dailyEvent.name}</p>
        <div class="mode-actions">
          <button class="buy-button" type="button" data-open-recipes="true">노트 열기</button>
          <button class="buy-button secondary-action" type="button" data-abandon-order="true">요리 포기</button>
        </div>
      </article>
    </div>
  `);

  dom.modalContent.querySelectorAll("[data-select]").forEach((button) => {
    button.addEventListener("click", () => {
      addIngredientSelection(button.dataset.select);
      openCooking();
    });
  });

  dom.modalContent.querySelectorAll("[data-remove-selected]").forEach((button) => {
    button.addEventListener("click", () => {
      removeIngredientSelection(Number(button.dataset.removeSelected));
      openCooking();
    });
  });

  const cookButton = dom.modalContent.querySelector("[data-cook]");
  if (cookButton) {
    cookButton.addEventListener("click", () => {
      cookDish();
    });
  }

  const recipesButton = dom.modalContent.querySelector("[data-open-recipes]");
  if (recipesButton) {
    recipesButton.addEventListener("click", () => openRecipeNote({ returnTo: "cooking" }));
  }
  dom.modalContent.querySelector("[data-abandon-order]")?.addEventListener("click", openAbandonOrderConfirm);
}

function addIngredientSelection(id) {
  if (state.selectedIngredients.length >= 3) {
    showToast("재료는 3개까지만 고를 수 있습니다.");
    return;
  }

  const selectedCounts = countSelectedIngredients();
  if ((selectedCounts[id] || 0) >= (state.inventory[id] || 0)) {
    showToast("보유한 수량만큼만 넣을 수 있습니다.");
    return;
  }

  state.selectedIngredients.push(id);
}

function removeIngredientSelection(index) {
  if (!Number.isInteger(index)) return;
  state.selectedIngredients.splice(index, 1);
}

function cookDish() {
  if (state.selectedIngredients.length !== 3) return;
  if (state.pendingDish) {
    showToast("완성한 요리를 먼저 평가 테이블에 가져가세요.");
    return;
  }

  const selectedCounts = countSelectedIngredients();
  for (const [id, count] of Object.entries(selectedCounts)) {
    if ((state.inventory[id] || 0) < count) {
      showToast("선택한 재료가 부족합니다.");
      return;
    }
  }

  for (const [id, count] of Object.entries(selectedCounts)) {
    state.inventory[id] -= count;
    if (state.inventory[id] <= 0) delete state.inventory[id];
  }

  const ingredients = state.selectedIngredients.map((id) => INGREDIENTS.find((item) => item.id === id));
  const traits = mergeTraits(ingredients);
  const speedDebuff = Boolean(state.pvpNextMinigameSpeedDebuff);
  state.pvpNextMinigameSpeedDebuff = false;
  state.minigame = {
    active: true,
    cooking: { ingredients, traits },
    type: chooseCookingMiniGame(),
    speedDebuff,
  };
  state.selectedIngredients = [];
  updateHud();
  openCookingMiniGame();
}

function countSelectedIngredients() {
  return state.selectedIngredients.reduce((counts, id) => {
    counts[id] = (counts[id] || 0) + 1;
    return counts;
  }, {});
}

function chooseCookingMiniGame() {
  const games = ["timing", "heat", "chop", "bubble", "knead", "plating"];
  return games[Math.floor(Math.random() * games.length)];
}

function openCookingMiniGame() {
  if (!state.minigame?.active) return;
  const type = state.minigame.type;
  if (type === "heat") { openHeatMinigame(); return; }
  if (type === "chop") { openChopMinigame(); return; }
  if (type === "bubble") { openBubbleMinigame(); return; }
  if (type === "knead") { openKneadMinigame(); return; }
  if (type === "plating") { openPlatingMinigame(); return; }
  openTimingMinigame();
}

function handleCookingMiniGameAction() {
  if (!state.minigame?.active) return;
  const type = state.minigame.type;
  if (type === "chop") { chopIngredient(); return; }
  if (type === "timing") { hitTimingBar(); }
}

function openTimingMinigame() {
  Object.assign(state.minigame, {
    step: 0,
    results: [],
    position: 8,
    direction: 1,
    lastFrame: performance.now(),
    frameId: null,
  });

  openModal(`
    <h2>요리 타이밍</h2>
    <p>움직이는 표시가 가운데 초록 영역에 왔을 때 맞추세요. 3번의 결과가 요리 점수의 30%를 차지합니다.</p>
    <div class="timing-stage">
      <div class="timing-status">
        <strong id="timing-step">1 / 3</strong>
        <span id="timing-feedback">냄비가 보글보글 끓고 있습니다.</span>
      </div>
      <div class="timing-track" aria-label="요리 타이밍 바">
        <div class="timing-zone timing-good"></div>
        <div class="timing-zone timing-perfect"></div>
        <div id="timing-cursor" class="timing-cursor"></div>
      </div>
      <button id="timing-hit-button" type="button">맞추기</button>
    </div>
  `);

  const hitButton = dom.modalContent.querySelector("#timing-hit-button");
  hitButton.addEventListener("click", hitTimingBar);
  animateTimingBar();
}

function animateTimingBar() {
  const minigame = state.minigame;
  if (!minigame?.active) return;

  const now = performance.now();
  const dt = Math.min((now - minigame.lastFrame) / 1000, 0.05);
  minigame.lastFrame = now;
  minigame.position += minigame.direction * dt * (minigame.speedDebuff ? 140 : 78);

  if (minigame.position >= 100) {
    minigame.position = 100;
    minigame.direction = -1;
  }

  if (minigame.position <= 0) {
    minigame.position = 0;
    minigame.direction = 1;
  }

  const cursor = dom.modalContent.querySelector("#timing-cursor");
  if (cursor) cursor.style.left = `${minigame.position}%`;

  minigame.frameId = requestAnimationFrame(animateTimingBar);
}

function hitTimingBar() {
  const minigame = state.minigame;
  if (!minigame?.active) return;

  const distance = Math.abs(minigame.position - 50);
  let result = { label: "Miss", score: 25, className: "miss" };
  if (distance <= 6) {
    result = { label: "Perfect", score: 100, className: "perfect" };
    playSuccess();
  } else if (distance <= 18) {
    result = { label: "Good", score: 70, className: "good" };
    playCoin();
  } else {
    playFail();
  }

  minigame.results.push(result);
  minigame.step += 1;
  minigame.position = minigame.step % 2 === 0 ? 8 : 92;
  minigame.direction = minigame.step % 2 === 0 ? 1 : -1;

  const feedback = dom.modalContent.querySelector("#timing-feedback");
  const step = dom.modalContent.querySelector("#timing-step");
  if (feedback) {
    feedback.textContent = `${result.label}! ${formatTimingResults(minigame.results)}`;
    feedback.className = result.className;
  }
  if (step) step.textContent = `${Math.min(minigame.step + 1, 3)} / 3`;

  if (minigame.step >= 3) {
    finishTimingMinigame();
  }
}

function finishTimingMinigame() {
  const minigame = state.minigame;
  if (!minigame) return;

  cancelAnimationFrame(minigame.frameId);
  const miniGameScore = Math.round(
    minigame.results.reduce((total, result) => total + result.score, 0) / minigame.results.length,
  );
  finishCookingMinigame(miniGameScore, minigame.results.map((result) => result.label));
}

function openHeatMinigame() {
  Object.assign(state.minigame, {
    heat: 42,
    direction: 1,
    scoreTicks: 0,
    totalTicks: 0,
    secondsLeft: 7,
    lastFrame: performance.now(),
    frameId: null,
  });

  openModal(`
    <h2>불 조절</h2>
    <p>온도를 초록 구간에 오래 유지하세요. 불 올리기와 불 낮추기로 냄비의 열을 조절합니다.</p>
    <div class="heat-stage">
      <div class="heat-status">
        <strong id="heat-timer">7초</strong>
        <span id="heat-feedback">초록 구간을 유지하세요.</span>
      </div>
      <div class="heat-gauge">
        <div class="heat-zone"></div>
        <div id="heat-level" class="heat-level"></div>
      </div>
      <div class="heat-controls">
        <button type="button" data-heat-down="true">불 낮추기</button>
        <button type="button" data-heat-up="true">불 올리기</button>
      </div>
    </div>
  `);

  dom.modalContent.querySelector("[data-heat-down]").addEventListener("click", () => adjustHeat(-18));
  dom.modalContent.querySelector("[data-heat-up]").addEventListener("click", () => adjustHeat(18));
  animateHeatMinigame();
}

function adjustHeat(amount) {
  const minigame = state.minigame;
  if (!minigame?.active || minigame.type !== "heat") return;
  minigame.heat = THREE.MathUtils.clamp(minigame.heat + amount, 0, 100);
  playWork();
}

function animateHeatMinigame() {
  const minigame = state.minigame;
  if (!minigame?.active || minigame.type !== "heat") return;

  const now = performance.now();
  const dt = Math.min((now - minigame.lastFrame) / 1000, 0.05);
  minigame.lastFrame = now;
  minigame.secondsLeft = Math.max(0, minigame.secondsLeft - dt);
  minigame.heat = THREE.MathUtils.clamp(
    minigame.heat + minigame.direction * dt * 16 + Math.sin(now * 0.003) * 0.3,
    0,
    100,
  );

  if (minigame.heat >= 94) minigame.direction = -1;
  if (minigame.heat <= 6) minigame.direction = 1;

  minigame.totalTicks += 1;
  const inZone = minigame.heat >= 42 && minigame.heat <= 62;
  if (inZone) minigame.scoreTicks += 1;

  const level = dom.modalContent.querySelector("#heat-level");
  const timer = dom.modalContent.querySelector("#heat-timer");
  const feedback = dom.modalContent.querySelector("#heat-feedback");
  if (level) level.style.left = `${minigame.heat}%`;
  if (timer) timer.textContent = `${Math.ceil(minigame.secondsLeft)}초`;
  if (feedback) {
    feedback.textContent = inZone ? "좋은 온도입니다." : minigame.heat < 42 ? "조금 더 올리세요." : "불이 너무 셉니다.";
    feedback.className = inZone ? "perfect" : "miss";
  }

  if (minigame.secondsLeft <= 0) {
    finishHeatMinigame();
    return;
  }

  minigame.frameId = requestAnimationFrame(animateHeatMinigame);
}

function finishHeatMinigame() {
  const minigame = state.minigame;
  if (!minigame) return;
  cancelAnimationFrame(minigame.frameId);
  const ratio = minigame.totalTicks ? minigame.scoreTicks / minigame.totalTicks : 0;
  const score = Math.round(35 + ratio * 65);
  finishCookingMinigame(score, [`온도 유지 ${Math.round(ratio * 100)}%`]);
}

function openChopMinigame() {
  Object.assign(state.minigame, {
    step: 0,
    results: [],
    position: 12,
    direction: 1,
    lastFrame: performance.now(),
    frameId: null,
  });

  const ingredient = state.minigame.cooking.ingredients[0];
  openModal(`
    <h2>재료 썰기</h2>
    <p>칼 표시가 가운데 초록 구간에 왔을 때 썰기를 누르세요. 4번 썰어 고르게 준비합니다.</p>
    <div class="chop-stage">
      <div class="chop-board">
        ${ingredientImage(ingredient)}
        <div id="knife-marker" class="knife-marker"></div>
        <div class="chop-perfect-zone"></div>
        <div class="chop-good-zone"></div>
      </div>
      <div class="timing-status">
        <strong id="chop-step">1 / 4</strong>
        <span id="chop-feedback">칼 위치를 보고 썰어주세요.</span>
      </div>
      <button id="chop-button" type="button">썰기</button>
    </div>
  `);

  dom.modalContent.querySelector("#chop-button").addEventListener("click", chopIngredient);
  animateChopMinigame();
}

function animateChopMinigame() {
  const minigame = state.minigame;
  if (!minigame?.active || minigame.type !== "chop") return;

  const now = performance.now();
  const dt = Math.min((now - minigame.lastFrame) / 1000, 0.05);
  minigame.lastFrame = now;
  minigame.position += minigame.direction * dt * 86;

  if (minigame.position >= 100) {
    minigame.position = 100;
    minigame.direction = -1;
  }

  if (minigame.position <= 0) {
    minigame.position = 0;
    minigame.direction = 1;
  }

  const knife = dom.modalContent.querySelector("#knife-marker");
  if (knife) knife.style.left = `${minigame.position}%`;
  minigame.frameId = requestAnimationFrame(animateChopMinigame);
}

function chopIngredient() {
  const minigame = state.minigame;
  if (!minigame?.active || minigame.type !== "chop") return;

  const distance = Math.abs(minigame.position - 50);
  let result = { label: "삐뚤", score: 30, className: "miss" };
  if (distance <= 7) {
    result = { label: "정갈", score: 100, className: "perfect" };
    playSuccess();
  } else if (distance <= 20) {
    result = { label: "무난", score: 72, className: "good" };
    playCoin();
  } else {
    playFail();
  }

  minigame.results.push(result);
  minigame.step += 1;
  minigame.position = minigame.step % 2 === 0 ? 12 : 88;
  minigame.direction = minigame.step % 2 === 0 ? 1 : -1;

  const feedback = dom.modalContent.querySelector("#chop-feedback");
  const step = dom.modalContent.querySelector("#chop-step");
  if (feedback) {
    feedback.textContent = `${result.label}! ${formatTimingResults(minigame.results)}`;
    feedback.className = result.className;
  }
  if (step) step.textContent = `${Math.min(minigame.step + 1, 4)} / 4`;

  if (minigame.step >= 4) {
    finishChopMinigame();
  }
}

function finishChopMinigame() {
  const minigame = state.minigame;
  if (!minigame) return;
  cancelAnimationFrame(minigame.frameId);
  const score = Math.round(
    minigame.results.reduce((total, result) => total + result.score, 0) / minigame.results.length,
  );
  finishCookingMinigame(score, minigame.results.map((result) => result.label));
}

// ── 물 끓이기 리듬 (bubble) ──────────────────────────────

const BUBBLE_DURATION = 10;
const BUBBLE_TARGET_MIN = 60;
const BUBBLE_TARGET_MAX = 80;
const BUBBLE_CRITICAL = 93;

function openBubbleMinigame() {
  Object.assign(state.minigame, {
    temp: 38, heatRate: 2.8, coolEffect: 0, heatBoost: 0,
    inZoneFrames: 0, totalFrames: 0,
    timeLeft: BUBBLE_DURATION, done: false,
    frameId: null, lastFrame: performance.now(),
  });

  openModal(`
    <h2>물 끓이기</h2>
    <p>${BUBBLE_TARGET_MIN}~${BUBBLE_TARGET_MAX}도 초록 구간을 유지하세요. 불을 조절해 온도를 맞추세요.</p>
    <div class="bubble-temp-stage">
      <div class="temp-gauge-wrap">
        <div class="temp-gauge-track">
          <div class="temp-critical-zone" style="bottom:${BUBBLE_CRITICAL}%;height:${100 - BUBBLE_CRITICAL}%"></div>
          <div class="temp-target-zone" style="bottom:${BUBBLE_TARGET_MIN}%;height:${BUBBLE_TARGET_MAX - BUBBLE_TARGET_MIN}%"></div>
          <div class="temp-fill" id="temp-fill" style="height:38%"></div>
          <div class="temp-label" id="temp-label">38°</div>
        </div>
      </div>
      <div class="bubble-controls-wrap">
        <div class="bubble-countdown" id="bubble-countdown">20.0</div>
        <div class="bubble-zone-rate" id="bubble-zone-rate">유지: 0%</div>
        <div class="bubble-fire-btns">
          <button type="button" class="bubble-heat-btn" id="bubble-heat-btn">🔥 불 키우기</button>
          <button type="button" class="bubble-cool-btn" id="bubble-cool-btn">💧 불 줄이기</button>
        </div>
        <div class="bubble-cool-status" id="bubble-cool-status"></div>
      </div>
    </div>
  `);

  dom.modalContent.querySelector("#bubble-heat-btn")?.addEventListener("click", () => {
    const mg = state.minigame;
    if (!mg?.active || mg.type !== "bubble" || mg.done) return;
    mg.heatBoost = 1.8;
    mg.coolEffect = 0;
    const st = dom.modalContent?.querySelector("#bubble-cool-status");
    if (st) st.textContent = "가열 중… 🔥";
  });

  dom.modalContent.querySelector("#bubble-cool-btn")?.addEventListener("click", () => {
    const mg = state.minigame;
    if (!mg?.active || mg.type !== "bubble" || mg.done) return;
    mg.coolEffect = 1.8;
    mg.heatBoost = 0;
    const st = dom.modalContent?.querySelector("#bubble-cool-status");
    if (st) st.textContent = "냉각 중… 💧";
  });

  animateBubble();
}

function animateBubble() {
  const mg = state.minigame;
  if (!mg?.active || mg.type !== "bubble") return;
  const now = performance.now();
  const dt = Math.min((now - mg.lastFrame) / 1000, 0.05);
  mg.lastFrame = now;
  mg.timeLeft = Math.max(0, mg.timeLeft - dt);

  mg.coolEffect = Math.max(0, mg.coolEffect - dt);
  mg.heatBoost = Math.max(0, mg.heatBoost - dt);
  const coolRate = 9.0;
  const effective = mg.coolEffect > 0 ? -coolRate : mg.heatBoost > 0 ? mg.heatRate * 3.5 : mg.heatRate;
  if (mg.coolEffect <= 0 && mg.heatBoost <= 0) {
    const st = dom.modalContent?.querySelector("#bubble-cool-status");
    if (st && st.textContent) st.textContent = "";
  }

  mg.temp = Math.max(0, Math.min(100, mg.temp + effective * dt));
  if (mg.temp >= BUBBLE_CRITICAL) mg.temp = Math.max(BUBBLE_TARGET_MAX, mg.temp - dt * 12);

  mg.totalFrames += 1;
  const inZone = mg.temp >= BUBBLE_TARGET_MIN && mg.temp <= BUBBLE_TARGET_MAX;
  if (inZone) mg.inZoneFrames += 1;

  const fill = dom.modalContent?.querySelector("#temp-fill");
  const label = dom.modalContent?.querySelector("#temp-label");
  const countdown = dom.modalContent?.querySelector("#bubble-countdown");
  const rate = dom.modalContent?.querySelector("#bubble-zone-rate");
  if (fill) {
    const cls = mg.temp >= BUBBLE_CRITICAL ? "temp-critical" : inZone ? "temp-good" : "";
    fill.style.height = `${mg.temp}%`;
    fill.className = `temp-fill ${cls}`;
  }
  if (label) label.textContent = `${Math.round(mg.temp)}°`;
  if (countdown) countdown.textContent = mg.timeLeft.toFixed(1);
  if (rate) rate.textContent = `유지: ${Math.round((mg.inZoneFrames / Math.max(1, mg.totalFrames)) * 100)}%`;

  if (mg.timeLeft <= 0 && !mg.done) {
    mg.done = true;
    const ratio = mg.inZoneFrames / Math.max(1, mg.totalFrames);
    const score = Math.round(ratio * 100);
    const lbl = score >= 80 ? `완벽 (${score}%)` : score >= 60 ? `좋음 (${score}%)` : score >= 40 ? `보통 (${score}%)` : `아쉬움 (${score}%)`;
    setTimeout(() => finishCookingMinigame(score, [lbl]), 400);
    return;
  }
  mg.frameId = requestAnimationFrame(animateBubble);
}

function launchNextBubble() {} // deprecated
function hitBubble() {}       // deprecated
function recordBubbleResult() {} // deprecated

// ── 반죽 치기 (knead) ────────────────────────────────────

const KNEAD_DURATION = 10;

function openKneadMinigame() {
  Object.assign(state.minigame, {
    mashCount: 0, timeLeft: KNEAD_DURATION, done: false,
    frameId: null, lastFrame: performance.now(),
  });

  openModal(`
    <h2>반죽 치기</h2>
    <p>10초 안에 반죽을 최대한 많이 쳐주세요!</p>
    <div class="knead-stage">
      <div class="knead-countdown" id="knead-countdown">10.0</div>
      <div class="knead-dough" id="knead-dough">🍞</div>
      <div class="knead-mash-count" id="knead-mash-count">0</div>
      <div class="knead-progress-bar">
        <div id="knead-bar" class="knead-bar-fill" style="width:100%"></div>
      </div>
      <button type="button" id="knead-mash-btn" class="knead-btn knead-mash-btn">치기! 👊</button>
    </div>
  `);

  dom.modalContent.querySelector("#knead-mash-btn")?.addEventListener("click", () => {
    const mg = state.minigame;
    if (!mg?.active || mg.type !== "knead" || mg.done) return;
    mg.mashCount += 1;
    playWork();
    const dough = dom.modalContent?.querySelector("#knead-dough");
    if (dough) { dough.classList.add("knead-hit"); setTimeout(() => dough?.classList.remove("knead-hit"), 90); }
    const countEl = dom.modalContent?.querySelector("#knead-mash-count");
    if (countEl) countEl.textContent = String(mg.mashCount);
  });

  animateKnead();
}

function animateKnead() {
  const mg = state.minigame;
  if (!mg?.active || mg.type !== "knead") return;
  const now = performance.now();
  const dt = Math.min((now - mg.lastFrame) / 1000, 0.05);
  mg.lastFrame = now;
  mg.timeLeft = Math.max(0, mg.timeLeft - dt);

  const countdown = dom.modalContent?.querySelector("#knead-countdown");
  const bar = dom.modalContent?.querySelector("#knead-bar");
  if (countdown) countdown.textContent = mg.timeLeft.toFixed(1);
  if (bar) bar.style.width = `${(mg.timeLeft / KNEAD_DURATION) * 100}%`;

  if (mg.timeLeft <= 0 && !mg.done) {
    mg.done = true;
    const c = mg.mashCount;
    const score = c >= 60 ? 100 : c >= 50 ? 80 : c >= 40 ? 60 : 40;
    const label = c >= 60 ? `완벽 (${c}회)` : c >= 50 ? `좋음 (${c}회)` : c >= 40 ? `보통 (${c}회)` : `아쉬움 (${c}회)`;
    setTimeout(() => finishCookingMinigame(score, [label]), 400);
    return;
  }

  mg.frameId = requestAnimationFrame(animateKnead);
}

function pressKnead() {} // deprecated — kept to avoid reference errors

// ── 플레이팅 (plating) ───────────────────────────────────

function openPlatingMinigame() {
  const recipe = getCurrentOrder().recipe;
  const sorted = Object.entries(recipe.needs).sort((a, b) => b[1] - a[1]).slice(0, 3);
  const items = sorted.map(([trait]) => ({ trait, label: TRAIT_LABELS[trait] || trait }));

  Object.assign(state.minigame, {
    platingItems: items, currentItem: 0, results: [],
    itemY: -60, falling: false, caught: false,
    frameId: null, lastFrame: performance.now(),
  });

  const queueHtml = items.map((it, i) =>
    `<span class="${i === 0 ? "pf-current" : "pf-next"}" id="pf-q-${i}">${it.label}</span>`
  ).join(" ›&nbsp;");

  openModal(`
    <h2>플레이팅</h2>
    <p>재료가 접시 위에 왔을 때 <strong>담기!</strong> 버튼을 누르세요.</p>
    <div class="plating-fall-stage">
      <div class="plating-fall-track" id="pf-track">
        <div class="plating-fall-item" id="pf-item" style="top:-60px">${items[0].label}</div>
        <div class="plating-plate-zone">🍽️</div>
        <div class="plating-hit-zone-marker"></div>
      </div>
      <div class="plating-fall-result" id="pf-result"></div>
      <div class="plating-fall-queue">${queueHtml}</div>
    </div>
    <button type="button" class="plating-catch-btn" id="plating-catch-btn">담기! 🎯</button>
  `);

  dom.modalContent.querySelector("#plating-catch-btn")?.addEventListener("click", catchPlatingItem);
  launchPlatingItem();
}

function launchPlatingItem() {
  const mg = state.minigame;
  if (!mg?.active || mg.type !== "plating") return;
  mg.itemY = -60;
  mg.falling = true;
  mg.caught = false;
  mg.lastFrame = performance.now();
  const item = dom.modalContent?.querySelector("#pf-item");
  if (item) {
    item.textContent = mg.platingItems[mg.currentItem]?.label || "";
    item.style.top = "-60px";
    item.className = "plating-fall-item";
  }
  animatePlating();
}

function animatePlating() {
  const mg = state.minigame;
  if (!mg?.active || mg.type !== "plating" || !mg.falling) return;
  const now = performance.now();
  const dt = Math.min((now - mg.lastFrame) / 1000, 0.05);
  mg.lastFrame = now;
  mg.itemY += dt * 220;

  const itemEl = dom.modalContent?.querySelector("#pf-item");
  if (itemEl) itemEl.style.top = `${mg.itemY}px`;

  if (mg.itemY > 310 && !mg.caught) {
    recordPlatingResult({ label: "놓침", score: 20 });
    return;
  }
  mg.frameId = requestAnimationFrame(animatePlating);
}

function catchPlatingItem() {
  const mg = state.minigame;
  if (!mg?.active || mg.type !== "plating" || !mg.falling || mg.caught) return;
  mg.caught = true;
  mg.falling = false;
  cancelAnimationFrame(mg.frameId);
  const y = mg.itemY;
  let result;
  if (y >= 175 && y <= 225) result = { label: "완벽", score: 100 };
  else if (y >= 135 && y <= 265) result = { label: "좋음", score: 72 };
  else result = { label: "빗나감", score: 25 };
  const itemEl = dom.modalContent?.querySelector("#pf-item");
  if (itemEl) itemEl.classList.add(result.score >= 100 ? "pf-perfect" : result.score >= 72 ? "pf-good" : "pf-miss");
  recordPlatingResult(result);
}

function recordPlatingResult(result) {
  const mg = state.minigame;
  mg.results.push(result);
  if (result.score >= 72) playSuccess(); else playFail();
  const resultEl = dom.modalContent?.querySelector("#pf-result");
  if (resultEl) {
    resultEl.textContent = result.label;
    resultEl.className = `plating-fall-result ${result.score >= 100 ? "perfect" : result.score >= 72 ? "good" : "miss"}`;
  }
  mg.currentItem += 1;
  if (mg.currentItem >= mg.platingItems.length) {
    const score = Math.round(mg.results.reduce((s, r) => s + r.score, 0) / mg.results.length);
    setTimeout(() => finishCookingMinigame(score, mg.results.map((r) => r.label)), 700);
    return;
  }
  const qEl = dom.modalContent?.querySelector(`#pf-q-${mg.currentItem - 1}`);
  if (qEl) qEl.className = "pf-done";
  const nextQEl = dom.modalContent?.querySelector(`#pf-q-${mg.currentItem}`);
  if (nextQEl) nextQEl.className = "pf-current";
  setTimeout(launchPlatingItem, 750);
}

function finishCookingMinigame(miniGameScore, resultLabels) {
  const minigame = state.minigame;
  if (!minigame) return;

  const targetOrder = getCurrentOrder();
  const targetRecipe = targetOrder.recipe;
  const materialScore = scoreRecipeMatch(minigame.cooking.traits, targetRecipe);
  const preferenceScore = scoreCustomerPreference(minigame.cooking.traits, targetOrder.customer);
  const upgradeScore = getUpgradeLevel("tools") * 4;
  const finalScore = THREE.MathUtils.clamp(
    Math.round(materialScore * 0.7 + miniGameScore * 0.3 + preferenceScore + upgradeScore),
    0,
    100,
  );

  state.pendingDish = {
    name: targetRecipe.name,
    recipe: targetRecipe,
    requiredScore: targetOrder.requiredScore,
    orderNumber: state.gameMode === "challenge" ? getChallengeOrderNumber() : state.orderIndex + 1,
    ingredients: minigame.cooking.ingredients,
    traits: minigame.cooking.traits,
    materialScore,
    miniGameScore,
    preferenceScore,
    upgradeScore,
    timingResults: resultLabels.map((label) => ({ label })),
    score: finalScore,
  };
  state.minigame = null;
  playCook();
  // 미니게임 라운드 대부분이 완벽 판정이었을 때만 축하 연출을 넣는다.
  // 매 요리마다 터지면 금방 무뎌지므로 문턱은 유지하되, 연출 자체는 확실히 크게.
  if (miniGameScore >= 90) {
    spawnParticleBurst(window.innerWidth / 2, window.innerHeight / 2 - 60, {
      count: 28,
      spread: 160,
      size: 12,
      duration: 760,
    });
    triggerCameraShake(0.22, 380);
  }
  closeModal(false, true);
  showToast(`${targetRecipe.name} 완성! ${resultLabels.join(" · ")}`);
  updateHud();
}

function formatTimingResults(results) {
  return results.map((result) => result.label).join(" · ");
}

function scoreCustomerPreference(traits, preference) {
  if (!preference) return 0;
  if (preference.penalty && (traits[preference.trait] || 0) > preference.limit) {
    return -preference.penalty;
  }
  if (preference.bonus && (traits[preference.trait] || 0) >= preference.threshold) {
    return preference.bonus;
  }
  return 0;
}

function getDishIngredientCost(dish) {
  return (dish.ingredients || []).reduce((total, ingredient) => total + getIngredientPrice(ingredient), 0);
}

function getCareerSaleOutcome(dish) {
  const ingredientCost = getDishIngredientCost(dish);
  const level = getCareerRestaurantLevel();
  const baseMargin = 10 + level * 3;
  const qualityBonus = Math.max(0, Math.round((dish.score - 60) * 0.65));
  const preferenceBonus = dish.preferenceScore > 0 ? 4 : 0;
  const eventBonus = state.dailyEvent?.rewardBonus || 0;
  const rawSalePrice = Math.max(
    ingredientCost + 6,
    ingredientCost + baseMargin + qualityBonus + preferenceBonus + eventBonus,
  );
  const signboardMultiplier = 1 + getUpgradeLevel("signboard") * 0.05;
  const customerMultiplier = 1 + (getCustomerPreference()?.saleBonusMultiplier || 0);
  const salePrice = Math.round(rawSalePrice * signboardMultiplier * customerMultiplier);
  const reputationGain = Math.max(
    2,
    3
      + Math.floor(Math.max(0, dish.score - (dish.requiredScore || REQUIRED_SCORE)) / 8)
      + (dish.score >= 90 ? 1 : 0)
      + (dish.score >= 85 ? getUpgradeLevel("plating") : 0),
  );
  return {
    ingredientCost,
    salePrice,
    profit: Math.max(0, salePrice - ingredientCost),
    reputationGain,
  };
}

function showScoreboard(dish, passed) {
  if (state.gameMode === "career") {
    const requiredScore = dish.requiredScore || getRequiredScore();
    const nextSale = getCareerSaleOutcome(dish);
    state.scoreboardConclusion = passed ? { dish, playerRank: 1 } : null;

    openModal(`
      <h2>손님 평가</h2>
      <p>${dish.name} 심사가 끝났습니다. 햄스터 셰프는 ${dish.score}점을 받았습니다.</p>
      <article class="choice-card">
        <h3>${passed ? "판매 가능" : "다시 조리 필요"}</h3>
        <p>${passed ? `${requiredScore}점 목표를 넘겨 예상 판매가 ${nextSale.salePrice}코인, 순이익 ${nextSale.profit}코인을 받을 수 있습니다.` : `${requiredScore}점 이상을 받아야 이 손님에게 판매할 수 있습니다.`}</p>
        ${passed ? `<p>재료 원가 ${nextSale.ingredientCost}코인 · 평판 +${nextSale.reputationGain}</p>` : ""}
        <button type="button" data-scoreboard-close="true">${passed ? "손님에게 내기" : "다시 도전하기"}</button>
      </article>
    `, { returnTo: passed ? "complete-order" : null });

    const closeButton = dom.modalContent.querySelector("[data-scoreboard-close]");
    closeButton.addEventListener("click", () => {
      if (passed) {
        finishPassedScoreboard();
      } else {
        closeModal();
        showToast(`${dish.score}점 · 손님 기준에 조금 모자랍니다. 재료 조합을 다시 맞춰보세요.`);
      }
    });
    return;
  }

  dish.clearTime = dish.clearTime ?? getElapsedSeconds();

  if (state.gameMode === "challenge") {
    state.scoreboardConclusion = passed ? { dish, playerRank: 1 } : null;
    const buttonText = passed ? "다음 주문 받기" : "다시 도전하기";
    openModal(`
      <h2>심사 결과</h2>
      <article class="choice-card">
        <h3>${dish.name}</h3>
        <p id="scoreboard-score-value" style="font-size:2rem;font-weight:700;margin:0.25em 0">0점</p>
        <p>${passed ? "통과! 계속 이어갑니다." : `${dish.requiredScore || getRequiredScore()}점 이상이어야 통과합니다.`}</p>
        <button type="button" data-scoreboard-close="true">${buttonText}</button>
      </article>
    `, { returnTo: passed ? "complete-order" : null });

    const scoreEl = dom.modalContent.querySelector("#scoreboard-score-value");
    animateCountUp(scoreEl, dish.score, 480, {
      format: (n) => `${n}점`,
      onDone: () => {
        // 점수 상관없이 카운트업이 끝나면 항상 한 번 팝 — 숫자가 그냥 멈추지 않고 착지하는 느낌.
        popElement(scoreEl);
        if (!passed || dish.score < 90) return;
        const rect = scoreEl.getBoundingClientRect();
        spawnStarBurst(rect.left + rect.width / 2, rect.top + rect.height / 2, {
          count: 14,
          spread: 140,
        });
      },
    });

    const closeButton = dom.modalContent.querySelector("[data-scoreboard-close]");
    closeButton.addEventListener("click", () => {
      if (passed) {
        finishPassedScoreboard();
      } else {
        closeModal();
        showToast(`${dish.score}점 · 재료 조합을 다시 맞춰보세요.`);
      }
    });
    return;
  }

  const rankings = makeScoreboard(dish);
  const playerRank = rankings.findIndex((entry) => entry.isPlayer) + 1;
  const requiredScore = dish.requiredScore || getRequiredScore();
  const isFinalOrder = state.orderIndex >= state.orderQueue.length - 1;
  const rows = rankings
    .map(
      (entry, index) => `
        <div class="scoreboard-row ${entry.isPlayer ? "player-score-row" : ""}">
          <strong>${index + 1}등</strong>
          <span>${entry.name}</span>
          <b>${entry.score}점</b>
          <em>${formatClearTime(entry.clearTime)}</em>
        </div>
      `,
    )
    .join("");
  const buttonText = passed ? (isFinalOrder ? "영업 정산 보기" : "다음 주문 받기") : "다시 도전하기";
  const orderLabel = `${dish.name} 주문 ${dish.orderNumber}/${state.orderQueue.length}`;
  state.scoreboardConclusion = passed
    ? { dish, playerRank }
    : null;

  openModal(`
    <h2>심사 결과</h2>
    <p>${orderLabel} 심사가 끝났습니다. 햄스터 셰프는 ${dish.score}점, 클리어 시간 ${formatClearTime(dish.clearTime)}으로 ${playerRank}등입니다.</p>
    <div class="scoreboard-list">${rows}</div>
    <article class="choice-card">
      <h3>${passed ? "주문 달성" : "목표 미달"}</h3>
      <p>${passed ? `${requiredScore}점 목표를 넘겼습니다. 다음 주문으로 영업을 이어갑니다.` : `${requiredScore}점 이상을 받으면 이 주문을 완료할 수 있습니다.`}</p>
      <button type="button" data-scoreboard-close="true">${buttonText}</button>
    </article>
  `, { returnTo: passed ? "complete-order" : null });

  const closeButton = dom.modalContent.querySelector("[data-scoreboard-close]");
  closeButton.addEventListener("click", () => {
    if (passed) {
      finishPassedScoreboard();
    } else {
      closeModal();
      showToast(`${dish.score}점 · ${playerRank}등. 재료와 타이밍을 다시 맞춰보세요.`);
    }
  });
}

function finishPassedScoreboard() {
  const conclusion = state.scoreboardConclusion;
  if (!conclusion) return;
  state.scoreboardConclusion = null;
  closeModal(false, true);
  completeServiceOrder(conclusion.dish, conclusion.playerRank);
}

function completeServiceOrder(dish, playerRank) {
  if (state.gameMode === "career") {
    const previousLevel = getCareerRestaurantLevel();
    const outcome = getCareerSaleOutcome(dish);
    state.coins += outcome.salePrice;
    state.reputation += outcome.reputationGain;
    state.careerStats = createCareerStats({
      ...(state.careerStats || {}),
      customersServed: (state.careerStats?.customersServed || 0) + 1,
      totalSales: (state.careerStats?.totalSales || 0) + outcome.salePrice,
      bestDishScore: Math.max(state.careerStats?.bestDishScore || 0, dish.score),
      dishesServed: (state.careerStats?.dishesServed || 0) + 1,
    });
    if (state.serviceStats) {
      state.serviceStats.completedOrders += 1;
      state.serviceStats.coinsEarned += outcome.salePrice;
      state.serviceStats.reputationEarned += outcome.reputationGain;
      state.serviceStats.bestScore = Math.max(state.serviceStats.bestScore, dish.score);
      state.serviceStats.dishes.push({
        name: dish.name,
        score: dish.score,
        clearTime: 0,
        rank: 1,
        reward: outcome.salePrice,
        reputation: outcome.reputationGain,
      });
    }
    state.selectedIngredients = [];
    state.pendingDish = null;
    const reachedLevel = getCareerRestaurantLevel();
    resetServiceDay();
    playRewardCoin();
    flyCoinToHud(window.innerWidth / 2, window.innerHeight * 0.62, outcome.salePrice);
    updateHud();
    saveProgress();
    const nextMilestone = getCareerNextLevelReputation();
    const levelText = reachedLevel > previousLevel
      ? `식당 Lv.${reachedLevel} 달성!`
      : `다음 레벨까지 평판 ${Math.max(0, nextMilestone - state.reputation)} 남음`;
    showToast(`판매 완료! ${outcome.salePrice}코인 · 순이익 ${outcome.profit} · 평판 +${outcome.reputationGain} · ${levelText}`);
    return;
  }

  const reward = ORDER_COMPLETION_REWARD + Math.max(0, dish.score - (dish.requiredScore || REQUIRED_SCORE));
  const finalReward = reward + (state.dailyEvent?.rewardBonus || 0);
  const reputationGain =
    8 +
    Math.max(0, Math.floor((dish.score - (dish.requiredScore || REQUIRED_SCORE)) / 5)) +
    Math.max(0, 4 - playerRank) +
    getUpgradeLevel("regulars") * 2 +
    (state.dailyEvent?.reputationBonus || 0);
  if (state.gameMode !== "challenge") state.coins += finalReward;
  state.reputation += reputationGain;
  if (state.serviceStats) {
    state.serviceStats.completedOrders += 1;
    if (state.gameMode !== "challenge") state.serviceStats.coinsEarned += finalReward;
    state.serviceStats.reputationEarned += reputationGain;
    if (state.gameMode === "challenge") {
      state.serviceStats.dishes.push({ name: dish.name, score: dish.score, clearTime: dish.clearTime, rank: playerRank, reward: 0, reputation: reputationGain });
    } else {
      state.serviceStats.dishes.push({ name: dish.name, score: dish.score, clearTime: dish.clearTime, rank: playerRank, reward: finalReward, reputation: reputationGain });
    }
  }

  if (state.gameMode === "challenge") {
    state.orderIndex += 1;
    queueNextChallengeOrder();
    state.targetRecipe = getCurrentOrder().recipe;
    state.selectedIngredients = [];
    state.pendingDish = null;
    updateHud();
    saveProgress();
    broadcastPvpScore();
    recordGhostOrderSnapshot();
    showToast(`주문 ${state.serviceStats?.completedOrders || 0}개 완료! 평판 +${reputationGain} · 다음 주문: ${getTargetRecipe().name}`);
    return;
  }

  const completedAllOrders = state.orderIndex >= state.orderQueue.length - 1;
  if (completedAllOrders) {
    finishGame(true, makeServiceSummary(true));
    return;
  }

  state.orderIndex += 1;
  state.targetRecipe = getCurrentOrder().recipe;
  state.selectedIngredients = [];
  state.pendingDish = null;
  playCoin();
  flyCoinToHud(window.innerWidth / 2, window.innerHeight * 0.62, finalReward);
  updateHud();
  saveProgress();
  showToast(`주문 완료! ${finalReward}코인 · 평판 +${reputationGain} · 다음 주문: ${getTargetRecipe().name}`);
}

function makeScoreboard(dish) {
  const rivals = [
    { name: "마담 다람 셰프", offset: 8, time: 236 },
    { name: "밤톨 비스트로", offset: -4, time: 184 },
    { name: "크림 수프 연구회", offset: -12, time: 161 },
    { name: "허브 정원 주방", offset: 3, time: 212 },
  ];
  const recipeIndex = RECIPES.findIndex((recipe) => recipe.id === dish.recipe.id);

  return [
    { name: "햄스터 셰프", score: dish.score, clearTime: dish.clearTime, isPlayer: true },
    ...rivals.map((rival, index) => ({
      name: rival.name,
      score: THREE.MathUtils.clamp(74 + rival.offset + recipeIndex * 2 - index * 3, 48, 96),
      clearTime: rival.time + recipeIndex * 11 + index * 7,
      isPlayer: false,
    })),
  ].sort((a, b) => b.score - a.score || a.clearTime - b.clearTime);
}

function openJudge() {
  if (!state.pendingDish) {
    openModal(`
      <h2>평가 테이블</h2>
      <p>아직 완성한 요리가 없습니다. 조리대에서 요리를 만든 뒤 가져오세요.</p>
    `);
    return;
  }

  const dish = state.pendingDish;
  const requiredScore = dish.requiredScore || getRequiredScore();
  const passed = dish.score >= requiredScore;
  const rows = Object.entries(dish.recipe.needs)
    .map(([trait, target]) => {
      const current = dish.traits[trait] || 0;
      const pct = Math.min(100, (current / target) * 100);
      return `
        <div class="score-row">
          <span>${TRAIT_LABELS[trait]}</span>
          <div class="meter"><span style="width:${pct}%"></span></div>
          <strong>${current}</strong>
        </div>
      `;
    })
    .join("");
  const spicy = dish.traits.spicy || 0;
  const penaltyPct = dish.recipe.penalty
    ? Math.max(0, Math.min(100, 100 - (spicy / dish.recipe.penalty.limit) * 100))
    : 100;
  const careerOutcome = state.gameMode === "career" ? getCareerSaleOutcome(dish) : null;

  openModal(`
    <h2>${dish.name}</h2>
    <p>${dish.ingredients.map((item) => item.name).join(", ")}로 만든 요리입니다.</p>
    ${rows}
    <div class="score-row">
      <span>매움 관리</span>
      <div class="meter warning-meter"><span style="width:${penaltyPct}%"></span></div>
      <strong>${spicy}</strong>
    </div>
    <div class="score-split">
      <span>재료 점수 ${dish.materialScore}</span>
      <span>타이밍 점수 ${dish.miniGameScore}</span>
      <span>취향 보정 ${dish.preferenceScore >= 0 ? "+" : ""}${dish.preferenceScore}</span>
      <span>도구 보너스 +${dish.upgradeScore}</span>
      <span>목표 점수 ${requiredScore}</span>
    </div>
    <article class="choice-card">
      <h3>평가 점수 ${dish.score}점</h3>
      <p>${makeJudgementComment(dish.score)}</p>
      ${careerOutcome ? `<p>예상 판매가 ${careerOutcome.salePrice}코인 · 순이익 ${careerOutcome.profit}코인 · 평판 +${careerOutcome.reputationGain}</p>` : ""}
      <button type="button" data-submit-dish="true">${passed ? "별점 받기" : "다시 도전"}</button>
    </article>
  `);

  const submit = dom.modalContent.querySelector("[data-submit-dish]");
  submit.addEventListener("click", () => {
    state.lastJudgement = dish;
    recordJudgement(dish);
    recordServiceAttempt(dish, passed);
    state.pendingDish = null;
    if (passed) {
      playSuccess();
    } else {
      playFail();
    }
    showScoreboard(dish, passed);
    updateHud();
  });
}

function scoreRecipeMatch(traits, recipe) {
  const needs = Object.entries(recipe.needs);
  let score = 22;

  for (const [trait, target] of needs) {
    score += Math.min(1, (traits[trait] || 0) / target) * 20;
  }

  const almostBalanced = needs.every(([trait, target]) => (traits[trait] || 0) >= target * 0.8);
  const fullyBalanced = needs.every(([trait, target]) => (traits[trait] || 0) >= target);
  if (almostBalanced) score += 8;
  if (fullyBalanced) score += 6;

  if (recipe.bonus && (traits[recipe.bonus.trait] || 0) >= recipe.bonus.threshold) {
    score += recipe.bonus.points;
  }

  if (recipe.penalty && (traits[recipe.penalty.trait] || 0) > recipe.penalty.limit) {
    score -= recipe.penalty.points;
    if ((traits[recipe.penalty.trait] || 0) > recipe.penalty.limit * 1.6) score -= 6;
  }

  return THREE.MathUtils.clamp(Math.round(score), 0, 100);
}

function recordJudgement(dish) {
  const id = dish.recipe.id;
  const previous = state.recipeRecords[id] || {
    attempts: 0,
    bestScore: 0,
  };
  const lastIngredients = dish.ingredients.map((item) => item.name).join(", ");
  const estimatedLow = Math.max(0, dish.score - 6);
  const estimatedHigh = Math.min(100, dish.score + 6);

  state.recipeRecords[id] = {
    attempts: previous.attempts + 1,
    bestScore: Math.max(previous.bestScore, dish.score),
    lastScore: dish.score,
    estimatedLow,
    estimatedHigh,
    lastIngredients,
  };
}

function recordServiceAttempt(dish, passed) {
  if (!state.serviceStats) return;
  state.serviceStats.bestScore = Math.max(state.serviceStats.bestScore, dish.score);
  if (!passed) state.serviceStats.failedJudgements += 1;
}

function makeJudgementComment(score) {
  if (score >= 90) return "햄스터 셰프의 수염이 반짝이는 완벽한 접시입니다.";
  if (score >= 80) return "균형이 좋아요. 손님들이 조용히 한 입 더 먹는 맛입니다.";
  if (score >= 60) return "가능성이 보입니다. 목표 맛을 조금 더 맞춰보세요.";
  return "귀엽지만 아직 별점 요리라고 부르기엔 아쉽습니다.";
}

function mergeTraits(ingredients) {
  return ingredients.reduce((total, ingredient) => {
    for (const [key, value] of Object.entries(ingredient.traits)) {
      total[key] = (total[key] || 0) + value;
    }
    return total;
  }, {});
}

function finishGame(won, copy) {
  if (state.minigame?.frameId) cancelAnimationFrame(state.minigame.frameId);
  clearOrderChallengeTimer();
  recordDayHistory(won);
  const isChallengeEnd = state.gameMode === "challenge" && !state.tutorialMode;
  state.minigame = null;
  state.running = false;
  state.gameOver = true;
  state.paused = false;
  state.modalOpen = false;
  state.modalStopsMusic = false;
  closeModal(false, true);
  stopMusic();

  dom.hud.classList.add("hidden");
  dom.questTracker.classList.add("hidden");
  dom.inventoryBar.classList.add("hidden");
  dom.interactionPrompt.classList.add("hidden");
  dom.tutorialGuide.classList.add("hidden");
  saveProgress();

  if (isChallengeEnd) {
    if (state.pvpRoom) {
      endPvpGame();
      return;
    }
    if (state.ghostRecorder) exportGhostRecording();
    if (state.authUser && state.serviceStats?.completedOrders) {
      saveChallengeLeaderboardEntry().then(() => void showChallengeLeaderboardScreen());
    } else {
      void showChallengeLeaderboardScreen();
    }
    return;
  }

  dom.resultKicker.textContent = state.tutorialMode ? "tutorial complete" : won ? "three star service" : "closing time";
  dom.resultTitle.textContent = state.tutorialMode ? "튜토리얼 완료" : won ? "별점 요리 완성" : "오늘의 영업 종료";
  dom.resultCopy.textContent = state.tutorialMode ? "첫 영업의 기본 흐름을 모두 경험했습니다. 이제 일반 새 게임으로 도전해보세요." : copy;
  dom.restartButton.textContent = state.tutorialMode ? "시작 화면으로" : "다음 영업일 시작";
  dom.resultScreen.classList.remove("hidden");
}

// ─────────────────────────────────────────────────────────────
//  PvP 멀티 챌린지
// ─────────────────────────────────────────────────────────────

function generateRoomCode() {
  return Array.from({ length: 6 }, () =>
    PVP_ROOM_CODE_CHARS[Math.floor(Math.random() * PVP_ROOM_CODE_CHARS.length)],
  ).join("");
}

function openMultiChallengeModal() {
  if (!state.authUser) { syncAuthUi("멀티 챌린지는 로그인 후 이용 가능합니다."); return; }
  openModal(`
    <h2>🐹 멀티 챌린지</h2>
    <p>친구와 방을 만들어 동시에 챌린지를 플레이하세요. 상대방 점수가 실시간으로 보이고, 코인으로 방해를 할 수 있습니다!</p>
    <div class="mode-actions" style="margin-top:16px">
      <button type="button" id="pvp-create-btn" class="primary-action">방 만들기</button>
      <button type="button" id="pvp-join-btn" class="primary-action secondary-action">방 참가하기</button>
    </div>
    <div id="pvp-join-form" class="pvp-join-form hidden" style="margin-top:16px">
      <label class="auth-field">
        <span>방 코드 입력</span>
        <input id="pvp-join-code" type="text" maxlength="6" placeholder="ABC123" style="text-transform:uppercase;letter-spacing:4px" />
      </label>
      <button type="button" id="pvp-join-confirm" class="primary-action" style="margin-top:8px">참가</button>
    </div>
    <div class="mode-actions" style="margin-top:12px">
      <button type="button" id="ghost-duel-btn" class="primary-action secondary-action">🎬 고스트 대결</button>
    </div>
    <p style="font-size:0.85em;color:#888;margin-top:6px">상대가 없어도 미리 녹화된 라이벌과 바로 붙어볼 수 있어요.</p>
  `);
  dom.modalContent.querySelector("#pvp-create-btn").addEventListener("click", () => void createPvpRoom());
  dom.modalContent.querySelector("#pvp-join-btn").addEventListener("click", () => {
    dom.modalContent.querySelector("#pvp-join-form").classList.remove("hidden");
  });
  dom.modalContent.querySelector("#pvp-join-confirm").addEventListener("click", () => {
    const code = dom.modalContent.querySelector("#pvp-join-code").value.trim().toUpperCase();
    if (code.length !== 6) { showToast("방 코드는 6자리입니다."); return; }
    void joinPvpRoom(code);
  });
  dom.modalContent.querySelector("#ghost-duel-btn").addEventListener("click", openGhostSelectModal);
}

async function createPvpRoom() {
  const client = getSupabase();
  if (!client || !state.authUser) return;
  const roomCode = generateRoomCode();
  const nickname = getProfileDisplayName();
  const { error } = await client.from("challenge_rooms").insert({
    room_code: roomCode,
    host_id: state.authUser.id,
    host_nickname: nickname,
    status: "waiting",
  });
  if (error) { showToast("방 생성에 실패했습니다: " + error.message); return; }
  state.pvpRoom = { roomCode, isHost: true, opponentId: null, opponentNickname: null };
  state.pvpOpponent = null;
  setupPvpChannel(roomCode);
  showPvpLobby();
}

async function joinPvpRoom(code) {
  const client = getSupabase();
  if (!client || !state.authUser) return;
  const { data: room, error: fetchErr } = await client
    .from("challenge_rooms").select("*").eq("room_code", code).eq("status", "waiting").maybeSingle();
  if (fetchErr || !room) { showToast("방을 찾을 수 없습니다. 코드를 확인해주세요."); return; }
  if (room.guest_id) { showToast("이미 다른 플레이어가 참가한 방입니다."); return; }
  if (room.host_id === state.authUser.id) { showToast("자신이 만든 방에는 참가할 수 없습니다."); return; }
  const nickname = getProfileDisplayName();
  // 위의 guest_id 검사는 조회 시점 기준이라, 두 명이 동시에 들어오면 둘 다 통과한다.
  // 실제 참가는 "아직 비어 있는 대기 방"일 때만 성립하도록 조건을 update에 함께 건다.
  const { data: joined, error: updateErr } = await client.from("challenge_rooms")
    .update({ guest_id: state.authUser.id, guest_nickname: nickname })
    .eq("room_code", code)
    .eq("status", "waiting")
    .is("guest_id", null)
    .select()
    .maybeSingle();
  if (updateErr || !joined) { showToast("방 참가에 실패했습니다. 이미 다른 플레이어가 참가했을 수 있습니다."); return; }
  state.pvpRoom = { roomCode: code, isHost: false, opponentId: joined.host_id, opponentNickname: joined.host_nickname };
  state.pvpOpponent = { nickname: joined.host_nickname, orders: 0, score: 0, done: false };
  setupPvpChannel(code);
  showPvpLobby();
}

// ── 고스트 리플레이 ──────────────────────────────────────
// PLAN.md E 항목. 실제 Realtime 채널을 만들지 않는다 — 재생기가
// opponentTargetX/Z/RY와 state.pvpOpponent를 직접 채워 넣으면, PvP 수신 코드
// (updatePvpFrame의 보간, updateOpponentNametag, updatePvpOpponentHud,
// applyPvpDebuff, showPvpResult, createOpponentMesh)는 실제 상대와 구분하지
// 못하고 그대로 동작한다. hard는 아직 녹화가 없어 disabled로 잠가둔다.
// 주의: 녹화본은 녹화 당시의 GAME_SECONDS 길이를 그대로 갖는다. 제한 시간을
// 480초 → 300초로 줄이면서 기존 8분 녹화본이 잘리게 됐다. 300초 시점 기준으로
// 쉬움은 완료 주문 0개(유일한 주문이 396초), 보통은 2개(188점)까지만 재생된다.
// 셋 다 5분 기준으로 다시 녹화해야 한다.
const GHOST_PROFILES = [
  {
    id: "easy", difficulty: "쉬움", name: "초급 요리사", skin: "rabbit",
    recording: "./assets/ghosts/easy.json",
    story: [
      { caption: "조보아씨 내려와바", image: "./assets/ghost-story/easy-1.png" },
      { caption: "어어얽어.. 뭐야 이거 빠스 아니여?", image: "./assets/ghost-story/easy-2.png" },
    ],
    // 8분 녹화본이라 5분 판에서는 주문 0개·0점 — 아무것도 안 하는 상대가 된다.
    // TODO: 5분 기준으로 재녹화하면 제거
    disabled: true,
  },
  {
    id: "normal", difficulty: "보통", name: "중급 요리사", skin: "cat",
    recording: "./assets/ghosts/normal.json",
    story: [
      { caption: "오늘 급식 메뉴는 뭔가요?", image: "./assets/ghost-story/normal-1.png" },
      { caption: "이 고기는 이븐하게 익지 않았어요", image: "./assets/ghost-story/normal-2.png" },
    ],
  },
  {
    id: "hard", difficulty: "어려움", name: "고급 요리사", skin: "robot",
    recording: "./assets/ghosts/hard.json",
    story: [
      { caption: "나야 들기름", image: "./assets/ghost-story/hard-1.png" },
      { caption: "자 지나갑니다 화이팅!", image: "./assets/ghost-story/hard-2.png" },
    ],
    disabled: true, // TODO: assets/ghosts/hard.json 녹화되면 제거
  },
];

let ghostPlaybackState = null; // { recording, startedAt, posIdx, orderIdx }
let ghostSabotageTimers = [];
let lastGhostProfile = null;   // 결과 화면 "다시 도전"이 재사용

function openGhostSelectModal() {
  const cards = GHOST_PROFILES.map((profile) => {
    const skin = SKINS.find((s) => s.id === profile.skin);
    return `
      <article class="choice-card ${profile.disabled ? "muted-record" : ""}">
        <h3>${skin?.emoji || "🐹"} ${profile.name}</h3>
        <p><strong>${profile.difficulty}</strong></p>
        <button type="button" data-ghost-id="${profile.id}" ${profile.disabled ? "disabled" : ""}>
          ${profile.disabled ? "녹화 준비 중" : "대결 신청"}
        </button>
      </article>
    `;
  }).join("");

  openModal(`
    <h2>🎬 고스트 대결</h2>
    <p>미리 녹화된 라이벌과 1:1로 겨룹니다. 상대는 방해할 수 없고, 상대만 정해진 순간에 방해를 걸어옵니다.</p>
    <div class="grid-list">${cards}</div>
  `);

  dom.modalContent.querySelectorAll("[data-ghost-id]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const profile = GHOST_PROFILES.find((g) => g.id === btn.dataset.ghostId);
      if (profile) openGhostStoryModal(profile);
    });
  });
}

function openGhostStoryModal(profile) {
  // 슬라이드 두 장 중 하나를 매번 랜덤하게 골라 한 장만 보여준다.
  const slide = profile.story[Math.floor(Math.random() * profile.story.length)];
  // 대사가 이미지 안에 이미 박혀 있는 컷이라, 이미지가 있으면 캡션은
  // 스크린리더용 alt로만 두고 화면에 텍스트로 중복 표시하지 않는다.
  const media = slide.image
    ? `<img src="${slide.image}" alt="${slide.caption}" class="ghost-story-image" />`
    : `<p style="font-size:1.2rem;line-height:1.7;text-align:center;margin:0.5em 0">${slide.caption}</p>`;
  openModal(`
    <h2>${profile.name}</h2>
    <article class="choice-card">
      ${media}
    </article>
    <div class="mode-actions" style="margin-top:16px">
      <button type="button" id="ghost-story-start" class="primary-action">대결 시작</button>
    </div>
  `);
  dom.modalContent.querySelector("#ghost-story-start").addEventListener("click", () => void startGhostDuel(profile));
}

async function startGhostDuel(profile) {
  closeModal(false, true);
  lastGhostProfile = profile;
  showToast("녹화 불러오는 중...");

  let recording;
  try {
    const res = await fetch(profile.recording);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    recording = await res.json();
  } catch (error) {
    console.error(error);
    showToast("고스트 녹화를 불러오지 못했습니다.");
    return;
  }
  if (!recording.positions?.length) {
    showToast("이 고스트는 아직 녹화가 없습니다.");
    return;
  }

  state.pvpRoom = { roomCode: null, isHost: true, isGhost: true, opponentId: null, opponentNickname: profile.name };
  // done을 처음부터 true로 둔다 — 결과가 이미 정해진 녹화라 실제 상대처럼
  // endPvpGame()이 5초씩 기다릴 이유가 없다.
  state.pvpOpponent = { nickname: profile.name, orders: 0, score: 0, done: true };
  startGhostCountdown(profile, recording);
}

function startGhostCountdown(profile, recording) {
  let count = 3;
  const tick = () => {
    if (count > 0) {
      showToast(`${count}...`);
      count -= 1;
      setTimeout(tick, 1000);
    } else {
      void startGhostChallengeGame(profile, recording);
    }
  };
  tick();
}

async function startGhostChallengeGame(profile, recording) {
  const savedRoom = state.pvpRoom;
  await startGame();
  state.pvpRoom = savedRoom;
  dom.pvpOpponentHud.classList.remove("hidden");
  updatePvpOpponentHud();
  // 방해 패널은 계속 숨겨둔다 — 단방향 설계라 플레이어는 고스트를 방해할 수 없다.
  createOpponentMesh(profile.skin);
  beginGhostPlayback(recording);
  beginGhostSabotageSchedule(profile);
  showToast(`🎬 ${profile.name}${withParticle(profile.name, "와", "과")}의 대결 시작!`);
}

function beginGhostPlayback(recording) {
  ghostPlaybackState = { recording, startedAt: performance.now(), posIdx: 0, orderIdx: 0 };
}

// animate()의 게이트 블록에서 매 프레임 recordGhostFrame(dt) 옆에서 호출된다.
// updatePvpFrame의 opponentMesh 보간이 opponentTargetX/Z/RY를 그대로 읽어가므로
// 여기서는 그 변수만 채우면 된다 — updatePvpFrame 자체는 손대지 않는다.
function updateGhostPlayback() {
  const gp = ghostPlaybackState;
  if (!gp || !state.pvpRoom?.isGhost) return;
  const t = performance.now() - gp.startedAt;

  // 녹화는 250ms 간격 샘플이라(실제 PvP의 60ms 브로드캐스트보다 훨씬 성기다)
  // 그냥 다음 샘플로 점프시키면 그 사이가 뚝뚝 끊겨 보인다. 실시간 네트워크와
  // 달리 고스트는 전체 경로를 미리 알고 있으니, 두 샘플 사이를 직접
  // 선형보간해서 매 프레임 정확한 중간 위치를 만들어낸다 — updatePvpFrame의
  // lerp는 이렇게 이미 연속적인 목표를 한 번 더 부드럽게 다듬는 역할만 한다.
  const positions = gp.recording.positions;
  while (gp.posIdx < positions.length - 2 && positions[gp.posIdx + 1][0] <= t) gp.posIdx += 1;
  const a = positions[gp.posIdx];
  const b = positions[Math.min(gp.posIdx + 1, positions.length - 1)];
  const span = b[0] - a[0];
  const frac = span > 0 ? THREE.MathUtils.clamp((t - a[0]) / span, 0, 1) : 0;
  opponentTargetX = a[1] + (b[1] - a[1]) * frac;
  opponentTargetZ = a[2] + (b[2] - a[2]) * frac;
  // 회전은 최단 경로로 보간 — 그냥 선형보간하면 ±π 경계에서 반대로 홱 돈다.
  let dRY = b[3] - a[3];
  dRY = ((dRY + Math.PI) % (Math.PI * 2)) - Math.PI;
  opponentTargetRY = a[3] + dRY * frac;

  const orders = gp.recording.orders || [];
  while (gp.orderIdx < orders.length && orders[gp.orderIdx].t <= t) {
    state.pvpOpponent.orders = orders[gp.orderIdx].orders;
    state.pvpOpponent.score = orders[gp.orderIdx].score;
    updatePvpOpponentHud();
    gp.orderIdx += 1;
  }
}

// 난이도별 방해 간격(고정값) — PVP 쿨타임을 배율로 늘리는 대신 난이도마다
// 직접 원하는 체감 간격을 박아둔다. 쉬움은 1분 30초로 넉넉하게, 첫 방해도
// 같은 간격만큼 기다린다(쉬움은 시작하자마자부터 여유롭게 느껴져야 한다).
const GHOST_SABOTAGE_INTERVAL_MS = { easy: 90000, normal: 42000, hard: 30000 };
const GHOST_SABOTAGE_TYPES = ["trip", "ink", "bomb"];

function beginGhostSabotageSchedule(profile) {
  stopGhostSabotageSchedule();
  scheduleNextGhostSabotage(profile, getGhostSabotageInterval(profile));
}

function getGhostSabotageInterval(profile) {
  const base = GHOST_SABOTAGE_INTERVAL_MS[profile.id] ?? 45000;
  const jitter = (Math.random() - 0.5) * Math.min(10000, base * 0.15);
  return base + jitter;
}

function scheduleNextGhostSabotage(profile, delayMs) {
  const timer = setTimeout(() => fireGhostSabotage(profile), delayMs);
  ghostSabotageTimers.push(timer);
}

function fireGhostSabotage(profile) {
  if (!state.pvpRoom?.isGhost || !state.running || state.gameOver) return;
  // 미니게임·일시정지 중엔 억울하게 맞는다. 사람이 상대면 그러려니 하지만
  // 스크립트가 상대면 그냥 짜증나므로 잠깐 미뤘다가 다시 시도한다.
  if (state.modalOpen || state.paused) {
    scheduleNextGhostSabotage(profile, 2000);
    return;
  }
  const type = GHOST_SABOTAGE_TYPES[Math.floor(Math.random() * GHOST_SABOTAGE_TYPES.length)];
  applyPvpDebuff(type, profile.name);
  scheduleNextGhostSabotage(profile, getGhostSabotageInterval(profile));
}

function stopGhostSabotageSchedule() {
  ghostSabotageTimers.forEach((timer) => clearTimeout(timer));
  ghostSabotageTimers = [];
}

function stopGhostDuel() {
  ghostPlaybackState = null;
  stopGhostSabotageSchedule();
}

let pvpChannel = null;
let opponentMesh = null;       // 상대방 캐릭터 Three.js Group
let opponentCarryMesh = null;  // 상대방 carry 박스 메시
let opponentNametagEl = null;  // 상대방 이름표 DOM element
let opponentTargetX = 0, opponentTargetZ = 0, opponentTargetRY = 0;
// 실제 PvP 지연 보간 버퍼 — [{ t(수신 시각), x, z, ry }]. 고스트는 전체 경로를
// 미리 알아서(updateGhostPlayback) 이 버퍼를 쓰지 않는다.
let opponentPosBuffer = [];
const OPPONENT_INTERP_DELAY_MS = 120; // 이만큼 과거를 그려서 항상 두 샘플 사이를 보간한다
let pvpPosBroadcastTimer = 0;
let sabotageMotionRaf = null;  // 현재 실행 중인 방해 모션 RAF id
const pvpStarsWorldPos = new THREE.Vector3(); // updatePvpStarsOverlayPosition 재사용 벡터

function setupPvpChannel(roomCode) {
  const client = getSupabase();
  if (!client) return;
  if (pvpChannel) { client.removeChannel(pvpChannel); }
  pvpChannel = client.channel(`pvp:${roomCode}`, { config: { broadcast: { self: false } } });

  // 상대방이 로비에 참가했을 때 (방장용 DB 변경 감지)
  if (state.pvpRoom?.isHost) {
    pvpChannel.on("postgres_changes", {
      event: "UPDATE", schema: "public", table: "challenge_rooms", filter: `room_code=eq.${roomCode}`,
    }, (payload) => {
      if (payload.new.guest_id && !state.pvpRoom.opponentId) {
        state.pvpRoom.opponentId = payload.new.guest_id;
        state.pvpRoom.opponentNickname = payload.new.guest_nickname;
        state.pvpOpponent = { nickname: payload.new.guest_nickname, orders: 0, score: 0, done: false };
        showPvpLobby();
        showToast(`${payload.new.guest_nickname}님이 참가했습니다!`);
      }
    });
  }

  // 게임 시작 신호
  pvpChannel.on("broadcast", { event: "game_start" }, ({ payload }) => {
    if (!state.pvpRoom?.isHost) {
      state._pendingOpponentSkin = payload.skin || "default"; // 호스트 스킨 저장
      startPvpCountdown(payload.startAt);
    }
  });

  // 상대방 점수 업데이트
  pvpChannel.on("broadcast", { event: "score_update" }, ({ payload }) => {
    if (state.pvpOpponent) {
      state.pvpOpponent.orders = payload.orders;
      state.pvpOpponent.score = payload.score;
      updatePvpOpponentHud();
    }
  });

  // 방해 수신
  pvpChannel.on("broadcast", { event: "sabotage" }, ({ payload }) => {
    applyPvpDebuff(payload.type, payload.fromNickname, payload.extra);
  });

  // 폭탄 결과 알림 (방해 사용자에게)
  pvpChannel.on("broadcast", { event: "sabotage_result" }, ({ payload }) => {
    const myNick = getProfileDisplayName();
    if (payload.toNickname !== myNick) return;
    if (payload.result === "bomb_defused") {
      showToast(`💦 ${payload.targetNickname}이(가) 폭탄을 해제했습니다!`);
    } else if (payload.result === "bomb_exploded") {
      showToast(`💥 ${payload.targetNickname}의 폭탄이 폭발했습니다!`);
    }
  });

  // 상대방 위치 동기화 — 목표를 바로 덮어쓰지 않고 시각과 함께 버퍼에 쌓는다.
  // updateOpponentInterpolation()이 매 프레임 이 버퍼에서 살짝 과거 시점을
  // 보간해 opponentTargetX/Z/RY를 계산한다(지연 버퍼 보간, 표준 멀티플레이어
  // 기법). 네트워크 업데이트 간격이 들쭉날쭉해도 두 샘플 사이를 항상
  // 매끄럽게 채울 수 있다 — 순간이동 후 lerp로 쫓아가는 방식보다 훨씬 안 끊긴다.
  pvpChannel.on("broadcast", { event: "pos_update" }, ({ payload }) => {
    opponentPosBuffer.push({ t: performance.now(), x: payload.x, z: payload.z, ry: payload.ry });
    const cutoff = performance.now() - OPPONENT_INTERP_DELAY_MS * 4;
    while (opponentPosBuffer.length > 2 && opponentPosBuffer[0].t < cutoff) opponentPosBuffer.shift();
    if (opponentCarryMesh) opponentCarryMesh.visible = !!payload.carry;
    // 메시가 아직 없으면 기본 스킨으로 임시 생성
    if (!opponentMesh && state.running) createOpponentMesh(state._pendingOpponentSkin || "default");
  });

  // 상대방 게임 준비 완료 (스킨 정보 포함)
  pvpChannel.on("broadcast", { event: "player_ready" }, ({ payload }) => {
    state._pendingOpponentSkin = payload.skin;
    if (state.running) {
      createOpponentMesh(payload.skin);
    }
  });

  // 상대방 게임 종료
  pvpChannel.on("broadcast", { event: "game_done" }, ({ payload }) => {
    if (state.pvpOpponent) {
      state.pvpOpponent.orders = payload.orders;
      state.pvpOpponent.score = payload.score;
      state.pvpOpponent.done = true;
    }
    if (state.gameOver) showPvpResult();
  });

  pvpChannel.subscribe();
}

function showPvpLobby() {
  const room = state.pvpRoom;
  const isHost = room?.isHost;
  const opponentName = room?.opponentNickname;
  const canStart = isHost && opponentName;

  openModal(`
    <h2>🐹 대기 중</h2>
    <p class="pvp-room-code-label">방 코드</p>
    <div class="pvp-room-code">${room?.roomCode || "------"}</div>
    <p style="font-size:0.9em;color:#888;margin:4px 0 16px">친구에게 이 코드를 알려주세요</p>
    <div class="pvp-lobby-players">
      <div class="pvp-lobby-player">
        <span>👑 방장</span>
        <strong>${getProfileDisplayName()}</strong>
      </div>
      <div class="pvp-lobby-player pvp-lobby-vs">VS</div>
      <div class="pvp-lobby-player">
        <span>🐹 참가자</span>
        <strong>${opponentName || "대기 중..."}</strong>
      </div>
    </div>
    ${isHost ? `
      <div class="mode-actions" style="margin-top:20px">
        <button type="button" id="pvp-start-btn" class="primary-action" ${canStart ? "" : "disabled"}>
          ${canStart ? "게임 시작!" : "상대방 기다리는 중..."}
        </button>
        <button type="button" id="pvp-cancel-btn" class="primary-action secondary-action">방 취소</button>
      </div>
    ` : `
      <p style="margin-top:20px;text-align:center">방장이 게임을 시작할 때까지 기다리세요...</p>
      <div class="mode-actions">
        <button type="button" id="pvp-cancel-btn" class="primary-action secondary-action">나가기</button>
      </div>
    `}
  `);

  dom.modalContent.querySelector("#pvp-cancel-btn")?.addEventListener("click", () => void leavePvpRoom());
  if (canStart) {
    dom.modalContent.querySelector("#pvp-start-btn")?.addEventListener("click", () => {
      const startAt = Date.now() + 3500;
      pvpChannel?.send({ type: "broadcast", event: "game_start", payload: { startAt, skin: state.selectedSkin || "default" } });
      startPvpCountdown(startAt);
    });
  }
}

function startPvpCountdown(startAt) {
  closeModal(false, true);
  const remaining = Math.max(0, startAt - Date.now());

  let count = Math.ceil(remaining / 1000);
  const show = () => {
    if (count > 0) {
      showToast(`${count}...`);
      count--;
      setTimeout(show, 1000);
    }
  };
  show();

  setTimeout(() => {
    // pvpRoom이 살아있으면 게임 시작
    if (!state.pvpRoom) return;
    startChallengeGamePvp();
  }, remaining);
}

async function startChallengeGamePvp() {
  // challenge_rooms status → playing
  const client = getSupabase();
  if (client && state.pvpRoom?.isHost) {
    await client.from("challenge_rooms")
      .update({ status: "playing" })
      .eq("room_code", state.pvpRoom.roomCode);
  }
  // 일반 챌린지 시작 (pvpRoom 플래그 유지 — startGame의 auth 체크 우회)
  const savedRoom = state.pvpRoom;
  await startGame();
  state.pvpRoom = savedRoom; // startGame이 reset해도 복원
  // 방해 패널 & 상대 HUD 표시
  dom.pvpSabotagePanel.classList.remove("hidden");
  dom.pvpOpponentHud.classList.remove("hidden");
  updatePvpOpponentHud();
  updatePvpSabotagePanel();

  // 내 스킨 정보 상대방에게 전송 + 상대방 스킨이 이미 수신됐으면 메시 생성
  pvpChannel?.send({
    type: "broadcast", event: "player_ready",
    payload: { skin: state.selectedSkin || "default" },
  });
  if (state._pendingOpponentSkin) {
    createOpponentMesh(state._pendingOpponentSkin);
    state._pendingOpponentSkin = null;
  }
}

async function leavePvpRoom() {
  const client = getSupabase();
  const room = state.pvpRoom;
  // 고스트 대결은 진짜 방이 없다 — challenge_rooms를 건드리지 않는다.
  if (client && room && !room.isGhost) {
    if (room.isHost) {
      await client.from("challenge_rooms").delete().eq("room_code", room.roomCode);
    } else {
      await client.from("challenge_rooms")
        .update({ guest_id: null, guest_nickname: null })
        .eq("room_code", room.roomCode);
    }
  }
  if (room?.isGhost) stopGhostDuel();
  if (pvpChannel) { client?.removeChannel(pvpChannel); pvpChannel = null; }
  removeOpponentMesh();
  pvpPosBroadcastTimer = 0;
  opponentPosBuffer = [];
  state._pendingOpponentSkin = null;
  clearPvpDebuffs();
  state.pvpRoom = null;
  state.pvpOpponent = null;
  state.pvpSabotageCooldowns = {};
  dom.pvpSabotagePanel.classList.add("hidden");
  dom.pvpOpponentHud.classList.add("hidden");
  closeModal(false, true);

  // 시작 화면으로. 기존엔 "게임이 끝난 상태(gameOver 또는 !running)일 때만"
  // 이 블록을 탔는데, 그 두 조건은 로비 취소·결과 화면 나가기 두 기존
  // 호출 지점에서 이미 항상 참이었다(로비는 아직 안 시작해서 !running,
  // 결과 화면은 finishGame이 이미 gameOver를 세팅한 뒤라서). 즉 이 조건은
  // 사실상 실질적인 분기가 아니었다. 일시정지 메뉴로 매치 도중 나가는
  // 경로(running이 아직 true)가 새로 생기면서 무조건 실행하게 바꿨다 —
  // 안 그러면 화면 전환 없이 3D 뷰만 남는다.
  state.running = false;
  state.gameOver = false;
  state.paused = false;
  dom.hud.classList.add("hidden");
  dom.questTracker.classList.add("hidden");
  dom.inventoryBar.classList.add("hidden");
  dom.interactionPrompt.classList.add("hidden");
  dom.resultScreen.classList.add("hidden");
  dom.challengeLbScreen.classList.add("hidden");
  dom.startScreen.classList.remove("hidden");
  dom.startScreen.classList.add("screen-visible");
  loadProgress();
  refreshStartActions();
  updateHud();
}

// ── 상대방 캐릭터 메시 ──────────────────────────────────────────────
function createOpponentMesh(skinId) {
  removeOpponentMesh();
  const savedCarry = playerCarryMesh;
  opponentMesh = buildSkinMesh(skinId || "default");
  opponentCarryMesh = playerCarryMesh; // buildSkinMesh가 설정한 carry 메시 캡처
  playerCarryMesh = savedCarry;        // 내 플레이어 carry 메시 복원
  // 초기 위치: 상대방 시작 지점 (플레이어와 반대쪽)
  opponentTargetX = opponentMesh.position.x = 2;
  opponentTargetZ = opponentMesh.position.z = 2;
  scene.add(opponentMesh);

  // 이름표 DOM 생성
  opponentNametagEl = document.createElement("div");
  opponentNametagEl.className = "pvp-nametag";
  opponentNametagEl.textContent = state.pvpOpponent?.nickname || "상대방";
  document.getElementById("game-root")?.appendChild(opponentNametagEl);
}

function removeOpponentMesh() {
  if (opponentMesh) { scene.remove(opponentMesh); opponentMesh = null; opponentCarryMesh = null; }
  if (opponentNametagEl) { opponentNametagEl.remove(); opponentNametagEl = null; }
}

function updateOpponentNametag() {
  if (!opponentMesh || !opponentNametagEl || !renderer) return;
  const pos = opponentMesh.position.clone();
  pos.y += 2.7;
  pos.project(camera);
  const cv = renderer.domElement;
  const x = (pos.x * 0.5 + 0.5) * cv.clientWidth;
  const y = (-pos.y * 0.5 + 0.5) * cv.clientHeight;
  if (pos.z >= 1) { opponentNametagEl.style.display = "none"; return; }
  opponentNametagEl.style.display = "block";
  opponentNametagEl.style.left = x + "px";
  opponentNametagEl.style.top = y + "px";
}

function broadcastPvpScore() {
  if (!pvpChannel || !state.pvpRoom || !state.serviceStats) return;
  pvpChannel.send({
    type: "broadcast", event: "score_update",
    payload: {
      orders: state.serviceStats.completedOrders,
      score: getChallengeRunScore(),
    },
  });
}

function sendSabotage(type) {
  if (!pvpChannel || !state.pvpRoom) return;
  const cooldownUntil = state.pvpSabotageCooldowns[type] || 0;
  if (Date.now() < cooldownUntil) {
    showToast(`쿨다운 중 (${Math.ceil((cooldownUntil - Date.now()) / 1000)}초)`);
    return;
  }
  state.pvpSabotageCooldowns[type] = Date.now() + (PVP_SABOTAGE_COOLDOWNS_MS[type] ?? 25000);
  updateHud();
  updatePvpSabotagePanel();

  const labels = { trip: "넘어뜨리기 🌀", ink: "먹물 뿌리기 🖤", bomb: "폭탄 투척 💣" };
  showToast(`${labels[type] || type} 방해 전송!`);
  playSabotageMotion(type);

  pvpChannel.send({
    type: "broadcast", event: "sabotage",
    payload: { type, fromNickname: getProfileDisplayName() },
  });
}

function stopSabotageMotion() {
  if (sabotageMotionRaf !== null) {
    cancelAnimationFrame(sabotageMotionRaf);
    sabotageMotionRaf = null;
  }
  if (player) {
    player.rotation.x = 0; player.rotation.z = 0;
    player.scale.set(1, 1, 1); player.position.y = 0;
  }
}

function playSabotageMotion(type) {
  if (!player) return;

  // 이전 모션 RAF 취소 후 플레이어 상태 초기화 (중첩 방지)
  stopSabotageMotion();

  const t0 = performance.now();

  if (type === "bomb") {
    // 웅크리기 → 점프+백스윙 → 폭발적 투척 → 착지 바운스
    const dur = 680;
    (function animBomb(now) {
      // 게임이 끝났거나 플레이어가 없으면 즉시 중단
      if (!player || !state.running) { sabotageMotionRaf = null; return; }
      const t = Math.min((now - t0) / dur, 1);
      if (t < 0.15) {
        const p = t / 0.15;
        player.rotation.x = p * 0.3;
        player.scale.set(1 + p * 0.12, 1 - p * 0.22, 1 + p * 0.12);
        player.position.y = -p * 0.08;
      } else if (t < 0.42) {
        const p = (t - 0.15) / 0.27;
        player.rotation.x = 0.3 - p * 0.95;
        player.scale.set(1.12 - p * 0.12, 0.78 + p * 0.44, 1.12 - p * 0.12);
        player.position.y = Math.sin(p * Math.PI) * 0.65;
      } else if (t < 0.62) {
        const p = (t - 0.42) / 0.20;
        player.rotation.x = -0.65 + p * 1.0;
        player.rotation.z = Math.sin(p * Math.PI) * 0.18;
        player.scale.set(1 + p * 0.06, 1.22 - p * 0.3, 1 + p * 0.06);
        player.position.y = Math.max(0, 0.65 * (1 - p * 2.2));
      } else if (t < 0.82) {
        const p = (t - 0.62) / 0.20;
        player.rotation.x = 0.35 - p * 0.35;
        player.rotation.z = 0.18 * (1 - p);
        player.scale.set(1.06 - p * 0.06, 0.92 + p * 0.08, 1.06 - p * 0.06);
        player.position.y = 0;
      } else {
        const p = (t - 0.82) / 0.18;
        player.rotation.x = Math.sin((1 - p) * Math.PI * 2.5) * 0.06 * (1 - p);
        player.rotation.z = 0;
        player.scale.set(1, 1, 1);
        player.position.y = 0;
      }
      if (t < 1) {
        sabotageMotionRaf = requestAnimationFrame(animBomb);
      } else {
        sabotageMotionRaf = null;
        player.rotation.x = 0; player.rotation.z = 0;
        player.scale.set(1, 1, 1); player.position.y = 0;
      }
    })(t0);

  } else if (type === "ink") {
    // 준비 → 빠른 좌우 분무 진동 → 잔여 떨림
    const dur = 620;
    (function animInk(now) {
      if (!player || !state.running) { sabotageMotionRaf = null; return; }
      const t = Math.min((now - t0) / dur, 1);
      if (t < 0.10) {
        const p = t / 0.10;
        player.rotation.x = p * 0.2;
        player.scale.set(1 - p * 0.1, 1 + p * 0.1, 1 - p * 0.1);
      } else if (t < 0.72) {
        const p = (t - 0.10) / 0.62;
        const decay = 1 - p * 0.4;
        player.rotation.z = Math.sin(p * Math.PI * 8) * 0.55 * decay;
        player.rotation.x = 0.2 + Math.sin(p * Math.PI * 4) * 0.22;
        const pulse = 1 + Math.abs(Math.sin(p * Math.PI * 6)) * 0.12 * decay;
        player.scale.set(pulse, 1 / pulse, pulse);
        player.position.y = Math.abs(Math.sin(p * Math.PI * 5)) * 0.12 * decay;
      } else {
        const p = (t - 0.72) / 0.28;
        player.rotation.z = Math.sin((1 - p) * Math.PI * 2) * 0.08 * (1 - p);
        player.rotation.x = 0.2 * (1 - p);
        player.scale.set(1, 1, 1);
        player.position.y = 0;
      }
      if (t < 1) {
        sabotageMotionRaf = requestAnimationFrame(animInk);
      } else {
        sabotageMotionRaf = null;
        player.rotation.z = 0; player.rotation.x = 0;
        player.scale.set(1, 1, 1); player.position.y = 0;
      }
    })(t0);

  } else if (type === "trip") {
    // 백스윙 → 폭발적 발차기 점프 → 착지 쿵 → 바운스 정착
    const dur = 580;
    (function animTrip(now) {
      if (!player || !state.running) { sabotageMotionRaf = null; return; }
      const t = Math.min((now - t0) / dur, 1);
      if (t < 0.15) {
        const p = t / 0.15;
        player.rotation.x = p * 0.4;
        player.scale.set(1 + p * 0.08, 1 - p * 0.18, 1 + p * 0.08);
      } else if (t < 0.42) {
        const p = (t - 0.15) / 0.27;
        player.rotation.x = 0.4 - p * 1.25;
        player.rotation.z = Math.sin(p * Math.PI) * 0.22;
        player.scale.set(1.08 - p * 0.08, 0.82 + p * 0.52, 1.08 - p * 0.08);
        player.position.y = Math.sin(p * Math.PI) * 0.72;
      } else if (t < 0.58) {
        const p = (t - 0.42) / 0.16;
        player.rotation.x = -0.85 + p * 1.05;
        player.rotation.z = 0.22 * (1 - p);
        player.scale.set(1 + p * 0.12, 1.34 - p * 0.5, 1 + p * 0.12);
        player.position.y = 0;
      } else {
        const p = (t - 0.58) / 0.42;
        player.rotation.x = 0.2 * Math.cos(p * Math.PI * 3) * (1 - p);
        player.rotation.z = 0;
        const bounce = 1 + Math.cos(p * Math.PI * 3) * 0.06 * (1 - p);
        player.scale.set(bounce, 1 / bounce, bounce);
        player.position.y = Math.max(0, Math.sin(p * Math.PI * 2) * 0.1 * (1 - p));
      }
      if (t < 1) {
        sabotageMotionRaf = requestAnimationFrame(animTrip);
      } else {
        sabotageMotionRaf = null;
        player.rotation.x = 0; player.rotation.z = 0;
        player.scale.set(1, 1, 1); player.position.y = 0;
      }
    })(t0);
  }
}

function applyPvpDebuff(type, fromNickname) {
  if (!state.running || state.gameOver) return;
  if (type === "trip") {
    // 기존 failsafe 타이머 취소 후 재설정
    if (state._pvpTripTimeout) { clearTimeout(state._pvpTripTimeout); state._pvpTripTimeout = null; }
    state.pvpTripUntil = Date.now() + PVP_TRIP_DURATION_MS;
    // updatePlayer의 early-return이 어떤 이유로 실패해도 반드시 스턴 해제
    state._pvpTripTimeout = setTimeout(() => {
      state.pvpTripUntil = 0;
      state._pvpTripTimeout = null;
      if (player) player.rotation.z = 0;
    }, PVP_TRIP_DURATION_MS + 100);
    showToast(`😵 ${fromNickname}이(가) 넘어뜨렸습니다! 5초간 이동 불가`);
    playTripEffect(); // 내부에서 카메라 흔들기(스턴 강도, 0.28/650) 처리
  } else if (type === "ink") {
    showToast(`🖤 ${fromNickname}이(가) 먹물을 뿌렸습니다!`);
    playInkEffect();
    // ink는 전체 화면 오버레이라 트립만큼은 아니어도 충분히 눈에 띄지만,
    // 방해가 "왔다"는 물리적 신호는 통일해두는 게 좋아 가볍게 흔든다.
    triggerCameraShake(0.14, 400);
  } else if (type === "bomb") {
    showToast(`💣 ${fromNickname}이(가) 폭탄을 던졌습니다! 30초 안에 해제하세요!`);
    spawnPvpBomb(fromNickname);
    // bomb은 화면 전체를 덮는 연출이 없어(3D 공간에 조용히 생성) 토스트만으로는
    // 다른 게임 토스트(주문 완료 등)에 묻히기 쉽다. 가벼운 흔들림으로 "방해가
    // 들어왔다"는 걸 트립·ink와 동일하게 체감시킨다.
    triggerCameraShake(0.14, 400);
  }
}

// ── 넘어뜨리기 이펙트 ──
function playTripEffect() {
  // 1. 빨간 플래시
  dom.pvpRedFlash.classList.remove("hidden");
  dom.pvpRedFlash.classList.add("pvp-flash-anim");
  setTimeout(() => {
    dom.pvpRedFlash.classList.add("hidden");
    dom.pvpRedFlash.classList.remove("pvp-flash-anim");
  }, 600);

  // 2. 화면 흔들기 — THREE.js 카메라를 직접 흔든다.
  //    CSS transform 방식(canvas 또는 pvp-tilt-wrap)은 ① 3D뷰만 흔들리고
  //    오버레이가 제자리라 어색하거나, ② position:fixed 자식의 containing block을
  //    깨트리는 부작용이 있다. 카메라를 흔들면 project()로 계산되는
  //    별 오버레이 위치도 자연스럽게 함께 흔들린다.
  triggerCameraShake(0.28, 650);
  // 2b. 빨간 비네트 테두리 (transform 없음, box-shadow만)
  dom.pvpTiltWrap.classList.add("pvp-tilt-anim");
  setTimeout(() => dom.pvpTiltWrap.classList.remove("pvp-tilt-anim"), 700);

  // 3. 별 오버레이 (스턴 지속시간 동안) — 이전 타임아웃 취소 후 재설정
  if (state._pvpStarsTimeout) { clearTimeout(state._pvpStarsTimeout); }
  dom.pvpStarsOverlay.classList.remove("hidden");
  updatePvpStarsOverlayPosition();
  state._pvpStarsTimeout = setTimeout(() => {
    dom.pvpStarsOverlay.classList.add("hidden");
    state._pvpStarsTimeout = null;
  }, PVP_TRIP_DURATION_MS);
}

function updatePvpStarsOverlayPosition() {
  const overlay = dom.pvpStarsOverlay;
  if (!overlay || overlay.classList.contains("hidden") || !player) return;
  pvpStarsWorldPos.copy(player.position);
  pvpStarsWorldPos.y += 2.2;
  pvpStarsWorldPos.project(camera);
  const x = (pvpStarsWorldPos.x * 0.5 + 0.5) * window.innerWidth;
  const y = (-pvpStarsWorldPos.y * 0.5 + 0.5) * window.innerHeight;
  overlay.style.left = `${x}px`;
  overlay.style.top = `${y}px`;
}

// ── 먹물 이펙트 ──
function playInkEffect() {
  if (state.pvpInkActive) return;
  state.pvpInkActive = true;
  const overlay = dom.pvpInkOverlay;
  overlay.innerHTML = "";
  // 랜덤 위치에 먹물 블롭 28개 생성
  for (let i = 0; i < 28; i++) {
    const blob = document.createElement("div");
    blob.className = "pvp-ink-blob";
    blob.style.left = `${5 + Math.random() * 80}%`;
    blob.style.top = `${5 + Math.random() * 80}%`;
    blob.style.width = `${80 + Math.random() * 120}px`;
    blob.style.height = blob.style.width;
    blob.style.animationDelay = `${Math.random() * 0.3}s`;
    overlay.appendChild(blob);
  }
  overlay.classList.remove("hidden");
  setTimeout(() => {
    overlay.classList.add("pvp-ink-fade-out");
    setTimeout(() => {
      overlay.classList.add("hidden");
      overlay.classList.remove("pvp-ink-fade-out");
      overlay.innerHTML = "";
      state.pvpInkActive = false;
    }, 600);
  }, PVP_INK_DURATION_MS);
}

// ── 폭탄 생성/해제 ──
function spawnPvpBomb(fromNickname = "상대방") {
  // 안전한 위치 선택: 스테이션·기존 폭탄·플레이어와 충돌 방지
  const MIN_DIST = 2.6;
  const safe = BOMB_SPAWN_CANDIDATES.filter(([cx, cz]) => {
    const awayFromStations = STATION_OCCUPIED_XZS.every(([sx, sz]) =>
      Math.hypot(cx - sx, cz - sz) >= MIN_DIST
    );
    const awayFromBombs = state.pvpBombs.every(b =>
      Math.hypot(cx - b.mesh.position.x, cz - b.mesh.position.z) >= 1.8
    );
    const awayFromPlayer = !player ||
      Math.hypot(cx - player.position.x, cz - player.position.z) >= 2.0;
    return awayFromStations && awayFromBombs && awayFromPlayer;
  });
  const candidates = safe.length > 0 ? safe : BOMB_SPAWN_CANDIDATES;
  const [bx, bz] = candidates[Math.floor(Math.random() * candidates.length)];
  const by = 0;

  const group = new THREE.Group();
  // 몸통
  const body = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 10, 10),
    new THREE.MeshStandardMaterial({ color: 0x1a1a1a }),
  );
  // 도화선
  const fuse = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.25),
    new THREE.MeshStandardMaterial({ color: 0x8b4513 }),
  );
  fuse.position.set(0.05, 0.28, 0);
  fuse.rotation.z = 0.3;
  // 반짝이는 불꽃 (작은 구)
  const spark = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 6, 6),
    new THREE.MeshStandardMaterial({ color: 0xff6600, emissive: 0xff4400, emissiveIntensity: 1.2 }),
  );
  spark.position.set(0.12, 0.48, 0);
  group.add(body, fuse, spark);
  group.position.set(bx, by + 0.28, bz);
  scene.add(group);

  const bombId = Date.now() + Math.random();
  const bomb = { id: bombId, mesh: group, spark, interactable: null, expiresAt: Date.now() + PVP_BOMB_DURATION_MS, fromNickname };
  const interactable = {
    label: "💣 폭탄 해제",
    position: group.position,
    radius: 2.2,
    action: () => defusePvpBomb(bomb),
  };
  bomb.interactable = interactable;
  interactables.push(interactable);

  state.pvpBombs.push(bomb);
  updatePvpBombHud();
}

let defuseMiniGame = null; // { hits, cursorPos, cursorDir, speed, zoneLeft, zoneRight, bomb }
let skinPreview = null;   // { raf, renderer, scene, camera, mesh }

function defusePvpBomb(bomb) {
  if (defuseMiniGame) return;
  openDefuseMinigame(bomb);
}

function openDefuseMinigame(bomb) {
  const zoneCenter = 0.30 + Math.random() * 0.40;
  const zoneHalf = 0.045;
  defuseMiniGame = {
    hits: 0, cursorPos: 0, cursorDir: 1,
    speed: 0.70,
    zoneLeft: zoneCenter - zoneHalf,
    zoneRight: zoneCenter + zoneHalf,
    bomb,
  };

  const el = document.getElementById("defuse-minigame");
  const zone = document.getElementById("defuse-zone");
  zone.style.left = `${defuseMiniGame.zoneLeft * 100}%`;
  zone.style.width = `${zoneHalf * 2 * 100}%`;
  document.querySelectorAll(".defuse-hit").forEach(h => h.classList.remove("active"));
  el.classList.remove("hidden");
  // 커서 업데이트는 메인 animate() 루프의 updatePvpFrame(dt)에서 처리
}

function attemptDefuseHit() {
  if (!defuseMiniGame) return;
  const { cursorPos, zoneLeft, zoneRight, bomb } = defuseMiniGame;

  if (cursorPos >= zoneLeft && cursorPos <= zoneRight) {
    defuseMiniGame.hits++;
    defuseMiniGame.speed += 0.20;

    const zone = document.getElementById("defuse-zone");
    zone?.classList.add("defuse-zone-hit");
    setTimeout(() => zone?.classList.remove("defuse-zone-hit"), 250);

    const hitEls = document.querySelectorAll(".defuse-hit");
    hitEls[defuseMiniGame.hits - 1]?.classList.add("active");

    if (defuseMiniGame.hits >= 3) {
      const fromNick = bomb?.fromNickname;
      closeDefuseMinigame();
      showToast("💣 폭탄 해제 성공!");
      broadcastSabotageResult("bomb_defused", fromNick);
      removePvpBomb(bomb);
    }
  } else {
    // 틀리면 즉시 폭발
    const fromNick = bomb?.fromNickname;
    closeDefuseMinigame();
    const remaining = Math.max(state.pvpSlowUntil - Date.now(), 0);
    state.pvpSlowUntil = Date.now() + remaining + PVP_BOMB_PENALTY_SLOW_MS;
    showToast("💥 실수로 터뜨렸습니다! 15초간 이동속도 50% 감소");
    broadcastSabotageResult("bomb_exploded", fromNick);
    removePvpBomb(bomb);
  }
}

function closeDefuseMinigame() {
  if (!defuseMiniGame) return;
  defuseMiniGame = null;
  document.getElementById("defuse-minigame")?.classList.add("hidden");
}

function broadcastSabotageResult(result, toNickname) {
  if (!pvpChannel || !toNickname) return;
  pvpChannel.send({
    type: "broadcast", event: "sabotage_result",
    payload: { result, targetNickname: getProfileDisplayName(), toNickname },
  });
}

function removePvpBomb(bomb) {
  if (bomb) {
    scene.remove(bomb.mesh);
    const idx = interactables.indexOf(bomb.interactable);
    if (idx >= 0) interactables.splice(idx, 1);
    state.pvpBombs = state.pvpBombs.filter(b => b !== bomb);
  } else {
    // 전체 제거
    for (const b of state.pvpBombs) {
      scene.remove(b.mesh);
      const idx = interactables.indexOf(b.interactable);
      if (idx >= 0) interactables.splice(idx, 1);
    }
    state.pvpBombs = [];
  }
  updatePvpBombHud();
}

function updatePvpBombHud() {
  const hud = dom.pvpBombHud;
  if (!hud) return;
  if (state.pvpBombs.length === 0) {
    hud.classList.add("hidden");
    hud.innerHTML = "";
    return;
  }
  // 각 폭탄마다 행 동기화
  const existingRows = new Map([...hud.querySelectorAll(".pvp-bomb-row")].map(el => [el.dataset.id, el]));
  const newIds = new Set(state.pvpBombs.map(b => String(b.id)));
  // 없어진 것 제거
  for (const [id, el] of existingRows) {
    if (!newIds.has(id)) el.remove();
  }
  // 새 것 추가
  for (const b of state.pvpBombs) {
    if (!existingRows.has(String(b.id))) {
      const row = document.createElement("div");
      row.className = "pvp-bomb-row";
      row.dataset.id = String(b.id);
      row.innerHTML = `💣 해제까지 <strong>30</strong>초`;
      hud.appendChild(row);
    }
  }
  hud.classList.remove("hidden");
}

function clearPvpDebuffs() {
  // trip failsafe 타이머 취소
  if (state._pvpTripTimeout) { clearTimeout(state._pvpTripTimeout); state._pvpTripTimeout = null; }
  state.pvpTripUntil = 0;
  state.pvpSlowUntil = 0;
  state.pvpInkActive = false;
  player && (player.rotation.z = 0);
  // 방해 모션 RAF 완전 정리
  stopSabotageMotion();
  closeDefuseMinigame();
  removePvpBomb();
  if (state._pvpStarsTimeout) { clearTimeout(state._pvpStarsTimeout); state._pvpStarsTimeout = null; }
  state.cameraShake.remainingMs = 0;
  dom.pvpStarsOverlay?.classList.add("hidden");
  dom.pvpInkOverlay?.classList.add("hidden");
  dom.pvpTiltWrap?.classList.remove("pvp-tilt-anim");
}

function endPvpGame() {
  // 최종 점수 broadcast
  broadcastPvpScore();
  pvpChannel?.send({
    type: "broadcast", event: "game_done",
    payload: { orders: state.serviceStats?.completedOrders || 0, score: getChallengeRunScore() },
  });

  // 상대가 이미 끝났으면 바로 결과, 아니면 잠깐 대기
  if (state.pvpOpponent?.done) {
    showPvpResult();
  } else {
    state.pvpDoneWaitTimer = setTimeout(showPvpResult, PVP_RESULT_WAIT_MS);
  }
}

function showPvpResult() {
  if (state.pvpDoneWaitTimer) { clearTimeout(state.pvpDoneWaitTimer); state.pvpDoneWaitTimer = null; }
  // leavePvpRoomSilent()가 이 함수 끝에서 state.pvpRoom을 지우므로,
  // "다시 도전" 버튼이 나중에 눌릴 때 쓸 수 있게 지금 미리 붙잡아둔다.
  const isGhostMatch = Boolean(state.pvpRoom?.isGhost);
  const myScore = getChallengeRunScore();
  const myOrders = state.serviceStats?.completedOrders || 0;
  const oppScore = state.pvpOpponent?.score ?? 0;
  const oppOrders = state.pvpOpponent?.orders ?? 0;
  const oppName = state.pvpRoom?.opponentNickname || "상대방";
  const myName = getProfileDisplayName();
  const won = myScore > oppScore || (myScore === oppScore && myOrders > oppOrders);
  const draw = myScore === oppScore && myOrders === oppOrders;

  dom.pvpSabotagePanel.classList.add("hidden");
  dom.pvpOpponentHud.classList.add("hidden");
  dom.hud.classList.add("hidden");
  dom.questTracker.classList.add("hidden");
  dom.inventoryBar.classList.add("hidden");

  openModal(`
    <div style="text-align:center">
      <p class="eyebrow" style="margin:0">${draw ? "무승부" : won ? "🏆 승리!" : "😢 패배"}</p>
      <h2 style="font-size:clamp(32px,6vw,64px);margin:4px 0 20px">${draw ? "비겼습니다" : won ? "이겼습니다!" : "졌습니다..."}</h2>
      <div class="pvp-result-row pvp-result-mine ${won ? "pvp-result-winner" : ""}">
        <span class="pvp-result-name">🐹 ${myName} (나)</span>
        <span class="pvp-result-stat">${myOrders}주문 · <strong>${myScore}점</strong></span>
      </div>
      <div class="pvp-result-row ${!won && !draw ? "pvp-result-winner" : ""}">
        <span class="pvp-result-name">🐹 ${oppName}</span>
        <span class="pvp-result-stat">${oppOrders}주문 · <strong>${oppScore}점</strong></span>
      </div>
      <div class="mode-actions" style="margin-top:24px">
        <button type="button" id="pvp-rematch-btn" class="primary-action">다시 도전</button>
        <button type="button" id="pvp-exit-btn" class="primary-action secondary-action">나가기</button>
      </div>
    </div>
  `, { stopMusic: true });

  dom.modalContent.querySelector("#pvp-rematch-btn").addEventListener("click", () => {
    closeModal();
    if (isGhostMatch && lastGhostProfile) {
      void startGhostDuel(lastGhostProfile);
    } else {
      showPvpLobby();
    }
  });
  dom.modalContent.querySelector("#pvp-exit-btn").addEventListener("click", () => void leavePvpRoom());

  // 개인 레코드는 일반 챌린지와 동일하게 저장
  if (state.authUser && state.serviceStats) {
    void saveChallengeLeaderboardEntry();
  }
  void leavePvpRoomSilent();
}

async function leavePvpRoomSilent() {
  const client = getSupabase();
  const room = state.pvpRoom;
  if (!room) return;
  if (client && room.isHost && !room.isGhost) {
    await client.from("challenge_rooms").update({ status: "done" }).eq("room_code", room.roomCode);
  }
  if (room.isGhost) stopGhostDuel();
  if (pvpChannel) { client?.removeChannel(pvpChannel); pvpChannel = null; }
  removeOpponentMesh();
  pvpPosBroadcastTimer = 0;
  opponentPosBuffer = [];
  state._pendingOpponentSkin = null;
  clearPvpDebuffs();
  state.pvpRoom = null;
  state.pvpOpponent = null;
  state.pvpSabotageCooldowns = {};
}

// 지연 버퍼 보간: opponentPosBuffer에 쌓인 (수신 시각, 위치) 샘플들에서
// "지금보다 OPPONENT_INTERP_DELAY_MS만큼 과거" 시점을 감싸는 두 샘플을 찾아
// 그 사이를 선형보간한다. 순간이동한 목표를 lerp로 쫓아가는 방식과 달리,
// 항상 실제로 있었던 두 지점 "사이"만 보여주므로 네트워크 간격이 들쭉날쭉해도
// 끊김이 생기지 않는다 — 대신 화면에 보이는 상대 위치가 약간(120ms) 과거다.
function updateOpponentInterpolation() {
  if (!state.pvpRoom || state.pvpRoom.isGhost) return;
  const buf = opponentPosBuffer;
  if (buf.length === 0) return;
  if (buf.length === 1) {
    opponentTargetX = buf[0].x;
    opponentTargetZ = buf[0].z;
    opponentTargetRY = buf[0].ry;
    return;
  }
  const renderTime = performance.now() - OPPONENT_INTERP_DELAY_MS;
  let i = buf.length - 2;
  while (i > 0 && buf[i].t > renderTime) i -= 1;
  const a = buf[i];
  const b = buf[Math.min(i + 1, buf.length - 1)];
  const span = b.t - a.t;
  const frac = span > 0 ? THREE.MathUtils.clamp((renderTime - a.t) / span, 0, 1) : 1;
  opponentTargetX = a.x + (b.x - a.x) * frac;
  opponentTargetZ = a.z + (b.z - a.z) * frac;
  let dRY = b.ry - a.ry;
  dRY = ((dRY + Math.PI) % (Math.PI * 2)) - Math.PI;
  opponentTargetRY = a.ry + dRY * frac;
}

function updatePvpFrame(dt) {
  if (!state.pvpRoom || !state.running) return;
  // 주기적 점수 broadcast
  state.pvpScoreBroadcastTimer = (state.pvpScoreBroadcastTimer || 0) + dt * 1000;
  if (state.pvpScoreBroadcastTimer >= PVP_SCORE_BROADCAST_INTERVAL_MS) {
    state.pvpScoreBroadcastTimer = 0;
    broadcastPvpScore();
  }

  // 위치 브로드캐스트 (~60ms마다) — 간격을 좁혀 보간할 거리 자체를 줄인다.
  pvpPosBroadcastTimer += dt * 1000;
  if (pvpPosBroadcastTimer >= 60 && player && pvpChannel) {
    pvpPosBroadcastTimer = 0;
    pvpChannel.send({
      type: "broadcast", event: "pos_update",
      payload: {
        x: player.position.x,
        z: player.position.z,
        ry: player.rotation.y,
        carry: !!playerCarryMesh?.visible,
      },
    });
  }

  // 실제 PvP 상대 위치는 지연 버퍼 보간으로 계산한다(고스트는 건드리지 않음).
  updateOpponentInterpolation();

  // 상대방 캐릭터 위치 lerp
  // Math.min(1, dt*12)는 프레임이 조금만 튀어도(83ms 이상) lf가 1로 그대로
  // 클램프되어 순간이동처럼 뚝뚝 끊겨 보였다. 지수 감쇠(1-e^-kt)는 절대
  // 1에 도달하지 않아 프레임이 튀어도 부드럽게 따라잡고, 프레임레이트에
  // 무관하게 같은 체감 속도를 유지한다. 보간된 목표를 한 번 더 다듬는
  // 역할이라 지금은 아주 미세한 흔들림만 정리하면 된다.
  if (opponentMesh) {
    const lf = 1 - Math.exp(-10 * dt);
    opponentMesh.position.x += (opponentTargetX - opponentMesh.position.x) * lf;
    opponentMesh.position.z += (opponentTargetZ - opponentMesh.position.z) * lf;
    // 회전 최단 경로 보간
    let dRY = opponentTargetRY - opponentMesh.rotation.y;
    dRY = ((dRY + Math.PI) % (Math.PI * 2)) - Math.PI;
    opponentMesh.rotation.y += dRY * lf;
    updateOpponentNametag();
  }

  // 폭탄 해제 미니게임 커서 업데이트 (별도 RAF 없이 메인 루프에서 처리)
  if (defuseMiniGame) {
    defuseMiniGame.cursorPos += defuseMiniGame.cursorDir * defuseMiniGame.speed * dt;
    if (defuseMiniGame.cursorPos >= 1) { defuseMiniGame.cursorPos = 1; defuseMiniGame.cursorDir = -1; }
    if (defuseMiniGame.cursorPos <= 0) { defuseMiniGame.cursorPos = 0; defuseMiniGame.cursorDir = 1; }
    const cursor = document.getElementById("defuse-cursor");
    if (cursor) cursor.style.left = `${defuseMiniGame.cursorPos * 100}%`;
  }

  // 쿨다운 만료 체크 → 버튼 상태 갱신
  updatePvpSabotagePanel();
  // 폭탄 타이머 체크 (배열 순회, 패널티 누적)
  const now = Date.now();
  for (const bomb of [...state.pvpBombs]) {
    const remaining = Math.ceil((bomb.expiresAt - now) / 1000);
    const row = dom.pvpBombHud?.querySelector(`.pvp-bomb-row[data-id="${bomb.id}"]`);
    if (row) row.querySelector("strong").textContent = Math.max(0, remaining);
    if (now >= bomb.expiresAt) {
      if (defuseMiniGame?.bomb === bomb) closeDefuseMinigame();
      const slowRemaining = Math.max(state.pvpSlowUntil - now, 0);
      state.pvpSlowUntil = now + slowRemaining + PVP_BOMB_PENALTY_SLOW_MS;
      updateHud();
      showToast("💥 폭탄 폭발! 15초간 이동속도 50% 감소");
      broadcastSabotageResult("bomb_exploded", bomb.fromNickname);
      removePvpBomb(bomb);
    }
  }
  updatePvpDebuffNotice();
}

function updatePvpOpponentHud() {
  if (!state.pvpOpponent) return;
  dom.pvpOpponentName.textContent = state.pvpOpponent.nickname || "상대방";
  dom.pvpOpponentOrders.textContent = `${state.pvpOpponent.orders}주문`;
  dom.pvpOpponentScore.textContent = `${state.pvpOpponent.score}점`;
}

function updatePvpSabotagePanel() {
  if (!state.pvpRoom) return;
  dom.pvpSabotagePanel.querySelectorAll("[data-sabotage]").forEach((btn) => {
    const type = btn.dataset.sabotage;
    const cooldownUntil = state.pvpSabotageCooldowns[type] || 0;
    const onCooldown = Date.now() < cooldownUntil;
    btn.disabled = onCooldown || !state.running || state.gameOver;
    const costEl = btn.querySelector(".sab-cost");
    if (costEl) {
      const totalCd = (PVP_SABOTAGE_COOLDOWNS_MS[type] ?? 25000) / 1000;
      costEl.textContent = onCooldown
        ? `${Math.ceil((cooldownUntil - Date.now()) / 1000)}s`
        : `쿨: ${totalCd}s`;
    }
  });
}

function updatePvpDebuffNotice() {
  const debuffs = [];
  const stockout = state.pvpDebuffs?.stockout;
  if (stockout && Date.now() < stockout.expiresAt) {
    const name = INGREDIENTS.find((i) => i.id === stockout.ingredientId)?.name || stockout.ingredientId;
    debuffs.push(`🚫 ${name} 품절 (${Math.ceil((stockout.expiresAt - Date.now()) / 1000)}s)`);
  }
  if (state.pvpNextMinigameSpeedDebuff) debuffs.push("⚡ 미니게임 방해 대기 중");
  if (dom.pvpDebuffNotice) {
    dom.pvpDebuffNotice.textContent = debuffs.join(" · ");
    dom.pvpDebuffNotice.classList.toggle("hidden", debuffs.length === 0);
  }
}

function recordDayHistory(won) {
  if (!state.serviceStats || state.serviceStats.recorded) return;
  state.serviceStats.recorded = true;
  const entry = {
    day: state.day,
    won,
    event: state.dailyEvent?.name || "없음",
    completed: state.serviceStats.completedOrders,
    total: state.gameMode === "challenge" ? state.serviceStats.completedOrders : state.orderQueue.length,
    bestScore: state.serviceStats.bestScore,
    coins: state.serviceStats.coinsEarned,
    reputation: state.serviceStats.reputationEarned,
    dishes: state.serviceStats.dishes,
    penaltyScore: state.serviceStats.penaltyScore || 0,
  };
  state.history.push(entry);
  state.history = state.history.slice(-20);
  if (state.authUser) void saveHistoryEntry(entry);
}

function makeServiceSummary(won, reason = "") {
  const stats = state.serviceStats || {
    completedOrders: 0,
    failedJudgements: 0,
    bestScore: 0,
    coinsEarned: 0,
    reputationEarned: 0,
    dishes: [],
    penaltyScore: 0,
  };
  const elapsed = formatClearTime(getElapsedSeconds());
  const dishSummary = stats.dishes.length
    ? stats.dishes.map((dish) => `${dish.name} ${dish.score}점`).join(" · ")
    : "완료한 주문 없음";
  const penaltyLine = stats.penaltyScore ? ` · 포기 패널티 ${stats.penaltyScore}점` : "";
  if (state.gameMode === "challenge") {
    const totalScore = getChallengeRunScore();
    const averageScore = stats.completedOrders ? Math.round(totalScore / stats.completedOrders) : 0;
    return `${reason || "챌린지가 종료되었습니다."}
완료 주문 ${stats.completedOrders}개 · 누적 점수 ${totalScore}점${penaltyLine} · 평균 ${averageScore}점 · 최고 점수 ${stats.bestScore}점
이번 도전에서 번 코인 ${stats.coinsEarned} · 평판 +${stats.reputationEarned} · 현재 등급 ${getReputationTier().name}
라운드 조건 ${state.dailyEvent?.name || "없음"} · 플레이 시간 ${elapsed}
완성 요리: ${dishSummary}`;
  }

  const heading = won ? "오늘의 모든 주문을 마쳤습니다." : `${reason} 다음 영업에서는 주문 큐를 끝까지 완성해봐요.`;

  return `${heading}
완료 주문 ${stats.completedOrders}/${state.orderQueue.length} · 최고 점수 ${stats.bestScore}점 · 실패 평가 ${stats.failedJudgements}회
오늘 번 코인 ${stats.coinsEarned} · 평판 +${stats.reputationEarned} · 현재 등급 ${getReputationTier().name}
오늘 이벤트 ${state.dailyEvent?.name || "없음"} · 영업 시간 ${elapsed}
완성 요리: ${dishSummary}`;
}

function openModal(html, options = {}) {
  state.modalOpen = true;
  state.modalStopsMusic = Boolean(options.stopMusic);
  state.modalReturn = options.returnTo || null;
  dom.modalContent.innerHTML = html;
  dom.modal.classList.remove("hidden");
  syncMusicPlayback();
}

function clearRegionActivity() {
  if (state.regionActivity?.frameId) cancelAnimationFrame(state.regionActivity.frameId);
  if (state.regionActivity?.timeoutId) clearTimeout(state.regionActivity.timeoutId);
  state.regionActivity = null;
}

function closeModal(play = true, force = false) {
  if (state.minigame?.active && !force) {
    showToast("요리 중에는 타이밍을 끝까지 맞춰야 합니다.");
    return;
  }

  clearOrderChallengeTimer();
  clearRegionActivity();
  if (skinPreview) {
    cancelAnimationFrame(skinPreview.raf);
    skinPreview.renderer.dispose();
    skinPreview = null;
  }
  const returnTo = state.modalReturn;
  state.modalReturn = null;
  state.modalOpen = false;
  state.modalStopsMusic = false;
  dom.modal.classList.add("hidden");
  if (play) playClick();

  if (!force && returnTo === "cooking") {
    openCooking();
  } else if (!force && returnTo === "pause-menu") {
    openPauseMenu();
  } else if (!force && returnTo === "resume-game") {
    state.paused = false;
  } else if (!force && returnTo === "complete-order" && state.scoreboardConclusion) {
    finishPassedScoreboard();
  }
  syncMusicPlayback();
}

function updateHud() {
  dom.coinCount.textContent = String(state.coins);
  dom.reputationCount.textContent = String(state.reputation);
  dom.timer.textContent = state.gameMode === "career" ? "자유" : formatTime(state.timeLeft);
  dom.timer.classList.toggle(
    "timer-panic",
    state.gameMode !== "career" && state.running && !state.gameOver && state.timeLeft <= PANIC_BGM_THRESHOLD,
  );
  dom.mapButton.classList.toggle("hidden", state.gameMode !== "career" || !state.running || state.gameOver);
  dom.objective.textContent = getObjectiveSummary();

  if (state.currentQuest) {
    const quest = state.currentQuest;
    dom.questTitle.textContent = quest.name;
    dom.questDetail.textContent = quest.progress !== undefined && quest.total !== undefined
      ? `${quest.detail} (${quest.progress}/${quest.total})`
      : quest.detail;
  } else {
    dom.questTitle.textContent = state.gameMode === "career" ? "운영 중" : "없음";
    dom.questDetail.textContent = state.gameMode === "career"
      ? `${getCareerProgressSummary()} · 지도 버튼이나 M키로 지역을 이동할 수 있습니다.`
      : "일 게시판에서 랜덤 일을 받으세요.";
  }

  const inventoryEntries = Object.entries(state.inventory).filter(([, count]) => count > 0);
  const storageBadge = `<div class="ingredient-chip storage-chip"><span class="ingredient-dot" style="background:#277d85"></span><span>보관 ${getInventoryCount()}/${getStorageLimit()}</span></div>`;
  dom.inventoryBar.innerHTML = inventoryEntries.length
    ? storageBadge +
      inventoryEntries
        .map(([id, count]) => {
          const ingredient = INGREDIENTS.find((item) => item.id === id);
          return `
            <div class="ingredient-chip">
              <span class="ingredient-dot" style="background:${ingredient.color}"></span>
              <span>${ingredient.name} × ${count}</span>
            </div>
          `;
        })
        .join("")
    : `${storageBadge}<div class="ingredient-chip"><span class="ingredient-dot" style="background:#ef5b4f"></span><span>재료 없음</span></div>`;
}

function formatTime(seconds) {
  const safe = Math.max(0, Math.ceil(seconds));
  const min = Math.floor(safe / 60);
  const sec = safe % 60;
  return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

function getElapsedSeconds() {
  return Math.max(0, Math.round(GAME_SECONDS - state.timeLeft));
}

function formatClearTime(seconds) {
  const safe = Math.max(0, Math.round(seconds));
  const min = Math.floor(safe / 60);
  const sec = safe % 60;
  return `${min}분 ${String(sec).padStart(2, "0")}초`;
}

// 한글 단어 뒤에 받침 유무에 맞는 조사를 붙인다. withWordName("비스트로", "와", "과") → "와".
function withParticle(word, noBatchimForm, batchimForm) {
  const lastChar = String(word).trim().at(-1) || "";
  const code = lastChar.charCodeAt(0) - 0xac00;
  if (code < 0 || code > 11171) return noBatchimForm; // 한글 완성형 범위 밖이면 기본값
  return code % 28 === 0 ? noBatchimForm : batchimForm;
}

function formatVolumePercent(value) {
  return `${Math.round(clampVolume(value, 0) * 100)}%`;
}

function clampVolume(value, fallback) {
  const safe = Number.isFinite(value) ? value : fallback;
  return THREE.MathUtils.clamp(safe, 0, 1);
}

function syncSoundToggle() {
  if (!dom.soundToggle) return;
  dom.soundToggle.textContent = state.soundEnabled ? "♪" : "×";
}

function getReputationTier() {
  return REPUTATION_TIERS.reduce((best, tier) => (state.reputation >= tier.min ? tier : best), REPUTATION_TIERS[0]);
}

function formatTraits(traits) {
  return Object.entries(traits)
    .map(([key, value]) => `${TRAIT_LABELS[key]} +${value}`)
    .join(" · ");
}

function ingredientImage(ingredient) {
  return `
    <div class="ingredient-art ingredient-art-${ingredient.art}" aria-hidden="true">
      <span></span>
    </div>
  `;
}

function getIngredientName(id) {
  return INGREDIENTS.find((item) => item.id === id)?.name || id;
}

function showToast(message) {
  clearTimeout(toastTimer);
  clearTimeout(toastHideTimer);
  dom.toast.textContent = message;
  dom.toast.classList.remove("hidden");
  // hidden(display:none) 해제 직후 바로 클래스를 더하면 브라우저가 두 변경을
  // 한 프레임에 합쳐버려 opacity/transform 전환이 스킵된다. 강제 리플로우로 끊는다.
  void dom.toast.offsetWidth;
  dom.toast.classList.add("toast-visible");
  toastTimer = setTimeout(() => {
    dom.toast.classList.remove("toast-visible");
    toastHideTimer = setTimeout(() => dom.toast.classList.add("hidden"), 220);
  }, 2600);
}

// ── juice 연출 헬퍼 ──────────────────────────────────────
// 화면 흔들기는 PvP 넘어뜨리기와 공유한다 (updateCamera가 state.cameraShake를 소비).
function triggerCameraShake(magnitude = 0.28, durationMs = 650) {
  state.cameraShake.magnitude = magnitude;
  state.cameraShake.durationMs = durationMs;
  state.cameraShake.remainingMs = durationMs;
}

function spawnParticleBurst(x, y, options = {}) {
  const {
    count = 12,
    colors = ["#f5c84b", "#fff8e8", "#ef5b4f"],
    spread = 70,
    size = 8,
    duration = 640,
  } = options;
  const layer = dom.juiceLayer;
  if (!layer) return;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "juice-particle";
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.7;
    const dist = spread * (0.55 + Math.random() * 0.55);
    el.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    el.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.background = colors[i % colors.length];
    el.style.animationDuration = `${duration}ms`;
    layer.appendChild(el);
    setTimeout(() => el.remove(), duration);
  }
}

const juiceScratchVec = new THREE.Vector3();
// 3D 월드 좌표를 화면 픽셀 좌표로 투영한다. player 위치 등에서 coin fly를 시작할 때 쓴다.
function worldToScreen(worldPos) {
  juiceScratchVec.copy(worldPos);
  juiceScratchVec.project(camera);
  return {
    x: (juiceScratchVec.x * 0.5 + 0.5) * window.innerWidth,
    y: (-juiceScratchVec.y * 0.5 + 0.5) * window.innerHeight,
  };
}

function spawnStarBurst(x, y, options = {}) {
  const { count = 10, spread = 110, duration = 900 } = options;
  const layer = dom.juiceLayer;
  if (!layer) return;
  for (let i = 0; i < count; i++) {
    const el = document.createElement("div");
    el.className = "juice-star";
    el.textContent = "⭐";
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
    const dist = spread * (0.6 + Math.random() * 0.5);
    el.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    el.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    el.style.setProperty("--juice-star-size", `${40 + Math.random() * 36}px`);
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.animationDuration = `${duration}ms`;
    layer.appendChild(el);
    setTimeout(() => el.remove(), duration);
  }
}

// 화면 위 (fromX, fromY) 지점에서 코인 HUD 숫자로 코인 아이콘이 날아가는 연출.
// 도착 시점에 HUD 숫자를 팝 애니메이션으로 강조한다. amount가 0 이하면 아무 일도 하지 않는다.
function flyCoinToHud(fromX, fromY, amount) {
  const layer = dom.juiceLayer;
  if (!layer || !dom.coinCount || amount <= 0) return;
  const target = dom.coinCount.getBoundingClientRect();
  const targetX = target.left + target.width / 2;
  const targetY = target.top + target.height / 2;
  const coinCount = Math.min(9, 2 + Math.floor(amount / 12));
  const flightMs = 560;
  for (let i = 0; i < coinCount; i++) {
    const el = document.createElement("div");
    el.className = "juice-coin";
    el.textContent = "🪙";
    const jitterX = (Math.random() - 0.5) * 46;
    const jitterY = (Math.random() - 0.5) * 46;
    el.style.left = `${fromX + jitterX}px`;
    el.style.top = `${fromY + jitterY}px`;
    el.style.setProperty("--dx", `${targetX - fromX - jitterX}px`);
    el.style.setProperty("--dy", `${targetY - fromY - jitterY}px`);
    const delay = i * 50;
    el.style.animationDelay = `${delay}ms`;
    el.style.animationDuration = `${flightMs}ms`;
    layer.appendChild(el);
    setTimeout(() => el.remove(), flightMs + delay + 40);
  }
  setTimeout(() => popElement(dom.coinCount), flightMs * 0.55);
}

function popElement(el) {
  if (!el) return;
  el.classList.remove("juice-pop");
  void el.offsetWidth;
  el.classList.add("juice-pop");
  setTimeout(() => el.classList.remove("juice-pop"), 340);
}

// 0에서 to까지 정수를 durationMs 동안 세는 카운트업. 완료 시 onDone을 부른다.
function animateCountUp(el, to, durationMs = 500, options = {}) {
  if (!el) return;
  const { format = (n) => String(n), onDone } = options;
  const start = performance.now();
  function step(now) {
    const t = Math.min(1, (now - start) / durationMs);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = format(Math.round(to * eased));
    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = format(to);
      onDone?.();
    }
  }
  requestAnimationFrame(step);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function lerpAngle(from, to, amount) {
  const delta = Math.atan2(Math.sin(to - from), Math.cos(to - from));
  return from + delta * amount;
}

function makeLabelBoard(text, background, foreground) {
  const canvas = document.createElement("canvas");
  canvas.width = 768;
  canvas.height = 320;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = foreground;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const lines = text.split("\n");
  const fontSize = lines.length > 1 ? 86 : 110;
  ctx.font = `950 ${fontSize}px system-ui, sans-serif`;
  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, canvas.height / 2 + (index - (lines.length - 1) / 2) * fontSize * 0.95);
  });

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const board = mesh(new THREE.BoxGeometry(1.76, 0.82, 0.08), mat("#ffffff"), [0, 0, 0]);
  const face = mesh(
    new THREE.PlaneGeometry(1.6, 0.7),
    new THREE.MeshBasicMaterial({ map: texture }),
    [0, 0, 0.045],
  );
  board.add(face);
  return board;
}

function mesh(geometry, material, position) {
  const item = new THREE.Mesh(geometry, material);
  item.position.set(...position);
  item.castShadow = true;
  item.receiveShadow = true;
  return item;
}

function mat(color, options = {}) {
  return new THREE.MeshStandardMaterial({
    color,
    roughness: options.roughness ?? 0.72,
    metalness: options.metalness ?? 0.02,
    flatShading: true,
  });
}

function ensureAudio() {
  if (!state.soundEnabled) return;
  if (!audioCtx) {
    audioCtx = new AudioContext();
  }
  if (audioCtx.state === "suspended") audioCtx.resume();
}

function ensureBgmAudio() {
  if (!bgmAudio) {
    bgmAudio = new Audio(BGM_AUDIO_PATH);
    bgmAudio.loop = true;
    bgmAudio.preload = "auto";
    bgmAudio.load();
    try {
      bgmAudio.currentTime = 0;
    } catch {
      // Ignore browsers that do not allow seeking before metadata is ready.
    }
  }
  syncMusicVolume();
}

function ensurePanicBgmAudio() {
  if (!panicBgmAudio) {
    panicBgmAudio = new Audio(PANIC_BGM_PATH);
    panicBgmAudio.loop = true;
    panicBgmAudio.preload = "auto";
    panicBgmAudio.load();
  }
  panicBgmAudio.volume = state.soundEnabled ? clampVolume(state.musicVolume * BGM_VOLUME_SCALE, 0) : 0;
}

function resetMusicPlayback() {
  ensureBgmAudio();
  if (!bgmAudio) return;
  bgmAudio.pause();
  try {
    bgmAudio.currentTime = 0;
    restartMusicOnNextPlay = false;
  } catch {
    restartMusicOnNextPlay = true;
  }
  // 긴박한 BGM도 초기화
  if (panicBgmAudio) {
    panicBgmAudio.pause();
    try { panicBgmAudio.currentTime = 0; } catch { /* ignore */ }
  }
  panicBgmActive = false;
}

function startMusic() {
  syncMusicPlayback();
}

function stopMusic() {
  if (bgmAudio) bgmAudio.pause();
  if (panicBgmAudio) panicBgmAudio.pause();
  panicBgmActive = false;
}

function syncMusicVolume() {
  if (!bgmAudio) return;
  const vol = state.soundEnabled ? clampVolume(state.musicVolume * BGM_VOLUME_SCALE, 0) : 0;
  bgmAudio.volume = vol;
  if (panicBgmAudio) panicBgmAudio.volume = vol;
}

function syncMusicPlayback() {
  if (!state.soundEnabled) {
    stopMusic();
    return;
  }

  ensureBgmAudio();
  if (!bgmAudio) return;

  const shouldPlay = state.running && !state.gameOver && !state.paused && !state.modalStopsMusic;
  if (!shouldPlay) {
    bgmAudio.pause();
    if (panicBgmAudio) panicBgmAudio.pause();
    return;
  }

  // 챌린지/튜토리얼 모드에서 1분 이하면 긴박한 BGM으로 전환
  const usePanic =
    (state.gameMode === "challenge" || state.gameMode === "tutorial") &&
    state.timeLeft <= PANIC_BGM_THRESHOLD &&
    state.timeLeft > 0;

  if (usePanic && !panicBgmActive) {
    // 일반 BGM → 긴박한 BGM 전환
    bgmAudio.pause();
    ensurePanicBgmAudio();
    try { panicBgmAudio.currentTime = 0; } catch { /* ignore */ }
    const playAttempt = panicBgmAudio.play();
    if (playAttempt?.catch) playAttempt.catch(() => {});
    panicBgmActive = true;
    return;
  }

  if (!usePanic && panicBgmActive) {
    // 긴박한 BGM → 일반 BGM 복귀 (시간 추가 등 예외 상황 대비)
    if (panicBgmAudio) panicBgmAudio.pause();
    panicBgmActive = false;
  }

  if (panicBgmActive) {
    // 이미 긴박한 BGM 재생 중 — 별도 처리 불필요
    return;
  }

  if (restartMusicOnNextPlay) {
    try {
      bgmAudio.currentTime = 0;
    } catch {
      // Some browsers may briefly block seeking before playback starts.
    }
    restartMusicOnNextPlay = false;
  }

  const playAttempt = bgmAudio.play();
  if (playAttempt?.catch) {
    playAttempt.catch(() => {});
  }
}

function playTone(freq, duration = 0.1, gain = 0.08, type = "sine", channel = "effects") {
  if (!state.soundEnabled || !audioCtx) return;
  const osc = audioCtx.createOscillator();
  const amp = audioCtx.createGain();
  const channelVolume = channel === "music"
    ? state.musicVolume
    : clampVolume(state.effectsVolume * EFFECTS_VOLUME_SCALE, DEFAULT_EFFECTS_VOLUME);
  const finalGain = Math.max(0.0001, gain * channelVolume);
  if (channelVolume <= 0) return;
  osc.type = type;
  osc.frequency.value = freq;
  amp.gain.setValueAtTime(0.0001, audioCtx.currentTime);
  amp.gain.exponentialRampToValueAtTime(finalGain, audioCtx.currentTime + 0.015);
  amp.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
  osc.connect(amp).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration + 0.02);
}

function playClick() {
  playTone(440, 0.05, 0.045, "triangle");
}

function playCoin() {
  playTone(660, 0.07, 0.065, "sine");
  setTimeout(() => playTone(880, 0.08, 0.055, "sine"), 80);
}

function playRewardCoin() {
  playTone(740, 0.08, 0.08, "triangle");
  setTimeout(() => playTone(988, 0.1, 0.075, "triangle"), 85);
  setTimeout(() => playTone(1244, 0.12, 0.065, "sine"), 170);
}

function playWork() {
  playTone(260, 0.06, 0.05, "square");
  setTimeout(() => playTone(340, 0.05, 0.035, "triangle"), 70);
}

function playPaper() {
  playTone(210, 0.04, 0.03, "square");
  setTimeout(() => playTone(170, 0.05, 0.025, "triangle"), 30);
  setTimeout(() => playTone(240, 0.05, 0.02, "square"), 70);
}

function playCook() {
  playTone(392, 0.08, 0.055, "triangle");
  setTimeout(() => playTone(523, 0.08, 0.055, "triangle"), 90);
  setTimeout(() => playTone(784, 0.1, 0.05, "sine"), 180);
}

function playSuccess() {
  [523, 659, 784, 1046].forEach((note, index) => {
    setTimeout(() => playTone(note, 0.12, 0.065, "sine"), index * 110);
  });
}

function playFail() {
  playTone(220, 0.13, 0.07, "sawtooth");
  setTimeout(() => playTone(164, 0.16, 0.055, "sawtooth"), 120);
}
