"""
AgriVoice AI - Agricultural Knowledge Base
Comprehensive multi-lingual (English & Tamil) crop disease and farming knowledge repository.
Contains clinical agricultural data for major crops: Rice, Tomato, Potato, Corn, Cotton, Chilli, Banana.
"""

from typing import Dict, Any, List, Optional

DISEASE_DATABASE: Dict[str, Dict[str, Any]] = {
    "rice_leaf_blast": {
        "id": "rice_leaf_blast",
        "crop_en": "Rice (Paddy)",
        "crop_ta": "நெல் (பயிர்)",
        "disease_en": "Leaf Blast",
        "disease_ta": "இலை கருகல் நோய் (பிளாஸ்ட் நோய்)",
        "scientific_name": "Magnaporthe oryzae (Pyricularia oryzae)",
        "is_healthy": False,
        "severity": "high",
        "typical_confidence": 0.94,
        "symptoms_en": [
            "Spindle or diamond-shaped lesions with gray/whitish centers and dark brown borders",
            "Lesions enlarge and coalesce, causing entire leaf blades to wither and dry up",
            "Neck rot or nodal infection leading to unfilled or chaffy grains"
        ],
        "symptoms_ta": [
            "இலைகளில் கண் வடிவம் அல்லது கதிர் போன்ற பழுப்பு நிறப் புள்ளிகள் தோன்றும்",
            "புள்ளிகளின் நடுப்பகுதி சாம்பல் நிறமாகவும், விளிம்பு அடர் பழுப்பு நிறமாகவும் மாறும்",
            "நோய் தீவிரமடைந்தால் இலைகள் முற்றிலும் கருகி வைக்கோல் போல் காய்ந்துவிடும்"
        ],
        "causes_en": [
            "Fungal pathogen Magnaporthe oryzae",
            "High humidity (>90%) and frequent rainfall/cloudy weather",
            "Excessive use of chemical nitrogen fertilizers (Urea)",
            "Cool night temperatures (17-23°C) with morning dew"
        ],
        "causes_ta": [
            "மேக்னபோர்த்தே ஒரைசே என்ற பூஞ்சாணத் தொற்று",
            "அதிகப்படியான யூரியா (நைட்ரஜன்) உரம் இடுதல்",
            "தொடர் மழை, பனிப்பொழிவு மற்றும் 90%க்கும் அதிகமான காற்றின் ஈரப்பதம்",
            "குளிர்ந்த இரவு நேர வெப்பநிலை மற்றும் நெல் வயலில் தேங்கும் அதிக நீர்"
        ],
        "treatments_en": [
            "Spray Tricyclazole 75% WP @ 1g/liter of water OR Isoprothiolane 40% EC @ 1.5ml/liter",
            "Alternatively spray Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml/liter",
            "Stop or delay top-dressing of Urea immediately until the disease is controlled",
            "Ensure proper drainage in fields with standing stagnant water"
        ],
        "treatments_ta": [
            "டிரைசைக்ளசோல் 75% WP மருந்தை ஒரு லிட்டர் தண்ணீருக்கு 1 கிராம் அல்லது ஐசோபுரோதியோலேன் 1.5 மிலி கலந்து தெளிக்கவும்",
            "உடனடியாக யூரியா உரம் இடுவதை தற்காலிகமாக நிறுத்த வேண்டும்",
            "வயலில் தேங்கியுள்ள பழைய நீரை வடித்துவிட்டு புதிய நீர் பாய்ச்சவும்",
            "மாலை வேளையில் மருந்து தெளிப்பது சிறந்த பலன் தரும்"
        ],
        "organic_remedies_en": [
            "Foliar spray of Pseudomonas fluorescens @ 2.5kg/ha (or 10g/liter of water)",
            "Spray 3% Neem oil or Neem seed kernel extract (NSKE 5%) with soap emulsifier",
            "Apply Panchagavya (30ml/liter) in early stages to boost plant immunity"
        ],
        "organic_remedies_ta": [
            "சூடோமோனாஸ் புளோரசன்ஸ் 10 கிராம் ஒரு லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்",
            "5% வேப்பங்கொட்டை சாறு அல்லது வேப்பெண்ணெய் (30 மிலி/லிட்டர்) தெளிக்கவும்",
            "பயிரின் நோய் எதிர்ப்பு சக்தியை அதிகரிக்க 3% பஞ்சகாவ்யா தெளிக்கவும்"
        ],
        "prevention_en": [
            "Use certified blast-resistant varieties like ADT 43, TPS 5, CO 51",
            "Seed treatment with Trichoderma viride @ 4g/kg or Pseudomonas @ 10g/kg before sowing",
            "Maintain optimal plant spacing to avoid dense canopy humidity",
            "Apply balanced fertilizers with adequate Potash (MOP)"
        ],
        "prevention_ta": [
            "பிளாஸ்ட் நோயை எதிர்க்கும் சான்றளிக்கப்பட்ட விதை ரகங்களை (ADT 43, CO 51) பயிரிடவும்",
            "விதைப்பதற்கு முன் சூடோமோனாஸ் (10 கிராம்/கிலோ) மூலம் விதை நேர்த்தி செய்யவும்",
            "பயிர்களுக்கு இடையே போதிய இடைவெளி விட்டு நடவு செய்யவும்",
            "சாம்பல் சத்து (பொட்டாஷ்) உரத்தை பரிந்துரைக்கப்பட்ட அளவில் இடவும்"
        ]
    },
    "rice_brown_spot": {
        "id": "rice_brown_spot",
        "crop_en": "Rice (Paddy)",
        "crop_ta": "நெல் (பயிர்)",
        "disease_en": "Brown Spot",
        "disease_ta": "பழுப்பு புள்ளி நோய்",
        "scientific_name": "Bipolaris oryzae (Helminthosporium oryzae)",
        "is_healthy": False,
        "severity": "moderate",
        "typical_confidence": 0.91,
        "symptoms_en": [
            "Small oval to circular dark brown spots on leaf blades and glumes",
            "Spots have a yellow halo surrounding the brown necrotic center",
            "Infected seeds become discolored and seedlings show poor vigor"
        ],
        "symptoms_ta": [
            "இலைகளின் மேல் சிறிய வட்டமான அல்லது முட்டை வடிவ பழுப்பு நிறப் புள்ளிகள் தோன்றும்",
            "புள்ளிகளைச் சுற்றி ஒரு மெல்லிய மஞ்சள் நிற வளையம் காணப்படும்",
            "தானியங்களின் உமியிலும் கரும்பழுப்பு நிறப் புள்ளிகள் ஏற்பட்டு விளைச்சல் குறையும்"
        ],
        "causes_en": [
            "Fungal infection often associated with poor soil fertility, zinc, or silica deficiency",
            "Water stress or irregular irrigation",
            "High humidity and cloudy overcast weather"
        ],
        "causes_ta": [
            "மண்ணில் சத்து குறைபாடு, குறிப்பாக துத்தநாகம் (Zinc) அல்லது பொட்டாஷ் குறைபாடு",
            "வறட்சி அல்லது சீரற்ற பாசனம்",
            "ஹெல்மிந்தோஸ்போரியம் ஒரைசே என்ற பூஞ்சாணத் தொற்று"
        ],
        "treatments_en": [
            "Spray Mancozeb 75% WP @ 2g/liter or Propiconazole 25% EC @ 1ml/liter",
            "Foliar application of Micronutrient mix containing Zinc Sulphate (0.5%) + Urea (1%)",
            "Maintain continuous shallow flooding in the paddy field"
        ],
        "treatments_ta": [
            "மேன்கோசெப் (Mancozeb) 2 கிராம் அல்லது புரோபிகோனசோல் 1 மிலி ஒரு லிட்டர் நீரில் கலந்து தெளிக்கவும்",
            "துத்தநாக சல்பேட் (Zinc Sulphate 0.5%) நுண்ணூட்ட உரம் தெளிக்கவும்",
            "வயலில் வறட்சி ஏற்படாமல் சீரான நீர் மேலாண்மையை பராமரிக்கவும்"
        ],
        "organic_remedies_en": [
            "Spray Panchagavya 3% or Vermiwash to replenish soil and foliar nutrients",
            "Foliar spray of Pseudomonas fluorescens @ 10g/liter"
        ],
        "organic_remedies_ta": [
            "மண்ணின் சத்தை மீட்க 3% பஞ்சகாவ்யா அல்லது மண்புழு உரம் தெளிக்கவும்",
            "சூடோமோனாஸ் 10 கிராம்/லிட்டர் தெளிக்கவும்"
        ],
        "prevention_en": [
            "Apply recommended Zinc Sulphate @ 25 kg/ha at basal transplanting",
            "Seed treatment with Carboxin + Thiram @ 2g/kg seed",
            "Avoid nutritional stress during the tillering and panicle initiation phases"
        ],
        "prevention_ta": [
            "நடவு வயலில் ஏக்கருக்கு 10 கிலோ ஜிங்க் சல்பேட் உரத்தை இடவும்",
            "விதை நேர்த்தி செய்த விதைகளை மட்டுமே பயன்படுத்தவும்",
            "பயிர் தூர் கட்டும் பருவத்தில் சீரான பாசனம் கொடுக்கவும்"
        ]
    },
    "rice_bacterial_blight": {
        "id": "rice_bacterial_blight",
        "crop_en": "Rice (Paddy)",
        "crop_ta": "நெல் (பயிர்)",
        "disease_en": "Bacterial Leaf Blight",
        "disease_ta": "பாக்டீரியா இலை கருகல் நோய்",
        "scientific_name": "Xanthomonas oryzae pv. oryzae",
        "is_healthy": False,
        "severity": "high",
        "typical_confidence": 0.93,
        "symptoms_en": [
            "Water-soaked lesions on leaf margins turning wavy yellow-white and drying backwards",
            "Bacterial ooze droplets visible on infected leaves in early morning",
            "Leaves turn dull straw-colored and roll upwards"
        ],
        "symptoms_ta": [
            "இலைகளின் நுனி மற்றும் ஓரங்களில் நீர் ஊறிய மஞ்சள் நிற அலை போன்ற கோடுகள் தோன்றும்",
            "காலை வேளையில் இலைகளின் ஓரங்களில் பாக்டீரியா திரவத் துளிகள் (Ooze) காணப்படும்",
            "இலைகள் காய்ந்து வைக்கோல் நிறமாக மாறி மேல்நோக்கி சுருண்டுவிடும்"
        ],
        "causes_en": [
            "Bacterium Xanthomonas oryzae entering through leaf hydathodes or wounds",
            "Heavy rain with strong cyclonic winds causing leaf bruising",
            "Deep stagnant water and excess nitrogen fertilizers"
        ],
        "causes_ta": [
            "சாந்தோமோனாஸ் ஒரைசே பாக்டீரியா தொற்று",
            "சூறாவளிக் காற்றுடன் கூடிய பலத்த மழை மற்றும் இலைகளில் ஏற்படும் காயங்கள்",
            "தேங்கி நிற்கும் நீர் மற்றும் அதிகப்படியான தழைச்சத்து உரம்"
        ],
        "treatments_en": [
            "Spray Streptocycline @ 0.1g/liter + Copper Oxychloride 50% WP @ 2.5g/liter",
            "Drain excess water from the field for 3-4 days to arrest bacterial spread",
            "Apply extra Potassium (MOP @ 20 kg/acre) to build bacterial resistance"
        ],
        "treatments_ta": [
            "ஸ்ட்ரெப்டோமைசின் (Streptocycline) 1 கிராம் மற்றும் காப்பர் ஆக்சிகுளோரைடு 25 கிராம் 10 லிட்டர் நீரில் கலந்து தெளிக்கவும்",
            "வயலில் உள்ள நீரை உடனடியாக முழுமையாக வடித்துவிடவும்",
            "ஏக்கருக்கு 10-15 கிலோ பொட்டாஷ் உரம் கூடுதலாக இடவும்"
        ],
        "organic_remedies_en": [
            "Spray Fresh Cow Dung extract (20% filtrate) or Panchagavya",
            "Foliar spray of Pseudomonas fluorescens @ 10g/liter"
        ],
        "organic_remedies_ta": [
            "சாண எரிவுக் கரைசல் (20% பசுஞ்சாணி தெளிவு நீர்) தெளிப்பது நாட்டுப்புற சிறந்த நிவாரணம்",
            "சூடோமோனாஸ் புளோரசன்ஸ் 10 கிராம்/லிட்டர் கலந்து தெளிக்கவும்"
        ],
        "prevention_en": [
            "Grow resistant cultivars like Improved Samba Mahsuri or IR 64",
            "Avoid clipping seedling leaf tips during transplantation",
            "Avoid field-to-field flow of irrigation water from infected plots"
        ],
        "prevention_ta": [
            "நடவின் போது நாற்றுகளின் இலை நுனிகளை கிள்ளி நடுதலை தவிர்க்கவும்",
            "நோய் தாக்கிய வயலில் இருந்து மற்ற வயல்களுக்கு தண்ணீர் பாய்வதை தடுக்கவும்"
        ]
    },
    "rice_healthy": {
        "id": "rice_healthy",
        "crop_en": "Rice (Paddy)",
        "crop_ta": "நெல் (பயிர்)",
        "disease_en": "Healthy Crop",
        "disease_ta": "ஆரோக்கியமான நெற்பயிர்",
        "scientific_name": "Oryza sativa (Healthy)",
        "is_healthy": True,
        "severity": "none",
        "typical_confidence": 0.98,
        "symptoms_en": [
            "Vibrant green leaf blades with uniform upright posture",
            "No spots, necrotic lesions, yellowing, or edge withering",
            "Vigorous tillering and healthy white root system"
        ],
        "symptoms_ta": [
            "பயிரின் இலைகள் பளபளப்பான அடர் பச்சை நிறத்துடன் நேராக செழிப்பாக உள்ளன",
            "எந்தவிதமான கரும்புள்ளிகள், கருகல் அல்லது பூச்சித் தாக்குதல் அறிகுறிகள் இல்லை",
            "ஆரோக்கியமான தூர் கட்டுதல் மற்றும் வெண்மையான வேர்கள் உள்ளன"
        ],
        "causes_en": ["Optimal agronomic conditions, balanced fertilization, and good soil health"],
        "causes_ta": ["சரியான நீர்ப்பாசனம், உகந்த இயற்கை ஊட்டச்சத்து மற்றும் நல்ல பராமரிப்பு"],
        "treatments_en": [
            "No chemical pesticide required. Continue regular weed and water management.",
            "Maintain alternate wetting and drying (AWD) irrigation to save water."
        ],
        "treatments_ta": [
            "பூச்சிக்கொல்லி மருந்து எதுவும் தேவையில்லை. வழக்கமான பாசனத்தை தொடரவும்.",
            "காய்ச்சலும் பாய்ச்சலுமாக நீர் பாய்ச்சி வேர்களுக்கு காற்றோட்டம் கிடைக்குமாறு செய்யவும்."
        ],
        "organic_remedies_en": [
            "Apply Panchagavya or Fish Amino Acid @ 3% spray every 15 days to enhance tillering"
        ],
        "organic_remedies_ta": [
            "15 நாட்களுக்கு ஒருமுறை பஞ்சகாவ்யா அல்லது மீன் அமிலம் தெளித்து செழிப்பை அதிகரிக்கலாம்"
        ],
        "prevention_en": ["Regular field scouting and timely weed removal"],
        "prevention_ta": ["வாரம் ஒருமுறை வயலை கண்காணித்து களைகளை அகற்றவும்"]
    },
    "tomato_early_blight": {
        "id": "tomato_early_blight",
        "crop_en": "Tomato",
        "crop_ta": "தக்காளி",
        "disease_en": "Early Blight",
        "disease_ta": "முன் பருவ கருகல் நோய்",
        "scientific_name": "Alternaria solani",
        "is_healthy": False,
        "severity": "moderate",
        "typical_confidence": 0.92,
        "symptoms_en": [
            "Concentric ring 'target board' pattern on older lower leaves",
            "Yellow halo surrounding brown necrotic spots",
            "Defoliation starting from the bottom of the plant moving upwards"
        ],
        "symptoms_ta": [
            "கீழ் இலைகளில் வட்ட வளையங்கள் (இலக்கு பலகை போன்ற வடிவம்) கொண்ட பழுப்பு நிறப் புள்ளிகள்",
            "புள்ளிகளைச் சுற்றி இலை மஞ்சள் நிறமாக மாறுதல்",
            "கீழ் இலைகள் உதிர்ந்து செடி வெறிச்சோடி போதல்"
        ],
        "causes_en": [
            "Alternaria solani fungus thriving in warm temperatures (24-29°C) and alternating wet and dry periods",
            "Rain splash carrying soil fungal spores to lower leaves"
        ],
        "causes_ta": [
            "ஆல்டர்நேரியா சொலானி பூஞ்சாணம்",
            "மழைத்துளி தெறிப்பதன் மூலம் மண்ணிலுள்ள வித்துக்கள் கீழ் இலைகளில் ஒட்டுதல்",
            "அதிக வெப்பமும் ஈரப்பதமும் மாறி மாறி நிலவுதல்"
        ],
        "treatments_en": [
            "Spray Chlorothalonil 75% WP @ 2g/liter or Mancozeb @ 2.5g/liter",
            "Prune infected lower branches and burn or bury away from field",
            "Avoid overhead irrigation; use drip irrigation"
        ],
        "treatments_ta": [
            "குளோரோதலோனில் (Chlorothalonil) 2 கிராம் அல்லது மேன்கோசெப் 2.5 கிராம் ஒரு லிட்டர் நீரில் தெளிக்கவும்",
            "பாதிக்கப்பட்ட அடி இலைகளை வெட்டி வயலுக்கு வெளியே அப்புறப்படுத்தவும்",
            "செடியின் மேல் நீர் தெளிக்காமல் தரைவழியாக நீர் பாய்ச்சவும் (சொட்டு நீர் பாசனம் சிறந்தது)"
        ],
        "organic_remedies_en": [
            "Baking soda spray (5g baking soda + 5ml vegetable oil + 1 liter water)",
            "Trichoderma harzianum soil and foliar application"
        ],
        "organic_remedies_ta": [
            "சமையல் சோடா கரைசல் (5 கிராம் சோடா + 5 மிலி நல்லெண்ணெய் 1 லிட்டர் நீரில் கலந்து) தெளிக்கவும்",
            "டிரைக்கோடெர்மா விரிடி இயற்கை பூஞ்சாணக் கரைசல் தெளிக்கவும்"
        ],
        "prevention_en": [
            "Practice 2-3 year crop rotation away from Solanaceous crops (potato, brinjal)",
            "Mulch the soil bed with straw or plastic film to prevent soil splash"
        ],
        "prevention_ta": [
            "தக்காளிக்கு பின் உருளை அல்லது கத்திரிக்காய் நடாமல் பயிர் சுழற்சி செய்யவும்",
            "மண்ணின் மேல் வைக்கோல் கொண்டு மூடாக்கு இடவும்"
        ]
    },
    "tomato_late_blight": {
        "id": "tomato_late_blight",
        "crop_en": "Tomato",
        "crop_ta": "தக்காளி",
        "disease_en": "Late Blight",
        "disease_ta": "பின் பருவ கருகல் நோய்",
        "scientific_name": "Phytophthora infestans",
        "is_healthy": False,
        "severity": "high",
        "typical_confidence": 0.95,
        "symptoms_en": [
            "Large, irregular water-soaked dark lesions on leaves and stems",
            "White velvety fungal mildew visible on the undersides of leaves during humid mornings",
            "Fruit develops greasy brown sunken firm rot"
        ],
        "symptoms_ta": [
            "இலைகள் மற்றும் தண்டுகளில் நீர் ஊறிய கரும்பழுப்பு நிற பெரிய திட்டுகள்",
            "ஈரப்பதம் நிறைந்த காலை வேளையில் இலைகளின் அடிப்பகுதியில் வெள்ளை நிற பஞ்சு போன்ற பூஞ்சான வளர்ச்சி",
            "காய்களில் சொர சொரப்பான கரும்பழுப்பு நிற அழுகல் ஏற்படுதல்"
        ],
        "causes_en": [
            "Oomycete Phytophthora infestans",
            "Cool, damp, wet weather with continuous leaf wetness (>10 hours) and temperatures 15-20°C"
        ],
        "causes_ta": [
            "பைட்டோப்தோரா இன்ஃபெஸ்டான்ஸ் பூஞ்சாணம்",
            "குளிர்ந்த பனி மூட்டம் மற்றும் தொடர் தூறல் மழை",
            "இலைகளில் தொடர்ந்து 10 மணி நேரத்திற்கு மேல் நீர் தங்கியிருத்தல்"
        ],
        "treatments_en": [
            "Spray Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ) @ 2g/liter",
            "Alternatively Dimethomorph 50% WP @ 1g/liter or Cymoxanil + Mancozeb",
            "Destroy severely infected plants immediately to prevent epidemic spread"
        ],
        "treatments_ta": [
            "ரிடோமில் எம்.இசட் (Metalaxyl + Mancozeb) 2 கிராம் ஒரு லிட்டர் தண்ணீரில் கலந்து உடனடியாக தெளிக்கவும்",
            "அல்லது டைமெத்தோமார்ப் (Dimethomorph) 1 கிராம்/லிட்டர் தெளிக்கவும்",
            "முற்றிலும் தாக்கப்பட்ட செடிகளை உடனே பிடுங்கி தீயிட்டு அழிக்கவும்"
        ],
        "organic_remedies_en": [
            "Copper hydroxide (Bordeaux mixture 1%) preventive foliar spray",
            "Bacillus subtilis biological formulation"
        ],
        "organic_remedies_ta": [
            "1% போர்டோ கலவை தெளித்து நோய் பரவுவதை தடுக்கவும்",
            "பேசில்லஸ் சப்டிலிஸ் நுண்ணுயிர் தெளிக்கவும்"
        ],
        "prevention_en": [
            "Ensure wide plant spacing for rapid leaf drying and air circulation",
            "Use certified resistant hybrid varieties"
        ],
        "prevention_ta": [
            "செடிகளுக்கு இடையே போதிய காற்று புழக்கம் இருக்குமாறு இடைவெளி விடவும்",
            "பனிப்பொழிவு காலங்களில் முன்கூட்டியே போர்டோ கலவை தெளித்து வைக்கவும்"
        ]
    },
    "tomato_leaf_curl": {
        "id": "tomato_leaf_curl",
        "crop_en": "Tomato",
        "crop_ta": "தக்காளி",
        "disease_en": "Leaf Curl Virus",
        "disease_ta": "இலை சுருட்டு வைரஸ் நோய்",
        "scientific_name": "Tomato Yellow Leaf Curl Virus (TYLCV)",
        "is_healthy": False,
        "severity": "high",
        "typical_confidence": 0.96,
        "symptoms_en": [
            "Upward or downward cupping/curling and puckering of young leaves",
            "Severe yellowing (chlorosis) of leaf margins and stunted bushy plant growth",
            "Flower drop and drastic reduction in fruit setting"
        ],
        "symptoms_ta": [
            "இளந்தளிர்கள் மேல்நோக்கி அல்லது கீழ்நோக்கி சுருண்டு படகு போன்று மாறுதல்",
            "இலை விளிம்புகள் மஞ்சள் நிறமடைந்து செடி குட்டையாகி புதர் போல மாறுதல்",
            "பூக்கள் கொட்டி பிஞ்சுகள் பிடிக்காமல் போதல்"
        ],
        "causes_en": [
            "Tomato yellow leaf curl virus transmitted by Whitefly vector (Bemisia tabaci)",
            "Hot, dry periods favoring massive whitefly multiplication"
        ],
        "causes_ta": [
            "வெள்ளை ஈக்கள் (Whitefly) மூலமாக பரவும் வைரஸ் கிருமி",
            "வறண்ட வெயில் காலத்தில் வெள்ளை ஈக்கள் பெருக்கம் அடைதல்"
        ],
        "treatments_en": [
            "Control Whitefly vector: Spray Acetamiprid 20% SP @ 0.5g/liter OR Imidacloprid 17.8% SL @ 0.5ml/liter",
            "Alternatively spray Diafenthiuron 50% WP @ 1g/liter",
            "Install yellow sticky traps (15-20 traps per acre) to trap adult whiteflies"
        ],
        "treatments_ta": [
            "வைரஸை பரப்பும் வெள்ளை ஈக்களை கட்டுப்படுத்த இமிடாக்ளோப்ரிட் (0.5 மிலி/லிட்டர்) அல்லது அசிடமிப்ரிட் (0.5 கிராம்/லிட்டர்) தெளிக்கவும்",
            "வயலில் ஏக்கருக்கு 15 முதல் 20 மஞ்சள் ஒட்டும் பொறிகளை (Yellow sticky traps) வைக்கவும்",
            "வைரஸ் தாக்கிய ஆரம்ப செடிகளை பிடுங்கி அப்புறப்படுத்தவும்"
        ],
        "organic_remedies_en": [
            "Spray 5% Neem Seed Kernel Extract (NSKE) or Fish Oil Rosin Soap (25g/liter)",
            "Intercrop with 2 rows of Maize or Sorghum around tomato plots as barrier crop"
        ],
        "organic_remedies_ta": [
            "வேப்பங்கொட்டை சாறு 5% அல்லது புங்கன் எண்ணெய் சோப் தெளிக்கவும்",
            "வயலைச் சுற்றி மக்காச்சோளம் அல்லது சோளம் பயிரிட்டு வெள்ளை ஈக்கள் உள்ளே நுழைவதை தடுக்கவும்"
        ],
        "prevention_en": [
            "Grow vector-resistant tomato hybrids",
            "Use 40-mesh insect-proof netting in seedling nurseries"
        ],
        "prevention_ta": [
            "நாற்றங்காலில் நைலான் வலை அமைத்து வெள்ளை ஈ தாக்காமல் நாற்றுகளை வளர்க்கவும்",
            "நோய் எதிர்ப்பு திறன் கொண்ட வீரிய ஒட்டு ரகங்களை பயிரிடவும்"
        ]
    },
    "potato_late_blight": {
        "id": "potato_late_blight",
        "crop_en": "Potato",
        "crop_ta": "உருளைக்கிழங்கு",
        "disease_en": "Late Blight",
        "disease_ta": "பின் பருவ கருகல் நோய்",
        "scientific_name": "Phytophthora infestans",
        "is_healthy": False,
        "severity": "high",
        "typical_confidence": 0.94,
        "symptoms_en": [
            "Dark water-soaked lesions expanding rapidly on leaves, turning black and rotting",
            "White fungal growth under leaves during wet mornings",
            "Brownish dry rot penetrating into tubers"
        ],
        "symptoms_ta": [
            "இலைகளில் நீர் ஊறிய கரும்பழுப்பு நிற கருகல் திட்டுகள் விரைவாக பரவுதல்",
            "பனிப்பொழிவு உள்ள காலை வேளையில் இலை அடியில் வெள்ளை பூஞ்சான படலம்",
            "பூமிக்குள் உள்ள கிழங்குகள் பழுப்பு நிறமாகி அழுகி துர்நாற்றம் வீசுதல்"
        ],
        "causes_en": [
            "Phytophthora infestans fungus favored by low temperature (12-18°C) and high humidity (>90%)",
            "Infected seed tubers"
        ],
        "causes_ta": [
            "குளிர்ந்த சீதோஷ்ண நிலை மற்றும் 90%க்கும் அதிகமான ஈரப்பதம்",
            "நோய் தாக்கிய விதைக்கிழங்குகளை பயன்படுத்துதல்"
        ],
        "treatments_en": [
            "Spray Cymoxanil 8% + Mancozeb 64% WP (Curzate) @ 2.5g/liter",
            "Alternatively Fenamidone + Mancozeb (Sectin) @ 2g/liter",
            "Stop irrigation 10-14 days before harvest"
        ],
        "treatments_ta": [
            "சைமாக்ஸனில் + மேன்கோசெப் 2.5 கிராம் ஒரு லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்",
            "அறுவடைக்கு 10 நாட்களுக்கு முன்பாக பாசனத்தை நிறுத்தவும்"
        ],
        "organic_remedies_en": ["Bordeaux mixture 1% spray every 10 days", "Pseudomonas spray"],
        "organic_remedies_ta": ["1% போர்டோ கலவை தெளிக்கவும்", "சூடோமோனாஸ் தெளிக்கவும்"],
        "prevention_en": ["Plant certified disease-free seed tubers", "Earthing up soil well over developing tubers"],
        "prevention_ta": ["சான்றளிக்கப்பட்ட விதைக்கிழங்குகளை மட்டுமே நடவு செய்யவும்", "கிழங்குகள் வெளியில் தெரியாதவாறு நன்கு மண் அணைக்கவும்"]
    },
    "corn_common_rust": {
        "id": "corn_common_rust",
        "crop_en": "Corn (Maize)",
        "crop_ta": "மக்காச்சோளம்",
        "disease_en": "Common Rust",
        "disease_ta": "துரு நோய்",
        "scientific_name": "Puccinia sorghi",
        "is_healthy": False,
        "severity": "moderate",
        "typical_confidence": 0.93,
        "symptoms_en": [
            "Golden-brown to cinnamon-brown pustules on both upper and lower leaf surfaces",
            "Pustules rupture epidermal surface releasing powdery brown spores",
            "Severe cases cause premature leaf death and poor ear filling"
        ],
        "symptoms_ta": [
            "இலைகளின் மேல் மற்றும் கீழ் பரப்புகளில் செம்பழுப்பு நிற கொப்புளங்கள் தோன்றுதல்",
            "கொப்புளங்கள் வெடித்து பழுப்பு நிற துகள் போன்ற வித்துக்கள் காற்றில் பரவுதல்",
            "இலைகள் காய்ந்து மக்காச்சோள கதிரில் மணிகள் சரிவர முதிராமல் போதல்"
        ],
        "causes_en": [
            "Fungus Puccinia sorghi airborne spores carried by wind currents",
            "Cool temperatures (16-25°C) with high relative humidity (>95%)"
        ],
        "causes_ta": [
            "காற்றின் மூலம் பரவும் பூஞ்சாண வித்துக்கள்",
            "குளிர்ந்த வானிலையும் அதிக பனிப்பொழிவும்"
        ],
        "treatments_en": [
            "Spray Azoxystrobin 23% SC @ 1ml/liter or Mancozeb 75% WP @ 2.5g/liter",
            "Ensure spray thoroughly covers both surfaces of upper leaves"
        ],
        "treatments_ta": [
            "அஸாக்சிஸ்ட்ரோபின் (1 மிலி/லிட்டர்) அல்லது மேன்கோசெப் (2.5 கிராம்/லிட்டர்) தெளிக்கவும்",
            "இலையின் இருபுறமும் மருந்து படுமாறு தெளிக்க வேண்டும்"
        ],
        "organic_remedies_en": ["Spray Wettable Sulphur 80% WP @ 2g/liter", "Neem oil spray"],
        "organic_remedies_ta": ["கந்தகத்தூள் (Wettable Sulphur) 2 கிராம்/லிட்டர் தெளிக்கவும்", "வேப்பெண்ணெய் கரைசல் தெளிக்கவும்"],
        "prevention_en": ["Plant rust-resistant maize hybrids", "Early planting to avoid peak fungal spore season"],
        "prevention_ta": ["துரு நோயை எதிர்க்கும் மக்காச்சோள ரகங்களை பயிரிடவும்", "பருவத்திற்கு முன்பே விதைத்து நோயை தவிர்க்கவும்"]
    },
    "cotton_leaf_curl": {
        "id": "cotton_leaf_curl",
        "crop_en": "Cotton",
        "crop_ta": "பருத்தி",
        "disease_en": "Leaf Curl Virus",
        "disease_ta": "இலை சுருட்டு நோய்",
        "scientific_name": "Cotton Leaf Curl Virus (CLCuV)",
        "is_healthy": False,
        "severity": "high",
        "typical_confidence": 0.95,
        "symptoms_en": [
            "Upward or downward curling of leaf margins with thickening of main veins",
            "Enation (leaf-like outgrowths) on the underside of leaves",
            "Stunted plant growth and significant boll drop"
        ],
        "symptoms_ta": [
            "இலை நரம்புகள் தடித்து இலைகள் மேல்நோக்கி கிண்ணம் போல் சுருண்டு போதல்",
            "இலைகளின் அடியில் சிறு இலை போன்ற வளர்ச்சி (Enation) ஏற்படுதல்",
            "செடி வளர்ச்சி குன்றி காய்கள் பிடிக்காமல் கொட்டிவிடுதல்"
        ],
        "causes_en": ["Begomovirus transmitted by Whitefly (Bemisia tabaci)"],
        "causes_ta": ["வெள்ளை ஈக்கள் மூலம் பரவும் வைரஸ் நோய்"],
        "treatments_en": [
            "Control Whitefly: Spray Flonicamid 50% WG @ 0.3g/liter OR Pyriproxyfen 10% EC @ 2ml/liter",
            "Rogue out and destroy infected plants in early vegetative stage"
        ],
        "treatments_ta": [
            "வெள்ளை ஈயை அழிக்க ஃபுளோனிகமிட் 0.3 கிராம் அல்லது பைரிப்ராக்சிபென் 2 மிலி தெளிக்கவும்",
            "தாக்கப்பட்ட செடிகளை ஆரம்பத்திலேயே பிடுங்கி எரிக்கவும்"
        ],
        "organic_remedies_en": ["Yellow sticky traps (25/acre)", "5% Neem seed kernel extract (NSKE)"],
        "organic_remedies_ta": ["மஞ்சள் வண்ண ஒட்டுப்பொறிகள் அமைக்கவும்", "வேப்பங்கொட்டை சாறு 5% தெளிக்கவும்"],
        "prevention_en": ["Cultivate CLCuV-resistant Bt cotton hybrids", "Keep field free of weed hosts like Abutilon"],
        "prevention_ta": ["நோய் எதிர்ப்பு சக்தி கொண்ட பருத்தி ரகங்களை நடவு செய்யவும்", "வயல் வரப்புகளில் உள்ள துத்தி போன்ற களைகளை அழிக்கவும்"]
    },
    "chilli_leaf_curl": {
        "id": "chilli_leaf_curl",
        "crop_en": "Chilli / Pepper",
        "crop_ta": "மிளகாய்",
        "disease_en": "Leaf Curl Virus & Thrips Complex",
        "disease_ta": "இலை சுருட்டு மற்றும் இலைப்பேன் நோய்",
        "scientific_name": "Chilli leaf curl virus & Scirtothrips dorsalis",
        "is_healthy": False,
        "severity": "high",
        "typical_confidence": 0.94,
        "symptoms_en": [
            "Upward curling of leaves resembles a boat due to thrips sucking sap",
            "Downward curling caused by mite infestation",
            "Leaves become brittle, small, puckered with short internodes"
        ],
        "symptoms_ta": [
            "இலைப்பேன் தாக்கியதால் இலைகள் படகு போல மேல்நோக்கி சுருங்குதல்",
            "சாறு உறிஞ்சும் சிலந்தி தாக்கியதால் இலைகள் கீழ்நோக்கி சுருங்குதல்",
            "இலைகள் தடித்து நொறுங்கும் தன்மையுடன் செடி புதர் போல் மாறுதல்"
        ],
        "causes_en": ["Thrips (Scirtothrips dorsalis), Yellow mites (Polyphagotarsonemus latus), and Whiteflies"],
        "causes_ta": ["இலைப்பேன், சாறு உறிஞ்சும் வெள்ளை ஈ மற்றும் மஞ்சள் சிலந்தி பூச்சிகள்"],
        "treatments_en": [
            "For Thrips: Spray Fipronil 5% SC @ 1.5ml/liter or Spinetoram 11.7% SC @ 1ml/liter",
            "For Mites: Spray Spiromesifen 22.9% SC @ 1ml/liter or Propargite 57% EC @ 2ml/liter",
            "Apply Blue sticky traps for Thrips (15/acre)"
        ],
        "treatments_ta": [
            "இலைப்பேனுக்கு: பிப்ரோனில் (1.5 மிலி/லிட்டர்) அல்லது ஸ்பைனோடொரம் 1 மிலி தெளிக்கவும்",
            "மஞ்சள் சிலந்திக்கு: ஸ்பைரோமெசிஃபென் 1 மிலி/லிட்டர் தெளிக்கவும்",
            "வயலில் நீல நிற ஒட்டும் பொறிகளை (Blue sticky traps) ஏக்கருக்கு 15 வைக்கவும்"
        ],
        "organic_remedies_en": ["Spray Agni Astra or Garlic-Chilli-Ginger extract", "Neem oil 10,000 ppm @ 3ml/liter"],
        "organic_remedies_ta": ["அக்னி அஸ்திரம் அல்லது இஞ்சி-பூண்டு கரைசல் தெளிக்கவும்", "வேப்பெண்ணெய் 3 மிலி/லிட்டர் தெளிக்கவும்"],
        "prevention_en": ["Intercrop with Coriander or Marigold", "Avoid excess chemical nitrogenous fertilizers"],
        "prevention_ta": ["மிளகாயுடன் கொத்தமல்லி அல்லது சாமந்தி பூவை ஊடுபயிராக பயிரிடவும்", "அதிக யூரியா இடுவதை தவிர்க்கவும்"]
    },
    "banana_sigatoka": {
        "id": "banana_sigatoka",
        "crop_en": "Banana",
        "crop_ta": "வாழை",
        "disease_en": "Sigatoka Leaf Spot",
        "disease_ta": "சிகாடோகா இலைப்புள்ளி நோய்",
        "scientific_name": "Mycosphaerella musicola / Mycosphaerella fijiensis",
        "is_healthy": False,
        "severity": "high",
        "typical_confidence": 0.92,
        "symptoms_en": [
            "Small yellow-green streaks parallel to leaf veins",
            "Streaks turn dark brown/black with sunken gray centers",
            "Severe premature leaf death reducing bunch size and causing premature ripening"
        ],
        "symptoms_ta": [
            "இலை நரம்புகளுக்கு இணையாக சிறிய மஞ்சள்-பச்சை நிற கோடுகள் தோன்றுதல்",
            "கோடுகள் விரிவடைந்து நடுவில் சாம்பல் நிறமாகவும் சுற்றிலும் கரும்பழுப்பு விளிம்புடன் மாறுதல்",
            "இலைகள் விரைவாக காய்ந்து வாழை தாரின் எடை குறைந்து காய் பிஞ்சிலேயே பழுத்துவிடுதல்"
        ],
        "causes_en": ["Fungal pathogen Mycosphaerella species favored by high humidity and poor plantation drainage"],
        "causes_ta": ["மைக்கோஸ்பேரெல்லா பூஞ்சாணம்", "வாழை தோப்பில் தேங்கும் அதிக நீர் மற்றும் போதிய காற்றோட்டமின்மை"],
        "treatments_en": [
            "Spray Propiconazole 25% EC @ 1ml/liter + Mineral oil (Banole) 1% emulsion",
            "Alternatively Carbendazim 50% WP @ 1g/liter",
            "De-leaf infected leaves and de-trash dry trash from plantation"
        ],
        "treatments_ta": [
            "புரோபிகோனசோல் 1 மிலி மற்றும் மினரல் ஆயில் 10 மிலி ஒரு லிட்டர் தண்ணீரில் கலந்து இலைகளில் தெளிக்கவும்",
            "நோய் தாக்கிய இலைகளை உடனே அறுத்து தோப்புக்கு வெளியே அப்புறப்படுத்தவும்",
            "வாழை தோட்டத்தில் நீர் தேங்காமல் வடிகால் வசதி செய்யவும்"
        ],
        "organic_remedies_en": ["Spray Pseudomonas fluorescens @ 10g/liter every 15 days", "Cow urine spray (10%)"],
        "organic_remedies_ta": ["சூடோமோனாஸ் 10 கிராம்/லிட்டர் 15 நாட்களுக்கு ஒருமுறை தெளிக்கவும்", "10% கோமியம் கரைசல் தெளிக்கவும்"],
        "prevention_en": ["Maintain wider spacing (2m x 2m)", "Ensure proper drainage trenches between rows"],
        "prevention_ta": ["வாழை கன்றுகளை உரிய இடைவெளியில் நடவு செய்யவும்", "தோப்பில் வாய்க்கால் வெட்டி நீர் வடிய வழி செய்யவும்"]
    }
}

