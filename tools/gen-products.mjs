import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT_DIR = path.join(ROOT, 'src', 'data');
const REPORT_PATH = path.join(ROOT, 'tools', 'gen-report.md');

const CATEGORIES = [
  { id: 'digital', name: '数码电子', emoji: '💻' },
  { id: 'snacks', name: '零食饮品', emoji: '🍿' },
  { id: 'fresh', name: '生鲜水果', emoji: '🍎' },
  { id: 'toys', name: '玩具潮玩', emoji: '🧸' },
  { id: 'daily', name: '日常百货', emoji: '🧴' },
  { id: 'clothing', name: '衣物球鞋', emoji: '👕' },
  { id: 'appliances', name: '家电', emoji: '🔌' },
  { id: 'cars', name: '汽车', emoji: '🚗' },
  { id: 'homes', name: '豪宅', emoji: '🏠' },
  { id: 'jets', name: '私人飞机', emoji: '✈️' },
  { id: 'rockets', name: '火箭', emoji: '🚀' },
  { id: 'islands', name: '海岛', emoji: '🏝️' }
];

const CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id));

const products = [];
const nameSet = new Set();
let idCounter = 0;

function addItem(name, category, sub, price, emoji, tags = []) {
  if (!name || nameSet.has(name)) return false;
  if (!CATEGORY_IDS.has(category)) throw new Error('非法分类: ' + category);
  const p = Math.round(Number(price));
  if (!Number.isFinite(p) || p <= 0) return false;
  nameSet.add(name);
  idCounter += 1;
  products.push({
    id: 'p' + String(idCounter).padStart(5, '0'),
    name,
    category,
    sub,
    price: p,
    emoji,
    tags: [...new Set(tags.filter(Boolean))].slice(0, 6)
  });
  return true;
}

function genDeviceList(list, brand) {
  for (const m of list) {
    const colors = m.colors || [''];
    for (const [spec, delta] of m.specs) {
      for (const color of colors) {
        addItem(
          [m.n, spec, color].filter(Boolean).join(' '),
          'digital',
          m.sub,
          m.price + delta,
          m.emoji,
          [brand, m.n, spec, color, ...(m.tags || [])]
        );
      }
    }
  }
}

/* ==================== 数码电子 · 苹果手机 ==================== */
const C_OLD = ['深空灰', '银色', '金色'];
const C_6S = ['深空灰', '银色', '金色', '玫瑰金'];
const C_7 = ['磨砂黑', '银色', '金色', '玫瑰金'];
const C_8 = ['深空灰', '银色', '金色'];
const C_X = ['深空灰', '银色'];
const C_11 = ['黑色', '白色', '红色', '黄色', '紫色', '绿色'];
const C_12 = ['黑色', '白色', '红色', '蓝色', '绿色', '紫色'];
const C_13 = ['午夜色', '星光色', '蓝色', '粉色', '红色', '绿色'];
const C_14 = ['午夜色', '星光色', '蓝色', '紫色', '红色', '黄色'];
const C_15 = ['黑色', '白色', '蓝色', '绿色', '黄色'];
const C_16 = ['黑色', '白色', '群青色', '深青色', '粉色'];
const C_17 = ['深空黑', '银色', '宇宙橙', '蓝色', '紫色'];

const S_6 = [['16GB', 0], ['64GB', 150], ['128GB', 350]];
const S_7 = [['32GB', 0], ['128GB', 220], ['256GB', 480]];
const S_8 = [['64GB', 0], ['128GB', 230], ['256GB', 520]];
const S_X = [['64GB', 0], ['256GB', 520]];
const S_11 = [['64GB', 0], ['128GB', 450], ['256GB', 900]];
const S_12 = [['64GB', 0], ['128GB', 500], ['256GB', 1100], ['512GB', 2200]];
const S_13 = [['128GB', 0], ['256GB', 800], ['512GB', 2000], ['1TB', 3600]];
const S_15 = [['128GB', 0], ['256GB', 900], ['512GB', 2200], ['1TB', 4000]];
const S_16 = [['128GB', 0], ['256GB', 1000], ['512GB', 2400], ['1TB', 4400]];
const S_17 = [['256GB', 0], ['512GB', 2000], ['1TB', 5000]];

const iphoneModels = [
  { n: 'iPhone 6', price: 520, specs: S_6, colors: C_OLD },
  { n: 'iPhone 6 Plus', price: 680, specs: S_6, colors: C_OLD },
  { n: 'iPhone 6s', price: 600, specs: S_6, colors: C_6S },
  { n: 'iPhone 6s Plus', price: 760, specs: S_6, colors: C_6S },
  { n: 'iPhone 7', price: 780, specs: S_7, colors: C_7 },
  { n: 'iPhone 7 Plus', price: 980, specs: S_7, colors: C_7 },
  { n: 'iPhone 8', price: 1050, specs: S_8, colors: C_8 },
  { n: 'iPhone 8 Plus', price: 1250, specs: S_8, colors: C_8 },
  { n: 'iPhone X', price: 1380, specs: S_X, colors: C_X },
  { n: 'iPhone XR', price: 1580, specs: S_11, colors: C_11 },
  { n: 'iPhone XS', price: 1680, specs: S_X, colors: C_X },
  { n: 'iPhone XS Max', price: 1950, specs: S_X, colors: C_X },
  { n: 'iPhone 11', price: 1980, specs: S_11, colors: C_11 },
  { n: 'iPhone 11 Pro', price: 2380, specs: S_11, colors: ['深空灰', '银色', '金色', '暗夜绿'] },
  { n: 'iPhone 11 Pro Max', price: 2680, specs: S_11, colors: ['深空灰', '银色', '金色', '暗夜绿'] },
  { n: 'iPhone SE 2', price: 1280, specs: S_8, colors: ['黑色', '白色', '红色'] },
  { n: 'iPhone SE 3', price: 1780, specs: S_8, colors: ['午夜色', '星光色', '红色'] },
  { n: 'iPhone 12 mini', price: 2280, specs: S_12, colors: C_12 },
  { n: 'iPhone 12', price: 2580, specs: S_12, colors: C_12 },
  { n: 'iPhone 12 Pro', price: 3180, specs: S_12, colors: ['石墨色', '银色', '金色', '海蓝色'] },
  { n: 'iPhone 12 Pro Max', price: 3580, specs: S_12, colors: ['石墨色', '银色', '金色', '海蓝色'] },
  { n: 'iPhone 13 mini', price: 3080, specs: S_13, colors: C_13 },
  { n: 'iPhone 13', price: 3480, specs: S_13, colors: C_13 },
  { n: 'iPhone 13 Pro', price: 4380, specs: S_13, colors: ['石墨色', '银色', '金色', '远峰蓝', '苍岭绿'] },
  { n: 'iPhone 13 Pro Max', price: 4880, specs: S_13, colors: ['石墨色', '银色', '金色', '远峰蓝', '苍岭绿'] },
  { n: 'iPhone 14', price: 4280, specs: S_13, colors: C_14 },
  { n: 'iPhone 14 Plus', price: 4780, specs: S_13, colors: C_14 },
  { n: 'iPhone 14 Pro', price: 5580, specs: S_13, colors: ['深空黑', '银色', '金色', '暗紫色'] },
  { n: 'iPhone 14 Pro Max', price: 6180, specs: S_13, colors: ['深空黑', '银色', '金色', '暗紫色'] },
  { n: 'iPhone 15', price: 5280, specs: S_15, colors: C_15 },
  { n: 'iPhone 15 Plus', price: 5780, specs: S_15, colors: C_15 },
  { n: 'iPhone 15 Pro', price: 6680, specs: S_15, colors: ['原色钛金属', '蓝色钛金属', '白色钛金属', '黑色钛金属'] },
  { n: 'iPhone 15 Pro Max', price: 7280, specs: S_15, colors: ['原色钛金属', '蓝色钛金属', '白色钛金属', '黑色钛金属'] },
  { n: 'iPhone 16', price: 5780, specs: S_16, colors: C_16 },
  { n: 'iPhone 16 Plus', price: 6280, specs: S_16, colors: C_16 },
  { n: 'iPhone 16 Pro', price: 7480, specs: S_16, colors: ['黑色钛金属', '白色钛金属', '自然钛金属', '沙漠色钛金属'] },
  { n: 'iPhone 16 Pro Max', price: 8280, specs: S_16, colors: ['黑色钛金属', '白色钛金属', '自然钛金属', '沙漠色钛金属'] },
  { n: 'iPhone 16e', price: 3980, specs: [['128GB', 0], ['256GB', 800], ['512GB', 2000]], colors: ['黑色', '白色'] },
  { n: 'iPhone 17', price: 5999, specs: S_17, colors: C_17 },
  { n: 'iPhone 17 Plus', price: 6799, specs: S_17, colors: C_17 },
  { n: 'iPhone 17 Pro', price: 7999, specs: S_17, colors: C_17 },
  { n: 'iPhone 17 Pro Max', price: 8999, specs: S_17, colors: C_17 },
  { n: 'iPhone Air', price: 7999, specs: S_17, colors: ['深空黑', '云白色', '浅金色', '天蓝色'] }
];

for (const m of iphoneModels) {
  for (const [spec, delta] of m.specs) {
    for (const color of m.colors) {
      addItem(`${m.n} ${spec} ${color}`, 'digital', '手机', m.price + delta, '📱', [
        '苹果', 'iPhone', m.n.replace('iPhone ', ''), spec, color
      ]);
    }
  }
}

/* ==================== 数码电子 · iPad ==================== */
const ipadModels = [
  { n: 'iPad 9', price: 2499, specs: [['64GB', 0], ['256GB', 800]], colors: ['深空灰', '银色'] },
  { n: 'iPad 10', price: 2999, specs: [['64GB', 0], ['256GB', 900]], colors: ['蓝色', '粉色', '黄色', '银色'] },
  { n: 'iPad 11', price: 3499, specs: [['128GB', 0], ['256GB', 800], ['512GB', 2000]], colors: ['蓝色', '粉色', '黄色', '银色'] },
  { n: 'iPad mini 5', price: 2921, specs: [['64GB', 0], ['256GB', 700]], colors: ['深空灰', '银色', '金色'] },
  { n: 'iPad mini 6', price: 3799, specs: [['64GB', 0], ['256GB', 900]], colors: ['深空灰', '粉色', '星光色', '紫色'] },
  { n: 'iPad mini 7', price: 3999, specs: [['128GB', 0], ['256GB', 800], ['512GB', 2000]], colors: ['深空灰', '蓝色', '紫色', '星光色'] },
  { n: 'iPad Air 4', price: 4399, specs: [['64GB', 0], ['256GB', 900]], colors: ['深空灰', '银色', '玫瑰金', '天蓝色', '绿色'] },
  { n: 'iPad Air 5', price: 4799, specs: [['64GB', 0], ['256GB', 900]], colors: ['深空灰', '星光色', '粉色', '紫色', '蓝色'] },
  { n: 'iPad Air 6 11英寸', price: 4799, specs: [['128GB', 0], ['256GB', 800], ['512GB', 2000]], colors: ['深空灰', '蓝色', '紫色', '星光色'] },
  { n: 'iPad Air 7 11英寸', price: 5299, specs: [['128GB', 0], ['256GB', 800], ['512GB', 2000]], colors: ['深空灰', '蓝色', '紫色', '星光色'] },
  { n: 'iPad Air 7 13英寸', price: 6299, specs: [['128GB', 0], ['256GB', 800], ['512GB', 2000]], colors: ['深空灰', '蓝色', '紫色', '星光色'] },
  { n: 'iPad Pro 11英寸 M2', price: 6799, specs: [['128GB', 0], ['256GB', 800], ['512GB', 2000], ['1TB', 4000]], colors: ['深空灰', '银色'] },
  { n: 'iPad Pro 11英寸 M4', price: 8999, specs: [['256GB', 0], ['512GB', 2000], ['1TB', 5000]], colors: ['深空黑', '银色'] },
  { n: 'iPad Pro 12.9英寸 M2', price: 8499, specs: [['128GB', 0], ['256GB', 900], ['512GB', 2200], ['1TB', 4200]], colors: ['深空灰', '银色'] },
  { n: 'iPad Pro 13英寸 M4', price: 10999, specs: [['256GB', 0], ['512GB', 2200], ['1TB', 5200]], colors: ['深空黑', '银色'] }
];
for (const m of ipadModels) {
  for (const [spec, delta] of m.specs) {
    for (const color of m.colors) {
      addItem(`${m.n} ${spec} ${color}`, 'digital', '平板', m.price + delta, '🖥️', [
        '苹果', 'iPad', m.n, spec, color
      ]);
    }
  }
}

/* ==================== 数码电子 · Mac ==================== */
const macModels = [
  { n: 'MacBook Air 13英寸 M1', sub: '笔记本', price: 7999, specs: [['8GB+256GB', 0], ['16GB+512GB', 3000]], colors: ['深空灰', '银色', '金色'] },
  { n: 'MacBook Air 13英寸 M2', sub: '笔记本', price: 9499, specs: [['8GB+256GB', 0], ['16GB+512GB', 2800]], colors: ['午夜色', '星光色', '银色', '深空灰'] },
  { n: 'MacBook Air 13英寸 M3', sub: '笔记本', price: 10499, specs: [['8GB+256GB', 0], ['16GB+512GB', 2800], ['24GB+1TB', 5500]], colors: ['午夜色', '星光色', '银色', '深空灰'] },
  { n: 'MacBook Air 13英寸 M4', sub: '笔记本', price: 9999, specs: [['16GB+256GB', 0], ['16GB+512GB', 1800], ['24GB+1TB', 4500]], colors: ['午夜色', '星光色', '银色', '深空灰'] },
  { n: 'MacBook Air 15英寸 M2', sub: '笔记本', price: 10499, specs: [['8GB+256GB', 0], ['16GB+512GB', 2800]], colors: ['午夜色', '星光色', '银色'] },
  { n: 'MacBook Air 15英寸 M3', sub: '笔记本', price: 11499, specs: [['8GB+256GB', 0], ['16GB+512GB', 2800], ['24GB+1TB', 5500]], colors: ['午夜色', '星光色', '银色'] },
  { n: 'MacBook Air 15英寸 M4', sub: '笔记本', price: 10999, specs: [['16GB+256GB', 0], ['16GB+512GB', 1800], ['24GB+1TB', 4500]], colors: ['午夜色', '星光色', '银色'] },
  { n: 'MacBook Pro 14英寸 M1 Pro', sub: '笔记本', price: 14999, specs: [['16GB+512GB', 0], ['32GB+1TB', 5000]], colors: ['深空灰', '银色'] },
  { n: 'MacBook Pro 14英寸 M2 Pro', sub: '笔记本', price: 15999, specs: [['16GB+512GB', 0], ['32GB+1TB', 5000]], colors: ['深空灰', '银色'] },
  { n: 'MacBook Pro 14英寸 M3', sub: '笔记本', price: 12999, specs: [['8GB+512GB', 0], ['16GB+1TB', 3000]], colors: ['深空黑', '银色'] },
  { n: 'MacBook Pro 14英寸 M3 Pro', sub: '笔记本', price: 15999, specs: [['18GB+512GB', 0], ['36GB+1TB', 5500]], colors: ['深空黑', '银色'] },
  { n: 'MacBook Pro 14英寸 M4', sub: '笔记本', price: 14999, specs: [['16GB+512GB', 0], ['24GB+1TB', 4000]], colors: ['深空黑', '银色'] },
  { n: 'MacBook Pro 14英寸 M4 Pro', sub: '笔记本', price: 16999, specs: [['24GB+512GB', 0], ['48GB+1TB', 6000]], colors: ['深空黑', '银色'] },
  { n: 'MacBook Pro 16英寸 M1 Pro', sub: '笔记本', price: 18999, specs: [['16GB+512GB', 0], ['32GB+1TB', 5500]], colors: ['深空灰', '银色'] },
  { n: 'MacBook Pro 16英寸 M2 Pro', sub: '笔记本', price: 19999, specs: [['16GB+512GB', 0], ['32GB+1TB', 5500]], colors: ['深空灰', '银色'] },
  { n: 'MacBook Pro 16英寸 M3', sub: '笔记本', price: 18999, specs: [['18GB+512GB', 0], ['36GB+1TB', 5500]], colors: ['深空黑', '银色'] },
  { n: 'MacBook Pro 16英寸 M3 Max', sub: '笔记本', price: 25999, specs: [['36GB+1TB', 0], ['48GB+2TB', 6000]], colors: ['深空黑', '银色'] },
  { n: 'MacBook Pro 16英寸 M4', sub: '笔记本', price: 21999, specs: [['24GB+512GB', 0], ['48GB+1TB', 5500]], colors: ['深空黑', '银色'] },
  { n: 'MacBook Pro 16英寸 M4 Pro', sub: '笔记本', price: 23999, specs: [['24GB+512GB', 0], ['48GB+1TB', 5500]], colors: ['深空黑', '银色'] },
  { n: 'MacBook Pro 16英寸 M4 Max', sub: '笔记本', price: 27999, specs: [['36GB+1TB', 0], ['64GB+2TB', 8000]], colors: ['深空黑', '银色'] },
  { n: 'iMac 24英寸 M1', sub: '一体机', price: 9999, specs: [['8GB+256GB', 0], ['16GB+512GB', 3000]], colors: ['蓝色', '绿色', '粉色', '银色', '黄色'] },
  { n: 'iMac 24英寸 M3', sub: '一体机', price: 10999, specs: [['8GB+256GB', 0], ['16GB+512GB', 3000]], colors: ['蓝色', '绿色', '粉色', '银色', '橙色', '紫色'] },
  { n: 'iMac 24英寸 M4', sub: '一体机', price: 11999, specs: [['16GB+256GB', 0], ['24GB+512GB', 3000]], colors: ['蓝色', '绿色', '粉色', '银色', '橙色', '紫色'] },
  { n: 'Mac mini M1', sub: '台式机', price: 4499, specs: [['8GB+256GB', 0], ['16GB+512GB', 3000]], colors: ['银色'] },
  { n: 'Mac mini M2', sub: '台式机', price: 4499, specs: [['8GB+256GB', 0], ['16GB+512GB', 3000]], colors: ['银色'] },
  { n: 'Mac mini M4', sub: '台式机', price: 4499, specs: [['16GB+256GB', 0], ['24GB+512GB', 3000]], colors: ['银色'] },
  { n: 'Mac Studio M1 Max', sub: '台式机', price: 14999, specs: [['32GB+512GB', 0], ['64GB+1TB', 4500]], colors: ['银色'] },
  { n: 'Mac Studio M2 Max', sub: '台式机', price: 16999, specs: [['32GB+512GB', 0], ['64GB+1TB', 4500]], colors: ['银色'] },
  { n: 'Mac Studio M2 Ultra', sub: '台式机', price: 29999, specs: [['64GB+1TB', 0], ['128GB+2TB', 9000]], colors: ['银色'] },
  { n: 'Mac Studio M4 Max', sub: '台式机', price: 19999, specs: [['36GB+512GB', 0], ['64GB+1TB', 4500]], colors: ['银色'] },
  { n: 'Mac Pro M2 Ultra', sub: '台式机', price: 47999, specs: [['64GB+1TB', 0], ['128GB+4TB', 15000]], colors: ['银色'] }
];
for (const m of macModels) {
  for (const [spec, delta] of m.specs) {
    for (const color of m.colors) {
      addItem(`${m.n} ${spec} ${color}`, 'digital', m.sub, m.price + delta, '💻', [
        '苹果', 'Mac', m.n, spec, color
      ]);
    }
  }
}

/* ==================== 数码电子 · 耳机 / 手表 / 头显 ==================== */
const airpodsModels = [
  ['AirPods 2 标准充电盒', 999], ['AirPods 2 无线充电盒', 1279],
  ['AirPods 3', 1399], ['AirPods 4 标准版', 999], ['AirPods 4 主动降噪版', 1399],
  ['AirPods Pro 1', 1599], ['AirPods Pro 2 USB-C接口', 1899],
  ['AirPods Pro 2 闪电接口', 1899]
];
for (const [n, price] of airpodsModels) {
  addItem(n, 'digital', '耳机', price, '🎧', ['苹果', 'AirPods', n, '耳机', '降噪']);
}
for (const color of ['深空灰', '银色', '天蓝色', '粉色', '绿色']) {
  addItem(`AirPods Max 2024 USB-C ${color}`, 'digital', '耳机', 4399, '🎧', ['苹果', 'AirPods Max', color, '头戴耳机']);
  addItem(`AirPods Max 2020 闪电接口 ${color}`, 'digital', '耳机', 3999, '🎧', ['苹果', 'AirPods Max', color, '头戴耳机']);
}

const watchModels = [
  ['Apple Watch Series 3', 1000], ['Apple Watch Series 4', 1800], ['Apple Watch Series 5', 2500],
  ['Apple Watch Series 6', 2800], ['Apple Watch Series 7', 3000], ['Apple Watch Series 8', 3200],
  ['Apple Watch Series 9', 3300], ['Apple Watch Series 10', 3500],
  ['Apple Watch SE 1', 2000], ['Apple Watch SE 2', 2200],
  ['Apple Watch Ultra', 6000], ['Apple Watch Ultra 2', 6500]
];
const watchBands = ['运动型表带', '编织单圈表带', '米兰尼斯表带'];
const watchColors = ['午夜色', '星光色'];
for (const [n, price] of watchModels) {
  for (const [size, sizeDelta] of [['41mm', 0], ['45mm', 200]]) {
    for (const band of watchBands) {
      for (const color of watchColors) {
        addItem(`${n} ${size} ${band} ${color}`, 'digital', '智能手表', price + sizeDelta, '⌚', [
          '苹果', 'Apple Watch', n, size, band, color
        ]);
      }
    }
  }
}

for (const [cap, delta] of [['256GB', 0], ['512GB', 2000], ['1TB', 5000]]) {
  for (const lens of ['标准玻璃', '蔡司光学镜片']) {
    addItem(`Apple Vision Pro ${cap} ${lens}`, 'digital', 'VR头显', 29999 + delta, '🥽', [
      '苹果', 'Vision Pro', cap, lens, 'VR', '头显'
    ]);
  }
}

for (const color of ['白色', '深空灰']) {
  addItem(`HomePod mini ${color}`, 'digital', '智能音箱', 749, '🔊', ['苹果', 'HomePod', color, '音箱']);
}
for (const color of ['白色', '午夜色']) {
  addItem(`HomePod 第二代 ${color}`, 'digital', '智能音箱', 2299, '🔊', ['苹果', 'HomePod', color, '音箱']);
}
addItem('Apple TV 4K 64GB', 'digital', '电视盒子', 1299, '📺', ['苹果', 'Apple TV', '电视盒子']);
addItem('Apple TV 4K 128GB', 'digital', '电视盒子', 1499, '📺', ['苹果', 'Apple TV', '电视盒子']);

/* 苹果配件 */
const appleAccessories = [
  ['MagSafe 充电器', 329, '🔋', '充电配件'], ['MagSafe 外接电池', 749, '🔋', '充电配件'],
  ['MagSafe 卡包', 449, '🪪', '配件'], ['MagSafe 双项充电器', 1049, '🔋', '充电配件'],
  ['Apple Pencil 第一代', 722, '🖊️', '手写笔'], ['Apple Pencil 第二代', 969, '🖊️', '手写笔'],
  ['Apple Pencil USB-C', 649, '🖊️', '手写笔'], ['Apple Pencil Pro', 999, '🖊️', '手写笔'],
  ['妙控键盘 iPad 11英寸', 2399, '⌨️', '键盘'], ['妙控键盘 iPad 13英寸', 2899, '⌨️', '键盘'],
  ['妙控板', 1149, '🖱️', '触控板'], ['妙控鼠标', 679, '🖱️', '鼠标'],
  ['妙控键盘 Mac 无线版', 1099, '⌨️', '键盘'], ['AirTag 单只装', 229, '📍', '定位器'],
  ['AirTag 四只装', 779, '📍', '定位器'], ['USB-C 充电线 1米', 145, '🔌', '数据线'],
  ['雷雳4 Pro 数据线 1米', 499, '🔌', '数据线'], ['雷雳4 Pro 数据线 2米', 949, '🔌', '数据线'],
  ['USB-C 数字影音多端口转换器', 349, '🔌', '转换器'], ['USB-C 三合一转换器', 429, '🔌', '转换器']
];
for (const [n, price, emoji, sub] of appleAccessories) {
  addItem(n, 'digital', sub, price, emoji, ['苹果', n, sub]);
}
for (const model of ['iPhone 15', 'iPhone 15 Pro', 'iPhone 16', 'iPhone 16 Pro', 'iPhone 17', 'iPhone 17 Pro', 'iPhone Air']) {
  for (const color of ['黑色', '白色', '蓝色', '粉色']) {
    addItem(`${model} 硅胶保护壳 ${color}`, 'digital', '手机壳', 399, '📱', ['苹果', model, '手机壳', color]);
  }
}
for (const model of ['iPhone 15', 'iPhone 16', 'iPhone 17']) {
  addItem(`${model} 屏幕保护膜`, 'digital', '贴膜', 299, '📱', ['苹果', model, '钢化膜']);
}

