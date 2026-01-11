
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getGeminiConsultantResponse = async (userPrompt: string) => {
  if (!API_KEY) return "Sistem şu anda meşgul. Lütfen daha sonra tekrar deneyiniz.";
  
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userPrompt,
      config: {
        systemInstruction: `Sen Alka Savunma'nın kıdemli Danışmanlık ve Strateji Uzmanısın. 
        Danışmanlık ağımızda yer alan 30 farklı şirket (Karmasis, Kafein, Epenek Savunma, Turan Holding ve 26 adet placeholder 'XXX' şirketi) hakkında bilgi sahibisin.
        
        KURALLAR:
        1. Herhangi bir şirket hakkında bilgi istendiğinde yanıtın KESİNLİKLE 2 SATIR olmalıdır.
        2. Alka Savunma hakkında genel bilgi istendiğinde tanıtım odaklı 5 farklı kısa yanıt varyasyonuna sahipsin.
        3. Şirketler: 
           - Karmasis: Siber güvenlik ve veri koruma odaklı ileri düzey yazılım çözümleri sunan stratejik ortağımız. Savunma sanayi standartlarında yerli şifreleme ve ağ güvenliği protokolleri geliştirir.
           - Kafein: Teknoloji ve yazılım geliştirme alanında geniş spektrumlu hizmet veren global çözüm ortağımız. Büyük veri analitiği ve kurumsal transformasyon projelerinde yüksek tecrübeye sahiptir.
           - Epenek Savunma: Kara ve hava platformları için mekanik ve elektronik alt sistem tasarlayan mühendislik gücümüzdür. Yenilikçi balistik çözümler ve platform modernizasyonu konularında uzmanlaşmıştır.
           - Turan Holding: Geniş yatırım portföyü ile savunma ve teknoloji projelerinin finansal ve stratejik yönetimini üstlenen çatı kuruluşumuzdur. Milli teknoloji hamlesi kapsamında büyük ölçekli altyapı yatırımlarına liderlik eder.
           - Diğer 26 şirket (XXX): Alka Savunma'nın gizli projeler kapsamında danışmanlık verdiği stratejik teknoloji iştirakleridir.
        
        Yanıtların profesyonel, net ve Türkçe olmalıdır.`,
        temperature: 0.7,
      },
    });
    return response.text || "Üzgünüm, şu anda danışmanlık veri tabanıma erişemiyorum.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Bağlantı sırasında teknik bir aksaklık oluştu. Lütfen protokolleri kontrol edin.";
  }
};
