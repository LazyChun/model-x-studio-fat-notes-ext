import {useSyncExternalStore} from 'react';
import type {PartId} from './parts';

export type StudioLocale = 'zh_CN' | 'en_US';

const en: Record<string, string> = {
  'meta.title': 'Model X Studio',
  'stage.aria': 'Interactive Model X studio',
  'components.aria': 'Components',
  'components.title': 'Components',
  'components.hide': 'Hide components',
  'tools.aria': 'View controls',
  'tools.components': 'Components',
  'tools.components.toggle': 'Toggle components',
  'tools.zoomIn': 'Zoom in',
  'tools.zoomOut': 'Zoom out',
  'tools.reset': 'Reset view',
  'tools.rotate': 'Auto rotate',
  'tools.rotate.toggle': 'Toggle auto rotation',
  'tools.fullscreen': 'Fullscreen',
  'tools.fullscreen.toggle': 'Toggle fullscreen',
  'tools.about': 'About this model',
  'tools.more': 'More view controls',
  'detail.aria': 'Component details',
  'detail.close': 'Close details',
  'detail.overview': 'Overview',
  'detail.working': 'How it works',
  'detail.illustrative': 'Illustrative',
  'detail.pieces': 'Individual pieces',
  'detail.choose': 'Choose an individual mesh piece',
  'detail.allPieces': 'All {count} pieces',
  'detail.allInSystem': 'All pieces in this system',
  'detail.isolate': 'Isolate component',
  'detail.isolatePiece': 'Isolate piece',
  'detail.showAll': 'Show everything',
  'detail.source': 'Tesla documentation',
  'dock.aria': 'Assembly controls',
  'dock.assemble': 'Assemble',
  'dock.assemble.title': 'Assemble',
  'dock.assemble.aria': 'Assemble vehicle',
  'dock.explode': 'Explode',
  'dock.pieces': '{count} pieces',
  'dock.all': 'All parts',
  'dock.all.title': 'Separate all pieces',
  'dock.all.aria': 'Separate all pieces',
  'dock.labels': 'Labels',
  'dock.labels.aria': 'Show labels',
  'about.aria': 'About this model',
  'about.title': 'About the model',
  'about.close': 'Close model information',
  'about.controls': 'Drag to orbit. Pinch or scroll to zoom. Select a component for details; use the slider to separate the car.',
  'about.before': 'Pre-refresh Model X by',
  'about.after': 'The {count} mesh pieces are modeled geometry, not a complete Tesla parts catalog. Battery, drive and suspension are illustrative. Not affiliated with Tesla.',
  'scene.aria': 'Rotatable exploded 3D vehicle model',
  'scene.loading': 'Loading the detailed Model X…',
  'scene.error.title': 'The 3D view needs a moment.',
  'scene.error.reload': 'Reload the view',
  'scene.modeledPiece': 'Modeled piece',
  'scene.inspectPart': 'Inspect {name}',
  'scene.inspectPiece': 'Inspect piece {n}: {name}',
  'error.webgl': 'Your browser could not start the 3D view.',
  'error.load': 'The detailed car could not load. Reload to try again.',
  'error.context': 'The graphics connection was interrupted. Please reload the view.',
  'piece.explain.fallback': 'This is a separate piece of the source model. Its label describes the visible geometry; an exact Tesla service-part identity is not supplied.',
};

