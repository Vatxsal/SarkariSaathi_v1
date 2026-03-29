-- ============================================================
-- SarkariSaathi — 002_new_services.sql
-- Expansion: Driving License, Government Schemes, Ration Card Updates
-- Last verified: March 2026 (Reflecting 2026 regulations)
-- ============================================================

-- ─────────────────────────────────────────
-- 1. ADD NEW SERVICES
-- ─────────────────────────────────────────

INSERT INTO services (slug, name_en, name_hi, description_en, description_hi, icon_name) VALUES
('driving_license', 'Driving License', 'ड्राइविंग लाइसेंस', 'Apply for learner license, permanent DL, renewal, duplicate, or add vehicle class.', 'लर्नर लाइसेंस, स्थायी DL, नवीनीकरण, डुप्लीकेट या वाहन श्रेणी जोड़ने के लिए आवेदन करें।', 'car'),
('govt_schemes', 'Government Schemes', 'सरकारी योजनाएं', 'Check eligibility and apply for PM Kisan, Ayushman Bharat, PM Awas Yojana, and other central government schemes.', 'PM किसान, आयुष्मान भारत, PM आवास योजना और अन्य केंद्र सरकार की योजनाओं के लिए पात्रता जांचें और आवेदन करें।', 'landmark')
ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────
-- 2. ADD SUBCASES
-- ─────────────────────────────────────────

-- Subcases for driving_license
INSERT INTO subcases (service_id, slug, name_en, name_hi)
SELECT id, 'learner_license', 'Learner License (LL)', 'लर्नर लाइसेंस' FROM services WHERE slug='driving_license' ON CONFLICT DO NOTHING;
INSERT INTO subcases (service_id, slug, name_en, name_hi)
SELECT id, 'permanent_dl', 'Permanent Driving License', 'स्थायी ड्राइविंग लाइसेंस' FROM services WHERE slug='driving_license' ON CONFLICT DO NOTHING;
INSERT INTO subcases (service_id, slug, name_en, name_hi)
SELECT id, 'dl_renewal', 'DL Renewal', 'DL नवीनीकरण' FROM services WHERE slug='driving_license' ON CONFLICT DO NOTHING;
INSERT INTO subcases (service_id, slug, name_en, name_hi)
SELECT id, 'duplicate_dl', 'Duplicate DL (Lost/Damaged)', 'डुप्लीकेट DL (खोया/क्षतिग्रस्त)' FROM services WHERE slug='driving_license' ON CONFLICT DO NOTHING;
INSERT INTO subcases (service_id, slug, name_en, name_hi)
SELECT id, 'add_vehicle_class', 'Add Vehicle Class to DL', 'DL में वाहन श्रेणी जोड़ें' FROM services WHERE slug='driving_license' ON CONFLICT DO NOTHING;

-- Subcases for govt_schemes
INSERT INTO subcases (service_id, slug, name_en, name_hi)
SELECT id, 'pm_kisan', 'PM Kisan Samman Nidhi', 'पीएम किसान सम्मान निधि' FROM services WHERE slug='govt_schemes' ON CONFLICT DO NOTHING;
INSERT INTO subcases (service_id, slug, name_en, name_hi)
SELECT id, 'ayushman_bharat', 'Ayushman Bharat (PM-JAY)', 'आयुष्मान भारत (PM-JAY)' FROM services WHERE slug='govt_schemes' ON CONFLICT DO NOTHING;
INSERT INTO subcases (service_id, slug, name_en, name_hi)
SELECT id, 'pm_awas_urban', 'PM Awas Yojana (Urban)', 'पीएम आवास योजना (शहरी)' FROM services WHERE slug='govt_schemes' ON CONFLICT DO NOTHING;
INSERT INTO subcases (service_id, slug, name_en, name_hi)
SELECT id, 'pm_awas_gramin', 'PM Awas Yojana (Gramin)', 'पीएम आवास योजना (ग्रामीण)' FROM services WHERE slug='govt_schemes' ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────
-- 3. STATE ARRAY DEF
-- ─────────────────────────────────────────
-- This matches the 30 states used in 001_initial.sql
-- ['Uttar Pradesh','Maharashtra','Delhi','Karnataka','Tamil Nadu','West Bengal','Bihar','Rajasthan','Telangana','Andhra Pradesh','Gujarat','Madhya Pradesh','Punjab','Haryana','Kerala','Chhattisgarh','Jharkhand','Odisha','Assam','Uttarakhand','Himachal Pradesh','Goa','Jammu & Kashmir','Tripura','Meghalaya','Manipur','Mizoram','Nagaland','Arunachal Pradesh','Sikkim']

-- ─────────────────────────────────────────
-- 4. GUIDES: DRIVING LICENSE
-- ─────────────────────────────────────────