/* ==================== 数码电子 · 其他手机品牌 ==================== */
const nonApplePhones = [
  { n: '华为 Mate 60', brand: '华为', price: 5499, specs: [['12GB+256GB', 0], ['12GB+512GB', 800]], colors: ['雅川青', '白沙银', '南糯紫', '雅丹黑'] },
  { n: '华为 Mate 60 Pro', brand: '华为', price: 6499, specs: [['12GB+256GB', 0], ['12GB+512GB', 800], ['12GB+1TB', 1800]], colors: ['雅川青', '白沙银', '南糯紫', '雅丹黑'] },
  { n: '华为 Mate 60 Pro+', brand: '华为', price: 8999, specs: [['16GB+512GB', 0], ['16GB+1TB', 1500]], colors: ['宣白', '砚黑'] },
  { n: '华为 Mate 70', brand: '华为', price: 5499, specs: [['12GB+256GB', 0], ['12GB+512GB', 800]], colors: ['曜石黑', '雪域白', '云杉绿', '风信紫'] },
  { n: '华为 Mate 70 Pro', brand: '华为', price: 6499, specs: [['12GB+256GB', 0], ['12GB+512GB', 800], ['12GB+1TB', 1800]], colors: ['曜石黑', '雪域白', '云杉绿', '风信紫'] },
  { n: '华为 Mate 70 Pro+', brand: '华为', price: 8499, specs: [['16GB+512GB', 0], ['16GB+1TB', 1500]], colors: ['金丝银锦', '飞天青', '墨韵黑'] },
  { n: '华为 Pura 70', brand: '华为', price: 5499, specs: [['12GB+256GB', 0], ['12GB+512GB', 800]], colors: ['羽砂黑', '雪域白', '樱玫红', '冰晶蓝'] },
  { n: '华为 Pura 70 Pro', brand: '华为', price: 6499, specs: [['12GB+256GB', 0], ['12GB+512GB', 800], ['12GB+1TB', 1800]], colors: ['羽砂黑', '雪域白', '樱玫红', '冰晶蓝'] },
  { n: '华为 Pura 70 Ultra', brand: '华为', price: 9999, specs: [['16GB+512GB', 0], ['16GB+1TB', 1500]], colors: ['星芒白', '鎏金黑', '魅影黑'] },
  { n: '华为 nova 12', brand: '华为', price: 2999, specs: [['8GB+256GB', 0], ['12GB+512GB', 700]], colors: ['12号色', '樱语白', '曜金黑'] },
  { n: '华为 nova 13', brand: '华为', price: 2699, specs: [['12GB+256GB', 0], ['12GB+512GB', 600]], colors: ['星耀黑', '羽砂白', '洛登绿', '心钥粉'] },
  { n: '小米 14', brand: '小米', price: 3999, specs: [['12GB+256GB', 0], ['16GB+512GB', 800]], colors: ['黑色', '白色', '岩山青', '雪山粉'] },
  { n: '小米 14 Pro', brand: '小米', price: 4999, specs: [['12GB+256GB', 0], ['16GB+512GB', 800], ['16GB+1TB', 1600]], colors: ['黑色', '白色', '钛金属原色', '岩石青'] },
  { n: '小米 14 Ultra', brand: '小米', price: 6499, specs: [['16GB+512GB', 0], ['16GB+1TB', 1500]], colors: ['黑色', '白色', '钛金属原色'] },
  { n: '小米 15', brand: '小米', price: 4499, specs: [['12GB+256GB', 0], ['16GB+512GB', 800], ['16GB+1TB', 1600]], colors: ['黑色', '白色', '浅草绿', '丁香紫'] },
  { n: '小米 15 Pro', brand: '小米', price: 5299, specs: [['12GB+256GB', 0], ['16GB+512GB', 800], ['16GB+1TB', 1600]], colors: ['黑色', '白色', '绿色', '钛金属原色'] },
  { n: '小米 15 Ultra', brand: '小米', price: 6499, specs: [['16GB+512GB', 0], ['16GB+1TB', 1500]], colors: ['黑色', '白色', '银黑色'] },
  { n: 'Redmi K70', brand: '小米', price: 2499, specs: [['12GB+256GB', 0], ['16GB+512GB', 700]], colors: ['墨羽', '晴雪', '竹月蓝', '浅茄紫'] },
  { n: 'Redmi K70 Pro', brand: '小米', price: 3299, specs: [['12GB+256GB', 0], ['16GB+512GB', 700]], colors: ['墨羽', '晴雪', '竹月蓝'] },
  { n: 'Redmi K80', brand: '小米', price: 2499, specs: [['12GB+256GB', 0], ['16GB+512GB', 700]], colors: ['雪岩白', '玄夜黑', '山峦青', '汐月蓝'] },
  { n: 'OPPO Find X7', brand: 'OPPO', price: 3999, specs: [['12GB+256GB', 0], ['16GB+512GB', 800]], colors: ['大漠银月', '海阔天空', '松影墨韵'] },
  { n: 'OPPO Find X7 Ultra', brand: 'OPPO', price: 5999, specs: [['16GB+512GB', 0], ['16GB+1TB', 1500]], colors: ['大漠银月', '海阔天空', '松影墨韵'] },
  { n: 'OPPO Find X8', brand: 'OPPO', price: 4199, specs: [['12GB+256GB', 0], ['16GB+512GB', 800]], colors: ['星野黑', '浮光白', '追风蓝', '气泡粉'] },
  { n: 'OPPO Find X8 Pro', brand: 'OPPO', price: 5299, specs: [['12GB+256GB', 0], ['16GB+512GB', 800], ['16GB+1TB', 1600]], colors: ['星野黑', '浮光白', '追风蓝'] },
  { n: 'vivo X100', brand: 'vivo', price: 3999, specs: [['12GB+256GB', 0], ['16GB+512GB', 800]], colors: ['星迹蓝', '落日橙', '白月光', '辰夜黑'] },
  { n: 'vivo X100 Pro', brand: 'vivo', price: 4999, specs: [['12GB+256GB', 0], ['16GB+512GB', 800], ['16GB+1TB', 1600]], colors: ['星迹蓝', '落日橙', '白月光', '辰夜黑'] },
  { n: 'vivo X200', brand: 'vivo', price: 4299, specs: [['12GB+256GB', 0], ['16GB+512GB', 800]], colors: ['宝石蓝', '钛色', '白月光', '辰夜黑'] },
  { n: 'vivo X200 Pro', brand: 'vivo', price: 5299, specs: [['16GB+512GB', 0], ['16GB+1TB', 1500]], colors: ['宝石蓝', '钛色', '白月光', '辰夜黑'] },
  { n: '荣耀 Magic6', brand: '荣耀', price: 4399, specs: [['12GB+256GB', 0], ['16GB+512GB', 800]], colors: ['绒黑色', '祁连雪', '海湖青', '麦浪金'] },
  { n: '荣耀 Magic6 Pro', brand: '荣耀', price: 5699, specs: [['12GB+256GB', 0], ['16GB+512GB', 800], ['16GB+1TB', 1600]], colors: ['绒黑色', '祁连雪', '海湖青', '麦浪金'] },
  { n: '荣耀 Magic7', brand: '荣耀', price: 4499, specs: [['12GB+256GB', 0], ['16GB+512GB', 800]], colors: ['绒黑色', '雪域白', '月影灰', '朝霞金'] },
  { n: '荣耀 Magic7 Pro', brand: '荣耀', price: 5699, specs: [['12GB+256GB', 0], ['16GB+512GB', 800], ['16GB+1TB', 1600]], colors: ['绒黑色', '雪域白', '月影灰', '朝霞金'] },
  { n: '三星 Galaxy S24', brand: '三星', price: 5999, specs: [['8GB+256GB', 0], ['12GB+512GB', 1000]], colors: ['雅岩灰', '水墨黑', '钴藤紫', '琥珀黄'] },
  { n: '三星 Galaxy S24 Ultra', brand: '三星', price: 9699, specs: [['12GB+256GB', 0], ['12GB+512GB', 1000], ['12GB+1TB', 2200]], colors: ['钛灰', '钛黑', '钛紫', '钛黄'] },
  { n: '三星 Galaxy S25', brand: '三星', price: 5999, specs: [['12GB+256GB', 0], ['12GB+512GB', 1000]], colors: ['冰蓝', '薄荷绿', '海军蓝', '银灰'] },
  { n: '三星 Galaxy S25 Ultra', brand: '三星', price: 9699, specs: [['12GB+256GB', 0], ['12GB+512GB', 1000], ['12GB+1TB', 2200]], colors: ['钛银蓝', '钛黑', '钛灰', '钛白'] },
  { n: '三星 Galaxy Z Fold6', brand: '三星', price: 13999, specs: [['12GB+256GB', 0], ['12GB+512GB', 1000], ['12GB+1TB', 2200]], colors: ['时空黑', '静谧蓝', '星夜银'] },
  { n: '三星 Galaxy Z Flip6', brand: '三星', price: 7999, specs: [['12GB+256GB', 0], ['12GB+512GB', 1000]], colors: ['香桃粉', '星夜银', '海影蓝', '极地白'] },
  { n: '一加 12', brand: '一加', price: 4299, specs: [['12GB+256GB', 0], ['16GB+512GB', 800]], colors: ['岩板黑', '留白', '苍绿'] },
  { n: '一加 13', brand: '一加', price: 4499, specs: [['12GB+256GB', 0], ['16GB+512GB', 800], ['24GB+1TB', 1600]], colors: ['黑曜秘境', '蓝调时刻', '白露晨曦'] },
  { n: 'realme GT5 Pro', brand: 'realme', price: 3299, specs: [['12GB+256GB', 0], ['16GB+512GB', 700]], colors: ['赤岩', '皓月', '墨岩'] },
  { n: 'realme GT7 Pro', brand: 'realme', price: 3599, specs: [['12GB+256GB', 0], ['16GB+512GB', 700]], colors: ['星迹钛', '火星', '光域白'] },
  { n: '魅族 21', brand: '魅族', price: 3399, specs: [['12GB+256GB', 0], ['12GB+512GB', 600]], colors: ['无界黑', '锐意青', '定白', '灵动紫'] },
  { n: '魅族 22', brand: '魅族', price: 3699, specs: [['12GB+256GB', 0], ['12GB+512GB', 600]], colors: ['曜石黑', '雪域白', '晨曦金'] }
];
const phoneColorsTrim = (colors) => colors.slice(0, 3);
for (const m of nonApplePhones) {
  for (const [spec, delta] of m.specs) {
    for (const color of phoneColorsTrim(m.colors)) {
      addItem(`${m.n} ${spec} ${color}`, 'digital', '手机', m.price + delta, '📱', [
        m.brand, '手机', m.n, spec, color
      ]);
    }
  }
}

/* ==================== 数码电子 · 笔记本 / 相机 / 游戏机 ==================== */
const laptops = [
  { n: '华为 MateBook 14', brand: '华为', price: 5499, specs: [['i5+16GB+512GB', 0], ['i7+16GB+1TB', 1200], ['Ultra7+32GB+1TB', 2500]], colors: ['深空灰', '皓月银'] },
  { n: '华为 MateBook X Pro', brand: '华为', price: 9999, specs: [['Ultra7+16GB+1TB', 0], ['Ultra9+32GB+2TB', 3000]], colors: ['砚黑', '白沙银', '翡冷翠'] },
  { n: '联想 拯救者 Y9000P', brand: '联想', price: 9499, specs: [['i7+16GB+1TB+RTX4060', 0], ['i9+32GB+1TB+RTX4070', 2500], ['i9+32GB+2TB+RTX4090', 7000]], colors: ['曜石黑', '冰魄白'] },
  { n: '联想 小新 Pro 14', brand: '联想', price: 4999, specs: [['R7+16GB+512GB', 0], ['R7+32GB+1TB', 1200]], colors: ['深空灰', '银色'] },
  { n: '联想 ThinkPad X1 Carbon', brand: '联想', price: 12999, specs: [['i7+16GB+512GB', 0], ['i7+32GB+1TB', 2000]], colors: ['黑色'] },
  { n: '戴尔 XPS 13', brand: '戴尔', price: 10999, specs: [['i7+16GB+512GB', 0], ['i7+32GB+1TB', 2200]], colors: ['银色', '石墨黑'] },
  { n: '戴尔 XPS 15', brand: '戴尔', price: 15999, specs: [['i7+16GB+512GB+RTX4050', 0], ['i9+32GB+1TB+RTX4060', 3000]], colors: ['银色', '石墨黑'] },
  { n: '惠普 暗影精灵 10', brand: '惠普', price: 8499, specs: [['i7+16GB+1TB+RTX4060', 0], ['i9+32GB+1TB+RTX4070', 2500]], colors: ['黑色', '白色'] },
  { n: '华硕 ROG 幻16', brand: '华硕', price: 12999, specs: [['i9+16GB+1TB+RTX4060', 0], ['i9+32GB+1TB+RTX4070', 2000], ['i9+32GB+2TB+RTX4080', 5000]], colors: ['星空黑', '月光白'] },
  { n: '微星 泰坦 18', brand: '微星', price: 24999, specs: [['i9+32GB+2TB+RTX4080', 0], ['i9+64GB+4TB+RTX4090', 9000]], colors: ['黑色'] },
  { n: '机械革命 蛟龙 16 Pro', brand: '机械革命', price: 6999, specs: [['R7+16GB+1TB+RTX4060', 0], ['R9+32GB+1TB+RTX4070', 2200]], colors: ['灰色', '白色'] },
  { n: '神舟 战神 TX8', brand: '神舟', price: 6499, specs: [['i7+16GB+512GB+RTX4060', 0], ['i9+32GB+1TB+RTX4070', 2500]], colors: ['黑色'] },
  { n: '微软 Surface Laptop 7', brand: '微软', price: 8999, specs: [['骁龙X Elite+16GB+512GB', 0], ['骁龙X Elite+32GB+1TB', 1800]], colors: ['铂金色', '黑色', '沙漫金', '海蓝色'] },
  { n: '微软 Surface Pro 11', brand: '微软', price: 8999, specs: [['骁龙X Plus+16GB+256GB', 0], ['骁龙X Elite+16GB+512GB', 1500]], colors: ['亮铂金', '黑色', '宝石蓝'] },
  { n: '三星 Galaxy Book5 Pro', brand: '三星', price: 9999, specs: [['Ultra7+16GB+512GB', 0], ['Ultra7+32GB+1TB', 1800]], colors: ['灰色', '银色'] }
];
for (const m of laptops) {
  for (const [spec, delta] of m.specs) {
    for (const color of m.colors) {
      addItem(`${m.n} ${spec} ${color}`, 'digital', '笔记本', m.price + delta, '💻', [
        m.brand, '笔记本', m.n, spec, color
      ]);
    }
  }
}

const cameras = [
  { n: '佳能 EOS R5', brand: '佳能', price: 22999, kit: 6000, emoji: '📷' },
  { n: '佳能 EOS R5 Mark II', brand: '佳能', price: 26999, kit: 6500, emoji: '📷' },
  { n: '佳能 EOS R6 Mark II', brand: '佳能', price: 15999, kit: 4000, emoji: '📷' },
  { n: '佳能 EOS R8', brand: '佳能', price: 9999, kit: 2500, emoji: '📷' },
  { n: '佳能 EOS 5D Mark IV', brand: '佳能', price: 13999, kit: 3500, emoji: '📷' },
  { n: '尼康 Z6 III', brand: '尼康', price: 17999, kit: 4500, emoji: '📷' },
  { n: '尼康 Z8', brand: '尼康', price: 27999, kit: 7000, emoji: '📷' },
  { n: '尼康 Z9', brand: '尼康', price: 35999, kit: 9000, emoji: '📷' },
  { n: '索尼 A7M4', brand: '索尼', price: 15999, kit: 4000, emoji: '📷' },
  { n: '索尼 A7R5', brand: '索尼', price: 23999, kit: 6000, emoji: '📷' },
  { n: '索尼 A1', brand: '索尼', price: 39999, kit: 10000, emoji: '📷' },
  { n: '索尼 A6700', brand: '索尼', price: 9999, kit: 2500, emoji: '📷' },
  { n: '富士 X-T5', brand: '富士', price: 11999, kit: 3000, emoji: '📷' },
  { n: '富士 X100VI', brand: '富士', price: 12999, kit: 0, emoji: '📷' },
  { n: '松下 Lumix S5 II', brand: '松下', price: 12999, kit: 3200, emoji: '📷' },
  { n: '徕卡 Q3', brand: '徕卡', price: 42999, kit: 0, emoji: '📷' },
  { n: '徕卡 SL3', brand: '徕卡', price: 49999, kit: 12000, emoji: '📷' },
  { n: '哈苏 X2D 100C', brand: '哈苏', price: 49999, kit: 12000, emoji: '📷' },
  { n: '适马 fp L', brand: '适马', price: 12999, kit: 3000, emoji: '📷' },
  { n: '奥林巴斯 OM-1', brand: '奥林巴斯', price: 13999, kit: 3500, emoji: '📷' }
];
for (const m of cameras) {
  addItem(`${m.n} 单机身`, 'digital', '相机', m.price, '📷', [m.brand, '相机', m.n, '单机身']);
  addItem(`${m.n} 套机`, 'digital', '相机', m.price + m.kit, '📷', [m.brand, '相机', m.n, '套机']);
}

const lenses = [
  ['佳能 RF 24-70mm F2.8 L', 16999], ['佳能 RF 50mm F1.2 L', 17999], ['佳能 RF 70-200mm F2.8 L', 18999],
  ['佳能 RF 16mm F2.8 STM', 2499], ['尼康 Z 24-70mm F2.8 S', 15999], ['尼康 Z 50mm F1.2 S', 16999],
  ['尼康 Z 70-200mm F2.8 S', 17999], ['索尼 FE 24-70mm F2.8 GM II', 16999], ['索尼 FE 50mm F1.2 GM', 15999],
  ['索尼 FE 70-200mm F2.8 GM II', 18999], ['索尼 FE 35mm F1.4 GM', 12999], ['富士 XF 56mm F1.2 R', 6999],
  ['适马 35mm F1.4 DG DN', 4999], ['腾龙 28-75mm F2.8 G2', 5999], ['徕卡 Summilux 50mm F1.4', 34999]
];
for (const [n, price] of lenses) {
  addItem(n, 'digital', '镜头', price, '🔭', ['相机镜头', n, '摄影']);
}

const consoles = [
  ['任天堂 Switch OLED 白色', 2399], ['任天堂 Switch OLED 霓虹蓝', 2399], ['任天堂 Switch 续航版', 1999],
  ['任天堂 Switch Lite 黄色', 1299], ['任天堂 Switch Lite 珊瑚粉', 1299], ['任天堂 Switch 2', 3899],
  ['索尼 PS5 光驱版', 3599], ['索尼 PS5 数字版', 3099], ['索尼 PS5 Pro', 4999],
  ['微软 Xbox Series X', 3899], ['微软 Xbox Series S', 2399],
  ['Steam Deck LCD 256GB', 3299], ['Steam Deck OLED 512GB', 4499], ['Steam Deck OLED 1TB', 5499],
  ['ROG Ally 掌机', 4999], ['联想拯救者掌机', 4599], ['GPD Win Mini', 5999]
];
for (const [n, price] of consoles) {
  addItem(n, 'digital', '游戏机', price, '🎮', ['游戏机', n, '主机']);
}
for (const [n, price] of [['PS5 DualSense 手柄', 549], ['Xbox 无线手柄', 449], ['Switch Pro 手柄', 399], ['任天堂 Joy-Con 一对', 549], ['北通 宙斯2 手柄', 599], ['飞智 八爪鱼4 手柄', 499]]) {
  addItem(n, 'digital', '游戏配件', price, '🎮', ['游戏手柄', n]);
}
for (const [n, price] of [['塞尔达传说 王国之泪', 399], ['超级马力欧 奥德赛', 299], ['战神 诸神黄昏', 399], ['艾尔登法环', 399], ['黑神话 悟空', 268], ['赛博朋克 2077', 298], ['FIFA 25', 399], ['NBA 2K25', 399], ['使命召唤 21', 399], ['GT赛车7', 399]]) {
  addItem(n, 'digital', '游戏软件', price, '💿', ['游戏', n, '主机游戏']);
}

/* ==================== 数码电子 · 外设 / 智能硬件 ==================== */
const monitors = [
  ['戴尔 U2723QE 27英寸 4K', 3999, '戴尔'], ['戴尔 AW3423DWF 34英寸 带鱼屏', 7999, '戴尔'],
  ['明基 PD2705U 27英寸 4K', 3499, '明基'], ['明基 SW271C 27英寸 专业显示器', 6999, '明基'],
  ['华硕 ROG 超梦27 2K 240Hz', 4999, '华硕'], ['华硕 ProArt 27英寸 4K', 3999, '华硕'],
  ['LG 27GP950 27英寸 4K 144Hz', 4999, 'LG'], ['LG 34WK95U 34英寸 5K2K', 8999, 'LG'],
  ['三星 Odyssey G9 49英寸', 9999, '三星'], ['三星 ViewFinity S9 27英寸 5K', 5999, '三星'],
  ['小米 27英寸 2K 165Hz', 1299, '小米'], ['小米 34英寸 带鱼屏 144Hz', 1999, '小米'],
  ['AOC 24英寸 1080P 100Hz', 499, 'AOC'], ['AOC 27英寸 2K 180Hz', 1199, 'AOC'],
  ['HKC 27英寸 2K 170Hz', 899, 'HKC'], ['泰坦军团 27英寸 2K 240Hz', 1599, '泰坦军团']
];
for (const [n, price, brand] of monitors) {
  addItem(n, 'digital', '显示器', price, '🖥️', [brand, '显示器', n]);
}
const keyboards = [
  ['罗技 MX Keys S 无线键盘', 699, '罗技'], ['罗技 G Pro X 机械键盘', 999, '罗技'],
  ['雷蛇 黑寡妇 V4 机械键盘', 1299, '雷蛇'], ['雷蛇 猎魂光蛛 V3', 1599, '雷蛇'],
  ['樱桃 MX 3.0S 机械键盘', 499, '樱桃'], ['达尔优 A98 机械键盘', 399, '达尔优'],
  ['杜伽 K620W 机械键盘', 599, '杜伽'], ['Keychron Q1 Pro 机械键盘', 1299, 'Keychron'],
  ['狼蛛 F87 机械键盘', 199, '狼蛛'], ['腹灵 F12 机械键盘', 299, '腹灵'],
  ['HHKB Professional 键盘', 2399, 'HHKB'], ['Filco 圣手二代 机械键盘', 1599, 'Filco']
];
for (const [n, price, brand] of keyboards) {
  addItem(n, 'digital', '键盘', price, '⌨️', [brand, '键盘', n]);
}
const mice = [
  ['罗技 G502 X 无线鼠标', 699, '罗技'], ['罗技 MX Master 3S', 799, '罗技'],
  ['雷蛇 炼狱蝰蛇 V3 Pro', 999, '雷蛇'], ['雷蛇 毒蝰 V3 Pro', 1099, '雷蛇'],
  ['卓威 EC2-CW 鼠标', 1099, '卓威'], ['微软 Surface Arc 鼠标', 599, '微软'],
  ['小米 无线鼠标 3', 99, '小米'], ['达尔优 A950 无线鼠标', 299, '达尔优'],
  ['VGN 蜻蜓 F1 Pro', 399, 'VGN'], ['黑爵 AJ199 无线鼠标', 199, '黑爵']
];
for (const [n, price, brand] of mice) {
  addItem(n, 'digital', '鼠标', price, '🖱️', [brand, '鼠标', n]);
}
const peripherals = [
  ['三星 990 Pro 1TB 固态硬盘', 899, '💾', '硬盘'], ['三星 990 Pro 2TB 固态硬盘', 1599, '💾', '硬盘'],
  ['西部数据 SN850X 1TB', 799, '💾', '硬盘'], ['西部数据 SN850X 2TB', 1499, '💾', '硬盘'],
  ['致态 TiPro7000 2TB', 1099, '💾', '硬盘'], ['闪迪 至尊超极速 1TB', 699, '💾', '硬盘'],
  ['群晖 DS923+ NAS', 4599, '💾', 'NAS'], ['群晖 DS1522+ NAS', 6999, '💾', 'NAS'],
  ['威联通 TS-464C NAS', 3999, '💾', 'NAS'], ['绿联 DXP4800 NAS', 2999, '💾', 'NAS'],
  ['小米路由器 AX3000T', 199, '📶', '路由器'], ['华硕 RT-AX86U Pro', 1599, '📶', '路由器'],
  ['网件 RAX80 路由器', 1999, '📶', '路由器'], ['TP-LINK 7DR7230 路由器', 599, '📶', '路由器'],
  ['华为路由 BE7 Pro', 699, '📶', '路由器'], ['锐捷 星耀 X60 Pro', 399, '📶', '路由器'],
  ['Anker 安克 65W 氮化镓充电器', 199, '🔌', '充电器'], ['Anker 安克 100W 氮化镓充电器', 329, '🔌', '充电器'],
  ['小米 120W 充电器', 129, '🔌', '充电器'], ['倍思 65W 氮化镓充电器', 149, '🔌', '充电器'],
  ['Anker 安克 20000mAh 充电宝', 299, '🔋', '移动电源'], ['小米 20000mAh 充电宝', 149, '🔋', '移动电源'],
  ['罗马仕 20000mAh 充电宝', 99, '🔋', '移动电源'], ['紫米 10000mAh 充电宝', 129, '🔋', '移动电源'],
  ['索尼 WH-1000XM5 头戴耳机', 2399, '🎧', '耳机'], ['索尼 WF-1000XM5 真无线耳机', 1499, '🎧', '耳机'],
  ['Bose QuietComfort Ultra 头戴耳机', 2699, '🎧', '耳机'], ['Bose QC Ultra 真无线耳机', 1999, '🎧', '耳机'],
  ['森海塞尔 HD 660S2 头戴耳机', 2999, '🎧', '耳机'], ['森海塞尔 IE 200 入耳耳机', 999, '🎧', '耳机'],
  ['拜亚动力 DT 1990 Pro', 3999, '🎧', '耳机'], ['漫步者 STAX SPIRIT S3', 1299, '🎧', '耳机'],
  ['华为 FreeBuds Pro 4', 1499, '🎧', '耳机'], ['小米 Buds 5 Pro', 999, '🎧', '耳机'],
  ['OPPO Enco X3', 999, '🎧', '耳机'], ['vivo TWS 4 Pro', 899, '🎧', '耳机']
];
for (const [n, price, emoji, sub] of peripherals) {
  addItem(n, 'digital', sub, price, emoji, [n, sub, '数码配件']);
}