const zh: Record<string, string> = {
  'meta.title': 'Model X 工作室',
  'stage.aria': '交互式 Model X 工作室',
  'components.aria': '部件',
  'components.title': '部件',
  'components.hide': '隐藏部件',
  'tools.aria': '视图控制',
  'tools.components': '部件',
  'tools.components.toggle': '显示或隐藏部件',
  'tools.zoomIn': '放大',
  'tools.zoomOut': '缩小',
  'tools.reset': '重置视图',
  'tools.rotate': '自动旋转',
  'tools.rotate.toggle': '开关自动旋转',
  'tools.fullscreen': '全屏',
  'tools.fullscreen.toggle': '切换全屏',
  'tools.about': '关于此模型',
  'tools.more': '更多视图控制',
  'detail.aria': '部件详情',
  'detail.close': '关闭详情',
  'detail.overview': '概览',
  'detail.working': '工作原理',
  'detail.illustrative': '示意',
  'detail.pieces': '单个零件',
  'detail.choose': '选择单个网格零件',
  'detail.allPieces': '全部 {count} 个零件',
  'detail.allInSystem': '此系统的全部零件',
  'detail.isolate': '隔离部件',
  'detail.isolatePiece': '隔离零件',
  'detail.showAll': '显示全部',
  'detail.source': '特斯拉文档',
  'dock.aria': '装配控制',
  'dock.assemble': '组装',
  'dock.assemble.title': '组装',
  'dock.assemble.aria': '组装车辆',
  'dock.explode': '拆解',
  'dock.pieces': '{count} 个零件',
  'dock.all': '全部分解',
  'dock.all.title': '分离全部零件',
  'dock.all.aria': '分离全部零件',
  'dock.labels': '标签',
  'dock.labels.aria': '显示标签',
  'about.aria': '关于此模型',
  'about.title': '关于模型',
  'about.close': '关闭模型说明',
  'about.controls': '拖动旋转。捏合或滚动缩放。选择部件查看详情；用滑块拆解车辆。',
  'about.before': '预改款 Model X，作者',
  'about.after': '这 {count} 个网格是建模几何，不是完整的特斯拉零件目录。电池、驱动和悬架为示意。与特斯拉无关联。',
  'scene.aria': '可旋转、可拆解的三维车辆模型',
  'scene.loading': '正在加载 Model X 细节…',
  'scene.error.title': '三维视图暂时无法显示。',
  'scene.error.reload': '重新加载视图',
  'scene.modeledPiece': '建模零件',
  'scene.inspectPart': '查看{name}',
  'scene.inspectPiece': '查看零件 {n}：{name}',
  'error.webgl': '当前浏览器无法启动三维视图。',
  'error.load': '车辆模型未能加载。请重新加载后再试。',
  'error.context': '图形连接已中断。请重新加载视图。',
  'piece.explain.fallback': '这是源模型中的一块独立网格。标签描述的是可见几何，并未提供确切的特斯拉维修零件编号。',
  'piece.name.Alloy wheel detail': '铝合金轮毂细节',
  'piece.name.Body trim and seals': '车身饰条与密封',
  'piece.name.Brake disc': '制动盘',
  'piece.name.Chrome trim': '镀铬饰条',
  'piece.name.Exterior detail': '外观细节',
  'piece.name.Falcon wing door panel': '鹰翼门板',
  'piece.name.Fender / quarter panel': '翼子板',
  'piece.name.Front bumper': '前保险杠',
  'piece.name.Front door panel': '前门板',
  'piece.name.Front lighting element': '前灯元件',
  'piece.name.Glazing': '玻璃',
  'piece.name.Hood': '引擎盖',
  'piece.name.Interior trim and seating': '内饰与座椅',
  'piece.name.Liftgate panel': '尾门板',
  'piece.name.Lower trim and liner': '下饰板与衬里',
  'piece.name.Rear bumper': '后保险杠',
  'piece.name.Rear lighting element': '尾灯元件',
  'piece.name.Side mirror': '外后视镜',
  'piece.name.Tesla emblem': '特斯拉徽标',
  'piece.name.Tire and tread': '轮胎与胎面',
  'piece.name.Wheel fastener': '车轮紧固件',
  'piece.side.left': '左',
  'piece.side.right': '右',
  'piece.side.front': '前',
  'piece.side.rear': '后',
  'piece.explain.Hood': '引擎盖封闭前备箱。外表面延续车身的气动外形，铰链和锁扣用来打开储物空间。',
  'piece.explain.Front bumper': '前保险杠饰板构成车头，并围住下方开口。可见的饰板与其后方的碰撞结构是分开的。',
  'piece.explain.Rear bumper': '后保险杠饰板收束车身后下部。它是可见的外板，不是藏在下面的防撞梁。',
  'piece.explain.Liftgate panel': '尾门关闭后部货舱开口。它带有外饰，并与铰链、电动撑杆和锁扣一起提供行李箱入口。',
  'piece.explain.Front door panel': '这块板属于常规铰接的前门。完整车门还包含玻璃、锁扣、密封条和内饰。',
  'piece.explain.Falcon wing door panel': '这块板属于后门总成。实车上两处铰链协调它向上折叠；这里分开的是几何体，并不模拟真实的铰链轨迹。',
  'piece.explain.Fender / quarter panel': '这块外板塑造轮拱周围的车身。它的位置帮助围住轮舱，并把轮廓接到相邻的车门和保险杠上。',
  'piece.explain.Glazing': '这是一块建模的车辆玻璃。按位置不同，它提供前方、侧方、后方或顶部视野。这里的深色是渲染材质。',
  'piece.explain.Body trim and seals': '饰条收束板件边缘和过渡；密封条帮助挡住风雨和噪声。这个网格是视觉表现，不是单独核验过的替换零件。',
  'piece.explain.Rear lighting element': '尾灯元件用来表明车辆存在和行驶意图。模型把灯的外形分开了，但没有标明每一片透镜的电路功能。',
  'piece.explain.Front lighting element': '这个外形属于前灯总成。完整总成由透镜、光源和反射器组成，用来照亮路面或表明车辆存在。',
  'piece.explain.Tesla emblem': '车外徽标标明制造者。它是装饰徽章，不属于驱动或车身结构。',
  'piece.explain.Side mirror': '后视镜提供车辆侧后方的视野。完整总成包括镜片、外壳和调节机构。',
  'piece.explain.Chrome trim': '这条金属饰条收束外表面的边缘或点缀。它的外观和位置反映的是源模型所表现的较早 Model X。',
  'piece.explain.Lower trim and liner': '这块建模零件属于下车身饰板或衬里。这类零件覆盖外露区域，并帮助处理飞溅、杂物和气流。',
  'piece.explain.Tire and tread': '轮胎是车辆与路面的接触面。橡胶、胎面和气压承受载荷，并影响抓地、舒适性和滚动阻力。',
  'piece.explain.Brake disc': '制动盘随车轮转动。摩擦制动时刹车片夹住它，把运动变成热量，并补充电机的再生制动。',
  'piece.explain.Wheel fastener': '车轮紧固件把车轮固定到轮毂上。这是源作者的几何，不提供经过核验的螺纹规格或维修扭矩。',
  'piece.explain.Alloy wheel detail': '这个网格是建模铝合金轮毂的一部分。轮毂支承轮胎，并在轮胎与轮毂之间传递载荷；轮辐连接轮心和轮辋。',
  'piece.explain.Interior trim and seating': '这是建模乘员舱的一块。源模型把座椅和饰板分成网格，没有赋予制造商零件号。',
  'piece.explain.Exterior detail': '这是源模型中的一块独立外观网格。它确切的维修零件身份未经核验；请结合它所在的位置和系统概览来理解。',
};

