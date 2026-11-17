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
    title: { en: 'Orchid Pavilion · The Brush', zh: '兰亭 · 永字' },
    kicker: { en: 'Kuaiji, spring 353', zh: '永和九年暮春 · 会稽山阴' },
    targets: ['ev-orchid-pavilion-gathering', 'person-wang-xizhi'],
    accent: '#d8473b',
    story: [
      {
        en: 'On the third day of the third month, Wang Xizhi and forty friends gathered at the Orchid Pavilion to drink and write poems. His preface to their poems became the most admired piece of running script in China.',
        zh: '永和九年三月初三，王羲之与谢安等四十余人修禊于兰亭，曲水流觞、饮酒赋诗。他为诗集所作的序，被后世尊为“天下第一行书”。',
      },
      {
        en: 'First learn the Eight Principles of 永 (yǒng, “eternal”): its eight strokes hold every basic brush movement. Then write 之 three times, the character Wang wrote about twenty times in the Preface, never the same way twice.',
        zh: '先写“永字八法”：一个“永”字的八笔包含了楷书的基本笔法。再写三个“之”。《兰亭集序》里约有二十个“之”字，写法各不相同。',
      },
    ],
    controls: [
      { en: 'Drag to write. Slow = heavy, wet ink; fast = thin, dry brush.', zh: '按住拖动书写：行笔慢则墨重而润，快则线细而有飞白。' },
      { en: 'Follow the faint red guide and stroke direction; press harder with a pen for more ink.', zh: '沿淡红描红与箭头方向行笔；用手写笔时，压力越大墨越重。' },
      { en: 'Pause and the ink bleeds into the paper; lift while still moving for a sharp tip.', zh: '停笔不动，墨会在纸上洇开；边走边抬笔，留下锋尖。' },
      { en: 'For 之, the more each one differs from the last (while still reading as 之), the higher the score.', zh: '写“之”时，三个字彼此越不相同（但仍要像“之”），得分越高。' },
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
  /*
   * Brush Isles: one island-building game in four places and periods. Each paints its own
   * architecture, crops, boats and landmark; the history panel says what the real city was like.
   */
  {
    id: 'isle-tenochtitlan',
    title: { en: 'Tenochtitlan · City on the Lake', zh: '特诺奇提特兰 · 湖上之城' },
    kicker: { en: 'Lake Texcoco, from 1325', zh: '1325年起 · 特斯科科湖' },
    targets: ['ev-founding-of-tenochtitlan', 'ev-fall-of-tenochtitlan', 'place-mexico-city'],
    accent: '#5fc0a8',
    goal: {
      en: 'Grow the Mexica capital out of the lake, with chinampas and the Templo Mayor.',
      zh: '把墨西加人的都城从湖中建起来：浮田、街坊和大神庙。',
    },
    steps: [
      { title: { en: 'Raise the island', zh: '扩岛' }, art: 'isle-land', text: { en: 'Paint land out from the islet where the eagle landed.', zh: '从雄鹰落脚的小岛开始，向湖中画出陆地。' }, keys: { en: 'Land · 1', zh: '陆地 · 1' } },
      { title: { en: 'Houses & chinampas', zh: '房屋与浮田' }, art: 'isle-town', text: { en: 'Paint houses on land and fields on the shallows: they become chinampas.', zh: '在陆地上画房屋，在浅水上画田地——它们会变成浮田。' }, keys: { en: 'Houses · Fields', zh: '房屋 · 田地' } },
      { title: { en: 'Templo Mayor', zh: '大神庙' }, art: 'isle-landmark', text: { en: 'Tap the heart of the city to raise the twin-shrined pyramid.', zh: '点在城市中心，建起双神殿金字塔。' }, keys: { en: 'Landmark · 7', zh: '地标 · 7' } },
    ],
    story: [
      {
        en: 'Mexica tradition says their god promised them a home where they would see an eagle on a prickly-pear cactus. In 1325 they found it on a marshy island in Lake Texcoco.',
        zh: '据墨西加传说，神曾许诺：看到雄鹰立于仙人掌之处，便是安身之地。1325 年，他们在特斯科科湖的沼泽小岛上找到了它。',
      },
      {
        en: 'There was little dry ground, so they made it: beds of lake mud and reeds piled up in the shallows (chinampas), held in place by willows, with canals between.',
        zh: '岛上干地很少，他们就自己造地：在浅水中堆起湖泥与芦苇，筑成一条条“浮田”（奇南帕），以柳树固定，田间留出水道。',
      },
    ],
    controls: [
      { en: 'Drag to paint with the chosen brush; hold to keep painting in place.', zh: '按住拖动，用所选画笔描画；按住不动会持续加深。' },
      { en: 'Right-drag (or two fingers) to turn the view; wheel or pinch to zoom.', zh: '右键拖动（或双指）旋转视角；滚轮或双指缩放。' },
    ],
    history: [
      {
        en: 'By 1519 Tenochtitlan was one of the largest cities in the world, often estimated at 200,000 people, joined to the shore by three causeways and supplied with fresh water by an aqueduct from Chapultepec.',
        zh: '到 1519 年，特诺奇提特兰已是世界上最大的城市之一，人口常被估计在 20 万左右，以三条堤道与湖岸相连，并由查普尔特佩克引水渠供应淡水。',
      },
      {
        en: 'The Templo Mayor carried two shrines, to Huitzilopochtli and to Tlaloc, and was enlarged seven times. Chinampa farming still survives at Xochimilco.',
        zh: '大神庙顶上并立两座神殿，分祀维齐洛波奇特利与特拉洛克，前后扩建七次。浮田农业至今仍在霍奇米尔科延续。',
      },
      {
        en: 'Spanish soldiers who saw the city in 1519 compared it to a dream. Two years later it fell after a 93-day siege, and Mexico City was built on its ruins.',
        zh: '1519 年见到这座城的西班牙士兵把它比作梦境。两年后，城市在 93 天的围攻后陷落，墨西哥城就建在它的废墟之上。',
      },
    ],
    load: () => import('./brush-isles/BrushIsles').then((m) => ({ mount: m.mountStyle('tenochtitlan') })),
  },
  {
    id: 'isle-kaifeng',
    title: { en: 'Bianjing · Along the River', zh: '汴京 · 清明上河' },
    kicker: { en: 'Kaifeng, Northern Song, c. 1100', zh: '北宋 · 约1100年 · 东京汴梁' },
    targets: ['ev-qingming-scroll', 'place-kaifeng'],
    accent: '#c9a96a',
    goal: {
      en: 'Build the Song capital along the Bian river: tiled roofs, willows, rainbow bridges and the Iron Pagoda.',
      zh: '沿汴河建起北宋都城：青瓦屋檐、垂柳、虹桥与铁塔。',
    },
    steps: [
      { title: { en: 'Shape the banks', zh: '理河岸' }, art: 'isle-land', text: { en: 'Paint land or dig canals along the river.', zh: '沿河画出陆地，或挖出河渠。' }, keys: { en: 'Land · Water', zh: '陆地 · 水' } },
      { title: { en: 'Streets & fields', zh: '街坊与田' }, art: 'isle-town', text: { en: 'Paint houses on both banks: bridges grow over narrow water between them.', zh: '在两岸画房屋：窄窄的水面两侧都有房屋时，会长出桥来。' }, keys: { en: 'Houses · Fields', zh: '房屋 · 田地' } },
      { title: { en: 'Iron Pagoda', zh: '铁塔' }, art: 'isle-landmark', text: { en: 'Tap a spot to raise the thirteen-storey pagoda.', zh: '点一处空地，建起十三层的铁塔。' }, keys: { en: 'Landmark · 7', zh: '地标 · 7' } },
    ],
    story: [
      {
        en: 'Around 1100, Kaifeng was the capital of the Northern Song and perhaps the largest city on Earth. Grain barges came up the Bian canal from the south, and shops, inns and wine-houses lined its banks.',
        zh: '约 1100 年，开封是北宋都城，可能也是当时世界上最大的城市。南方的漕粮船沿汴河北上，两岸店铺、客栈、酒楼林立。',
      },
      {
        en: 'Zhang Zeduan painted the river at the Qingming festival on a five-metre scroll, with its famous timber arch: the Rainbow Bridge.',
        zh: '张择端以五米长卷画下清明时节的汴河，画中最有名的是那座木构拱桥——虹桥。',
      },
    ],
    controls: [
      { en: 'Drag to paint with the chosen brush; hold to keep painting in place.', zh: '按住拖动，用所选画笔描画；按住不动会持续加深。' },
      { en: 'Right-drag (or two fingers) to turn the view; wheel or pinch to zoom.', zh: '右键拖动（或双指）旋转视角；滚轮或双指缩放。' },
    ],
    history: [
      {
        en: 'The Rainbow Bridge in the scroll is a pierless arch of interlocking timbers, a design first built at Qingzhou in the 1030s and copied over the Bian in the 1040s, so that boats no longer struck the piers.',
        zh: '画中的虹桥是一座无柱木拱桥，由木梁相互叠压而成。这种桥式 11 世纪 30 年代始建于青州，40 年代仿建于汴河，船只从此不再撞上桥柱。',
      },
      {
        en: 'The “Iron Pagoda” of Kaifeng was built in 1049. It is not iron at all: its glazed bricks are the colour of rust. It still stands, about 55 metres tall.',
        zh: '开封“铁塔”建于 1049 年，其实并非铁铸，而是外砌褐色琉璃砖，色如铁锈。塔至今犹存，高约 55 米。',
      },
      {
        en: 'In 1127 Jurchen Jin armies took Kaifeng and carried off two emperors; the Song court fled south to Hangzhou.',
        zh: '1127 年金军攻破开封，掳走徽、钦二帝（靖康之变），宋室南迁临安（杭州）。',
      },
    ],
    load: () => import('./brush-isles/BrushIsles').then((m) => ({ mount: m.mountStyle('kaifeng') })),
  },
  {
    id: 'isle-raiatea',
    title: { en: 'Raʻiatea · The Sacred Island', zh: '赖阿特阿 · 圣岛' },
    kicker: { en: 'Society Islands, c. 1000', zh: '约公元1000年 · 社会群岛' },
    targets: ['ev-taputapuatea-marae', 'ev-settlement-of-east-polynesia'],
    accent: '#47d1c4',
    goal: {
      en: 'Shape a high island and its lagoon, with fare houses, taro, palms and the marae of Taputapuātea.',
      zh: '塑造火山岛与泻湖：茅屋、芋田、椰林，以及塔普塔普阿特阿会堂。',
    },
    steps: [
      { title: { en: 'Shape the island', zh: '塑岛' }, art: 'isle-land', text: { en: 'Paint beaches and motu, raise the mountain, widen the lagoon.', zh: '画海滩与环礁小岛，堆高火山，拓宽泻湖。' }, keys: { en: 'Land · Hills', zh: '陆地 · 山丘' } },
      { title: { en: 'Fare & taro', zh: '茅屋与芋田' }, art: 'isle-town', text: { en: 'Paint thatched houses near the shore and taro patches inland.', zh: '在岸边画茅屋，在内陆画芋田。' }, keys: { en: 'Houses · Fields', zh: '房屋 · 田地' } },
      { title: { en: 'The marae', zh: '马拉埃' }, art: 'isle-landmark', text: { en: 'Tap the shore to lay out the sacred court and its ahu.', zh: '点在岸边，铺设神圣广场与石台。' }, keys: { en: 'Landmark · 7', zh: '地标 · 7' } },
    ],
    story: [
      {
        en: 'Raʻiatea, once called Havaiʻi, lies at the centre of the Society Islands. Voyagers in double-hulled canoes sailed from here across thousands of kilometres of open Pacific.',
        zh: '赖阿特阿古称“哈瓦伊基”，位于社会群岛中心。远航者从这里驾双体独木舟出发，横渡数千公里的太平洋。',
      },
      {
        en: 'At Opoa they built Taputapuātea, a marae: an open paved court with a raised stone platform (ahu) at one end, where chiefs, priests and voyagers met.',
        zh: '他们在奥波阿修建了塔普塔普阿特阿“马拉埃”：一块露天铺石广场，一端是高起的石台“阿胡”，首领、祭司与远航者在此相会。',
      },
    ],
    controls: [
      { en: 'Drag to paint with the chosen brush; hold to keep painting in place.', zh: '按住拖动，用所选画笔描画；按住不动会持续加深。' },
      { en: 'Right-drag (or two fingers) to turn the view; wheel or pinch to zoom.', zh: '右键拖动（或双指）旋转视角；滚轮或双指缩放。' },
    ],
    history: [
      {
        en: 'Taputapuātea became the religious heart of East Polynesia. Stones from it were carried to found new marae on other islands, binding them to Raʻiatea.',
        zh: '塔普塔普阿特阿成为东波利尼西亚的宗教中心。人们把这里的石头带往别的岛屿，奠基新的马拉埃，以此与赖阿特阿相连。',
      },
      {
        en: 'Houses (fare) were timber frames thatched with pandanus or coconut leaves. Taro, breadfruit, bananas and coconuts fed the islands, brought by the first settlers in their canoes.',
        zh: '房屋（法雷）以木为架，用露兜树叶或椰叶覆顶。芋头、面包果、香蕉和椰子养活了诸岛，它们都是最早的移民用独木舟带来的。',
      },
      {
        en: 'In 2017 UNESCO inscribed Taputapuātea as a World Heritage site, together with the lagoon, reef and ocean around it.',
        zh: '2017 年，联合国教科文组织将塔普塔普阿特阿及其周边的泻湖、珊瑚礁与海域列为世界遗产。',
      },
    ],
    load: () => import('./brush-isles/BrushIsles').then((m) => ({ mount: m.mountStyle('raiatea') })),
  },
  {
    id: 'isle-amsterdam',
    title: { en: 'Amsterdam · The Canal City', zh: '阿姆斯特丹 · 运河之城' },
    kicker: { en: 'Holland, the 1600s', zh: '17世纪 · 荷兰' },
    targets: ['ev-dutch-east-india-company'],
    accent: '#e0894a',
    goal: {
      en: 'Build the Golden Age city: gabled canal houses, polders and windmills, and the Zuiderkerk.',
      zh: '建起黄金时代的城市：山墙运河屋、圩田与风车，还有南教堂。',
    },
    steps: [
      { title: { en: 'Dam & dig', zh: '筑坝开渠' }, art: 'isle-land', text: { en: 'Paint land into the IJ, or cut canals with water.', zh: '向艾湾填出陆地，或用水开出运河。' }, keys: { en: 'Land · Water', zh: '陆地 · 水' } },
      { title: { en: 'Canal houses', zh: '运河屋' }, art: 'isle-town', text: { en: 'Paint houses along the water; fields become polders with windmills.', zh: '沿水画房屋；田地会变成带风车的圩田。' }, keys: { en: 'Houses · Fields', zh: '房屋 · 田地' } },
      { title: { en: 'Zuiderkerk', zh: '南教堂' }, art: 'isle-landmark', text: { en: 'Tap a spot to raise the church and its tall tower.', zh: '点一处空地，建起教堂与高塔。' }, keys: { en: 'Landmark · 7', zh: '地标 · 7' } },
    ],
    story: [
      {
        en: 'Amsterdam grew up around a dam in the river Amstel. In 1602 the Dutch East India Company was founded, and the city became the richest port in Europe.',
        zh: '阿姆斯特丹因阿姆斯特尔河上的一道水坝而得名。1602 年荷兰东印度公司成立，这座城市成了欧洲最富庶的港口。',
      },
      {
        en: 'Merchants built tall, narrow brick houses on the canals, with stepped and neck gables and hoist beams to lift goods to the attic. Around the city, windmills pumped the polders dry.',
        zh: '商人们沿运河建起高而窄的砖屋，立着阶梯山墙或颈状山墙，屋顶挑出吊货横梁，把货物吊进阁楼。城外，风车把圩田里的水抽干。',
      },
    ],
    controls: [
      { en: 'Drag to paint with the chosen brush; hold to keep painting in place.', zh: '按住拖动，用所选画笔描画；按住不动会持续加深。' },
      { en: 'Right-drag (or two fingers) to turn the view; wheel or pinch to zoom.', zh: '右键拖动（或双指）旋转视角；滚轮或双指缩放。' },
    ],
    history: [
      {
        en: 'From 1613 the city dug its ring of canals (Herengracht, Keizersgracht, Prinsengracht). The houses stand on wooden piles driven through the soft peat.',
        zh: '自 1613 年起，城市开挖环形运河（绅士运河、皇帝运河、王子运河）。房屋都立在穿过松软泥炭层打下的木桩上。',
      },
      {
        en: 'The Zuiderkerk, by Hendrick de Keyser (1603–1611), was the first church in Amsterdam built for Protestant worship.',
        zh: '南教堂由亨德里克·德·凯泽设计（1603—1611），是阿姆斯特丹第一座为新教礼拜而建的教堂。',
      },
      {
        en: 'In 1612 the Beemster lake north of the city was drained with dozens of windmills, one of the first great polders of the Golden Age.',
        zh: '1612 年，城北的贝姆斯特湖用数十座风车排干，成为黄金时代最早的大型圩田之一。',
      },
    ],
    load: () => import('./brush-isles/BrushIsles').then((m) => ({ mount: m.mountStyle('amsterdam') })),
  },
];

export const GAME_BY_ID = Object.fromEntries(GAMES.map((g) => [g.id, g])) as Record<string, GameDef>;

export const gamesFor = (id: string) => GAMES.filter((g) => g.targets.includes(id));
