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
      status: '【里斯本主选】4 大 1 小 (80㎡ / 861 sq ft 两卧两卫大公寓 · 楼顶恒温泳池) · 5 晚'
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
      status: '【拉各斯首选】2-Bedroom Sea View (两卧海景平层套房 · 91~96㎡ · 室内温水池宝宝可用 · 自带洗衣机 · 免费车库) · 3 晚'
    }
  },

  // 第几天的序号 (n) 与日期 (date) 由 app.js 根据 start 自动推算，增删或调换天数无需手动改序号和日期
  days: [
    {
      city: 'lisbon', stay: 'lisbon',
      title: '晨间抵达 · 深度补觉倒时差',
      tip: 'TAP 直飞晨间落地。第一天坚决不排景点，专心暖胃午餐、大床补觉与楼顶温水泳池。2 岁以下幼童坐 UberXL/Bolt XL 可抱坐后排。',
      stops: [
        { t: '10:30', name: '抵达里斯本机场 (LIS T1)', note: '机舱口取推车，Family Fast Track 快速出关取行李，UberXL 10 分钟直达 Upon', query: 'Aeroporto de Lisboa (LIS)' },
        { t: '11:45', name: 'Upon 寄存行李 / 暖胃午餐', note: '前台寄存大箱申请优先排房，楼下享用清淡蔬菜浓汤与热食午餐驱寒', query: 'Upon Lisbon Prime Residences', leg: { mode: 'uber', min: 10, km: 6, eur: 11 } },
        { t: '13:30', name: '入住 80㎡ 两卧套房 · 深度补觉', note: '两卧独立关门拉遮光帘大床深睡 3 小时，全家彻底摆脱时差疲惫', at: 'lisbon' },
        { t: '17:30', name: '楼顶无边恒温泳池戏水', note: '30℃ 温水泡澡舒缓长途飞行筋骨，俯瞰市区落日晚霞，宝宝玩水开心' },
        { t: '18:45', name: '街区慢步与清淡晚餐', note: '周边传统餐馆吃烤鱼鲜汤，小超市采买大瓶饮用水回房早睡' }
      ]
    },
    {
      city: 'lisbon', stay: 'lisbon',
      title: '贝伦文化日',
      tip: '贝伦区沿河全平推车无障碍。上午百年老店堂食现烤热蛋挞、修道院草坪放电看大桥；下午 LX Factory 创意园露天咖啡漫生活。',
      stops: [
        { t: '09:15', name: 'Pastéis de Belém 蛋挞老店', note: '免排长队堂食，外皮酥脆、奶馅温热，有高脚椅', query: 'Pastéis de Belém, Lisboa', leg: { mode: 'uber', min: 15, km: 10, eur: 12 } },
        { t: '10:00', name: '热罗尼莫斯修道院外广场', note: '纯平回廊与贝伦大草坪，宝宝奔跑放电看大桥', query: 'Mosteiro dos Jerónimos, Lisboa', leg: { mode: 'walk', min: 5 } },
        { t: '11:15', name: '发现者纪念碑 · 贝伦草坪', note: '大草坪放电看大桥帆船', query: 'Padrão dos Descobrimentos, Lisboa', leg: { mode: 'walk', min: 10 } },
        { t: '12:00', name: '贝伦区亲子午餐', note: '清蒸海鱼配土豆泥 (Sem sal)' },
        { t: '13:00', name: '回 Upon 两卧套房深睡', note: '叫 UberXL 秒回公寓，拉遮光帘大床睡足 3 小时', at: 'lisbon', leg: { mode: 'uber', min: 15, km: 10, eur: 12 } },
        { t: '16:00', name: 'LX Factory 创意园', note: '飞天自行车书店 Ler Devagar，工业风手作小店与露天咖啡', query: 'LX Factory, Lisboa', leg: { mode: 'uber', min: 12, km: 7, eur: 10 } },
        { t: '18:00', name: '露天海鲜晚餐', note: '烤章鱼与海鲜饭，吃完 UberXL 回 Upon 休息' }
      ]
    },
    {
      city: 'lisbon', stay: 'lisbon',
      title: '老城 + 水陆两栖车',
      tip: '商业广场沿河纯平看海风帆船，奥古斯塔步行街慢逛。下午 HippoTrip 水陆两栖车老少皆宜冲入河中激起巨浪！',
      stops: [
        { t: '09:00', name: '商业广场 · Baixa', note: '沿河纯平地，早晨游客稀少，拍照大气看帆船', query: 'Praça do Comércio, Lisboa', leg: { mode: 'uber', min: 15, km: 8, eur: 12 } },
        { t: '10:30', name: '奥古斯塔步行街漫步', note: '平坦石板路慢逛，看街头艺人表演', query: 'Arco da Rua Augusta, Lisboa', leg: { mode: 'walk', min: 5 } },
        { t: '11:45', name: 'Chiado 亲子午餐', note: '薄煎牛肉蛋饭 Bitoque，给宝宝补充体力', query: 'Chiado, Lisboa' },
        { t: '13:00', name: '回 Upon 深度午休', note: '回房大床充能 3 小时，傍晚两栖车状态满格', at: 'lisbon', leg: { mode: 'uber', min: 15, km: 8, eur: 12 } },
        { t: '16:00', name: 'HippoTrip 水陆两栖巴士', note: '16:00 黄金场！冲入特茹河激起巨浪！备背包垫高屁股看海，水上可抱坐', query: 'HippoTrip Lisboa', leg: { mode: 'uber', min: 12, km: 7, eur: 11 } },
        { t: '18:00', name: '5 Oceanos 码头海鲜晚餐', note: '正对 425 大桥与游艇，现捞海鲜与花园露台，吃完打车回 Upon', query: '5 Oceanos, Doca de Santo Amaro, Lisboa', leg: { mode: 'walk', min: 2 } }
      ]
    },
    {
      city: 'lisbon', stay: 'lisbon',
      title: '观景 · 自由大道名牌街',
      tip: '汽车直达最高峰圣母山顶俯瞰全城，顺坡漫步看电车。下午自由大道绝妙分流：买名牌 (LV) + 长辈林荫小亭咖啡闲坐看街景。',
      stops: [
        { t: '09:05', name: 'Senhora do Monte 观景台', note: '最高峰俯瞰红屋顶与河谷，清晨无游客争抢', query: 'Miradouro da Senhora do Monte, Lisboa', leg: { mode: 'uber', min: 18, km: 8, eur: 12 } },
        { t: '10:00', name: '顺坡漫步看 28 路电车', note: '顺坡向下滑行，途经圣卢西亚观景台、大教堂', query: 'Miradouro de Santa Luzia, Lisboa', leg: { mode: 'walk', min: 25 } },
        { t: '11:45', name: '山脚平地午餐', note: '鮟鱇鱼海鲜泡饭 Arroz de Tamboril (无细刺)' },
        { t: '13:00', name: '回 Upon 深度午休', note: 'UberXL 秒回公寓，拉帘大床深睡 3 小时', at: 'lisbon', leg: { mode: 'uber', min: 15, km: 7, eur: 11 } },
        { t: '16:00', name: '自由大道名牌街 (LV / 咖啡亭)', note: '买名牌组逛 LV 旗舰店(退税12~15%)；长辈推车在梧桐林荫小亭喝咖啡', query: 'Louis Vuitton Lisboa Avenida da Liberdade', leg: { mode: 'uber', min: 10, km: 5, eur: 9 } },
        { t: '18:30', name: '自由大道周边晚餐', note: '传统名店享用海鲜大餐，吃完打车回 Upon' }
      ]
    },
    {
      city: 'lisbon', stay: 'lisbon',
      title: '亲子日 · 水族馆',
      tip: '世博园区全平无车无障碍。上午海洋水族馆纯平缓坡看翻车鱼与海獭企鹅；下午空中缆车看大桥，采购自驾物资。',
      stops: [
        { t: '09:45', name: '里斯本海洋水族馆 Oceanário', note: '10:00 开馆首批进！全馆纯平坡道，500万升中央水缸', query: 'Oceanário de Lisboa', leg: { mode: 'uber', min: 15, km: 9, eur: 12 } },
        { t: '12:00', name: '滨海轻食午餐', note: '烤三文鱼配甜薯泥，食材新鲜健康' },
        { t: '13:00', name: '滨海林荫道推车午睡 / 回房', note: '3km 纯平无车林荫长廊，推车轻晃秒睡或回 Upon 大床睡' },
        { t: '15:00', name: '滨海景观缆车', note: '空中看达伽马大桥与河口', query: 'Telecabine Lisboa Parque das Nações', leg: { mode: 'walk', min: 5 } },
        { t: '16:00', name: 'Vasco da Gama 商场采购', note: 'Continente 超市买纯牛奶、香蕉水果（明日自驾用）', query: 'Centro Vasco da Gama, Lisboa', leg: { mode: 'walk', min: 8 } },
        { t: '17:30', name: '回 Upon 洗衣服打包', note: '洗净衣物甩干，整理 80% 行李', at: 'lisbon', leg: { mode: 'uber', min: 15, km: 9, eur: 12 } }
      ]
    },
    {
      city: 'algarve', stay: 'algarve',
      title: '自驾南下 · 拉各斯',
      tip: '提自动挡 Nissan Qashqai 紧凑型 SUV，A2 高速路况极佳平稳南下；入住 Belmar 两卧海景平层，步行 5 分钟漫步沙滩看落日。',
      stops: [
        { t: '08:45', name: '退房出发', note: '前台 1 分钟快速退房，UberXL 10 分钟到机场租车中心', at: 'lisbon' },
        { t: '09:15', name: '机场提紧凑型 SUV', note: '提自动挡 Nissan Qashqai，装儿童座椅，激活 Via Verde，装入4箱+推车', query: 'Aeroporto de Lisboa (LIS)', leg: { mode: 'uber', min: 10, km: 6, eur: 10 } },
        { t: '10:00', name: 'A2 高速自驾南下', note: '中途服务区换尿布，高速巡航宝宝安稳午睡', leg: { mode: 'drive', min: 150, km: 250 } },
        { t: '13:30', name: '入住 Belmar 度假村', note: '地库电梯直通两卧海景平层，大冰箱放牛奶', at: 'algarve' },
        { t: '16:00', name: 'Porto de Mós 细沙海滩', note: '步行 5 分钟，踩沙踏浪看悬崖', query: 'Praia de Porto de Mós, Lagos', leg: { mode: 'walk', min: 5 } },
        { t: '18:00', name: '沙滩 Campimar 晚餐', note: '现捞烤大明虾配海景日落', query: 'Campimar Beach Restaurant, Lagos', leg: { mode: 'walk', min: 3 } }
      ]
    },
    {
      city: 'algarve', stay: 'algarve',
      title: '出海 · 室内泳池日',
      tip: '上午大型双体客船平稳出海寻访野生海豚（清晨风浪最小不颠簸）；下午 Belmar 室内 30℃ 恒温水疗池舒缓戏水，古城挑彩绘陶瓷。',
      stops: [
        { t: '09:30', name: 'Lagos Marina 海豚巡航 (早班)', note: '大型双体船超平稳，清晨海豚超活跃！', query: 'Marina de Lagos, Portugal', leg: { mode: 'drive', min: 6, km: 3.5 } },
        { t: '11:45', name: 'Marina 码头午餐', note: '清烤石斑鱼柳配水煮土豆 (Sem sal)' },
        { t: '13:00', name: '回房独立卧室关门午睡', note: '开车 6 分钟秒回 Belmar，关卧室门彻底深睡 2 小时', at: 'algarve', leg: { mode: 'drive', min: 6, km: 3.5 } },
        { t: '15:30', name: 'Belmar 室内恒温泳池', note: '儿童合规可用，水温 30℃ 尽情戏水', at: 'algarve' },
        { t: '18:00', name: '拉各斯古城海鲜晚餐', note: '老牌名店铜锅炖猪肉蛤蜊', leg: { mode: 'drive', min: 5, km: 2.5 } }
      ]
    },
    {
      city: 'algarve', stay: 'algarve',
      title: '悬崖木栈道 · 古城慢时光',
      tip: 'Ponta da Piedade 全新纯平无障碍悬崖木栈道看海；Chico Zé 现捞炭烤海鱼；下午古城慢品顶级手工 Gelato 与海边告别晚宴。',
      stops: [
        { t: '08:45', name: 'Ponta da Piedade 悬崖木栈道', note: '全平无障碍木板路，晨光顺光无暴晒', query: 'Ponta da Piedade, Lagos', leg: { mode: 'drive', min: 4, km: 2.2 } },
        { t: '11:30', name: 'Chico Zé 现捞炭烤海鲜', note: '11:30 开门第一批入座零等位，炭烤海鲷鱼极香', query: 'Restaurante Chico Zé, Lagos', leg: { mode: 'drive', min: 5, km: 3 } },
        { t: '13:00', name: '回房独立卧室关门午睡', note: '开车 5 分钟秒回 Belmar，宝宝深睡，大人洗衣服打包', at: 'algarve', leg: { mode: 'drive', min: 5, km: 2.5 } },
        { t: '15:30', name: '拉各斯古城老街漫步', note: '手工陶瓷店 + 网红 Crema di Gelato 冰淇淋', leg: { mode: 'drive', min: 5, km: 2.5 } },
        { t: '18:00', name: '古城滨水告别晚餐', note: '传统海鲜泡饭与炸鳕鱼饼' }
      ]
    },
    {
      city: 'algarve', stay: null,
      title: '返程 · 还车登机',
      tip: 'A2 高速一路北上直奔机场。航站楼内快速满油还车，推婴儿车享受 TAP 专属家庭快速安检通道，登机口 Gate Check。',
      stops: [
        { t: '08:30', name: '退房北上', note: 'A2 高速一路畅通回里斯本', at: 'algarve', leg: { mode: 'drive', min: 150, km: 250 } },
        { t: '11:45', name: '机场满油还车', note: 'LIS Terminal 1 租车中心 2 分钟扫码还车', query: 'Aeroporto de Lisboa (LIS)' },
        { t: '12:15', name: 'TAP 值机与家庭快速安检', note: '推车走 Family Fast Track 快速通道，登机口 Gate Check' }
      ]
    }
  ],

  /**
   * 「随身」页折叠卡片。酒店卡与点餐大字卡由 app.js 专门渲染。
   * 可选 copy：渲染一个“复制”按钮。
   */
  pocket: [
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
      icon: '🚗', title: '自驾要点', summary: '紧凑型 SUV · 座椅 · Via Verde · 保险',
      body: `<ul>
        <li><b>取还</b>：5/9 上午提车 → 5/12 上午还车，里斯本机场 T1 航站楼内柜台，整 72 小时。</li>
        <li><b>车型锁定</b>：<b>4 大 1 小选紧凑型自动挡 SUV</b>（如 Nissan Qashqai，504L 后备箱放 4 个 20 寸登机箱 + 折叠推车，Expedia 比价预订比官网更省）。坚决选油车（汽油 <b>Gasolina 95</b>）。</li>
        <li><b>座椅</b>：自驾<b>不享受</b>交规豁免，柜台加租幼儿座椅（约 €8~10/天），固定在后排 ISOFIX。</li>
        <li><b>保险</b>：提车全额刷 Chase 蓝宝石卡 (CSP/CSR) 并拒绝柜台 CDW，白嫖 Primary $0 自付车损险。</li>
        <li><b>收费站</b>：提车时开通 Via Verde 盒子（约 €1.5~2/天），走绿色 “V” 通道不减速。</li>
      </ul>`
    },
    {
      icon: '🎟', title: '门票预订与官方渠道', summary: '仅 2 项需抢 · 幼童免票 · 渠道防坑',
      body: `<ul>
        <li>🔴 <b>HippoTrip 两栖大巴 (D3 16:00)</b>：<b>提前 3~4 周在官网 booking.hippotrip.com 抢票</b>！锁定 4 成人 + 1 儿童票（差1个月满2岁直接买儿童票占座），现场几乎 100% 售罄。</li>
        <li>🔴 <b>海洋水族馆 (D5 10:00)</b>：<b>提前 3~7 天在官网 tickets.oceanario.pt 买票</b>。0~2 岁幼童<b>完全免费 (€0)</b>，但下单时<b>务必勾选 1 张 €0 Infant 票</b>生成扫码二维码，现场推车直接扫码秒进闸机免排队！</li>
        <li>🟡 <b>拉各斯海豚巡航 (D7 09:30)</b>：提前 2~3 天在 <b>GetYourGuide</b> 预订，必须认准 <b>Catamaran (大型平稳双体船)</b>，享 24 小时天气免费退改。</li>
        <li>🟢 <b>缆车与其他</b>：缆车站现场随到随买，蛋挞店/悬崖栈道/观景台/古城全部免门票。</li>
        <li>❌ <b>不买 Lisboa Card</b>：4 大 1 小出行打 UberXL / Bolt XL 舒服省钱，不含两栖车，买卡倒亏钱。</li>
      </ul>`
    },
    {
      icon: '🦛', title: 'HippoTrip 两栖大巴实战', summary: '买儿童票占座 · 背包垫高视线 · 零食打发',
      body: `<ul>
        <li><b>票务与检票</b>：宝宝还差 1 个月满 2 岁（23 个月），提前在官网买好 <b>Child Ticket</b>（约 €20 欧，占座）。检票口凭票直接进，外表能走能站绝不查护照。</li>
        <li><b>视线垫高技巧</b>：大巴舷壁较高，随身带小坐垫或<b>把随身小背包垫在宝宝屁股下（垫高约 10cm）</b>，视线跃过窗框，轻松看街景海景。</li>
        <li><b>陆地段 (前 40 分)</b>：并排坐各系腰带，大人紧搂着手，备米饼/果泥零食一路投喂，宝宝嘴巴忙着不闹人。</li>
        <li><b>水上段 (后 30 分)</b>：轰隆冲入特茹河激起巨浪是全家最高光时刻！入水后航行极平稳，顺手抱在腿上搂着看 425 大桥，导游完全宽松不干涉。</li>
        <li><b>洗手间提醒</b>：90 分钟全程无厕所，登车前在 Doca 码头游客中心换好尿布。</li>
      </ul>`
    },
    {
      icon: '🐬', title: '海豚巡航选船', summary: '选 Catamaran，别选快艇',
      body: `<p>Lagos 位于大西洋暖流交汇处，5 月野生海豚看到率 95%+。</p>
        <p>⚠️ <b>严禁选 RIB 充气快艇</b>：海浪颠簸，不适合 2 岁幼童。</p>
        <p>✅ <b>务必选 Catamaran</b>（平稳大型双体船/客船）：甲板平稳，带洗手间与遮阳舱。</p>`
    },
    {
      icon: '📝', title: 'Belmar 订房备忘', summary: '房型怎么选 · 英文备注直接复制',
      body: `<ul>
        <li>🥇 <b>2 Bedroom Apartment - Sea View</b>（约 €756/3 晚）：单层平层，电梯平进平出，无内部楼梯，幼童最安全。</li>
        <li>🥈 Standard 2 Bedroom with Roof Terrace（约 €783）：复式楼梯，需申请 Stair gate。</li>
        <li>🥉 Standard 2 Bedroom（约 €630）：地面层，推车零台阶。</li>
        <li>❌ <b>别订 Budget 2 Bedroom</b>：是半地下室，暗且返潮。</li>
        <li>🍽 选<b>纯房 (Accommodation only)</b>，别选 Half Board。</li>
        <li>先用 Free cancellation 订下占位；黑五若降价就新订再退旧单。</li>
      </ul>`,
      copy: 'We are traveling with 4 adults and 1 infant under 2 years old. Please arrange a single-level apartment (strictly NO duplex/internal stairs if Sea View/Standard booked), preferably ground floor or with elevator access. If a roof terrace apartment is assigned, please provide a stair safety gate for the infant. We also request 1 baby cot/crib. Thank you!',
      copyLabel: '复制英文备注'
    },
    {
      icon: '🥖', title: '餐前小食 Couvert', summary: '没点的面包橄榄，不吃就不收钱',
      body: `<p>桌上不请自来的面包、黄油、橄榄、鱼酱<b>不是免费送的</b>：动了就计费（整套约 €6~12）。</p>
        <p>不想要，服务员放下时笑着说 <b>“Não, obrigado”</b>，他会端走，不记账。</p>
        <p>葡萄牙<b>没有强制小费</b>：菜单价已含税与服务，刷卡按原价；服务特别好留 €2~5 零钱就很大方。</p>`
    },
    {
      icon: '🚼', title: 'Uber / Bolt 打车与抱娃', summary: '双 App 比价 · 选 XL · 后排抱娃合法',
      body: `<p><b>双 App 比价</b>：里斯本本地 <b>Bolt</b> 普及率极高，价格通常比 Uber 便宜 15%~25%，且接单极快；建议两款 App 都备好，叫车前比一眼价。</p>
        <p><b>车型选 XL</b>：4 大 1 小出行选 <b>UberXL</b> 或 <b>Bolt XL</b>（6~7 座商务大车），单程约 €8~€14 欧，后备箱放折叠推车轻轻松松。</p>
        <p><b>抱娃合法免座椅</b>：葡萄牙《道路交通法》第 55 条第 5 款：出租车与网约车 (Uber/Bolt) 豁免儿童座椅，<b>2 岁以下幼童坐后排、大人抱着</b>合法（严禁坐副驾）。大人先系好自身安全带，再抱宝宝或放进背带。<b>自驾租车不豁免</b>。</p>`
    },
    {
      icon: '🍼', title: '超市买奶', summary: 'Mimosa 200ml 带吸管全脂奶',
      body: `<p>✅ 认准 <b>Mimosa Leite UHT Gordo 200ml</b>（全脂常温奶，自带弯头吸管）或 <b>Mimosa Crescer</b>（幼儿成长款），6 盒约 €1.5。</p>
        <p>✅ 认准 <i>Leite Branco / Gordo</i>。</p>
        <p>❌ 避开 <b>com Chocolate</b>（巧克力）、<b>com Morango / Banana</b>（调味奶）。</p>`
    },
    {
      icon: '💶', title: '刷卡与 ATM', summary: '几乎都能刷卡 · 别用 Euronet',
      body: `<p>99% 场景支持 Apple Pay / 免境外手续费的信用卡，随身现金备 €100~150 零钱就够。</p>
        <p>⚠️ 街头黄蓝色 <b>Euronet</b> ATM 汇率极差，<b>不要插卡</b>。认准银行门口 <b>Multibanco (MB)</b>。</p>
        <p>弹出汇率转换提示时，一律选 <b>Continue in EUR（不转换）</b>，省 8%~10%。</p>`
    }
  ]
};
