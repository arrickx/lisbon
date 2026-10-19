/**
 * 唯一内容来源 (single source of truth)。内容整理自 TRIP_PROFILE.md。
 * 车程分钟 / 价格均为【估算】，出发前请用 Google Maps 逐段核对（住处最终选定后会变）。
 *
 * 约定：
 *  - stop.t     建议时间 "HH:MM"，用于判断“现在 / 下一站”并决定显示的时段
 *  - stop.leg   从上一站到本站的交通段 {mode:'uber'|'walk'|'drive', min, km?, eur?}
 *  - stop.at    指向 stays 里的住处（入住/退房/回住处），导航与叫车使用住处信息
 *  - stop.query 具体地点名称/可搜索地址（不用经纬度/Pin，方便在地图与 Uber/Bolt 里直接搜出精确 POI）
 *  - 没有 query 或 at 的 stop 不显示导航按钮
 */
window.TRIP = {
  start: '2027-05-04',
  tz: 'Europe/Lisbon',
  party: '4 大 1 小 (99% 主选) · 备选 2 大 1 小',
  // 新增城市只需在这里加一项（颜色会自动应用到整个界面），再在 days 里用它的 key
  cities: {
    lisbon:  { name: '里斯本',          color: '#C4532F', soft: '#FBEDE6' },
    algarve: { name: '阿尔加维 · 拉各斯', color: '#147A8A', soft: '#E3F2F4' }
  },

  // 点餐大字卡（随身页入口 + 全屏对话框共用这一份文案）
  flash: {
    title: '👶 点餐大字卡',
    hint: '蔬菜浓汤 + 白米饭，少盐不辣，直接给服务员看',
    badge: '请出示给服务员',
    pt: 'Uma sopa de legumes e uma dose de arroz branco para a criança, com pouco sal e sem piri-piri, por favor.',
    zh: '请给小朋友来一份蔬菜浓汤和一碗白米饭，少放盐，不要任何辣酱，谢谢。'
  },

  stays: {
    lisbon: {
      name: 'Upon Lisbon Prime Residences (里斯本服务公寓)',
      query: 'Upon Lisbon Prime Residences, Lisboa, Portugal',
      address: null,
      status: '【里斯本主选】4 大 1 小 (80㎡ / 861 sq ft 两卧两卫大公寓 · 楼顶恒温泳池) · 4 晚'
    },
    lisbonAlt: {
      name: 'Hyatt Regency Lisbon (里斯本凯悦酒店)',
      query: 'Hyatt Regency Lisbon, Lisboa, Portugal',
      address: null,
      status: '【里斯本备选】2 大 1 小 (Cat 4 积分兑换 · 现金 €0)'
    },
    algarve: {
      name: 'Belmar Spa & Beach Resort (贝尔马水疗海滩度假村)',
      query: 'Belmar Spa & Beach Resort, Lagos, Portugal',
      address: null,
      status: '【拉各斯首选】2-Bedroom Sea View (两卧海景平层套房 · 91~96㎡ · 室内温水池宝宝可用 · 自带洗衣机 · 免费车库) · 4 晚'
    }
  },

  // 第几天的序号 (n) 与日期 (date) 由 app.js 根据 start 自动推算，增删或调换天数无需手动改序号和日期
  days: [
    {
      city: 'lisbon', stay: 'lisbon',
      title: '晨间抵达 · 慢午餐 · 15:00 入住补觉',
      tips: [
        { i: '✈️', t: '通关与打车', b: '机舱口取回 Gate Check 推车，走 <b>Family Fast Track</b> 家庭快速通道出关；叫 UberXL / Bolt XL（双 App 比价约 €10-14，2岁内幼童合法抱坐后排）10 分钟直达 Upon。' },
        { i: '🏨', t: '寄存与优先排房', b: '11:45 到店免费寄存 4 个大箱办理预登记，说明带老人幼童申请“优先打扫（Priority Cleaning）”；顺便向前台借折叠晾衣架（<i>Drying rack</i>）。' },
        { i: '🍲', t: '暖胃午餐与天台小憩', b: '公寓官方入住为 15:00。12:00 在楼下 <b>Dona Joaquina</b> 悠闲享用 1.5 小时热蔬菜浓汤（<i>Sopa de legumes</i>）与鲜鱼；13:45 直接乘电梯上<b>楼顶天台遮阳软躺椅</b>休息（推车放平宝宝安睡，长辈闭目养神看全景），绝不在外流浪。' },
        { i: '🛏️', t: '15:00 入住与大补觉', b: '15:00 拿房卡入住 80㎡ 两卧套房，关卧室门拉遮光帘<b>全家大床深睡 3 小时 (15:00-18:00)</b> 彻底击碎时差！睡醒后 18:00 带宝宝换防水纸尿裤上楼顶恒温泳池看日落。' },
        { i: '📅', t: '当晚顺手办', b: '打开 Google Maps / TheFork 订好明天 D2 晚 18:00 <b>5 Oceanos</b> 河景露台位；看一眼周五天气订 D4 佩纳宫公园票。' }
      ],
      stops: [
        { t: '10:30', name: '抵达里斯本机场 (LIS T1)', note: '机舱口取推车，Family Fast Track 快速出关取行李，UberXL 10 分钟直达 Upon', query: 'Aeroporto de Lisboa (LIS)' },
        { t: '11:45', name: 'Upon 寄存行李 / 暖胃慢午餐', note: '前台寄存大箱预登记申请优先打扫，楼下 Dona Joaquina 悠闲吃热蔬菜浓汤与鲜鱼驱寒', query: 'Upon Lisbon Prime Residences', leg: { mode: 'uber', min: 10, km: 6, eur: 11 } },
        { t: '13:45', name: '楼顶天台/大堂舒适小憩', note: '住客免费使用公区：推车放平宝宝安睡，长辈在楼顶遮阳软躺椅闭目养神，完全不费腿' },
        { t: '15:00', name: '官方正式入住 · 深度大床补觉', note: '拿房卡进 80㎡ 两卧套房，拉厚遮光帘大床深睡 3 小时 (15:00-18:00) 彻底倒时差', at: 'lisbon' },
        { t: '18:00', name: '楼顶无边恒温泳池戏水', note: '30℃ 温水泡澡舒缓长途飞行筋骨，俯瞰市区落日晚霞，宝宝玩水开心' },
        { t: '19:30', name: '街区慢步与超市采买', note: '周边传统餐馆清淡晚餐，买 1.5L 大瓶饮用水与 Mimosa 200ml 吸管奶回房早睡' }
      ]
    },
    {
      city: 'lisbon', stay: 'lisbon',
      title: '贝伦文化 · 水陆两栖车',
      tips: [
        { i: '🥧', t: '蛋挞老店免排队秘诀', b: '<b>千万别排店门外长队</b>（那是外带队）！推车直接穿过拱门进里面 <b>400 座堂食大厅</b>找座，有宝宝高脚椅，免预约随到随坐。' },
        { i: '🐟', t: '贝伦午餐（免订位）', b: '12:00 错峰直进平民海鲜馆 <b>O Recanto</b> 或 <b>Taberna dos Ferreiros</b>，点清蒸海鱼配土豆泥（交代 <i>Sem sal</i> 不放盐）。' },
        { i: '🦛', t: 'HippoTrip 两栖车 4 大实战铁律', b: '① 必须提前官网买好 16:00 场（含 €20 儿童占座票，不查护照）；② <b>全程 90 分钟无厕所，登车前务必在 Doca 码头游客中心换好尿布</b>；③ 用<b>随身小背包垫在宝宝屁股下（垫高 10cm）</b>越过窗框看海；④ 陆地段系安全带投喂米饼果泥，下水后平稳可抱腿上看巨浪。' },
        { i: '🍽️', t: '码头海鲜晚餐', b: '下船走 2 分钟即达 <b>5 Oceanos</b>（电话 <a href="tel:+351213978395">+351 213 978 395</a>）或 <b>Doca de Santo</b>；想坐第一排临水露台建议提前 1-2 天在 Google Maps / TheFork 订 18:00 位（备注 <code>Cadeira de bebé</code>），普通座 18:00 直进。' }
      ],
      stops: [
        { t: '09:15', name: 'Pastéis de Belém 蛋挞老店', note: '免排外带长队直接穿拱门进 400 座堂食大厅，外皮酥脆奶馅温热，有高脚椅', query: 'Pastéis de Belém, Lisboa', leg: { mode: 'uber', min: 15, km: 10, eur: 12 } },
        { t: '10:15', name: '热罗尼莫斯修道院外大草坪', note: '不买登楼票挤窄梯！纯平绿地喷泉看航海浮雕，宝宝奔跑放电', query: 'Mosteiro dos Jerónimos, Lisboa', leg: { mode: 'walk', min: 5 } },
        { t: '11:15', name: '发现者纪念碑 · 河畔步道', note: '纯平大广场看 425 大桥与帆船', query: 'Padrão dos Descobrimentos, Lisboa', leg: { mode: 'walk', min: 10 } },
        { t: '12:00', name: '贝伦区亲子午餐', note: 'O Recanto / Taberna dos Ferreiros 12:00 直进，清蒸海鱼配土豆泥 (Sem sal)' },
        { t: '13:15', name: '回 Upon 午睡 / 或顺逛 LX Factory', note: '回房大床深睡 2.5 小时，或顺逛 5 分钟车程外的 LX Factory 飞天书店 Ler Devagar', at: 'lisbon', leg: { mode: 'uber', min: 15, km: 10, eur: 12 } },
        { t: '16:00', name: 'HippoTrip 水陆两栖巴士', note: '16:00 黄金场！登车前换好尿布，小背包垫高宝宝屁股 10cm，冲入特茹河激起巨浪', query: 'HippoTrip Lisboa', leg: { mode: 'uber', min: 12, km: 7, eur: 11 } },
        { t: '18:00', name: '5 Oceanos / Doca de Santo 码头晚餐', note: '【露台建议提前1-2天在Google Maps/TheFork订18:00位】正对425大桥与游艇，现捞海鲜与花园露台', query: '5 Oceanos, Doca de Santo Amaro, Lisboa', leg: { mode: 'walk', min: 2 } }
      ]
    },
    {
      city: 'lisbon', stay: 'lisbon',
      title: '山顶俯瞰 · 商业广场 · 自由大道 LV',
      tips: [
        { i: '👟', t: '顺坡零费力路线 + 防滑提醒', b: 'UberXL 直接开上最高峰圣母山顶，往下经圣卢西亚观景台、大教堂到商业广场<b>全段顺坡下滑</b>；老城碎石坡路滑，长辈务必穿<b>防滑健步鞋</b>。' },
        { i: '🆓', t: '圣胡斯塔电梯白嫖视角', b: '若顺路经过 Chiado，别花 €6 排 1 小时长队坐铁笼电梯，从卡尔莫修道院（<i>Convento do Carmo</i>）右侧平路可直接免费走上顶层观景天桥。' },
        { i: '🛍️', t: '自由大道绝妙分流', b: '买名牌组进 <b>LV 旗舰店</b> / Gucci / Loewe（带护照办退税高达 12%-15%）；长辈推车在法国梧桐树荫下的露天咖啡亭（<i>Quiosque</i>）喝意式浓缩吃冰淇淋，若遇天热也可打车 7 分钟去全空调 <b>英国宫百货 (El Corte Inglés)</b>。' },
        { i: '🦞', t: '晚餐订位策略', b: '若选顶级海鲜名店 <b>Solar dos Presuntos</b> 需提前 1-2 周官网订位；若选隔壁老牌海鲜 <b>Pinóquio</b> 或烤鸡名店 <b>Bonjardim</b>，<b>18:00 错峰直接进店免排队</b>（或请 Upon 前台头天电话留座）。' }
      ],
      stops: [
        { t: '09:15', name: 'Senhora do Monte 圣母山观景台', note: 'UberXL 直达山顶平地，百年松树遮阳下零爬坡俯瞰红屋顶与河谷', query: 'Miradouro da Senhora do Monte, Lisboa', leg: { mode: 'uber', min: 18, km: 8, eur: 12 } },
        { t: '10:00', name: '顺坡漫步看 28 路电车', note: '顺坡向下滑行，途经圣卢西亚观景台瓷砖长廊、大教堂门口拍复古黄电车', query: 'Miradouro de Santa Luzia, Lisboa', leg: { mode: 'walk', min: 25 } },
        { t: '11:00', name: '商业广场 & 奥古斯塔步行街', note: '特茹河畔纯平大广场看海风帆船，平路逛凯旋门步行街', query: 'Praça do Comércio, Lisboa', leg: { mode: 'walk', min: 10 } },
        { t: '12:00', name: 'Baixa / Chiado 亲子午餐', note: '【12:00错峰直进免订位】点无细刺鮟鱇鱼海鲜泡饭 (Arroz de Tamboril) 与牛肉蛋饭 Bitoque' },
        { t: '15:30', name: '自由大道名牌街 (LV / 梧桐林荫咖啡亭)', note: '买名牌组逛 LV 旗舰店(退税12~15%)；长辈推车在树荫 Quiosque 咖啡亭喝咖啡', query: 'Louis Vuitton Lisboa Avenida da Liberdade', leg: { mode: 'uber', min: 10, km: 5, eur: 9 } },
        { t: '18:00', name: '自由大道周边海鲜晚餐', note: '【若选Solar dos Presuntos需提前1-2周官网订；选Pinóquio或Bonjardim可18:00直进】', query: 'Restaurante Pinóquio, Lisboa' }
      ]
    },
    {
      city: 'lisbon', stay: 'lisbon',
      title: '辛特拉童话皇宫 · 罗卡角 · 卡斯凯什',
      tips: [
        { i: '🏰', t: '佩纳宫无痛避坑（核心！）', b: '在官网 <a href="https://www.parquesdesintra.pt" target="_blank" rel="noopener">parquesdesintra.pt</a> <b>只买纯公园票 (Park Ticket €10) + 园内接驳小巴 (Park Transfer €3.5)</b>，<b>坚决不买宫殿室内票</b>（室内全窄螺旋梯且排 1.5h）！进门坐小巴 3 分钟直达山顶，走纯平<b>王后露台 (Queen\'s Terrace)</b> 拍红黄城堡大片（建议带腰凳/轻便折叠推车）。' },
        { i: '🥐', t: '小镇枕头酥与午餐', b: '<b>Casa Piriquita</b> 周五正常营业（周三休），免预约吃温热杏仁蛋黄枕头酥（<i>Travesseiros</i>）；午餐去网红葡式小馆 <b>Tascantiga</b> 12:00 直进，或正餐 <b>Tulhas</b> 请前台头天订位。' },
        { i: '🌊', t: '罗卡角防风提醒', b: '停车场距十字碑仅 <b>50 米纯平地面</b>，但百米悬崖大西洋海风强劲，下车拍照务必给长辈和宝宝<b>套上防风外套/盖好防风毯</b>。' },
        { i: '☔', t: '【雨天/大雾 Plan B 备选】', b: '若当天山上大雾或降雨，直接改去室内纯平无障碍的 <b>里斯本海洋水族馆 (Oceanário) + 滨海缆车 + Vasco da Gama 商场</b>（官网 <a href="https://tickets.oceanario.pt" target="_blank" rel="noopener">tickets.oceanario.pt</a> 买票务必勾选 1 张 <b>€0 Infant 票</b>生成入场条形码，顺路在 Continente 超市买明天自驾零食）。' }
      ],
      stops: [
        { t: '09:15', name: '辛特拉佩纳宫 (纯公园票 + 接驳小巴)', note: 'UberXL 25分钟直达山上入口。坐接驳小巴上山，走纯平王后露台拍红黄童话城堡全貌', query: 'Palácio Nacional da Pena, Sintra', leg: { mode: 'uber', min: 25, km: 24, eur: 26 } },
        { t: '11:30', name: '辛特拉小镇 · Casa Piriquita 枕头酥', note: '【免订位】百年老店吃热腾腾杏仁蛋黄枕头酥 (Travesseiros) 与葡式午餐', query: 'Casa Piriquita, Sintra', leg: { mode: 'uber', min: 10, km: 4, eur: 7 } },
        { t: '14:00', name: '罗卡角 Cabo da Roca (欧亚最西端)', note: '车停灯塔十字碑旁，平走 50 米俯瞰大西洋百米悬崖惊涛，记得穿防风外套', query: 'Cabo da Roca, Portugal', leg: { mode: 'uber', min: 25, km: 18, eur: 18 } },
        { t: '15:30', name: '卡斯凯什海湾 & Santini 冰淇淋', note: '皇室海滨小镇纯平海湾步道吹海风，吃国宝级 Santini 鲜果冰淇淋', query: 'Gelados Santini Cascais', leg: { mode: 'uber', min: 20, km: 15, eur: 15 } },
        { t: '17:30', name: '打车回 Upon 洗衣服打包', note: '25 分钟直达公寓，洗净烘干衣物，为明日南下阿尔加维收整行李', at: 'lisbon', leg: { mode: 'uber', min: 25, km: 28, eur: 25 } }
      ]
    },
    {
      city: 'algarve', stay: 'algarve',
      title: '自驾南下 · 拉各斯海滩落日',
      tips: [
        { i: '🚗', t: '机场 T1 提车 4 步核对', b: '① 认准航站楼内柜台提自动挡汽油 SUV（<b>Gasolina 95</b>，504L 放 4 个 20 寸箱 + 推车）；② 加租后排 ISOFIX 幼儿安全座椅；③ 激活 <b>Via Verde</b> 高速盒子（过收费站走绿色 V 通道不减速）；④ 全额刷 <b>Chase CSP/CSR</b> 拒绝柜台 CDW 白嫖 Primary 全险。' },
        { i: '📞', t: '【14:00 办 Belmar 入住必办】请前台连打 3 个电话锁死餐厅', b: '（均备注 <code>4 Adults + 1 Baby High Chair / Cadeira de bebé</code>）：<br>① 今晚 18:00 <b>Campimar 沙滩餐厅</b>：<a href="tel:+351282762024">+351 282 762 024</a>（或官网 <a href="https://campimar.pt" target="_blank" rel="noopener">campimar.pt</a>）<br>② 明晚周日 18:00 <b>Don Sebastião 古城海鲜</b>：<a href="tel:+351282780480">+351 282 780 480</a><br>③ 后天周一 17:30 <b>Casinha do Petisco 铜锅猪肉蛤蜊</b>：<a href="tel:+351282767163">+351 282 767 163</a>' },
        { i: '🌤️', t: '看海况锁明天海豚船', b: '查明天周日上午风浪预报，在 <b>GetYourGuide</b> 订明早 09:30 <b>Catamaran 大型双体船</b>（若明早浪大可改订 D7 或 D8 上午，连住 4 晚有 3 个上午窗口！）。' }
      ],
      stops: [
        { t: '09:15', name: '退房出发去机场租车中心', note: '前台 1 分钟快速退房，UberXL 10 分钟到 LIS T1 航站楼内租车柜台', at: 'lisbon' },
        { t: '09:45', name: 'LIS T1 提紧凑型 SUV', note: '提自动挡 Nissan Qashqai，装儿童座椅，激活 Via Verde，刷 CSP/CSR，装 4 箱+推车', query: 'Aeroporto de Lisboa (LIS)', leg: { mode: 'uber', min: 10, km: 6, eur: 10 } },
        { t: '10:30', name: 'A2 高速自驾南下', note: '中途服务区喝咖啡换尿布，高速巡航宝宝安稳午睡', leg: { mode: 'drive', min: 150, km: 250 } },
        { t: '14:00', name: '入住 Belmar 度假村 (连住 4 晚)', note: '地库电梯直通两卧海景平层，办入住时顺便请前台代订拉各斯 3 顿晚餐！', at: 'algarve' },
        { t: '16:30', name: 'Porto de Mós 细沙海滩', note: '步行 5 分钟，平缓细沙踩水看金色悬崖', query: 'Praia de Porto de Mós, Lagos', leg: { mode: 'walk', min: 5 } },
        { t: '18:00', name: '沙滩 Campimar 晚餐', note: '【强烈建议订位：官网campimar.pt或请Belmar前台电话代订】现捞烤大明虾配海景日落', query: 'Campimar Beach Restaurant, Lagos', leg: { mode: 'walk', min: 3 } }
      ]
    },
    {
      city: 'algarve', stay: 'algarve',
      title: '双体大船看海豚 · 室内温水池',
      tips: [
        { i: '🐬', t: '海豚巡航选船铁律', b: '必须认准 <b>Catamaran（大型双体客船，带遮阳舱与洗手间）</b>，<b>严禁选 RIB 充气快艇</b>！清晨 09:30 海面风浪最小，海豚跃水率 95%+，记得穿防风外套。' },
        { i: '🍽️', t: '码头午餐（免订位）', b: '11:45 下船直接走去码头木栈道餐馆 <b>Adega da Marina</b> 或 <b>Quay Lagos</b>，错峰直进吃清烤鱼柳配水煮土豆（<i>Sem sal</i>）。' },
        { i: '🏊', t: '室内恒温池戏水', b: 'Belmar 室内水疗池（09:00-18:00）水温恒定 30℃，合规允许儿童入水，记得给宝宝换上<b>防水纸尿裤 (Swim Diapers)</b>。' },
        { i: '🍷', t: '周日晚餐防空跑', b: '拉各斯许多小馆（如 Chico Zé、Casinha）周日公休！晚餐直接去昨天请前台订好的老城经典名店 <b>Don Sebastião</b>（电话 <a href="tel:+351282780480">+351 282 780 480</a>）。' }
      ],
      stops: [
        { t: '09:30', name: 'Lagos Marina 海豚巡航 (早班)', note: '大型双体船 (Catamaran) 超平稳，清晨海豚超活跃！', query: 'Marina de Lagos, Portugal', leg: { mode: 'drive', min: 6, km: 3.5 } },
        { t: '11:45', name: 'Marina 码头游艇景观午餐', note: '【11:45下船直进免订位】清烤石斑鱼柳配水煮土豆 (Sem sal)' },
        { t: '13:00', name: '回房独立卧室关门午睡', note: '开车 6 分钟秒回 Belmar，关卧室门彻底深睡 2.5 小时', at: 'algarve', leg: { mode: 'drive', min: 6, km: 3.5 } },
        { t: '15:45', name: 'Belmar 室内恒温泳池', note: '儿童合规可用（穿防水纸尿裤），水温 30℃ 尽情戏水', at: 'algarve' },
        { t: '18:00', name: '拉各斯老城 Don Sebastião 晚餐', note: '【强烈建议订位：周日小馆多店休，提前1-2天请Belmar前台电话代订18:00位】', query: 'Restaurante Don Sebastião, Lagos', leg: { mode: 'drive', min: 5, km: 2.5 } }
      ]
    },
    {
      city: 'algarve', stay: 'algarve',
      title: '悬崖木栈道 · 炭烤海鱼 · 古城慢时光',
      tips: [
        { i: '🌊', t: '悬崖纯平木栈道', b: '车停 Ponta da Piedade 灯塔免费停车场，全新木栈道（<i>Passadiços</i>）全程零台阶无障碍，晨光顺光拍金色海蚀拱门与翡翠海水最出片。' },
        { i: '🐟', t: '午市 Chico Zé 免排队秘诀', b: '周一正常营业但<b>仅做午市 (12:00-16:00)</b>，无网上订位；<b>11:45 准时到场直接坐第一波零等位</b>（或请前台打 <a href="tel:+351282764595">+351 282 764 595</a> 留 5 人桌），必点现捞炭烤海鲷鱼与沙丁鱼。' },
        { i: '🍲', t: '晚市 Casinha do Petisco 抢位铁律', b: '拉各斯口碑王，<b>全店仅 7-8 张桌且不接网订</b>！确认 Belmar 前台已帮打 <a href="tel:+351282767163">+351 282 767 163</a> 锁好 17:30 首轮座位；若未订上，务必在 <b>17:20 开门前到门口排第一名</b>，必点铜锅慢炖猪肉蛤蜊（<i>Carne de Porco à Alentejana</i>）。' }
      ],
      stops: [
        { t: '09:15', name: 'Ponta da Piedade 悬崖木栈道', note: '全平无障碍木板路，晨光顺光看金色海蚀拱与玻璃海', query: 'Ponta da Piedade, Lagos', leg: { mode: 'drive', min: 4, km: 2.2 } },
        { t: '11:45', name: 'Chico Zé 现捞炭烤海鲜 (周一营业)', note: '【无网订：11:45开门前到场第一波免等位，或请前台电话留座】炭烤海鲷鱼绝香', query: 'Restaurante Chico Zé, Lagos', leg: { mode: 'drive', min: 5, km: 3 } },
        { t: '13:15', name: '回房独立卧室关门午睡', note: '开车 5 分钟秒回 Belmar，宝宝深睡充能', at: 'algarve', leg: { mode: 'drive', min: 5, km: 2.5 } },
        { t: '15:45', name: '拉各斯古城老街 & Crema di Gelato', note: '手工彩绘陶瓷店 + 网红开心果手工冰淇淋', query: 'Crema di Gelato, Lagos', leg: { mode: 'drive', min: 5, km: 2.5 } },
        { t: '17:30', name: 'Casinha do Petisco 晚餐 (周一营业)', note: '【仅7-8张桌！请Belmar前台提前电话代订17:30首轮位，或17:20门口排第一波】必点铜锅猪肉蛤蜊', query: 'Casinha do Petisco, Lagos', leg: { mode: 'walk', min: 4 } }
      ]
    },
    {
      city: 'algarve', stay: 'algarve',
      title: '卢斯海滩 / 动物园喂萌宠 · 度假村躺平',
      tips: [
        { i: '🌴', t: '上午二选一 A（长辈最爱·棕榈海湾）', b: '自驾 8 分钟去 <b>Praia da Luz</b>，全阿尔加维最平坦的棕榈海滨石板长廊，在古堡海景餐厅 <b>Fortaleza da Luz</b> 露台喝早咖啡晒太阳（免订位）。' },
        { i: '🦩', t: '上午二选一 B（幼童最爱·喂小矮羊）', b: '自驾 12 分钟去 <b>Zoo de Lagos</b>（10:00 开园，<b>现场买票零排队，未满 3 岁免费</b>），全程树荫平路看企鹅隧道与火烈鸟，门口买 <b>€1 饲料包</b>在萌宠农场（<i>Quinta Pedagógica</i>）亲手喂小矮羊与小兔；午餐可去园口葡国田园餐厅 <b>Restaurante O Cangalho</b>（12:00 随到随坐）。' },
        { i: '🌅', t: '告别晚餐与打包', b: '告别晚宴若选悬崖海景名店 <b>O Camilo</b>（电话 <a href="tel:+351282763845">+351 282 763 845</a>）或 Belmar 自营海景餐厅 <b>Levante</b>，提前 1 天请前台代订 18:00 桌位；晚上用套房洗衣机洗净全家衣物打包。' }
      ],
      stops: [
        { t: '09:30', name: '【二选一 A】Praia da Luz 卢斯海滩步道', note: '自驾 8 分钟，纯平棕榈海滨石板路推车看海，古堡花园餐厅喝早咖啡', query: 'Praia da Luz, Lagos', leg: { mode: 'drive', min: 8, km: 6 } },
        { t: '09:30', name: '【二选一 B】拉各斯动物园 Zoo de Lagos', note: '自驾 12 分钟，纯平林荫道，未满3岁免费，萌宠农场 €1 饲料亲手喂矮脚羊与小兔', query: 'Zoo de Lagos, Portugal', leg: { mode: 'drive', min: 12, km: 10 } },
        { t: '12:00', name: '海滨或田园葡式午餐', note: '【12:00错峰直进免订位】慢享大西洋阳光午餐' },
        { t: '13:30', name: '回 Belmar 午睡 & 度假村躺平', note: '午睡醒来后在度假村草坪、泳池露台或沙滩慢享最后一个海滨下午', at: 'algarve', leg: { mode: 'drive', min: 10, km: 7 } },
        { t: '18:00', name: '海景告别晚餐 & 洗衣打包', note: '【若选悬崖O Camilo或度假村Levante建议提前1天前台代订】洗烘衣物打包行李' }
      ]
    },
    {
      city: 'algarve', stay: null,
      title: '返程 · 还车登机',
      tips: [
        { i: '⛽', t: '满油还车防扣费', b: '进里斯本机场外环路前加满 <b>95 号汽油 (Gasolina 95)</b>，保留加油小票；直达 <b>LIS Terminal 1 租车归还区（Car Rental Return）</b>，满 96 小时租期，工作人员 2 分钟扫码收车。' },
        { i: '🛗', t: '无缝进航站楼 & 快速安检', b: '还车点就在 T1 航站楼内，无需坐接驳车，直接推婴儿车乘电梯即达出发大厅；值机时给推车挂 <i>Delivery at Aircraft</i> 标签，走 <b>Family Fast Track</b> 家庭专属免费快速安检通道。' },
        { i: '✈️', t: '直飞返美时刻', b: '登机口办推车 Gate Check 优先登机，搭乘傍晚直飞航班（<b>TP209 17:00 飞 JFK</b> 或 <b>TP203 17:45 飞 EWR</b>）轻松返程。' }
      ],
      stops: [
        { t: '09:00', name: '退房北上', note: '海景早餐后退房，A2 高速一路畅通回里斯本机场', at: 'algarve', leg: { mode: 'drive', min: 150, km: 250 } },
        { t: '11:45', name: '机场满油还车 (满 96h)', note: 'LIS Terminal 1 租车中心 2 分钟扫码还车', query: 'Aeroporto de Lisboa (LIS)' },
        { t: '12:15', name: 'TAP 值机与家庭快速安检', note: '推车走 Family Fast Track 快速通道，登机口 Gate Check，傍晚直飞返纽约' }
      ]
    }
  ],

  /**
   * 「随身」页折叠卡片。酒店卡与点餐大字卡由 app.js 专门渲染。
   * 可选 copy：渲染一个“复制”按钮。
   */
  pocket: [
    {
      icon: '📋', title: '行前与当地预订时间表', summary: '出发前锁哪几项 · 到店当天找前台订哪几家',
      body: `<ul>
        <li><b>出发前 1-2 个月</b>：在 Expedia 锁定 <b>5/8 10:00 – 5/12 12:00（96h/4天）</b> 里斯本机场 T1 柜台自动挡 SUV（Nissan Qashqai + 幼儿安全座椅），刷 Chase CSP/CSR 拒绝第三方与柜台车险。</li>
        <li><b>出发前 3-4 周</b>：登录 <a href="https://booking.hippotrip.com" target="_blank" rel="noopener">booking.hippotrip.com</a> 抢 <b>D2 (5/5 周三) 16:00 场 HippoTrip</b>（4 成人 + 1 儿童占座票）。</li>
        <li><b>D1 (5/4) 入住 Upon 当天</b>：① 在 Google Maps / TheFork 订明晚 D2 18:00 <b>5 Oceanos</b> 河景露台位；② 查周五天气：晴天在 <a href="https://www.parquesdesintra.pt" target="_blank" rel="noopener">parquesdesintra.pt</a> 买 D4 <b>佩纳宫纯公园票 (€10) + 接驳小巴 (€3.5)</b>；雨天在 <a href="https://tickets.oceanario.pt" target="_blank" rel="noopener">tickets.oceanario.pt</a> 买海洋水族馆（勾 1 张 €0 Infant 票）。</li>
        <li><b>D4 (5/7) 出发去拉各斯前</b>：看阿尔加维风浪预报，在 <b>GetYourGuide</b> 订 D6 (5/9 周日) 09:30 <b>Catamaran 双体船看海豚</b>（享 24h 免费退改）。</li>
        <li><b>D5 (5/8) 14:00 入住 Belmar 当天</b>：在接待处请前台帮忙连打 3 个电话锁死拉各斯热门晚餐（点击下方按钮可复制话术直接递给前台看）。</li>
      </ul>`,
      copy: 'Hello! Could you please help us call to book a table for 4 adults + 1 baby high chair (Cadeira de bebé)? 1) Tonight Sat 18:00 at Campimar (+351 282 762 024); 2) Tomorrow Sun 18:00 at Don Sebastião (+351 282 780 480); 3) Monday 17:30 at Casinha do Petisco (+351 282 767 163). Thank you!',
      copyLabel: '复制给 Belmar 前台代订餐厅话术'
    },
    {
      icon: '🍽️', title: '餐厅订位与前台代订电话表', summary: '错峰神技 · 电话直拨 · 哪家免排哪家必订',
      body: `<p>💡 <b>错峰神技</b>：当地人午餐 13:30、晚餐 20:00 才吃；我们 <b>11:45 午饭、17:30-18:00 晚饭</b> 恰好卡在开门首波！遇到只接电话的老店，直接请酒店前台代订（备注 <code>4 Adults + 1 Cadeira de bebé</code>）：</p>
      <ul>
        <li>🟢 <b>D2 早茶 Pastéis de Belém</b>：免订位！别排门外外卖队，直接进 400 座堂食大厅。</li>
        <li>🟡 <b>D2 晚餐 5 Oceanos / Doca de Santo</b>：河景露台提前 1-2 天 Google Maps / TheFork 订 18:00（电话 <a href="tel:+351213978395">+351 213 978 395</a>）。</li>
        <li>🔴 <b>D3 晚餐 自由大道周边</b>：名店 <b>Solar dos Presuntos</b> 需提前 1-2 周官网订；隔壁海鲜老店 <b>Pinóquio</b> 或烤鸡 <b>Bonjardim</b> 18:00 直进免排队。</li>
        <li>🔴 <b>D5 (周六晚) Campimar 沙滩餐厅</b>：日落位抢手！官网 <a href="https://campimar.pt" target="_blank" rel="noopener">campimar.pt</a> 或请 Belmar 前台打 <a href="tel:+351282762024">+351 282 762 024</a> 订 18:00。</li>
        <li>🔴 <b>D6 (周日晚) Don Sebastião</b>：周日小馆多店休！周六入住时请前台打 <a href="tel:+351282780480">+351 282 780 480</a> 订周日 18:00。</li>
        <li>🟡 <b>D7 (周一午) Chico Zé 炭烤鱼</b>：仅做 12:00-16:00 午市，无网订，<b>11:45 到场直接坐第一波免排队</b>（电话 <a href="tel:+351282764595">+351 282 764 595</a>）。</li>
        <li>🔴 <b>D7 (周一晚) Casinha do Petisco</b>：全店仅 7-8 张桌！请前台打 <a href="tel:+351282767163">+351 282 767 163</a> 代订周一 17:30 首轮（或 17:20 到门口排第一波）。</li>
        <li>🟡 <b>D8 (周二晚) O Camilo / Levante</b>：悬崖餐厅 O Camilo（<a href="tel:+351282763845">+351 282 763 845</a>）或度假村 Levante 提前 1 天请前台代订。</li>
      </ul>`
    },
    {
      icon: '🍲', title: '幼童辅食 5 大安全牌', summary: '每家传统葡国餐馆都能点的不踩雷宝宝餐',
      body: `<ul>
        <li>🥣 <b>1. Sopa de Legumes（蔬菜泥浓汤）</b>：土豆、南瓜、胡萝卜与西葫芦炖煮打泥，微甜顺滑无重料，每餐必点（€1.5~€3），泡白米饭神器。</li>
        <li>🐟 <b>2. Arroz de Tamboril（鮟鱇鱼海鲜泡饭）</b>：鮟鱇鱼全身只有一根主脊骨、<b>完全没有细刺</b>，肉质Q弹紧实，米饭吸饱鲜甜番茄海鲜汤。</li>
        <li>🐟 <b>3. Peixe Grelhado sem sal（清烤海鱼配水煮土豆）</b>：点海鲈鱼 (<i>Robalo</i>) 或金头鲷 (<i>Dourada</i>)，叮嘱服务员 <b>“Sem sal”</b>（不放盐），用辅食剪剪碎拌橄榄油。</li>
        <li>🍗 <b>4. Frango Assado sem piri-piri（葡式烤鸡）</b>：外焦里嫩，点单时强调 <b>“Sem piri-piri”</b>（绝不要刷辣椒油），取鸡胸与鸡腿内侧嫩肉给宝宝吃。</li>
        <li>🥩 <b>5. Bitoque（薄煎嫩牛排配蛋饭）</b>：葡国国民简餐，薄牛排配全熟煎蛋、白米饭与薯条，补充铁质与体力。</li>
      </ul>`
    },
    {
      icon: '🎟', title: '门票防坑与 4 大不买清单', summary: '哪项必抢 · 哪 4 项是智商税坚决不买',
      body: `<ul>
        <li>🔴 <b>必抢：HippoTrip 两栖车 (D2 16:00)</b>：提前 3-4 周在官网 <a href="https://booking.hippotrip.com" target="_blank" rel="noopener">booking.hippotrip.com</a> 买票（4成人+1儿童票占座）。</li>
        <li>🟡 <b>按天气买：佩纳宫纯公园票 (D4) & 海豚双体船 (D6)</b>：佩纳宫提前 1-2 天买 <b>Park Ticket (€10) + Transfer 小巴 (€3.5)</b>；海豚船提前 2-3 天在 GetYourGuide 选 <b>Catamaran</b>。</li>
        <li>❌ <b>不买 1：Lisboa Card (城市卡)</b>：4 大 1 小打 UberXL / Bolt XL 便宜舒服，且卡不含两栖车，买卡必亏。</li>
        <li>❌ <b>不买 2：佩纳宫“宫殿室内 (Palace Interior)”票</b>：室内狭窄螺旋梯禁推车且排长队，买 €10 纯公园票上纯平王后露台拍城堡才最爽。</li>
        <li>❌ <b>不买 3：圣胡斯塔电梯票 (€6/人)</b>：底下排 1 小时队；从 Chiado 卡尔莫修道院右侧平路可直接免费走上顶层观景天桥。</li>
        <li>❌ <b>不买 4：修道院内殿与贝伦塔登顶票</b>：逼仄石阶推车寸步难行，在修道院外纯平大草坪与河岸散步看景最惬意。</li>
      </ul>`
    },
    {
      icon: '🎒', title: '出门推车妈咪包 8 件套 & 穿搭', summary: '推车篮常备 8 样神器 · 5 月洋葱式穿衣与洗衣',
      body: `<p>🛒 <b>出门推车下篮常备 8 样神器</b>：</p>
      <ul>
        <li>1️⃣ <b>防风遮阳薄毯/大披肩</b>（大西洋海风或餐厅冷气随时盖小腿）</li>
        <li>2️⃣ <b>轻便折叠餐椅垫 + 便携围兜</b></li>
        <li>3️⃣ <b>Mimosa 200ml 带弯头吸管全脂常温奶 2 盒</b> + 米饼果泥</li>
        <li>4️⃣ <b>便携辅食剪 + 小软勺</b>（剪碎海鱼、嫩肉与水煮土豆）</li>
        <li>5️⃣ <b>独立装湿厕纸 + 大包酒精湿巾</b></li>
        <li>6️⃣ <b>薄款隔尿垫 + 纸尿裤 4 片</b>（两栖车登车前必换）</li>
        <li>7️⃣ <b>可放平婴儿推车（配加长遮阳篷与防雨罩）</b></li>
        <li>8️⃣ <b>防水纸尿裤 (Swim Diapers)</b>（Upon 楼顶池与 Belmar 室内温水池必穿）</li>
      </ul>
      <p>🧥 <b>5 月洋葱穿搭与洗衣提示</b>：两处公寓均带洗衣机（仅需带 4-5 天换洗量；Upon 可借晾衣架或去 <b>-1 楼商用烘干机</b>快速烘干）。大人必穿<b>防滑健步鞋</b>（老城碎石坡路防滑，禁硬底皮鞋）+ <b>防风薄外套/冲锋衣</b>（罗卡角与出海防风）。</p>`
    },
    {
      icon: '✈️', title: 'TAP 航司亲子乘机', summary: '纽约直飞时刻 · 行李限重 · 婴儿妈咪包 · 快速通道',
      body: `<ul>
        <li>✈️ <b>NYC 直飞里斯本时刻</b>：去程选红眼直飞（JFK TP210 晚 22:05 发/次日 10:15 到；或 EWR TP204 晚 23:00 发/次日 11:00 到），宝宝通宵深睡，早晨落地；回程 LIS 傍晚发（TP209 17:00 或 TP203 17:45），自驾返程零赶场。</li>
        <li><b>成人随身额度</b>：每人 1 个 20 寸登机箱（限重高达 <b>10 kg / 22 lbs</b>，55×40×25 cm）+ 1 个随身小包（40×30×15 cm，2 kg）。</li>
        <li>👶 <b>Baby on lap（不占座婴儿）</b>：同行成人<b>免费额外携带 1 个装满奶粉/尿布/辅食的随身婴儿包（Diaper Bag）</b>登机，不占用成人自身额度！</li>
        <li>🛒 <b>推车 Gate Check</b>：1 辆完全折叠推车<b>免费托运</b>。值机时挂 <i>"Delivery at Aircraft"</i> 标签，推至登机口交运，下机在机舱门口直接取回。</li>
        <li>⚡ <b>LIS 机场主场特权</b>：T1 航站楼享受<b>专属家庭值机柜台</b>、<b>Family Fast Track 快速安检通道</b>以及带推车优先登机 (Pre-boarding)。</li>
        <li>🍼 <b>机上暖奶</b>：巡航时可随时请乘务员免费加热奶瓶或宝宝辅食。</li>
      </ul>`
    },
    {
      icon: '🚗', title: '自驾要点', summary: '紧凑型 SUV · 96h (4天) · 座椅 · Via Verde · 保险',
      body: `<ul>
        <li><b>取还</b>：5/8 (周六) 上午 10:00 提车 → 5/12 (周三) 中午 12:00 还车，里斯本机场 T1 航站楼内柜台，整 96 小时（4 天）。</li>
        <li><b>车型锁定</b>：<b>4 大 1 小选紧凑型自动挡 SUV</b>（如 Nissan Qashqai，504L 后备箱放 4 个 20 寸登机箱 + 折叠推车，Expedia 比价预订比官网更省）。坚决选油车（汽油 <b>Gasolina 95</b>）。</li>
        <li><b>座椅</b>：自驾<b>不享受</b>交规豁免，柜台加租幼儿座椅（约 €8~10/天），固定在后排 ISOFIX。</li>
        <li><b>保险</b>：提车全额刷 Chase 蓝宝石卡 (CSP/CSR) 并拒绝柜台 CDW，白嫖 Primary $0 自付车损险。</li>
        <li><b>收费站</b>：提车时开通 Via Verde 盒子（约 €1.5~2/天），走绿色 “V” 通道不减速。</li>
      </ul>`
    },
    {
      icon: '📝', title: 'Upon & Belmar 住处避坑与备注', summary: '两卧房型怎么选 · 零小费原则 · 英文备注复制',
      body: `<ul>
        <li>🏙️ <b>Upon Lisbon (4 晚)</b>：80㎡ 两卧两卫大套房；办入住可向前台借折叠晾衣架（<i>Drying rack</i>），大量衣物直接去 <b>-1 楼自助洗衣房</b>用商用烘干机烘干。</li>
        <li>🌊 <b>Belmar 房型首选 (4 晚)</b>：🥇 <b>2 Bedroom Apartment - Sea View</b>（约 €1,008/4晚，单层平层电梯直达无内梯，幼童最安全）；🥈 Roof Terrace（复式需申领 Stair gate）；🥉 Standard 2 Bedroom（地面层零台阶）；❌ <b>严禁订 Budget 2 Bedroom</b>（负一层半地下室阴暗返潮）。</li>
        <li>🍽 <b>餐饮与取消</b>：选<b>纯房 (Accommodation only)</b> 拒 Half Board；先用 Free cancellation 锁房，黑五降价则新订退旧单。</li>
        <li>🚫 <b>严禁美式“三明治小费法”</b>：欧洲公寓前台严禁护照夹现金博升房（会被视为误会或行贿），办理入住小费 €0，靠下方亲子英文备注免费优调房位。</li>
      </ul>`,
      copy: 'We are traveling with 4 adults and 1 infant under 2 years old. Please arrange a quiet single-level apartment (strictly NO duplex/internal stairs if Sea View/Standard booked), preferably with elevator access. If a roof terrace apartment is assigned, please provide a stair safety gate for the infant. We also request 1 baby cot/crib and a drying rack. Thank you!',
      copyLabel: '复制订房英文备注'
    },
    {
      icon: '🥖', title: '餐前小食 Couvert', summary: '没点的面包橄榄，不吃就不收钱',
      body: `<p>桌上不请自来的面包、黄油、橄榄、鱼酱<b>不是免费送的</b>：动了就计费（整套约 €6~12）。</p>
        <p>不想要，服务员放下时笑着说 <b>“Não, obrigado”</b>，他会端走，不记账。</p>
        <p>葡萄牙<b>没有强制小费</b>：菜单价已含税与服务，刷卡按原价；服务特别好留 €2~5 零钱就很大方。</p>`
    },
    {
      icon: '🍼', title: '超市买奶', summary: 'Mimosa 200ml 带吸管全脂奶',
      body: `<p>✅ 认准 <b>Mimosa Leite UHT Gordo 200ml</b>（全脂常温奶，自带弯头吸管）或 <b>Mimosa Crescer</b>（幼儿成长款），6 盒约 €1.5。</p>
        <p>✅ 认准 <i>Leite Branco / Gordo</i>。</p>
        <p>❌ 避开 <b>com Chocolate</b>（巧克力）、<b>com Morango / Banana</b>（调味奶）。</p>`
    }
  ]
};
