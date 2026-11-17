import type { GameDef } from './types';

/**
 * A few hand-made mini-games, each tied to the events and people it is about. Story and history
 * text are paraphrased from the sources cited on those records; the games simplify, the history
 * panel says what really happened.
 */
export const GAMES: GameDef[] = [
  {
    id: 'red-cliffs',
    title: { en: 'Red Cliffs · The East Wind', zh: '赤壁 · 东风' },
    kicker: { en: 'Yangtze River, winter 208', zh: '建安十三年冬 · 长江赤壁' },
    targets: ['ev-battle-of-red-cliffs', 'person-zhuge-liang', 'person-sun-quan', 'person-cao-cao'],
    accent: '#ff8a3d',
    goal: {
      en: 'Burn the enemy fleet. Bring your crews home.',
      zh: '火烧曹军战船，让士卒平安撤回。',
    },
    steps: [
      {
        title: { en: 'Wait for the wind', zh: '等东风' },
        art: 'wind',
        text: { en: 'The north wind would blow you back. Wait until the compass says south-east.', zh: '北风会把火船吹回来。等罗盘显示“东南风”。' },
      },
      {
        title: { en: 'Set sail', zh: '扬帆' },
        art: 'sail',
        text: { en: 'Send all ten fire ships out together.', zh: '十艘火船一齐出发。' },
        keys: { en: 'Space', zh: '空格' },
      },
      {
        title: { en: 'Fire at the gold line', zh: '金线齐发火' },
        art: 'fire',
        text: { en: 'When the ships reach the gold line, set them all alight at once.', zh: '火船驶到金线时，同时点火。' },
        keys: { en: 'F', zh: 'F' },
      },
    ],
    story: [
      {
        en: "Cao Cao's great fleet lies on the north bank at Wulin, its warships moored bow to stern. The allies of Sun Quan and Liu Bei are badly outnumbered.",
        zh: '曹操大军屯于江北乌林，战船首尾相接。孙权、刘备联军兵少，难与久持。',
      },
      {
        en: 'Huang Gai has loaded ten warships with dry reeds soaked in oil, hidden under curtains, with surrender banners flying. Cao Cao expects him to defect.',
        zh: '黄盖取蒙冲斗舰十艘，满载薪草、灌以膏油，外裹帷幕，上插牙旗，并先送降书，诈称来降。',
      },
      {
        en: 'Wait for the south-east wind. Set sail, and set the ships alight when they are about two li (≈ 1 km) from the enemy, then let wind and fire do the rest.',
        zh: '等东南风起再出发；在距敌约“二里余”处点火，借风纵火，烧尽北船。',
      },
    ],
    controls: [
      { en: 'Tap a fire ship (or Space) to set sail; the wind carries it.', zh: '点击岸边火船（或按空格）扬帆，船随风走。' },
      { en: 'Tap a sailing ship to light it, or “Light all” (F) to fire them together.', zh: '点击航行中的火船点火，或按“齐发火”（F）同时点燃。' },
      { en: 'Lit too early, a ship burns out or is sunk; too late, its crew cannot escape.', zh: '点火太早会烧尽或被射沉；太晚，船上士卒来不及登走舸撤离。' },
    ],
    history: [
      {
        en: 'Records of the Three Kingdoms (Biography of Zhou Yu, with Pei Songzhi’s notes): Huang Gai sailed ten ships packed with oiled kindling under a feigned surrender, and, with a strong south-east wind, lit them all at once a little over two li from the enemy.',
        zh: '据《三国志·周瑜传》及裴松之注引《江表传》：黄盖以十艘战船满载膏油薪草，诈降而来；时东南风急，至距曹军二里余处同时发火，火烈风猛，烧尽北船，延及岸上营落。',
      },
      {
        en: 'The sources say Cao’s ships were moored bow to stern, which let the fire spread. The famous “chained ships” stratagem comes from the later novel Romance of the Three Kingdoms.',
        zh: '史书只说曹军战船“首尾相接”，火势因此蔓延；“铁索连环”“借东风”则出自后世《三国演义》的演绎。',
      },
      {
        en: 'Cao Cao withdrew north. Sun Quan and Liu Bei held the south, and the three-way division of China took shape.',
        zh: '此战后曹操北还，孙、刘据有江南，三国鼎立之势由此奠定。',
      },
    ],
    load: () => import('./red-cliffs/RedCliffs'),
  },
  {
    id: 'vostok',
    title: { en: 'Vostok 1 · Into Orbit', zh: '东方一号 · 入轨' },
    kicker: { en: 'Baikonur, 12 April 1961', zh: '1961年4月12日 · 拜科努尔' },
    targets: ['ev-vostok-1', 'ev-sputnik-1'],
    accent: '#8cc4ff',
    goal: {
      en: 'Reach orbit. Land near Saratov.',
      zh: '送加加林入轨，再降落在萨拉托夫。',
    },
    steps: [
      {
        title: { en: 'Follow the gold', zh: '跟住金线' },
        art: 'lean',
        text: { en: 'After lift-off, keep the white needle on the gold guide needle.', zh: '升空后，让白色指针始终贴住金色参考指针。' },
        keys: { en: 'Hold ← / →', zh: '按住 ← / →' },
      },
      {
        title: { en: 'Cut when green', zh: '变绿即关机' },
        art: 'cut',
        text: { en: 'In the last stage, cut the engine as soon as the orbit turns green.', zh: '末级工作时，轨道一变绿就立刻关机。' },
        keys: { en: 'Space', zh: '空格' },
      },
      {
        title: { en: 'Come home', zh: '制动返回' },
        art: 'retro',
        text: { en: 'Over Africa, fire the retro-rocket when the red mark reaches the gold target.', zh: '飞到非洲上空时，在红色落点移到金色目标上时点火制动。' },
        keys: { en: 'Space', zh: '空格' },
      },
    ],
    story: [
      {
        en: 'Yuri Gagarin sits in the Vostok capsule on top of an R-7 rocket on the Kazakh steppe. No human has ever flown in space.',
        zh: '哈萨克草原上，尤里·加加林坐在 R-7 火箭顶端的东方号飞船里。此前从没有人进入过太空。',
      },
      {
        en: 'Fly the ascent: pitch over from vertical toward the horizon so the rocket gains speed, not just height. Watch the predicted orbit grow, and cut the engine when it is safe and low.',
        zh: '你来操纵上升段：从垂直逐渐压低俯仰角，把推力用在水平速度上，而不只是爬高。盯住预测轨道，等它安全又不过高时关机。',
      },
      {
        en: 'Then ride one orbit around the Earth and fire the retro-rocket at the right moment to come down near Saratov.',
        zh: '入轨后绕地球一圈，在恰当的时刻点燃制动火箭，降落在萨拉托夫附近。',
      },
    ],
    controls: [
      { en: '← / → (or hold the left / right half of the screen): pitch down / up.', zh: '← / →（或按住屏幕左 / 右半边）：压低 / 抬高俯仰。' },
      { en: 'Space (or the button): cut the engine; later, fire the retro-rocket.', zh: '空格（或按钮）：关机；入轨后用于制动点火。' },
      { en: 'Target orbit: perigee above 150 km, apogee below 400 km. Time slows to real speed near the end of the burn.', zh: '目标轨道：近地点高于 150 公里，远地点低于 400 公里。临近关机时时间会恢复为实时。' },
    ],
    history: [
      {
        en: 'Vostok 1 lifted off at 06:07 UTC. Gagarin’s “Poyekhali!” (“Let’s go!”) became famous. The four strap-on boosters fell away about two minutes in, a shape known as the “Korolev cross”.',
        zh: '东方一号于世界时 06:07 升空，加加林一声“Поехали！”（我们出发了！）广为流传。约两分钟后四台助推器分离，散开成著名的“科罗廖夫十字”。',
      },
      {
        en: 'The upper stage burned slightly long, so the orbit (about 169 × 327 km) was higher than planned: had the retro-rocket failed, natural decay would have taken longer than the ten days of supplies aboard.',
        zh: '末级关机比计划略晚，轨道约为 169 × 327 公里，高于设计值；若制动火箭失灵，靠大气阻力自然坠落所需的时间会超过船上 10 天的给养。',
      },
      {
        en: 'The retro-rocket fired over Africa at 07:25 UTC. Gagarin ejected at about 7 km and parachuted down near Smelovka in the Saratov region, 108 minutes after launch.',
        zh: '世界时 07:25 飞船在非洲上空制动点火。加加林在约 7 公里高度弹射，跳伞降落在萨拉托夫州斯梅洛夫卡村附近，全程 108 分钟。',
      },
    ],
    load: () => import('./vostok/Vostok'),
  },
  {
    id: 'orchid-pavilion',
    title: { en: 'Orchid Pavilion · The Brush', zh: '兰亭 · 习字' },
    kicker: { en: 'Kuaiji, spring 353', zh: '永和九年暮春 · 会稽山阴' },
    targets: ['ev-orchid-pavilion-gathering', 'person-wang-xizhi'],
    accent: '#d8473b',
    story: [
      {
        en: 'On the third day of the third month, Wang Xizhi and forty friends gathered at the Orchid Pavilion to drink and write poems. His preface to their poems became the most admired piece of running script in China.',
        zh: '永和九年三月初三，王羲之与谢安等四十余人修禊于兰亭，曲水流觞、饮酒赋诗。他为诗集所作的序，被后世尊为“天下第一行书”。',
      },
      {
        en: 'Open the copybook and pick any of 14 levels: single characters from 一 to 水 that teach the basic strokes, the Eight Principles of 永, 之 written three ways as Wang did, and whole lines of poetry, one character per square.',
        zh: '翻开字帖，14 关任选：从“一”到“水”，一字一字学基本笔画；再写“永字八法”和王羲之笔下变化多端的“之”；最后一字一格，写下整句诗。',
      },
      {
        en: 'Every character comes with a line of poetry it appears in — Li Bai, Wang Wei, Du Fu, Su Shi and the Book of Songs — inscribed on your finished sheet beside the seal.',
        zh: '每个字都配有一句含着它的诗——李白、王维、杜甫、苏轼、《诗经》……写完后题在纸上，盖上印章。',
      },
    ],
    controls: [
      { en: 'Pick a character in the copybook; you can switch at any time with “Copybook”.', zh: '在字帖里任选一个字开始；写的时候随时可以点“字帖”换字。' },
      { en: 'Drag to write. Slow = heavy, wet ink; fast = thin, dry brush.', zh: '按住拖动书写：行笔慢则墨重而润，快则线细而有飞白。' },
      { en: 'Follow the faint red guide and stroke direction; press harder with a pen for more ink.', zh: '沿淡红描红与箭头方向行笔；用手写笔时，压力越大墨越重。' },
      { en: 'Pause and the ink bleeds into the paper; lift while still moving for a sharp tip.', zh: '停笔不动，墨会在纸上洇开；边走边抬笔，留下锋尖。' },
      { en: 'Each level earns up to three stars; for 之, the more each one differs (while still reading as 之), the higher the score.', zh: '每关最多三颗星；写“之”时，三个字彼此越不相同（但仍要像“之”），得分越高。' },
    ],
    history: [
      {
        en: 'The Preface has 28 lines and 324 characters. Tradition says Emperor Taizong of Tang was buried with the original; what survives are Tang copies, the most famous being the “Shenlong” copy attributed to Feng Chengsu.',
        zh: '《兰亭集序》共 28 行、324 字。相传真迹随唐太宗葬入昭陵，今存皆为唐人摹本，以冯承素“神龙本”最为著名。',
      },
      {
        en: 'The Eight Principles of 永 are traditionally credited to Wang Xizhi, though some sources name the Sui monk Zhiyong or the Tang calligrapher Zhang Xu. Most stroke images in the tips (“a rock falling from a high peak”, “clouds over a thousand li”) come from the Bizhen Tu attributed to Lady Wei, Wang’s teacher.',
        zh: '“永字八法”相传出自王羲之，也有说出自隋代智永或唐代张旭。提示中“高峰坠石”“千里阵云”等比喻，出自相传为王羲之老师卫夫人所作的《笔阵图》。',
      },
    ],
    load: () => import('./lanting/Lanting'),
  },
];

export const GAME_BY_ID = Object.fromEntries(GAMES.map((g) => [g.id, g])) as Record<string, GameDef>;

export const gamesFor = (id: string) => GAMES.filter((g) => g.targets.includes(id));
