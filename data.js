/**
 * 唯一内容来源 (single source of truth)。内容整理自 TRIP_PROFILE_4A1C.md。
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
  start: '2027-05-07',
  tz: 'Europe/Lisbon',
  party: '4 大 1 小家庭行',
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
      address: 'Rua Luciana Stegagno Picchio, 12, Lisbon, PT · ☎ +351 211 549 640 · ✉ reservas@uponlisbon.com',
      status: '【✅ 已确认】Deluxe Apartment, 2 Double, 2 Bedroom (5/6预留夜➡️5/7 11:30直接进房 – 5/10 12:00 退房)'
    },
    algarve: {
      name: 'Belmar Spa & Beach Resort (贝尔马水疗海滩度假村)',
      query: 'Belmar Spa & Beach Resort, Lagos, Portugal',
      address: null,
      status: '【✅ 已确认】2 Bedroom (5/10 16:00 入住 – 5/14 10:00 退房 · 4 晚)'
    }
  },

  // 第几天的序号 (n) 与日期 (date) 由 app.js 根据 start 自动推算，增删或调换天数无需手动改序号和日期
  days: [
    {
      city: 'lisbon', stay: 'lisbon',
      title: '抵达直接进房 · 泳池 & 自由大道 LV',
      tips: [
        { i: '✈️', t: '通关与打车 (去程直飞)', b: '<b>10:20 落地 LIS T1</b>：机舱口取回 Gate Check 推车，走 <b>Family Fast Track</b> 家庭快速通道出关；叫 UberXL / Bolt XL（双 App 比价约 €10-14，2岁内幼童合法抱坐后排）10 分钟直达 Upon。' },
        { i: '🛏️', t: '11:30 零等待直接拿卡进房补觉！', b: '因已预订 5/6 首晚（提前发邮件至 <code>reservas@uponlisbon.com</code> 确认留房），<b>11:30 到店无需等到 15:00，直接拿房卡进 80㎡ 两卧套房</b>！楼下或房内简单垫胃后拉上遮光帘<b>全家大床深睡 2.5-3 小时</b>，顺便向前台借折叠晾衣架（<i>Drying rack</i>）。' },
        { i: '🛍️', t: '下午楼顶泳池 + 自由大道 LV', b: '15:30 睡醒在楼顶无边恒温泳池看夕阳戏水（宝宝穿防水纸尿裤）；<b>16:45 UberXL 进城逛自由大道 LV 旗舰店</b>（带护照退税 12%-15%，长辈在树荫 <i>Quiosque</i> 咖啡亭小憩），18:15 吃大餐！' },
        { i: '🦞', t: '晚餐订位与顺手办', b: '若选顶级海鲜名店 <a href="restaurants.html"><b>Solar dos Presuntos</b></a>（周五营业至 23:30）需提前 1-2 周官网订 18:15 位；若选隔壁老牌海鲜 <b>Pinóquio</b> 或烤鸡 <b>Bonjardim</b>，18:15 错峰直进。当晚顺手在 Google Maps / TheFork 订好明天 D2 晚 18:00 <b>5 Oceanos</b> 河景露台位。' }
      ],
      stops: [
        { t: '10:20', name: '去程直飞 抵达里斯本机场 (LIS T1)', note: '机舱口取推车，Family Fast Track 快速出关，UberXL 10 分钟直达 Upon', query: 'Aeroporto de Lisboa (LIS)' },
        { t: '11:30', name: 'Upon 零等待直接进房 · 暖胃与大床补觉', note: '用 5/6 预留夜直接拿房卡进 80㎡ 两卧套房！垫胃后拉遮光帘深睡 2.5-3h 击碎时差', at: 'lisbon', leg: { mode: 'uber', min: 10, km: 6, eur: 11 } },
        { t: '15:30', name: '楼顶无边恒温泳池戏水 & 咖啡', note: '30℃ 温水舒缓长途飞行筋骨，宝宝玩水开心，长辈露台喝咖啡' },
        { t: '16:45', name: '自由大道名牌街 (LV 旗舰店 / 梧桐咖啡亭)', note: '买名牌组逛 LV (退税12~15%)；长辈推车在树荫 Quiosque 咖啡亭喝浓缩吃冰淇淋', query: 'Louis Vuitton Lisboa Avenida da Liberdade', leg: { mode: 'uber', min: 12, km: 5, eur: 10 } },
        { t: '18:15', name: '自由大道周边海鲜 / 烤鸡晚餐', note: '【若选Solar dos Presuntos需提前1-2周官网订；选Pinóquio或Bonjardim可18:15直进】顺路超市买 1.5L 饮用水与 Mimosa 吸管奶', query: 'Restaurante Pinóquio, Lisboa' }
      ]
    },
    {
      city: 'lisbon', stay: 'lisbon',
      title: '贝伦古迹 · 水陆两栖车',
      tips: [
        { i: '🥧', t: '蛋挞老店免排队秘诀', b: '<b>千万别排店门外长队</b>（那是外带队）！推车直接穿过拱门进里面 <b>400 座堂食大厅</b>找座，有宝宝高脚椅，免预约随到随坐。' },
        { i: '🐟', t: '贝伦午餐（免订位）', b: '12:00 错峰直进平民海鲜馆 <b>O Recanto</b> 或 <b>Taberna dos Ferreiros</b>，点清蒸海鱼配土豆泥（交代 <i>Sem sal</i> 不放盐）。' },
        { i: '🦛', t: 'HippoTrip 两栖车 4 大实战铁律', b: '① 必须提前官网买好 16:00 场（含 €20 儿童占座票，不查护照）；② <b>全程 90 分钟无厕所，登车前务必在 Doca 码头游客中心换好尿布</b>；③ 用<b>随身小背包垫在宝宝屁股下（垫高 10cm）</b>越过窗框看海；④ 陆地段系安全带投喂米饼果泥，下水后平稳可抱腿上看巨浪。' },
        { i: '🍽️', t: '码头海鲜晚餐 & 明晚看天气', b: '下船走 2 分钟即达 <b>5 Oceanos</b>（电话 <a href="tel:+351213978395">+351 213 978 395</a>）或 <b>Doca de Santo</b>；第一排临水露台建议提前 1-2 天在 <a href="restaurants.html">Google Maps / TheFork 订 18:00 位</a>（备注 <code>Cadeira de bebé</code>）。睡前看一眼明天周日天气订 <a href="todo.html">D3 佩纳宫公园票</a>。' }
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
      title: '辛特拉 · 罗卡角 · 卡斯凯什',
      tips: [
        { i: '🏰', t: '佩纳宫无痛避坑（核心！）', b: '在官网 <a href="https://www.parquesdesintra.pt" target="_blank" rel="noopener">parquesdesintra.pt</a> <b>只买纯公园票 (Park Ticket €10) + 园内接驳小巴 (Park Transfer €3.5)</b>，<b>坚决不买宫殿室内票</b>（室内全窄螺旋梯且排 1.5h）！进门坐小巴 3 分钟直达山顶，走纯平<b>王后露台 (Queen\'s Terrace)</b> 拍红黄城堡大片（建议带腰凳/轻便折叠推车）。' },
        { i: '🥐', t: '小镇枕头酥与午餐', b: '<b>Casa Piriquita</b> 周日正常营业（周三休），免预约吃温热杏仁蛋黄枕头酥（<i>Travesseiros</i>）；午餐去网红葡式小馆 <b>Tascantiga</b> 12:00 直进，或正餐 <b>Tulhas</b> 请前台头天订位。' },
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
      title: '老城观景 · 英国宫逛街 · 提车南下',
      tips: [
        { i: '👟', t: '上午顺坡零费力逛老城', b: '09:30 UberXL 直上最高峰圣母山顶，往下经圣卢西亚观景台拍 28 路电车到商业广场<b>全段顺坡下滑</b>；老城碎石坡路滑，长辈务必穿<b>防滑健步鞋</b>。' },
        { i: '🛍️', t: 'D1 + D4 双保险购物（英国宫百货）', b: '12:00 Upon 退房把箱子寄存前台，轻装打车 7 分钟去 <b>El Corte Inglés 英国宫百货</b>！顶楼吃热午餐，顺便在一二楼补货 <b>LV / Gucci / Loewe / Prada / 美妆名表</b>（全空调纯平、百货退税台一站式退税，带护照），13:50 回 Upon 拿箱去机场！' },
        { i: '🚗', t: '14:30 提车 4 步核对（整 96h 省一天租金！）', b: '① 认准 LIS T1 <b>Guerin</b> 柜台提 <b>BYD Seal U DM-i 或同级混动 SUV</b>（加 <b>95 号汽油</b>，拆遮物隔板装 4 箱+推车）；② 加租后排 ISOFIX 幼儿安全座椅；③ 激活 <b>Via Verde</b> 高速盒子；④ 全额刷 <b>Chase CSP/CSR</b> 拒绝柜台 Super CDW 白嫖 Primary 全险。' },
        { i: '📞', t: '【17:15 办 Belmar 入住】先请前台订今明两晚', b: '入住时不用一次全订，先请礼宾订<b>今晚 18:15 Campimar</b> 与<b>明晚 17:30 Casinha do Petisco</b>，直接点 <a href="restaurants.html#belmar-show"><b>前台英文卡</b></a> 亮给他看。' },
        { i: '🌤️', t: '看海况锁明天海豚船', b: '查明天周二上午风浪预报，在 <a href="todo.html"><b>Expedia / GetYourGuide</b> 订明早 09:30 <b>Catamaran 大型双体船</b></a>（若明早浪大可改订 D6 或 D7 上午，连住 4 晚有 3 个上午窗口！）。' }
      ],
      stops: [
        { t: '09:30', name: 'Senhora do Monte 圣母山观景台 & 28 路电车', note: 'UberXL 直达山顶平地俯瞰红屋顶，顺坡向下经圣卢西亚瓷砖长廊拍复古黄电车到商业广场', query: 'Miradouro da Senhora do Monte, Lisboa', leg: { mode: 'uber', min: 18, km: 8, eur: 12 } },
        { t: '12:00', name: 'Upon 12:00 退房寄存大箱', note: '官方 12:00 退房把 4 个箱子免费寄存前台，轻装出发吃饭逛百货', at: 'lisbon', leg: { mode: 'uber', min: 15, km: 7, eur: 10 } },
        { t: '12:15', name: '英国宫百货 (El Corte Inglés) 午餐 + 大牌补货', note: '全空调纯平无障碍！顶楼吃热午餐，一二楼补货 LV/Gucci/Loewe/美妆名表并集中办退税（带护照）', query: 'El Corte Inglés Lisboa', leg: { mode: 'uber', min: 7, km: 3, eur: 7 } },
        { t: '13:50', name: '回 Upon 拿箱 ➡️ 机场 T1 租车中心', note: 'UberXL 回 Upon 顺路取上寄存行李，10 分钟直达 LIS T1 租车柜台', query: 'Aeroporto de Lisboa (LIS)', leg: { mode: 'uber', min: 12, km: 6, eur: 11 } },
        { t: '14:30', name: 'LIS T1 Guerin 提 BYD Seal U DM-i (96h 起点)', note: '提自动挡混动 SUV（拆遮物隔板装 4 箱+推车），装儿童座椅，激活 Via Verde，刷 CSP', query: 'Aeroporto de Lisboa (LIS)' },
        { t: '15:00', name: 'A2 高速自驾南下（宝宝午睡）', note: '正好撞上宝宝午睡时间，高速巡航 2.5 小时直奔拉各斯', leg: { mode: 'drive', min: 150, km: 250 } },
        { t: '17:15', name: '零等待直接入住 Belmar (连住 4 晚)', note: '房间已保洁就绪！地库电梯直通两卧海景平层，顺便请前台代订拉各斯晚餐！', at: 'algarve' },
        { t: '17:45', name: 'Porto de Mós 细沙海滩看日落', note: '步行 5 分钟，平缓细沙踩水看金色悬崖', query: 'Praia de Porto de Mós, Lagos', leg: { mode: 'walk', min: 5 } },
        { t: '18:15', name: '沙滩 Campimar 晚餐', note: '【强烈建议订位：官网campimar.pt或请Belmar前台电话代订】现捞烤大明虾配海景日落', query: 'Campimar Beach Restaurant, Lagos', leg: { mode: 'walk', min: 3 } }
      ]
    },
    {
      city: 'algarve', stay: 'algarve',
      title: '出海看海豚 · 恒温泳池',
      tips: [
        { i: '🐬', t: '海豚巡航选船铁律', b: '必须认准 <b>Catamaran（大型双体客船，带遮阳舱与洗手间）</b>，<b>严禁选 RIB 充气快艇</b>！清晨 09:30 海面风浪最小，海豚跃水率 95%+，记得穿防风外套。' },
        { i: '🐟', t: '午市 Chico Zé 免排队秘诀', b: '周二正常营业（仅做 12:00-16:00 午市，<b>避开周日店休！</b>），无网上订位；<b>11:45 准时到场直接坐第一波零等位</b>（或请前台打 <a href="tel:+351282764595">+351 282 764 595</a> 留 5 人桌），必点现捞炭烤海鲷鱼与沙丁鱼。' },
        { i: '🏊', t: '室内恒温池戏水', b: 'Belmar 室内水疗池（09:00-18:00）水温恒定 30℃，合规允许儿童入水，记得给宝宝换上<b>防水纸尿裤 (Swim Diapers)</b>。' },
        { i: '🍲', t: '晚市 Casinha do Petisco 抢位铁律', b: '拉各斯口碑王，<b>全店仅 7-8 张桌且不接网订（周二营业，避开周日店休！）</b>！确认 Belmar 前台已帮打 <a href="tel:+351282767163">+351 282 767 163</a> 锁好 17:30 首轮座位；若未订上，务必在 <b>17:20 开门前到门口排第一名</b>，必点铜锅慢炖猪肉蛤蜊（<i>Carne de Porco à Alentejana</i>）。另：今天路过前台可顺口用 <a href="restaurants.html#belmar-show"><b>前台英文卡</b></a> 订周三/周四晚餐。' }
      ],
      stops: [
        { t: '09:30', name: 'Lagos Marina 海豚巡航 (早班)', note: '大型双体船 (Catamaran) 超平稳，清晨海豚超活跃！', query: 'Marina de Lagos, Portugal', leg: { mode: 'drive', min: 6, km: 3.5 } },
        { t: '11:45', name: 'Chico Zé 现捞炭烤海鲜 (周二营业)', note: '【避开周日店休！11:45开门前到场第一波免等位，或请前台电话留座】炭烤海鲷鱼绝香', query: 'Restaurante Chico Zé, Lagos', leg: { mode: 'drive', min: 5, km: 3 } },
        { t: '13:00', name: '回房独立卧室关门午睡', note: '开车 6 分钟秒回 Belmar，关卧室门彻底深睡 2.5 小时', at: 'algarve', leg: { mode: 'drive', min: 6, km: 3.5 } },
        { t: '15:45', name: 'Belmar 室内恒温泳池', note: '儿童合规可用（穿防水纸尿裤），水温 30℃ 尽情戏水', at: 'algarve' },
        { t: '17:00', name: '拉各斯古城老街 & Crema di Gelato', note: '手工彩绘陶瓷店 + 网红开心果手工冰淇淋', query: 'Crema di Gelato, Lagos', leg: { mode: 'drive', min: 5, km: 2.5 } },
        { t: '17:30', name: 'Casinha do Petisco 晚餐 (周二营业)', note: '【避开周日店休！仅7-8张桌，请前台代订17:30首轮位】必点铜锅猪肉蛤蜊', query: 'Casinha do Petisco, Lagos', leg: { mode: 'walk', min: 4 } }
      ]
    },
    {
      city: 'algarve', stay: 'algarve',
      title: '悬崖栈道 · 卢斯海滩',
      tips: [
        { i: '🌊', t: '悬崖纯平木栈道', b: '车停 Ponta da Piedade 灯塔免费停车场，全新木栈道（<i>Passadiços</i>）全程零台阶无障碍，晨光顺光拍金色海蚀拱门与翡翠海水最出片。' },
        { i: '🐟', t: '码头游艇午餐', b: '11:45 码头木栈道餐馆 <b>Adega da Marina</b> 或 <b>Quay Lagos</b> 错峰直进，吃清烤石斑鱼柳配水煮土豆（<i>Sem sal</i>）。' },
        { i: '🌴', t: 'Praia da Luz 卢斯海滩漫步', b: '自驾 8 分钟去 <b>Praia da Luz</b>，全阿尔加维最平坦的棕榈海滨石板长廊，在古堡海景餐厅 <b>Fortaleza da Luz</b> 露台喝咖啡看海浪（免订位）。' },
        { i: '🍷', t: '老城经典 Don Sebastião 晚餐', b: '拉各斯老城经典老牌名店 <b>Don Sebastião</b>（周三正常营业），提前 1-2 天请 <a href="restaurants.html#belmar-show"><b>Belmar 前台</b></a> 打 <a href="tel:+351282780480">+351 282 780 480</a> 订好 18:00 桌位。' }
      ],
      stops: [
        { t: '09:15', name: 'Ponta da Piedade 悬崖木栈道', note: '全平无障碍木板路，晨光顺光看金色海蚀拱与玻璃海', query: 'Ponta da Piedade, Lagos', leg: { mode: 'drive', min: 4, km: 2.2 } },
        { t: '11:45', name: 'Marina 码头游艇景观午餐', note: '【11:45错峰直进免订位】清烤石斑鱼柳配水煮土豆 (Sem sal)', query: 'Adega da Marina, Lagos', leg: { mode: 'drive', min: 5, km: 3 } },
        { t: '13:15', name: '回房独立卧室关门午睡', note: '开车 5 分钟秒回 Belmar，宝宝深睡充能', at: 'algarve', leg: { mode: 'drive', min: 5, km: 2.5 } },
        { t: '15:45', name: 'Praia da Luz 卢斯海滩步道 & Fortaleza da Luz 喝茶', note: '纯平棕榈步道，古堡海景露台喝早茶/下午茶看海浪', query: 'Praia da Luz, Lagos', leg: { mode: 'drive', min: 8, km: 6 } },
        { t: '18:00', name: '拉各斯老城 Don Sebastião 晚餐', note: '【提前1-2天请Belmar前台电话代订18:00位】老城经典海鲜与酒窖', query: 'Restaurante Don Sebastião, Lagos', leg: { mode: 'drive', min: 6, km: 5 } }
      ]
    },
    {
      city: 'algarve', stay: 'algarve',
      title: '动物园萌宠 · 度假村慢享',
      tips: [
        { i: '🦩', t: '上午二选一 A（幼童最爱·喂小矮羊）', b: '自驾 12 分钟去 <b>Zoo de Lagos</b>（10:00 开园，<b>现场买票零排队，未满 3 岁免费</b>），全程树荫平路看企鹅隧道与火烈鸟，门口买 <b>€1 饲料包</b>在萌宠农场（<i>Quinta Pedagógica</i>）亲手喂小矮羊与小兔；午餐可去园口葡国田园餐厅 <b>Restaurante O Cangalho</b>（12:00 随到随坐）。' },
        { i: '🏰', t: '上午二选一 B（天涯海角·萨格里什）', b: '自驾 25 分钟前往欧洲西南角的 <b>萨格里什要塞 (Fortaleza de Sagres)</b> 与圣文森特角，巨大悬崖延伸入大西洋，平坦宽阔壮美（风大记得套防风外套）。' },
        { i: '🌅', t: '告别晚餐与打包', b: '告别晚宴若选悬崖海景名店 <b>O Camilo</b>（电话 <a href="tel:+351282763845">+351 282 763 845</a>）或 Belmar 自营海景餐厅 <b>Levante</b>，提前 1 天请 <a href="restaurants.html#belmar-show"><b>Belmar 前台</b></a> 代订 18:00 桌位；晚上用套房洗衣机洗净全家衣物打包。' }
      ],
      stops: [
        { t: '09:30', name: '【二选一 A】拉各斯动物园 Zoo de Lagos', note: '自驾 12 分钟，纯平林荫道，未满3岁免费，萌宠农场 €1 饲料亲手喂矮脚羊与小兔', query: 'Zoo de Lagos, Portugal', leg: { mode: 'drive', min: 12, km: 10 } },
        { t: '09:30', name: '【二选一 B】萨格里什要塞 Fortaleza de Sagres', note: '自驾 25 分钟，天涯海角平坦悬崖要塞看大西洋巨浪', query: 'Fortaleza de Sagres, Portugal', leg: { mode: 'drive', min: 25, km: 30 } },
        { t: '12:00', name: '海滨或田园葡式午餐', note: '【12:00错峰直进免订位】慢享大西洋阳光午餐' },
        { t: '13:30', name: '回 Belmar 午睡 & 度假村躺平', note: '午睡醒来后在度假村草坪、泳池露台或沙滩慢享最后一个海滨下午', at: 'algarve', leg: { mode: 'drive', min: 10, km: 7 } },
        { t: '18:00', name: '海景告别晚餐 & 洗衣打包', note: '【若选悬崖O Camilo或度假村Levante建议提前1天前台代订】洗烘衣物打包行李' }
      ]
    },
    {
      city: 'algarve', stay: null,
      title: '返程 · 14:30 还车登机',
      tips: [
        { i: '⛽', t: '14:30 前满油还车（整 96h）', b: '进里斯本机场外环路前加满 <b>95 号汽油 (Gasolina 95)</b>，保留小票；<b>14:30 前</b>直达 <b>LIS T1 租车归还区</b>，严丝合缝卡死 96h（4 天）租金，工作人员 2 分钟扫码收车。' },
        { i: '🛂', t: '纯 Carry-on 过关秘诀（留 30m 给人工边检）', b: '还车坐电梯直达出发大厅：先去家庭/优先柜台给推车贴 <i>Delivery at Aircraft</i> 标签（5 分钟），再推车走 <b>Family Fast Track 快速安检</b>。⚠️ 注意：带 2 岁宝宝无法走自助电子闸机，过完免税店需预留约 30 分钟走<b>人工护照出境边检</b>。' },
        { i: '✈️', t: '直飞返美时刻 (回程直飞)', b: '16:15 登机口办推车 Gate Check 优先登机，搭乘 <b>回程直飞（17:00 LIS T1 起飞 ➡️ 当晚 20:05 抵达 JFK T1）</b>轻松返程。' }
      ],
      stops: [
        { t: '10:00', name: 'Belmar 10:00 退房北上', note: '官方 10:00 am 退房（可提前问能否延迟到11点），A2 高速 2.5 小时北上回里斯本', at: 'algarve', leg: { mode: 'drive', min: 150, km: 250 } },
        { t: '12:45', name: 'Vasco da Gama 商场热午餐', note: '离机场仅 8 分钟！空调商场坐下舒舒服服吃热午餐，给宝宝换尿布', query: 'Centro Vasco da Gama, Lisboa' },
        { t: '14:15', name: '机场满油还车 (14:30 截止 · 整 96h)', note: '14:30 前 LIS Terminal 1 Guerin 扫码还车（只需满油，无需充电）', query: 'Aeroporto de Lisboa (LIS)', leg: { mode: 'drive', min: 8, km: 4 } },
        { t: '14:45', name: 'TAP 贴推车条 · 快速安检与人工边检', note: '推车走 Family Fast Track 安检 + 人工护照边检，16:15 优先登机 回程直飞 返纽约' }
      ]
    }
  ],

  /**
   * 「随身」页折叠卡片。酒店卡与点餐大字卡由 app.js 专门渲染。
   * 可选 copy：渲染一个“复制”按钮。
   */
  pocket: [
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
        <li>✈️ <b>✅ 已确认 JFK 往返直飞</b>：去程 <b>去程直飞</b>（5/6 周四晚 22:05 JFK T1 发 ➡️ <b>5/7 周五早 10:20 落地 LIS T1</b>，7h15m）；回程 <b>回程直飞</b>（<b>5/14 周五 17:00 LIS T1 发 ➡️ 当晚 20:05 抵 JFK T1</b>，8h05m）。</li>
        <li><b>成人随身额度</b>：每人 1 个 20 寸登机箱（限重高达 <b>10 kg / 22 lbs</b>，55×40×25 cm）+ 1 个随身小包（40×30×15 cm，2 kg）。</li>
        <li>👶 <b>Baby on lap（不占座婴儿）</b>：同行成人<b>免费额外携带 1 个装满奶粉/尿布/辅食的随身婴儿包（Diaper Bag）</b>登机，不占用成人自身额度！</li>
        <li>🛒 <b>推车 Gate Check</b>：1 辆完全折叠推车<b>免费托运</b>。值机时挂 <i>"Delivery at Aircraft"</i> 标签，推至登机口交运，下机在机舱门口直接取回。</li>
        <li>⚡ <b>LIS 机场主场特权</b>：T1 航站楼享受<b>专属家庭值机柜台</b>、<b>Family Fast Track 快速安检通道</b>以及带推车优先登机 (Pre-boarding)。</li>
        <li>🍼 <b>机上暖奶</b>：巡航时可随时请乘务员免费加热奶瓶或宝宝辅食。</li>
      </ul>`
    },
    {
      icon: '🚗', title: '自驾要点 (✅ 已锁 Guerin)', summary: 'BYD Seal U DM-i · 96h (4天) · 座椅 · Via Verde · 保险',
      body: `<ul>
        <li><b>已锁订单</b>：Trip.com 订 <b>Guerin（LIS T1）</b>，<b>5/10 (周一) 14:30 提车 → 5/14 (周五) 14:30 还车</b>，整 96 小时（4 天，$173.61 可免费取消，不限里程）。</li>
        <li><b>已锁车型</b>：<b>BYD Seal U DM-i（或同级自动挡混动 SUV）</b>，后排地板纯平极舒适；提车时<b>拆下后备箱遮物隔板</b>即可叠放 4 个 20 寸箱 + 折叠推车。加 <b>95 号汽油</b>（满油取还，无需充电）。</li>
        <li><b>座椅</b>：发邮件给 <code>support@guerin.pt</code> 报预约号提前加选 <b>Baby Seat (Grp 1, ISOFIX)</b>（到店付约 €8~10/天）。</li>
        <li><b>保险</b>：提车全额刷主驾驶人名下 Chase CSP/CSR 付约 €1,000 预授权押金并拒绝柜台 Super CDW，白嫖 Primary 主险。</li>
        <li><b>收费站</b>：提车时开通 Via Verde 盒子（约 €1.5~2/天），走绿色 “V” 通道不减速。</li>
      </ul>`
    },
    {
      icon: '📝', title: 'Upon & Belmar 住处避坑与备注', summary: '两卧房型怎么选 · 零小费原则 · 英文备注复制',
      body: `<ul>
        <li>🏙️ <b>Upon Lisbon (5/6 预留夜 ➡️ 5/7 11:30 直接进房 – 5/10 12:00 退房)</b>：80㎡ 两卧两卫大套房；提前联系 <code>reservas@uponlisbon.com</code> 留房确保 5/7 上午直接拿卡进房补觉！可向前台借折叠晾衣架（<i>Drying rack</i>），大量衣物去 <b>-1 楼自助洗衣房</b>快速烘干。</li>
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