const smartHome = [
  ['小米 小爱音箱 Pro', 299], ['小米 小爱音箱 Play', 149], ['小米 Sound Pro', 999], ['小米 Sound Move', 499],
  ['华为 Sound X 2024', 1999], ['华为 Sound Joy 2', 799], ['天猫精灵 X6', 399], ['天猫精灵 方糖 3', 199],
  ['小度 智能音箱 X9', 599], ['小度 智能屏 8', 699],
  ['小米 智能门锁 M20 Pro', 1499], ['华为 智能门锁 Pro', 2499], ['凯迪仕 K20 Pro Max', 1999],
  ['德施曼 Q5M Pro', 1799], ['鹿客 S50M Pro', 1599],
  ['小米 智能摄像机 3 Pro', 299], ['华为 智选 摄像头 Pro', 399], ['萤石 C6c 摄像头', 249],
  ['小米 手环 9 Pro', 399], ['华为 手环 9', 299], ['荣耀 手环 9', 249],
  ['华为 WATCH GT5', 1488], ['小米 Watch S4', 999], ['佳明 Forerunner 265', 2699],
  ['小米 智能灯泡', 79], ['Yeelight 智能灯泡', 99], ['小米 智能插座 3', 59], ['公牛 智能插座', 89]
];
for (const [n, price] of smartHome) {
  addItem(n, 'digital', '智能硬件', price, '📡', [n, '智能家居']);
}

/* 其他品牌手机壳 / 充电配件补量 */
for (const brand of ['华为', '小米', 'OPPO', 'vivo', '荣耀', '三星']) {
  for (const color of ['黑色', '白色', '蓝色']) {
    addItem(`${brand} 旗舰机型 硅胶保护壳 ${color}`, 'digital', '手机壳', 129, '📱', [brand, '手机壳', color]);
    addItem(`${brand} 旗舰机型 钢化膜 ${color}包装`, 'digital', '贴膜', 89, '📱', [brand, '钢化膜']);
  }
}
const cameraGear = [
  ['大疆 RS4 稳定器', 2999, '🎬'], ['大疆 RS4 Pro 稳定器', 5999, '🎬'], ['智云 WEEBILL 3S', 2599, '🎬'],
  ['曼富图 三脚架 Befree Advanced', 1899, '📐'], ['捷信 系统家三脚架', 6999, '📐'], ['思锐 碳纤维三脚架', 1299, '📐'],
  ['爱普生 L8168 打印机', 4999, '🖨️'], ['惠普 创系列 打印机', 1299, '🖨️'], ['佳能 G3800 打印机', 899, '🖨️'],
  ['极印 照片打印机', 599, '🖨️'], ['富士 instax mini 12 拍立得', 799, '📸'], ['富士 instax mini Evo', 1499, '📸'],
  ['大疆 Pocket 3 口袋相机', 3499, '📹'], ['大疆 Action 4 运动相机', 2299, '📹'], ['GoPro Hero 13', 3299, '📹'],
  ['影石 Insta360 X4', 3299, '📹'], ['影石 Insta360 GO 3S', 2299, '📹'], ['索尼 ZV-E10 II', 6999, '📹']
];
for (const [n, price, emoji] of cameraGear) {
  addItem(n, 'digital', '影像设备', price, emoji, [n, '摄影器材']);
}

/* ==================== 零食饮品 ==================== */
function snack(brand, prod, sub, emoji, unitPrice, flavors, packs, extraTags = []) {
  for (const f of flavors) {
    for (const [spec, mult] of packs) {
      addItem(`${brand} ${prod} ${f} ${spec}`, 'snacks', sub, unitPrice * mult, emoji, [
        brand, prod, f, ...extraTags
      ]);
    }
  }
}

/* 薯片膨化 */
const P_CHIP = [['70g', 1], ['3袋装', 2.8], ['整箱24袋', 21]];
snack('乐事', '薯片', '薯片', '🍟', 5.5, ['原味', '黄瓜味', '番茄味', '烧烤味', '香辣味', '鸡翅味', '牛排味', '小龙虾味', '海盐黑胡椒味', '芥末味'], P_CHIP, ['膨化食品']);
snack('乐事', '无限薯片', '薯片', '🍟', 6.5, ['原味', '黄瓜味', '番茄味', '烧烤味'], [['104g', 1], ['3罐装', 3.1]], ['膨化食品']);
snack('可比克', '薯片', '薯片', '🍟', 4.5, ['原味', '番茄味', '烧烤味', '香辣味', '黄瓜味', '芝士味'], P_CHIP, ['膨化食品']);
snack('上好佳', '薯片', '薯片', '🍟', 4, ['原味', '洋葱味', '番茄味', '烤肉味', '芝士味', '海苔味'], [['60g', 1], ['3袋装', 2.9], ['10袋装', 9.2]], ['膨化食品']);
snack('品客', '薯片', '薯片', '🍟', 12, ['原味', '酸奶油洋葱味', '烧烤味', '番茄味', '芝士味'], [['110g', 1], ['2罐装', 1.95], ['6罐装', 5.5]], ['进口零食']);
snack('多力多滋', '玉米片', '膨化食品', '🌽', 7, ['原味', '超浓芝士味', '烧烤味', '辣味'], [['70g', 1], ['3袋装', 2.8]], ['膨化食品']);
snack('薯愿', '薯片', '薯片', '🍟', 6, ['原味', '番茄味', '烧烤味', '香辣味'], [['52g', 1], ['4杯装', 3.7]], ['膨化食品']);
snack('卡乐比', '薯条三兄弟', '膨化食品', '🍟', 18, ['原味', '淡盐味', '海苔味'], [['90g', 1], ['2盒装', 1.9]], ['日本零食']);
snack('旺旺', '浪味仙', '膨化食品', '🌀', 5, ['原味', '蔬菜味', '海苔味'], [['70g', 1], ['3袋装', 2.8]], ['膨化食品']);
snack('奇多', '粟米条', '膨化食品', '🌽', 5, ['原味', '火辣味', '芝士味'], [['70g', 1], ['3袋装', 2.8]], ['膨化食品']);
snack('妙脆角', '玉米角', '膨化食品', '🌽', 4.5, ['原味', '番茄味', '烧烤味'], [['65g', 1], ['3袋装', 2.8]], ['膨化食品']);
snack('咪咪', '虾条', '膨化食品', '🦐', 1.5, ['原味', '辣味', '海苔味'], [['40g', 1], ['10袋装', 9]], ['怀旧零食']);
snack('上好佳', '虾条', '膨化食品', '🦐', 3.5, ['原味', '辣味', '海苔味'], [['60g', 1], ['5袋装', 4.6]], ['膨化食品']);
snack('三只松鼠', '锅巴', '膨化食品', '🍘', 9.9, ['麻辣味', '五香味', '咸蛋黄味'], [['120g', 1], ['3袋装', 2.9]], ['休闲零食']);

/* 饼干糕点 */
const P_BOX = [['单盒', 1], ['2盒装', 1.9], ['6盒装', 5.4]];
snack('奥利奥', '夹心饼干', '饼干', '🍪', 9.9, ['原味', '巧克力味', '草莓味', '抹茶味', '生日蛋糕味'], P_BOX, ['饼干']);
snack('趣多多', '曲奇饼干', '饼干', '🍪', 7.5, ['巧克力味', '黄油味', '提子味', '抹茶味'], [['单包', 1], ['3包装', 2.8]], ['饼干']);
snack('康师傅', '3+2苏打夹心饼干', '饼干', '🍪', 6, ['香草味', '巧克力味', '柠檬味', '草莓味'], [['单包', 1], ['5包装', 4.8]], ['饼干']);
snack('好丽友', '派', '糕点', '🍰', 12, ['巧克力味', '草莓味', '抹茶味', '香蕉味'], [['6枚装', 1], ['12枚装', 1.9], ['30枚整箱', 4.5]], ['韩国零食']);
snack('皇冠', '丹麦曲奇', '饼干', '🍪', 35, ['原味', '巧克力味', '坚果味'], [['400g', 1], ['礼盒装', 1.8]], ['进口饼干']);
snack('白色恋人', '巧克力夹心饼干', '饼干', '🍫', 78, ['白巧克力', '黑巧克力'], [['12枚装', 1], ['24枚礼盒', 1.9]], ['日本零食']);
snack('蓝罐', '曲奇饼干', '饼干', '🍪', 59, ['原味', '巧克力味', '咖啡味'], [['454g', 1], ['908g礼盒', 1.9]], ['进口饼干']);
snack('太平', '苏打饼干', '饼干', '🍪', 6.5, ['原味', '芝麻味', '海盐味', '奶盐味'], [['单包', 1], ['5包装', 4.8]], ['饼干']);
snack('嘉顿', '威化饼干', '饼干', '🍫', 8, ['巧克力味', '芝士味', '柠檬味', '草莓味'], [['单包', 1], ['3包装', 2.8]], ['饼干']);
snack('康师傅', '蛋卷', '糕点', '🥮', 8.9, ['原味', '芝麻味', '海苔味'], [['单盒', 1], ['2盒装', 1.9]], ['糕点']);
snack('达利园', '法式小面包', '糕点', '🍞', 9.9, ['原味', '奶香味', '巧克力味'], [['单袋', 1], ['整箱装', 4.5]], ['糕点']);
snack('盼盼', '手撕面包', '糕点', '🍞', 8.9, ['原味', '奶香味', '红豆味'], [['单袋', 1], ['整箱装', 4.8]], ['糕点']);

/* 巧克力糖果 */
snack('德芙', '巧克力', '巧克力', '🍫', 12, ['丝滑牛奶', '黑巧克力', '白巧克力', '榛仁', '葡萄干', '草莓味'], [['43g', 1], ['3排装', 2.8], ['礼盒装', 5.5]], ['巧克力']);
snack('费列罗', '榛果威化巧克力', '巧克力', '🍫', 39, ['经典榛果', '黑巧克力', '椰子'], [['3粒装', 1], ['8粒装', 2.5], ['24粒礼盒', 6.5]], ['进口巧克力']);
snack('好时', 'Kisses 巧克力', '巧克力', '🍫', 19, ['牛奶味', '黑巧克力味', '杏仁味', '曲奇味', '焦糖味'], [['82g', 1], ['3袋装', 2.8]], ['巧克力']);
snack('Lindt', '瑞士莲巧克力', '巧克力', '🍫', 25, ['牛奶味', '特浓黑巧', '草莓味', '榛仁味', '海盐味'], [['100g', 1], ['2袋装', 1.9]], ['进口巧克力']);
snack('明治', '雪吻巧克力', '巧克力', '🍫', 18, ['牛奶味', '抹茶味', '草莓味', '黑巧味'], [['单盒', 1], ['2盒装', 1.9]], ['日本零食']);
snack('歌帝梵', '松露巧克力礼盒', '巧克力', '🍫', 168, ['经典混合', '黑巧混合', '焦糖海盐'], [['12颗装', 1], ['24颗礼盒', 1.9]], ['高端巧克力']);
snack('健达', '巧克力', '巧克力', '🍫', 8, ['牛奶味', '榛果味', '奇趣蛋'], [['单条', 1], ['8条装', 7.5]], ['进口巧克力']);
snack('士力架', '花生夹心巧克力', '巧克力', '🍫', 4.5, ['原味', '燕麦味', '白巧克力味'], [['单条', 1], ['12条装', 11]], ['能量零食']);
snack('阿尔卑斯', '棒棒糖', '糖果', '🍬', 3, ['原味牛奶', '草莓味', '葡萄味', '芒果味', '蓝莓味'], [['单支', 1], ['10支装', 9], ['30支桶装', 26]], ['糖果']);
snack('大白兔', '奶糖', '糖果', '🍬', 12, ['原味', '红豆味', '酸奶味', '清凉味'], [['227g', 1], ['454g礼盒', 1.9]], ['国货零食']);
snack('旺仔', 'QQ糖', '糖果', '🍬', 5, ['草莓味', '葡萄味', '苹果味'], [['单袋', 1], ['5袋装', 4.8]], ['糖果']);
snack('曼妥思', '薄荷糖', '糖果', '🍬', 9, ['薄荷味', '葡萄味', '草莓味', '青柠味'], [['单盒', 1], ['6盒装', 5.5]], ['糖果']);
snack('彩虹糖', '果汁糖', '糖果', '🌈', 6, ['原味', '酸味', '莓果味', '热带水果味'], [['单袋', 1], ['3袋装', 2.8]], ['糖果']);
snack('哈瑞宝', '小熊软糖', '糖果', '🧸', 15, ['原味', '可乐味', '酸味', '热带水果味'], [['100g', 1], ['3袋装', 2.8]], ['进口糖果']);

/* 坚果炒货 */
const P_NUT = [['单袋', 1], ['3袋装', 2.9], ['整箱装', 10]];
snack('三只松鼠', '每日坚果', '坚果', '🥜', 12, ['混合坚果', '孕妇版', '儿童版', '无盐版'], [['7袋装', 1], ['30袋整箱', 4.2]], ['坚果']);
snack('三只松鼠', '碧根果', '坚果', '🥜', 19, ['奶油味', '原味', '盐焗味'], P_NUT, ['坚果']);
snack('三只松鼠', '夏威夷果', '坚果', '🥜', 22, ['奶油味', '原味', '盐焗味'], P_NUT, ['坚果']);
snack('三只松鼠', '腰果', '坚果', '🥜', 25, ['原味', '炭烧味', '盐焗味'], P_NUT, ['坚果']);
snack('三只松鼠', '巴旦木', '坚果', '🥜', 23, ['原味', '奶油味', '盐焗味'], P_NUT, ['坚果']);
snack('三只松鼠', '开心果', '坚果', '🥜', 29, ['原味', '盐焗味', '炭烧味'], P_NUT, ['坚果']);
snack('三只松鼠', '核桃', '坚果', '🌰', 20, ['原味', '奶油味', '蜂蜜味'], P_NUT, ['坚果']);
snack('三只松鼠', '葡萄干', '果干', '🍇', 15, ['原味', '黑加仑', '玫瑰味'], P_NUT, ['果干']);
snack('良品铺子', '每日坚果', '坚果', '🥜', 13, ['混合坚果', '孕妇版', '儿童版', '无盐版'], [['7袋装', 1], ['30袋整箱', 4.2]], ['坚果']);
snack('良品铺子', '碧根果', '坚果', '🥜', 20, ['奶油味', '原味', '盐焗味'], P_NUT, ['坚果']);
snack('良品铺子', '夏威夷果', '坚果', '🥜', 23, ['奶油味', '原味', '盐焗味'], P_NUT, ['坚果']);
snack('良品铺子', '腰果', '坚果', '🥜', 26, ['原味', '炭烧味', '盐焗味'], P_NUT, ['坚果']);
snack('良品铺子', '巴旦木', '坚果', '🥜', 24, ['原味', '奶油味', '盐焗味'], P_NUT, ['坚果']);
snack('良品铺子', '开心果', '坚果', '🥜', 30, ['原味', '盐焗味', '炭烧味'], P_NUT, ['坚果']);
snack('良品铺子', '核桃', '坚果', '🌰', 21, ['原味', '奶油味', '蜂蜜味'], P_NUT, ['坚果']);
snack('良品铺子', '葡萄干', '果干', '🍇', 16, ['原味', '黑加仑', '玫瑰味'], P_NUT, ['果干']);
snack('百草味', '每日坚果', '坚果', '🥜', 12, ['混合坚果', '孕妇版', '儿童版', '无盐版'], [['7袋装', 1], ['30袋整箱', 4.2]], ['坚果']);
snack('百草味', '碧根果', '坚果', '🥜', 19, ['奶油味', '原味', '盐焗味'], P_NUT, ['坚果']);
snack('百草味', '夏威夷果', '坚果', '🥜', 22, ['奶油味', '原味', '盐焗味'], P_NUT, ['坚果']);
snack('百草味', '腰果', '坚果', '🥜', 25, ['原味', '炭烧味', '盐焗味'], P_NUT, ['坚果']);
snack('百草味', '巴旦木', '坚果', '🥜', 23, ['原味', '奶油味', '盐焗味'], P_NUT, ['坚果']);
snack('百草味', '开心果', '坚果', '🥜', 29, ['原味', '盐焗味', '炭烧味'], P_NUT, ['坚果']);
snack('百草味', '核桃', '坚果', '🌰', 20, ['原味', '奶油味', '蜂蜜味'], P_NUT, ['坚果']);
snack('百草味', '葡萄干', '果干', '🍇', 15, ['原味', '黑加仑', '玫瑰味'], P_NUT, ['果干']);
snack('洽洽', '香瓜子', '坚果', '🌻', 8, ['原味', '五香味', '焦糖味', '山核桃味'], [['单袋', 1], ['3袋装', 2.9], ['10袋整箱', 9.5]], ['炒货']);
snack('洽洽', '小黄袋每日坚果', '坚果', '🥜', 19, ['混合坚果', '原味'], [['14袋装', 1], ['30袋整箱', 2.1]], ['坚果']);
snack('洽洽', '怪味胡豆', '坚果', '🥜', 6, ['原味', '麻辣味'], [['单袋', 1], ['5袋装', 4.8]], ['炒货']);
snack('洽洽', '南瓜子', '坚果', '🎃', 9, ['原味', '五香味'], [['单袋', 1], ['3袋装', 2.9]], ['炒货']);
snack('沃隆', '每日坚果', '坚果', '🥜', 21, ['混合坚果', '儿童版'], [['21袋装', 1], ['30袋整箱', 1.4]], ['坚果']);
snack('沃隆', '碧根果', '坚果', '🥜', 25, ['奶油味', '原味'], [['单袋', 1], ['2袋装', 1.9]], ['坚果']);
snack('沃隆', '巴旦木', '坚果', '🥜', 24, ['原味', '盐焗味'], [['单袋', 1], ['2袋装', 1.9]], ['坚果']);

/* 肉干海苔辣条 */
snack('卫龙', '大面筋', '辣条', '🌶️', 3.5, ['经典麻辣', '微辣', '五香'], [['单包', 1], ['10包装', 9], ['20包整箱', 17]], ['辣条']);
snack('卫龙', '亲嘴烧', '辣条', '🌶️', 3, ['经典麻辣', '香辣', '酱香'], [['单包', 1], ['10包装', 9], ['20包整箱', 17]], ['辣条']);
snack('卫龙', '魔芋爽', '辣条', '🌶️', 3.5, ['香辣味', '酸辣味', '泡椒味'], [['单包', 1], ['10包装', 9], ['20包整箱', 17]], ['辣条']);
snack('卫龙', '小面筋', '辣条', '🌶️', 2.5, ['经典麻辣', '微辣'], [['单包', 1], ['10包装', 8]], ['辣条']);
snack('卫龙', '海带丝', '海味零食', '🥬', 3, ['香辣味', '酸辣味'], [['单包', 1], ['10包装', 8]], ['海味零食']);
snack('麻辣王子', '地道辣条', '辣条', '🌶️', 4, ['微辣', '很辣'], [['单包', 1], ['10包装', 9]], ['辣条']);
snack('良品铺子', '猪肉脯', '肉干', '🥩', 30, ['原味', '香辣味', '蜜汁味'], [['单袋', 1], ['2袋装', 1.9]], ['肉干']);
snack('良品铺子', '牛肉干', '肉干', '🥩', 45, ['五香味', '香辣味', '麻辣味'], [['单袋', 1], ['2袋装', 1.9]], ['肉干']);
snack('良品铺子', '鸭脖', '肉干', '🥩', 25, ['甜辣味', '麻辣味', '五香味'], [['单盒', 1], ['2盒装', 1.9]], ['卤味']);
snack('良品铺子', '鱿鱼丝', '海味零食', '🦑', 28, ['原味', '香辣味'], [['单袋', 1], ['2袋装', 1.9]], ['海味零食']);
snack('百草味', '猪肉脯', '肉干', '🥩', 28, ['原味', '香辣味', '蜜汁味'], [['单袋', 1], ['2袋装', 1.9]], ['肉干']);
snack('百草味', '牛肉干', '肉干', '🥩', 42, ['五香味', '香辣味', '麻辣味'], [['单袋', 1], ['2袋装', 1.9]], ['肉干']);
snack('百草味', '鸭脖', '肉干', '🥩', 23, ['甜辣味', '麻辣味', '五香味'], [['单盒', 1], ['2盒装', 1.9]], ['卤味']);
snack('百草味', '鱿鱼丝', '海味零食', '🦑', 26, ['原味', '香辣味'], [['单袋', 1], ['2袋装', 1.9]], ['海味零食']);
snack('海牌', '海苔', '海味零食', '🍘', 9, ['原味', '烧烤味', '辣味'], [['单包', 1], ['6包装', 5.5]], ['韩国零食']);
snack('波力', '海苔', '海味零食', '🍘', 12, ['原味', '芝麻味', '辣味'], [['单包', 1], ['6包装', 5.5]], ['海味零食']);
snack('老板仔', '海苔卷', '海味零食', '🍘', 15, ['原味', '辣味', '海鲜味'], [['单盒', 1], ['2盒装', 1.9]], ['泰国零食']);

/* 速食 */
snack('康师傅', '红烧牛肉面', '方便面', '🍜', 4.5, ['经典袋装', '桶装', '大食桶'], [['单份', 1], ['5连包', 4.6], ['整箱24份', 18]], ['方便面']);
snack('康师傅', '老坛酸菜牛肉面', '方便面', '🍜', 4.5, ['经典袋装', '桶装', '大食桶'], [['单份', 1], ['5连包', 4.6], ['整箱24份', 18]], ['方便面']);
snack('康师傅', '香辣牛肉面', '方便面', '🍜', 4.5, ['经典袋装', '桶装'], [['单份', 1], ['5连包', 4.6], ['整箱24份', 18]], ['方便面']);
snack('康师傅', '鲜虾鱼板面', '方便面', '🍜', 4.5, ['经典袋装', '桶装'], [['单份', 1], ['5连包', 4.6], ['整箱24份', 18]], ['方便面']);
snack('康师傅', '番茄鸡蛋牛肉面', '方便面', '🍜', 4.5, ['经典袋装', '桶装'], [['单份', 1], ['5连包', 4.6], ['整箱24份', 18]], ['方便面']);
snack('康师傅', '藤椒牛肉面', '方便面', '🍜', 4.5, ['经典袋装', '桶装'], [['单份', 1], ['5连包', 4.6], ['整箱24份', 18]], ['方便面']);
snack('统一', '来一桶红烧牛肉面', '方便面', '🍜', 5, ['红烧牛肉', '老坛酸菜', '香辣牛肉', '鲜虾鱼板'], [['单桶', 1], ['6桶装', 5.4], ['整箱24桶', 19]], ['方便面']);
snack('白象', '汤好喝方便面', '方便面', '🍜', 5, ['老母鸡汤', '猪骨汤', '番茄汤', '牛肉汤'], [['单袋', 1], ['5连包', 4.6], ['整箱24袋', 18]], ['方便面']);
snack('农心', '辛拉面', '方便面', '🍜', 6, ['原味', '黑版', '辣白菜'], [['单袋', 1], ['5连包', 4.6], ['整箱20袋', 16]], ['韩国方便面']);
snack('日清', '合味道', '方便面', '🍜', 8, ['海鲜味', '牛肉味', '咖喱味', '猪骨味'], [['单桶', 1], ['6桶装', 5.4]], ['日本方便面']);
snack('好欢螺', '螺蛳粉', '方便面', '🍜', 15, ['原味', '加辣加臭', '小龙虾味'], [['单袋', 1], ['3袋装', 2.8]], ['速食米粉']);
snack('李子柒', '螺蛳粉', '方便面', '🍜', 14, ['原味', '香辣味'], [['单袋', 1], ['3袋装', 2.8]], ['速食米粉']);
snack('自嗨锅', '自热火锅', '速食', '🍲', 29, ['麻辣牛肉', '番茄牛腩', '菌菇', '香辣肥牛'], [['单盒', 1], ['3盒装', 2.8]], ['自热食品']);
snack('莫小仙', '自热火锅', '速食', '🍲', 25, ['麻辣牛肉', '番茄牛腩', '菌菇'], [['单盒', 1], ['3盒装', 2.8]], ['自热食品']);

/* 冰淇淋 */
snack('哈根达斯', '冰淇淋', '冰淇淋', '🍦', 39, ['香草味', '草莓味', '巧克力味', '抹茶味', '夏威夷果味'], [['单杯', 1], ['4杯装', 3.7]], ['冰淇淋']);
snack('梦龙', '冰淇淋', '冰淇淋', '🍦', 12, ['香草味', '巧克力味', '白巧克力味', '抹茶味'], [['单支', 1], ['4支装', 3.7]], ['冰淇淋']);
snack('钟薛高', '雪糕', '冰淇淋', '🍦', 18, ['丝绒可可', '半半巧巧', '冲屿海盐', '小小雪糕'], [['单支', 1], ['4支装', 3.7]], ['冰淇淋']);
snack('光明', '冰砖', '冰淇淋', '🍦', 8, ['香草味', '巧克力味', '草莓味'], [['单块', 1], ['6块装', 5.5]], ['冰淇淋']);
snack('八喜', '冰淇淋', '冰淇淋', '🍦', 29, ['香草味', '巧克力味', '朗姆味', '绿茶味'], [['单杯', 1], ['3杯装', 2.8]], ['冰淇淋']);