const zhPart: Record<PartId, {name: string; category: string; description: string; principle: string; specs: [string, string][]}> = {
  body: {
    name: '车身与结构',
    category: '外观',
    description: '车身把整车连成一体：封闭的乘员空间、前后溃缩区，以及引导气流绕过车身的光滑外壳。',
    principle: '结构把载荷绕过座舱传递，引擎盖和尾门则分别通向前后储物空间。',
    specs: [['作用', '结构与防护'], ['位置', '车身外部']],
  },
  glass: {
    name: '全景玻璃',
    category: '外观',
    description: '宽大的前风挡向上延伸到前排座椅上方，让座舱看到更多车外景色。',
    principle: '前风挡和侧窗提供车辆四周的视野。顶部玻璃随鹰翼门一起运动。',
    specs: [['作用', '视野与围合'], ['位置', '座舱上部']],
  },
  doors: {
    name: '车门与鹰翼门',
    category: '外观',
    description: '两处铰链让每扇后门向上打开。车门在升起时折叠，即使空间较窄也能上下车。',
    principle: '传感器检查障碍物，电动铰链协调开启路径。可用净空决定车门能开到多高。',
    specs: [['运动', '双铰链'], ['操作', '电动']],
  },
  cabin: {
    name: '乘员舱',
    category: '内饰',
    description: '乘员空间位于电池上方。座椅、约束装置、控制和显示屏构成日常接触的部分。',
    principle: '平整的电动平台为多种座椅布局留出空间。导入的模型包含座椅和饰板。座舱反映的是较早的原车；实际座椅和控制会因年款与配置而不同。',
    specs: [['此处所示', '原模型内饰'], ['位置', '电池上方']],
  },
  battery: {
    name: '高压电池',
    category: '能源',
    description: '液冷锂离子电池储存驱动车辆的能量。它位于座舱下方，为电驱动单元供电。',
    principle: '加速时电能流向电机。再生制动时，电机可以把车辆动能转回存入电池的能量。',
    specs: [['化学体系', '锂离子'], ['冷却', '液冷']],
  },
  drive: {
    name: '电驱动单元',
    category: '动力',
    description: '电机把储存的能量变成车轮扭矩。这个双电机示意在前轴和后轴各放一个驱动单元。',
    principle: '逆变器控制每台电机，固定齿比减速器把转动传到车轮。电机也能通过再生制动帮助减速。',
    specs: [['布局', '前 + 后'], ['变速', '单速'], ['配置', '双电机']],
  },
  suspension: {
    name: '自适应悬架',
    category: '底盘',
    description: '空气弹簧支承车身，自适应减振器控制车身运动。系统可以调节离地间隙，以及车辆对路面的响应。',
    principle: '前双叉臂和后多连杆引导每个车轮。气压变化支承高度，阻尼则在舒适与操控之间取得平衡。',
    specs: [['弹簧', '空气'], ['阻尼', '自适应'], ['高度', '可调']],
  },
  wheels: {
    name: '车轮与制动',
    category: '底盘',
    description: '轮胎是车辆与路面的接触面。每个车轮后方都有通风制动盘和卡钳，提供摩擦制动。',
    principle: '再生制动通过电机回收能量。摩擦制动提供额外制动力，ABS 帮助控制车轮打滑。',
    specs: [['制动', '通风盘'], ['控制', '四轮 ABS'], ['能量回收', '再生制动']],
  },
};

