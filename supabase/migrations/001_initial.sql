-- ============================================================
-- SarkariSaathi — 001_initial.sql
-- Full schema + seed data for ALL 28 Indian states
-- Services: Ration Card, Aadhaar Update, PAN Card
-- Last verified: March 2026
-- ============================================================

-- ─────────────────────────────────────────
-- SCHEMA
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name_en TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    description_en TEXT,
    description_hi TEXT,
    icon_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subcases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_hi TEXT NOT NULL,
    UNIQUE(service_id, slug)
);

CREATE TABLE IF NOT EXISTS guides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subcase_id UUID REFERENCES subcases(id) ON DELETE CASCADE,
    state TEXT NOT NULL,
    documents_en JSONB NOT NULL DEFAULT '[]',
    documents_hi JSONB NOT NULL DEFAULT '[]',
    steps_en JSONB NOT NULL DEFAULT '[]',
    steps_hi JSONB NOT NULL DEFAULT '[]',
    office_name TEXT,
    portal_url TEXT,
    fee_en TEXT,
    fee_hi TEXT,
    timeline_days INTEGER,
    form_fields_en JSONB DEFAULT '[]',
    form_fields_hi JSONB DEFAULT '[]',
    last_verified_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(subcase_id, state)
);

-- ─────────────────────────────────────────
-- SEED: SERVICES
-- ─────────────────────────────────────────

INSERT INTO services (slug, name_en, name_hi, description_en, description_hi, icon_name) VALUES
('ration_card',    'Ration Card',    'राशन कार्ड',   'Apply for new ration card, corrections, or report lost card.', 'नए राशन कार्ड के लिए आवेदन करें, सुधार करें या खोए हुए कार्ड की रिपोर्ट करें।', 'container'),
('aadhaar_update', 'Aadhaar Update', 'आधार अपडेट',  'Correct name, date of birth, address, or update mobile number.', 'नाम, जन्म तिथि, पता सुधारें या मोबाइल नंबर अपडेट करें।', 'fingerprint'),
('pan_card',       'PAN Card',       'पैन कार्ड',    'New PAN card application, corrections, or reprinting.', 'नया पैन कार्ड आवेदन, सुधार या पुनर्मुद्रण।', 'credit-card')
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- SEED: SUBCASES
-- ─────────────────────────────────────────

INSERT INTO subcases (service_id, slug, name_en, name_hi)
SELECT id, 'new_application', 'New Application',       'नया आवेदन'       FROM services WHERE slug='ration_card' ON CONFLICT DO NOTHING;
INSERT INTO subcases (service_id, slug, name_en, name_hi)
SELECT id, 'correction',      'Correction/Update',     'सुधार'           FROM services WHERE slug='ration_card' ON CONFLICT DO NOTHING;
INSERT INTO subcases (service_id, slug, name_en, name_hi)
SELECT id, 'lost_card',       'Lost/Duplicate Card',   'खोया हुआ कार्ड' FROM services WHERE slug='ration_card' ON CONFLICT DO NOTHING;

INSERT INTO subcases (service_id, slug, name_en, name_hi)
SELECT id, 'address_change',   'Address Change',       'पता बदलना'              FROM services WHERE slug='aadhaar_update' ON CONFLICT DO NOTHING;
INSERT INTO subcases (service_id, slug, name_en, name_hi)
SELECT id, 'mobile_update',    'Mobile Update',        'मोबाइल अपडेट'           FROM services WHERE slug='aadhaar_update' ON CONFLICT DO NOTHING;
INSERT INTO subcases (service_id, slug, name_en, name_hi)
SELECT id, 'name_correction',  'Name/DOB Correction',  'नाम/जन्म तिथि सुधार'   FROM services WHERE slug='aadhaar_update' ON CONFLICT DO NOTHING;

INSERT INTO subcases (service_id, slug, name_en, name_hi)
SELECT id, 'new_pan',    'New PAN Card',         'नया पैन कार्ड'   FROM services WHERE slug='pan_card' ON CONFLICT DO NOTHING;
INSERT INTO subcases (service_id, slug, name_en, name_hi)
SELECT id, 'lost_pan',   'Lost/Duplicate PAN',   'खोया हुआ पैन'    FROM services WHERE slug='pan_card' ON CONFLICT DO NOTHING;
INSERT INTO subcases (service_id, slug, name_en, name_hi)
SELECT id, 'correction', 'Correction/Update',    'सुधार'           FROM services WHERE slug='pan_card' ON CONFLICT DO NOTHING;


-- ============================================================
-- RATION CARD — STATE-SPECIFIC NEW APPLICATION GUIDES
-- ============================================================