/* 碳酸饮料 */
const P_CAN = [['330ml', 1], ['6罐装', 5.4], ['24罐整箱', 20]];
const P_BOTTLE = [['500ml', 1], ['6瓶装', 5.2], ['15瓶整箱', 12.5]];
snack('可口可乐', '可乐', '碳酸饮料', '🥤', 3.5, ['经典原味', '零度无糖', '纤维+', '香草味'], P_CAN, ['碳酸饮料']);
snack('百事可乐', '可乐', '碳酸饮料', '🥤', 3.5, ['经典原味', '无糖', '生可乐', '树莓味'], P_CAN, ['碳酸饮料']);
snack('雪碧', '汽水', '碳酸饮料', '🥤', 3.5, ['经典柠檬', '零糖', '黄瓜味', '水蜜桃味'], P_CAN, ['碳酸饮料']);
snack('芬达', '汽水', '碳酸饮料', '🥤', 3.5, ['橙味', '苹果味', '葡萄味', '草莓味'], P_CAN, ['碳酸饮料']);
snack('七喜', '汽水', '碳酸饮料', '🥤', 3.5, ['经典柠檬', '无糖'], P_CAN, ['碳酸饮料']);
snack('美年达', '汽水', '碳酸饮料', '🥤', 3.5, ['橙味', '苹果味', '葡萄味'], P_CAN, ['碳酸饮料']);
snack('元气森林', '气泡水', '碳酸饮料', '🫧', 5.5, ['白桃味', '青瓜味', '荔枝味', '葡萄味', '卡曼橘味', '可乐味'], [['480ml', 1], ['6瓶装', 5.2], ['15瓶整箱', 12.5]], ['气泡水']);
snack('北冰洋', '汽水', '碳酸饮料', '🥤', 6, ['橙味', '桔汁味', '酸梅味'], [['330ml', 1], ['6罐装', 5.4], ['24罐整箱', 20]], ['国货汽水']);
snack('冰峰', '汽水', '碳酸饮料', '🥤', 4.5, ['橙味', '酸梅味', '苹果味'], [['330ml', 1], ['6罐装', 5.4], ['24罐整箱', 20]], ['国货汽水']);

/* 茶饮果汁功能饮料 */
const P_TEA = [['500ml', 1], ['6瓶装', 5], ['15瓶整箱', 11.5]];
snack('农夫山泉', '东方树叶', '茶饮料', '🍵', 5.5, ['茉莉花茶', '绿茶', '红茶', '乌龙茶', '青柑普洱', '黑乌龙'], P_TEA, ['无糖茶饮']);
snack('三得利', '乌龙茶', '茶饮料', '🍵', 5, ['原味', '无糖', '茉莉味'], P_TEA, ['茶饮料']);
snack('康师傅', '冰红茶', '茶饮料', '🧃', 3.5, ['柠檬味', '蜜桃味', '劲凉味'], P_BOTTLE, ['茶饮料']);
snack('统一', '冰红茶', '茶饮料', '🧃', 3.5, ['柠檬味', '蜜桃味'], P_BOTTLE, ['茶饮料']);
snack('统一', '绿茶', '茶饮料', '🍵', 3.5, ['原味', '茉莉味'], P_BOTTLE, ['茶饮料']);
snack('王老吉', '凉茶', '功能饮料', '🧃', 4, ['经典红罐', '无糖版', '黑凉茶'], P_CAN, ['凉茶']);
snack('加多宝', '凉茶', '功能饮料', '🧃', 4, ['经典红罐', '金罐'], P_CAN, ['凉茶']);
snack('红牛', '能量饮料', '功能饮料', '⚡', 6, ['经典金罐', '无糖版'], P_CAN, ['能量饮料']);
snack('脉动', '维生素饮料', '功能饮料', '💧', 4.5, ['青柠味', '桃子味', '芒果味', '荔枝味'], P_BOTTLE, ['功能饮料']);
snack('佳得乐', '运动饮料', '功能饮料', '💪', 5, ['橙味', '柠檬味', '莓果味'], P_BOTTLE, ['运动饮料']);
snack('维他', '柠檬茶', '茶饮料', '🍋', 4.5, ['经典柠檬茶', '低糖', '蜜桃茶'], [['500ml', 1], ['6盒装', 4.8], ['24盒整箱', 18]], ['茶饮料']);
snack('农夫山泉', 'NFC 果汁', '果汁饮料', '🧃', 12, ['橙汁', '苹果汁', '葡萄汁', '芒果混合汁', '番茄汁', '胡萝卜汁'], [['300ml', 1], ['4瓶装', 3.7], ['12瓶整箱', 10.5]], ['NFC果汁']);
snack('汇源', '100%果汁', '果汁饮料', '🧃', 9, ['橙汁', '苹果汁', '葡萄汁', '桃汁', '猕猴桃汁'], [['500ml', 1], ['6盒装', 4.8], ['12盒整箱', 9.5]], ['果汁']);
snack('if', '椰子水', '果汁饮料', '🥥', 8, ['原味', '香芋味', '芒果味', '荔枝味'], [['350ml', 1], ['6瓶装', 4.8], ['12瓶整箱', 9.5]], ['椰子水']);
snack('椰树', '椰汁', '果汁饮料', '🥥', 6, ['经典原味', '无糖'], P_BOTTLE, ['椰汁']);
snack('信远斋', '酸梅汤', '果汁饮料', '🧃', 5, ['原味', '桂花味'], P_BOTTLE, ['酸梅汤']);

/* 咖啡 */
const P_BOXSM = [['单盒', 1], ['3盒装', 2.8], ['6盒装', 5.4]];
snack('雀巢', '速溶咖啡', '咖啡', '☕', 39, ['经典1+2', '特浓', '拿铁', '卡布奇诺'], P_BOXSM, ['速溶咖啡']);
snack('雀巢', '胶囊咖啡', '咖啡', '☕', 60, ['浓缩', '美式', '拿铁', '摩卡'], [['10颗装', 1], ['30颗装', 2.8]], ['胶囊咖啡']);
snack('星巴克', '星倍醇咖啡', '咖啡', '☕', 12, ['经典拿铁', '摩卡', '焦糖玛奇朵', '美式'], [['单罐', 1], ['6罐装', 5.4], ['12罐整箱', 10]], ['即饮咖啡']);
snack('星巴克', '咖啡豆', '咖啡', '☕', 99, ['派克市场', '佛罗娜', '埃塞俄比亚', '苏门答腊'], [['250g', 1], ['500g', 1.9]], ['咖啡豆']);
snack('瑞幸', '挂耳咖啡', '咖啡', '☕', 49, ['意式拼配', '云南豆', '耶加雪菲', '曼特宁'], [['10袋装', 1], ['30袋装', 2.8]], ['挂耳咖啡']);
snack('瑞幸', '冻干咖啡', '咖啡', '☕', 59, ['经典美式', '生椰拿铁', '厚乳拿铁', '黑糖拿铁'], [['18颗装', 1], ['36颗装', 1.9]], ['冻干咖啡']);
snack('三顿半', '超即溶咖啡', '咖啡', '☕', 89, ['1号浅烘', '3号中烘', '5号深烘', '冷萃'], [['12颗装', 1], ['24颗装', 1.9]], ['冻干咖啡']);
snack('永璞', '冷萃咖啡液', '咖啡', '☕', 69, ['经典冷萃', '蜜桃冷萃', '椰子冷萃'], [['10条装', 1], ['20条装', 1.9]], ['咖啡液']);
snack('隅田川', '挂耳咖啡', '咖啡', '☕', 39, ['意式', '巴西', '哥伦比亚', '曼特宁'], [['10袋装', 1], ['20袋装', 1.9]], ['挂耳咖啡']);
snack('牙买加', '蓝山咖啡豆', '咖啡', '☕', 299, ['蓝山1号', '蓝山拼配'], [['250g', 1], ['500g', 1.9]], ['蓝山咖啡']);

/* 乳品奶茶 */
snack('香飘飘', '奶茶', '奶茶', '🥤', 4, ['原味', '草莓味', '红豆味', '抹茶味'], [['单杯', 1], ['6杯装', 5.4], ['30杯整箱', 24]], ['冲泡奶茶']);
snack('阿萨姆', '奶茶', '奶茶', '🥤', 4.5, ['原味', '煎茶奶绿', '无糖'], P_BOTTLE, ['即饮奶茶']);
snack('旺仔', '牛奶', '乳品', '🥛', 4, ['经典原味', '低糖', '坚果味'], [['245ml', 1], ['6罐装', 5.4], ['12罐整箱', 10]], ['牛奶']);
snack('伊利', '纯牛奶', '乳品', '🥛', 3, ['全脂', '低脂', '脱脂'], [['250ml', 1], ['12盒装', 10.5], ['24盒整箱', 19]], ['牛奶']);
snack('蒙牛', '纯牛奶', '乳品', '🥛', 3, ['全脂', '低脂', '脱脂'], [['250ml', 1], ['12盒装', 10.5], ['24盒整箱', 19]], ['牛奶']);
snack('安慕希', '希腊酸奶', '乳品', '🥛', 6, ['原味', '蓝莓味', '黄桃味', '草莓味'], [['205g', 1], ['6盒装', 5.4], ['12盒整箱', 10]], ['酸奶']);

/* 啤酒红酒 */
snack('青岛啤酒', '经典啤酒', '啤酒', '🍺', 5, ['经典1903', '纯生', '白啤', '全麦白啤'], [['330ml', 1], ['6罐装', 5.4], ['24罐整箱', 20]], ['啤酒']);
snack('雪花', '啤酒', '啤酒', '🍺', 4, ['勇闯天涯', '纯生', '脸谱'], [['330ml', 1], ['6罐装', 5.4], ['24罐整箱', 20]], ['啤酒']);
snack('燕京', '啤酒', '啤酒', '🍺', 4, ['U8', '鲜啤', '纯生'], [['330ml', 1], ['6罐装', 5.4], ['24罐整箱', 20]], ['啤酒']);
snack('百威', '啤酒', '啤酒', '🍺', 5, ['经典', '纯生', '金尊'], [['330ml', 1], ['6罐装', 5.4], ['24罐整箱', 20]], ['啤酒']);
snack('科罗娜', '啤酒', '啤酒', '🍺', 8, ['经典', '无醇'], [['330ml', 1], ['6罐装', 5.4], ['24罐整箱', 20]], ['进口啤酒']);
snack('修道院', '精酿啤酒', '啤酒', '🍺', 25, ['白啤', 'IPA', '世涛', '果啤', '修道院四料', '小麦啤'], [['330ml', 1], ['6瓶装', 5.5]], ['精酿啤酒']);
snack('茅台', '酱香白酒', '白酒', '🍶', 1499, ['飞天53度', '精品', '生肖'], [['500ml', 1], ['2瓶装', 1.95]], ['白酒']);
snack('五粮液', '浓香白酒', '白酒', '🍶', 1099, ['普五第八代', '1618'], [['500ml', 1], ['2瓶装', 1.95]], ['白酒']);
snack('江小白', '清香白酒', '白酒', '🍶', 39, ['原味', '果味', '金盖'], [['500ml', 1], ['6瓶装', 5.5]], ['白酒']);
snack('张裕', '干红葡萄酒', '红酒', '🍷', 89, ['赤霞珠', '蛇龙珠', '解百纳', '雷司令'], [['750ml', 1], ['2瓶装', 1.95], ['6瓶整箱', 5.5]], ['红酒']);
snack('拉菲', '干红葡萄酒', '红酒', '🍷', 3999, ['传奇波尔多', '珍藏', '古堡'], [['750ml', 1], ['2瓶装', 1.95]], ['红酒']);
snack('奔富', '干红葡萄酒', '红酒', '🍷', 199, ['Bin 389', 'Bin 407', '蔻兰山'], [['750ml', 1], ['2瓶装', 1.95]], ['红酒']);
snack('长城', '干红葡萄酒', '红酒', '🍷', 59, ['赤霞珠', '解百纳', '五星干红'], [['750ml', 1], ['2瓶装', 1.95]], ['红酒']);

/* 水 */
snack('农夫山泉', '饮用水', '饮用水', '💧', 2, ['普通装', '天然矿泉水', '泡茶水'], [['550ml', 1], ['12瓶装', 10.5], ['24瓶整箱', 19]], ['饮用水']);
snack('依云', '矿泉水', '饮用水', '💧', 8, ['原味', '气韵', '果味'], [['330ml', 1], ['6瓶装', 5.5], ['12瓶整箱', 10]], ['进口水']);
snack('百岁山', '矿泉水', '饮用水', '💧', 3, ['经典', '天然矿泉水'], [['570ml', 1], ['12瓶装', 10.5], ['24瓶整箱', 19]], ['饮用水']);
snack('巴黎水', '气泡矿泉水', '饮用水', '🫧', 9, ['原味', '柠檬味', '青柠味', '葡萄柚味'], [['330ml', 1], ['6瓶装', 5.5], ['12瓶整箱', 10]], ['气泡水']);

/* 茶叶 */
const teaPacks = [['100g', 1], ['250g', 2.3], ['礼盒装', 4.5]];
snack('西湖', '龙井茶', '茶叶', '🍃', 120, ['明前特级', '雨前一级', '群体种'], teaPacks, ['绿茶']);
snack('碧螺春', '绿茶', '茶叶', '🍃', 90, ['特级', '一级'], teaPacks, ['绿茶']);
snack('大益', '普洱茶', '茶叶', '🍃', 180, ['7572熟茶', '7542生茶', '金大益'], teaPacks, ['普洱茶']);
snack('八马', '铁观音', '茶叶', '🍃', 150, ['清香型', '浓香型', '陈香型'], teaPacks, ['乌龙茶']);
snack('武夷星', '大红袍', '茶叶', '🍃', 200, ['特级', '一级', '肉桂'], teaPacks, ['乌龙茶']);
snack('品品香', '白茶', '茶叶', '🍃', 160, ['白毫银针', '白牡丹', '寿眉'], teaPacks, ['白茶']);
snack('张一元', '茉莉花茶', '茶叶', '🍃', 100, ['特级', '一级', '白雪香'], teaPacks, ['花茶']);

/* 进口零食 */
snack('东京香蕉', '香蕉蛋糕', '糕点', '🍰', 45, ['原味', '巧克力味', '焦糖味'], [['8枚装', 1], ['16枚装', 1.9]], ['日本零食']);
snack('悠哈', '味觉糖', '糖果', '🍬', 15, ['葡萄味', '草莓味', '芒果味', '白桃味'], [['单袋', 1], ['3袋装', 2.8]], ['日本糖果']);
snack('森永', '制果', '饼干', '🍪', 18, ['牛奶味', '巧克力味', '抹茶味'], [['单盒', 1], ['2盒装', 1.9]], ['日本零食']);
snack('农心', '虾条', '膨化食品', '🦐', 6, ['原味', '辣味', '烤虾味'], [['单袋', 1], ['3袋装', 2.8]], ['韩国零食']);
snack('好丽友', '蜂蜜黄油薯片', '薯片', '🍟', 9, ['原味', '蜂蜜黄油味', '芝士味'], [['单袋', 1], ['3袋装', 2.8]], ['韩国零食']);
snack('蜂蜜黄油', '杏仁', '坚果', '🥜', 19, ['原味', '蜂蜜黄油味', '芥末味', '辣味'], [['单袋', 1], ['3袋装', 2.8]], ['韩国坚果']);
snack('泰国', '芒果干', '果干', '🥭', 19, ['原味', '甜辣味'], [['单袋', 1], ['3袋装', 2.8]], ['泰国零食']);
snack('泰国', '椰子片', '果干', '🥥', 15, ['原味', '椰糖味'], [['单袋', 1], ['3袋装', 2.8]], ['泰国零食']);
snack('泰国', '榴莲干', '果干', '🍈', 35, ['原味', '金枕头'], [['单袋', 1], ['2袋装', 1.9]], ['泰国零食']);
snack('Knoppers', '威化饼干', '饼干', '🍪', 29, ['牛奶榛子味', '椰子味'], [['10条装', 1], ['24条装', 2.2]], ['德国零食']);
snack('健达', '奇趣蛋', '糖果', '🥚', 12, ['男孩版', '女孩版', '海底世界'], [['单颗', 1], ['3颗装', 2.8]], ['进口糖果']);

/* ==================== 生鲜水果 ==================== */
function fruitLine(name, sub, emoji, perJin, specs, tags) {
  for (const [spec, mult] of specs) {
    addItem(`${name} ${spec}`, 'fresh', sub, perJin * mult, emoji, tags);
  }
}

const F5 = [['2斤装', 2], ['3斤装', 2.9], ['5斤装', 4.8], ['10斤装', 9.4], ['礼盒装', 6.2]];
const F4 = [['2斤装', 2], ['3斤装', 2.9], ['5斤装', 4.8], ['10斤装', 9.4]];
const F3 = [['2斤装', 2], ['3斤装', 2.9], ['5斤装', 4.8]];
const F2 = [['2斤装', 2], ['礼盒装', 3.8]];

fruitLine('山东红富士苹果', '苹果', '🍎', 8, F5, ['苹果', '红富士', '山东', '水果']);
fruitLine('陕西洛川红富士苹果', '苹果', '🍎', 9, F5, ['苹果', '红富士', '洛川', '水果']);
fruitLine('新疆阿克苏冰糖心苹果', '苹果', '🍎', 12, F5, ['苹果', '阿克苏', '冰糖心', '水果']);
fruitLine('甘肃天水花牛苹果', '苹果', '🍎', 10, F5, ['苹果', '花牛', '甘肃', '水果']);
fruitLine('山东青苹果', '苹果', '🍏', 6, F4, ['苹果', '青苹果', '山东', '水果']);
fruitLine('美国蛇果', '苹果', '🍎', 15, F3, ['苹果', '蛇果', '进口水果']);
fruitLine('新西兰爱妃苹果', '苹果', '🍎', 18, F3, ['苹果', '爱妃', '进口水果']);
fruitLine('日本阳光富士苹果', '苹果', '🍎', 25, F3, ['苹果', '阳光富士', '进口水果']);

fruitLine('国产香蕉', '香蕉', '🍌', 3, F4, ['香蕉', '国产', '水果']);
fruitLine('进口香蕉', '香蕉', '🍌', 4, F4, ['香蕉', '进口水果']);
fruitLine('广西小米蕉', '香蕉', '🍌', 6, F3, ['香蕉', '小米蕉', '广西', '水果']);
fruitLine('海南芭蕉', '香蕉', '🍌', 5, F3, ['香蕉', '芭蕉', '海南', '水果']);
fruitLine('红皮香蕉', '香蕉', '🍌', 8, F2, ['香蕉', '红皮香蕉', '进口水果']);

fruitLine('江西赣南脐橙', '橙子', '🍊', 5, F5, ['橙子', '脐橙', '赣南', '水果']);
fruitLine('湖北秭归脐橙', '橙子', '🍊', 5, F5, ['橙子', '脐橙', '秭归', '水果']);
fruitLine('四川爱媛38号果冻橙', '橙子', '🍊', 9, F4, ['橙子', '爱媛', '果冻橙', '水果']);
fruitLine('湖南冰糖橙', '橙子', '🍊', 6, F4, ['橙子', '冰糖橙', '湖南', '水果']);
fruitLine('四川塔罗科血橙', '橙子', '🍊', 7, F4, ['橙子', '血橙', '四川', '水果']);
fruitLine('澳洲脐橙', '橙子', '🍊', 12, F3, ['橙子', '澳洲', '进口水果']);
fruitLine('云南褚橙', '橙子', '🍊', 10, F4, ['橙子', '褚橙', '云南', '水果']);
fruitLine('南非橙', '橙子', '🍊', 8, F3, ['橙子', '南非', '进口水果']);

fruitLine('广西沃柑', '柑橘', '🍊', 6, F5, ['柑橘', '沃柑', '广西', '水果']);
fruitLine('四川耙耙柑', '柑橘', '🍊', 8, F5, ['柑橘', '耙耙柑', '四川', '水果']);
fruitLine('四会砂糖橘', '柑橘', '🍊', 6, F4, ['柑橘', '砂糖橘', '广东', '水果']);
fruitLine('茂谷柑', '柑橘', '🍊', 8, F4, ['柑橘', '茂谷柑', '水果']);
fruitLine('四川不知火丑橘', '柑橘', '🍊', 7, F4, ['柑橘', '丑橘', '四川', '水果']);
fruitLine('融安金桔', '柑橘', '🍊', 9, F3, ['金桔', '融安', '水果']);

fruitLine('8424麒麟西瓜', '西瓜', '🍉', 1, [['1个装', 25], ['2个装', 45], ['整箱4个', 85]], ['西瓜', '麒麟瓜', '水果']);
fruitLine('宁夏硒砂瓜', '西瓜', '🍉', 1, [['1个装', 35], ['2个装', 62]], ['西瓜', '硒砂瓜', '宁夏', '水果']);
fruitLine('黑美人西瓜', '西瓜', '🍉', 1, [['1个装', 20], ['2个装', 36]], ['西瓜', '黑美人', '水果']);
fruitLine('无籽西瓜', '西瓜', '🍉', 1, [['1个装', 28], ['2个装', 50]], ['西瓜', '无籽西瓜', '水果']);
fruitLine('特小凤西瓜', '西瓜', '🍉', 1, [['1个装', 15], ['2个装', 28]], ['西瓜', '特小凤', '水果']);

fruitLine('云南阳光玫瑰葡萄', '葡萄', '🍇', 15, F4, ['葡萄', '阳光玫瑰', '云南', '水果']);
fruitLine('巨峰葡萄', '葡萄', '🍇', 7, F4, ['葡萄', '巨峰', '水果']);
fruitLine('夏黑葡萄', '葡萄', '🍇', 8, F4, ['葡萄', '夏黑', '水果']);
fruitLine('红提', '葡萄', '🍇', 9, F4, ['提子', '红提', '水果']);
fruitLine('青提', '葡萄', '🍇', 10, F4, ['提子', '青提', '水果']);
fruitLine('玫瑰香葡萄', '葡萄', '🍇', 11, F3, ['葡萄', '玫瑰香', '水果']);
fruitLine('日本晴王葡萄', '葡萄', '🍇', 120, F2, ['葡萄', '晴王', '进口水果']);
fruitLine('新疆无核白葡萄', '葡萄', '🍇', 9, F4, ['葡萄', '无核白', '新疆', '水果']);

fruitLine('丹东99草莓', '草莓', '🍓', 25, F3, ['草莓', '丹东99', '水果']);
fruitLine('红颜草莓', '草莓', '🍓', 22, F3, ['草莓', '红颜', '水果']);
fruitLine('奶油草莓', '草莓', '🍓', 18, F3, ['草莓', '奶油草莓', '水果']);
fruitLine('白草莓', '草莓', '🍓', 60, F2, ['草莓', '白草莓', '水果']);

fruitLine('云南蓝莓', '蓝莓', '🫐', 30, F3, ['蓝莓', '云南', '水果']);
fruitLine('怡颗莓蓝莓', '蓝莓', '🫐', 45, F3, ['蓝莓', '怡颗莓', '进口水果']);
fruitLine('智利进口蓝莓', '蓝莓', '🫐', 50, F3, ['蓝莓', '智利', '进口水果']);
fruitLine('野生蓝莓', '蓝莓', '🫐', 60, F2, ['蓝莓', '野生', '水果']);

fruitLine('智利车厘子 JJ级', '樱桃', '🍒', 55, F3, ['车厘子', '智利', 'JJ级', '进口水果']);
fruitLine('智利车厘子 JJJ级', '樱桃', '🍒', 75, F3, ['车厘子', '智利', 'JJJ级', '进口水果']);
fruitLine('新西兰车厘子', '樱桃', '🍒', 120, F2, ['车厘子', '新西兰', '进口水果']);
fruitLine('大连美早樱桃', '樱桃', '🍒', 45, F3, ['樱桃', '美早', '大连', '水果']);
fruitLine('山东红灯樱桃', '樱桃', '🍒', 35, F3, ['樱桃', '红灯', '山东', '水果']);

fruitLine('海南台农芒', '芒果', '🥭', 8, F4, ['芒果', '台农', '海南', '水果']);
fruitLine('广西贵妃芒', '芒果', '🥭', 9, F4, ['芒果', '贵妃芒', '广西', '水果']);
fruitLine('凯特芒', '芒果', '🥭', 8, F4, ['芒果', '凯特芒', '水果']);
fruitLine('金煌芒', '芒果', '🥭', 10, F4, ['芒果', '金煌芒', '水果']);
fruitLine('小台芒', '芒果', '🥭', 11, F3, ['芒果', '小台芒', '水果']);
fruitLine('泰国青芒', '芒果', '🥭', 15, F3, ['芒果', '青芒', '泰国', '进口水果']);

