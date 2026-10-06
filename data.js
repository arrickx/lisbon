/**
 * 唯一内容来源 (single source of truth)。内容整理自 TRIP_PROFILE.md。
 * 车程分钟 / 价格均为【估算】，出发前请用 Google Maps 逐段核对（住处最终选定后会变）。
 *
 * 约定：
 *  - stop.t     建议时间 "HH:MM"，用于判断“现在 / 下一站”并决定显示的时段
 *  - stop.leg   从上一站到本站的交通段 {mode:'uber'|'walk'|'drive', min, km?, eur?}
 *  - stop.at    指向 stays 里的住处（入住/退房/回住处），导航与叫车使用住处信息
 *  - stop.query 没有精确坐标时，用文字让 Google / Uber 自己解析
 *  - 没有 lat/lng、query、at 的 stop 不显示导航按钮
 */
window.TRIP = {
  start: '2027-05-04',
  tz: 'Europe/Lisbon',
  nights: 8,
  party: '2 大 1 小 (主选) · 备选 4 大 1 小',
  cities: { lisbon: '里斯本', algarve: '阿尔加维 · 拉各斯' },

  stays: {
    lisbon: {
      name: 'Hyatt Regency Lisbon',
      short: '里斯本 · Hyatt Regency',
      query: 'Hyatt Regency Lisbon, Lisboa, Portugal',
      address: null,
      status: '主选 · 2 大 1 小 (Cat 4 积分/现金 1 间房) · 5 晚',
      nights: 5
    },
    lisbonAlt: {
      name: 'Upon Lisbon Prime Residences',
      short: '里斯本 · Upon 两卧公寓',
      query: 'Upon Lisbon Prime Residences, Lisboa, Portugal',
      address: null,
      status: '备用 · 4 大 1 小 (100㎡ 两卧大公寓)'
    },
    algarve: {
      name: 'Belmar Spa & Beach Resort',
      short: '拉各斯 · Belmar 度假村',
      query: 'Belmar Spa & Beach Resort, Lagos, Portugal',
      address: null,
      status: '首选 2 Bedroom Apartment - Sea View（平层）· 3 晚',
      nights: 3
    }
  },

  days: [
    {
      n: 1, date: '2027-05-04', city: 'lisbon', stay: 'lisbon',
      title: '抵达 · 倒时差',
      tip: '第一天不排景点，专心倒时差。2 岁以下幼童坐 Uber / 出租车可抱坐后排（葡萄牙交规豁免），大人先系好安全带。',
      stops: [
        { t: '14:00', name: '抵达里斯本机场 (LIS)', note: '取行李，叫 UberX 直达 Hyatt Regency 大堂', lat: 38.7742, lng: -9.1342 },
        { t: '15:00', name: '入住 Hyatt Regency', note: '放行李，宝宝喝奶小憩', at: 'lisbon', leg: { mode: 'uber', min: 18, km: 10, eur: 12 } },
        { t: '17:30', name: '特茹河畔平坦步道散步', note: '推车顺畅，倒时差，河边看日落' },
        { t: '19:00', name: '附近晚餐', note: '蔬菜浓汤 + 米饭，早点休息' }
      ]
    },
    {
      n: 2, date: '2027-05-05', city: 'lisbon', stay: 'lisbon',
      title: '贝伦文化日',
      tip: '蛋挞老店大厅宽敞、有高脚椅，直接进大厅找座堂食。修道院（12 岁以下免费）务必提前官网买分时段电子票，扫码走预约通道。',
      stops: [
        { t: '09:30', name: 'Pastéis de Belém 蛋挞老店', note: '堂食，外皮酥脆、奶馅温热', lat: 38.6975, lng: -9.2032, leg: { mode: 'uber', min: 7, km: 3, eur: 7 } },
        { t: '10:30', name: '热罗尼莫斯修道院', note: '提前订分时段票，推车可入前广场', lat: 38.6979, lng: -9.2068, leg: { mode: 'walk', min: 5 } },
        { t: '12:30', name: '发现者纪念碑 · 贝伦塔', note: '草坪宽阔平坦，买冰淇淋看帆船', lat: 38.6937, lng: -9.2056, leg: { mode: 'walk', min: 10 } },
        { t: '14:30', name: 'LX Factory 创意园', note: '适合推车闲逛；飞天书店 Ler Devagar，露天吃烤章鱼', lat: 38.7030, lng: -9.1786, leg: { mode: 'uber', min: 8, km: 3, eur: 7 } },
        { t: '17:00', name: '回住处休息', note: '', at: 'lisbon', leg: { mode: 'uber', min: 8, km: 3, eur: 7 } }
      ]
    },
    {
      n: 3, date: '2027-05-06', city: 'lisbon', stay: 'lisbon',
      title: '老城 + 水陆两栖车',
      tip: '圣胡斯塔电梯别排队：从 Chiado 的卡尔莫修道院 (Convento do Carmo) 右侧平路走过去，直接免费上电梯顶部天桥。HippoTrip 建议提前官网订。',
      stops: [
        { t: '10:00', name: '商业广场 · Baixa', note: '沿河纯平地，凯旋门与棋盘格步行街', lat: 38.7075, lng: -9.1364, leg: { mode: 'uber', min: 12, km: 6, eur: 10 } },
        { t: '11:00', name: '圣胡斯塔天桥（免费后门）', note: '经 Carmo 修道院右侧平路上去，省排队与门票', lat: 38.7120, lng: -9.1394, leg: { mode: 'walk', min: 10 } },
        { t: '12:30', name: 'Chiado 午餐 · 咖啡馆休息', note: '葡式鳕鱼球，让宝宝睡一觉' },
        { t: '17:00', name: 'HippoTrip 水陆两栖车', note: '陆上游老城，然后开进特茹河，小朋友最爱', query: 'HippoTrip Lisboa', hl: true, leg: { mode: 'walk', min: 10 } },
        { t: '19:00', name: '回住处', note: '', at: 'lisbon', leg: { mode: 'uber', min: 12, km: 6, eur: 10 } }
      ]
    },
    {
      n: 4, date: '2027-05-07', city: 'lisbon', stay: 'lisbon',
      title: '观景 · 顺坡而下',
      tip: '打车直达山顶，全段顺坡向下，不费腿。里斯本主教堂 6 岁以下免费。',
      stops: [
        { t: '10:00', name: 'Senhora do Monte 观景台', note: '里斯本最高观景点，俯瞰红屋顶与特茹河全景', lat: 38.7196, lng: -9.1328, leg: { mode: 'uber', min: 14, km: 7, eur: 11 } },
        { t: '11:30', name: '里斯本主教堂 (Sé)', note: '顺坡漫步下来，门口常有 28 路电车经过', lat: 38.7099, lng: -9.1330, leg: { mode: 'walk', min: 25 } },
        { t: '13:30', name: '回住处午休', note: '平地叫车回去', at: 'lisbon', leg: { mode: 'uber', min: 14, km: 7, eur: 11 } }
      ]
    },
    {
      n: 5, date: '2027-05-08', city: 'lisbon', stay: 'lisbon',
      title: '亲子日 · 水族馆',
      tip: '水族馆 3 岁以下免费，同样提前官网买分时段票；馆内全无障碍坡道，冷气足，带件薄外套。',
      stops: [
        { t: '10:00', name: '里斯本海洋水族馆 Oceanário', note: '欧洲最大水族馆之一，巨型中央水缸', lat: 38.7634, lng: -9.0937, hl: true, leg: { mode: 'uber', min: 22, km: 14, eur: 18 } },
        { t: '13:00', name: '滨海景观缆车', note: '空中看达伽马大桥与河口', query: 'Telecabine Lisboa Parque das Nações', leg: { mode: 'walk', min: 5 } },
        { t: '14:30', name: 'Vasco da Gama 商场', note: 'Continente 超市买纯牛奶、水果（明天自驾用）', query: 'Centro Vasco da Gama, Lisboa', leg: { mode: 'walk', min: 8 } },
        { t: '16:00', name: '回住处', note: '', at: 'lisbon', leg: { mode: 'uber', min: 22, km: 14, eur: 18 } }
      ]
    },
    {
      n: 6, date: '2027-05-09', city: 'algarve', stay: 'algarve',
      title: '自驾南下 · 拉各斯',
      tip: '坚决选油车。2大1小首选三厢轿车 (Sedan)，封闭后备箱防盗安全性完胜 SUV，轻松放下 2 个 20 寸箱 + 婴儿车。柜台加租幼儿座椅。过收费站走绿色 V 通道。',
      stops: [
        { t: '09:30', name: '退房', note: '睡到自然醒，吃好早餐', at: 'lisbon' },
        { t: '10:30', name: '机场提紧凑型轿车', note: '自动挡轿车 · Via Verde 盒子 · 幼儿座椅 · 刷 Chase 蓝宝石并拒绝柜台 CDW', lat: 38.7742, lng: -9.1342, leg: { mode: 'uber', min: 18, km: 10, eur: 12 } },
        { t: '14:00', name: '入住 Belmar 度假村', note: 'A2 高速全封闭，中途大型服务区换尿布、喝咖啡', at: 'algarve', leg: { mode: 'drive', min: 150, km: 250 } },
        { t: '16:30', name: '超市采购', note: '纯房模式，买早餐与零食', query: 'Supermercado Lagos Portugal', leg: { mode: 'drive', min: 10 } },
        { t: '18:30', name: '沙滩 Cafe 晚餐', note: '步行 5 分钟，铜锅海鲜或简单晚餐', leg: { mode: 'walk', min: 5 } }
      ]
    },
    {
      n: 7, date: '2027-05-10', city: 'algarve', stay: 'algarve',
      title: '出海 · 沙滩日',
      tip: '海豚巡航务必选 Catamaran（平稳大型双体船，带洗手间与遮阳舱），严禁选 RIB 快艇——颠簸，不适合 2 岁幼童。',
      stops: [
        { t: '09:30', name: 'Lagos Marina 海豚巡航', note: '平稳双体船，5 月野生海豚看到率很高；备选 Benagil 洞穴', query: 'Marina de Lagos, Portugal', hl: true, leg: { mode: 'drive', min: 17, km: 10 } },
        { t: '13:00', name: 'Meia Praia 沙滩', note: '大型停车场，挖沙踏浪', query: 'Meia Praia, Lagos, Portugal', leg: { mode: 'drive', min: 5, km: 3 } },
        { t: '16:00', name: '回度假村泳池', note: '', at: 'algarve', leg: { mode: 'drive', min: 13, km: 8 } }
      ]
    },
    {
      n: 8, date: '2027-05-11', city: 'algarve', stay: 'algarve',
      title: '悬崖木栈道 · 古城海鲜',
      tip: '悬崖木栈道全新、全平、无台阶，推车友好；海边风大，带防风帽。',
      stops: [
        { t: '09:30', name: 'Ponta da Piedade 悬崖木栈道', note: '金黄悬崖与翡翠海水，推车一路到底', lat: 37.0833, lng: -8.6694, hl: true, leg: { mode: 'drive', min: 12, km: 7 } },
        { t: '12:30', name: '拉各斯古城 · 现捞海鲜', note: '鹅卵石老街，开车仅 5 分钟', lat: 37.1028, lng: -8.6742, leg: { mode: 'drive', min: 5, km: 2 } },
        { t: '15:30', name: '回度假村休息', note: '泳池 / 阳台日落', at: 'algarve', leg: { mode: 'drive', min: 13, km: 8 } }
      ]
    },
    {
      n: 9, date: '2027-05-12', city: 'algarve', stay: null,
      title: '返程 · 还车登机',
      tip: '沿 A2 北上直达机场租车中心。加满油再还车；起飞时间请按实际航班倒推。',
      stops: [
        { t: '08:30', name: '海景早餐 · 退房', note: '检查护照与随身物品', at: 'algarve' },
        { t: '09:30', name: '沿 A2 北上回里斯本', note: '中途服务区休息一次', leg: { mode: 'drive', min: 150, km: 250 } },
        { t: '12:30', name: '机场还车 · 值机', note: '满油还车，推行李去出发层', lat: 38.7742, lng: -9.1342, leg: { mode: 'drive', min: 10 } }
      ]
    }
  ],

  /**
   * 「随身」页折叠卡片。酒店卡与点餐大字卡由 app.js 专门渲染。
   * 可选 copy：渲染一个“复制”按钮。
   */
  pocket: [
    {
      icon: '🚗', title: '自驾要点', summary: '油车 · 座椅 · Via Verde · 保险',
      body: `<ul>
        <li><b>取还</b>：5/9 上午提车 → 5/12 上午还车，里斯本机场航站楼，整 72 小时。</li>
        <li><b>坚决选油车</b>（汽油 <b>Gasolina 95</b> / 柴油 <b>Gasóleo</b>，别加错）。<b>2 大 1 小首选三厢轿车 Sedan</b>（自动挡好开、封闭后备箱防盗）；4 大 1 小备用才选 SUV/MPV。</li>
        <li><b>行李</b>：全员 20 寸登机箱，严禁 28 寸。推车折叠平放，后备箱私密防盗。</li>
        <li><b>座椅</b>：自驾<b>不享受</b>豁免，柜台加租幼儿座椅（约 €8~10/天），固定在后排 ISOFIX。</li>
        <li><b>保险</b>：用 Chase 蓝宝石 (CSP/CSR) 全额付租金并拒绝柜台 CDW，可省 €80~100。</li>
        <li><b>收费站</b>：提车时开通 Via Verde 盒子（约 €1.5~2/天），走绿色 “V” 通道不减速。</li>
      </ul>`
    },
    {
      icon: '🎟', title: '门票省钱与免排队', summary: '不买 City Pass · 幼童免票 · 提前订时段',
      body: `<ul>
        <li>❌ <b>不买 Lisboa Card</b>：2 大 1 小打 UberX 极便宜灵活，水族馆不免票、HippoTrip 不含，买卡倒亏钱。</li>
        <li>👶 <b>幼童免票</b>：热罗尼莫斯修道院（12 岁以下）、海洋水族馆（3 岁以下）、里斯本主教堂（6 岁以下）。</li>
        <li>⏰ <b>修道院与水族馆</b>务必提前官网买分时段电子票，现场扫码走预约通道。</li>
        <li>🆓 <b>圣胡斯塔天桥</b>：从 Chiado 的 Convento do Carmo 右侧平路走过去，免费走上电梯顶部天桥，省 €6/人。</li>
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
      icon: '🚼', title: 'Uber 抱幼童合法', summary: '后排即可，免安全座椅',
      body: `<p>葡萄牙《道路交通法》第 55 条第 5 款：出租车与网约车 (Uber / Bolt) 豁免儿童座椅，<b>2 岁以下幼童坐后排、大人抱着</b>合法（严禁坐副驾）。</p>
        <p>大人先系好自己的安全带，再把宝宝抱在怀里或放进背带；<b>严禁一根安全带同时绑大人和孩子</b>。</p>
        <p>个别司机可能取消订单，重叫一辆即可。<b>自驾租车不豁免</b>。</p>`
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