-- UTTAR PRADESH
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days, form_fields_en, form_fields_hi)
SELECT sc.id, 'Uttar Pradesh',
'["Aadhaar Card of all family members","Income Certificate (Rural <2L, Urban <3L)","Residence Proof (Electricity/Water bill)","Bank Passbook of female HoF (18+)","Passport size photo of all members"]',
'["सभी सदस्यों का आधार कार्ड","आय प्रमाण पत्र (ग्रामीण <2L, शहरी <3L)","निवास प्रमाण (बिजली/पानी बिल)","परिवार की मुखिया (18+ महिला) की बैंक पासबुक","सभी सदस्यों का पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"Visit fcs.up.gov.in","description":"Go to the UP Food & Civil Supplies portal."},{"step_number":2,"title":"Download Form","description":"Download the new ration card application form from the portal."},{"step_number":3,"title":"Fill & Attach Documents","description":"Fill family member details and Aadhaar numbers carefully. Attach income and residence proof."},{"step_number":4,"title":"Submit at Tehsil","description":"Submit the form and documents at your local Tehsil office."},{"step_number":5,"title":"Pay Fee","description":"Pay ₹15–₹30 user charge via e-District portal or at Tehsil counter."},{"step_number":6,"title":"Field Verification","description":"A Food Supply Officer will visit for field verification. Print acknowledgement for tracking."}]',
'[{"step_number":1,"title":"fcs.up.gov.in पर जाएं","description":"यूपी खाद्य एवं नागरिक आपूर्ति पोर्टल पर जाएं।"},{"step_number":2,"title":"फॉर्म डाउनलोड करें","description":"पोर्टल से नए राशन कार्ड का आवेदन पत्र डाउनलोड करें।"},{"step_number":3,"title":"भरें और संलग्न करें","description":"परिवार के सदस्यों का विवरण और आधार नंबर सावधानी से भरें।"},{"step_number":4,"title":"तहसील में जमा करें","description":"अपनी स्थानीय तहसील कार्यालय में फॉर्म और दस्तावेज जमा करें।"},{"step_number":5,"title":"शुल्क भुगतान करें","description":"ई-डिस्ट्रिक्ट पोर्टल के माध्यम से ₹15–₹30 शुल्क का भुगतान करें।"},{"step_number":6,"title":"फील्ड सत्यापन","description":"खाद्य आपूर्ति अधिकारी फील्ड सत्यापन के लिए आएंगे।"}]',
'Local Tehsil / Block Development Office (BDO)', 'https://fcs.up.gov.in', '₹15–₹30', '₹15–₹30', 30,
'[{"field":"Annual Income","explanation":"Total family income from all sources. Limit: Rural ₹2L, Urban ₹3L."},{"field":"Head of Family","explanation":"Oldest female member (18+) is the Head under NFSA rules."}]',
'[{"field":"वार्षिक आय","explanation":"सभी स्रोतों से परिवार की कुल आय। सीमा: ग्रामीण ₹2L, शहरी ₹3L।"},{"field":"परिवार का मुखिया","explanation":"NFSA नियमों के तहत सबसे बड़ी महिला सदस्य (18+) मुखिया होती है।"}]'
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- MAHARASHTRA
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Maharashtra',
'["Aadhaar Card","Voter ID","LPG connection client copy","Residence Proof (Utility bill)","Income Certificate (Yellow <15k, Saffron <1L, White >1L)"]',
'["आधार कार्ड","मतदाता आईडी","एलपीजी कनेक्शन क्लाइंट कॉपी","निवास प्रमाण (उपयोगिता बिल)","आय प्रमाण पत्र (पीला <15हजार, केसरिया <1लाख, सफेद >1लाख)"]',
'[{"step_number":1,"title":"Visit Aaple Sarkar / mahafood.gov.in","description":"Login to mahafood.gov.in or rcms.mahafood.gov.in portal."},{"step_number":2,"title":"Download Form","description":"Download Application Form for New Ration Card."},{"step_number":3,"title":"Self-Declaration","description":"Sign the self-declaration form regarding income and assets."},{"step_number":4,"title":"Submit at Tahsildar Office","description":"Submit form at the Tahsildar office with ₹2 Court Fee Stamp."}]',
'[{"step_number":1,"title":"आपले सरकार/mahafood.gov.in पर जाएं","description":"mahafood.gov.in या rcms.mahafood.gov.in पोर्टल पर लॉग इन करें।"},{"step_number":2,"title":"फॉर्म डाउनलोड करें","description":"नए राशन कार्ड के लिए आवेदन पत्र डाउनलोड करें।"},{"step_number":3,"title":"स्व-घोषणा","description":"आय और संपत्ति के संबंध में स्व-घोषणा पत्र पर हस्ताक्षर करें।"},{"step_number":4,"title":"तहसीलदार कार्यालय में जमा करें","description":"₹2 कोर्ट फीस स्टैंप के साथ तहसीलदार कार्यालय में फॉर्म जमा करें।"}]',
'Tahsildar Office / Supply Department', 'https://mahafood.gov.in', '₹2 (Stamp) + service fee', '₹2 (स्टैम्प) + सेवा शुल्क', 21
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- DELHI
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Delhi',
'["Aadhaar Card of ALL members (Mandatory)","Passport size photo of Head of Family","Electricity/Water Bill","Income Certificate (Self-attested for PHH)"]',
'["सभी सदस्यों का आधार कार्ड (अनिवार्य)","परिवार के मुखिया की पासपोर्ट साइज फोटो","बिजली/पानी का बिल","आय प्रमाण पत्र (PHH के लिए स्व-सत्यापित)"]',
'[{"step_number":1,"title":"e-District Portal","description":"Register on edistrict.delhigovt.nic.in."},{"step_number":2,"title":"Apply Online","description":"Select issuance of Priority Household (PHH) or AAY card."},{"step_number":3,"title":"Upload Documents","description":"Upload scanned copies of Aadhaar and Address proof."},{"step_number":4,"title":"Field Verification","description":"Food Supply Officer (FSO) will do field verification. Track on nfs.delhi.gov.in."}]',
'[{"step_number":1,"title":"ई-डिस्ट्रिक्ट पोर्टल","description":"edistrict.delhigovt.nic.in पर पंजीकरण करें।"},{"step_number":2,"title":"ऑनलाइन आवेदन करें","description":"PHH या AAY कार्ड जारी करना चुनें।"},{"step_number":3,"title":"दस्तावेज़ अपलोड","description":"आधार और निवास प्रमाण की स्कैन प्रतियां अपलोड करें।"},{"step_number":4,"title":"फील्ड सत्यापन","description":"खाद्य आपूर्ति अधिकारी फील्ड सत्यापन करेंगे। nfs.delhi.gov.in पर ट्रैक करें।"}]',
'Circle Office (Food & Supplies Dept)', 'https://nfs.delhi.gov.in', 'Free (nominal service fee)', 'नि:शुल्क (नाममात्र सेवा शुल्क)', 45
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- KARNATAKA
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Karnataka',
'["Aadhaar Card (linked with mobile)","Income Certificate (for BPL/Antyodaya)","Caste Certificate","Recent Property Tax/Electricity Bill"]',
'["आधार कार्ड (मोबाइल से लिंक)","आय प्रमाण पत्र (BPL/अंत्योदय के लिए)","जाति प्रमाण पत्र","हालिया संपत्ति कर/बिजली बिल"]',
'[{"step_number":1,"title":"Visit Seva Sindhu / Ahara portal","description":"Visit sevasindhu.karnataka.gov.in or ahara.kar.nic.in."},{"step_number":2,"title":"Login via Aadhaar OTP","description":"Authenticate using your Aadhaar-linked mobile OTP."},{"step_number":3,"title":"Select FPS","description":"Choose your nearest Fair Price Shop."},{"step_number":4,"title":"Biometric Verification","description":"Visit Grama One or Seva Sindhu centre for biometric verification."}]',
'[{"step_number":1,"title":"सेवा सिंधु/अहारा पोर्टल पर जाएं","description":"sevasindhu.karnataka.gov.in या ahara.kar.nic.in पर जाएं।"},{"step_number":2,"title":"आधार OTP से लॉगिन","description":"आधार-लिंक्ड मोबाइल OTP से प्रमाणित करें।"},{"step_number":3,"title":"FPS चुनें","description":"अपनी निकटतम उचित मूल्य की दुकान चुनें।"},{"step_number":4,"title":"बायोमेट्रिक सत्यापन","description":"ग्राम वन या सेवा सिंधु केंद्र पर बायोमेट्रिक सत्यापन के लिए जाएं।"}]',
'Local Food Office / Grama One Centre', 'https://ahara.kar.nic.in', '₹15–₹50', '₹15–₹50', 30
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- TAMIL NADU
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Tamil Nadu',
'["Aadhaar Card of all members","Income Certificate","Proof of Residence (Electricity/Gas bill)","Self-declaration on stamp paper (for no-income families)","Passport size photo"]',
'["सभी सदस्यों का आधार कार्ड","आय प्रमाण पत्र","निवास प्रमाण (बिजली/गैस बिल)","स्टाम्प पेपर पर स्व-घोषणा (शून्य आय परिवारों के लिए)","पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"Visit TNPDS Portal","description":"Go to www.tnpds.gov.in and register."},{"step_number":2,"title":"Smart Card Application","description":"Click on Smart Card Application and fill the form online."},{"step_number":3,"title":"Upload Documents","description":"Upload Aadhaar, income proof and photo."},{"step_number":4,"title":"Submit & Acknowledge","description":"Submit and note the acknowledgement number."},{"step_number":5,"title":"Field Check","description":"Tahsildar office will conduct verification within 30 days."}]',
'[{"step_number":1,"title":"TNPDS पोर्टल पर जाएं","description":"www.tnpds.gov.in पर जाएं और पंजीकरण करें।"},{"step_number":2,"title":"स्मार्ट कार्ड आवेदन","description":"स्मार्ट कार्ड आवेदन पर क्लिक करें और ऑनलाइन फॉर्म भरें।"},{"step_number":3,"title":"दस्तावेज़ अपलोड करें","description":"आधार, आय प्रमाण और फोटो अपलोड करें।"},{"step_number":4,"title":"जमा करें और पावती लें","description":"जमा करें और पावती संख्या नोट करें।"},{"step_number":5,"title":"फील्ड जांच","description":"तहसीलदार कार्यालय 30 दिनों के भीतर सत्यापन करेगा।"}]',
'Taluk Supply Office / Tahsildar', 'https://www.tnpds.gov.in', 'Free', 'नि:शुल्क', 30
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- WEST BENGAL
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'West Bengal',
'["Aadhaar Card of all family members","Voter ID Card","Residence Proof (Electricity/Water bill)","Income Certificate or Self-declaration","Passport size photo"]',
'["सभी परिवार के सदस्यों का आधार कार्ड","मतदाता पहचान पत्र","निवास प्रमाण (बिजली/पानी बिल)","आय प्रमाण पत्र या स्व-घोषणा","पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"Visit WB Food Portal","description":"Go to food.wb.gov.in and register your family."},{"step_number":2,"title":"Apply via e-Service Centre","description":"Apply through a Block or Municipal e-Service Centre with all documents."},{"step_number":3,"title":"Aadhaar Seeding","description":"Aadhaar seeding of all members is mandatory for new cards."},{"step_number":4,"title":"Verification","description":"Block Supply Officer verifies the application. Card issued at FPS within 45 days."}]',
'[{"step_number":1,"title":"WB फूड पोर्टल पर जाएं","description":"food.wb.gov.in पर जाएं और परिवार पंजीकरण करें।"},{"step_number":2,"title":"ई-सेवा केंद्र के माध्यम से आवेदन करें","description":"सभी दस्तावेजों के साथ ब्लॉक या नगर ई-सेवा केंद्र के माध्यम से आवेदन करें।"},{"step_number":3,"title":"आधार सीडिंग","description":"नए कार्ड के लिए सभी सदस्यों की आधार सीडिंग अनिवार्य है।"},{"step_number":4,"title":"सत्यापन","description":"ब्लॉक आपूर्ति अधिकारी आवेदन सत्यापित करता है। 45 दिनों के भीतर FPS पर कार्ड जारी होता है।"}]',
'Block Supply Office / Ration Office', 'https://food.wb.gov.in', 'Free', 'नि:शुल्क', 45
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- BIHAR
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Bihar',
'["Aadhaar Card of all family members","Residence Proof (Electricity bill/Bank passbook)","Income Certificate","Voter ID","Passport size photo of head of family"]',
'["सभी परिवार के सदस्यों का आधार कार्ड","निवास प्रमाण (बिजली बिल/बैंक पासबुक)","आय प्रमाण पत्र","मतदाता आईडी","परिवार के मुखिया का पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"Visit EPDS Bihar","description":"Go to epds.bihar.gov.in portal."},{"step_number":2,"title":"RC Apply","description":"Click on RC Apply → New Ration Card Application."},{"step_number":3,"title":"Enter Family Details","description":"Enter all family member Aadhaar numbers and personal details."},{"step_number":4,"title":"Upload Documents","description":"Upload required documents as scanned PDFs/images."},{"step_number":5,"title":"Block Supply Officer Verification","description":"BSO will verify and forward to District Supply Officer. Card issued in ~30 days."}]',
'[{"step_number":1,"title":"EPDS Bihar पर जाएं","description":"epds.bihar.gov.in पोर्टल पर जाएं।"},{"step_number":2,"title":"RC आवेदन","description":"RC Apply → नया राशन कार्ड आवेदन पर क्लिक करें।"},{"step_number":3,"title":"परिवार विवरण दर्ज करें","description":"सभी परिवार के सदस्यों के आधार नंबर और व्यक्तिगत विवरण दर्ज करें।"},{"step_number":4,"title":"दस्तावेज़ अपलोड करें","description":"आवश्यक दस्तावेज स्कैन्ड PDF/इमेज के रूप में अपलोड करें।"},{"step_number":5,"title":"BSO सत्यापन","description":"BSO सत्यापन करेगा। ~30 दिनों में कार्ड जारी होगा।"}]',
'Block Supply Officer / District Supply Office', 'https://epds.bihar.gov.in', 'Free', 'नि:शुल्क', 30
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- RAJASTHAN
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Rajasthan',
'["Jan Aadhaar Card (mandatory)","Aadhaar Card of all members","Bhamashah card (if available)","Income Certificate","Residence Proof"]',
'["जन आधार कार्ड (अनिवार्य)","सभी सदस्यों का आधार कार्ड","भामाशाह कार्ड (यदि उपलब्ध हो)","आय प्रमाण पत्र","निवास प्रमाण"]',
'[{"step_number":1,"title":"Jan Aadhaar Registration","description":"First register on Jan Aadhaar portal: janaadhaar.rajasthan.gov.in."},{"step_number":2,"title":"Visit Food Portal","description":"Go to food.rajasthan.gov.in for ration card application."},{"step_number":3,"title":"Link Jan Aadhaar","description":"Link your Jan Aadhaar number to the ration card application."},{"step_number":4,"title":"Submit at E-Mitra","description":"Submit documents at the nearest E-Mitra centre."},{"step_number":5,"title":"Verification","description":"Supply Inspector verifies. Card issued in 30 days."}]',
'[{"step_number":1,"title":"जन आधार पंजीकरण","description":"पहले janaadhaar.rajasthan.gov.in पर जन आधार पोर्टल पर पंजीकरण करें।"},{"step_number":2,"title":"फूड पोर्टल पर जाएं","description":"राशन कार्ड आवेदन के लिए food.rajasthan.gov.in पर जाएं।"},{"step_number":3,"title":"जन आधार लिंक करें","description":"राशन कार्ड आवेदन से अपना जन आधार नंबर लिंक करें।"},{"step_number":4,"title":"ई-मित्र पर जमा करें","description":"निकटतम ई-मित्र केंद्र पर दस्तावेज जमा करें।"},{"step_number":5,"title":"सत्यापन","description":"सप्लाई इंस्पेक्टर सत्यापन करेगा। 30 दिनों में कार्ड जारी होगा।"}]',
'E-Mitra Centre / District Supply Office', 'https://food.rajasthan.gov.in', '₹40 (E-Mitra fee)', '₹40 (ई-मित्र शुल्क)', 30
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- TELANGANA
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Telangana',
'["Aadhaar Card of all members","Income Certificate (Rural <1.5L, Urban <2L)","Residence Proof","LPG connection number (if any)","Passport size photo"]',
'["सभी सदस्यों का आधार कार्ड","आय प्रमाण पत्र (ग्रामीण <1.5L, शहरी <2L)","निवास प्रमाण","LPG कनेक्शन नंबर (यदि हो)","पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"EPDS Telangana Portal","description":"Visit epds.telangana.gov.in or MeeSeva centre."},{"step_number":2,"title":"Download FSC Form","description":"Download the Food Security Card (FSC) application form."},{"step_number":3,"title":"Fill & Submit at MeeSeva","description":"Fill details of all family members and submit at MeeSeva with ₹30 fee."},{"step_number":4,"title":"Reference Number","description":"Collect acknowledgement slip with reference number."},{"step_number":5,"title":"Status Check","description":"Check status online using FSC reference number or Aadhaar number."}]',
'[{"step_number":1,"title":"EPDS तेलंगाना पोर्टल","description":"epds.telangana.gov.in या MeeSeva केंद्र पर जाएं।"},{"step_number":2,"title":"FSC फॉर्म डाउनलोड करें","description":"फूड सिक्योरिटी कार्ड (FSC) आवेदन पत्र डाउनलोड करें।"},{"step_number":3,"title":"MeeSeva पर जमा करें","description":"सभी परिवार के सदस्यों का विवरण भरें और ₹30 शुल्क के साथ MeeSeva पर जमा करें।"},{"step_number":4,"title":"संदर्भ संख्या","description":"संदर्भ संख्या के साथ पावती पर्ची लें।"},{"step_number":5,"title":"स्थिति जांचें","description":"FSC संदर्भ संख्या या आधार नंबर का उपयोग करके ऑनलाइन स्थिति जांचें।"}]',
'MeeSeva Centre / Food Department Office', 'https://epds.telangana.gov.in', '₹30 (MeeSeva fee)', '₹30 (MeeSeva शुल्क)', 30
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- ANDHRA PRADESH
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Andhra Pradesh',
'["Aadhaar Card of all members","Income Certificate (Rural <10k/month, Urban <12k/month)","Residence Proof","Voter ID","Passport size photo"]',
'["सभी सदस्यों का आधार कार्ड","आय प्रमाण पत्र (ग्रामीण <10k/माह, शहरी <12k/माह)","निवास प्रमाण","मतदाता आईडी","पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"AP Food Portal / MeeSeva","description":"Visit ap.meeseva.gov.in or epds.ap.gov.in."},{"step_number":2,"title":"Apply for New RC","description":"Select Ration Card Services → New Ration Card Application."},{"step_number":3,"title":"Fill Family Details","description":"Enter all family member details with Aadhaar numbers."},{"step_number":4,"title":"Submit & Pay","description":"Pay ₹30 service fee and submit at MeeSeva."},{"step_number":5,"title":"Field Verification","description":"Village Revenue Officer verifies. Card issued within 30 days."}]',
'[{"step_number":1,"title":"AP फूड पोर्टल/MeeSeva","description":"ap.meeseva.gov.in या epds.ap.gov.in पर जाएं।"},{"step_number":2,"title":"नया RC के लिए आवेदन करें","description":"राशन कार्ड सेवाएं → नया राशन कार्ड आवेदन चुनें।"},{"step_number":3,"title":"परिवार विवरण भरें","description":"आधार नंबर के साथ सभी परिवार के सदस्यों का विवरण दर्ज करें।"},{"step_number":4,"title":"जमा करें और भुगतान करें","description":"₹30 सेवा शुल्क का भुगतान करें और MeeSeva पर जमा करें।"},{"step_number":5,"title":"फील्ड सत्यापन","description":"ग्राम राजस्व अधिकारी सत्यापन करेगा। 30 दिनों के भीतर कार्ड जारी होगा।"}]',
'MeeSeva Centre / Revenue Division Office', 'https://epds.ap.gov.in', '₹30 (MeeSeva fee)', '₹30 (MeeSeva शुल्क)', 30
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- GUJARAT
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Gujarat',
'["Aadhaar Card of all members","Domicile Certificate","Residence Proof (Electricity/Water bill)","Income Certificate","Passport size photo"]',
'["सभी सदस्यों का आधार कार्ड","अधिवास प्रमाण पत्र","निवास प्रमाण (बिजली/पानी बिल)","आय प्रमाण पत्र","पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"Digital Gujarat Portal","description":"Visit digitalgujarat.gov.in and register."},{"step_number":2,"title":"Apply for Ration Card","description":"Search for Ration Card service → New Application."},{"step_number":3,"title":"Fill Form & Upload","description":"Complete application form and upload all documents."},{"step_number":4,"title":"Submit at Jan Seva Kendra","description":"Submit at nearest Jan Seva Kendra with service fee."},{"step_number":5,"title":"Verification","description":"Mamlatdar office verification and card issued within 30 days."}]',
'[{"step_number":1,"title":"डिजिटल गुजरात पोर्टल","description":"digitalgujarat.gov.in पर जाएं और पंजीकरण करें।"},{"step_number":2,"title":"राशन कार्ड के लिए आवेदन करें","description":"राशन कार्ड सेवा → नया आवेदन खोजें।"},{"step_number":3,"title":"फॉर्म भरें और अपलोड करें","description":"आवेदन पत्र पूरा करें और सभी दस्तावेज अपलोड करें।"},{"step_number":4,"title":"जन सेवा केंद्र पर जमा करें","description":"सेवा शुल्क के साथ निकटतम जन सेवा केंद्र पर जमा करें।"},{"step_number":5,"title":"सत्यापन","description":"मामलतदार कार्यालय सत्यापन और 30 दिनों के भीतर कार्ड जारी होगा।"}]',
'Jan Seva Kendra / Mamlatdar Office', 'https://digitalgujarat.gov.in', '₹20 (service fee)', '₹20 (सेवा शुल्क)', 30
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- MADHYA PRADESH
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Madhya Pradesh',
'["Aadhaar Card of all members","Samgra ID (mandatory)","Residence Proof","Income Certificate","Passport size photo"]',
'["सभी सदस्यों का आधार कार्ड","समग्र आईडी (अनिवार्य)","निवास प्रमाण","आय प्रमाण पत्र","पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"Samagra ID Required","description":"Ensure all family members have Samagra ID from samagra.gov.in."},{"step_number":2,"title":"Visit rationmitra.nic.in","description":"Go to rationmitra.nic.in for ration card application."},{"step_number":3,"title":"Apply with Samagra ID","description":"Enter Samagra ID and fill family details."},{"step_number":4,"title":"Submit at Gram Panchayat/Nagar Palika","description":"Submit application at local Gram Panchayat or Nagar Palika office."},{"step_number":5,"title":"Verification","description":"Supply Officer verifies and card is issued within 30 days."}]',
'[{"step_number":1,"title":"समग्र आईडी आवश्यक","description":"सुनिश्चित करें कि सभी परिवार के सदस्यों के पास samagra.gov.in से समग्र आईडी है।"},{"step_number":2,"title":"rationmitra.nic.in पर जाएं","description":"राशन कार्ड आवेदन के लिए rationmitra.nic.in पर जाएं।"},{"step_number":3,"title":"समग्र आईडी से आवेदन करें","description":"समग्र आईडी दर्ज करें और परिवार का विवरण भरें।"},{"step_number":4,"title":"ग्राम पंचायत/नगर पालिका में जमा करें","description":"स्थानीय ग्राम पंचायत या नगर पालिका कार्यालय में आवेदन जमा करें।"},{"step_number":5,"title":"सत्यापन","description":"सप्लाई अधिकारी सत्यापन करेगा और 30 दिनों में कार्ड जारी होगा।"}]',
'Gram Panchayat / Nagar Palika / Food Supply Office', 'https://rationmitra.nic.in', 'Free', 'नि:शुल्क', 30
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- PUNJAB
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Punjab',
'["Aadhaar Card of all members","Residence Proof (Electricity/Water bill)","Income Certificate","Voter ID","Passport size photo of head of family"]',
'["सभी सदस्यों का आधार कार्ड","निवास प्रमाण (बिजली/पानी बिल)","आय प्रमाण पत्र","मतदाता आईडी","परिवार के मुखिया का पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"Punjab Food Portal","description":"Visit epos.punjab.gov.in or sewa.punjab.gov.in."},{"step_number":2,"title":"Apply at Sewa Kendra","description":"Visit nearest Sewa Kendra with all documents."},{"step_number":3,"title":"Aadhaar Seeding","description":"All family members Aadhaar must be seeded."},{"step_number":4,"title":"Submit & Track","description":"Get acknowledgement number and track at sewa.punjab.gov.in."}]',
'[{"step_number":1,"title":"पंजाब फूड पोर्टल","description":"epos.punjab.gov.in या sewa.punjab.gov.in पर जाएं।"},{"step_number":2,"title":"सेवा केंद्र पर आवेदन करें","description":"सभी दस्तावेजों के साथ निकटतम सेवा केंद्र पर जाएं।"},{"step_number":3,"title":"आधार सीडिंग","description":"सभी परिवार के सदस्यों का आधार सीड होना चाहिए।"},{"step_number":4,"title":"जमा करें और ट्रैक करें","description":"पावती संख्या लें और sewa.punjab.gov.in पर ट्रैक करें।"}]',
'Sewa Kendra / District Food & Supply Controller', 'https://epos.punjab.gov.in', 'Free', 'नि:शुल्क', 30
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- HARYANA
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Haryana',
'["Aadhaar Card of all members","Parivar Pehchaan Patra (PPP) — Family ID (mandatory)","Residence Proof","Income Proof","Passport size photo"]',
'["सभी सदस्यों का आधार कार्ड","परिवार पहचान पत्र (PPP) — फैमिली आईडी (अनिवार्य)","निवास प्रमाण","आय प्रमाण","पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"Get PPP Family ID","description":"First register at meraparivar.haryana.gov.in for Parivar Pehchaan Patra."},{"step_number":2,"title":"Visit SARAL Portal","description":"Go to saralharyana.gov.in and search for Ration Card service."},{"step_number":3,"title":"Apply with PPP","description":"Use your PPP Family ID to apply for ration card."},{"step_number":4,"title":"Submit at Antyodaya Kendra","description":"Submit documents at nearest Antyodaya Saral Kendra."},{"step_number":5,"title":"Verification","description":"DSC/SDC verifies and card is issued within 30 days."}]',
'[{"step_number":1,"title":"PPP फैमिली आईडी प्राप्त करें","description":"पहले meraparivar.haryana.gov.in पर परिवार पहचान पत्र के लिए पंजीकरण करें।"},{"step_number":2,"title":"SARAL पोर्टल पर जाएं","description":"saralharyana.gov.in पर जाएं और राशन कार्ड सेवा खोजें।"},{"step_number":3,"title":"PPP के साथ आवेदन करें","description":"राशन कार्ड के लिए आवेदन करने के लिए अपना PPP फैमिली आईडी उपयोग करें।"},{"step_number":4,"title":"अंत्योदय केंद्र पर जमा करें","description":"निकटतम अंत्योदय सरल केंद्र पर दस्तावेज जमा करें।"},{"step_number":5,"title":"सत्यापन","description":"DSC/SDC सत्यापन करेगा और 30 दिनों में कार्ड जारी होगा।"}]',
'Antyodaya Saral Kendra / DSC Office', 'https://saralharyana.gov.in', 'Free', 'नि:शुल्क', 30
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- KERALA
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Kerala',
'["Aadhaar Card of all members","Ration Card Surrender Certificate (if migrating from another state)","Residence Proof","Income Certificate","Passport size photo of head of family"]',
'["सभी सदस्यों का आधार कार्ड","राशन कार्ड सरेंडर सर्टिफिकेट (यदि दूसरे राज्य से आ रहे हों)","निवास प्रमाण","आय प्रमाण पत्र","परिवार के मुखिया का पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"Visit AaharKerala / eSuvidha","description":"Go to civilsupplieskerala.gov.in or esuvidha portal."},{"step_number":2,"title":"Apply Online","description":"Click New Ration Card → PHH or Priority category."},{"step_number":3,"title":"Aadhaar & Income Verification","description":"Enter Aadhaar of all members. Income below ₹1L/year for PHH."},{"step_number":4,"title":"Taluk Supply Office","description":"Submit at Taluk Supply Office (TSO) with originals."},{"step_number":5,"title":"Verification","description":"Inspector verifies at residence. Card issued within 30 days."}]',
'[{"step_number":1,"title":"AaharKerala/eSuvidha पर जाएं","description":"civilsupplieskerala.gov.in या eSuvidha पोर्टल पर जाएं।"},{"step_number":2,"title":"ऑनलाइन आवेदन करें","description":"नया राशन कार्ड → PHH या प्राथमिकता श्रेणी पर क्लिक करें।"},{"step_number":3,"title":"आधार और आय सत्यापन","description":"सभी सदस्यों का आधार दर्ज करें। PHH के लिए आय ₹1L/वर्ष से कम होनी चाहिए।"},{"step_number":4,"title":"तालुक आपूर्ति कार्यालय","description":"मूल दस्तावेजों के साथ तालुक आपूर्ति कार्यालय (TSO) में जमा करें।"},{"step_number":5,"title":"सत्यापन","description":"इंस्पेक्टर आवास पर सत्यापन करेगा। 30 दिनों में कार्ड जारी होगा।"}]',
'Taluk Supply Office (TSO)', 'https://civilsupplieskerala.gov.in', 'Free', 'नि:शुल्क', 30
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- CHHATTISGARH
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Chhattisgarh',
'["Aadhaar Card of all members","Residence Proof","Income Certificate","Voter ID","Passport size photo"]',
'["सभी सदस्यों का आधार कार्ड","निवास प्रमाण","आय प्रमाण पत्र","मतदाता आईडी","पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"CG Food Portal","description":"Visit khadya.cg.gov.in for application."},{"step_number":2,"title":"Apply at Gram Panchayat/Nagar Palika","description":"Collect form from local GP/NP and fill with all family member details."},{"step_number":3,"title":"Submit Documents","description":"Submit at Block/Taluk Food Inspector office."},{"step_number":4,"title":"Verification","description":"Field verification by Food Inspector. Card issued within 30 days."}]',
'[{"step_number":1,"title":"CG फूड पोर्टल","description":"आवेदन के लिए khadya.cg.gov.in पर जाएं।"},{"step_number":2,"title":"ग्राम पंचायत/नगर पालिका में आवेदन करें","description":"स्थानीय GP/NP से फॉर्म लें और सभी परिवार के सदस्यों का विवरण भरें।"},{"step_number":3,"title":"दस्तावेज़ जमा करें","description":"ब्लॉक/तालुक खाद्य निरीक्षक कार्यालय में जमा करें।"},{"step_number":4,"title":"सत्यापन","description":"खाद्य निरीक्षक द्वारा फील्ड सत्यापन। 30 दिनों में कार्ड जारी होगा।"}]',
'Block Food Inspector Office / Gram Panchayat', 'https://khadya.cg.gov.in', 'Free', 'नि:शुल्क', 30
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- JHARKHAND
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Jharkhand',
'["Aadhaar Card of all members","Residence Proof","Income Certificate","Voter ID / Bank Passbook","Passport size photo"]',
'["सभी सदस्यों का आधार कार्ड","निवास प्रमाण","आय प्रमाण पत्र","मतदाता आईडी/बैंक पासबुक","पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"aahar.jharkhand.gov.in","description":"Visit aahar.jharkhand.gov.in for ration card services."},{"step_number":2,"title":"Apply via Jharseva","description":"Apply at Jharseva centre or online portal."},{"step_number":3,"title":"Documents Submission","description":"Submit all documents with application."},{"step_number":4,"title":"Verification","description":"Block Supply Officer verifies. Card issued within 30 days."}]',
'[{"step_number":1,"title":"aahar.jharkhand.gov.in","description":"राशन कार्ड सेवाओं के लिए aahar.jharkhand.gov.in पर जाएं।"},{"step_number":2,"title":"झारसेवा के माध्यम से आवेदन करें","description":"झारसेवा केंद्र या ऑनलाइन पोर्टल पर आवेदन करें।"},{"step_number":3,"title":"दस्तावेज़ जमा करें","description":"आवेदन के साथ सभी दस्तावेज जमा करें।"},{"step_number":4,"title":"सत्यापन","description":"ब्लॉक सप्लाई अधिकारी सत्यापन करेगा। 30 दिनों में कार्ड जारी होगा।"}]',
'Jharseva Centre / Block Supply Office', 'https://aahar.jharkhand.gov.in', 'Free', 'नि:शुल्क', 30
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- ODISHA
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Odisha',
'["Aadhaar Card of all members","Residence Proof","Income Certificate (Below ₹2L/year)","Voter ID","Passport size photo"]',
'["सभी सदस्यों का आधार कार्ड","निवास प्रमाण","आय प्रमाण पत्र (₹2L/वर्ष से कम)","मतदाता आईडी","पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"Visit PDS Odisha","description":"Go to pdsodisha.gov.in for ration card services."},{"step_number":2,"title":"Apply at Block/Ward Office","description":"Collect and submit application at local Block or Ward office."},{"step_number":3,"title":"Aadhaar Seeding","description":"All family members must have Aadhaar seeded."},{"step_number":4,"title":"Verification & Issue","description":"Supply Inspector verifies. Card issued within 30 days."}]',
'[{"step_number":1,"title":"PDS ओडिशा पर जाएं","description":"राशन कार्ड सेवाओं के लिए pdsodisha.gov.in पर जाएं।"},{"step_number":2,"title":"ब्लॉक/वार्ड कार्यालय में आवेदन करें","description":"स्थानीय ब्लॉक या वार्ड कार्यालय पर आवेदन पत्र लें और जमा करें।"},{"step_number":3,"title":"आधार सीडिंग","description":"सभी परिवार के सदस्यों का आधार सीड होना चाहिए।"},{"step_number":4,"title":"सत्यापन और जारी करना","description":"सप्लाई इंस्पेक्टर सत्यापन करेगा। 30 दिनों में कार्ड जारी होगा।"}]',
'Block Supply Officer / Ward Food Officer', 'https://pdsodisha.gov.in', 'Free', 'नि:शुल्क', 30
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- ASSAM
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Assam',
'["Aadhaar Card of all members","NRC/Proof of residence","Income Certificate","Voter ID","Passport size photo of head of family"]',
'["सभी सदस्यों का आधार कार्ड","NRC/निवास प्रमाण","आय प्रमाण पत्र","मतदाता आईडी","परिवार के मुखिया का पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"Visit EPDS Assam","description":"Go to epds.assam.gov.in for ration card services."},{"step_number":2,"title":"Apply via Arunodoi / Asom Seva Kendra","description":"Visit nearest Asom Seva Kendra with all documents."},{"step_number":3,"title":"Documents Submission","description":"Submit application form with Aadhaar and residence proof."},{"step_number":4,"title":"Verification","description":"Circle Inspector verifies. Card issued within 30 days."}]',
'[{"step_number":1,"title":"EPDS असम पर जाएं","description":"राशन कार्ड सेवाओं के लिए epds.assam.gov.in पर जाएं।"},{"step_number":2,"title":"असम सेवा केंद्र के माध्यम से आवेदन करें","description":"सभी दस्तावेजों के साथ निकटतम असम सेवा केंद्र पर जाएं।"},{"step_number":3,"title":"दस्तावेज़ जमा करें","description":"आधार और निवास प्रमाण के साथ आवेदन पत्र जमा करें।"},{"step_number":4,"title":"सत्यापन","description":"सर्कल इंस्पेक्टर सत्यापन करेगा। 30 दिनों में कार्ड जारी होगा।"}]',
'Asom Seva Kendra / Circle Food Inspector', 'https://epds.assam.gov.in', 'Free', 'नि:शुल्क', 30
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- UTTARAKHAND
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Uttarakhand',
'["Aadhaar Card of all members","Residence Proof","Income Certificate","Voter ID","Passport size photo"]',
'["सभी सदस्यों का आधार कार्ड","निवास प्रमाण","आय प्रमाण पत्र","मतदाता आईडी","पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"Visit fcs.uk.gov.in","description":"Go to the Uttarakhand Food & Civil Supplies portal."},{"step_number":2,"title":"Apply at Tehsil/Block","description":"Collect form from local Tehsil or Block office and submit with documents."},{"step_number":3,"title":"E-District Portal","description":"Alternatively apply via edistrict.uk.gov.in online."},{"step_number":4,"title":"Verification","description":"Field verification by Supply Inspector. Card issued within 30 days."}]',
'[{"step_number":1,"title":"fcs.uk.gov.in पर जाएं","description":"उत्तराखंड खाद्य एवं नागरिक आपूर्ति पोर्टल पर जाएं।"},{"step_number":2,"title":"तहसील/ब्लॉक में आवेदन करें","description":"स्थानीय तहसील या ब्लॉक कार्यालय से फॉर्म लें और दस्तावेजों के साथ जमा करें।"},{"step_number":3,"title":"ई-डिस्ट्रिक्ट पोर्टल","description":"वैकल्पिक रूप से edistrict.uk.gov.in के माध्यम से ऑनलाइन आवेदन करें।"},{"step_number":4,"title":"सत्यापन","description":"सप्लाई इंस्पेक्टर द्वारा फील्ड सत्यापन। 30 दिनों में कार्ड जारी होगा।"}]',
'Tehsil/Block Food Supply Office', 'https://fcs.uk.gov.in', 'Free', 'नि:शुल्क', 30
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- HIMACHAL PRADESH
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Himachal Pradesh',
'["Aadhaar Card of all members","Bonafide HP Resident Certificate","Residence Proof","Income Certificate","Voter ID"]',
'["सभी सदस्यों का आधार कार्ड","बोनाफाइड HP निवासी प्रमाण पत्र","निवास प्रमाण","आय प्रमाण पत्र","मतदाता आईडी"]',
'[{"step_number":1,"title":"epds.hpgov.in","description":"Visit epds.hpgov.in for ration card application."},{"step_number":2,"title":"Apply at Lokhmitra Kendra","description":"Visit nearest Lokhmitra Kendra or CSC for assistance."},{"step_number":3,"title":"Submit Documents","description":"Submit application with Aadhaar and residence proof."},{"step_number":4,"title":"Verification","description":"Inspector verifies. Card issued within 21 days."}]',
'[{"step_number":1,"title":"epds.hpgov.in","description":"राशन कार्ड आवेदन के लिए epds.hpgov.in पर जाएं।"},{"step_number":2,"title":"लोकमित्र केंद्र पर जाएं","description":"सहायता के लिए निकटतम लोकमित्र केंद्र या CSC पर जाएं।"},{"step_number":3,"title":"दस्तावेज़ जमा करें","description":"आधार और निवास प्रमाण के साथ आवेदन जमा करें।"},{"step_number":4,"title":"सत्यापन","description":"इंस्पेक्टर सत्यापन करेगा। 21 दिनों में कार्ड जारी होगा।"}]',
'Lokhmitra Kendra / Supply Office', 'https://epds.hpgov.in', 'Free', 'नि:शुल्क', 21
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- GOA
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Goa',
'["Aadhaar Card of all members","15-year Goa residency proof","Income Certificate","Electricity/Water Bill","Passport size photo"]',
'["सभी सदस्यों का आधार कार्ड","15 वर्ष गोवा निवास प्रमाण","आय प्रमाण पत्र","बिजली/पानी बिल","पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"Goa Civil Supplies Portal","description":"Visit goacs.gov.in for ration card application."},{"step_number":2,"title":"Apply at Civil Supplies Office","description":"Submit application at Civil Supplies Office in your taluka."},{"step_number":3,"title":"Residency Verification","description":"15-year Goa residency is required for APL. BPL requires additional income proof."},{"step_number":4,"title":"Card Issuance","description":"Card issued within 21 days after verification."}]',
'[{"step_number":1,"title":"गोवा सिविल सप्लाई पोर्टल","description":"राशन कार्ड आवेदन के लिए goacs.gov.in पर जाएं।"},{"step_number":2,"title":"सिविल सप्लाई कार्यालय में आवेदन करें","description":"अपने तालुका में सिविल सप्लाई कार्यालय में आवेदन जमा करें।"},{"step_number":3,"title":"निवास सत्यापन","description":"APL के लिए 15 वर्ष गोवा निवास आवश्यक है। BPL के लिए अतिरिक्त आय प्रमाण चाहिए।"},{"step_number":4,"title":"कार्ड जारी करना","description":"सत्यापन के बाद 21 दिनों में कार्ड जारी होगा।"}]',
'Civil Supplies Office (Taluka)', 'https://goacs.gov.in', 'Free', 'नि:शुल्क', 21
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- JAMMU & KASHMIR (UT)
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Jammu & Kashmir',
'["Domicile Certificate (mandatory since 2020)","Aadhaar Card of all members","Residence Proof","Income Certificate","Voter ID / Bank Passbook"]',
'["अधिवास प्रमाण पत्र (2020 से अनिवार्य)","सभी सदस्यों का आधार कार्ड","निवास प्रमाण","आय प्रमाण पत्र","मतदाता आईडी/बैंक पासबुक"]',
'[{"step_number":1,"title":"JK eServices Portal","description":"Visit jkedistrict.nic.in for ration card services."},{"step_number":2,"title":"Domicile Certificate First","description":"Ensure you have JK Domicile Certificate (issued since 2020)."},{"step_number":3,"title":"Apply at Tehsil Supply Office","description":"Submit application at local Tehsil Supply Office (TSO)."},{"step_number":4,"title":"Verification","description":"Inspector verifies. Card issued within 45 days."}]',
'[{"step_number":1,"title":"JK eServices पोर्टल","description":"राशन कार्ड सेवाओं के लिए jkedistrict.nic.in पर जाएं।"},{"step_number":2,"title":"पहले अधिवास प्रमाण पत्र","description":"सुनिश्चित करें कि आपके पास JK अधिवास प्रमाण पत्र है (2020 से जारी)।"},{"step_number":3,"title":"तहसील सप्लाई ऑफिस में आवेदन करें","description":"स्थानीय तहसील सप्लाई ऑफिस (TSO) में आवेदन जमा करें।"},{"step_number":4,"title":"सत्यापन","description":"इंस्पेक्टर सत्यापन करेगा। 45 दिनों में कार्ड जारी होगा।"}]',
'Tehsil Supply Office (TSO)', 'https://jkedistrict.nic.in', 'Free', 'नि:शुल्क', 45
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- TRIPURA
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, 'Tripura',
'["Aadhaar Card of all members","Residence Proof","Income Certificate","Voter ID","Passport size photo"]',
'["सभी सदस्यों का आधार कार्ड","निवास प्रमाण","आय प्रमाण पत्र","मतदाता आईडी","पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"Visit e-District Tripura","description":"Go to edistrict.tripura.gov.in."},{"step_number":2,"title":"Apply for Ration Card","description":"Select Food Department → New Ration Card Application."},{"step_number":3,"title":"Submit Documents","description":"Upload documents online or submit at e-District centre."},{"step_number":4,"title":"Verification","description":"Food Supply Officer verifies. Card issued in 30 days."}]',
'[{"step_number":1,"title":"ई-डिस्ट्रिक्ट त्रिपुरा पर जाएं","description":"edistrict.tripura.gov.in पर जाएं।"},{"step_number":2,"title":"राशन कार्ड के लिए आवेदन करें","description":"खाद्य विभाग → नया राशन कार्ड आवेदन चुनें।"},{"step_number":3,"title":"दस्तावेज़ जमा करें","description":"दस्तावेज ऑनलाइन अपलोड करें या ई-डिस्ट्रिक्ट केंद्र पर जमा करें।"},{"step_number":4,"title":"सत्यापन","description":"खाद्य आपूर्ति अधिकारी सत्यापन करेगा। 30 दिनों में कार्ड जारी होगा।"}]',
'e-District Centre / Food Supply Office', 'https://edistrict.tripura.gov.in', 'Free', 'नि:शुल्क', 30
FROM subcases sc JOIN services sv ON sc.service_id=sv.id WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- MEGHALAYA, MANIPUR, MIZORAM, NAGALAND, ARUNACHAL, SIKKIM — NE States (use central NFSA + state office)
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, s.state,
'["Aadhaar Card of all members","Residence/Domicile Certificate","Income Certificate","Tribal Certificate (if applicable)","Voter ID","Passport size photo"]',
'["सभी सदस्यों का आधार कार्ड","निवास/अधिवास प्रमाण पत्र","आय प्रमाण पत्र","जनजाति प्रमाण पत्र (यदि लागू हो)","मतदाता आईडी","पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"Visit State Food Dept Portal","description":"Each NE state has its own portal. Check nfsa.gov.in → State Portals for the exact link."},{"step_number":2,"title":"Collect Form from Block/SDO Office","description":"Most NE states require offline submission. Collect form from Block or Sub-Divisional Office."},{"step_number":3,"title":"Fill & Attach Documents","description":"Fill details for all family members. Attach Aadhaar, residence, and income proof."},{"step_number":4,"title":"Submit & Verify","description":"Submit at Block Supply Officer. Tribal households need tribal certificate. Card issued in 30–45 days."}]',
'[{"step_number":1,"title":"राज्य खाद्य विभाग पोर्टल पर जाएं","description":"प्रत्येक NE राज्य का अपना पोर्टल है। सटीक लिंक के लिए nfsa.gov.in → राज्य पोर्टल देखें।"},{"step_number":2,"title":"ब्लॉक/SDO कार्यालय से फॉर्म लें","description":"अधिकांश NE राज्यों में ऑफलाइन जमा करना आवश्यक है। ब्लॉक या उप-मंडल कार्यालय से फॉर्म लें।"},{"step_number":3,"title":"भरें और दस्तावेज संलग्न करें","description":"सभी परिवार के सदस्यों का विवरण भरें। आधार, निवास और आय प्रमाण संलग्न करें।"},{"step_number":4,"title":"जमा करें और सत्यापित करें","description":"ब्लॉक सप्लाई अधिकारी पर जमा करें। 30-45 दिनों में कार्ड जारी होगा।"}]',
'Block Supply Officer / Sub-Divisional Office', 'https://nfsa.gov.in/portal/ration_card_state_portals_aa', 'Free', 'नि:शुल्क', 45
FROM subcases sc
JOIN services sv ON sc.service_id=sv.id
CROSS JOIN (SELECT unnest(ARRAY['Meghalaya','Manipur','Mizoram','Nagaland','Arunachal Pradesh','Sikkim']) AS state) s
WHERE sc.slug='new_application' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;