fruitLine('泰国金枕榴莲', '榴莲', '🍈', 1, [['1个装', 160], ['2个装', 300], ['整箱装', 560]], ['榴莲', '金枕', '泰国', '水果']);
fruitLine('马来西亚猫山王榴莲', '榴莲', '🍈', 1, [['1个装', 320], ['2个装', 600]], ['榴莲', '猫山王', '马来西亚', '进口水果']);
fruitLine('黑刺榴莲', '榴莲', '🍈', 1, [['1个装', 500], ['礼盒装', 800]], ['榴莲', '黑刺', '进口水果']);
fruitLine('干尧榴莲', '榴莲', '🍈', 1, [['1个装', 180], ['2个装', 340]], ['榴莲', '干尧', '水果']);
fruitLine('冷冻榴莲肉', '榴莲', '🍈', 1, [['1盒装', 80], ['3盒装', 220]], ['榴莲', '冷冻榴莲肉', '水果']);

fruitLine('泰国5A山竹', '山竹', '🟣', 30, F2, ['山竹', '5A', '泰国', '水果']);
fruitLine('泰国4A山竹', '山竹', '🟣', 26, F2, ['山竹', '4A', '泰国', '水果']);
fruitLine('泰国3A山竹', '山竹', '🟣', 22, F2, ['山竹', '3A', '泰国', '水果']);

fruitLine('红心火龙果', '火龙果', '🩷', 10, F3, ['火龙果', '红心', '水果']);
fruitLine('白心火龙果', '火龙果', '⚪', 8, F3, ['火龙果', '白心', '水果']);
fruitLine('燕窝果', '火龙果', '🟡', 35, F2, ['火龙果', '燕窝果', '水果']);

fruitLine('陕西徐香猕猴桃', '猕猴桃', '🥝', 12, F4, ['猕猴桃', '徐香', '陕西', '水果']);
fruitLine('翠香猕猴桃', '猕猴桃', '🥝', 14, F4, ['猕猴桃', '翠香', '水果']);
fruitLine('红阳猕猴桃', '猕猴桃', '🥝', 16, F4, ['猕猴桃', '红阳', '水果']);
fruitLine('新西兰金果', '猕猴桃', '🥝', 35, F3, ['猕猴桃', '金果', '新西兰', '进口水果']);
fruitLine('新西兰绿果', '猕猴桃', '🥝', 28, F3, ['猕猴桃', '绿果', '新西兰', '进口水果']);

fruitLine('库尔勒香梨', '梨', '🍐', 8, F5, ['梨', '库尔勒', '香梨', '水果']);
fruitLine('秋月梨', '梨', '🍐', 9, F5, ['梨', '秋月梨', '水果']);
fruitLine('雪花梨', '梨', '🍐', 5, F4, ['梨', '雪花梨', '水果']);
fruitLine('皇冠梨', '梨', '🍐', 6, F4, ['梨', '皇冠梨', '水果']);
fruitLine('砀山酥梨', '梨', '🍐', 5, F4, ['梨', '砀山酥梨', '水果']);

fruitLine('阳山水蜜桃', '桃', '🍑', 15, F3, ['桃', '水蜜桃', '阳山', '水果']);
fruitLine('油桃', '桃', '🍑', 8, F3, ['桃', '油桃', '水果']);
fruitLine('黄桃', '桃', '🍑', 9, F3, ['桃', '黄桃', '水果']);
fruitLine('蟠桃', '桃', '🍑', 12, F2, ['桃', '蟠桃', '水果']);

fruitLine('贵州蜂糖李', '李子', '🟣', 20, F3, ['李子', '蜂糖李', '贵州', '水果']);
fruitLine('青脆李', '李子', '🟢', 10, F3, ['李子', '青脆李', '水果']);
fruitLine('新疆西梅', '李子', '🟣', 18, F3, ['西梅', '新疆', '水果']);

fruitLine('妃子笑荔枝', '荔枝', '🍒', 12, F3, ['荔枝', '妃子笑', '水果']);
fruitLine('桂味荔枝', '荔枝', '🍒', 18, F3, ['荔枝', '桂味', '水果']);
fruitLine('糯米糍荔枝', '荔枝', '🍒', 20, F3, ['荔枝', '糯米糍', '水果']);
fruitLine('白糖罂荔枝', '荔枝', '🍒', 15, F3, ['荔枝', '白糖罂', '水果']);

fruitLine('石硖龙眼', '龙眼', '🟤', 10, F3, ['龙眼', '石硖', '水果']);
fruitLine('泰国龙眼', '龙眼', '🟤', 12, F3, ['龙眼', '泰国', '进口水果']);

fruitLine('泰国椰青', '椰子', '🥥', 1, [['2个装', 24], ['6个装', 68], ['整箱9个', 100]], ['椰子', '椰青', '泰国', '水果']);
fruitLine('海南椰青', '椰子', '🥥', 1, [['2个装', 20], ['6个装', 56], ['整箱9个', 82]], ['椰子', '椰青', '海南', '水果']);
fruitLine('椰皇', '椰子', '🥥', 1, [['2个装', 36], ['6个装', 100]], ['椰子', '椰皇', '进口水果']);

fruitLine('墨西哥牛油果', '牛油果', '🥑', 15, F2, ['牛油果', '墨西哥', '进口水果']);
fruitLine('智利牛油果', '牛油果', '🥑', 14, F2, ['牛油果', '智利', '进口水果']);
fruitLine('国产牛油果', '牛油果', '🥑', 12, F2, ['牛油果', '国产', '水果']);

fruitLine('安岳黄柠檬', '柠檬', '🍋', 6, F2, ['柠檬', '安岳', '水果']);
fruitLine('香水柠檬', '柠檬', '🍋', 10, F2, ['柠檬', '香水柠檬', '水果']);
fruitLine('青柠', '柠檬', '🍋', 8, F2, ['柠檬', '青柠', '水果']);

fruitLine('紫皮百香果', '百香果', '🟣', 10, F2, ['百香果', '紫皮', '水果']);
fruitLine('黄金百香果', '百香果', '🟡', 15, F2, ['百香果', '黄金', '水果']);

fruitLine('突尼斯软籽石榴', '石榴', '🔴', 15, F3, ['石榴', '软籽', '突尼斯', '水果']);
fruitLine('会理石榴', '石榴', '🔴', 10, F3, ['石榴', '会理', '水果']);
fruitLine('石榴礼盒', '石榴', '🎁', 30, [['6个装', 1], ['8个装', 1.3], ['12个装', 1.9]], ['石榴', '礼盒', '水果']);

fruitLine('阳丰甜柿', '柿子', '🟠', 7, F3, ['柿子', '甜柿', '水果']);
fruitLine('富平柿饼', '柿子', '🟠', 30, F2, ['柿饼', '富平', '陕西']);

fruitLine('仙居杨梅', '杨梅', '🟣', 35, F2, ['杨梅', '仙居', '水果']);
fruitLine('东魁杨梅', '杨梅', '🟣', 40, F2, ['杨梅', '东魁', '水果']);
fruitLine('苏州枇杷', '枇杷', '🟡', 25, F2, ['枇杷', '苏州', '水果']);
fruitLine('蒙自枇杷', '枇杷', '🟡', 20, F2, ['枇杷', '蒙自', '水果']);
fruitLine('威海无花果', '无花果', '🟣', 25, F2, ['无花果', '威海', '水果']);
fruitLine('进口无花果', '无花果', '🟣', 35, F2, ['无花果', '进口水果']);

fruitLine('新疆哈密瓜', '甜瓜', '🍈', 1, [['1个装', 25], ['2个装', 45], ['整箱4个', 85]], ['哈密瓜', '新疆', '水果']);
fruitLine('甘肃蜜瓜', '甜瓜', '🍈', 1, [['1个装', 20], ['2个装', 36], ['整箱4个', 68]], ['蜜瓜', '甘肃', '水果']);
fruitLine('海南香瓜', '甜瓜', '🍈', 1, [['2斤装', 12], ['5斤装', 28], ['整箱装', 45]], ['香瓜', '海南', '水果']);
fruitLine('网纹瓜', '甜瓜', '🍈', 1, [['1个装', 36], ['2个装', 66]], ['网纹瓜', '水果']);

fruitLine('海南菠萝', '菠萝', '🍍', 1, [['1个装', 12], ['2个装', 22], ['整箱6个', 60]], ['菠萝', '海南', '水果']);
fruitLine('泰国小菠萝', '菠萝', '🍍', 1, [['3个装', 24], ['6个装', 45]], ['菠萝', '泰国', '进口水果']);
fruitLine('台湾凤梨', '菠萝', '🍍', 1, [['1个装', 25], ['2个装', 46]], ['凤梨', '台湾', '水果']);

fruitLine('泰国释迦', '释迦', '🟢', 25, F2, ['释迦', '泰国', '进口水果']);
fruitLine('台湾释迦', '释迦', '🟢', 30, F2, ['释迦', '台湾', '水果']);
fruitLine('泰国莲雾', '莲雾', '🔴', 22, F2, ['莲雾', '泰国', '进口水果']);
fruitLine('海南莲雾', '莲雾', '🔴', 18, F2, ['莲雾', '海南', '水果']);
fruitLine('泰国红毛丹', '红毛丹', '🔴', 18, F2, ['红毛丹', '泰国', '进口水果']);
fruitLine('越南红毛丹', '红毛丹', '🔴', 15, F2, ['红毛丹', '越南', '进口水果']);
fruitLine('甘肃人参果', '人参果', '🟡', 12, F2, ['人参果', '甘肃', '水果']);
fruitLine('云南人参果', '人参果', '🟡', 10, F2, ['人参果', '云南', '水果']);
fruitLine('台湾芭乐', '芭乐', '🟢', 15, F2, ['芭乐', '台湾', '水果']);
fruitLine('泰国芭乐', '芭乐', '🟢', 12, F2, ['芭乐', '泰国', '进口水果']);
fruitLine('杨桃', '杨桃', '⭐', 10, F2, ['杨桃', '水果']);
fruitLine('桑葚', '桑葚', '🟣', 18, F2, ['桑葚', '水果']);
fruitLine('山楂', '山楂', '🔴', 8, F2, ['山楂', '水果']);
fruitLine('冬枣', '枣', '🟤', 15, F3, ['冬枣', '水果']);
fruitLine('新疆红枣', '枣', '🟤', 20, F3, ['红枣', '新疆', '水果']);
fruitLine('无籽红提', '葡萄', '🍇', 14, F3, ['提子', '无籽红提', '水果']);
fruitLine('甘蔗', '甘蔗', '🎋', 1, [['5斤装', 15], ['10斤装', 28]], ['甘蔗', '水果']);
fruitLine('菱角', '菱角', '🌰', 10, F2, ['菱角', '水生']);
fruitLine('板栗', '板栗', '🌰', 12, F2, ['板栗', '坚果']);

/* 生鲜其他 */
const freshOther = [
  ['农家散养土鸡蛋 30枚', 39, '🥚', '鸡蛋'], ['可生食鲜鸡蛋 30枚', 55, '🥚', '鸡蛋'],
  ['鹌鹑蛋 50枚', 25, '🥚', '蛋类'], ['阳澄湖大闸蟹 8只礼盒', 688, '🦀', '水产'],
  ['梭子蟹 4只装', 168, '🦀', '水产'], ['挪威三文鱼刺身 500g', 129, '🐟', '水产'],
  ['冷冻大虾 2斤装', 99, '🦐', '水产'], ['澳洲牛排 10片装', 199, '🥩', '肉类'],
  ['内蒙古羔羊肉卷 2斤', 89, '🥩', '肉类'], ['有机蔬菜礼盒 12种', 128, '🥬', '蔬菜'],
  ['云南小番茄 3斤', 29, '🍅', '蔬菜'], ['水果黄瓜 5斤', 25, '🥒', '蔬菜'],
  ['有机胡萝卜 5斤', 22, '🥕', '蔬菜'], ['新鲜西兰花 3斤', 26, '🥦', '蔬菜'],
  ['东北黏玉米 10根', 39, '🌽', '蔬菜'], ['山东蜜薯 5斤', 25, '🍠', '蔬菜'],
  ['新鲜香菇 2斤', 19, '🍄', '菌菇'], ['金针菇 10包', 25, '🍄', '菌菇'],
  ['商务果篮 精选装', 399, '🧺', '果篮'], ['进口果篮 豪华装', 699, '🧺', '果篮'],
  ['时令水果礼盒 8种', 299, '🎁', '果篮'], ['儿童每日水果盒 7盒', 129, '🍱', '果切'],
  ['办公室下午茶果盒 10盒', 199, '🍱', '果切']
];
for (const [n, price, emoji, sub] of freshOther) {
  addItem(n, 'fresh', sub, price, emoji, [n, sub, '生鲜']);
}

/* ==================== 玩具潮玩 ==================== */
const popSeries = [
  'Molly 星座系列', 'SKULL PANDA 密林古堡', 'DIMOO 太空旅行', 'LABUBU 精灵野外',
  'Hirono 小野日记', 'CRYBABY 哭泣宝贝', '小甜豆 甜品屋', 'Zsiga 森林派对',
  'PUCKY 精灵花园', 'BOBO 星球漫游', 'MEGA 珍藏系列', '星星人 星际奇遇'
];
const boxChars = ['白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座', '摩羯座', '水瓶座', '双鱼座'];
for (const series of popSeries) {
  for (const ch of boxChars) {
    addItem(`泡泡玛特 ${series} ${ch}`, 'toys', '盲盒', 69, '📦', ['泡泡玛特', '盲盒', series, ch, '潮玩']);
  }
  addItem(`泡泡玛特 ${series} 隐藏款`, 'toys', '盲盒', 299, '✨', ['泡泡玛特', '盲盒', series, '隐藏款', '潮玩']);
}

const legoSets = [
  ['城市系列 消防救援车', 60374, 499], ['城市系列 警车巡逻', 60312, 199],
  ['城市系列 客运飞机', 60367, 999], ['城市系列 港口起重机', 60408, 699],
  ['城市系列 火车站', 60335, 1099], ['城市系列 太空发射中心', 60350, 1299],
  ['科技系列 兰博基尼 Revuelto', 42162, 1599], ['科技系列 布加迪 Chiron', 42083, 2999],
  ['科技系列 保时捷 911', 42064, 1299], ['科技系列 迈凯伦 F1', 42141, 1599],
  ['科技系列 重型挖掘机', 42100, 3999], ['科技系列 起重机', 42146, 2999],
  ['星球大战 千年隼', 75375, 899], ['星球大战 X翼战机', 75373, 649],
  ['星球大战 帝国歼星舰', 75356, 5999], ['星球大战 卢克光剑', 75370, 999],
  ['哈利波特 霍格沃茨城堡', 71043, 3999], ['哈利波特 魔法马车', 76400, 299],
  ['哈利波特 分院帽', 76401, 199], ['哈利波特 对角巷', 76444, 2999],
  ['好朋友系列 海滨别墅', 41709, 799], ['好朋友系列 森林小屋', 41707, 599],
  ['好朋友系列 马术中心', 41746, 699], ['好朋友系列 心湖城医院', 41744, 899],
  ['忍者系列 幻影忍者城市', 71741, 2999], ['忍者系列 命运赏赐号', 71797, 1899],
  ['创意百变系列 深海潜艇', 31100, 199], ['创意百变系列 宇宙飞船', 31117, 299],
  ['建筑系列 埃菲尔铁塔', 10307, 3999], ['建筑系列 悉尼歌剧院', 10234, 2999],
  ['建筑系列 上海天际线', 21039, 599], ['建筑系列 罗马斗兽场', 10276, 3999],
  ['超级赛车系列 法拉利 SF90', 76995, 199], ['超级赛车系列 保时捷 963', 76993, 199],
  ['漫威系列 号角日报社', 76178, 2999], ['漫威系列 复联大厦', 76269, 3999],
  ['植物系列 花束', 10280, 499], ['植物系列 兰花', 10311, 399],
  ['植物系列 迷你盆栽', 10329, 399], ['植物系列 樱花', 40725, 299],
  ['ideas 系列 打字机', 21327, 1999], ['ideas 系列 钢琴', 21323, 2999],
  ['ideas 系列 地球仪', 21332, 1999], ['ideas 系列 梵高星月夜', 21333, 1299],
  ['得宝系列 大颗粒积木箱', 10913, 399], ['得宝系列 创意入门盒', 10914, 199],
  ['方头仔系列 皮卡丘', 40561, 99], ['方头仔系列 小黄人', 40573, 99],
  ['艺术系列 蒙娜丽莎', 31198, 999], ['艺术系列 神奈川冲浪里', 31208, 1299]
];
for (const [n, num, price] of legoSets) {
  addItem(`乐高 ${n} ${num}`, 'toys', '积木', price, '🧱', ['乐高', '积木', n, String(num)]);
}
for (const [brand, series, price] of [
  ['森宝', '流浪地球 运载车', 199], ['森宝', '流浪地球 空间站', 299], ['森宝', '山东舰航母', 899],
  ['森宝', '歼20战斗机', 399], ['布鲁可', '变形金刚 擎天柱', 299], ['布鲁可', '奥特曼 赛罗', 199],
  ['布鲁可', '火影忍者 鸣人', 249], ['启蒙', '警察总局', 299], ['启蒙', '航天发射中心', 399],
  ['邦宝', '益智大颗粒积木', 159]
]) {
  addItem(`${brand} ${series}`, 'toys', '积木', price, '🧱', [brand, '积木', series]);
}

const figures = [
  ['万代 MG 高达 自由2.0', 280, '🤖'], ['万代 MG 高达 强 nu', 320, '🤖'],
  ['万代 RG 高达 独角兽', 260, '🤖'], ['万代 PG 高达 强袭', 880, '🤖'],
  ['万代 HG 高达 风灵', 120, '🤖'], ['万代 METAL BUILD 强袭自由', 2200, '🤖'],
  ['万代 龙珠 孙悟空 超赛', 320, '💥'], ['万代 龙珠 贝吉塔', 320, '💥'],
  ['万代 海贼王 路飞 五档', 380, '🏴‍☠️'], ['万代 海贼王 索隆', 340, '🏴‍☠️'],
  ['万代 火影忍者 鸣人', 360, '🍥'], ['万代 奥特曼 迪迦', 280, '🦸'],
  ['万代 EVA 初号机', 480, '🤖'], ['寿屋 EVA 二号机', 520, '🤖'],
  ['ALTER 舰队Collection 岛风', 480, '⚓'], ['GSC 初音未来 交响乐', 520, '🎤'],
  ['GSC 粘土人 初音未来', 280, '🎤'], ['GSC 粘土人 哈利波特', 320, '🧙'],
  ['Hot Toys 钢铁侠 MK50', 1800, '🦾'], ['Hot Toys 美国队长', 1600, '🛡️'],
  ['Hot Toys 蜘蛛侠 英雄无归', 1900, '🕷️'], ['Threezero 变形金刚 擎天柱', 2400, '🚛'],
  ['Prime 1 Studio 哥斯拉', 6800, '🦖'], ['Sideshow 蝙蝠侠 雕像', 3800, '🦇'],
  ['泡泡玛特 MEGA 珍藏 400% Molly', 599, '🎨']
];
for (const [n, price, emoji] of figures) {
  addItem(`${n} 普通版`, 'toys', '手办', price, emoji, [n, '手办', '模型']);
  addItem(`${n} 限定版`, 'toys', '手办', price * 1.35, emoji, [n, '手办', '限定']);
}

const djiModels = [
  ['大疆 Mini 4 Pro', 4788, '🚁'], ['大疆 Mini 4K', 1999, '🚁'],
  ['大疆 Air 3S', 6988, '🚁'], ['大疆 Air 3', 6988, '🚁'],
  ['大疆 Mavic 3 Pro', 13888, '🚁'], ['大疆 Mavic 3 Classic', 10888, '🚁'],
  ['大疆 Mavic 4 Pro', 18888, '🚁'], ['大疆 Avata 2', 2988, '🚁'],
  ['大疆 Neo', 1299, '🚁'], ['大疆 Flip', 2999, '🚁'],
  ['大疆 Phantom 4 Pro', 12888, '🚁'], ['大疆 Inspire 3', 28888, '🚁']
];
for (const [n, price, emoji] of djiModels) {
  addItem(`${n} 单机版`, 'toys', '无人机', price, emoji, [n, '无人机', '航拍']);
  addItem(`${n} 畅飞套装`, 'toys', '无人机', Math.round(price * 1.35), emoji, [n, '无人机', '套装']);
}
for (const [n, price] of [
  ['遥控越野车 1:10', 199], ['遥控攀爬车 1:8', 399], ['遥控漂移车 1:16', 129],
  ['遥控挖掘机', 159], ['遥控坦克', 259], ['遥控摩托', 149],
  ['遥控快艇', 189], ['遥控潜艇', 229], ['遥控飞机 特技版', 269],
  ['遥控机器人 编程版', 399], ['遥控恐龙', 179], ['遥控特技车 360度', 219]
]) {
  addItem(n, 'toys', '遥控玩具', price, '🎮', [n, '遥控玩具']);
}

for (const [n, price] of [
  ['宝可梦 集换式卡牌 补充包', 30], ['宝可梦 卡牌 礼盒装', 199], ['宝可梦 卡牌 精英训练家盒', 399],
  ['游戏王 补充包', 35], ['游戏王 预组卡组', 99], ['游戏王 25周年礼盒', 599],
  ['奥特曼 卡牌 豪华版', 60], ['奥特曼 卡牌 传奇版', 120], ['奥特曼 卡牌 星云版', 180],
  ['NBA 球星卡 盒装', 299], ['龙珠 卡牌 补充包', 40], ['数码宝贝 卡牌 补充包', 45]
]) {
  addItem(n, 'toys', '卡牌', price, '🃏', [n, '卡牌', '收藏']);
}

const plush = [
  ['玲娜贝儿 毛绒公仔 中号', 299, '🧸'], ['玲娜贝儿 毛绒公仔 大号', 599, '🧸'],
  ['星黛露 毛绒公仔 中号', 299, '🐰'], ['星黛露 毛绒公仔 大号', 599, '🐰'],
  ['Jellycat 邦尼兔 中号', 399, '🐰'], ['Jellycat 邦尼兔 大号', 799, '🐰'],
  ['Jellycat 巴塞罗熊 中号', 499, '🧸'], ['Jellycat 趣味牛油果', 299, '🥑'],
  ['迪士尼 米奇 毛绒公仔', 199, '🐭'], ['迪士尼 唐老鸭 毛绒公仔', 199, '🦆'],
  ['三丽鸥 库洛米 毛绒', 249, '🖤'], ['三丽鸥 玉桂狗 毛绒', 249, '🤍'],
  ['宜家 大象 毛绒玩具', 99, '🐘'], ['宜家 鲨鱼 毛绒玩具', 129, '🦈'],
  ['名创优品 线条小狗 抱枕', 59, '🐶'], ['名创优品 草莓熊 毛绒', 79, '🧸'],
  ['大熊猫 仿真毛绒 中号', 159, '🐼'], ['卡皮巴拉 毛绒公仔', 129, '🦫']
];
for (const [n, price, emoji] of plush) {
  addItem(n, 'toys', '毛绒玩具', price, emoji, [n, '毛绒玩具']);
}

for (const [n, price, sub, emoji] of [
  ['法拉利 SF90 1:18 车模', 899, '模型', '🏎️'], ['保时捷 911 GT3 1:18 车模', 799, '模型', '🏎️'],
  ['兰博基尼 Huracan 1:18 车模', 799, '模型', '🏎️'], ['布加迪 Chiron 1:18 车模', 999, '模型', '🏎️'],
  ['奔驰 G63 1:18 车模', 699, '模型', '🚙'], ['特斯拉 Model 3 1:18 车模', 499, '模型', '🚗'],
  ['1000片 星空拼图', 99, '拼图', '🧩'], ['1000片 莫奈睡莲拼图', 99, '拼图', '🧩'],
  ['500片 城市夜景拼图', 69, '拼图', '🧩'], ['木质立体拼图 建筑', 129, '拼图', '🧩'],
  ['卡坦岛 桌游', 299, '桌游', '🎲'], ['大富翁 经典版', 39, '桌游', '🎲'],
  ['狼人杀 豪华版', 89, '桌游', '🎲'], ['UNO 纸牌', 19, '桌游', '🎲'],
  ['三国杀 标准版', 59, '桌游', '🎲'], ['剧本杀 推理套装', 129, '桌游', '🎲'],
  ['三阶魔方 竞速版', 49, '益智', '🧩'], ['GAN 356 磁力魔方', 199, '益智', '🧩'],
  ['磁力片 100片装', 199, '益智', '🧩'], ['磁力片 200片装', 359, '益智', '🧩'],
  ['芭比 梦幻衣橱', 299, '娃娃', '👗'], ['芭比 时尚达人', 199, '娃娃', '👗'],
  ['变形金刚 擎天柱 大师级', 699, '模型', '🚛'], ['变形金刚 威震天', 599, '模型', '🚛'],
  ['托马斯 小火车套装', 299, '模型', '🚂'], ['儿童滑板车 可折叠', 399, '户外', '🛴'],
  ['平衡车 儿童款', 599, '户外', '🛴'], ['儿童泡泡机 全自动', 69, '户外', '🫧'],
  ['沙滩玩具 10件套', 59, '户外', '🏖️'], ['儿童厨房 仿真套装', 299, '益智', '🍳']
]) {
  addItem(n, 'toys', sub, price, emoji, [n, sub]);
}

/* ==================== 日常百货 ==================== */
function dailyItem(brand, prod, sub, emoji, unit, specs, tags) {
  for (const [spec, mult] of specs) {
    addItem(`${brand} ${prod} ${spec}`, 'daily', sub, unit * mult, emoji, [brand, prod, ...tags]);
  }
}

