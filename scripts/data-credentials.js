// 下证样本数据源(由 scripts/build_credentials_assets.py 的输出生成)
const GROUPS = {
  "asia": "亚洲",
  "offshore": "离岸",
  "west": "欧美",
  "license": "行业资质",
  "ep": "准证/签证"
};

const ITEMS = [
  {
    "slug": "hk-1",
    "country": "香港",
    "type": "公司注册证书",
    "year": "2026",
    "group": "asia",
    "w": 255,
    "h": 360,
    "alt": "香港公司注册证书样本(已脱敏)"
  },
  {
    "slug": "hk-2",
    "country": "香港",
    "type": "公司注册证书",
    "year": "2026",
    "group": "asia",
    "w": 254,
    "h": 360,
    "alt": "香港公司注册证书样本(已脱敏)"
  },
  {
    "slug": "sg-1",
    "country": "新加坡",
    "type": "ACRA 公司注册证书",
    "year": "2026",
    "group": "asia",
    "w": 255,
    "h": 360,
    "alt": "新加坡ACRA 公司注册证书样本(已脱敏)"
  },
  {
    "slug": "sg-2",
    "country": "新加坡",
    "type": "ACRA 公司注册证书",
    "year": "2026",
    "group": "asia",
    "w": 254,
    "h": 360,
    "alt": "新加坡ACRA 公司注册证书样本(已脱敏)"
  },
  {
    "slug": "jp-1",
    "country": "日本",
    "type": "履历事项全部证明书",
    "year": "2026",
    "group": "asia",
    "w": 253,
    "h": 360,
    "alt": "日本履历事项全部证明书样本(已脱敏)"
  },
  {
    "slug": "kr-1",
    "country": "韩国",
    "type": "事业者登录证",
    "year": "2026",
    "group": "asia",
    "w": 255,
    "h": 360,
    "alt": "韩国事业者登录证样本(已脱敏)"
  },
  {
    "slug": "my-1",
    "country": "马来西亚",
    "type": "SSM 公司注册",
    "year": "2026",
    "group": "asia",
    "w": 256,
    "h": 360,
    "alt": "马来西亚SSM 公司注册样本(已脱敏)"
  },
  {
    "slug": "my-2",
    "country": "马来西亚",
    "type": "SSM 公司注册",
    "year": "2026",
    "group": "asia",
    "w": 255,
    "h": 360,
    "alt": "马来西亚SSM 公司注册样本(已脱敏)"
  },
  {
    "slug": "th-1",
    "country": "泰国",
    "type": "公司注册证明",
    "year": "2026",
    "group": "asia",
    "w": 255,
    "h": 360,
    "alt": "泰国公司注册证明样本(已脱敏)"
  },
  {
    "slug": "th-2",
    "country": "泰国",
    "type": "公司注册证明",
    "year": "2026",
    "group": "asia",
    "w": 255,
    "h": 360,
    "alt": "泰国公司注册证明样本(已脱敏)"
  },
  {
    "slug": "id-1",
    "country": "印度尼西亚",
    "type": "公司注册证明",
    "year": "2026",
    "group": "asia",
    "w": 255,
    "h": 360,
    "alt": "印度尼西亚公司注册证明样本(已脱敏)"
  },
  {
    "slug": "id-2",
    "country": "印度尼西亚",
    "type": "公司注册证明",
    "year": "2026",
    "group": "asia",
    "w": 255,
    "h": 360,
    "alt": "印度尼西亚公司注册证明样本(已脱敏)"
  },
  {
    "slug": "ep-1",
    "country": "新加坡",
    "type": "EP 原则批准信(IPA)",
    "year": "2026",
    "group": "ep",
    "w": 255,
    "h": 360,
    "alt": "新加坡EP 原则批准信(IPA)样本(已脱敏)"
  },
  {
    "slug": "ep-2",
    "country": "新加坡",
    "type": "EP 原则批准信(IPA)",
    "year": "2026",
    "group": "ep",
    "w": 255,
    "h": 360,
    "alt": "新加坡EP 原则批准信(IPA)样本(已脱敏)"
  },
  {
    "slug": "ky-1",
    "country": "开曼群岛",
    "type": "公司注册证书",
    "year": "2026",
    "group": "offshore",
    "w": 360,
    "h": 273,
    "alt": "开曼群岛公司注册证书样本(已脱敏)"
  },
  {
    "slug": "bvi-1",
    "country": "BVI",
    "type": "公司注册证书",
    "year": "2026",
    "group": "offshore",
    "w": 360,
    "h": 256,
    "alt": "BVI公司注册证书样本(已脱敏)"
  },
  {
    "slug": "bvi-2",
    "country": "BVI",
    "type": "公司注册证书",
    "year": "2026",
    "group": "offshore",
    "w": 360,
    "h": 256,
    "alt": "BVI公司注册证书样本(已脱敏)"
  },
  {
    "slug": "sc-1",
    "country": "塞舌尔",
    "type": "公司注册证书",
    "year": "2026",
    "group": "offshore",
    "w": 360,
    "h": 256,
    "alt": "塞舌尔公司注册证书样本(已脱敏)"
  },
  {
    "slug": "sc-2",
    "country": "塞舌尔",
    "type": "公司注册证书",
    "year": "2026",
    "group": "offshore",
    "w": 360,
    "h": 255,
    "alt": "塞舌尔公司注册证书样本(已脱敏)"
  },
  {
    "slug": "us-de-1",
    "country": "美国 · 特拉华",
    "type": "公司注册证书",
    "year": "2026",
    "group": "west",
    "w": 278,
    "h": 360,
    "alt": "美国 · 特拉华公司注册证书样本(已脱敏)"
  },
  {
    "slug": "us-co-1",
    "country": "美国 · 科罗拉多",
    "type": "公司注册证书",
    "year": "2026",
    "group": "west",
    "w": 278,
    "h": 360,
    "alt": "美国 · 科罗拉多公司注册证书样本(已脱敏)"
  },
  {
    "slug": "us-co-2",
    "country": "美国 · 科罗拉多",
    "type": "公司注册证书",
    "year": "2026",
    "group": "west",
    "w": 280,
    "h": 360,
    "alt": "美国 · 科罗拉多公司注册证书样本(已脱敏)"
  },
  {
    "slug": "my-cidb-1",
    "country": "马来西亚",
    "type": "CIDB 建筑承包资质",
    "year": "2026",
    "group": "license",
    "w": 256,
    "h": 360,
    "alt": "马来西亚CIDB 建筑承包资质样本(已脱敏)"
  },
  {
    "slug": "ae-dubai-1",
    "country": "阿联酋 · 迪拜",
    "type": "自由贸易区营业执照",
    "year": "2025",
    "group": "asia",
    "w": 257,
    "h": 360,
    "alt": "阿联酋 · 迪拜自由贸易区营业执照样本(已脱敏)"
  },
  {
    "slug": "uk-1",
    "country": "英国",
    "type": "Companies House 注册证书",
    "year": "2026",
    "group": "west",
    "w": 281,
    "h": 360,
    "alt": "英国Companies House 注册证书样本(已脱敏)"
  },
  {
    "slug": "vn-1",
    "country": "越南",
    "type": "投资登记证(IRC)",
    "year": "2026",
    "group": "asia",
    "w": 245,
    "h": 360,
    "alt": "越南投资登记证(IRC)样本(已脱敏)"
  },
  {
    "slug": "mh-1",
    "country": "马绍尔群岛",
    "type": "公司注册证书",
    "year": "2026",
    "group": "offshore",
    "w": 277,
    "h": 360,
    "alt": "马绍尔群岛公司注册证书样本(已脱敏)"
  }
];

module.exports = { GROUPS, ITEMS };
