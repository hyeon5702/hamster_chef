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
  toast: document.querySelector("#toast"),
};

const INGREDIENTS = [
  {
    id: "cheese",
    name: "도토리 치즈",
    price: 18,
    color: "#f2c94c",
    art: "cheese",
    traits: { savory: 25, creamy: 8 },
  },
  {
    id: "cream",
    name: "구름 크림",
    price: 18,
    color: "#fff4c7",
    art: "cream",
    traits: { creamy: 32 },
  },
  {
    id: "herb",
    name: "초록 허브",
    price: 14,
    color: "#2da66f",
    art: "herb",
    traits: { fresh: 26 },
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
const GAME_SECONDS = 480;
const DAY_ORDER_COUNT = 3;
const ORDER_SCORE_STEPS = [75, 80, 85, 90];
const ORDER_COMPLETION_REWARD = 18;
const LEGACY_SAVE_KEY = "hamster-chef-save-v1";
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
const ORDER_MAX_MISTAKES = 2;
const ORDER_DISHES = ["별빛 크림 스튜", "숲속 버섯 플레이트", "당근 크림볼"];
const ORDER_REQUESTS = ["매운맛 제외", "신선한 향 강조", "부드럽게 조리", "고소함 많이", "소스 따로", "치즈 추가"];
const DEFAULT_MUSIC_VOLUME = 0.6;
const DEFAULT_EFFECTS_VOLUME = 0.85;
const BGM_AUDIO_PATH = "./assets/audio/hamster-chef-bgm.mp3";
const AUDIO_SESSION_KEY = `session-${Date.now()}`;

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
    needs: { umami: 24, savory: 32, fresh: 24 },
    penalty: { trait: "spicy", limit: 28, points: 6 },
    bonus: { trait: "sweet", threshold: 10, points: 5 },
  },
  {
    id: "carrot-cream",
    name: "당근 크림볼",
    unlockDay: 4,
    hint: "당근의 달콤함과 크림의 부드러움을 둥글게 묶고, 신선한 향으로 마무리합니다.",
    warning: "매운맛은 이 요리와 거의 어울리지 않습니다.",
    needs: { sweet: 20, creamy: 32, fresh: 30 },
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
    needs: { savory: 42, creamy: 38, sweet: 18 },
    penalty: { trait: "spicy", limit: 16, points: 12 },
    bonus: { trait: "fresh", threshold: 18, points: 4 },
  },
];

const QUESTS = [
  {
    id: "errand",
    name: "주문표 전달",
    pay: 20,
    summary: "게시판의 주문표를 주방 카운터에 전달합니다.",
  },
  {
    id: "dishwash",
    name: "반짝 접시 정리",
    pay: 25,
    summary: "싱크대에서 접시 5장을 닦습니다.",
  },
  {
    id: "stock",
    name: "재료 상자 정리",
    pay: 30,
    summary: "식당 바닥의 상자 3개를 선반으로 옮깁니다.",
  },
];

const state = {
  running: false,
  gameOver: false,
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
  adminEnabled: false,
  dailyEvent: null,
  orderQueue: [],
  orderIndex: 0,
  serviceStats: null,
  currentQuest: null,
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
  authMode: "login",
  authMessage: "",
  authBannerType: "warning",
  gameMode: "challenge",
};

const keys = new Set();
const clock = new THREE.Clock();
const pointer = new THREE.Vector2();
const interactables = [];
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
let restartMusicOnNextPlay = true;
let toastTimer;
let supabase;

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

  scene.add(group);

  const station = { id, label, group, position: group.position, radius: 2.2, action, markerMesh };
  interactables.push(station);
  return station;
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