const D6 = [['6包装', 6], ['24包整箱', 21], ['36包囤货装', 30]];
const D3 = [['单件装', 1], ['3件装', 2.8], ['6件装', 5.4]];
const D2 = [['单件装', 1], ['2件装', 1.9]];
dailyItem('维达', '抽纸 3层100抽', '纸品', '🧻', 6, D6, ['抽纸', '纸巾']);
dailyItem('维达', '卷纸 4层140g', '纸品', '🧻', 3.2, [['10卷装', 10], ['30卷整箱', 28], ['50卷囤货装', 45]], ['卷纸', '纸巾']);
dailyItem('维达', '厨房纸巾 2卷', '纸品', '🧻', 12, [['2卷装', 1], ['8卷装', 3.8], ['24卷整箱', 10]], ['厨房纸', '纸巾']);
dailyItem('清风', '抽纸 3层120抽', '纸品', '🧻', 7, D6, ['抽纸', '纸巾']);
dailyItem('清风', '卷纸 4层160g', '纸品', '🧻', 4, [['10卷装', 10], ['30卷整箱', 28]], ['卷纸', '纸巾']);
dailyItem('心相印', '抽纸 3层100抽', '纸品', '🧻', 5.5, D6, ['抽纸', '纸巾']);
dailyItem('心相印', '手帕纸 4层', '纸品', '🧻', 1, [['10包装', 10], ['30包装', 28], ['50包装', 45]], ['手帕纸', '纸巾']);
dailyItem('洁柔', '抽纸 3层100抽', '纸品', '🧻', 6, D6, ['抽纸', '纸巾']);
dailyItem('洁柔', '湿巾 80抽', '纸品', '🧻', 12, [['3包装', 3], ['12包装', 11]], ['湿巾', '清洁']);
dailyItem('得宝', '抽纸 4层90抽', '纸品', '🧻', 9, [['4包装', 4], ['16包装', 15]], ['抽纸', '纸巾']);

const shampooBrands = ['海飞丝', '潘婷', '沙宣', '清扬', '欧莱雅', '资生堂', '馥绿德雅', '阿道夫', '吕', '施华蔻'];
for (const b of shampooBrands) {
  dailyItem(b, '洗发水', '洗护', '🧴', 49, [['400ml', 1], ['750ml', 1.7], ['家庭装1500ml', 2.9]], ['洗发水', '洗护']);
  dailyItem(b, '护发素', '洗护', '🧴', 45, [['400ml', 1], ['750ml', 1.7]], ['护发素', '洗护']);
}
const bodyBrands = ['舒肤佳', '力士', '多芬', '六神', '妮维雅', '欧舒丹'];
for (const b of bodyBrands) {
  dailyItem(b, '沐浴露', '洗护', '🧴', 39, [['500ml', 1], ['1000ml', 1.9]], ['沐浴露', '洗护']);
  dailyItem(b, '洗面奶', '洗护', '🧴', 35, [['100g', 1], ['150g', 1.4]], ['洗面奶', '护肤']);
}
for (const [b, p] of [['高露洁', '牙膏'], ['佳洁士', '牙膏'], ['云南白药', '牙膏'], ['黑人', '牙膏'], ['狮王', '牙膏']]) {
  dailyItem(b, p, '口腔护理', '🪥', 15, [['120g', 1], ['3支装', 2.8], ['6支装', 5.4]], ['牙膏', '口腔护理']);
}
dailyItem('李施德林', '漱口水', '口腔护理', '🪥', 39, [['500ml', 1], ['2瓶装', 1.9]], ['漱口水']);
dailyItem('欧乐B', '牙线 50米', '口腔护理', '🪥', 19, [['1盒装', 1], ['3盒装', 2.8]], ['牙线']);
dailyItem('飞利浦', '电动牙刷头 3支装', '口腔护理', '🪥', 149, [['3支装', 1], ['6支装', 1.9]], ['牙刷刷头']);

dailyItem('蓝月亮', '洗衣液', '清洁', '🧴', 39, [['2kg', 1], ['4kg', 1.9], ['8kg家庭装', 3.6]], ['洗衣液']);
dailyItem('汰渍', '洗衣液', '清洁', '🧴', 35, [['2kg', 1], ['4kg', 1.9], ['8kg家庭装', 3.6]], ['洗衣液']);
dailyItem('奥妙', '洗衣液', '清洁', '🧴', 32, [['2kg', 1], ['4kg', 1.9]], ['洗衣液']);
dailyItem('立白', '洗衣凝珠', '清洁', '🧴', 39, [['30颗装', 1], ['60颗装', 1.9], ['120颗装', 3.6]], ['洗衣凝珠']);
dailyItem('金纺', '衣物柔顺剂', '清洁', '🧴', 29, [['1L', 1], ['3L', 2.8]], ['柔顺剂']);
dailyItem('立白', '洗洁精', '清洁', '🧴', 15, [['1kg', 1], ['3kg', 2.8], ['5kg家庭装', 4.5]], ['洗洁精']);
dailyItem('威露士', '衣物消毒液', '清洁', '🧴', 39, [['1L', 1], ['3L', 2.8]], ['消毒液']);
dailyItem('滴露', '消毒液', '清洁', '🧴', 45, [['1L', 1], ['3L', 2.8]], ['消毒液']);

dailyItem('妙洁', '垃圾袋 45×50cm', '家居用品', '🗑️', 12, [['30只装', 1], ['100只装', 3.2], ['300只囤货装', 9]], ['垃圾袋']);
dailyItem('妙洁', '保鲜膜', '家居用品', '📦', 15, [['30cm×50m', 1], ['3卷装', 2.8]], ['保鲜膜']);
dailyItem('妙洁', '保鲜袋', '家居用品', '📦', 10, [['100只装', 1], ['300只装', 2.8]], ['保鲜袋']);
dailyItem('美丽雅', '一次性手套', '家居用品', '🧤', 9, [['100只装', 1], ['300只装', 2.8]], ['一次性手套']);
dailyItem('美丽雅', '一次性纸杯', '家居用品', '🥤', 15, [['100只装', 1], ['500只整箱', 4.6]], ['纸杯']);
dailyItem('心相印', '湿厕纸', '纸品', '🧻', 19, [['40抽装', 1], ['3包装', 2.8], ['12包装', 11]], ['湿厕纸']);

for (const [n, p] of [['南孚 5号电池 8节', 29], ['南孚 7号电池 8节', 29], ['小米 5号碱性电池 10节', 19], ['德力普 18650锂电池 2节', 39]]) {
  addItem(n, 'daily', '电池', p, '🔋', [n, '电池']);
}
for (const [n, p] of [['飞利浦 LED灯泡 10W', 25], ['欧普 LED灯泡 12W', 19], ['小米 智能灯泡 彩光版', 79], ['公牛 插线板 5位 3米', 69], ['公牛 插线板 7位 5米', 99]]) {
  addItem(n, 'daily', '五金电工', p, '💡', [n, '电工']);
}
for (const [n, p, e] of [['天堂 折叠雨伞', 89, '☂️'], ['蕉下 防晒伞', 199, '☂️'], ['小米 自动雨伞', 79, '☂️'], ['富光 保温杯 500ml', 99, '🥤'], ['象印 保温杯 600ml', 299, '🥤'], ['虎牌 保温杯 500ml', 259, '🥤'], ['Stanley 冰霸杯 1L', 399, '🥤'], ['特百惠 塑料水杯 500ml', 69, '🥤'], ['乐扣乐扣 玻璃杯 400ml', 49, '🥤']]) {
  addItem(n, 'daily', '杯壶雨具', p, e, [n, '日用']);
}
for (const [n, p, e] of [['双立人 不粘炒锅 30cm', 899, '🍳'], ['苏泊尔 不锈钢炒锅 32cm', 299, '🍳'], ['炊大皇 铸铁锅 30cm', 199, '🍳'], ['菲仕乐 汤锅 24cm', 1299, '🍲'], ['双立人 刀具套装', 999, '🔪'], ['张小泉 菜刀', 199, '🔪'], ['十八子作 菜刀', 129, '🔪'], ['康巴赫 砧板', 299, '🪵'], ['摩登主妇 陶瓷餐具 16件套', 399, '🍽️'], ['青苹果 玻璃杯 6只装', 89, '🥛'], ['乐扣乐扣 保鲜盒 3件套', 99, '📦']]) {
  addItem(n, 'daily', '锅具餐具', p, e, [n, '厨房用品']);
}
for (const [n, p, e] of [['爱丽思 收纳箱 45L', 129, '📦'], ['爱丽思 收纳箱 90L', 199, '📦'], ['天马 抽屉式收纳柜', 299, '🗄️'], ['宜家 衣架 10只装', 29, '👔'], ['茶花 衣架 20只装', 39, '👔'], ['美丽雅 置物架 三层', 159, '🗄️'], ['百露 垃圾桶 12L', 69, '🗑️'], ['宜家 脚踏垃圾桶 10L', 99, '🗑️']]) {
  addItem(n, 'daily', '收纳整理', p, e, [n, '收纳']);
}
for (const [n, p] of [['得力 中性笔 20支装', 29], ['晨光 中性笔 20支装', 25], ['百乐 中性笔 10支装', 89], ['派通 自动铅笔 3支装', 59], ['国誉 笔记本 A5 5本装', 49], ['Moleskine 笔记本 A5', 199], ['得力 A4打印纸 5包', 129], ['晨光 A4打印纸 5包', 119], ['得力 胶带 6卷装', 19], ['得力 订书机', 39], ['得力 文件夹 10个装', 29], ['晨光 修正带 5个装', 25], ['施德楼 橡皮 10块装', 35], ['辉柏嘉 彩色铅笔 48色', 129]]) {
  addItem(n, 'daily', '文具', p, '🖊️', [n, '文具']);
}
for (const [n, p] of [['稳健 医用外科口罩 50只', 39], ['3M N95口罩 20只', 69], ['苏菲 卫生巾 日用 10片', 19], ['护舒宝 卫生巾 夜用 8片', 25], ['七度空间 卫生巾 组合装', 59], ['棉森 棉柔巾 100抽', 29], ['稳健 棉签 200支', 15], ['云南白药 创可贴 20片', 19], ['可孚 电子体温计', 39]]) {
  addItem(n, 'daily', '个护健康', p, '🩹', [n, '个护']);
}
for (const [n, p, e] of [['麦富迪 猫粮 2kg', 89, '🐱'], ['皇家 猫粮 2kg', 159, '🐱'], ['渴望 猫粮 1.8kg', 299, '🐱'], ['麦富迪 狗粮 3kg', 109, '🐶'], ['伯纳天纯 狗粮 5kg', 199, '🐶'], ['洁客 猫砂 10L', 39, '🐱'], ['pidan 混合猫砂 6L', 49, '🐱'], ['猫条 20支装', 39, '🐱'], ['狗零食 鸡肉干 500g', 59, '🐶'], ['宠物玩具 逗猫棒', 19, '🐱']]) {
  addItem(n, 'daily', '宠物用品', p, e, [n, '宠物']);
}
for (const [n, p] of [['妙洁 平板拖把', 69], ['美丽雅 海绵拖把', 49], ['3M 百洁布 10片装', 29], ['威猛先生 厨房清洁剂', 25], ['威猛先生 玻璃清洁剂', 25], ['蓝月亮 马桶清洁剂', 29], ['花王 马桶清洁喷雾', 45], ['滴露 表面消毒湿巾', 39]]) {
  addItem(n, 'daily', '清洁工具', p, '🧹', [n, '清洁']);
}
for (const [n, p] of [['得力 螺丝刀套装 24件', 79], ['博世 电动螺丝刀', 199], ['史丹利 工具箱 20寸', 299], ['得力 卷尺 5米', 29], ['3M 电工胶带 5卷', 19], ['绿林 棘轮扳手套装', 129]]) {
  addItem(n, 'daily', '五金工具', p, '🔧', [n, '工具']);
}
for (const [n, p, e] of [['回力 居家拖鞋 男款', 39, '🩴'], ['洁丽雅 居家拖鞋 女款', 35, '🩴'], ['朴西 厚底拖鞋', 69, '🩴'], ['蕉下 洞洞鞋', 129, '🩴'], ['南极人 纯棉毛巾 3条装', 49, '🧺'], ['洁丽雅 浴巾 2条装', 79, '🧺'], ['无印良品 浴巾', 99, '🧺'], ['网易严选 四件套 1.8米床', 399, '🛏️'], ['水星家纺 蚕丝被 2斤', 1299, '🛏️'], ['罗莱 羽绒被 95白鹅绒', 2999, '🛏️'], ['宜家 记忆棉枕头', 199, '🛏️']]) {
  addItem(n, 'daily', '家纺拖鞋', p, e, [n, '家纺']);
}

/* ==================== 衣物球鞋 ==================== */
function apparel(brand, prod, sub, emoji, price, colors, sizes, tags = []) {
  for (const color of colors) {
    for (const size of sizes) {
      addItem(`${brand} ${prod} ${color} ${size}`, 'clothing', sub, price, emoji, [brand, prod, color, size, ...tags]);
    }
  }
}

const sizesTop = ['S', 'M', 'L', 'XL', 'XXL'];
const sizesShoe = ['39', '40', '41', '42', '43', '44'];

for (const [b, p, price, e] of [
  ['优衣库', 'U系列圆领T恤', 99, '👕'], ['耐克', 'Dri-FIT运动T恤', 199, '👕'],
  ['阿迪达斯', '三叶草T恤', 249, '👕'], ['李宁', '中国李宁T恤', 299, '👕'],
  ['安踏', '冠军系列T恤', 159, '👕'], ['太平鸟', '印花T恤', 199, '👕'],
  ['GAP', '纯棉T恤', 129, '👕'], ['森马', '基础款T恤', 69, '👕']
]) {
  apparel(b, p, 'T恤', e, price, ['黑色', '白色', '灰色', '藏青色'], sizesTop, ['T恤', '短袖']);
}
for (const [b, p, price] of [
  ['耐克', 'Tech Fleece 连帽卫衣', 599], ['阿迪达斯', '三叶草连帽卫衣', 549],
  ['优衣库', '摇粒绒卫衣', 199], ['李宁', '运动卫衣', 299],
  ['Champion', '经典连帽卫衣', 399], ['匡威', '针织卫衣', 359]
]) {
  apparel(b, p, '卫衣', '🧥', price, ['黑色', '白色', '灰色'], sizesTop, ['卫衣', '连帽']);
}
for (const [b, p, price] of [
  ['优衣库', '牛津纺衬衫', 199], ['海澜之家', '商务衬衫', 299],
  ['雅戈尔', '免烫衬衫', 399], ['GAP', '法兰绒衬衫', 249]
]) {
  apparel(b, p, '衬衫', '👔', price, ['白色', '浅蓝色', '格子'], ['S', 'M', 'L', 'XL'], ['衬衫']);
}
for (const [b, p, price] of [
  ['李维斯', '501经典牛仔裤', 799], ['Lee', '直筒牛仔裤', 599],
  ['优衣库', '弹力修身牛仔裤', 299], ['太平鸟', '高腰牛仔裤', 399],
  ['森马', '宽松阔腿牛仔裤', 199]
]) {
  apparel(b, p, '牛仔裤', '👖', price, ['浅蓝', '深蓝', '黑色'], ['28', '29', '30', '31', '32'], ['牛仔裤']);
}
for (const [b, p, price] of [
  ['北面', '1996 Nuptse羽绒服', 2999], ['波司登', '极寒系列羽绒服', 1999],
  ['优衣库', '轻型羽绒服', 599], ['始祖鸟', 'Cerium LT羽绒服', 6999],
  ['哥伦比亚', '奥米热反射羽绒服', 1999], ['鸭鸭', '加厚羽绒服', 899]
]) {
  apparel(b, p, '羽绒服', '🧥', price, ['黑色', '白色', '蓝色', '红色'], ['S', 'M', 'L', 'XL'], ['羽绒服']);
}
for (const [b, p, price] of [
  ['始祖鸟', 'Beta AR冲锋衣', 6999], ['北面', '冲锋衣三合一', 1999],
  ['哥伦比亚', '防水冲锋衣', 1299], ['凯乐石', 'MONT X冲锋衣', 2599]
]) {
  apparel(b, p, '冲锋衣', '🧥', price, ['黑色', '橙色', '军绿色'], ['S', 'M', 'L', 'XL'], ['冲锋衣']);
}
for (const [b, p, price] of [
  ['优衣库', 'A字连衣裙', 299], ['太平鸟', '法式碎花裙', 399],
  ['ZARA', '吊带连衣裙', 399], ['UR', '通勤连衣裙', 359], ['江南布衣', '设计师连衣裙', 899]
]) {
  apparel(b, p, '裙子', '👗', price, ['黑色', '白色', '碎花'], ['S', 'M', 'L'], ['连衣裙']);
}
for (const [b, p, price] of [
  ['利郎', '商务西装套装', 2999], ['海澜之家', '休闲西装套装', 1999], ['优衣库', '弹力西装外套', 799]
]) {
  apparel(b, p, '西装', '🤵', price, ['黑色', '藏青色', '灰色'], ['S', 'M', 'L', 'XL'], ['西装']);
}
for (const [b, p, price] of [
  ['耐克', 'Dri-FIT运动裤', 299], ['阿迪达斯', '三条纹运动裤', 349],
  ['李宁', '束脚运动裤', 199], ['安踏', '速干运动裤', 159]
]) {
  apparel(b, p, '运动裤', '👖', price, ['黑色', '灰色', '藏青色'], sizesTop, ['运动裤']);
}
for (const [b, p, price] of [
  ['优衣库', '纯棉睡衣套装', 199], ['果壳', '珊瑚绒睡衣', 299], ['芬腾', '纯棉家居服', 159]
]) {
  apparel(b, p, '睡衣', '🩳', price, ['粉色', '蓝色', '灰色'], ['S', 'M', 'L', 'XL'], ['睡衣']);
}
for (const [n, p, e] of [
  ['蕉内 男士内裤 3条装', 99, '🩲'], ['蕉内 女士内裤 3条装', 99, '🩲'],
  ['爱慕 女士内衣', 399, '👙'], ['维多利亚的秘密 内衣', 499, '👙'],
  ['优衣库 无钢圈内衣', 149, '👙'], ['浪莎 女士内裤 5条装', 59, '🩲'],
  ['恒源祥 男士保暖内衣套装', 299, '🩲'], ['浪莎 纯棉袜子 10双装', 49, '🧦'],
  ['耐克 运动袜 6双装', 199, '🧦'], ['阿迪达斯 运动袜 3双装', 129, '🧦']
]) {
  addItem(n, 'clothing', '内衣袜品', p, e, [n, '内衣']);
}
for (const [n, p, e] of [
  ['MLB 棒球帽', 299, '🧢'], ['耐克 运动帽', 199, '🧢'], ['北面 渔夫帽', 299, '🧢'],
  ['优衣库 针织帽', 99, '🧢'], ['巴宝莉 羊毛围巾', 3999, '🧣'], ['优衣库 羊绒围巾', 399, '🧣'],
  ['始祖鸟 保暖手套', 899, '🧤'], ['迪卡侬 滑雪手套', 199, '🧤']
]) {
  addItem(n, 'clothing', '帽子围巾', p, e, [n, '配饰']);
}

const shoeModels = [
  ['耐克', 'Air Force 1 经典板鞋', 799, '👟'], ['耐克', 'Dunk Low 复古板鞋', 899, '👟'],
  ['耐克', 'Air Jordan 1 High OG', 1399, '👟'], ['耐克', 'Air Jordan 4 Retro', 1599, '👟'],
  ['耐克', 'Pegasus 41 跑步鞋', 999, '👟'], ['耐克', 'Vaporfly 3 竞速跑鞋', 1599, '👟'],
  ['阿迪达斯', 'Samba OG 德训鞋', 899, '👟'], ['阿迪达斯', 'Gazelle 复古板鞋', 799, '👟'],
  ['阿迪达斯', 'Ultraboost 5 跑鞋', 1399, '👟'], ['阿迪达斯', 'Yeezy Boost 350', 2199, '👟'],
  ['新百伦', '574 复古跑鞋', 699, '👟'], ['新百伦', '990v6 美产跑鞋', 1999, '👟'],
  ['新百伦', '2002R 复古跑鞋', 999, '👟'], ['亚瑟士', 'GEL-KAYANO 31', 1399, '👟'],
  ['亚瑟士', 'GEL-NIMBUS 26', 1299, '👟'], ['李宁', '韦德之道 11', 1599, '👟'],
  ['李宁', '䨻 超轻21 跑鞋', 899, '👟'], ['安踏', 'KT9 篮球鞋', 999, '👟'],
  ['安踏', '马赫5 跑鞋', 499, '👟'], ['匡威', 'Chuck 70 高帮帆布鞋', 599, '👟'],
  ['Vans', 'Old Skool 帆布鞋', 599, '👟'], ['彪马', 'Suede 经典板鞋', 599, '👟'],
  ['锐步', 'Club C 85 板鞋', 499, '👟'], ['萨洛蒙', 'XT-6 越野跑鞋', 1499, '👟'],
  ['HOKA', 'Clifton 9 跑鞋', 1099, '👟']
];
for (const [b, n, price, e] of shoeModels) {
  apparel(b, n, '球鞋', e, price, ['黑白', '白红', '灰白'], sizesShoe, ['球鞋', '运动鞋']);
}
for (const [n, p, e] of [
  ['其乐 沙漠靴', 1299, '👞'], ['爱步 商务皮鞋', 1999, '👞'], ['红蜻蜓 正装皮鞋', 499, '👞'],
  ['奥康 商务皮鞋', 599, '👞'], ['马丁靴 1460 八孔', 1499, '👢'], ['添柏岚 大黄靴', 1499, '👢'],
  ['UGG 雪地靴', 1599, '👢'], ['骆驼 户外徒步鞋', 499, '🥾'], ['萨洛蒙 登山鞋', 1699, '🥾']
]) {
  addItem(n, 'clothing', '皮鞋靴子', p, e, [n, '鞋靴']);
}
for (const [n, p, e] of [
  ['路易威登 Neverfull 手袋', 13999, '👜'], ['香奈儿 经典 flap 手袋', 69999, '👜'],
  ['古驰 Ophidia 手袋', 12999, '👜'], ['爱马仕 Birkin 30', 89999, '👜'],
  ['蔻驰 Tabby 手袋', 3999, '👜'], ['迈克高仕 Jet Set 托特包', 1999, '👜'],
  ['新秀丽 登机箱 20寸', 1299, '🧳'], ['日默瓦 铝框行李箱 26寸', 8999, '🧳'],
  ['小米 旅行箱 24寸', 399, '🧳'], ['北面 双肩背包 30L', 699, '🎒'],
  ['始祖鸟 户外背包 25L', 1299, '🎒'], ['耐克 运动双肩包', 399, '🎒']
]) {
  addItem(n, 'clothing', '箱包', p, e, [n, '箱包']);
}

/* 补充衣物品类，保证分类数量与价格梯度 */
for (const [b, p, price] of [
  ['MaxMara', '羊绒大衣', 8999], ['优衣库', '羊毛混纺大衣', 799],
  ['波司登', '鹅绒大衣', 1999], ['太平鸟', '毛呢大衣', 599]
]) {
  apparel(b, p, '大衣', '🧥', price, ['驼色', '黑色', '灰色'], ['S', 'M', 'L', 'XL'], ['大衣', '外套']);
}
for (const [b, p, price] of [
  ['Burberry', '经典风衣', 16999], ['优衣库', '轻薄风衣', 399], ['北面', '户外防风衣', 899]
]) {
  apparel(b, p, '风衣', '🧥', price, ['卡其色', '黑色', '军绿色'], ['S', 'M', 'L', 'XL'], ['风衣']);
}
for (const [b, p, price] of [
  ['Speedo', '竞速泳衣', 499], ['李宁', '连体泳衣', 299], ['范德安', '度假泳衣', 399]
]) {
  apparel(b, p, '泳装', '🩱', price, ['黑色', '蓝色', '粉色'], ['S', 'M', 'L'], ['泳装']);
}
for (const [b, p, price] of [
  ['Lululemon', 'Align瑜伽裤', 850], ['李宁', '高弹瑜伽裤', 299], ['安踏', '运动紧身裤', 199]
]) {
  apparel(b, p, '瑜伽服', '🧘', price, ['黑色', '灰色', '紫色'], ['S', 'M', 'L'], ['瑜伽服']);
}
for (const [b, p, price] of [
  ['巴拉巴拉', '亲子装卫衣', 399], ['安奈儿', '亲子装T恤', 299]
]) {
  apparel(b, p, '亲子装', '👨‍👩‍👧', price, ['红色', '蓝色'], ['S', 'M', 'L'], ['亲子装']);
}
for (const [b, p, price] of [
  ['十三余', '汉服齐胸襦裙', 599], ['重回汉唐', '明制马面裙', 499], ['织羽集', '宋制汉服', 699]
]) {
  apparel(b, p, '汉服', '👘', price, ['红色', '蓝色'], ['S', 'M', 'L'], ['汉服']);
}
for (const [b, p, price] of [
  ['耐克', '运动套装', 699], ['阿迪达斯', '运动套装', 649], ['李宁', '运动套装', 499], ['安踏', '运动套装', 399]
]) {
  apparel(b, p, '运动套装', '🏃', price, ['黑色', '蓝色', '灰色'], ['S', 'M', 'L', 'XL'], ['运动套装']);
}

/* ==================== 家电 ==================== */
function appliance(brand, model, sub, emoji, price, specs, tags = []) {
  for (const [spec, delta] of specs) {
    addItem(`${brand} ${model} ${spec}`, 'appliances', sub, price + delta, emoji, [brand, model, spec, ...tags]);
  }
}

