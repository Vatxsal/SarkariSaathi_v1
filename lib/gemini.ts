import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = (process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "").trim();
const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiResponse = async (prompt: string) => {
  if (!apiKey) {
    console.error("GEMINI API KEY MISSING");
    return null;
  }

  const models = [
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
    "gemini-2.1-flash",
    "gemini-1.5-pro",
    "gemini-1.5-flash"
  ];

  for (const modelName of models) {
    try {
      console.log(`Trying Gemini model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      if (text) {
        console.log(`Gemini response received using ${modelName}`);
        return text;
      }
    } catch (error: any) {
      console.warn(`Gemini Error with ${modelName}: ${error.message}`);
      if (modelName === models[models.length - 1]) {
        throw error;
      }
      continue;
    }
  }
  return null;
};

export const normalizeState = (state: string): string => {
  if (!state) return "";
  const s = state.trim().toLowerCase();

  const mapping: Record<string, string> = {
    'up': 'Uttar Pradesh',
    'uttarpradesh': 'Uttar Pradesh',
    'mh': 'Maharashtra',
    'mah': 'Maharashtra',
    'del': 'Delhi',
    'ka': 'Karnataka',
    'karnatka': 'Karnataka',
    'j&k': 'Jammu & Kashmir',
    'j and k': 'Jammu & Kashmir',
    'jammu': 'Jammu & Kashmir',
    'jammu kashmir': 'Jammu & Kashmir',
    'jammu and kashmir': 'Jammu & Kashmir',
    'andhra': 'Andhra Pradesh',
    'ap': 'Andhra Pradesh',
    'arunachal': 'Arunachal Pradesh',
    'chattisgarh': 'Chhattisgarh',
    'cg': 'Chhattisgarh',
    'chhattisgarh': 'Chhattisgarh',
    'hp': 'Himachal Pradesh',
    'himachal': 'Himachal Pradesh',
    'mp': 'Madhya Pradesh',
    'madhya': 'Madhya Pradesh',
    'tn': 'Tamil Nadu',
    'tamilnadu': 'Tamil Nadu',
    'wb': 'West Bengal',
    'westbengal': 'West Bengal',
    'uk': 'Uttarakhand',
    'uttarkhand': 'Uttarakhand',
    'rj': 'Rajasthan',
    'pb': 'Punjab',
    'hr': 'Haryana',
    'haryana': 'Haryana',
    'gurgaon': 'Haryana',
    'gurugram': 'Haryana',
    'faridabad': 'Haryana',
    'panchkula': 'Haryana',
    'telangana': 'Telangana',
    'ts': 'Telangana',
    'kerla': 'Kerala',
    'gj': 'Gujarat',
    'orissa': 'Odisha',
    'odisa': 'Odisha',
    'as': 'Assam',
    'br': 'Bihar',
    'jh': 'Jharkhand',
    'ga': 'Goa',
    'mn': 'Manipur',
    'ml': 'Meghalaya',
    'mz': 'Mizoram',
    'nl': 'Nagaland',
    'sk': 'Sikkim',
    'tr': 'Tripura'
  };

  if (mapping[s]) return mapping[s];

  const officialStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
    "Gujarat", "Haryana", "Himachal Pradesh", "Jammu & Kashmir", "Jharkhand",
    "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
    "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi"
  ];

  const match = officialStates.find(os =>
    os.toLowerCase() === s ||
    s.includes(os.toLowerCase()) ||
    os.toLowerCase().includes(s)
  );

  return match || state;
};

export const normalizeService = (service: string): string => {
  if (!service) return "";
  const s = service.toLowerCase().trim();
  if (s.includes('aadhaar') || s.includes('aadhar') || s.includes('adhar')) return 'aadhaar_update';
  if (s.includes('ration')) return 'ration_card';
  if (s.includes('pan')) return 'pan_card';
  if (s.includes('license') || s.includes('licence') || s.includes(' dl') || s === 'dl' || s.includes('driving')) return 'driving_license';
  if (s.includes('scheme') || s.includes('yojana') || s.includes('kisan') || s.includes('ayushman') || s.includes('awas') || s.includes('govt_schemes')) return 'govt_schemes';
  return s;
};

export const normalizeSubcase = (subcase: string, service?: string): string => {
  if (!subcase) return "";
  let s = subcase.toLowerCase().trim().replace(/[\s-]/g, '_');

  // Service-aware canonical subcase values — Gemini is prompted to return these exactly.
  // Only apply safe, unambiguous aliases here; never cross services.
  const safeAliases: Record<string, string> = {
    // aadhaar_update
    'address': 'address_change',
    'address_update': 'address_change',
    'mobile': 'mobile_update',
    'mobile_number': 'mobile_update',
    'phone': 'mobile_update',
    'phone_number': 'mobile_update',
    'name': 'name_correction',
    'name_change': 'name_correction',
    'dob': 'name_correction',
    // ration_card
    'new_application': 'new_application',
    'lost_card': 'lost_card',
    // pan_card
    'new_pan': 'new_pan',
    'new_pan_card': 'new_pan',
    'lost_pan': 'lost_pan',
    'lost_pan_card': 'lost_pan',
    // driving_license
    'learner': 'learner_license',
    'learners': 'learner_license',
    'learner_licence': 'learner_license',
    'permanent': 'permanent_dl',
    'permanent_license': 'permanent_dl',
    'renewal': 'dl_renewal',
    'duplicate': 'duplicate_dl',
    'lost_dl': 'duplicate_dl',
    'add_class': 'add_vehicle_class',
    'vehicle_class': 'add_vehicle_class',
    // govt_schemes
    'kisan': 'pm_kisan',
    'pm_kisan': 'pm_kisan',
    'ayushman': 'ayushman_bharat',
    'pmjay': 'ayushman_bharat',
    'urban_awas': 'pm_awas_urban',
    'rural_awas': 'pm_awas_gramin',
    'gramin_awas': 'pm_awas_gramin',
    // new schemes
    'ujjwala': 'pm_ujjwala',
    'lpg': 'pm_ujjwala',
    'gas': 'pm_ujjwala',
    'free_gas': 'pm_ujjwala',
    'vishwakarma': 'pm_vishwakarma',
    'artisan': 'pm_vishwakarma',
    'karigar': 'pm_vishwakarma',
    'craftsman': 'pm_vishwakarma',
    'darzi': 'pm_vishwakarma',
    'lohar': 'pm_vishwakarma',
    'kumhar': 'pm_vishwakarma',
    'nai': 'pm_vishwakarma',
    'mochi': 'pm_vishwakarma',
    'fasal_bima': 'pmfby',
    'crop_insurance': 'pmfby',
    'pmfby': 'pmfby',
    'kharif_bima': 'pmfby',
    'rabi_bima': 'pmfby',
    'fsal_bima': 'pmfby',
    'jeevan_jyoti': 'pmjjby',
    'pmjjby': 'pmjjby',
    'life_insurance': 'pmjjby',
    'jivan_jyoti': 'pmjjby',
    'suraksha_bima': 'pmsby',
    'pmsby': 'pmsby',
    'accident_insurance': 'pmsby',
    'durghatna_bima': 'pmsby',
    'jan_dhan': 'pmjdy',
    'pmjdy': 'pmjdy',
    'zero_balance': 'pmjdy',
    'jandhan': 'pmjdy',
    'bank_account': 'pmjdy',
    // shared (context-free — NEVER map 'new' without service context)
    'correction': 'correction',
  };

  // Context-aware aliases for ambiguous terms
  const serviceAwareAliases: Record<string, Record<string, string>> = {
    pan_card: {
      'new': 'new_pan',
      'apply': 'new_pan',
      'lost': 'lost_pan',
      'duplicate': 'lost_pan',
    },
    ration_card: {
      'new': 'new_application',
      'apply': 'new_application',
      'lost': 'lost_card',
      'duplicate': 'lost_card',
    },
    aadhaar_update: {
      'new': 'address_change',
    },
    driving_license: {
      'new': 'learner_license',
      'apply': 'learner_license',
      'lost': 'duplicate_dl',
    },
    govt_schemes: {
      'apply': 'pm_kisan', // fallback
      'lpg': 'pm_ujjwala',
      'gas': 'pm_ujjwala',
    }
  };

  // Try exact safe alias first
  if (safeAliases[s]) return safeAliases[s];

  // Try service-aware alias if service is known
  if (service && serviceAwareAliases[service]?.[s]) {
    return serviceAwareAliases[service][s];
  }

  return s;
};

export const detectIntent = async (userQuery: string, userState: string, currentLang: string) => {
  const systemPrompt = `You are SarkariSaathi AI. Your job is to extract intent from Indian citizens' queries about government services.

CRITICAL INSTRUCTIONS:
1. You must return the service slug as EXACTLY one of these five values ONLY:
   - "ration_card" — for any ration card query (BPL card, APL card, food ration, PDS)
   - "aadhaar_update" — for any Aadhaar / Adhar / UID query
   - "pan_card" — for any PAN card query (permanent account number, income tax card)
   - "driving_license" — for any Driving License / DL / License / Sarathi query
   - "govt_schemes" — for central government schemes (PM Kisan, Ayushman Bharat, PM Awas Yojana, Ujjwala, Vishwakarma, Fasal Bima, Insurance)

2. For each service, valid subcases are ONLY the following. NEVER return a subcase from a different service:
   - For "ration_card":    "new_application" | "correction" | "lost_card"
   - For "aadhaar_update": "address_change" | "mobile_update" | "name_correction"
   - For "pan_card":       "new_pan" | "lost_pan" | "correction"
   - For "driving_license": "learner_license" | "permanent_dl" | "dl_renewal" | "duplicate_dl" | "add_vehicle_class"
   - For "govt_schemes":    "pm_kisan" | "ayushman_bharat" | "pm_awas_urban" | "pm_awas_gramin" | "pm_ujjwala" | "pm_vishwakarma" | "pmfby" | "pmjjby" | "pmsby" | "pmjdy"

3. NEVER mix service and subcase from different services. For example:
   - PAN card query → service must be "pan_card", subcase must be one of: new_pan, lost_pan, correction
   - A new PAN card → service: "pan_card", subcase: "new_pan"  (NOT new_application)
   - A lost PAN card → service: "pan_card", subcase: "lost_pan" (NOT lost_card)
   - A new ration card → service: "ration_card", subcase: "new_application" (NOT new_pan)

STATES:
Extract the Indian state. If they mention a city like Gurgaon, return "Haryana". If they mention Mumbai, return "Maharashtra". If they mention NO state or city, use "${userState}".

RESPONSE FORMAT (JSON ONLY, no markdown, no explanation outside JSON):
{
  "service": "ration_card" | "aadhaar_update" | "pan_card" | "driving_license" | "govt_schemes" | null,
  "subcase": string,
  "state": string,
  "confidence": number,
  "explanation": string
}

User Query: "${userQuery}"`;

  try {
    const response = await getGeminiResponse(systemPrompt);
    if (!response) return null;

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const data = JSON.parse(jsonMatch[0]);

    if (data.service) data.service = normalizeService(data.service);
    // Pass service to normalizeSubcase so ambiguous terms ('new', 'lost') resolve correctly per service
    if (data.subcase) data.subcase = normalizeSubcase(data.subcase, data.service);
    if (data.state) data.state = normalizeState(data.state);

    console.log("=== GEMINI DETECTION ===");
    console.log("Input:", userQuery);
    console.log("Detected:", data);
    console.log("Redirecting to:", data.service && data.subcase && data.state
      ? `/guide/${data.service}/${data.subcase}/${data.state}`
      : 'No redirect (incomplete data)');
    console.log("========================");

    return data;
  } catch (err) {
    console.error("detectIntent Error:", err);
    throw err;
  }
};