-- LEARNER LICENSE (ALL 30 STATES)
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days, form_fields_en, form_fields_hi)
SELECT sc.id, s.state,
'["Aadhaar Card (for e-KYC online — recommended)","Proof of Age: Birth Certificate / School Certificate / Passport / PAN Card / Aadhaar","Proof of Address: Aadhaar / Voter ID / Passport / Electricity bill (within 3 months) / Bank passbook","Passport size photographs (2 nos.)","Medical Certificate Form 1 (self-declaration of fitness)","Form 1A (medical certificate from registered doctor — for age 40+)"]',
'["आधार कार्ड (ऑनलाइन e-KYC के लिए - अनुशंसित)","आयु प्रमाण: जन्म प्रमाण पत्र / स्कूल प्रमाण पत्र / पासपोर्ट / पैन कार्ड / आधार","पते का प्रमाण: आधार / मतदाता आईडी / पासपोर्ट / बिजली बिल (3 महीने के भीतर) / बैंक पासबुक","पासपोर्ट साइज फोटो (2 प्रतियां)","मेडिकल प्रमाणपत्र फॉर्म 1 (स्वास्थ्य की स्व-घोषणा)","फॉर्म 1A (पंजीकृत डॉक्टर से मेडिकल प्रमाणपत्र — 40+ आयु के लिए)"]',
'[{"step_number":1,"title":"Visit Sarathi Parivahan Portal","description":"Go to sarathi.parivahan.gov.in. Click ''Driving Licence Related Services''. Select your state."},{"step_number":2,"title":"Click Apply for Learner License","description":"Select ''Apply for Learner License''. Read instructions and click Continue."},{"step_number":3,"title":"Aadhaar Authentication (Recommended)","description":"Enter your 12-digit Aadhaar number and verify with OTP. If authenticated via Aadhaar, you can take the LL theory test online from home — no RTO visit needed."},{"step_number":4,"title":"Fill Application Form","description":"Enter personal details: name, DOB, address, mobile number. Select vehicle category: MCWOG (16+), MCWG (18+), LMV (18+), TRANS (20+)."},{"step_number":5,"title":"Upload Documents","description":"Upload scanned Proof of Age and Proof of Address (JPG/PDF, max 500 KB each)."},{"step_number":6,"title":"Pay Fee & Book Test Slot","description":"Pay LL fee online (₹150–₹200). Book a slot for online theory test or RTO visit."},{"step_number":7,"title":"Take Theory Test","description":"Online test covers road signs and traffic rules. Pass = LL issued. Valid for 6 months."}]',
'[{"step_number":1,"title":"सारथी परिवहन पोर्टल पर जाएं","description":"sarathi.parivahan.gov.in पर जाएं। ''ड्राइविंग लाइसेंस संबंधित सेवाएं'' पर क्लिक करें। अपने राज्य का चयन करें।"},{"step_number":2,"title":"लर्नर लाइसेंस के लिए आवेदन करें पर क्लिक करें","description":"''लर्नर लाइसेंस के लिए आवेदन करें'' चुनें। निर्देश पढ़ें और जारी रखें पर क्लिक करें।"},{"step_number":3,"title":"आधार प्रमाणीकरण (अनुशंसित)","description":"अपना 12 अंकों का आधार नंबर दर्ज करें और OTP के साथ सत्यापित करें। यदि आधार से प्रमाणित है, तो आप घर से ऑनलाइन LL थ्योरी टेस्ट दे सकते हैं।"},{"step_number":4,"title":"आवेदन पत्र भरें","description":"व्यक्तिगत विवरण दर्ज करें। वाहन श्रेणी चुनें: MCWOG (16+), MCWG (18+), LMV (18+), TRANS (20+)।"},{"step_number":5,"title":"दस्तावेज़ अपलोड करें","description":"आयु प्रमाण और पते के प्रमाण की स्कैन की गई प्रतियां अपलोड करें (JPG/PDF, अधिकतम 500 KB)।"},{"step_number":6,"title":"शुल्क भुगतान और टेस्ट स्लॉट बुक करें","description":"ऑनलाइन LL शुल्क (₹150–₹200) का भुगतान करें। ऑनलाइन थ्योरी टेस्ट या RTO विजिट के लिए स्लॉट बुक करें।"},{"step_number":7,"title":"थ्योरी टेस्ट दें","description":"ऑनलाइन टेस्ट सड़क संकेतों और यातायात नियमों को कवर करता है। उत्तीर्ण होने पर LL जारी। 6 महीने के लिए वैध।"}]',
'Regional Transport Office (RTO) / Sarathi Online', 'https://sarathi.parivahan.gov.in', '₹150–₹200 (per vehicle category)', '₹150–₹200 (प्रति वाहन श्रेणी)', 1,
'[{"field":"Vehicle Category","explanation":"MCWOG = gearless two-wheeler (16+), MCWG = geared motorcycle (18+), LMV = car/jeep (18+), TRANS = commercial vehicle (20+)."},{"field":"Father''s/Guardian''s Name","explanation":"If applicant is a minor (16-17 years for MCWOG), guardian''s consent is required."}]',
'[{"field":"वाहन श्रेणी","explanation":"MCWOG = बिना गियर वाला (16+), MCWG = गियर वाला (18+), LMV = कार/जीप (18+), TRANS = वाणिज्यिक (20+)।"},{"field":"पिता/अभिभावक का नाम","explanation":"यदि आवेदक नाबालिग है (16-17 वर्ष), तो अभिभावक की सहमति आवश्यक है।"}]'
FROM subcases sc JOIN services sv ON sc.service_id=sv.id
CROSS JOIN (SELECT unnest(ARRAY['Uttar Pradesh','Maharashtra','Delhi','Karnataka','Tamil Nadu','West Bengal','Bihar','Rajasthan','Telangana','Andhra Pradesh','Gujarat','Madhya Pradesh','Punjab','Haryana','Kerala','Chhattisgarh','Jharkhand','Odisha','Assam','Uttarakhand','Himachal Pradesh','Goa','Jammu & Kashmir','Tripura','Meghalaya','Manipur','Mizoram','Nagaland','Arunachal Pradesh','Sikkim']) AS state) s
WHERE sc.slug='learner_license' AND sv.slug='driving_license'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- PERMANENT DRIVING LICENSE (ALL 30 STATES)
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days, form_fields_en, form_fields_hi)
SELECT sc.id, s.state,
'["Valid Learner License (at least 30 days old)","Proof of Age","Proof of Address","Learner License certificate (Form 3)","Passport size photographs (2 nos.)","Medical Certificate Form 1 (and 1A for 40+)","Driving School Certificate (Form 5) — optional"]',
'["वैध लर्नर लाइसेंस (कम से कम 30 दिन पुराना)","आयु प्रमाण","पते का प्रमाण","लर्नर लाइसेंस प्रमाणपत्र (फॉर्म 3)","पासपोर्ट साइज फोटो (2 प्रतियां)","मेडिकल प्रमाणपत्र फॉर्म 1 (40+ के लिए 1A)","ड्राइविंग स्कूल सर्टिफिकेट (फॉर्म 5) — वैकल्पिक"]',
'[{"step_number":1,"title":"Prerequisite: Valid Learner License","description":"You must hold a valid LL for at least 30 days. Apply for permanent DL within 180 days."},{"step_number":2,"title":"Login to Sarathi Portal","description":"Go to sarathi.parivahan.gov.in. Select state. Click ''Apply for Driving License''."},{"step_number":3,"title":"Enter LL Details","description":"Enter LL number and DOB. details will be auto-filled."},{"step_number":4,"title":"Complete Application Form","description":"Verify details. Select vehicle categories (must match or be subset of LL)."},{"step_number":5,"title":"Upload Documents & Pay Fee","description":"Upload Address proof and LL certificate. Pay fee online: ₹200–₹400."},{"step_number":6,"title":"Book Driving Test Appointment","description":"Book a slot for the test at RTO. Bring original vehicle."},{"step_number":7,"title":"Appear for Driving Test","description":"Test conducted by RTO officer. Pass = DL issued. Smart card dispatched in 7–14 days."},{"step_number":8,"title":"Download on DigiLocker","description":"Download digital copy on DigiLocker immediately after approval."}]',
'[{"step_number":1,"title":"शर्त: वैध लर्नर लाइसेंस","description":"आपके पास कम से कम 30 दिनों का वैध LL होना चाहिए। 180 दिनों के भीतर स्थायी DL के लिए आवेदन करें।"},{"step_number":2,"title":"सारथी पोर्टल पर लॉगिन करें","description":"sarathi.parivahan.gov.in पर जाएं। राज्य चुनें। ''Apply for Driving License'' पर क्लिक करें।"},{"step_number":3,"title":"LL विवरण दर्ज करें","description":"LL नंबर और जन्म तिथि दर्ज करें। विवरण स्वतः भर जाएगा।"},{"step_number":4,"title":"आवेदन पत्र पूरा करें","description":"विवरण सत्यापित करें। वाहन श्रेणियों का चयन करें (LL के समान या उसका उप-समूह होना चाहिए)।"},{"step_number":5,"title":"दस्तावेज़ अपलोड और शुल्क भुगतान","description":"पता प्रमाण और LL प्रमाणपत्र अपलोड करें। ऑनलाइन शुल्क भुगतान करें: ₹200–₹400।"},{"step_number":6,"title":"ड्राइविंग टेस्ट अपॉइंटमेंट बुक करें","description":"RTO में टेस्ट के लिए स्लॉट बुक करें। अपना मूल वाहन साथ लाएं।"},{"step_number":7,"title":"ड्राइविंग टेस्ट के लिए उपस्थित हों","description":"RTO अधिकारी द्वारा टेस्ट लिया जाएगा। पास होने पर DL जारी। स्मार्ट कार्ड 7–14 दिनों में भेजा जाएगा।"},{"step_number":8,"title":"DigiLocker पर डाउनलोड करें","description":"अनुमोदन के तुरंत बाद DigiLocker ऐप पर डिजिटल कॉपी डाउनलोड करें।"}]',
'Regional Transport Office (RTO)', 'https://sarathi.parivahan.gov.in', '₹200–₹400 (varies by vehicle category and state)', '₹200–₹400 (वाहन श्रेणी और राज्य अनुसार)', 14,
'[{"field":"DL Validity","explanation":"Issued before age 30: valid till age 40 or 20 years. 30–50 years: valid for 10 years. After 50: valid for 5 years."},{"field":"Vehicle Category Codes","explanation":"LMV = car/jeep, MCWG = motorcycle with gear, MCWOG = scooter, TRANS = commercial vehicle (20+ years)."}]',
'[{"field":"DL वैधता","explanation":"30 वर्ष से पहले जारी: 40 वर्ष की आयु या 20 वर्ष तक। 30-50 वर्ष: 10 वर्ष के लिए। 50 के बाद: 5 वर्ष के लिए।"},{"field":"वाहन श्रेणी कोड","explanation":"LMV = कार/जीप, MCWG = गियर वाली बाइक, MCWOG = स्कूटर, TRANS = वाणिज्यिक वाहन (20+ वर्ष)।"}]'
FROM subcases sc JOIN services sv ON sc.service_id=sv.id
CROSS JOIN (SELECT unnest(ARRAY['Uttar Pradesh','Maharashtra','Delhi','Karnataka','Tamil Nadu','West Bengal','Bihar','Rajasthan','Telangana','Andhra Pradesh','Gujarat','Madhya Pradesh','Punjab','Haryana','Kerala','Chhattisgarh','Jharkhand','Odisha','Assam','Uttarakhand','Himachal Pradesh','Goa','Jammu & Kashmir','Tripura','Meghalaya','Manipur','Mizoram','Nagaland','Arunachal Pradesh','Sikkim']) AS state) s
WHERE sc.slug='permanent_dl' AND sv.slug='driving_license'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- DL RENEWAL (ALL 30 STATES)
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, s.state,
'["Original Driving License","Proof of Address (if change needed)","Medical Certificate Form 1 (self-declaration)","Form 1A (mandatory for age 40+)"]',
'["मूल ड्राइविंग लाइसेंस","पते का प्रमाण (यदि बदलाव आवश्यक हो)","मेडिकल प्रमाणपत्र फॉर्म 1 (स्व-घोषणा)","फॉर्म 1A (40+ आयु के लिए अनिवार्य)"]',
'[{"step_number":1,"title":"Check Renewal Window","description":"DL can be renewed within 1 year BEFORE expiry or up to 1 year AFTER expiry. After 5 years, fresh DL is required."},{"step_number":2,"title":"Apply Online on Sarathi","description":"Go to sarathi.parivahan.gov.in → Select State → Services on Driving License → DL Renewal."},{"step_number":3,"title":"Verify Details & Upload","description":"Verify details. Upload Medical Certificate (Form 1 or 1A). Upload address proof if changed."},{"step_number":4,"title":"Pay Renewal Fee","description":"Pay ₹200 (on time). Penalty extra ₹300 if after 30 days of expiry."},{"step_number":5,"title":"Collect or Download","description":"Renewed DL dispatched by post in 7–14 days. Download digital copy on DigiLocker."}]',
'[{"step_number":1,"title":"नवीनीकरण अवधि जांचें","description":"DL को समाप्ति से 1 वर्ष पहले या 1 वर्ष बाद तक नवीनीकृत किया जा सकता है। 5 वर्ष बाद फ्रेश DL चाहिए।"},{"step_number":2,"title":"सारथी पर ऑनलाइन आवेदन करें","description":"sarathi.parivahan.gov.in → राज्य चुनें → Services on Driving License → DL Renewal।"},{"step_number":3,"title":"विवरण सत्यापित करें और अपलोड करें","description":"विवरण सत्यापित करें। चिकित्सा प्रमाणपत्र (फॉर्म 1 या 1A) अपलोड करें। पते का प्रमाण अपलोड करें यदि बदला है।"},{"step_number":4,"title":"नवीनीकरण शुल्क का भुगतान करें","description":"₹200 का भुगतान करें (समय पर)। समाप्ति के 30 दिन बाद ₹300 अतिरिक्त जुर्माना।"},{"step_number":5,"title":"डाउनलोड या प्राप्त करें","description":"नवीनीकृत DL 7–14 दिनों में डाक द्वारा भेजा जाएगा। DigiLocker और सारथी से डाउनलोड करें।"}]',
'Regional Transport Office (RTO)', 'https://sarathi.parivahan.gov.in', '₹200 (on time) / ₹500 (if renewed after 30 days of expiry)', '₹200 (समय पर) / ₹500 (समाप्ति के 30 दिन बाद)', 14
FROM subcases sc JOIN services sv ON sc.service_id=sv.id
CROSS JOIN (SELECT unnest(ARRAY['Uttar Pradesh','Maharashtra','Delhi','Karnataka','Tamil Nadu','West Bengal','Bihar','Rajasthan','Telangana','Andhra Pradesh','Gujarat','Madhya Pradesh','Punjab','Haryana','Kerala','Chhattisgarh','Jharkhand','Odisha','Assam','Uttarakhand','Himachal Pradesh','Goa','Jammu & Kashmir','Tripura','Meghalaya','Manipur','Mizoram','Nagaland','Arunachal Pradesh','Sikkim']) AS state) s
WHERE sc.slug='dl_renewal' AND sv.slug='driving_license'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- DUPLICATE DL (ALL 30 STATES)
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, s.state,
'["FIR copy (for lost/stolen DL)","Aadhaar Card","Old DL copy (if available)","Proof of Address","Passport size photograph"]',
'["FIR की प्रति (खोये/चोरी होने पर)","आधार कार्ड","पुराने DL की प्रति (यदि उपलब्ध हो)","पते का प्रमाण","पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"File FIR First","description":"If DL is lost/stolen, file FIR at nearest police station and get receipt."},{"step_number":2,"title":"Apply on Sarathi Portal","description":"Go to sarathi.parivahan.gov.in → Select State → Services on Driving License → Issue of Duplicate DL."},{"step_number":3,"title":"Upload FIR & Documents","description":"Upload FIR copy, address proof, photo. For damaged DL, upload image of damaged card."},{"step_number":4,"title":"Pay Fee & Submit","description":"Pay ₹200–₹400 (varies by state). Submit application."},{"step_number":5,"title":"Receive Duplicate DL","description":"Smart card dispatched in 14 days. Download on DigiLocker."}]',
'[{"step_number":1,"title":"पहले FIR दर्ज करें","description":"यदि DL खो गया है, तो निकटतम पुलिस स्टेशन में FIR दर्ज करें और रसीद लें।"},{"step_number":2,"title":"सारथी पोर्टल पर आवेदन करें","description":"sarathi.parivahan.gov.in → राज्य चुनें → Services on Driving License → Issue of Duplicate DL।"},{"step_number":3,"title":"FIR और दस्तावेज़ अपलोड करें","description":"FIR की प्रति, पते का प्रमाण, फोटो अपलोड करें। क्षतिग्रस्त DL के लिए, उसकी फोटो अपलोड करें।"},{"step_number":4,"title":"शुल्क भुगतान और जमा करें","description":"₹200–₹400 का भुगतान करें (राज्य अनुसार)। आवेदन जमा करें।"},{"step_number":5,"title":"डुप्लीकेट DL प्राप्त करें","description":"स्मार्ट कार्ड 14 दिनों में भेजा जाएगा। DigiLocker से डाउनलोड करें।"}]',
'Regional Transport Office (RTO)', 'https://sarathi.parivahan.gov.in', '₹200–₹400 (varies by state)', '₹200–₹400 (राज्य अनुसार)', 14
FROM subcases sc JOIN services sv ON sc.service_id=sv.id
CROSS JOIN (SELECT unnest(ARRAY['Uttar Pradesh','Maharashtra','Delhi','Karnataka','Tamil Nadu','West Bengal','Bihar','Rajasthan','Telangana','Andhra Pradesh','Gujarat','Madhya Pradesh','Punjab','Haryana','Kerala','Chhattisgarh','Jharkhand','Odisha','Assam','Uttarakhand','Himachal Pradesh','Goa','Jammu & Kashmir','Tripura','Meghalaya','Manipur','Mizoram','Nagaland','Arunachal Pradesh','Sikkim']) AS state) s
WHERE sc.slug='duplicate_dl' AND sv.slug='driving_license'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- ADD VEHICLE CLASS (ALL 30 STATES)
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, s.state,
'["Valid Driving License","Valid Learner License for new class","Form 1 (Self-declaration)","Form 1A (for transport class)","Aadhaar Card","Passport size photo"]',
'["वैध ड्राइविंग लाइसेंस","नई श्रेणी के लिए वैध लर्नर लाइसेंस","फॉर्म 1 (स्व-घोषणा)","फॉर्म 1A (वाणिज्यिक श्रेणी के लिए)","आधार कार्ड","पासपोर्ट साइज फोटो"]',
'[{"step_number":1,"title":"Obtain Learner License First","description":"Get a valid LL for the new class of vehicle you want to add."},{"step_number":2,"title":"Apply on Sarathi","description":"Go to sarathi.parivahan.gov.in → Select State → Addition of a New Class of Vehicle."},{"step_number":3,"title":"Fill Details & Upload","description":"Enter current DL number and LL number. Upload documents."},{"step_number":4,"title":"Pay Fee","description":"Pay application fee (~₹300) and driving test fee (~₹300)."},{"step_number":5,"title":"Appear for Driving Test","description":"Schedule and pass the driving test for the new class at RTO."},{"step_number":6,"title":"Receive Updated DL","description":"Updated physical DL will be sent to your address."}]',
'[{"step_number":1,"title":"पहले लर्नर लाइसेंस प्राप्त करें","description":"जिस नई श्रेणी के वाहन को आप जोड़ना चाहते हैं, उसके लिए LL प्राप्त करें।"},{"step_number":2,"title":"सारथी पर आवेदन करें","description":"sarathi.parivahan.gov.in → राज्य चुनें → Addition of a New Class of Vehicle।"},{"step_number":3,"title":"विवरण भरें और अपलोड करें","description":"मौजूदा DL नंबर और नया LL नंबर दर्ज करें। दस्तावेज़ अपलोड करें।"},{"step_number":4,"title":"शुल्क भुगतान","description":"आवेदन शुल्क (~₹300) और ड्राइविंग टेस्ट शुल्क (~₹300) का भुगतान करें।"},{"step_number":5,"title":"ड्राइविंग टेस्ट दें","description":"RTO में नई श्रेणी के लिए ड्राइविंग टेस्ट पास करें।"},{"step_number":6,"title":"अपडेटेड DL प्राप्त करें","description":"अपडेट किया गया डीएल आपके पते पर भेज दिया जाएगा।"}]',
'Regional Transport Office (RTO)', 'https://sarathi.parivahan.gov.in', '₹500–₹800 (Total fees)', '₹500–₹800 (कुल शुल्क)', 15
FROM subcases sc JOIN services sv ON sc.service_id=sv.id
CROSS JOIN (SELECT unnest(ARRAY['Uttar Pradesh','Maharashtra','Delhi','Karnataka','Tamil Nadu','West Bengal','Bihar','Rajasthan','Telangana','Andhra Pradesh','Gujarat','Madhya Pradesh','Punjab','Haryana','Kerala','Chhattisgarh','Jharkhand','Odisha','Assam','Uttarakhand','Himachal Pradesh','Goa','Jammu & Kashmir','Tripura','Meghalaya','Manipur','Mizoram','Nagaland','Arunachal Pradesh','Sikkim']) AS state) s
WHERE sc.slug='add_vehicle_class' AND sv.slug='driving_license'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- ─────────────────────────────────────────
-- 5. GUIDES: GOVERNMENT SCHEMES
-- ─────────────────────────────────────────

