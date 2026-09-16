// English country pages — targets English-language queries (e.g. "Singapore company
// registration"), the channel VanZbon covers with ~400 English country slugs and
// where hq10000.com currently has zero coverage.
// Facts mirror the corresponding Chinese country pages; timelines/fees are ranges.
'use strict';

module.exports = [
  {
    slug: 'singapore-company-registration', zhPath: '/country/sg', flag: '🇸🇬', country: 'Singapore',
    title: 'Singapore Company Registration',
    metaTitle: 'Singapore Company Registration | ACRA Pte Ltd · 5-7 Business Days',
    metaDesc: 'Register a Singapore Pte Ltd through a licensed corporate secretarial firm. ACRA filing in 5-7 business days, 100% foreign ownership allowed, local resident director and registered address provided.',
    intro: 'Singapore is one of Southeast Asia&rsquo;s leading financial and holding centres, with a transparent regulatory regime and a well-developed banking system. A Singapore <strong>Pte Ltd</strong> is commonly used as a regional headquarters, trading entity or holding company for cross-border business.',
    stats: [
      { label: 'Regulator', value: 'ACRA' },
      { label: 'Entity type', value: 'Pte Ltd' },
      { label: 'Timeline', value: '5-7 business days' },
      { label: 'Foreign ownership', value: 'Up to 100%' }
    ],
    blocks: [
      {
        h: 'Key requirements',
        list: [
          '<strong>Directors</strong>: at least one, and at least one must be a <strong>Singapore-resident director</strong> (citizen, PR or eligible pass holder). Nominee director service can be arranged.',
          '<strong>Shareholders</strong>: 1-50, individuals or corporate entities; 100% foreign shareholding is permitted in most industries.',
          '<strong>Share capital</strong>: minimum S$1; no mandatory paid-up requirement beyond that.',
          '<strong>Registered address</strong>: a valid local address in Singapore is required.',
          '<strong>Company secretary</strong>: must be appointed within 6 months of incorporation.'
        ]
      },
      {
        h: 'Registration process',
        ordered: true,
        list: [
          'Name check and reservation via ACRA BizFile+ (1 business day)',
          'Preparation and signing of incorporation documents (1 business day)',
          'Filing with ACRA (1-2 business days) — UEN and BizFile issued',
          'Certificate of incorporation issued (1 business day)',
          'Corporate kit: common seal, constitution and statutory registers (1 business day)',
          'Corporate bank account application (runs in parallel; DBS / OCBC / UOB)'
        ]
      },
      {
        h: 'Tax and ongoing obligations',
        paras: ['Singapore applies a <strong>17% corporate income tax rate</strong>, with start-up tax exemption (SUTE) available for qualifying new companies on their first tranches of chargeable income. There is no capital gains tax.'],
        list: [
          'Annual return filing with ACRA and corporate tax filing (Form C-S / ECI) each year',
          'Appointment and maintenance of a local company secretary and registered address',
          'Even dormant companies must file — late filing attracts penalties'
        ]
      }
    ],
    faqs: [
      { q: 'Can a foreigner own 100% of a Singapore company?', a: 'Yes. Most industries allow 100% foreign shareholding with no local shareholder required. A small number of regulated sectors carry foreign ownership limits. A Singapore-resident director is required regardless of shareholding.' },
      { q: 'Do I need to travel to Singapore to incorporate?', a: 'No. Incorporation is handled remotely, and most banks open corporate accounts via video verification. Corporate secretarial work is performed by the appointed firm in Singapore.' },
      { q: 'How long does registration take?', a: 'The standard timeline is 5-7 business days for the company itself. Bank account opening typically takes longer (commonly 4-8 weeks) and depends on the bank&rsquo;s compliance review.' }
    ]
  },

  {
    slug: 'hong-kong-company-registration', zhPath: '/country/hk', flag: '🇭🇰', country: 'Hong Kong',
    title: 'Hong Kong Company Registration',
    metaTitle: 'Hong Kong Company Registration | Private Limited · 3-7 Business Days',
    metaDesc: 'Set up a Hong Kong private limited company with a TCSP corporate secretarial provider. Companies Registry filing in 3-7 business days, territorial taxation and a 16.5% profits tax rate.',
    intro: 'Hong Kong operates a common-law system, a free-trade environment and a <strong>territorial tax regime</strong>: profits arising outside Hong Kong may not be taxable, the standard profits tax rate is 16.5%, and there is no capital gains tax or withholding tax on dividends. It is a widely used jurisdiction for cross-border trading, holding and professional services.',
    stats: [
      { label: 'Regulator', value: 'Companies Registry (CR)' },
      { label: 'Entity type', value: 'Private limited company' },
      { label: 'Timeline', value: '3-7 business days' },
      { label: 'Profits tax', value: '16.5% (territorial)' }
    ],
    blocks: [
      {
        h: 'Key requirements',
        list: [
          '<strong>Directors</strong>: at least one, of any nationality; corporate directors are permitted but additional requirements may apply.',
          '<strong>Shareholders</strong>: at least one; 100% foreign ownership is allowed.',
          '<strong>Company secretary</strong>: must be a Hong Kong resident or a TCSP-licensed entity — this is mandatory.',
          '<strong>Registered address</strong>: a local Hong Kong address is required.',
          '<strong>Share capital</strong>: commonly HK$1 to HK$10,000; no mandatory paid-up requirement.'
        ]
      },
      {
        h: 'Registration process',
        ordered: true,
        list: [
          'Name availability check with the Companies Registry (1 business day)',
          'Preparation and signing of incorporation documents (NNC1 series)',
          'Filing with the Companies Registry (3-7 business days)',
          'Certificate of Incorporation and Business Registration Certificate issued',
          'Corporate kit: articles, registers, company chop and statutory documents',
          'Corporate bank account application with a Hong Kong bank'
        ]
      },
      {
        h: 'Ongoing obligations',
        list: [
          'Annual return (NAR1) filing and renewal of the Business Registration Certificate',
          'Profits tax return filing; audited accounts are required in most cases',
          'Maintenance of a TCSP-licensed company secretary and registered address',
          'Significant Controllers Register (SCR) must be kept and updated'
        ]
      }
    ],
    faqs: [
      { q: 'How long does Hong Kong company registration take?', a: 'A standard private limited company is typically registered in 3-7 business days. Bank account opening is a separate, longer process — commonly 2-8 weeks depending on the bank and the quality of business documentation provided.' },
      { q: 'Is a Hong Kong company tax resident by default?', a: 'Not automatically. Hong Kong taxes on a territorial basis — profits arising in or derived from Hong Kong are chargeable. Companies with activities elsewhere may apply for offshore profits exemption, which requires supporting evidence and a filing with the IRD.' },
      { q: 'Do I need a local director?', a: 'No — directors can be of any nationality. However, a TCSP-licensed company secretary and a local registered address are both mandatory.' }
    ]
  },

  {
    slug: 'us-company-registration', zhPath: '/country/us', flag: '🇺🇸', country: 'United States',
    title: 'US Company Registration',
    metaTitle: 'US Company Registration | LLC / C-Corp · 1-3 Business Days',
    metaDesc: 'Form a US LLC or C-Corp from abroad. Delaware, Wyoming and California filings in 1-3 business days, with registered agent service, EIN application and ongoing compliance support.',
    intro: 'A US entity gives access to US payment rails such as Stripe and PayPal, US marketplaces and US banking. <strong>Delaware</strong> and <strong>Wyoming</strong> are the most common states for foreign-owned entities; Delaware is preferred when future investment or equity incentives are planned.',
    stats: [
      { label: 'Regulator', value: 'State Secretary of State' },
      { label: 'Entity types', value: 'LLC / C-Corp' },
      { label: 'Timeline', value: '1-3 business days' },
      { label: 'Common states', value: 'Delaware / Wyoming / California' }
    ],
    blocks: [
      {
        h: 'LLC or C-Corp?',
        list: [
          '<strong>LLC</strong> — pass-through taxation by default, flexible management structure, lower compliance overhead. Suited to e-commerce sellers, trading entities and asset holding.',
          '<strong>C-Corp</strong> — the standard structure for venture funding and equity incentives, with a familiar share/board framework. Subject to corporate-level tax (and a second layer on dividends).',
          'A common path is to operate as an LLC first and convert to a C-Corp when institutional funding is raised; the conversion has tax and contractual implications and should be planned in advance.'
        ]
      },
      {
        h: 'Key requirements',
        list: [
          '<strong>Members / directors</strong>: minimum one; no nationality restriction and no US residency requirement.',
          '<strong>Registered agent</strong>: every US entity must maintain a registered agent with a physical address in the state of formation.',
          '<strong>Formation document</strong>: Articles of Organization (LLC) or Certificate of Incorporation (C-Corp).',
          '<strong>EIN</strong>: an Employer Identification Number is required for banking and tax filings and is applied for separately after formation.',
          '<strong>Operating agreement / bylaws</strong>: not always mandatory, but strongly recommended for clarity and banking.'
        ]
      },
      {
        h: 'Formation process',
        ordered: true,
        list: [
          'State selection and entity structuring (1-2 business days)',
          'Name availability check and reservation',
          'Filing of formation documents with the Secretary of State (1-3 business days)',
          'EIN application (1-3 weeks; may run in parallel)',
          'Drafting of operating agreement or bylaws and initial resolutions',
          'Ongoing: annual report / franchise tax, federal and state filings, BOI beneficial ownership report'
        ]
      }
    ],
    faqs: [
      { q: 'Do I need an SSN or US residency to register a US company?', a: 'No. Formation does not require an SSN, ITIN or US residency. An EIN can be obtained with the formation documents and the responsible party&rsquo;s passport details, though the process takes longer without an SSN.' },
      { q: 'Which state should I choose?', a: 'Delaware is standard when you expect investment or complex equity; Wyoming is popular for e-commerce and small entities for its lower franchise tax and privacy; if you have staff, offices or inventory in a state, you may also need to register there as a foreign entity.' },
      { q: 'Can I open a US business bank account remotely?', a: 'In many cases yes, particularly with digital-first providers. Traditional banks usually require stronger evidence of US business activity and may require in-person visits. An EIN and a US company are normally prerequisites.' }
    ]
  },

  {
    slug: 'dubai-company-registration', zhPath: '/country/ae', flag: '🇦🇪', country: 'Dubai / UAE',
    title: 'Dubai Company Registration',
    metaTitle: 'Dubai Company Registration | Free Zone & Mainland · 5-10 Business Days',
    metaDesc: 'Set up a Dubai free zone or mainland company. 100% foreign ownership in free zones, residence visa quotas, corporate tax at 9% on qualifying profits, with bank account support.',
    intro: 'Dubai is the principal gateway to the Middle East and Africa, combining a free zone system with over 20 specialised zones and a mainland licensing regime administered by the DED. Free zone entities allow <strong>100% foreign ownership</strong> with residence visa quotas; mainland entities can trade directly within the local UAE market and may require a local service agent for certain activities.',
    stats: [
      { label: 'Regulator', value: 'Free Zone Authority / DED' },
      { label: 'Entity types', value: 'Free Zone LLC / Mainland' },
      { label: 'Timeline', value: '5-10 business days' },
      { label: 'Corporate tax', value: '9% above AED 375,000' }
    ],
    blocks: [
      {
        h: 'Free zone or mainland?',
        list: [
          '<strong>Free zone company</strong> — 100% foreign ownership, a registered address within the zone, and visa quotas for shareholders and staff. Suited to international trading, holding structures, e-commerce and asset management.',
          '<strong>Mainland company</strong> — licensed by the DED and able to trade directly in the UAE market. Since the 2021 commercial companies law reform, most commercial and industrial activities permit 100% foreign ownership; certain regulated activities still require local participation or separate approvals.',
          'Free zone registration is the lower-friction route for international businesses, but activities outside the licensed zone may require additional permits.'
        ]
      },
      {
        h: 'Key requirements',
        list: [
          '<strong>Shareholder / director</strong>: minimum one of each; they may be the same person; no nationality restriction.',
          '<strong>Registered address</strong>: provided by the chosen free zone (shared or dedicated office options) or a local address for mainland entities.',
          '<strong>Registered agent and company secretary</strong>: required for free zone entities.',
          '<strong>Business activity</strong>: must fall within the approved activity list of the selected free zone or the DED licence.',
          '<strong>Share capital</strong>: varies by free zone and activity; most free zones do not require paid-up capital.'
        ]
      },
      {
        h: 'Process and ongoing obligations',
        ordered: true,
        list: [
          'Structuring advice and jurisdiction selection (1 business day)',
          'Name reservation and activity approval (1-2 business days)',
          'Submission of incorporation documents and licence fee payment (2-3 business days)',
          'Trade licence issued (1-2 business days)',
          'Immigration card and residence visa processing (3-7 business days, parallel)',
          'Corporate bank account opening (2-6 weeks; UAE banks apply detailed KYC review)',
          'Annual: licence renewal, audited accounts where required, and corporate tax filings'
        ]
      }
    ],
    faqs: [
      { q: 'Are Dubai companies taxed?', a: 'The UAE introduced a federal corporate tax of 9% on taxable profits above AED 375,000 with effect from June 2023, and applies a 5% VAT. Qualifying free zone companies may continue to benefit from preferential treatment under conditions. Please confirm the current position with our advisors.' },
      { q: 'Why is opening a UAE bank account difficult?', a: 'UAE banks apply strict anti-money-laundering and business-substance checks. Applications commonly require a business plan, supplier or customer contracts, or a company website, and may require the director to attend in person. Preparing the documentation properly significantly improves the outcome.' },
      { q: 'How long does Dubai company setup take?', a: 'Incorporation and licensing typically complete within 5-10 business days. Bank account opening is separate and usually takes longer, so plan it as a distinct step.' }
    ]
  }
];