const catalogs: Record<StudioLocale, Record<string, string>> = {zh_CN: zh, en_US: en};
const listeners = new Set<() => void>();

export function normalizeLocale(value: string | null | undefined): StudioLocale {
  const text = String(value || '').toLowerCase().replace(/-/g, '_');
  if (text.startsWith('en')) return 'en_US';
  if (text.startsWith('zh')) return 'zh_CN';
  return 'en_US';
}

function readInitialLocale(): StudioLocale {
  if (typeof window === 'undefined') return 'en_US';
  const params = new URLSearchParams(window.location.search);
  const fromQuery = params.get('locale') || params.get('lang');
  if (fromQuery) return normalizeLocale(fromQuery);
  if (window.parent !== window) return 'zh_CN';
  return 'en_US';
}

let current: StudioLocale = readInitialLocale();

function fill(template: string, values?: Record<string, string | number>): string {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (token, key) => {
    const value = values[key];
    return value == null ? token : String(value);
  });
}

export function getLocale(): StudioLocale {
  return current;
}

export function translate(locale: StudioLocale, key: string, values?: Record<string, string | number>): string {
  const table = catalogs[locale];
  const raw = table[key] ?? en[key];
  if (raw == null) return key;
  return fill(raw, values);
}

export function t(key: string, values?: Record<string, string | number>): string {
  return translate(current, key, values);
}

function applyDocumentLocale(locale: StudioLocale) {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = locale === 'zh_CN' ? 'zh-CN' : 'en';
  document.title = translate(locale, 'meta.title');
}

export function setLocale(value: string) {
  const next = normalizeLocale(value);
  if (next === current) {
    applyDocumentLocale(next);
    return;
  }
  current = next;
  applyDocumentLocale(next);
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      /* ignore */
    }
  });
}

export function subscribeLocale(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function partField(id: PartId, field: 'name' | 'category' | 'description' | 'principle', fallback: string): string {
  if (current !== 'zh_CN') return fallback;
  return zhPart[id]?.[field] ?? fallback;
}

export function partSpec(id: PartId, index: number, which: 0 | 1, fallback: string): string {
  if (current !== 'zh_CN') return fallback;
  return zhPart[id]?.specs[index]?.[which] ?? fallback;
}

export function partManual(source: string): string {
  const segment = current === 'zh_CN' ? 'zh_cn' : 'en_us';
  return source.replace('/en_us/', `/${segment}/`);
}

export function pieceLabel(label: string): string {
  if (!label || current !== 'zh_CN') return label;
  return label.split(' · ').map((part, index) => {
    const key = index === 0 ? `piece.name.${part}` : `piece.side.${part}`;
    return zh[key] ?? part;
  }).join(' · ');
}

export function pieceExplain(name: string): string | undefined {
  if (current !== 'zh_CN') return undefined;
  return zh[`piece.explain.${name}`];
}

function onHostLocale(event: MessageEvent) {
  if (event.source !== window.parent) return;
  const data = event.data;
  if (!data || data.source !== 'fat-notes-host' || data.type !== 'locale') return;
  if (typeof data.locale !== 'string') return;
  setLocale(data.locale);
}

if (typeof window !== 'undefined') {
  applyDocumentLocale(current);
  window.addEventListener('message', onHostLocale);
  if (window.parent !== window) {
    window.parent.postMessage({source: 'model-x-studio', type: 'ready'}, '*');
  }
}

export function useStudioI18n() {
  const locale = useSyncExternalStore(subscribeLocale, getLocale, getLocale);
  return {
    locale,
    t: (key: string, values?: Record<string, string | number>) => translate(locale, key, values),
  };
}