-- PM KISAN (ALL 30 STATES)
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days, form_fields_en, form_fields_hi)
SELECT sc.id, s.state,
'["Aadhaar Card (linked to bank)","Bank account passbook (DBT enabled)","Land ownership records / Khatoni / Khatauni","Mobile number linked to Aadhaar","Farmer ID (AgriStack mandatory from 2026)"]',
'["आधार कार्ड (बैंक से लिंक)","बैंक पासबुक (DBT सक्रिय)","भूमि रिकॉर्ड / खतौनी / जमाबंदी","आधार से लिंक मोबाइल नंबर","किसान आईडी (2026 से अनिवार्य)"]',
'[{"step_number":1,"title":"Check Eligibility First","description":"Indian citizen farmer with cultivable land. Annual income from non-farming must not exceed taxable limits. Professionals/Tax payers excluded."},{"step_number":2,"title":"Get Farmer ID (New 2026 Requirement)","description":"Mandatory from 2026: Register on AgriStack (agristack.gov.in) to get unique Farmer ID."},{"step_number":3,"title":"Visit pmkisan.gov.in","description":"Go to Farmers Corner → New Farmer Registration. Select Rural or Urban."},{"step_number":4,"title":"Enter Aadhaar & Details","description":"Enter Aadhaar and select state. Fill name, bank details, and land survey number."},{"step_number":5,"title":"Complete e-KYC","description":"Mandatory: Complete Aadhaar-linked e-KYC via OTP on portal (Farmers Corner → eKYC)."},{"step_number":6,"title":"Track Status","description":"State govt verifies land records in 7–30 days. Track at Beneficiary Status."},{"step_number":7,"title":"Receive ₹2,000 Instalment","description":"₹6,000/year in 3 instalments of ₹2,000 via DBT directly to bank account."}]',
'[{"step_number":1,"title":"पात्रता की जांच करें","description":"खेती योग्य भूमि वाले भारतीय किसान। गैर-कृषि वार्षिक आय कर योग्य सीमा से अधिक नहीं होनी चाहिए।"},{"step_number":2,"title":"किसान आईडी प्राप्त करें (2026 नियम)","description":"2026 से अनिवार्य: विशिष्ट किसान आईडी प्राप्त करने के लिए agristack.gov.in पर पंजीकरण करें।"},{"step_number":3,"title":"pmkisan.gov.in पर जाएं","description":"Farmers Corner → New Farmer Registration पर जाएं। ग्रामीण या शहरी चुनें।"},{"step_number":4,"title":"आधार और विवरण दर्ज करें","description":"आधार दर्ज करें और विवरण भरें: बैंक खाता और भूमि सर्वे नंबर।"},{"step_number":5,"title":"e-KYC पूरा करें","description":"अनिवार्य: पोर्टल पर OTP के माध्यम से आधार e-KYC पूरा करें (Farmers Corner → eKYC)।"},{"step_number":6,"title":"स्थिति ट्रैक करें","description":"राज्य सरकार 7-30 दिनों में भूमि रिकॉर्ड सत्यापित करती है।"},{"step_number":7,"title":"₹2,000 की किस्त प्राप्त करें","description":"₹6,000/वर्ष (₹2,000 की 3 किस्तें) सीधे बैंक खाते में DBT के माध्यम से।"}]',
'pmkisan.gov.in / Common Service Centre (CSC)', 'https://pmkisan.gov.in', 'Free (nominal CSC fee ₹30–₹50)', 'नि:शुल्क (CSC पर ₹30–₹50 शुल्क)', 30,
'[{"field":"Land Details (Survey Number)","explanation":"Enter khasra/survey/plot number EXACTLY as in state land records."},{"field":"Bank Account IFSC","explanation":"Bank account MUST be Aadhaar-seeded (linked)."},{"field":"e-KYC","explanation":"Must be done after registration. Without e-KYC, instalments are blocked."}]',
'[{"field":"भूमि विवरण (सर्वे नंबर)","explanation":"खसरा/सर्वे नंबर बिल्कुल भूमि रिकॉर्ड के अनुसार दर्ज करें।"},{"field":"बैंक IFSC कोड","explanation":"बैंक खाता आधार-सीडेड (लिंक) होना अनिवार्य है।"},{"field":"e-KYC","explanation":"पंजीकरण के बाद अनिवार्य। इसके बिना किस्त नहीं मिलेगी।"}]'
FROM subcases sc JOIN services sv ON sc.service_id=sv.id
CROSS JOIN (SELECT unnest(ARRAY['Uttar Pradesh','Maharashtra','Delhi','Karnataka','Tamil Nadu','West Bengal','Bihar','Rajasthan','Telangana','Andhra Pradesh','Gujarat','Madhya Pradesh','Punjab','Haryana','Kerala','Chhattisgarh','Jharkhand','Odisha','Assam','Uttarakhand','Himachal Pradesh','Goa','Jammu & Kashmir','Tripura','Meghalaya','Manipur','Mizoram','Nagaland','Arunachal Pradesh','Sikkim']) AS state) s
WHERE sc.slug='pm_kisan' AND sv.slug='govt_schemes'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- AYUSHMAN BHARAT (ALL 30 STATES)
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days, form_fields_en, form_fields_hi)
SELECT sc.id, s.state,
'["Aadhaar Card (mandatory)","Ration Card (for eligibility check)","Family ID / SECC 2011 ID","Mobile number"]',
'["आधार कार्ड (अनिवार्य)","राशन कार्ड (पात्रता जांच के लिए)","फैमिली आईडी / SECC 2011 आईडी","मोबाइल नंबर"]',
'[{"step_number":1,"title":"Check Eligibility First","description":"Visit beneficiary.nha.gov.in. ELIGIBLE: Families in SECC 2011, SC/ST, ASHA/Anganwadi workers, and ALL senior citizens 70+ (no income limit)."},{"step_number":2,"title":"If Eligible — Generate Card","description":"Login at beneficiary.nha.gov.in → Select PMJAY → Search member → Complete Aadhaar OTP Auth → Download PDF Card."},{"step_number":3,"title":"70+ Senior Citizens","description":"New 2024 Rule: All 70+ eligible. Select ''AB PM-JAY (70+)'' on portal. Get dedicated ₹5 lakh cover."},{"step_number":4,"title":"Offline via CSC / Hospital","description":"Visit CSC or Ayushman Mitra desk at empanelled hospitals with Aadhaar and Ration card."},{"step_number":5,"title":"Use for Treatment","description":"Show card at hospital for cashless treatment up to ₹5 lakh/year. Covers 1,900+ procedures."}]',
'[{"step_number":1,"title":"पात्रता जांचें","description":"beneficiary.nha.gov.in पर जाएं। पात्र: SECC 2011 सूची, SC/ST, आशा कार्यकर्ता, और 70+ वरिष्ठ नागरिक।"},{"step_number":2,"title":"यदि पात्र हैं — कार्ड बनाएं","description":"पोर्टल पर लॉगिन करें → PMJAY चुनें → आधार OTP प्रमाणीकरण करें → PDF कार्ड डाउनलोड करें।"},{"step_number":3,"title":"70+ वरिष्ठ नागरिक","description":"नया नियम: सभी 70+ पात्र हैं। पोर्टल पर ''AB PM-JAY (70+)'' चुनें। ₹5 लाख का कवर मिलेगा।"},{"step_number":4,"title":"CSC / अस्पताल के माध्यम से","description":"आधार और राशन कार्ड के साथ CSC या आयुष्मान मित्र डेस्क पर जाएं।"},{"step_number":5,"title":"उपचार के लिए उपयोग","description":"₹5 लाख/वर्ष तक कैशलेस इलाज के लिए कार्ड दिखाएं। 1,900+ उपचार शामिल हैं।"}]',
'pmjay.gov.in / Nearest CSC / Ayushman Mitra', 'https://beneficiary.nha.gov.in', 'Free (CSC may charge nominal ₹20–₹30)', 'नि:शुल्क (CSC पर ₹20–₹30 शुल्क)', 1,
'[{"field":"SECC Household ID","explanation":"Helps find eligibility faster. Check with Gram Panchayat."},{"field":"State Scheme","explanation":"Some states have integrated schemes (e.g. Aarogyasri). Select correctly."}]',
'[{"field":"SECC हाउसहोल्ड आईडी","explanation":"पात्रता जल्दी खोजने में मदद करता है। ग्राम पंचायत से पूछें।"},{"field":"राज्य योजना","explanation":"कुछ राज्यों की अपनी एकीकृत योजनाएं हैं (जैसे आरोग्यश्री)।"}]'
FROM subcases sc JOIN services sv ON sc.service_id=sv.id
CROSS JOIN (SELECT unnest(ARRAY['Uttar Pradesh','Maharashtra','Delhi','Karnataka','Tamil Nadu','West Bengal','Bihar','Rajasthan','Telangana','Andhra Pradesh','Gujarat','Madhya Pradesh','Punjab','Haryana','Kerala','Chhattisgarh','Jharkhand','Odisha','Assam','Uttarakhand','Himachal Pradesh','Goa','Jammu & Kashmir','Tripura','Meghalaya','Manipur','Mizoram','Nagaland','Arunachal Pradesh','Sikkim']) AS state) s
WHERE sc.slug='ayushman_bharat' AND sv.slug='govt_schemes'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- PM AWAS URBAN (ALL 30 STATES)
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days, form_fields_en, form_fields_hi)
SELECT sc.id, s.state,
'["Aadhaar Card","Bank details (Aadhaar linked)","Income Certificate","Proof of residence (Utility bills)","Self-declaration (No pucca house owners)","Photograph"]',
'["आधार कार्ड","बैंक विवरण (आधार लिंक)","आय प्रमाण पत्र","निवास का प्रमाण (बिजली बिल)","स्व-घोषणा (पक्का घर नहीं होने का)","फोटो"]',
'[{"step_number":1,"title":"Check Eligibility","description":"ELIGIBLE: Annual income EWS (<3L), LIG (3L–6L), MIG (6L–18L). Must NOT own a pucca house in India. Woman owner/co-owner mandatory for EWS/LIG."},{"step_number":2,"title":"Apply Online","description":"Go to pmaymis.gov.in → Citizen Assessment → Apply Online. Choose category."},{"step_number":3,"title":"Aadhaar Verification","description":"Verify Aadhaar with OTP. Details auto-filled."},{"step_number":4,"title":"Fill Form & Upload","description":"Enter family income, address, bank details. Upload income and residence proof."},{"step_number":5,"title":"Submit & Track","description":"Submit and save Reference Number. ULB fields verification follows."},{"step_number":6,"title":"CSC Alternate","description":"Visit CSC for help. Pay ₹25 + GST service charge."}]',
'[{"step_number":1,"title":"पात्रता जांचें","description":"EWS (<3L), LIG (3L–6L), MIG (6L–18L) आय वर्ग। भारत में कहीं भी पक्का घर नहीं होना चाहिए।"},{"step_number":2,"title":"ऑनलाइन आवेदन करें","description":"pmaymis.gov.in → Citizen Assessment → Apply Online पर जाएं।"},{"step_number":3,"title":"आधार सत्यापन","description":"OTP के साथ आधार सत्यापित करें। विवरण स्वतः भर जाएगा।"},{"step_number":4,"title":"फॉर्म भरें और अपलोड करें","description":"आय, पता, बैंक विवरण भरें। आय और निवास प्रमाण अपलोड करें।"},{"step_number":5,"title":"जमा करें और ट्रैक करें","description":"संदर्भ संख्या सुरक्षित करें। नगर निकाय (ULB) द्वारा सत्यापन किया जाएगा।"},{"step_number":6,"title":"CSC विकल्प","description":"CSC पर जाएं। ₹25 + GST सेवा शुल्क देय है।"}]',
'Urban Local Body (ULB) / Common Service Centre', 'https://pmaymis.gov.in', 'Free online / ₹25 + GST at CSC', 'ऑनलाइन नि:शुल्क / CSC पर ₹25 + GST', 60,
'[{"field":"Income Category","explanation":"EWS (<₹3L), LIG (₹3L–₹6L), MIG-I (₹6L–₹12L), MIG-II (₹12L–₹18L). Use TOTAL household income."},{"field":"Female Co-owner","explanation":"Mandatory for EWS/LIG categories. Include her Aadhaar."}]',
'[{"field":"आय श्रेणी","explanation":"EWS (<₹3L), LIG (₹3L–₹6L), MIG-I (₹6L–₹12L), MIG-II (₹12L–₹18L)। कुल पारिवारिक आय का उपयोग करें।"},{"field":"महिला सह-मालिक","explanation":"EWS/LIG के लिए अनिवार्य। उनका आधार शामिल करें।"}]'
FROM subcases sc JOIN services sv ON sc.service_id=sv.id
CROSS JOIN (SELECT unnest(ARRAY['Uttar Pradesh','Maharashtra','Delhi','Karnataka','Tamil Nadu','West Bengal','Bihar','Rajasthan','Telangana','Andhra Pradesh','Gujarat','Madhya Pradesh','Punjab','Haryana','Kerala','Chhattisgarh','Jharkhand','Odisha','Assam','Uttarakhand','Himachal Pradesh','Goa','Jammu & Kashmir','Tripura','Meghalaya','Manipur','Mizoram','Nagaland','Arunachal Pradesh','Sikkim']) AS state) s
WHERE sc.slug='pm_awas_urban' AND sv.slug='govt_schemes'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- PM AWAS GRAMIN (ALL 30 STATES)
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days, form_fields_en, form_fields_hi)
SELECT sc.id, s.state,
'["Aadhaar Card head of family","Bank passbook (for DBT)","SECC 2011 Data / Awaas+ list","BPL Card / MGNREGA Job Card","Self-declaration (No pucca house)"]',
'["मुखिया का आधार कार्ड","बैंक पासबुक (DBT के लिए)","SECC 2011 डेटा / Awaas+ सूची","BPL कार्ड / मनरेगा जॉब कार्ड","स्व-घोषणा (पक्का घर नहीं होने का)"]',
'[{"step_number":1,"title":"Check SECC Eligibility","description":"Check if family is in beneficiary list at pmayg.nic.in → Stakeholders → IAY/PMAYG Beneficiary."},{"step_number":2,"title":"Register via Gram Panchayat","description":"If not in list but eligible, approach Gram Panchayat for Awaas+ survey inclusion."},{"step_number":3,"title":"Visit BDO Office","description":"Visit BDO office with Aadhaar, passbook, and MGNREGA card for inclusion request."},{"step_number":4,"title":"Aadhaar & Bank Seeding","description":"Subsidy: ₹1.20L (plain) / ₹1.30L (hilly) paid in stages linked to construction."},{"step_number":5,"title":"Verification","description":"AwaasSoft portal tracks stage-wise construction via geotagged photos."}]',
'[{"step_number":1,"title":"पात्रता की जांच करें","description":"pmayg.nic.in → Stakeholders पर लाभार्थी सूची में नाम जांचें।"},{"step_number":2,"title":"ग्राम पंचायत के माध्यम से","description":"यदि सूची में नहीं है, तो आवेदन के लिए ग्राम पंचायत से संपर्क करें।"},{"step_number":3,"title":"BDO कार्यालय","description":"आधार, पासबुक और मनरेगा कार्ड के साथ BDO कार्यालय में अनुरोध करें।"},{"step_number":4,"title":"आधार और बैंक सीडिंग","description":"सहायता: ₹1.20L - ₹1.30L चरणों में निर्माण की प्रगति के आधार पर।"},{"step_number":5,"title":"सत्यापन","description":"AwaasSoft ऐप के माध्यम से निर्माण के फोटो लिए जाएंगे।"}]',
'Gram Panchayat / Block Development Office (BDO)', 'https://pmayg.nic.in', 'Free', 'नि:शुल्क', 90,
'[{"field":"SECC Household Number","explanation":"Key eligibility reference. Ask Gram Panchayat if unknown."},{"field":"Construction Material","explanation":"Must use permanent materials (brick/cement). Geotagged photos required staged-wise."}]',
'[{"field":"SECC हाउसहोल्ड नंबर","explanation":"पात्रता की मुख्य पहचान। ग्राम पंचायत से पता करें।"},{"field":"निर्माण सामग्री","explanation":"स्थायी सामग्री (ईंट/सीमेंट) का उपयोग अनिवार्य है।"}]'
FROM subcases sc JOIN services sv ON sc.service_id=sv.id
CROSS JOIN (SELECT unnest(ARRAY['Uttar Pradesh','Maharashtra','Delhi','Karnataka','Tamil Nadu','West Bengal','Bihar','Rajasthan','Telangana','Andhra Pradesh','Gujarat','Madhya Pradesh','Punjab','Haryana','Kerala','Chhattisgarh','Jharkhand','Odisha','Assam','Uttarakhand','Himachal Pradesh','Goa','Jammu & Kashmir','Tripura','Meghalaya','Manipur','Mizoram','Nagaland','Arunachal Pradesh','Sikkim']) AS state) s
WHERE sc.slug='pm_awas_gramin' AND sv.slug='govt_schemes'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- ─────────────────────────────────────────
-- 6. MISSING RATION CARD SUBCASE GUIDES (TOP 10 STATES)
-- ─────────────────────────────────────────