function createPlayer() {
  player = new THREE.Group();
  player.position.set(0, 0, 0);

  const body = mesh(new THREE.SphereGeometry(0.56, 20, 14), mat("#d99b61"), [0, 0.62, 0]);
  body.scale.set(1.02, 0.96, 0.88);
  player.add(body);

  const belly = mesh(new THREE.SphereGeometry(0.38, 16, 12), mat("#ffe2ae"), [0, 0.54, 0.35]);
  belly.scale.set(1, 0.86, 0.52);
  player.add(belly);

  const head = mesh(new THREE.SphereGeometry(0.44, 20, 14), mat("#e5aa72"), [0, 1.18, 0.08]);
  player.add(head);

  const snout = mesh(new THREE.SphereGeometry(0.17, 12, 10), mat("#ffe2ae"), [0, 1.12, 0.46]);
  snout.scale.set(1.2, 0.78, 0.76);
  player.add(snout);

  for (const side of [-1, 1]) {
    const ear = mesh(new THREE.SphereGeometry(0.16, 12, 8), mat("#d68e5d"), [side * 0.36, 1.46, 0]);
    ear.scale.set(0.9, 1.1, 0.68);
    player.add(ear);

    const eye = mesh(new THREE.SphereGeometry(0.035, 10, 8), mat("#221a1d"), [side * 0.14, 1.24, 0.47]);
    player.add(eye);

    const paw = mesh(new THREE.SphereGeometry(0.13, 12, 8), mat("#c98154"), [side * 0.43, 0.6, 0.24]);
    paw.scale.set(0.8, 1.2, 0.7);
    player.add(paw);
  }

  const nose = mesh(new THREE.SphereGeometry(0.045, 10, 8), mat("#5b2d32"), [0, 1.15, 0.59]);
  player.add(nose);

  const hatBase = mesh(new THREE.CylinderGeometry(0.26, 0.3, 0.22, 18), mat("#fff8e8"), [0, 1.58, 0.02]);
  player.add(hatBase);
  for (const offset of [-0.18, 0, 0.18]) {
    const puff = mesh(new THREE.SphereGeometry(0.17, 12, 8), mat("#ffffff"), [offset, 1.74, 0.02]);
    player.add(puff);
  }

  playerCarryMesh = mesh(new THREE.BoxGeometry(0.42, 0.34, 0.42), mat("#b77b45"), [0, 1.02, 0.72]);
  playerCarryMesh.visible = false;
  player.add(playerCarryMesh);

  scene.add(player);
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
  dom.continueButton.addEventListener("click", continueGame);
  dom.careerButton.addEventListener("click", openCareerModePreview);
  dom.leaderboardButton.addEventListener("click", () => void openChallengeLeaderboardModal());
  dom.tutorialButton.addEventListener("click", startTutorialGame);
  dom.historyButton.addEventListener("click", openHistoryModal);
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
  dom.closeModal.addEventListener("click", closeModal);
  dom.interactionButton.addEventListener("click", interact);
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

    if (event.key === "Escape") {
      if (state.modalOpen) {
        closeModal();
        return;
      }
      if (state.running && !state.gameOver && !state.minigame?.active) {
        event.preventDefault();
        openPauseMenu();
      }
      return;
    }

    if (event.key.toLowerCase() === "e" || event.key === "Enter") {
      if (!state.modalOpen && state.running) interact();
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

function saveCareerProgress() {
  const data = {
    coins: state.coins,
    inventory: state.inventory,
    recipeRecords: state.recipeRecords,
    reputation: state.reputation,
    upgrades: state.upgrades,
    day: state.day,
    careerStats: state.careerStats || createCareerStats(),
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
  return dishes.reduce((total, dish) => total + (dish.score || 0), 0);
}

function buildChallengeRecordPayload() {
  return {
    user_id: state.authUser?.id,
    nickname: getProfileDisplayName(),
    challenge_score: getChallengeRunScore(),
    best_dish_score: state.serviceStats?.bestScore || 0,
    clear_time_seconds: getElapsedSeconds(),
    completed_orders: state.serviceStats?.completedOrders || 0,
    total_orders: state.orderQueue.length,
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
      && next.clear_time_seconds < current.clear_time_seconds
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
  if (!client || !state.authUser || !state.serviceStats?.completedOrders) return;
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
  const [{ error: saveError }, { error: historyError }] = await Promise.all([
    client.from("game_saves").delete().eq("user_id", userId),
    client.from("service_history").delete().eq("user_id", userId),
  ]);
  if (saveError) throw saveError;
  if (historyError) throw historyError;
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
  if (!dom.continueButton) return;
  const loggedIn = Boolean(state.authUser);
  const canContinue = loggedIn && hasPlayableProgress(getSavedProgress("challenge"));
  const hasCareerSave = loggedIn && hasPlayableProgress(getSavedProgress("career"));
  dom.startButton.disabled = !loggedIn;
  dom.careerButton.disabled = !loggedIn;
  dom.leaderboardButton.disabled = !loggedIn;
  dom.historyButton.disabled = !loggedIn;
  dom.continueButton.disabled = !loggedIn;
  dom.continueButton.classList.toggle("hidden", !canContinue);
  if (dom.careerButton) {
    dom.careerButton.textContent = hasCareerSave ? "성장 모드 이어하기" : "성장 모드 시작";
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
    <p>제한 시간 없이 손님 주문을 이어서 받고, 코인과 평판을 쌓아 식당을 차근차근 키우는 운영형 모드입니다.</p>
    <div class="score-split">
      <span>시간 제한 없음</span>
      <span>손님 주문 무한 순환</span>
      <span>업그레이드 유지</span>
      <span>성장 저장 분리</span>
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
              <b>${entry.challengeScore}점</b>
              <em>${formatClearTime(entry.clearTimeSeconds)}</em>
            </div>
          `,
        )
        .join("")
    : `<article class="choice-card"><h3>랭킹 없음</h3><p>아직 등록된 챌린지 기록이 없습니다. 첫 클리어 기록을 남겨보세요.</p></article>`;

  const personalCard = personal
    ? `
      <article class="choice-card">
        <h3>내 최고 기록</h3>
        <p>${personal.nickname} · ${personal.challengeScore}점 · 클리어 시간 ${formatClearTime(personal.clearTimeSeconds)}</p>
        <p>최고 단일 요리 ${personal.bestDishScore}점 · 완료 주문 ${personal.completedOrders}/${personal.totalOrders} · ${personal.dayReached}일차 기록</p>
      </article>
    `
    : `
      <article class="choice-card">
        <h3>내 최고 기록</h3>
        <p>아직 챌린지 클리어 기록이 없습니다. 영업을 완주하면 여기에 최고 점수가 남습니다.</p>
      </article>
    `;

  dom.modalContent.innerHTML = `
    <h2>챌린지 랭킹</h2>
    <p>점수가 높은 순으로 정렬되며, 동점일 때는 클리어 시간이 더 빠른 쪽이 앞섭니다.</p>
    ${personalCard}
    <div class="scoreboard-list">${rows}</div>
  `;
}

function openHistoryModal() {
  const saved = getSavedProgress("challenge");
  const history = state.history?.length ? state.history : saved?.history || [];
  const rows = history.length
    ? history
        .slice(-8)
        .reverse()
        .map(
          (day) => `
            <div class="scoreboard-row history-row">
              <strong>${day.day}일차</strong>
              <span>${day.event}</span>
              <b>${day.completed}/${day.total}</b>
              <em>+${day.reputation}</em>
            </div>
          `,
        )
        .join("")
    : `<article class="choice-card"><h3>기록 없음</h3><p>영업을 마치면 이곳에 하루 기록이 남습니다.</p></article>`;

  openModal(`
    <h2>영업 기록</h2>
    <p>최근 영업일의 이벤트, 완료 주문, 평판 성장을 확인합니다.</p>
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
    saveAndExitToStartScreen();
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
        <p><strong>WASD</strong> 또는 <strong>방향키</strong>로 이동하고 <strong>Shift</strong>로 빠르게 달립니다.</p>
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
      copy: "<strong>WASD</strong> 또는 <strong>방향키</strong>로 햄스터를 움직여보세요. <strong>Shift</strong>를 누르면 더 빠르게 달립니다.",
    };
  }

  if (state.tutorialStep === 1) {
    return {
      title: "일 게시판에서 코인 벌기",
      copy: "왼쪽 뒤편의 <strong>일 게시판</strong>으로 가서 <strong>E</strong> 또는 <strong>Enter</strong>를 누르세요. 처음에는 <strong>반짝 접시 정리</strong>를 추천합니다.",
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
      copy: "중앙 오른쪽의 <strong>조리대</strong>로 가서 재료 3개를 넣고 요리하세요. 미니게임은 화면 지시에 맞춰 <strong>Space</strong>, <strong>Enter</strong>, 클릭을 사용합니다.",
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
  return "화면 아래 현재 일 안내를 보면서 일을 완료해보세요.";
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

async function startGame() {
  if (!state.authUser) {
    syncAuthUi("새 게임을 시작하려면 먼저 회원가입 또는 로그인이 필요합니다.");
    return;
  }
  state.gameMode = "challenge";
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
    day: 0,
    coins: 12,
    inventory: {},
    recipeRecords: {},
    reputation: 0,
    upgrades: {},
    history: [],
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
  showToast(`${state.day}일차 첫 주문: ${getTargetRecipe().name} · ${state.dailyEvent.name}`);
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
  if (!restoreCareerProgress()) resetServiceDay();
  startRunningDay();
  showToast(`${state.day}일차 운영 재개: ${getTargetRecipe().name}`);
}

function startTutorialGame() {
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
  showToast(`${state.day}일차 이어하기: ${getTargetRecipe().name} · ${state.dailyEvent.name}`);
}

function restoreActiveDay() {
  const active = state.savedActiveDay;
  if (!active?.orderQueue?.length) return false;
  state.day = active.day || state.day || 1;
  state.timeLeft = active.timeLeft || GAME_SECONDS;
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
  ensureAudio();
  playClick();
  startMusic();
  updateEventVisuals();
  updateHelperVisibility();
  updateHud();
  saveProgress();
}

function restartGame() {
  state.tutorialMode = false;
  state.gameMode = "challenge";
  dom.tutorialGuide.classList.add("hidden");
  state.running = true;
  state.gameOver = false;
  state.paused = false;
  state.modalOpen = false;
  state.modalStopsMusic = false;
  state.modalReturn = null;
  state.coins = Math.max(12, state.coins);
  state.timeLeft = GAME_SECONDS;
  state.selectedIngredients = [];
  resetServiceDay();
  state.currentQuest = null;
  state.pendingDish = null;
  state.lastJudgement = null;
  state.minigame = null;
  state.scoreboardConclusion = null;
  clearOrderChallengeTimer();
  state.orderTimer = null;
  player.position.set(0, 0, 0);
  player.rotation.y = 0;
  clearCrates();
  playerCarryMesh.visible = false;
  dom.resultScreen.classList.add("hidden");
  dom.hud.classList.remove("hidden");
  dom.questTracker.classList.remove("hidden");
  dom.inventoryBar.classList.remove("hidden");
  updateEventVisuals();
  updateHelperVisibility();
  updateHud();
  ensureAudio();
  resetMusicPlayback();
  startMusic();
  saveProgress();
  showToast(`${state.day}일차 영업 시작: ${getTargetRecipe().name}`);
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
  const dt = Math.min(clock.getDelta(), 0.05);

  if (state.running && !state.gameOver && !state.paused) {
    updatePlayer(dt);
    updateTimer(dt);
    updateInteractables();
    animateMarkers(dt);
    updateHelperHamster(dt);
    updateTutorialGuide();
  }

  updateCamera(dt);
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

function updatePlayer(dt) {
  if (state.modalOpen) return;

  const dir = new THREE.Vector3();
  if (keys.has("w") || keys.has("arrowup")) dir.z -= 1;
  if (keys.has("s") || keys.has("arrowdown")) dir.z += 1;
  if (keys.has("a") || keys.has("arrowleft")) dir.x -= 1;
  if (keys.has("d") || keys.has("arrowright")) dir.x += 1;

  if (dir.lengthSq() > 0) {
    dir.normalize();
    const speedMultiplier = 1 + getUpgradeLevel("shoes") * 0.12;
    const speed = (keys.has("shift") ? 5.4 : 3.6) * speedMultiplier;
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
  const lookAt = player ? player.position.clone().add(new THREE.Vector3(0, 0.95, 0)) : new THREE.Vector3();
  const parallax = new THREE.Vector3(pointer.x * 0.9, pointer.y * 0.25, 0);
  const target = lookAt.clone().add(new THREE.Vector3(0, 7.2, 10.8)).add(parallax);
  camera.position.lerp(target, 1 - Math.pow(0.001, dt));
  camera.lookAt(lookAt);
}

function updateTimer(dt) {
  if (state.gameMode === "career") return;
  state.timeLeft = Math.max(0, state.timeLeft - dt);
  if (state.timeLeft <= 0) {
    finishGame(false, makeServiceSummary(false, "영업 시간이 끝났습니다."));
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
  const busy = state.currentQuest && !state.currentQuest.completed;
  openModal(`
    <h2>일 게시판</h2>
    <p>코인을 벌면 재료를 살 수 있습니다. 한 번에 하나의 일만 진행됩니다.</p>
    <article class="choice-card">
      <h3>영업 기록</h3>
      <p>지난 영업일의 완료 주문, 이벤트, 평판 성장을 확인합니다.</p>
      <button type="button" data-open-history="true">기록 보기</button>
    </article>
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
}

function startQuest(id) {
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

  updateHud();
  showToast(`${quest.name}을 시작했습니다.`);
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
  const grime = dom.modalContent.querySelector(".grime-layer");
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
      <strong>${quest.order.table}번 테이블 · ${quest.order.dish}</strong>
      <p>${quest.order.request}</p>
    </article>
    <article class="choice-card order-briefing">
      <h3>외울 것</h3>
      <p>테이블 번호, 요리 이름, 요청 문구 3가지를 모두 맞춰야 합니다. 틀린 주문표를 두 번 고르거나 시간이 끝나면 보상이 사라집니다.</p>
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
            <h3>${option.table}번 테이블</h3>
            <p>${option.dish}</p>
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
      failOrderDelivery("주문표를 두 번 잘못 골랐습니다.");
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
  clearOrderChallengeTimer();
  playFail();
  state.currentQuest = null;
  updateHud();
  openModal(`
    <h2>주문 전달 실패</h2>
    <p>${reason} 이번 주문은 보상을 받을 수 없습니다.</p>
    <article class="choice-card">
      <h3>다시 시도 가능</h3>
      <p>일 게시판에서 주문표 전달을 다시 수락하면 새 주문으로 도전할 수 있습니다.</p>
      <button type="button" data-close-order="true">닫기</button>
    </article>
  `);
  const closeButton = dom.modalContent.querySelector("[data-close-order]");
  closeButton.addEventListener("click", () => closeModal());
}

function handleShelf() {
  const quest = state.currentQuest;
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
  playWork();

  if (quest.progress >= quest.total) {
    completeQuest();
  } else {
    quest.detail = `상자 ${quest.progress}/${quest.total}개 정리 완료`;
    updateHud();
  }
}

function spawnCrates() {
  clearCrates();
  const cratePositions = [
    [-4.3, 0, 5.8],
    [4.9, 0, 4.2],
    [-6.2, 0, -0.9],
  ];

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
  playWork();
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

function completeQuest() {
  const quest = state.currentQuest;
  if (!quest) return;

  const pay = quest.pay + getUpgradeLevel("regulars") * 2;
  state.coins += pay;
  if (state.serviceStats) state.serviceStats.coinsEarned += pay;
  state.currentQuest = null;
  clearCrates();
  playerCarryMesh.visible = false;
  playCoin();
  showToast(`일 완료! ${pay}코인을 받았습니다.`);
  updateHud();
  saveProgress();
}

function openShop() {
  const ingredients = getUnlockedIngredients();
  const lockedIngredients = INGREDIENTS.filter((ingredient) => !isUnlocked(ingredient));
  openModal(`
    <h2>재료 상점</h2>
    <p>${state.dailyEvent?.name || "오늘"} 효과와 거래처 업그레이드가 재료 가격에 반영됩니다. 보관 ${getInventoryCount()}/${getStorageLimit()} · ${state.gameMode === "career" ? getCareerProgressSummary() : getReputationTier().name}</p>
    <div class="grid-list">
      ${ingredients.map(
        (ingredient) => {
          const price = getIngredientPrice(ingredient);
          return `
        <article class="choice-card ingredient-card">
          ${ingredientImage(ingredient)}
          <h3>${ingredient.name}</h3>
          <p>${formatTraits(ingredient.traits)}</p>
          <p><strong>${price}코인</strong></p>
          <button class="buy-button" type="button" data-buy="${ingredient.id}">
            구매
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
    <p>${state.gameMode === "career" ? "코인을 투자해 판매가, 손님 난이도, 성장 효율을 끌어올립니다. 성장 업그레이드는 일차를 지나며 자연스럽게 열립니다." : "코인을 투자해 다음 주문과 다음 영업일을 더 수월하게 만듭니다. 업그레이드는 계속 유지됩니다."}</p>
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
  return !item.unlockReputation || state.reputation >= item.unlockReputation;
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
    if (state.gameMode !== "career") return !preference.unlockCareerLevel;
    return isCareerItemUnlocked(preference);
  });
}

function getInventoryCount() {
  return Object.values(state.inventory).reduce((total, count) => total + count, 0);
}

function getStorageLimit() {
  return BASE_STORAGE_LIMIT + getUpgradeLevel("fridge") * 4;
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
  state.day = (state.day || 0) + 1;
  state.orderIndex = 0;
  state.helperCooldown = Math.max(0, 34 - getUpgradeLevel("assistant") * 5);
  state.dailyEvent = pickDailyEvent();
  state.orderQueue = makeDailyOrders();
  state.targetRecipe = state.orderQueue[0].recipe;
  state.serviceStats = {
    completedOrders: 0,
    failedJudgements: 0,
    bestScore: 0,
    coinsEarned: 0,
    reputationEarned: 0,
    dishes: [],
  };
}

function resetCareerService() {
  const previousDay = state.day || 0;
  state.day = (state.day || 0) + 1;
  state.orderIndex = 0;
  state.helperCooldown = Math.max(0, 34 - getUpgradeLevel("assistant") * 5);
  state.dailyEvent = pickDailyEvent();
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
  maybeShowCareerUnlocks(previousDay, state.day);
}

function maybeShowCareerUnlocks(previousDay, currentDay) {
  const unlockedRecipes = RECIPES.filter((recipe) => recipe.unlockDay && recipe.unlockDay > previousDay && recipe.unlockDay <= currentDay);
  const unlockedUpgrades = UPGRADES.filter((upgrade) => upgrade.careerOnly && upgrade.unlockDay && upgrade.unlockDay > previousDay && upgrade.unlockDay <= currentDay);
  const messages = [
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
  return `${Math.min(state.orderIndex + 1, state.orderQueue.length)}/${state.orderQueue.length}`;
}

function getCareerRestaurantLevel() {
  return Math.max(1, 1 + Math.floor(state.reputation / 35));
}

function getCareerNextLevelReputation() {
  return getCareerRestaurantLevel() * 35;
}

function getCareerProgressSummary() {
  const stats = state.careerStats || createCareerStats();
  return `식당 Lv.${getCareerRestaurantLevel()} · 총매출 ${stats.totalSales}코인 · 손님 ${stats.customersServed}명`;
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
      : "챌린지 모드 목표 레시피는 시작 시 정해집니다.";
  }

  if (state.gameMode === "career") {
    return `${state.day}일차 손님: ${getTargetRecipe().name} ${getRequiredScore()}점 이상 · ${getCustomerPreference().name} · ${getCareerProgressSummary()}`;
  }

  return `${state.day}일차 주문 ${getOrderLabel()}: ${getTargetRecipe().name} ${getRequiredScore()}점 이상 · ${getCustomerPreference().name} · ${getReputationTier().name}`;
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
        <button class="buy-button" type="button" data-open-recipes="true">노트 열기</button>
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
  state.minigame = {
    active: true,
    cooking: { ingredients, traits },
    type: chooseCookingMiniGame(),
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
  const games = ["timing", "heat", "chop"];
  return games[Math.floor(Math.random() * games.length)];
}

function openCookingMiniGame() {
  if (!state.minigame?.active) return;

  if (state.minigame.type === "heat") {
    openHeatMinigame();
    return;
  }

  if (state.minigame.type === "chop") {
    openChopMinigame();
    return;
  }

  openTimingMinigame();
}

function handleCookingMiniGameAction() {
  if (!state.minigame?.active) return;

  if (state.minigame.type === "chop") {
    chopIngredient();
    return;
  }

  if (state.minigame.type === "timing") {
    hitTimingBar();
  }
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
  minigame.position += minigame.direction * dt * 78;

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
    orderNumber: state.orderIndex + 1,
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
  state.scoreboardConclusion = passed
    ? { dish, playerRank }
    : null;

  openModal(`
    <h2>심사 결과</h2>
    <p>${dish.name} 주문 ${dish.orderNumber}/${state.orderQueue.length} 심사가 끝났습니다. 햄스터 셰프는 ${dish.score}점, 클리어 시간 ${formatClearTime(dish.clearTime)}으로 ${playerRank}등입니다.</p>
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
    playCoin();
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
  state.coins += finalReward;
  state.reputation += reputationGain;
  if (state.serviceStats) {
    state.serviceStats.completedOrders += 1;
    state.serviceStats.coinsEarned += finalReward;
    state.serviceStats.reputationEarned += reputationGain;
    state.serviceStats.dishes.push({
      name: dish.name,
      score: dish.score,
      clearTime: dish.clearTime,
      rank: playerRank,
      reward: finalReward,
      reputation: reputationGain,
    });
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
  if (won && state.gameMode === "challenge" && state.authUser) {
    void saveChallengeLeaderboardEntry();
  }
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
  dom.resultKicker.textContent = state.tutorialMode ? "tutorial complete" : won ? "three star service" : "closing time";
  dom.resultTitle.textContent = state.tutorialMode ? "튜토리얼 완료" : won ? "별점 요리 완성" : "오늘의 영업 종료";
  dom.resultCopy.textContent = state.tutorialMode ? "첫 영업의 기본 흐름을 모두 경험했습니다. 이제 일반 새 게임으로 도전해보세요." : copy;
  dom.restartButton.textContent = state.tutorialMode ? "시작 화면으로" : "다음 영업일 시작";
  dom.resultScreen.classList.remove("hidden");
  saveProgress();
}

function recordDayHistory(won) {
  if (!state.serviceStats || state.serviceStats.recorded) return;
  state.serviceStats.recorded = true;
  const entry = {
    day: state.day,
    won,
    event: state.dailyEvent?.name || "없음",
    completed: state.serviceStats.completedOrders,
    total: state.orderQueue.length,
    bestScore: state.serviceStats.bestScore,
    coins: state.serviceStats.coinsEarned,
    reputation: state.serviceStats.reputationEarned,
    dishes: state.serviceStats.dishes,
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
  };
  const elapsed = formatClearTime(getElapsedSeconds());
  const dishSummary = stats.dishes.length
    ? stats.dishes.map((dish) => `${dish.name} ${dish.score}점`).join(" · ")
    : "완료한 주문 없음";
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

function closeModal(play = true, force = false) {
  if (state.minigame?.active && !force) {
    showToast("요리 중에는 타이밍을 끝까지 맞춰야 합니다.");
    return;
  }

  clearOrderChallengeTimer();
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
  dom.objective.textContent = getObjectiveSummary();

  if (state.currentQuest) {
    const quest = state.currentQuest;
    dom.questTitle.textContent = quest.name;
    dom.questDetail.textContent = `${quest.detail} (${quest.progress}/${quest.total})`;
  } else {
    dom.questTitle.textContent = state.gameMode === "career" ? "운영 중" : "없음";
    dom.questDetail.textContent = state.gameMode === "career"
      ? `${getCareerProgressSummary()} · 일 게시판에서 운영 자금을 더 벌 수 있습니다.`
      : "일 게시판에서 코인을 벌 수 있습니다.";
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
  dom.toast.textContent = message;
  dom.toast.classList.remove("hidden");
  toastTimer = setTimeout(() => dom.toast.classList.add("hidden"), 2600);
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
    bgmAudio = new Audio(`${BGM_AUDIO_PATH}?v=${AUDIO_SESSION_KEY}`);
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
}

function startMusic() {
  syncMusicPlayback();
}

function stopMusic() {
  if (bgmAudio) bgmAudio.pause();
}

function syncMusicVolume() {
  if (!bgmAudio) return;
  bgmAudio.volume = state.soundEnabled ? state.musicVolume : 0;
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
  const channelVolume = channel === "music" ? state.musicVolume : state.effectsVolume;
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

function playWork() {
  playTone(260, 0.06, 0.05, "square");
  setTimeout(() => playTone(340, 0.05, 0.035, "triangle"), 70);
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