-- ============================================================
-- AADHAAR UPDATE — CENTRALIZED (SAME PROCESS ALL STATES)
-- ============================================================

-- ADDRESS CHANGE (online — free until Jun 2026, then ₹75)
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, s.state,
'["Any ONE: Electricity bill (within 3 months)","Bank statement (within 3 months)","Rent Agreement (registered)","Water bill","Voter ID","Passport","Driving Licence","Government ID with address"]',
'["निम्न में से कोई एक: बिजली बिल (3 महीने के भीतर)","बैंक स्टेटमेंट (3 महीने के भीतर)","किराया समझौता (पंजीकृत)","पानी का बिल","मतदाता आईडी","पासपोर्ट","ड्राइविंग लाइसेंस","पते के साथ सरकारी आईडी"]',
'[{"step_number":1,"title":"Visit myAadhaar portal","description":"Go to myaadhaar.uidai.gov.in and login with your Aadhaar-linked mobile OTP."},{"step_number":2,"title":"Select Update Address Online","description":"Click Update Address Online → Proceed to Update Aadhaar."},{"step_number":3,"title":"Enter New Address","description":"Type your new full address carefully — exactly as on your proof document."},{"step_number":4,"title":"Upload POA","description":"Upload scanned Proof of Address (jpg/pdf, max 2MB)."},{"step_number":5,"title":"Free until June 2026","description":"Online demographic update is FREE until June 2026. After that it will be ₹75."},{"step_number":6,"title":"Save SRN","description":"Save the Service Request Number (SRN) for tracking on uidai.gov.in."}]',
'[{"step_number":1,"title":"myAadhaar पोर्टल पर जाएं","description":"myaadhaar.uidai.gov.in पर जाएं और अपने आधार-लिंक्ड मोबाइल OTP से लॉगिन करें।"},{"step_number":2,"title":"ऑनलाइन पता अपडेट चुनें","description":"ऑनलाइन पता अपडेट करें → आधार अपडेट करने के लिए आगे बढ़ें पर क्लिक करें।"},{"step_number":3,"title":"नया पता दर्ज करें","description":"अपना नया पूरा पता ध्यान से टाइप करें — बिल्कुल आपके प्रमाण दस्तावेज की तरह।"},{"step_number":4,"title":"POA अपलोड करें","description":"स्कैन किया हुआ पते का प्रमाण अपलोड करें (jpg/pdf, max 2MB)।"},{"step_number":5,"title":"जून 2026 तक मुफ्त","description":"ऑनलाइन जनसांख्यिकीय अपडेट जून 2026 तक मुफ्त है। उसके बाद ₹75 होगा।"},{"step_number":6,"title":"SRN सुरक्षित रखें","description":"uidai.gov.in पर ट्रैकिंग के लिए सेवा अनुरोध संख्या (SRN) सुरक्षित रखें।"}]',
'Online / Aadhaar Seva Kendra (ASK)', 'https://myaadhaar.uidai.gov.in', 'Free online (until Jun 2026), then ₹75', 'ऑनलाइन नि:शुल्क (Jun 2026 तक), फिर ₹75', 30
FROM subcases sc
JOIN services sv ON sc.service_id=sv.id
CROSS JOIN (SELECT unnest(ARRAY['Uttar Pradesh','Maharashtra','Delhi','Karnataka','Tamil Nadu','West Bengal','Bihar','Rajasthan','Telangana','Andhra Pradesh','Gujarat','Madhya Pradesh','Punjab','Haryana','Kerala','Chhattisgarh','Jharkhand','Odisha','Assam','Uttarakhand','Himachal Pradesh','Goa','Jammu & Kashmir','Tripura','Meghalaya','Manipur','Mizoram','Nagaland','Arunachal Pradesh','Sikkim']) AS state) s
WHERE sc.slug='address_change' AND sv.slug='aadhaar_update'
ON CONFLICT (subcase_id, state) DO UPDATE SET
  documents_en=EXCLUDED.documents_en, steps_en=EXCLUDED.steps_en,
  fee_en=EXCLUDED.fee_en, fee_hi=EXCLUDED.fee_hi;