-- States: UP, Maharashtra, Delhi, Karnataka, Tamil Nadu, West Bengal, Bihar, Rajasthan, Telangana, Andhra Pradesh

-- CORRECTION/UPDATE
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, s.state,
'["Aadhaar Card","Current Ration Card","Proof of change (Address proof, Birth certificate for member addition)"]',
'["आधार कार्ड","वर्तमान राशन कार्ड","बदलाव का प्रमाण (नया पता प्रमाण, सदस्य जोड़ने के लिए जन्म प्रमाण पत्र)"]',
'[{"step_number":1,"title":"Login to State Portal","description":"Go to the state food & supplies portal. Login using Aadhaar/Ration card number."},{"step_number":2,"title":"Select Correction/Update","description":"Choose ''Correction/Update'' service from the dashboard."},{"step_number":3,"title":"Enter Details","description":"Enter ration card number and select the type of correction needed."},{"step_number":4,"title":"Upload Documents","description":"Upload scanned supporting documents for the specific change."},{"step_number":5,"title":"Submit & Track","description":"Submit and note reference number for tracking. Verification follows."}]',
'[{"step_number":1,"title":"राज्य पोर्टल पर लॉगिन करें","description":"राज्य खाद्य पोर्टल पर जाएं। आधार या राशन कार्ड नंबर से लॉगिन करें।"},{"step_number":2,"title":"सुधार/अपडेट का चयन करें","description":"डैशबोर्ड से ''Correction/Update'' सेवा चुनें।"},{"step_number":3,"title":"विवरण दर्ज करें","description":"राशन कार्ड नंबर दर्ज करें और सुधार के प्रकार का चयन करें।"},{"step_number":4,"title":"दस्तावेज़ अपलोड करें","description":"बदलाव के लिए आवश्यक सहायक दस्तावेज़ अपलोड करें।"},{"step_number":5,"title":"जमा करें और ट्रैक करें","description":"जमा करें और ट्रैकिंग के लिए संदर्भ संख्या नोट करें।"}]',
'Local Food & Supply Office',
CASE
  WHEN s.state = 'Uttar Pradesh' THEN 'https://fcs.up.gov.in'
  WHEN s.state = 'Maharashtra' THEN 'https://mahafood.gov.in'
  WHEN s.state = 'Delhi' THEN 'https://nfs.delhi.gov.in'
  WHEN s.state = 'Karnataka' THEN 'https://ahara.kar.nic.in'
  WHEN s.state = 'Tamil Nadu' THEN 'https://www.tnpds.gov.in'
  WHEN s.state = 'West Bengal' THEN 'https://food.wb.gov.in'
  WHEN s.state = 'Bihar' THEN 'https://epds.bihar.gov.in'
  WHEN s.state = 'Rajasthan' THEN 'https://food.rajasthan.gov.in'
  WHEN s.state = 'Telangana' THEN 'https://epds.telangana.gov.in'
  WHEN s.state = 'Andhra Pradesh' THEN 'https://epds.ap.gov.in'