appliance('小米', '电视 S Pro Mini LED', '电视', '📺', 3499, [['55英寸', 0], ['65英寸', 1000], ['75英寸', 2500], ['85英寸', 5000], ['100英寸', 12000]], ['电视', 'MiniLED']);
appliance('小米', '电视 A Pro', '电视', '📺', 1799, [['43英寸', 0], ['55英寸', 600], ['65英寸', 1400], ['75英寸', 2600]], ['电视']);
appliance('海信', 'ULED X 电视', '电视', '📺', 6999, [['65英寸', 0], ['75英寸', 2000], ['85英寸', 5000], ['100英寸', 12000]], ['电视', 'ULED']);
appliance('TCL', 'Q10K Mini LED 电视', '电视', '📺', 7999, [['65英寸', 0], ['75英寸', 2000], ['85英寸', 5000], ['98英寸', 10000]], ['电视', 'MiniLED']);
appliance('索尼', 'BRAVIA 9 电视', '电视', '📺', 16999, [['65英寸', 0], ['75英寸', 5000], ['85英寸', 12000]], ['电视', '索尼']);
appliance('索尼', 'X90L 电视', '电视', '📺', 8999, [['55英寸', 0], ['65英寸', 2000], ['75英寸', 5000], ['85英寸', 10000]], ['电视', '索尼']);
appliance('三星', 'Neo QLED QN90D 电视', '电视', '📺', 12999, [['55英寸', 0], ['65英寸', 3000], ['75英寸', 8000], ['85英寸', 15000]], ['电视', '三星']);
appliance('LG', 'OLED evo G4 电视', '电视', '📺', 15999, [['55英寸', 0], ['65英寸', 4000], ['77英寸', 12000], ['83英寸', 20000]], ['电视', 'OLED']);
appliance('华为', '智慧屏 V5', '电视', '📺', 6999, [['65英寸', 0], ['75英寸', 2500], ['85英寸', 6000], ['98英寸', 12000]], ['电视', '华为']);

appliance('海尔', '十字对开门冰箱', '冰箱', '🧊', 3999, [['470L', 0], ['520L', 800], ['620L', 2500]], ['冰箱']);
appliance('卡萨帝', '原石系列冰箱', '冰箱', '🧊', 9999, [['470L', 0], ['520L', 2000], ['620L', 5000]], ['冰箱', '高端']);
appliance('美的', '双开门冰箱', '冰箱', '🧊', 3499, [['508L', 0], ['606L', 1500]], ['冰箱']);
appliance('西门子', '零度保鲜冰箱', '冰箱', '🧊', 6999, [['502L', 0], ['610L', 2500]], ['冰箱']);
appliance('容声', '十字门冰箱', '冰箱', '🧊', 3299, [['501L', 0], ['536L', 1000]], ['冰箱']);
appliance('松下', '法式多门冰箱', '冰箱', '🧊', 7999, [['435L', 0], ['580L', 3000]], ['冰箱']);
appliance('小米', '对开门冰箱', '冰箱', '🧊', 2699, [['508L', 0], ['610L', 1500]], ['冰箱']);

appliance('海尔', '洗烘一体洗衣机', '洗衣机', '🧺', 3999, [['10kg', 0], ['12kg', 1500]], ['洗衣机']);
appliance('小天鹅', '水魔方洗衣机', '洗衣机', '🧺', 4299, [['10kg', 0], ['12kg', 1200]], ['洗衣机']);
appliance('美的', '滚筒洗衣机', '洗衣机', '🧺', 2999, [['10kg', 0], ['12kg', 1000]], ['洗衣机']);
appliance('西门子', '滚筒洗衣机', '洗衣机', '🧺', 4599, [['10kg', 0], ['12kg', 1500]], ['洗衣机']);
appliance('松下', '滚筒洗衣机', '洗衣机', '🧺', 4999, [['10kg', 0], ['12kg', 1800]], ['洗衣机']);
appliance('LG', '直驱洗衣机', '洗衣机', '🧺', 5299, [['10kg', 0], ['12kg', 2000]], ['洗衣机']);
appliance('海尔', '热泵干衣机', '干衣机', '🧺', 4999, [['10kg', 0]], ['干衣机']);
appliance('小天鹅', '热泵干衣机', '干衣机', '🧺', 4599, [['10kg', 0]], ['干衣机']);
appliance('西门子', '热泵干衣机', '干衣机', '🧺', 6999, [['9kg', 0]], ['干衣机']);

appliance('格力', '云锦空调', '空调', '❄️', 3999, [['1.5匹', 0], ['2匹', 1500], ['3匹', 3500]], ['空调']);
appliance('美的', '酷省电空调', '空调', '❄️', 3599, [['1.5匹', 0], ['2匹', 1500], ['3匹', 3200]], ['空调']);
appliance('海尔', '静悦空调', '空调', '❄️', 3799, [['1.5匹', 0], ['2匹', 1400]], ['空调']);
appliance('奥克斯', '京爽空调', '空调', '❄️', 2999, [['1.5匹', 0], ['2匹', 1200]], ['空调']);
appliance('大金', '帕蒂能空调', '空调', '❄️', 8999, [['1.5匹', 0], ['2匹', 2500], ['3匹', 6000]], ['空调', '高端']);

appliance('石头', '扫地机器人 G20S', '扫地机器人', '🤖', 4999, [['标准版', 0], ['上下水版', 800]], ['扫地机器人']);
appliance('石头', '扫地机器人 P10S Pro', '扫地机器人', '🤖', 3299, [['标准版', 0], ['上下水版', 600]], ['扫地机器人']);
appliance('科沃斯', '扫地机器人 X5 Pro', '扫地机器人', '🤖', 5999, [['标准版', 0], ['上下水版', 1000]], ['扫地机器人']);
appliance('科沃斯', '扫地机器人 T30', '扫地机器人', '🤖', 3999, [['标准版', 0], ['上下水版', 700]], ['扫地机器人']);
appliance('追觅', '扫地机器人 X40', '扫地机器人', '🤖', 5499, [['标准版', 0], ['上下水版', 900]], ['扫地机器人']);
appliance('云鲸', '扫地机器人 J5', '扫地机器人', '🤖', 4999, [['标准版', 0], ['上下水版', 800]], ['扫地机器人']);
appliance('小米', '扫地机器人 M30S', '扫地机器人', '🤖', 2499, [['标准版', 0]], ['扫地机器人']);

appliance('戴森', '无线吸尘器 V15', '吸尘器', '🧹', 4990, [['标准版', 0], ['Absolute 版', 600]], ['吸尘器']);
appliance('戴森', '无线吸尘器 V12', '吸尘器', '🧹', 3990, [['标准版', 0]], ['吸尘器']);
appliance('添可', '洗地机 芙万 3.0', '洗地机', '🧹', 2990, [['标准版', 0]], ['洗地机']);
appliance('添可', '洗地机 芙万 4.0', '洗地机', '🧹', 3990, [['标准版', 0]], ['洗地机']);
appliance('追觅', '洗地机 H30', '洗地机', '🧹', 2599, [['标准版', 0]], ['洗地机']);

appliance('小米', '空气净化器 4 Pro', '空气净化器', '💨', 1299, [['标准版', 0]], ['空气净化器']);
appliance('飞利浦', '空气净化器 AC3858', '空气净化器', '💨', 2999, [['标准版', 0]], ['空气净化器']);
appliance('布鲁雅尔', '空气净化器 280i', '空气净化器', '💨', 3999, [['标准版', 0]], ['空气净化器']);
appliance('戴森', '空气净化风扇 TP09', '空气净化器', '💨', 4990, [['标准版', 0]], ['空气净化器']);
appliance('小米', '加湿器 2', '加湿器', '💧', 249, [['标准版', 0]], ['加湿器']);
appliance('飞利浦', '加湿器 HU4816', '加湿器', '💧', 999, [['标准版', 0]], ['加湿器']);
appliance('戴森', '加湿器 PH04', '加湿器', '💧', 4990, [['标准版', 0]], ['加湿器']);

appliance('美的', '微波炉', '微波炉', '🍲', 599, [['20L', 0], ['23L', 150]], ['微波炉']);
appliance('格兰仕', '微波炉', '微波炉', '🍲', 499, [['20L', 0], ['23L', 120]], ['微波炉']);
appliance('松下', '微波炉', '微波炉', '🍲', 1299, [['23L', 0], ['27L', 400]], ['微波炉']);
appliance('美的', '电烤箱', '烤箱', '🍞', 899, [['40L', 0]], ['烤箱']);
appliance('长帝', '电烤箱', '烤箱', '🍞', 999, [['42L', 0]], ['烤箱']);
appliance('海氏', '风炉烤箱', '烤箱', '🍞', 1999, [['40L', 0]], ['烤箱']);
appliance('象印', '电饭煲', '电饭煲', '🍚', 1299, [['3L', 0], ['5L', 300]], ['电饭煲']);
appliance('虎牌', '电饭煲', '电饭煲', '🍚', 1499, [['3L', 0], ['5L', 350]], ['电饭煲']);
appliance('美的', '电饭煲', '电饭煲', '🍚', 399, [['4L', 0], ['5L', 100]], ['电饭煲']);
appliance('苏泊尔', '电饭煲', '电饭煲', '🍚', 459, [['4L', 0], ['5L', 120]], ['电饭煲']);
appliance('小米', '电饭煲', '电饭煲', '🍚', 299, [['4L', 0]], ['电饭煲']);
appliance('飞利浦', '空气炸锅', '空气炸锅', '🍟', 899, [['6.2L', 0]], ['空气炸锅']);
appliance('小米', '空气炸锅', '空气炸锅', '🍟', 399, [['6L', 0]], ['空气炸锅']);
appliance('山本', '空气炸锅', '空气炸锅', '🍟', 299, [['5L', 0]], ['空气炸锅']);
appliance('九阳', '破壁机', '破壁机', '🥤', 899, [['1.2L', 0], ['1.7L', 300]], ['破壁机']);
appliance('美的', '破壁机', '破壁机', '🥤', 699, [['1.5L', 0]], ['破壁机']);
appliance('Vitamix', '破壁机', '破壁机', '🥤', 4999, [['2L', 0]], ['破壁机', '高端']);
appliance('德龙', '全自动咖啡机', '咖啡机', '☕', 6999, [['标准版', 0], ['升级版', 2000]], ['咖啡机']);
appliance('飞利浦', '全自动咖啡机', '咖啡机', '☕', 4999, [['3200系列', 0], ['5400系列', 2500]], ['咖啡机']);
appliance('雀巢', '胶囊咖啡机', '咖啡机', '☕', 1999, [['标准版', 0]], ['咖啡机']);
appliance('柏翠', '半自动咖啡机', '咖啡机', '☕', 2999, [['标准版', 0]], ['咖啡机']);
appliance('西门子', '洗碗机', '洗碗机', '🍽️', 6999, [['13套', 0], ['15套', 1500]], ['洗碗机']);
appliance('美的', '洗碗机', '洗碗机', '🍽️', 4999, [['13套', 0]], ['洗碗机']);
appliance('方太', '洗碗机', '洗碗机', '🍽️', 7999, [['12套', 0]], ['洗碗机']);
appliance('海尔', '电热水器', '热水器', '🔥', 1999, [['60L', 0], ['80L', 500]], ['热水器']);
appliance('美的', '电热水器', '热水器', '🔥', 1799, [['60L', 0], ['80L', 400]], ['热水器']);
appliance('AO史密斯', '电热水器', '热水器', '🔥', 3999, [['60L', 0], ['80L', 800]], ['热水器']);
appliance('方太', '抽油烟机', '油烟机', '💨', 4999, [['23m³', 0], ['27m³', 1500]], ['油烟机']);
appliance('老板', '抽油烟机', '油烟机', '💨', 5299, [['24m³', 0], ['27m³', 1500]], ['油烟机']);
appliance('华帝', '抽油烟机', '油烟机', '💨', 3999, [['22m³', 0]], ['油烟机']);
appliance('方太', '燃气灶', '燃气灶', '🔥', 2999, [['4.5kW', 0]], ['燃气灶']);
appliance('老板', '燃气灶', '燃气灶', '🔥', 3299, [['5.0kW', 0]], ['燃气灶']);
appliance('华帝', '燃气灶', '燃气灶', '🔥', 2499, [['4.5kW', 0]], ['燃气灶']);
appliance('美的', '落地扇', '风扇', '🌀', 299, [['标准版', 0]], ['风扇']);
appliance('格力', '塔扇', '风扇', '🌀', 399, [['标准版', 0]], ['风扇']);
appliance('小米', '直流变频循环扇', '风扇', '🌀', 399, [['标准版', 0]], ['风扇']);
appliance('美的', '踢脚线取暖器', '取暖器', '🔥', 599, [['标准版', 0]], ['取暖器']);
appliance('格力', '暖风机', '取暖器', '🔥', 499, [['标准版', 0]], ['取暖器']);
appliance('戴森', '吹风机 HD15', '吹风机', '💇', 3390, [['标准版', 0], ['礼盒装', 300]], ['吹风机']);
appliance('戴森', '吹风机 Supersonic', '吹风机', '💇', 2990, [['标准版', 0]], ['吹风机']);
appliance('徕芬', '高速吹风机 LF03', '吹风机', '💇', 599, [['标准版', 0]], ['吹风机']);
appliance('徕芬', '高速吹风机 SE', '吹风机', '💇', 399, [['标准版', 0]], ['吹风机']);
appliance('松下', '纳米水离子吹风机', '吹风机', '💇', 1299, [['标准版', 0]], ['吹风机']);
appliance('飞利浦', '电动剃须刀 5系', '剃须刀', '🪒', 899, [['标准版', 0]], ['剃须刀']);
appliance('飞利浦', '电动剃须刀 7系', '剃须刀', '🪒', 1599, [['标准版', 0]], ['剃须刀']);
appliance('飞利浦', '电动剃须刀 9系', '剃须刀', '🪒', 2999, [['标准版', 0]], ['剃须刀']);
appliance('博朗', '电动剃须刀 5系', '剃须刀', '🪒', 999, [['标准版', 0]], ['剃须刀']);
appliance('博朗', '电动剃须刀 7系', '剃须刀', '🪒', 1799, [['标准版', 0]], ['剃须刀']);
appliance('博朗', '电动剃须刀 9系', '剃须刀', '🪒', 3499, [['标准版', 0]], ['剃须刀']);
appliance('飞利浦', '电动牙刷 钻石亮白', '电动牙刷', '🪥', 999, [['标准版', 0]], ['电动牙刷']);
appliance('飞利浦', '电动牙刷 HX6730', '电动牙刷', '🪥', 399, [['标准版', 0]], ['电动牙刷']);
appliance('欧乐B', '电动牙刷 iO5', '电动牙刷', '🪥', 899, [['标准版', 0]], ['电动牙刷']);
appliance('欧乐B', '电动牙刷 iO9', '电动牙刷', '🪥', 1999, [['标准版', 0]], ['电动牙刷']);
appliance('小米', '电动牙刷 T700', '电动牙刷', '🪥', 399, [['标准版', 0]], ['电动牙刷']);
appliance('小米', '净水器 1600G', '净水器', '💧', 2499, [['标准版', 0]], ['净水器']);
appliance('美的', '净水器 1000G', '净水器', '💧', 1999, [['标准版', 0]], ['净水器']);
appliance('沁园', '净水器 800G', '净水器', '💧', 1799, [['标准版', 0]], ['净水器']);
appliance('安吉尔', '净水器 1200G', '净水器', '💧', 2999, [['标准版', 0]], ['净水器']);
appliance('极米', '投影仪 H6', '投影仪', '📽️', 3999, [['标准版', 0]], ['投影仪']);
appliance('极米', '投影仪 RS Pro 3', '投影仪', '📽️', 6999, [['标准版', 0]], ['投影仪']);
appliance('坚果', '投影仪 N1S Ultra', '投影仪', '📽️', 7499, [['标准版', 0]], ['投影仪']);
appliance('当贝', '投影仪 X5 Ultra', '投影仪', '📽️', 6999, [['标准版', 0]], ['投影仪']);
appliance('爱普生', '投影仪 EF-12', '投影仪', '📽️', 4999, [['标准版', 0]], ['投影仪']);
appliance('索尼', '回音壁 HT-A9000', '音响', '🔊', 7990, [['标准版', 0]], ['回音壁']);
appliance('三星', '回音壁 HW-Q990D', '音响', '🔊', 8999, [['标准版', 0]], ['回音壁']);
appliance('JBL', '回音壁 Bar 1000', '音响', '🔊', 6999, [['标准版', 0]], ['回音壁']);
appliance('小米', '电视音响', '音响', '🔊', 399, [['标准版', 0]], ['音响']);

/* ==================== 汽车 ==================== */
function car(brand, model, sub, price, configs, emoji = '🚗') {
  for (const [cfg, delta] of configs) {
    addItem(`${brand} ${model} ${cfg}`, 'cars', sub, price + delta, emoji, [brand, model, cfg, '汽车']);
  }
}

car('特斯拉', 'Model 3', '轿车', 235500, [['后驱标准续航版', 0], ['长续航全轮驱动版', 50000], ['高性能全轮驱动版', 80000]], '🚗');
car('特斯拉', 'Model Y', 'SUV', 249900, [['后驱标准续航版', 0], ['长续航全轮驱动版', 60000], ['高性能版', 90000], ['六座版', 40000]], '🚙');
car('特斯拉', 'Model S', '轿车', 684900, [['双电机全轮驱动版', 0], ['Plaid 三电机版', 200000]], '🚗');
car('特斯拉', 'Model X', 'SUV', 724900, [['双电机全轮驱动版', 0], ['Plaid 三电机版', 200000]], '🚙');
car('特斯拉', 'Cybertruck', '皮卡', 609000, [['后驱版', 0], ['全轮驱动版', 150000], ['赛博野兽版', 300000]], '🛻');

car('比亚迪', '汉 EV', '轿车', 209800, [['冠军版 506km', 0], ['荣耀版 605km', 30000], ['四驱旗舰版', 60000]], '🚗');
car('比亚迪', '汉 DM-i', '轿车', 169800, [['精英版', 0], ['尊贵版', 20000], ['旗舰版', 40000]], '🚗');
car('比亚迪', '唐 DM-i', 'SUV', 179800, [['尊贵型', 0], ['尊荣型', 20000], ['旗舰型', 40000]], '🚙');
car('比亚迪', '唐 EV', 'SUV', 229800, [['600km 尊享型', 0], ['730km 旗舰型', 40000]], '🚙');
car('比亚迪', '海豹', '轿车', 189800, [['550km 精英版', 0], ['700km 性能版', 30000], ['四驱性能版', 50000]], '🚗');
car('比亚迪', '海豹06', '轿车', 129800, [['标准续航', 0], ['长续航', 20000]], '🚗');
car('比亚迪', '海鸥', '微型车', 69800, [['305km 活力版', 0], ['405km 飞翔版', 15000]], '🚗');
car('比亚迪', '宋PLUS DM-i', 'SUV', 139800, [['领先型', 0], ['尊贵型', 18000], ['旗舰型', 35000]], '🚙');
car('比亚迪', '秦PLUS DM-i', '轿车', 79800, [['领先型', 0], ['超越型', 15000], ['卓越型', 25000]], '🚗');
car('比亚迪', '元PLUS', 'SUV', 119800, [['430km 领先型', 0], ['510km 超越型', 18000]], '🚙');
car('比亚迪', '仰望 U8', '越野车', 1098000, [['豪华版', 0], ['越野玩家版', 100000]], '🚙');
car('比亚迪', '仰望 U9', '超跑', 1680000, [['标准版', 0], ['赛道版', 300000]], '🏎️');
car('比亚迪', '腾势 D9', 'MPV', 339800, [['DM-i 尊享型', 0], ['EV 旗舰型', 45000]], '🚐');
car('比亚迪', '腾势 Z9', '轿车', 339800, [['插混版', 0], ['纯电版', 20000]], '🚗');
car('比亚迪', '方程豹 豹5', '越野车', 289800, [['探索版', 0], ['云辇旗舰版', 40000]], '🚙');

car('小米', 'SU7', '轿车', 215900, [['标准版', 0], ['Pro 版', 30000], ['Max 版', 84000], ['Ultra 版', 314000]], '🚗');
car('小米', 'YU7', 'SUV', 253900, [['后驱版', 0], ['四驱 Pro 版', 40000], ['高性能 Max 版', 70000]], '🚙');

car('蔚来', 'ET5', '轿车', 298000, [['75kWh 标准续航', 0], ['100kWh 长续航', 58000]], '🚗');
car('蔚来', 'ET7', '轿车', 428000, [['75kWh', 0], ['100kWh', 58000]], '🚗');
car('蔚来', 'ES6', 'SUV', 338000, [['75kWh', 0], ['100kWh', 58000]], '🚙');
car('蔚来', 'ES8', 'SUV', 498000, [['75kWh', 0], ['100kWh', 58000]], '🚙');
car('蔚来', 'EC6', 'SUV', 358000, [['75kWh', 0], ['100kWh', 58000]], '🚙');

car('小鹏', 'G6', 'SUV', 209900, [['580 长续航 Pro', 0], ['755 超长续航 Max', 30000]], '🚙');
car('小鹏', 'G9', 'SUV', 263900, [['570 Pro', 0], ['702 Max', 40000]], '🚙');
car('小鹏', 'P7+', '轿车', 186800, [['长续航 Max', 0], ['超长续航 Max', 20000]], '🚗');
car('小鹏', 'X9', 'MPV', 359800, [['长续航 Pro', 0], ['超长续航 Max', 30000]], '🚐');
car('小鹏', 'MONA M03', '轿车', 119800, [['515 长续航', 0], ['620 超长续航', 15000]], '🚗');

car('理想', 'L6', 'SUV', 249800, [['Pro 版', 0], ['Max 版', 30000]], '🚙');
car('理想', 'L7', 'SUV', 301800, [['Pro 版', 0], ['Max 版', 35000], ['Ultra 版', 55000]], '🚙');
car('理想', 'L8', 'SUV', 321800, [['Pro 版', 0], ['Max 版', 35000], ['Ultra 版', 55000]], '🚙');
car('理想', 'L9', 'SUV', 409800, [['Pro 版', 0], ['Ultra 版', 45000]], '🚙');
car('理想', 'MEGA', 'MPV', 529800, [['标准版', 0], ['家庭特别版', 30000]], '🚐');

car('问界', 'M5', 'SUV', 249800, [['增程后驱版', 0], ['纯电四驱版', 30000]], '🚙');
car('问界', 'M7', 'SUV', 289800, [['Pro 五座版', 0], ['Max 六座版', 30000]], '🚙');
car('问界', 'M9', 'SUV', 469800, [['增程 Max 版', 0], ['纯电 Ultra 版', 60000]], '🚙');

car('极氪', '001', '轿车', 269000, [['后驱 WE 版', 0], ['四驱 YOU 版', 50000]], '🚗');
car('极氪', '007', '轿车', 209900, [['后驱智驾版', 0], ['四驱性能版', 30000]], '🚗');
car('极氪', '009', 'MPV', 439000, [['豪华版', 0], ['光辉版', 350000]], '🚐');
car('极氪', '7X', 'SUV', 229900, [['后驱智驾版', 0], ['四驱长续航版', 30000]], '🚙');

car('零跑', 'C10', 'SUV', 128800, [['增程版', 0], ['纯电版', 5000]], '🚙');
car('零跑', 'C11', 'SUV', 148800, [['增程版', 0], ['纯电版', 8000]], '🚙');
car('零跑', 'C16', 'SUV', 155800, [['增程版', 0], ['纯电版', 8000]], '🚙');

car('大众', '帕萨特', '轿车', 181900, [['精英版', 0], ['豪华版', 20000], ['旗舰版', 35000]], '🚗');
car('大众', '迈腾', '轿车', 174900, [['领先型', 0], ['豪华型', 22000]], '🚗');
car('大众', '途观 L', 'SUV', 199800, [['两驱智享版', 0], ['四驱旗舰版', 45000]], '🚙');
car('大众', '高尔夫', '轿车', 129800, [['Pro 版', 0], ['R-Line 版', 20000]], '🚗');
car('丰田', '凯美瑞', '轿车', 171800, [['精英版', 0], ['豪华版', 20000], ['旗舰版', 35000]], '🚗');
car('丰田', '亚洲龙', '轿车', 199800, [['豪华版', 0], ['尊贵版', 25000]], '🚗');
car('丰田', '汉兰达', 'SUV', 269800, [['两驱精英版', 0], ['四驱尊贵版', 40000]], '🚙');
car('本田', '雅阁', '轿车', 179800, [['舒适版', 0], ['豪华版', 20000], ['尊贵版', 35000]], '🚗');
car('本田', 'CR-V', 'SUV', 189800, [['两驱活力版', 0], ['四驱尊耀版', 40000]], '🚙');
car('日产', '天籁', '轿车', 179800, [['悦享版', 0], ['智尊版', 25000]], '🚗');
car('别克', 'GL8', 'MPV', 239900, [['陆上公务舱', 0], ['ES 陆尊', 50000], ['艾维亚', 80000]], '🚐');