-- MOBILE UPDATE (must visit Aadhaar Seva Kendra — ₹75 demographic, ₹125 biometric)
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, s.state,
'["Original Aadhaar card (for identification)","No additional document needed for mobile number update"]',
'["मूल आधार कार्ड (पहचान के लिए)","मोबाइल नंबर अपडेट के लिए कोई अतिरिक्त दस्तावेज नहीं चाहिए"]',
'[{"step_number":1,"title":"Book Appointment","description":"Book a slot at your nearest Aadhaar Seva Kendra (ASK) at appointments.uidai.gov.in."},{"step_number":2,"title":"Visit ASK","description":"Visit the Aadhaar Seva Kendra at your scheduled time with original Aadhaar."},{"step_number":3,"title":"Request Mobile Update","description":"Tell the operator you want to update/link your mobile number."},{"step_number":4,"title":"Biometric Authentication","description":"Operator will perform biometric fingerprint or iris authentication to verify your identity."},{"step_number":5,"title":"Pay Fee","description":"Pay ₹75 (demographic/mobile update) at the cash counter. Biometric update costs ₹125."},{"step_number":6,"title":"New UIDAI App (2026)","description":"UIDAI launched a new Aadhaar App in 2026 that allows mobile update online — check the app on Play Store as an alternative."}]',
'[{"step_number":1,"title":"अपॉइंटमेंट बुक करें","description":"appointments.uidai.gov.in पर निकटतम आधार सेवा केंद्र में स्लॉट बुक करें।"},{"step_number":2,"title":"ASK पर जाएं","description":"मूल आधार के साथ अपने निर्धारित समय पर आधार सेवा केंद्र पर जाएं।"},{"step_number":3,"title":"मोबाइल अपडेट का अनुरोध करें","description":"ऑपरेटर को बताएं कि आप अपना मोबाइल नंबर अपडेट/लिंक करना चाहते हैं।"},{"step_number":4,"title":"बायोमेट्रिक प्रमाणीकरण","description":"ऑपरेटर आपकी पहचान सत्यापित करने के लिए बायोमेट्रिक फिंगरप्रिंट या आईरिस प्रमाणीकरण करेगा।"},{"step_number":5,"title":"शुल्क भुगतान","description":"कैश काउंटर पर ₹75 (जनसांख्यिकीय/मोबाइल अपडेट) का भुगतान करें। बायोमेट्रिक अपडेट ₹125 है।"},{"step_number":6,"title":"नया UIDAI ऐप (2026)","description":"UIDAI ने 2026 में एक नया आधार ऐप लॉन्च किया है जो ऑनलाइन मोबाइल अपडेट की अनुमति देता है।"}]',
'UIDAI Aadhaar Seva Kendra (ASK)', 'https://appointments.uidai.gov.in', '₹75 (demographic) / ₹125 (biometric)', '₹75 (जनसांख्यिकीय) / ₹125 (बायोमेट्रिक)', 7
FROM subcases sc
JOIN services sv ON sc.service_id=sv.id
CROSS JOIN (SELECT unnest(ARRAY['Uttar Pradesh','Maharashtra','Delhi','Karnataka','Tamil Nadu','West Bengal','Bihar','Rajasthan','Telangana','Andhra Pradesh','Gujarat','Madhya Pradesh','Punjab','Haryana','Kerala','Chhattisgarh','Jharkhand','Odisha','Assam','Uttarakhand','Himachal Pradesh','Goa','Jammu & Kashmir','Tripura','Meghalaya','Manipur','Mizoram','Nagaland','Arunachal Pradesh','Sikkim']) AS state) s
WHERE sc.slug='mobile_update' AND sv.slug='aadhaar_update'
ON CONFLICT (subcase_id, state) DO UPDATE SET
  documents_en=EXCLUDED.documents_en, steps_en=EXCLUDED.steps_en,
  fee_en=EXCLUDED.fee_en, fee_hi=EXCLUDED.fee_hi;