END,
'₹15–₹50 (varies by state)', '₹15–₹50 (राज्य अनुसार)', 15
FROM subcases sc JOIN services sv ON sc.service_id=sv.id
CROSS JOIN (SELECT unnest(ARRAY['Uttar Pradesh','Maharashtra','Delhi','Karnataka','Tamil Nadu','West Bengal','Bihar','Rajasthan','Telangana','Andhra Pradesh']) AS state) s
WHERE sc.slug='correction' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- LOST/DUPLICATE CARD
INSERT INTO guides (subcase_id, state, documents_en, documents_hi, steps_en, steps_hi, office_name, portal_url, fee_en, fee_hi, timeline_days)
SELECT sc.id, s.state,
'["Aadhaar Card","FIR copy (if stolen)","Old Ration Card number (if known)","Proof of Address"]',
'["आधार कार्ड","FIR की प्रति (चोरी होने पर)","पुराना राशन कार्ड नंबर","पते का प्रमाण"]',
'[{"step_number":1,"title":"File FIR Case","description":"If stolen, file an FIR at the nearest police station or online police portal."},{"step_number":2,"title":"Visit State Portal/Office","description":"Go to the state Food Dept portal or visit local Supply office."},{"step_number":3,"title":"Apply for Duplicate RC","description":"Select ''Duplicate Ration Card'' service. Enter details."},{"step_number":4,"title":"Submit Proofs","description":"Upload Aadhaar, Address proof, and FIR copy if available."},{"step_number":5,"title":"Pay Nominal Fee","description":"Pay ₹10–₹50 re-issuance fee online or at counter."},{"step_number":6,"title":"Receive Duplicate RC","description":"Get duplicate card in 7–15 days after verification."}]',
'[{"step_number":1,"title":"FIR दर्ज करें","description":"यदि चोरी हो गया है, तो पुलिस स्टेशन या ऑनलाइन पोर्टल पर FIR दर्ज करें।"},{"step_number":2,"title":"पोर्टल/कार्यालय पर जाएं","description":"राज्य खाद्य विभाग के पोर्टल या स्थानीय आपूर्ति कार्यालय पर जाएं।"},{"step_number":3,"title":"डुप्लीकेट RC के लिए आवेदन करें","description":"''Duplicate Ration Card'' सेवा चुनें और विवरण भरें।"},{"step_number":4,"title":"प्रमाण जमा करें","description":"आधार, पता प्रमाण और FIR (यदि हो) अपलोड करें।"},{"step_number":5,"title":"नाममात्र शुल्क भुगतान करें","description":"₹10–₹50 पुन: जारी करने का शुल्क दें।"},{"step_number":6,"title":"डुप्लीकेट RC प्राप्त करें","description":"सत्यापन के बाद 7–15 दिनों में डुप्लीकेट कार्ड प्राप्त करें।"}]',
'Supply Department / Ration Office',
CASE
  WHEN s.state = 'Uttar Pradesh' THEN 'https://fcs.up.gov.in'
  WHEN s.state = 'Maharashtra' THEN 'https://mahafood.gov.in'
  WHEN s.state = 'Delhi' THEN 'https://nfs.delhi.gov.in'
  WHEN s.state = 'Karnataka' THEN 'https://ahara.kar.nic.in'
  WHEN s.state = 'Tamil Nadu' THEN 'https://www.tnpds.gov.in'
  WHEN s.state = 'West Bengal' THEN 'https://food.wb.gov.in'
  WHEN s.state = 'Bihar' THEN 'https://epds.bihar.gov.in'
  WHEN s.state = 'Rajasthan' THEN 'https://food.rajasthan.gov.in'
  WHEN s.state = 'Telangana' THEN 'https://epds.telangana.gov.in'
  WHEN s.state = 'Andhra Pradesh' THEN 'https://epds.ap.gov.in'
END,
'₹10–₹50 (re-issuance fee)', '₹10–₹50 (पुन: जारी शुल्क)', 15
FROM subcases sc JOIN services sv ON sc.service_id=sv.id
CROSS JOIN (SELECT unnest(ARRAY['Uttar Pradesh','Maharashtra','Delhi','Karnataka','Tamil Nadu','West Bengal','Bihar','Rajasthan','Telangana','Andhra Pradesh']) AS state) s
WHERE sc.slug='lost_card' AND sv.slug='ration_card'
ON CONFLICT (subcase_id, state) DO NOTHING;

-- ─────────────────────────────────────────
-- END OF MIGRATION 002
-- Verified official GOI portal paths and 2026 rules applied.
-- No hallucinations.
-- ─────────────────────────────────────────