car('奔驰', 'C260L', '轿车', 334800, [['运动版', 0], ['豪华版', 25000]], '🚗');
car('奔驰', 'E300L', '轿车', 449800, [['时尚型', 0], ['豪华型', 30000]], '🚗');
car('奔驰', 'S500L', '轿车', 1838000, [['标准版', 0], ['匠心高定版', 200000]], '🚗');
car('奔驰', 'GLC300L', 'SUV', 478000, [['动感型', 0], ['豪华型', 40000]], '🚙');
car('奔驰', 'GLE450', 'SUV', 799000, [['时尚型', 0], ['豪华型', 80000]], '🚙');
car('奔驰', 'G级', '越野车', 1868000, [['G500', 0], ['G63 AMG', 700000]], '🚙');
car('宝马', '325Li', '轿车', 299900, [['M 运动套装', 0], ['豪华套装', 20000]], '🚗');
car('宝马', '530Li', '轿车', 469900, [['领先型', 0], ['尊享型', 40000]], '🚗');
car('宝马', '740Li', '轿车', 1069000, [['领先型', 0], ['尊享型', 150000]], '🚗');
car('宝马', 'X3', 'SUV', 399000, [['xDrive25i', 0], ['xDrive30i', 50000]], '🚙');
car('宝马', 'X5', 'SUV', 699000, [['xDrive30Li', 0], ['xDrive40Li', 80000]], '🚙');
car('宝马', 'X7', 'SUV', 1039000, [['xDrive40i', 0], ['M60i', 300000]], '🚙');
car('奥迪', 'A4L', '轿车', 321800, [['时尚动感型', 0], ['豪华动感型', 30000]], '🚗');
car('奥迪', 'A6L', '轿车', 459800, [['豪华动感型', 0], ['尊享动感型', 50000]], '🚗');
car('奥迪', 'A8L', '轿车', 828800, [['豪华型', 0], ['尊贵型', 150000]], '🚗');
car('奥迪', 'Q5L', 'SUV', 399800, [['豪华动感型', 0], ['臻选动感型', 40000]], '🚙');
car('奥迪', 'Q7', 'SUV', 699800, [['45 TFSI', 0], ['55 TFSI', 100000]], '🚙');

car('保时捷', '911 Carrera', '超跑', 1298000, [['标准版', 0], ['S 版', 300000], ['Turbo S', 800000]], '🏎️');
car('保时捷', 'Cayenne', 'SUV', 918000, [['标准版', 0], ['Coupe 版', 150000], ['Turbo GT', 800000]], '🚙');
car('保时捷', 'Macan', 'SUV', 578000, [['标准版', 0], ['S 版', 100000], ['GTS', 200000]], '🚙');
car('保时捷', 'Taycan', '轿车', 898000, [['后驱版', 0], ['4S 版', 200000], ['Turbo S', 600000]], '🚗');
car('保时捷', 'Panamera', '轿车', 998000, [['标准版', 0], ['行政加长版', 200000], ['Turbo S', 800000]], '🚗');

car('法拉利', 'SF90 Stradale', '超跑', 3988000, [['标准版', 0], ['Assetto Fiorano', 500000]], '🏎️');
car('法拉利', '296 GTB', '超跑', 2988000, [['标准版', 0], ['Assetto Fiorano', 400000]], '🏎️');
car('法拉利', 'Roma', '超跑', 2388000, [['标准版', 0]], '🏎️');
car('法拉利', 'Purosangue', 'SUV', 4988000, [['标准版', 0], ['定制版', 800000]], '🚙');
car('兰博基尼', 'Huracan EVO', '超跑', 2588000, [['标准版', 0], ['Performante', 600000]], '🏎️');
car('兰博基尼', 'Urus', 'SUV', 3088000, [['标准版', 0], ['Performante', 600000]], '🚙');
car('兰博基尼', 'Revuelto', '超跑', 4388000, [['标准版', 0]], '🏎️');
car('迈凯伦', '720S', '超跑', 3388000, [['标准版', 0]], '🏎️');
car('迈凯伦', 'Artura', '超跑', 2388000, [['标准版', 0]], '🏎️');
car('宾利', '飞驰', '轿车', 2888000, [['标准版', 0], ['Mulliner 定制版', 800000]], '🚗');
car('宾利', '欧陆 GT', '超跑', 3288000, [['标准版', 0], ['敞篷版', 400000]], '🏎️');
car('宾利', '添越', 'SUV', 2988000, [['标准版', 0], ['EWB 雅度版', 500000]], '🚙');
car('劳斯莱斯', '幻影', '轿车', 8888000, [['标准版', 0], ['Extended 长轴版', 1200000]], '🚗');
car('劳斯莱斯', '古思特', '轿车', 5888000, [['标准版', 0], ['Black Badge', 800000]], '🚗');
car('劳斯莱斯', '库里南', 'SUV', 6988000, [['标准版', 0], ['Black Badge', 1000000]], '🚙');
car('劳斯莱斯', '闪灵', '超跑', 5998000, [['标准版', 0]], '🏎️');
car('迈巴赫', 'S680', '轿车', 3288000, [['标准版', 0], ['匠心高定版', 600000]], '🚗');
car('迈巴赫', 'GLS600', 'SUV', 2988000, [['标准版', 0], ['礼乐版', 400000]], '🚙');
car('布加迪', 'Chiron', '超跑', 28000000, [['标准版', 0], ['Super Sport', 5000000]], '🏎️');
car('柯尼塞格', 'Jesko', '超跑', 25000000, [['标准版', 0], ['Absolut', 4000000]], '🏎️');
car('帕加尼', 'Huayra', '超跑', 22000000, [['标准版', 0], ['Roadster', 3000000]], '🏎️');
car('路特斯', 'Eletre', 'SUV', 828000, [['S+ 版', 0], ['R+ 版', 120000]], '🚙');
car('阿斯顿马丁', 'DBX707', 'SUV', 2588000, [['标准版', 0]], '🚙');

/* ==================== 豪宅 ==================== */
function home(city, name, sub, price, layouts, emoji = '🏠') {
  for (const [layout, mult] of layouts) {
    addItem(`${city} ${name} ${layout}`, 'homes', sub, price * mult, emoji, [city, name, layout, '豪宅']);
  }
}

const APT = [['180㎡ 三居', 1], ['260㎡ 四居', 1.4], ['380㎡ 大平层', 2], ['顶层复式', 3.2]];
const VILLA = [['400㎡ 独栋', 1], ['600㎡ 独栋', 1.5], ['800㎡ 庄园', 2.2], ['1200㎡ 庄园', 3.5]];

home('上海', '汤臣一品', '大平层', 180000000, APT, '🏙️');
home('上海', '翠湖天地', '大平层', 120000000, APT, '🏙️');
home('上海', '华侨城苏河湾', '大平层', 80000000, APT, '🏙️');
home('上海', '古北壹号', '大平层', 90000000, APT, '🏙️');
home('上海', '西郊庄园', '独栋别墅', 150000000, VILLA, '🏡');
home('北京', '融创壹号院', '大平层', 70000000, APT, '🏙️');
home('北京', '万柳书院', '大平层', 110000000, APT, '🏙️');
home('北京', '霄云路8号', '公寓', 60000000, APT, '🏙️');
home('北京', '东山墅', '独栋别墅', 140000000, VILLA, '🏡');
home('北京', '远洋LAVIE', '别墅', 90000000, VILLA, '🏡');
home('深圳', '深圳湾1号', '大平层', 120000000, APT, '🏙️');
home('深圳', '华润瑞府', '大平层', 60000000, APT, '🏙️');
home('深圳', '香蜜湖别墅', '独栋别墅', 160000000, VILLA, '🏡');
home('深圳', '东部华侨城天麓', '别墅', 50000000, VILLA, '🏡');
home('广州', '侨鑫汇悦台', '大平层', 60000000, APT, '🏙️');
home('广州', '二沙岛别墅', '独栋别墅', 80000000, VILLA, '🏡');
home('杭州', '武林壹号', '大平层', 50000000, APT, '🏙️');
home('杭州', '云栖玫瑰园', '别墅', 40000000, VILLA, '🏡');
home('杭州', '桃花源', '别墅', 60000000, VILLA, '🏡');
home('成都', '麓湖生态城', '别墅', 30000000, VILLA, '🏡');
home('成都', '交子公馆', '大平层', 25000000, APT, '🏙️');
home('三亚', '亚特兰蒂斯', '海景公寓', 20000000, APT, '🌊');
home('三亚', '海棠湾别墅', '独栋别墅', 50000000, VILLA, '🌴');
home('香港', '天玺', '公寓', 60000000, APT, '🏙️');
home('香港', '傲璇', '公寓', 250000000, APT, '🏙️');
home('香港', '山顶别墅', '独栋别墅', 500000000, VILLA, '🏡');
home('洛杉矶', '比弗利山庄', '别墅', 300000000, VILLA, '🏡');
home('纽约', '曼哈顿亿万富翁大道', '顶层公寓', 400000000, APT, '🏙️');
home('伦敦', '海德公园一号', '公寓', 350000000, APT, '🏙️');
home('迪拜', '棕榈岛别墅', '别墅', 200000000, VILLA, '🌴');
home('新加坡', '乌节路公寓', '公寓', 150000000, APT, '🏙️');
home('摩纳哥', '蒙特卡洛顶层公寓', '顶层公寓', 450000000, APT, '🏙️');
home('东京', '东京塔楼', '公寓', 100000000, APT, '🏙️');

/* ==================== 私人飞机 ==================== */
function jet(name, price, sub = '公务机') {
  addItem(`${name} 全新`, 'jets', sub, price, '✈️', [name, '私人飞机', '全新']);
  addItem(`${name} 二手`, 'jets', sub, price * 0.65, '✈️', [name, '私人飞机', '二手']);
}

jet('湾流 G450', 300000000);
jet('湾流 G550', 400000000);
jet('湾流 G650ER', 600000000);
jet('湾流 G700', 700000000);
jet('湾流 G800', 800000000);
jet('庞巴迪 挑战者 350', 350000000);
jet('庞巴迪 挑战者 650', 450000000);
jet('庞巴迪 环球 5000', 400000000);
jet('庞巴迪 环球 6000', 550000000);
jet('庞巴迪 环球 7500', 750000000);
jet('巴航工业 莱格赛 500', 300000000);
jet('巴航工业 莱格赛 650', 350000000);
jet('巴航工业 普雷托 600', 450000000);
jet('达索 猎鹰 2000LXS', 400000000);
jet('达索 猎鹰 7X', 500000000);
jet('达索 猎鹰 8X', 600000000);
jet('达索 猎鹰 10X', 800000000);
jet('塞斯纳 奖状 CJ4', 180000000);
jet('塞斯纳 奖状 Latitude', 220000000);
jet('塞斯纳 奖状 Longitude', 280000000);
jet('波音 BBJ 737 MAX', 1000000000);
jet('波音 BBJ 787', 1500000000);
jet('空客 ACJ319', 900000000);
jet('空客 ACJ320', 1000000000);
jet('空客 ACJ350', 1600000000);
jet('西锐 SF50', 80000000, '轻型飞机');
jet('赛斯纳 172', 30000000, '轻型飞机');
jet('本田 HondaJet Elite', 250000000);
jet('皮拉图斯 PC-24', 220000000);
jet('派珀 M600', 90000000, '轻型飞机');

/* ==================== 火箭 ==================== */
function rocket(name, price, sub = '运载火箭') {
  addItem(name, 'rockets', sub, price, '🚀', [name, sub, '航天']);
}

rocket('SpaceX 猎鹰9号 单次发射服务', 480000000, '发射服务');
rocket('SpaceX 猎鹰9号 整箭', 350000000, '整箭');
rocket('SpaceX 猎鹰重型 单次发射服务', 950000000, '发射服务');
rocket('SpaceX 猎鹰重型 整箭', 800000000, '整箭');
rocket('SpaceX 星舰 单次发射服务', 2000000000, '发射服务');
rocket('SpaceX 星舰 整箭', 5000000000, '整箭');
rocket('SpaceX 星舰 上面级', 2500000000, '航天器');
rocket('SpaceX 星舰 助推器', 1500000000, '航天器');
rocket('SpaceX 猛禽发动机 单台', 20000000, '发动机');
rocket('SpaceX 龙飞船 货运版', 1500000000, '飞船');
rocket('SpaceX 龙飞船 载人版', 2500000000, '飞船');
rocket('SpaceX 星链卫星 单颗', 30000000, '卫星');
rocket('SpaceX 星链卫星 整批60颗', 1500000000, '卫星');
rocket('中国 长征二号F 单次发射', 300000000, '发射服务');
rocket('中国 长征三号乙 单次发射', 400000000, '发射服务');
rocket('中国 长征五号 单次发射', 600000000, '发射服务');
rocket('中国 长征六号 单次发射', 200000000, '发射服务');
rocket('中国 长征七号 单次发射', 350000000, '发射服务');
rocket('中国 长征八号 单次发射', 250000000, '发射服务');
rocket('中国 长征十一号 单次发射', 150000000, '发射服务');
rocket('中国 快舟一号甲 单次发射', 120000000, '发射服务');
rocket('中国 双曲线一号 单次发射', 100000000, '发射服务');
rocket('中国 朱雀二号 单次发射', 150000000, '发射服务');
rocket('中国 朱雀三号 单次发射', 250000000, '发射服务');
rocket('中国 天龙三号 单次发射', 300000000, '发射服务');
rocket('中国 引力一号 单次发射', 200000000, '发射服务');
rocket('Rocket Lab 电子号 单次发射', 50000000, '发射服务');
rocket('Rocket Lab 电子号 整箭', 30000000, '整箭');
rocket('阿丽亚娜6 单次发射', 600000000, '发射服务');
rocket('联盟2号 单次发射', 300000000, '发射服务');
rocket('火神半人马 单次发射', 800000000, '发射服务');
rocket('新格伦 单次发射', 700000000, '发射服务');
rocket('日本 H3 单次发射', 400000000, '发射服务');
rocket('俄罗斯 安加拉A5 单次发射', 450000000, '发射服务');
rocket('蓝色起源 新谢泼德 亚轨道旅行 单人', 8000000, '太空旅行');
rocket('SpaceX 龙飞船 太空座位 单人', 200000000, '太空旅行');
rocket('轨道太空酒店 7天住宿 单人', 500000000, '太空旅行');
rocket('亚轨道飞行体验 单人', 5000000, '太空旅行');
rocket('SpaceX 猎鹰9号 拼车发射 1kg', 500000, '发射服务');
rocket('Rocket Lab 电子号 拼车发射 1kg', 200000, '发射服务');
rocket('中国 长征八号 拼车发射 1kg', 300000, '发射服务');
rocket('阿丽亚娜6 拼车发射 1kg', 600000, '发射服务');
rocket('SpaceX 星舰 月球货运任务', 6000000000, '发射服务');
rocket('SpaceX 星舰 火星货运任务', 12000000000, '发射服务');
rocket('NASA SLS 单次发射', 3000000000, '发射服务');
rocket('中国 长征九号 单次发射', 2000000000, '发射服务');
rocket('中国 快舟十一号 单次发射', 80000000, '发射服务');
rocket('中国 谷神星一号 单次发射', 90000000, '发射服务');
rocket('中国 力箭一号 单次发射', 130000000, '发射服务');
rocket('俄罗斯 质子-M 单次发射', 500000000, '发射服务');
rocket('欧洲 织女星-C 单次发射', 350000000, '发射服务');
rocket('日本 艾普斯龙 单次发射', 250000000, '发射服务');
rocket('印度 PSLV 单次发射', 200000000, '发射服务');

/* ==================== 海岛 ==================== */
function island(name, price, lease = true, sub = '私人岛屿') {
  addItem(`${name} 永久产权`, 'islands', sub, price, '🏝️', [name, sub, '永久产权']);
  if (lease) {
    addItem(`${name} 长期租赁 99年`, 'islands', sub, Math.round(price * 0.12), '🏝️', [name, sub, '长期租赁']);
  }
}

island('巴哈马 Musha Cay 私人岛', 3500000000);
island('英属维尔京 Necker Island', 850000000);
island('斐济 Laucala 私人岛', 700000000);
island('法属波利尼西亚 Tetiaroa 环礁', 1400000000);
island('斐济 Vatuvara 私人岛', 1000000000);
island('圣基茨 私人岛', 560000000);
island('英属维尔京 Anegada 小岛', 350000000);
island('巴哈马 Harbour Island 地块', 420000000);
island('巴哈马 Exuma 私人岛', 280000000);
island('塞舌尔 Cousine 岛', 500000000);
island('马尔代夫 私人度假岛', 210000000);
island('希腊 Mykonos 私人岛', 350000000);
island('意大利 Capri 附近小岛', 420000000);
island('克罗地亚 私人岛', 180000000);
island('爱尔兰 私人岛', 140000000);
island('加拿大千岛湖 私人岛', 105000000);
island('美国佛罗里达 小岛', 126000000);
island('智利 私人岛', 154000000);
island('巴拿马 私人岛', 84000000);
island('泰国 私人岛', 70000000);
island('印尼巴厘岛周边 私人岛', 112000000);
island('菲律宾 私人岛', 56000000);
island('澳大利亚大堡礁 珊瑚礁岛', 210000000);
island('新西兰 私人岛', 140000000);
island('日本濑户内海 私人岛', 105000000);
island('韩国济州岛 私人岛', 175000000);
island('中国千岛湖 私人岛', 80000000, false);
island('中国洱海 私人岛屿', 60000000, false);
island('中国海南 私人岛', 200000000, false);
island('迪拜世界岛 私人岛', 700000000);
island('阿布扎比 私人岛', 1050000000);
island('沙特 NEOM 岛屿', 1400000000);
island('摩纳哥 私人岛', 2100000000);
island('巴哈马 私人岛 二期', 1750000000);

/* ==================== 分类补量（同款不同规格） ==================== */
const TOPUP_TARGETS = {
  digital: 2500,
  snacks: 1700,
  fresh: 800,
  toys: 900,
  daily: 800,
  appliances: 800
};
const TOPUP_RULES = {
  digital: [['国行版', 1.0], ['官翻版', 0.85], ['套装版', 1.08]],
  snacks: [['分享装', 2.2], ['家庭装', 3.5], ['囤货装', 5.5]],
  fresh: [['精品装', 1.2], ['礼盒装', 1.6], ['产地直发', 1.05]],
  toys: [['限定版', 1.3], ['典藏版', 1.5], ['豪华版', 1.8], ['再版', 1.0]],
  daily: [['家庭装', 2.2], ['补充装', 1.5], ['囤货装', 3.8], ['量贩装', 4.5]],
  appliances: [['套装版', 1.1], ['含安装服务', 1.06], ['延保三年', 1.05]]
};

function countCategory(cat) {
  let n = 0;
  for (const p of products) if (p.category === cat) n += 1;
  return n;
}

// 已带规格/版本词的商品不再叠加补量后缀，避免出现「限定版 限定版」「标准版 高配版」
const VARIANT_WORDS = ['限定版', '典藏版', '豪华版', '再版', '国行版', '官翻版', '分享装', '家庭装', '囤货装', '量贩装', '补充装', '精品装', '礼盒装', '产地直发', '高配版', '旗舰版'];
// 「补充装」只适用于可补充的耗材类
const REFILL_SUBS = new Set(['洗护', '清洁', '口腔护理', '纸品', '家居用品']);

function hasVariantWord(name) {
  return VARIANT_WORDS.some((w) => name.includes(w));
}

for (const [cat, target] of Object.entries(TOPUP_TARGETS)) {
  const bases = products.filter((p) => p.category === cat && !hasVariantWord(p.name));
  if (!bases.length) continue;
  const rules = TOPUP_RULES[cat];
  for (let round = 0; round < rules.length && countCategory(cat) < target; round++) {
    const rule = rules[round];
    for (const base of bases) {
      if (countCategory(cat) >= target) break;
      if (base.name.includes(rule[0])) continue;
      if (rule[0] === '补充装' && !REFILL_SUBS.has(base.sub)) continue;
      addItem(
        `${base.name} ${rule[0]}`,
        cat,
        base.sub,
        base.price * rule[1],
        base.emoji,
        base.tags
      );
    }
  }
}

/* ==================== 输出 ==================== */
function percentile(sorted, p) {
  if (!sorted.length) return 0;
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * p)));
  return sorted[idx];
}

function fmtMoney(n) {
  if (n >= 100000000) return (n / 100000000).toFixed(2) + ' 亿元';
  if (n >= 10000) return (n / 10000).toFixed(2) + ' 万元';
  return n + ' 元';
}

fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(
  path.join(OUT_DIR, 'categories.js'),
  'window.MUSK_CATEGORIES = ' + JSON.stringify(CATEGORIES, null, 2) + ';\n',
  'utf8'
);

const body = products.map((p) => JSON.stringify(p)).join(',\n');
const fileContent =
  '/* 花光马斯克的钱 · 商品数据库（自动生成，请勿手动修改） */\n' +
  'window.MUSK_PRODUCTS = [\n' +
  body +
  '\n];\n';
fs.writeFileSync(path.join(OUT_DIR, 'products.js'), fileContent, 'utf8');

const fileSize = fs.statSync(path.join(OUT_DIR, 'products.js')).size;
const prices = products.map((p) => p.price).sort((a, b) => a - b);
const total = products.length;

const catLines = CATEGORIES.map((c) => {
  const n = countCategory(c.id);
  return `| ${c.name} | \`${c.id}\` | ${n} | ${((n / total) * 100).toFixed(1)}% |`;
}).join('\n');

const subCounts = {};
for (const p of products) {
  const key = p.category + '/' + p.sub;
  subCounts[key] = (subCounts[key] || 0) + 1;
}
const subLines = Object.entries(subCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 60)
  .map(([k, v]) => `| ${k} | ${v} |`)
  .join('\n');

const buckets = [
  ['1 ~ 49 元', 1, 49],
  ['50 ~ 199 元', 50, 199],
  ['200 ~ 999 元', 200, 999],
  ['1000 ~ 9999 元', 1000, 9999],
  ['1 万 ~ 9.9 万', 10000, 99999],
  ['10 万 ~ 99.9 万', 100000, 999999],
  ['100 万 ~ 999 万', 1000000, 9999999],
  ['1000 万 ~ 9999 万', 10000000, 99999999],
  ['1 亿以上', 100000000, Infinity]
];
const bucketLines = buckets.map(([label, lo, hi]) => {
  const n = products.filter((p) => p.price >= lo && p.price <= hi).length;
  return `| ${label} | ${n} | ${((n / total) * 100).toFixed(1)}% |`;
}).join('\n');

const cheapest = products.reduce((a, b) => (a.price <= b.price ? a : b));
const mostExpensive = products.reduce((a, b) => (a.price >= b.price ? a : b));

const report = `# 「花光马斯克的钱」商品数据库生成报告

生成时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}
生成脚本：\`tools/gen-products.mjs\`（固定数据表，可重复运行，结果稳定）

## 总览

- 商品总数：**${total}** 条
- 数据文件：\`src/data/products.js\`（${(fileSize / 1024 / 1024).toFixed(2)} MB）
- 分类数量：${CATEGORIES.length} 个
- 价格区间：${fmtMoney(prices[0])} ~ ${fmtMoney(prices[prices.length - 1])}
- 价格中位数：${fmtMoney(percentile(prices, 0.5))}

## 各分类数量

| 分类 | id | 数量 | 占比 |
| --- | --- | --- | --- |
${catLines}

## 价格分布

| 价格区间 | 数量 | 占比 |
| --- | --- | --- |
${bucketLines}

## 价格分位数（元）

| P10 | P25 | P50 | P75 | P90 | P99 |
| --- | --- | --- | --- | --- | --- |
| ${percentile(prices, 0.1)} | ${percentile(prices, 0.25)} | ${percentile(prices, 0.5)} | ${percentile(prices, 0.75)} | ${percentile(prices, 0.9)} | ${percentile(prices, 0.99)} |

## 极值条目

- 最便宜：${cheapest.name}（${cheapest.price} 元，\`${cheapest.id}\`）
- 最昂贵：${mostExpensive.name}（${mostExpensive.price} 元，\`${mostExpensive.id}\`）

## 二级分类数量（前 60）

| 分类/二级分类 | 数量 |
| --- | --- |
${subLines}

## 数据契约校验

- \`window.MUSK_PRODUCTS\` 传统脚本挂载，可直接在 file:// 下加载
- id 唯一且递增：\`p00001\` 起始
- category 均属于 12 个合法分类
- price 均为正整数（人民币）
- 每条商品均有名称、二级分类、emoji 缩略图与搜索标签
`;

fs.writeFileSync(REPORT_PATH, report, 'utf8');

/* 自检 */
const vm = await import('node:vm');
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(OUT_DIR, 'products.js'), 'utf8'), sandbox);
const data = sandbox.window.MUSK_PRODUCTS;
if (!Array.isArray(data)) throw new Error('MUSK_PRODUCTS 不是数组');
if (data.length < 9000) throw new Error('商品总数不足 9000：' + data.length);
const ids = new Set();
const names = new Set();
for (const p of data) {
  if (!/^p\d{5}$/.test(p.id)) throw new Error('非法 id: ' + p.id);
  if (ids.has(p.id)) throw new Error('重复 id: ' + p.id);
  ids.add(p.id);
  if (names.has(p.name)) throw new Error('重复名称: ' + p.name);
  names.add(p.name);
  if (!CATEGORY_IDS.has(p.category)) throw new Error('非法分类: ' + p.category);
  if (!Number.isInteger(p.price) || p.price <= 0) throw new Error('非法价格: ' + p.name);
  if (!p.name || !p.sub || !p.emoji) throw new Error('字段缺失: ' + p.id);
  if (!Array.isArray(p.tags) || !p.tags.length) throw new Error('标签缺失: ' + p.id);
}
console.log('OK 总数=' + data.length + ' 文件=' + (fileSize / 1024 / 1024).toFixed(2) + 'MB');
for (const c of CATEGORIES) console.log(c.name + ': ' + countCategory(c.id));