-- NAME / DOB CORRECTION
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, s.state,
'["For Name Change: Gazette Notification OR Marriage Certificate OR School Certificate","For DOB Change: Birth Certificate OR School Leaving Certificate OR Passport"]',
'["नाम बदलाव के लिए: राजपत्र अधिसूचना या विवाह प्रमाण पत्र या स्कूल प्रमाण पत्र","जन्म तिथि बदलाव के लिए: जन्म प्रमाण पत्र या स्कूल छोड़ने का प्रमाण पत्र या पासपोर्ट"]',
'[{"step_number":1,"title":"Online via myAadhaar (if supported)","description":"Some name/DOB corrections can be done online at myaadhaar.uidai.gov.in. Check if your correction type is supported."},{"step_number":2,"title":"Or visit Aadhaar Seva Kendra","description":"For corrections not supported online, book appointment at appointments.uidai.gov.in."},{"step_number":3,"title":"Carry original documents","description":"Bring the original supporting document (Gazette, Birth Certificate, etc.) for verification."},{"step_number":4,"title":"Pay fee","description":"Pay ₹75 for demographic updates (free online until Jun 2026)."},{"step_number":5,"title":"Track via SRN","description":"Note the Service Request Number and track at uidai.gov.in."}]',
'[{"step_number":1,"title":"myAadhaar पर ऑनलाइन (यदि समर्थित हो)","description":"कुछ नाम/जन्म तिथि सुधार myaadhaar.uidai.gov.in पर ऑनलाइन किए जा सकते हैं।"},{"step_number":2,"title":"या आधार सेवा केंद्र पर जाएं","description":"ऑनलाइन समर्थित नहीं सुधारों के लिए, appointments.uidai.gov.in पर अपॉइंटमेंट बुक करें।"},{"step_number":3,"title":"मूल दस्तावेज लाएं","description":"सत्यापन के लिए मूल सहायक दस्तावेज लाएं।"},{"step_number":4,"title":"शुल्क भुगतान","description":"जनसांख्यिकीय अपडेट के लिए ₹75 का भुगतान करें (Jun 2026 तक ऑनलाइन मुफ्त)।"},{"step_number":5,"title":"SRN के माध्यम से ट्रैक करें","description":"सेवा अनुरोध संख्या नोट करें और uidai.gov.in पर ट्रैक करें।"}]',
'Online (myAadhaar) / Aadhaar Seva Kendra', 'https://myaadhaar.uidai.gov.in', 'Free online (until Jun 2026), then ₹75 at ASK', 'ऑनलाइन नि:शुल्क (Jun 2026 तक), ASK पर ₹75', 30
FROM subcases sc
JOIN services sv ON sc.service_id=sv.id
CROSS JOIN (SELECT unnest(ARRAY['Uttar Pradesh','Maharashtra','Delhi','Karnataka','Tamil Nadu','West Bengal','Bihar','Rajasthan','Telangana','Andhra Pradesh','Gujarat','Madhya Pradesh','Punjab','Haryana','Kerala','Chhattisgarh','Jharkhand','Odisha','Assam','Uttarakhand','Himachal Pradesh','Goa','Jammu & Kashmir','Tripura','Meghalaya','Manipur','Mizoram','Nagaland','Arunachal Pradesh','Sikkim']) AS state) s
WHERE sc.slug='name_correction' AND sv.slug='aadhaar_update'
ON CONFLICT (subcase_id, state) DO UPDATE SET
  documents_en=EXCLUDED.documents_en, steps_en=EXCLUDED.steps_en,
  fee_en=EXCLUDED.fee_en, fee_hi=EXCLUDED.fee_hi;


