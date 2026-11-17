import { Sprout, Cpu, Mic, ShieldAlert, BookOpen, Layers } from 'lucide-react';
import type { Language } from '../types';

interface AboutSectionProps {
  language: Language;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ language }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center space-x-2 text-agri-lightGreen text-xs font-bold uppercase tracking-wider mb-2">
          <BookOpen className="w-4 h-4" />
          <span>{language === 'ta' ? 'திட்ட விவரம்' : 'Project Architecture'}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          {language === 'ta' ? 'AgriVoice AI பற்றி' : 'About AgriVoice AI'}
        </h2>
        <p className="text-sm sm:text-base text-agri-muted mt-1 max-w-xl mx-auto">
          {language === 'ta'
            ? 'விவசாயிகளுக்கு அவர்களின் தாய்மொழியில் நுண்ணறிவு வழிகாட்டுதல் வழங்கும் முழுமையான AI தளம்.'
            : 'An end-to-end full-stack AI platform delivering computer vision diagnosis and Tamil voice guidance for farmers.'}
        </p>
      </div>

      {/* Vision Statement */}
      <div className="bg-gradient-to-r from-agri-card via-[#131D15] to-agri-card border border-agri-borderBright rounded-3xl p-6 sm:p-8 shadow-xl">
        <h3 className="text-lg sm:text-xl font-bold text-white mb-3 flex items-center space-x-2.5">
          <Sprout className="w-5 h-5 text-agri-primary" />
          <span>{language === 'ta' ? 'திட்டத்தின் நோக்கம்' : 'The Vision'}</span>
        </h3>
        <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
          {language === 'ta'
            ? '“விவசாயி இலையைக் காட்டுகிறார் → AI நோயைக் கண்டறிகிறது → விவசாயி தமிழில் பேசுகிறார் → AI தமிழில் எளிய வேளாண் ஆலோசனையை வழங்குகிறது.” நவீன செயற்கை நுண்ணறிவு தொழில்நுட்பத்தை அடித்தட்டு விவசாயிகளுக்கும் எளிமையாக கொண்டு சேர்ப்பதே இந்த திட்டத்தின் முதன்மை நோக்கமாகும்.'
            : '“Farmer shows the leaf → AI detects the disease → Farmer speaks in Tamil → AI provides agricultural guidance in Tamil.” AgriVoice AI breaks down technical barriers by combining computer vision leaf pathology with conversational Tamil speech recognition and audio synthesis.'}
        </p>
      </div>

      {/* 4 Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Pillar 1: Computer Vision */}
        <div className="bg-agri-card border border-agri-border rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">
            {language === 'ta' ? 'கணினி பார்வை (CNN)' : 'Computer Vision & CNN'}
          </h4>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {language === 'ta'
              ? 'PlantVillage தரவுத்தளத்தில் பயிற்றுவிக்கப்பட்ட MobileNetV2 ஆழமான கற்றல் கட்டமைப்பு. நெல், தக்காளி, உருளை, மக்காச்சோளம் போன்ற முக்கிய பயிர்களின் 38+ நோய் வகைகளை துல்லியமாக அடையாளம் காண்கிறது.'
              : 'MobileNetV2 deep convolutional neural network trained on plant pathology datasets, recognizing 38+ crop disease classes including blast, blights, rusts, curls, and healthy foliage.'}
          </p>
        </div>

        {/* Pillar 2: Tamil Voice Processing */}
        <div className="bg-agri-card border border-agri-border rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400">
            <Mic className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">
            {language === 'ta' ? 'தமிழ் குரல் செயலாக்கம்' : 'Tamil Voice AI (STT & TTS)'}
          </h4>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {language === 'ta'
              ? 'விவசாயிகள் தட்டச்சு செய்ய வேண்டிய அவசியமின்றி நேரடியாக தமிழில் பேசலாம். உரை-குரல் மாற்றி (TTS) மூலம் ஆடியோ வடிவில் விளக்கமான பதில்களை கேட்கலாம்.'
              : 'Zero typing required. Native Tamil Speech-to-Text captures spoken agricultural queries, and natural Tamil Text-to-Speech synthesizes farmer-friendly audio answers.'}
          </p>
        </div>

        {/* Pillar 3: Context-Aware Intelligence */}
        <div className="bg-agri-card border border-agri-border rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">
            {language === 'ta' ? 'சூழல் உணரும் AI' : 'Context-Aware AgroAI'}
          </h4>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {language === 'ta'
              ? 'ஸ்கேன் செய்யப்பட்ட நோய் தகவலை நினைவில் வைத்து, "இதற்கு என்ன மருந்து?" என விவசாயி கேட்கும்போது, சம்பந்தப்பட்ட நோய்க்கான தெளிவான மருந்து அளவை பரிந்துரைக்கிறது.'
              : 'Retains active crop & pathogen session state. When a farmer asks "What to spray for this?", the AI understands the pronoun refers directly to the currently detected disease.'}
          </p>
        </div>

        {/* Pillar 4: Safe Farmer Advisory */}
        <div className="bg-agri-card border border-agri-border rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950 flex items-center justify-center text-emerald-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <h4 className="text-base font-bold text-white">
            {language === 'ta' ? 'பாதுகாப்பான வேளாண் அறிவுரை' : 'Safe Agronomic Guidance'}
          </h4>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            {language === 'ta'
              ? 'இரசாயன பூச்சிக்கொல்லிகளுடன் கூடவே பஞ்சகாவ்யா, வேப்பெண்ணெய், சூடோமோனாஸ் போன்ற இயற்கை வழிகளையும் வழங்குகிறது. பெரிய பாதிப்புகளுக்கு அரசு வேளாண் அதிகாரியை அணுக பரிந்துரைக்கிறது.'
              : 'Balances chemical treatments with eco-friendly organic remedies (Panchagavya, Neem oil, Trichoderma). Clearly marks AI boundaries and advises consulting local agricultural officers.'}
          </p>
        </div>
      </div>

      {/* Tech Stack Pills */}
      <div className="bg-agri-card/60 border border-agri-border rounded-2xl p-5">
        <h4 className="text-xs font-bold text-agri-muted uppercase tracking-wider mb-3">
          {language === 'ta' ? 'தொழில்நுட்ப கட்டமைப்பு' : 'Technical Architecture'}
        </h4>
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            'React 18 + TypeScript',
            'Tailwind CSS',
            'Python FastAPI',
            'PyTorch / TorchScript',
            'Google gTTS Tamil Voice',
            'Web Speech API',
            'SQLite Database',
            'PlantVillage Dataset',
            'Modular ML Inference'
          ].map((tech, i) => (
            <span
              key={i}
              className="px-3 py-1 rounded-lg bg-agri-dark border border-agri-borderBright text-gray-200 font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