# General Tamil Agricultural Q&A Knowledge base for common farmer questions
FARMER_GENERAL_QA_TA = [
    {
        "keywords": ["உரம்", "நைட்ரஜன்", "யூரியா", "பொட்டாஷ்", "டிஏபி", "fertilizer", "dap", "urea"],
        "topic": "fertilizer",
        "response_ta": "நெற்பயிருக்கு அடி உரமாக ஏக்கருக்கு 50 கிலோ டிஏபி மற்றும் 25 கிலோ பொட்டாஷ் இட வேண்டும். தூர் கட்டும் பருவத்தில் (நடவு செய்த 20-25 நாட்களில்) ஏக்கருக்கு 30 கிலோ யூரியா மற்றும் 10 கிலோ ஜிங்க் சல்பேட் இட வேண்டும். பூக்கும் பருவத்தில் 25 கிலோ பொட்டாஷ் இடுவது நெல் மணிகள் திரட்சியாகவும் எடையுடனும் வர உதவும்.",
        "response_en": "Apply 50 kg DAP and 25 kg Potash per acre as basal fertilizer. At tillering (20-25 days after transplanting), top-dress with 30 kg Urea and 10 kg Zinc Sulphate. During panicle emergence, apply 25 kg Potash to ensure heavy, well-filled grains."
    },
    {
        "keywords": ["மஞ்சள்", "மஞ்சளாகிறது", "இலை மஞ்சள்", "yellowing", "yellow"],
        "topic": "chlorosis",
        "response_ta": "இலைகள் மஞ்சளாவதற்கு முக்கிய காரணங்கள்: 1) தழைச்சத்து (நைட்ரஜன்) குறைபாடு - கீழ் இலைகள் மஞ்சளாகும். 2) துத்தநாகம் (Zinc) குறைபாடு - இலை நரம்புகளுக்கு இடையே மஞ்சள் கோடுகள் வரும். 3) அதிகப்படியான நீர் தேங்குதல் அல்லது வேர் அழுகல். ஏக்கருக்கு 5 கிலோ துத்தநாக சல்பேட் அல்லது 1% யூரியா கரைசல் தெளிப்பது விரைவான நிவாரணம் தரும்.",
        "response_en": "Leaf yellowing is usually caused by: 1) Nitrogen deficiency (older lower leaves turn pale yellow), 2) Zinc deficiency (interveinal yellow streaks), or 3) Waterlogging and root suffocation. Spraying 0.5% Zinc Sulphate or 1% Urea solution provides fast greening recovery."
    },
    {
        "keywords": ["தண்ணீர்", "பாசனம்", "நீர்", "water", "irrigation"],
        "topic": "irrigation",
        "response_ta": "நெற்பயிருக்கு தொடர்ந்து 5 செ.மீ நீர் தேக்கி வைப்பதை விட 'காய்ச்சலும் பாய்ச்சலுமாக' நீர் பாய்ச்சுவது சிறந்தது. அதாவது வயலில் நீர் வடிந்து சிறு கீறல் விழும் போது அடுத்த பாசனம் செய்ய வேண்டும். இதனால் 30% நீர் மிச்சமாவதுடன் வேர்களுக்கு நல்ல காற்றோட்டம் கிடைத்து பயிர் தூர் அதிகம் வைக்கும்.",
        "response_en": "Adopt Alternate Wetting and Drying (AWD) irrigation instead of continuous deep flooding. Re-irrigate when water on the field drops and hairline cracks begin to form. This saves 30% water and aerates root zones for superior tillering."
    },
    {
        "keywords": ["பூச்சி", "புழு", "இலைச்சுருட்டுப் புழு", "pest", "worm", "caterpillar"],
        "topic": "pest_management",
        "response_ta": "இலைச்சுருட்டுப் புழு அல்லது தண்டு துளைப்பான் தென்பட்டால், ஆரம்ப நிலையில் ஏக்கருக்கு 5 விளக்குப் பொறிகள் அல்லது இனக்கவர்ச்சி பொறிகளை வைக்கலாம். வேப்பெண்ணெய் 3% தெளிக்கவும். தாக்கம் அதிகமாக இருந்தால் குளோரான்ட்ரானிலிப்ரோல் (Chlorantraniliprole 18.5% SC) 0.3 மிலி ஒரு லிட்டர் தண்ணீரில் கலந்து தெளிக்கவும்.",
        "response_en": "For leaf folders or stem borers, install pheromone traps or light traps (5/acre). Spray 3% neem oil for eco-friendly prevention. For severe infestations, spray Chlorantraniliprole 18.5% SC @ 0.3ml/liter of water."
    },
    {
        "keywords": ["இயற்கை", "ஆர்கானிக்", "பஞ்சகாவ்யா", "பூச்சி விரட்டி", "organic"],
        "topic": "organic_farming",
        "response_ta": "இயற்கை முறையில் பயிரை பாதுகாக்க 10 லிட்டர் தண்ணீரில் 300 மிலி பஞ்சகாவ்யா கலந்து 15 நாட்களுக்கு ஒருமுறை தெளிக்கவும். பூச்சிகளை விரட்ட வேப்பெண்ணெய் 30 மிலி மற்றும் சிறிது காதி சோப்பு கரைத்து தெளிக்கலாம். நிலத்திற்கு மண்புழு உரம் இடுவதால் மண் வளம் மற்றும் நுண்ணுயிர் பெருக்கம் அதிகரிக்கும்.",
        "response_en": "For organic protection, spray 3% Panchagavya (30ml/liter) every 15 days to stimulate plant immunity. Use Neem oil spray with organic soap emulsifier to repel chewing and sucking insects."
    }
]

def get_disease_by_id(disease_id: str) -> Optional[Dict[str, Any]]:
    return DISEASE_DATABASE.get(disease_id)

def list_all_diseases() -> List[Dict[str, Any]]:
    return list(DISEASE_DATABASE.values())