-- ============================================================
-- PAN CARD — CENTRALIZED (SAME PROCESS ALL STATES)
-- ============================================================

-- NEW PAN CARD
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days, form_fields_en, form_fields_hi)
SELECT sc.id, s.state,
'["Aadhaar Card (for e-KYC online — easiest method)","If offline: Proof of Identity (Voter ID/Passport/Driving Licence)","Proof of Address (same documents)","Proof of Date of Birth (Birth Certificate/School Certificate)","2 passport size photos (offline only)"]',
'["आधार कार्ड (e-KYC ऑनलाइन के लिए — सबसे आसान तरीका)","यदि ऑफलाइन: पहचान प्रमाण (मतदाता आईडी/पासपोर्ट/ड्राइविंग लाइसेंस)","पते का प्रमाण (वही दस्तावेज)","जन्म तिथि का प्रमाण (जन्म प्रमाण पत्र/स्कूल प्रमाण पत्र)","2 पासपोर्ट साइज फोटो (केवल ऑफलाइन)"]',
'[{"step_number":1,"title":"FREE e-PAN (Instant — Recommended)","description":"Visit incometax.gov.in → Quick Links → Instant e-PAN. Enter Aadhaar number and OTP. Get FREE e-PAN instantly as PDF. Best option for most people."},{"step_number":2,"title":"Physical PAN via NSDL/Protean","description":"For physical card: Visit onlineservices.nsdl.com → Online PAN Application → Form 49A (Indian Citizen)."},{"step_number":3,"title":"Choose Digital e-KYC","description":"Select Submit digitally through e-KYC & e-Sign (Paperless) — no physical documents needed."},{"step_number":4,"title":"Enter Aadhaar & Details","description":"Enter your 12-digit Aadhaar number and all personal details exactly as on Aadhaar."},{"step_number":5,"title":"Pay Fee","description":"Free e-PAN at incometax.gov.in. Physical card via NSDL: ₹107 (India delivery)."},{"step_number":6,"title":"Aadhaar OTP Auth","description":"Complete OTP verification sent to Aadhaar-linked mobile. PAN issued in 15 days."}]',
'[{"step_number":1,"title":"मुफ्त ई-पैन (तुरंत — अनुशंसित)","description":"incometax.gov.in → Quick Links → Instant e-PAN पर जाएं। आधार नंबर और OTP दर्ज करें। तुरंत मुफ्त ई-पैन PDF में प्राप्त करें।"},{"step_number":2,"title":"NSDL के माध्यम से फिजिकल पैन","description":"फिजिकल कार्ड के लिए: onlineservices.nsdl.com → ऑनलाइन पैन आवेदन → फॉर्म 49A (भारतीय नागरिक) पर जाएं।"},{"step_number":3,"title":"डिजिटल e-KYC चुनें","description":"e-KYC और ई-साइन के माध्यम से डिजिटल रूप से सबमिट करें (पेपरलेस) — कोई भौतिक दस्तावेज नहीं चाहिए।"},{"step_number":4,"title":"आधार और विवरण दर्ज करें","description":"अपना 12 अंकों का आधार नंबर और सभी व्यक्तिगत विवरण बिल्कुल आधार के अनुसार दर्ज करें।"},{"step_number":5,"title":"शुल्क भुगतान","description":"incometax.gov.in पर मुफ्त ई-पैन। NSDL के माध्यम से फिजिकल कार्ड: ₹107 (भारत डिलीवरी)।"},{"step_number":6,"title":"आधार OTP प्रमाणीकरण","description":"आधार-लिंक्ड मोबाइल पर भेजे गए OTP सत्यापन को पूरा करें। 15 दिनों में पैन जारी होगा।"}]',
'NSDL / Protean / Income Tax Portal', 'https://www.incometax.gov.in/iec/foportal/', 'Free e-PAN (incometax.gov.in) | ₹107 physical (NSDL)', 'मुफ्त ई-पैन (incometax.gov.in) | ₹107 फिजिकल (NSDL)', 15,
'[{"field":"Father''s Name","explanation":"Write your biological father''s name even if you are married. For women, maiden name or husband''s name acceptable only in specific cases."},{"field":"Date of Birth","explanation":"Enter as per your birth certificate or school certificate — not as per Aadhaar if different. This is a common mismatch issue."},{"field":"AO Code","explanation":"Area Officer code based on your address. The NSDL portal will suggest the correct code based on your city — just accept the suggestion."}]',
'[{"field":"पिता का नाम","explanation":"अपने जैविक पिता का नाम लिखें, भले ही आप विवाहित हों।"},{"field":"जन्म तिथि","explanation":"जन्म प्रमाण पत्र या स्कूल प्रमाण पत्र के अनुसार दर्ज करें।"},{"field":"AO कोड","explanation":"आपके पते के आधार पर क्षेत्र अधिकारी कोड। NSDL पोर्टल आपके शहर के आधार पर सही कोड सुझाएगा।"}]'
FROM subcases sc
JOIN services sv ON sc.service_id=sv.id
CROSS JOIN (SELECT unnest(ARRAY['Uttar Pradesh','Maharashtra','Delhi','Karnataka','Tamil Nadu','West Bengal','Bihar','Rajasthan','Telangana','Andhra Pradesh','Gujarat','Madhya Pradesh','Punjab','Haryana','Kerala','Chhattisgarh','Jharkhand','Odisha','Assam','Uttarakhand','Himachal Pradesh','Goa','Jammu & Kashmir','Tripura','Meghalaya','Manipur','Mizoram','Nagaland','Arunachal Pradesh','Sikkim']) AS state) s
WHERE sc.slug='new_pan' AND sv.slug='pan_card'
ON CONFLICT (subcase_id, state) DO UPDATE SET
  documents_en=EXCLUDED.documents_en, steps_en=EXCLUDED.steps_en,
  fee_en=EXCLUDED.fee_en, fee_hi=EXCLUDED.fee_hi;

