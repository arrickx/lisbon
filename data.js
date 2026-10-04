/**
 * 唯一内容来源 (single source of truth)。
 * 内容整理自 TRIP_PROFILE.md；车程分钟/价格均为【估算】，出发前请用 Google Maps 逐段核对。
 * 约定：
 *  - stop.t  建议时间 "HH:MM"（用于判断“现在/下一站”，同时决定显示的时段）
 *  - stop.leg 从上一站到本站的交通段 {mode:'uber'|'walk'|'drive', min, km?, eur?}
 *  - stop.at 指向 stays 里的住处（回酒店/入住/退房），导航与叫车使用住处信息
 *  - 没有 lat/lng 也没有 at 的 stop 不显示导航按钮
 */
window.TRIP = {
  start: '2027-05-04',
  tz: 'Europe/Lisbon',
  nights: 8,
  party: '4 大 1 小',

  stays: {
    lisbon: {
      name: 'Upon Lisbon Prime Residences (4大1小) / Hyatt Regency (2大1小)',
      short: '里斯本 · Upon / Hyatt',
      address: 'Rua Laura Alves 10, 1500-111 Lisboa',
      query: 'Upon Lisbon Prime Residences, Lisboa, Portugal',
      verified: true,
      nights: 5
    },
    algarve: {
      name: 'Belmar Spa & Beach Resort',
      short: '拉各斯 · Belmar 海景度假公寓',
      address: 'Praia de Porto de Mós, 8600-513 Lagos, Portugal',
      query: 'Belmar Spa & Beach Resort, Lagos, Portugal',
      verified: true,
      nights: 3
    }
  },

  days: [
    {
      n: 1, date: '2027-05-04', city: 'lisbon', stay: 'lisbon',
      title: '抵达 · 倒时差',
      tip: '第一天不排景点，专心倒时差。2 岁以下幼童坐 Uber / 出租车可抱坐后排（葡萄牙交规豁免），大人先系好安全带。',
      stops: [
        { t: '14:00', name: '抵达里斯本机场 (LIS)', note: '取行李，叫 UberXL（6~7 座）', lat: 38.7742, lng: -9.1342 },
        { t: '15:00', name: '入住 Hyatt Regency', note: '放行李，宝宝喝奶小憩', at: 'lisbon', leg: { mode: 'uber', min: 20, km: 12, eur: 20 } },
        { t: '17:30', name: '河畔步道散步', note: '特茹河岸平坦，推车顺畅，看日落', lat: 38.6949, lng: -9.2090, leg: { mode: 'walk', min: 8 } },
        { t: '19:00', name: '河畔晚餐', note: '蔬菜浓汤 + 海鲜泡饭，早点休息' }
      ]
    },
    {
      n: 2, date: '2027-05-05', city: 'lisbon', stay: 'lisbon',
      title: '贝伦文化日',
      tip: '蛋挞店门口外带队伍很长，直接走进里面大厅找座位堂食。',
      stops: [
        { t: '09:30', name: 'Pastéis de Belém 蛋挞老店', note: '堂食，外皮酥脆、奶馅温热', lat: 38.6975, lng: -9.2032, leg: { mode: 'uber', min: 7, km: 2, eur: 7 } },
        { t: '10:30', name: '热罗尼莫斯修道院', note: '推车可入前广场与回廊', lat: 38.6979, lng: -9.2068, leg: { mode: 'walk', min: 5 } },
        { t: '12:30', name: '发现者纪念碑 · 贝伦塔', note: '草坪宽阔平坦，买冰淇淋看帆船', lat: 38.6937, lng: -9.2056, leg: { mode: 'walk', min: 10 } },
        { t: '14:30', name: '回酒店午休', note: '避开正午强紫外线', at: 'lisbon', leg: { mode: 'uber', min: 8, km: 2, eur: 7 } },
        { t: '17:30', name: 'LX Factory 创意园', note: '飞天书店 Ler Devagar，露天吃烤章鱼', lat: 38.7030, lng: -9.1786, leg: { mode: 'uber', min: 10, km: 3, eur: 8 } }
      ]
    },
    {
      n: 3, date: '2027-05-06', city: 'lisbon', stay: 'lisbon',
      title: '老城 + 水陆两栖车',
      tip: 'HippoTrip 建议提前在官网订好家庭票。',
      stops: [
        { t: '10:00', name: '商业广场 · Baixa', note: '凯旋门与棋盘格步行街', lat: 38.7075, lng: -9.1364, leg: { mode: 'uber', min: 12, km: 6, eur: 10 } },
        { t: '11:00', name: '圣胡斯塔电梯', note: '街角咖啡馆吃葡式鳕鱼球', lat: 38.7120, lng: -9.1394, leg: { mode: 'walk', min: 8 } },
        { t: '13:00', name: '回酒店午休', note: '睡午觉，养精蓄锐', at: 'lisbon', leg: { mode: 'uber', min: 12, km: 6, eur: 10 } },
        { t: '17:00', name: 'HippoTrip 水陆两栖车', note: '陆上游老城，然后开进特茹河，小朋友最爱', lat: 38.7062, lng: -9.1350, hl: true, leg: { mode: 'uber', min: 12, km: 6, eur: 10 } },
        { t: '19:00', name: '回酒店', note: '', at: 'lisbon', leg: { mode: 'uber', min: 12, km: 6, eur: 10 } }
      ]
    },
    {
      n: 4, date: '2027-05-07', city: 'lisbon', stay: 'lisbon',
      title: '观景 · 由高向低',
      tip: '老城多是石子坡路，推车吃力，建议用背带；让车直接开到最高点，再往下走。',
      stops: [
        { t: '10:00', name: 'Senhora do Monte 观景台', note: '里斯本最高观景点，俯瞰红屋顶与特茹河', lat: 38.7196, lng: -9.1328, leg: { mode: 'uber', min: 18, km: 8, eur: 12 } },
        { t: '11:30', name: '里斯本主教堂 (Sé)', note: '罗曼式主教堂，门口有 28 路电车经过', lat: 38.7099, lng: -9.1330, leg: { mode: 'uber', min: 8, km: 2, eur: 6 } },
        { t: '13:30', name: '回酒店午餐 / 休息', note: '', at: 'lisbon', leg: { mode: 'uber', min: 15, km: 7, eur: 11 } }
      ]
    },
    {
      n: 5, date: '2027-05-08', city: 'lisbon', stay: 'lisbon',
      title: '亲子日 · 水族馆',
      tip: '世博区全是平地，推车轻松；水族馆里冷气足，带件薄外套。',
      stops: [
        { t: '10:00', name: '里斯本海洋水族馆 Oceanário', note: '欧洲最大水族馆之一，巨型中央水缸', lat: 38.7634, lng: -9.0937, hl: true, leg: { mode: 'uber', min: 22, km: 14, eur: 18 } },
        { t: '13:00', name: '滨海景观缆车', note: '空中看达伽马大桥与河口', lat: 38.7620, lng: -9.0945, leg: { mode: 'walk', min: 5 } },
        { t: '14:30', name: 'Vasco da Gama 商场', note: 'Continente 超市买纯牛奶、水果（明天自驾用）', lat: 38.7681, lng: -9.0963, leg: { mode: 'walk', min: 8 } },
        { t: '16:00', name: '回酒店', note: '', at: 'lisbon', leg: { mode: 'uber', min: 22, km: 14, eur: 18 } }
      ]
    },
    {
      n: 6, date: '2027-05-09', city: 'algarve', stay: 'algarve',
      title: '自驾南下',
      tip: '收费站走绿色 V 通道 (Via Verde)，租车公司事后结算。柜台加租幼儿座椅，租车自驾不享受座椅豁免。',
      stops: [
        { t: '09:30', name: '酒店退房', note: '睡到自然醒，吃好早餐', at: 'lisbon' },
        { t: '10:30', name: '机场提 7 座 MPV', note: '全险 + 幼儿座椅 + Via Verde', lat: 38.7742, lng: -9.1342, leg: { mode: 'uber', min: 20, km: 12, eur: 20 } },
        { t: '14:30', name: '入住阿尔加维住处', note: '沿 A2 高速南下，中途服务区休息、吃午饭、换尿布', at: 'algarve', leg: { mode: 'drive', min: 170, km: 250 } },
        { t: '18:30', name: '铜锅海鲜炖 Cataplana', note: '大虾、青口、海鲈鱼，汤汁拌饭', leg: { mode: 'drive', min: 10 } }
      ]
    },
    {
      n: 7, date: '2027-05-10', city: 'algarve', stay: 'algarve',
      title: '野生海豚 / 洞窟出海',
      tip: '带娃务必选双体大船 (Catamaran) 更加平稳，不选颠簸的小快艇 (RIB)；码头就在拉各斯游艇港。',
      stops: [
        { t: '09:30', name: 'Marina de Lagos 出海', note: '乘平稳双体船探秘野生海豚巡航 / Benagil 洞窟', lat: 37.1086, lng: -8.6744, hl: true, leg: { mode: 'drive', min: 8, km: 3 } },
        { t: '13:30', name: '回住处 · 沙滩泳池', note: 'Porto de Mós 挖沙踏浪，酒店泳池戏水', at: 'algarve', leg: { mode: 'drive', min: 8, km: 3 } },
        { t: '18:30', name: '阳台晚餐 · 看日落', note: '吹海风，来杯 Vinho Verde' }
      ]
    },
    {
      n: 8, date: '2027-05-11', city: 'algarve', stay: 'algarve',
      title: '佩达德角 · 拉各斯',
      tip: '木栈道宽阔平整，推车友好；海边风大，带防风帽。',
      stops: [
        { t: '09:30', name: 'Ponta da Piedade 佩达德角', note: '平整木栈道漫步，金黄悬崖与翡翠海水', lat: 37.0833, lng: -8.6694, hl: true, leg: { mode: 'drive', min: 15, km: 12 } },
        { t: '12:30', name: '拉各斯古城', note: '鹅卵石老街，手工冰淇淋', lat: 37.1028, lng: -8.6742, leg: { mode: 'drive', min: 8, km: 3 } },
        { t: '18:30', name: '告别海鲜晚宴', note: '烤多宝鱼、蒜蓉蛤蜊、鮟鱇鱼泡饭', leg: { mode: 'drive', min: 10 } }
      ]
    },
    {
      n: 9, date: '2027-05-12', city: 'algarve', stay: null,
      title: '返程 · 还车登机',
      tip: '国际航班建议起飞前 3 小时到机场；加满油再还车。出发时间请按实际航班倒推。',
      stops: [
        { t: '08:30', name: '海景早餐 · 退房', note: '检查护照与随身物品', at: 'algarve' },
        { t: '09:30', name: '沿 A2 北上回里斯本', note: '中途服务区休息一次', leg: { mode: 'drive', min: 180, km: 250 } },
        { t: '12:30', name: '机场还车 · 值机', note: '满油还车，推行李去出发层', lat: 38.7742, lng: -9.1342, leg: { mode: 'drive', min: 10 } }
      ]
    }
  ],

  /* 「随身」页折叠卡片（酒店卡与点餐大字卡由 app.js 专门渲染） */
  pocket: [
    {
      icon: '🚗', title: '自驾要点', summary: 'Via Verde · 儿童座椅 · 加油',
      body: `<ul>
        <li><b>收费站</b>：走绿色 “V” 通道 (Via Verde)，自动感应，租车公司事后结算。</li>
        <li><b>儿童座椅</b>：租车自驾<b>不享受</b>座椅豁免，柜台加租幼儿座椅（约 €8~10/天）。</li>
        <li><b>加油</b>：柴油 <b>Gasóleo</b>，汽油 <b>Gasolina 95</b>，别加错。</li>
      </ul>`
    },
    {
      icon: '🥖', title: '餐前小食 Couvert', summary: '没点的面包橄榄不吃就不收钱',
      body: `<p>桌上不请自来的面包、黄油、橄榄、金枪鱼酱<b>不是免费送的</b>：动了就计费（整套约 €6~12）。</p>
        <p>不想要，服务员放下时笑着说 <b>“Não, obrigado”</b> 让他端走，不会记账。葡萄牙法律（Decreto-Lei 10/2015）规定未经点单且未消费的小菜不得收费。</p>
        <p>葡萄牙<b>没有强制小费</b>，菜单价已含税与服务，刷卡原价即可，服务特别好留 €2~5 零钱就够了。</p>`
    },
    {
      icon: '🚼', title: 'Uber 抱幼童合法', summary: '后排即可，免安全座椅',
      body: `<p>葡萄牙《道路交通法》第 55 条第 5 款：出租车与网约车 (Uber / Bolt) 豁免儿童座椅，<b>2 岁以下幼童坐后排、大人抱着</b>合法。</p>
        <p>大人先系好自己的安全带，再把宝宝抱在怀里或放进背带；<b>严禁一根安全带同时绑大人和孩子</b>。</p>
        <p>个别司机可能取消订单，重叫一辆即可。<b>自驾租车不豁免</b>。</p>`
    },
    {
      icon: '🍼', title: '超市买奶', summary: 'Mimosa 200ml 带吸管全脂奶',
      body: `<p>✅ 认准 <b>Mimosa Leite UHT Gordo 200ml</b>（全脂常温奶，带吸管）或 <b>Mimosa Crescer</b>（儿童款）。</p>
        <p>✅ 酒店用：<b>Leite Fresco Gordo</b> 1 升冷藏鲜奶，约 €1。</p>
        <p>❌ 避开 <b>com Chocolate</b>（巧克力）、<b>com Morango / Banana</b>（调味奶）。</p>`
    },
    {
      icon: '💶', title: '刷卡与 ATM', summary: '几乎都能刷卡 · 别用 Euronet',
      body: `<p>餐厅、Uber、超市、门票、高速几乎都能刷 Apple Pay / 免外币手续费的信用卡，随身现金备 €100~150 就够。</p>
        <p>⚠️ 景区街头黄蓝色 <b>Euronet</b> ATM 汇率黑，<b>不要插卡</b>。认准 <b>Multibanco (MB)</b> 标志的银行 ATM。</p>
        <p>屏幕问是否转换成美元时，一律选 <b>Continue in EUR（不转换）</b>。</p>`
    },
    {
      icon: '📶', title: '手机网络', summary: '用 eSIM，别开漫游',
      body: `<p>10~20GB 的欧洲 eSIM（Airalo / Nomad / Saily）约 $10~15，出发前装好，落地自动激活，主号继续收验证码。</p>
        <p>美国运营商每日漫游约 $10~12/人，4 个大人 8 天很贵，建议关掉。</p>`
    }
  ]
};