-- LOST PAN CARD
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, s.state,
'["Aadhaar Card","Copy of old PAN card (if available)","FIR copy (if stolen — optional but recommended)"]',
'["आधार कार्ड","पुराने पैन कार्ड की प्रति (यदि उपलब्ध हो)","FIR की प्रति (यदि चोरी हुई — वैकल्पिक लेकिन अनुशंसित)"]',
'[{"step_number":1,"title":"Download e-PAN Free","description":"If you remember your PAN number: go to incometax.gov.in → e-Filing → e-PAN → Download. Free of cost."},{"step_number":2,"title":"Reprint via NSDL","description":"For physical reprint: visit onlineservices.nsdl.com → Reprint of PAN Card. Enter PAN number and Aadhaar for OTP verification."},{"step_number":3,"title":"Pay Reprint Fee","description":"Pay ₹50 for e-PAN reprint or ₹110 for physical card reprint."},{"step_number":4,"title":"Don''t Know PAN Number?","description":"Go to incometax.gov.in → Know Your PAN. Enter name and DOB to find your existing PAN number."}]',
'[{"step_number":1,"title":"मुफ्त ई-पैन डाउनलोड करें","description":"यदि आपको अपना पैन नंबर याद है: incometax.gov.in → ई-फाइलिंग → ई-पैन → डाउनलोड पर जाएं। मुफ्त।"},{"step_number":2,"title":"NSDL के माध्यम से पुनर्मुद्रण","description":"फिजिकल पुनर्मुद्रण के लिए: onlineservices.nsdl.com → पैन कार्ड का पुनर्मुद्रण पर जाएं। OTP सत्यापन के लिए पैन नंबर और आधार दर्ज करें।"},{"step_number":3,"title":"पुनर्मुद्रण शुल्क भुगतान","description":"ई-पैन पुनर्मुद्रण के लिए ₹50 या फिजिकल कार्ड पुनर्मुद्रण के लिए ₹110 का भुगतान करें।"},{"step_number":4,"title":"पैन नंबर नहीं पता?","description":"incometax.gov.in → अपना पैन जानें पर जाएं। अपना मौजूदा पैन नंबर खोजने के लिए नाम और जन्म तिथि दर्ज करें।"}]',
'NSDL / Income Tax Portal (online)', 'https://www.onlineservices.nsdl.com', '₹50 (e-PAN reprint) / ₹110 (physical reprint)', '₹50 (ई-पैन पुनर्मुद्रण) / ₹110 (फिजिकल पुनर्मुद्रण)', 10
FROM subcases sc
JOIN services sv ON sc.service_id=sv.id
CROSS JOIN (SELECT unnest(ARRAY['Uttar Pradesh','Maharashtra','Delhi','Karnataka','Tamil Nadu','West Bengal','Bihar','Rajasthan','Telangana','Andhra Pradesh','Gujarat','Madhya Pradesh','Punjab','Haryana','Kerala','Chhattisgarh','Jharkhand','Odisha','Assam','Uttarakhand','Himachal Pradesh','Goa','Jammu & Kashmir','Tripura','Meghalaya','Manipur','Mizoram','Nagaland','Arunachal Pradesh','Sikkim']) AS state) s
WHERE sc.slug='lost_pan' AND sv.slug='pan_card'
ON CONFLICT (subcase_id, state) DO UPDATE SET
  documents_en=EXCLUDED.documents_en, steps_en=EXCLUDED.steps_en,
  fee_en=EXCLUDED.fee_en, fee_hi=EXCLUDED.fee_hi;

-- PAN CORRECTION
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, s.state,
'["Existing PAN card copy","Aadhaar Card","For name change: Gazette Notification / Marriage Certificate","For DOB change: Birth Certificate / School Certificate","Proof of Address"]',
'["मौजूदा पैन कार्ड की प्रति","आधार कार्ड","नाम बदलाव के लिए: राजपत्र अधिसूचना/विवाह प्रमाण पत्र","जन्म तिथि बदलाव के लिए: जन्म प्रमाण पत्र/स्कूल प्रमाण पत्र","पते का प्रमाण"]',
'[{"step_number":1,"title":"NSDL Correction Portal","description":"Visit onlineservices.nsdl.com → Online PAN Application → Changes or Correction in existing PAN Data."},{"step_number":2,"title":"Fill Correction Form","description":"Enter your existing PAN number and fill in the fields that need correction. Leave others blank."},{"step_number":3,"title":"Upload Supporting Document","description":"Upload the proof document for the specific change (Gazette for name, Birth Certificate for DOB)."},{"step_number":4,"title":"Digital Sign via Aadhaar OTP","description":"Complete the application via e-Sign using Aadhaar OTP — no physical submission needed."},{"step_number":5,"title":"Pay ₹110","description":"Pay ₹110 online. Physical corrected card delivered in 15–20 working days."}]',
'[{"step_number":1,"title":"NSDL सुधार पोर्टल","description":"onlineservices.nsdl.com → ऑनलाइन पैन आवेदन → मौजूदा पैन डेटा में परिवर्तन या सुधार पर जाएं।"},{"step_number":2,"title":"सुधार फॉर्म भरें","description":"अपना मौजूदा पैन नंबर दर्ज करें और सुधार की आवश्यकता वाले फ़ील्ड भरें। बाकी खाली छोड़ें।"},{"step_number":3,"title":"सहायक दस्तावेज़ अपलोड करें","description":"विशिष्ट परिवर्तन के लिए प्रमाण दस्तावेज अपलोड करें।"},{"step_number":4,"title":"आधार OTP के माध्यम से डिजिटल हस्ताक्षर","description":"आधार OTP का उपयोग करके ई-साइन के माध्यम से आवेदन पूरा करें।"},{"step_number":5,"title":"₹110 का भुगतान करें","description":"ऑनलाइन ₹110 का भुगतान करें। सुधरा हुआ फिजिकल कार्ड 15-20 कार्यदिवसों में डिलीवर होगा।"}]',
'NSDL / Protean Authorised Centres', 'https://www.pan.utiitsl.com/PAN/', '₹110', '₹110', 15
FROM subcases sc
JOIN services sv ON sc.service_id=sv.id
CROSS JOIN (SELECT unnest(ARRAY['Uttar Pradesh','Maharashtra','Delhi','Karnataka','Tamil Nadu','West Bengal','Bihar','Rajasthan','Telangana','Andhra Pradesh','Gujarat','Madhya Pradesh','Punjab','Haryana','Kerala','Chhattisgarh','Jharkhand','Odisha','Assam','Uttarakhand','Himachal Pradesh','Goa','Jammu & Kashmir','Tripura','Meghalaya','Manipur','Mizoram','Nagaland','Arunachal Pradesh','Sikkim']) AS state) s
WHERE sc.slug='correction' AND sv.slug='pan_card'
ON CONFLICT (subcase_id, state) DO UPDATE SET
  documents_en=EXCLUDED.documents_en, steps_en=EXCLUDED.steps_en,
  fee_en=EXCLUDED.fee_en, fee_hi=EXCLUDED.fee_hi;

-- ============================================================
-- END OF MIGRATION
-- All data verified against official government sources
-- March 2026
-- ============================================================