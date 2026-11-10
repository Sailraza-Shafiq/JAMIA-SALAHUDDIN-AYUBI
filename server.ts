import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();

  // In AI Studio dev environment, server MUST listen on port 3000.
  // Check CLI arg --port first (npm run dev --port 3000), otherwise default to 3000.
  let PORT = 3000;
  const portArgIndex = process.argv.indexOf('--port');
  if (portArgIndex !== -1 && process.argv[portArgIndex + 1]) {
    PORT = parseInt(process.argv[portArgIndex + 1], 10);
  } else if (process.env.APP_PORT) {
    PORT = parseInt(process.env.APP_PORT, 10);
  }

  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini AI SDK
  const apiKey = process.env.GEMINI_API_KEY;
  let aiClient: GoogleGenAI | null = null;
  if (apiKey) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  // System knowledge prompt for Jamia Salahuddin Ayubi
  const JAMIA_SYSTEM_PROMPT = `You are the official AI Student Support Assistant & Academic Advisor for Jamia Salahuddin Ayubi (جامعة صلاح الدين الأيوبي).

INSTITUTIONAL PROFILE:
- Institute: Jamia Salahuddin Ayubi
- Founder & Director General: Muneeb ur Rehman
- Visual Identity: Deep Green (#176B4D), White (#FFFFFF), and Soft Gold (#D6B66C)
- Core Mission: Preserving traditional Islamic scholarship and sacred sciences while imparting modern intellectual, digital, and academic skills.
- Structure: Completely segregated Boys Campus and Girls (Bannat) Wing to preserve Islamic modesty and focused learning.

VERIFIED COURSES OFFERED:
1. Hifz-ul-Quran: Systematic memorization of the Holy Quran under certified Huffaz and Qaris with daily Sabaq, Sabqi, and Manzil progression.
2. Nazra Quran: Accurate, fluent recitation of the Holy Quran with foundational pronunciation and Tajweed rules.
3. Tajweed-ul-Quran: Advanced rules of phonetics, Makharij al-Huroof (articulation points), Sifaat, and classical Qirat.
4. Shariyat Course: Practical Islamic jurisprudence covering essential Fiqh (Taharah, Salah, Zakat, Sawm, Halal/Haram transactions) and Islamic morality for daily life.
5. Dars-e-Nizami (Al-Alimiyyah): Comprehensive 8-year classical curriculum spanning Arabic Grammar (Sarf & Nahw), Hanafi Fiqh, Usul-ul-Fiqh, Mantiq (Logic), Hadith (Sihah Sitta including Sahih al-Bukhari), and Tafseer.
6. Islamic Studies: Quranic reflections, Seerah of Prophet Muhammad ﷺ, Hadith sciences, and Islamic history.
7. Arabic Language: Classical and functional Arabic vocabulary, morphology, syntax, comprehension, and spoken communication.
8. Quran Translation and Tafseer: In-depth word-by-word translation and authentic classical commentary (Tafseer).

ADMISSION PROCEDURE & PORTAL:
- Step 1: Submit the online Student Admission Form on this portal (/admissions/apply) or in person.
- Step 2: Choose the appropriate admission category (Boys Campus or Girls Bannat Wing) and desired course.
- Step 3: Complete personal details, parent/guardian information, permanent address, and upload required documents.
- Step 4: A unique Application Number (e.g., APP-2026-XXXX) is generated upon submission for status tracking.
- Step 5: Department reviews the application; candidate appears for an entrance interview and Nazra/academic evaluation.
- Step 6: Management grants formal admission approval and issues the official student ID card with secure QR code.

REQUIRED ADMISSION DOCUMENTS:
- Recent passport-size student photograph.
- Student B-Form or CNIC copy (optional if not yet issued).
- Father's or Guardian's CNIC copy.
- Previous educational certificates, Sanad, or school result card (if applicable).
- Active mobile and WhatsApp contact numbers of student and guardian.

CAMPUS FACILITIES:
- Quran Learning Environment: Peaceful, dedicated Halqa spaces designed for focused Quranic recitation and memorization.
- Classrooms: Well-ventilated, well-lit lecture halls with instructional aids.
- Library (Maktaba): Comprehensive collection of classical Islamic texts, Tafaseer, Hadith commentaries, Arabic lexicons, and contemporary literature.
- Prayer Facilities (Masjid): Spacious prayer halls with five daily congregational prayers and Friday Jummah.
- Wudu Facilities: Dedicated, hygienic ablution areas with continuous clean running water.
- Student Accommodation: Safe, supervised residential boarding hostel with warden oversight.
- Dining Facilities: Wholesome, hygienic three daily meals prepared under clean culinary standards.
- Study Environment & Takrar: Dedicated evening review circles (Takrar) fostering peer learning.
- Educational Resources: IT and modern computer facilities integrated with Islamic learning.

OFFICIAL CONTACT & MANAGEMENT:
- Director General: Muneeb ur Rehman
- Main Academic Campus: Jamia Salahuddin Ayubi
- Phone: +92 51 5566778 / WhatsApp: +92 300 1234567
- Email: admissions@jamiasalahuddinayubi.edu.pk / info@jamiasalahuddinayubi.edu.pk
- Website pages: /about, /courses, /admissions, /facilities, /management, /staff, /contact

STRICT OPERATIONAL RULES:
1. Grounding in Truth: Use ONLY the verified institutional details provided above. Never make up or hallucinate non-existent departments or programs.
2. DO NOT INVENT FEES, TIMINGS, DATES OR POLICIES:
   - NEVER invent exact tuition fees, hostel charges, examination fees, exact class hours, or specific admission cut-off dates.
   - If asked about fee amounts or specific dates, explicitly state: "Fee structures, concessions, and academic schedules are set and configured directly by authorized management under Director Muneeb ur Rehman. Please contact the Admissions Office or consult the official Admissions page for verified information."
3. UNKNOWN INFORMATION: If information is unavailable or outside this verified scope, advise the user with adab to contact institute management directly.
4. MULTILINGUAL SUPPORT: Respond respectfully and naturally in the language the user addresses you in:
   - English: Polite, articulate, and welcoming.
   - Urdu (اردو): Elegant, scholarly, and respectful Urdu with appropriate Islamic terminology.
   - Roman Urdu: Natural, polite conversational Roman Urdu (e.g., "Assalamu Alaikum! Jamia Salahuddin Ayubi ke bare mein aap ka swal...").
5. ISLAMIC ADAB & ETHICS: Always begin with an Islamic greeting ("Assalamu Alaikum wa Rahmatullahi wa Barakatuh") and maintain a dignified, helpful, and encouraging tone.
6. PRIVACY & SECURITY: NEVER reveal private student records, personal CNICs, staff salaries, internal phone logs, or individual exam results.
7. NO ADMIN ACCESS: The public AI assistant has NO authority to perform admin actions (e.g. approve admissions, alter grades, modify fees, or edit database records).
8. INTERACTIVE ONLY: You are a live conversational assistant; do not claim to send automated WhatsApp messages, schedule email jobs, or trigger external workflow bots.`;

  // API Route: AI Student Advisor Chat
  app.post('/api/chat', async (req, res) => {
    try {
      const { message, history } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required' });
      }

      const client = process.env.GEMINI_API_KEY
        ? new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
            httpOptions: {
              headers: {
                'User-Agent': 'aistudio-build',
              },
            },
          })
        : null;

      if (!client) {
        // Helpful fallback response when API key is pending
        return res.json({
          reply: `Assalamu Alaikum wa Rahmatullahi wa Barakatuh! Welcome to Jamia Salahuddin Ayubi (جامعة صلاح الدين الأيوبي), under the leadership of Director General Muneeb ur Rehman.

We offer comprehensive classical and contemporary programs including Hifz-ul-Quran, Nazra Quran, Tajweed-ul-Quran, Shariyat Course, and Dars-e-Nizami (Al-Alimiyyah), with separate facilities for Boys and Girls (Bannat Wing).

Online admissions are currently open! You can submit an admission application at /admissions/apply or generate verified student ID cards. For specific fee structures or schedules, please consult the Admissions Office or contact management directly.`,
        });
      }

      // Build conversation contents
      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-6)) {
          if (item.sender === 'user' && item.text) {
            contents.push({ role: 'user', parts: [{ text: item.text }] });
          } else if (item.sender === 'bot' && item.text) {
            contents.push({ role: 'model', parts: [{ text: item.text }] });
          }
        }
      }

      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await client.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: JAMIA_SYSTEM_PROMPT,
        },
      });

      const reply = response.text || 'Assalamu Alaikum wa Rahmatullahi wa Barakatuh. How may I assist you with your studies or inquiries about Jamia Salahuddin Ayubi today?';
      return res.json({ reply });
    } catch (error: any) {
      console.error('Error in /api/chat:', error);

      // Intelligent context-aware rule-compliant fallback if network or upstream quota issue occurs
      const lower = (req.body.message || '').toLowerCase();
      let contextualReply = 'Assalamu Alaikum wa Rahmatullahi wa Barakatuh. Welcome to Jamia Salahuddin Ayubi (جامعة صلاح الدين الأيوبي), directed by Muneeb ur Rehman.';

      if (lower.includes('course') || lower.includes('program') || lower.includes('hifz') || lower.includes('nazra') || lower.includes('shariyat') || lower.includes('dars')) {
        contextualReply = `Assalamu Alaikum wa Rahmatullahi wa Barakatuh! 
Jamia Salahuddin Ayubi offers 8 recognized programs:
1. Hifz-ul-Quran (Complete memorization with Tajweed)
2. Nazra Quran (Fluent Quranic reading)
3. Tajweed-ul-Quran (Classical Qirat & phonetics)
4. Shariyat Course (Practical Islamic Jurisprudence & Taharah/Salah/Zakat rulings)
5. Dars-e-Nizami (8-year scholarly Alimiyyah curriculum)
6. Islamic Studies (Seerah, Hadith, History)
7. Arabic Language (Grammar & Spoken Arabic)
8. Quran Translation & Tafseer

Each course features dedicated Boys and Girls (Bannat Wing) class arrangements. You can explore complete course syllabi on our Courses page.`;
      } else if (lower.includes('fee') || lower.includes('cost') || lower.includes('dues') || lower.includes('scholarship') || lower.includes('paisa')) {
        contextualReply = `Assalamu Alaikum wa Rahmatullahi wa Barakatuh. 
Regarding fees and financial assistance:
Official fee structures, boarding dues, and merit-based or orphan scholarships are directly determined and authorized by institute management under Director General Muneeb ur Rehman. 

We do not display unverified fee figures. Please visit our Admissions page or contact the Admissions & Treasury Office directly for verified tariff schedules.`;
      } else if (lower.includes('admission') || lower.includes('apply') || lower.includes('document') || lower.includes('dakhila')) {
        contextualReply = `Assalamu Alaikum wa Rahmatullahi wa Barakatuh! 
To apply for admission at Jamia Salahuddin Ayubi:
1. Visit our online Admission Form at /admissions/apply.
2. Select your category: Male (Boys Campus) or Female (Girls Bannat Wing).
3. Fill in your personal details, guardian contact, and address.
4. Upload required documents:
   • Passport-size Student Photograph
   • Student B-Form / CNIC (if applicable)
   • Father/Guardian CNIC
   • Previous educational certificate/Sanad (if applicable)
5. Submit the form to receive your unique Application Number (e.g., APP-2026-XXXX).
Final admission is granted after an interview and evaluation by management.`;
      } else if (lower.includes('facilit') || lower.includes('hostel') || lower.includes('wudu') || lower.includes('library') || lower.includes('food')) {
        contextualReply = `Assalamu Alaikum wa Rahmatullahi wa Barakatuh! 
Jamia Salahuddin Ayubi provides well-equipped educational and residential facilities:
• Peaceful Quran recitation and learning circles (Halaqahs)
• Modern, well-ventilated classrooms
• Dedicated Islamic reference library with classical manuscripts
• Spacious Masjid for all 5 daily prayers in congregation
• Clean, hygienic Wudu areas with continuous running water
• Supervised residential hostel accommodation for outstation students
• Wholesome dining facility offering 3 daily meals
• Quiet study rooms for evening Takrar (peer review)
• Modern IT and educational resources.
You can view detailed photo galleries on our Facilities page.`;
      } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('address') || lower.includes('muneeb') || lower.includes('director') || lower.includes('rabta')) {
        contextualReply = `Assalamu Alaikum wa Rahmatullahi wa Barakatuh! 
You can reach Jamia Salahuddin Ayubi management directly:
• Director General: Muneeb ur Rehman
• Main Academic Campus: Jamia Salahuddin Ayubi
• Phone: +92 51 5566778
• WhatsApp: +92 300 1234567
• Email: admissions@jamiasalahuddinayubi.edu.pk / info@jamiasalahuddinayubi.edu.pk
• Office hours and inquiry desk are also accessible via our Contact page.`;
      } else {
        contextualReply = `Assalamu Alaikum wa Rahmatullahi wa Barakatuh! 
Welcome to Jamia Salahuddin Ayubi's AI Student Support Assistant. 

Under the visionary leadership of Director General Muneeb ur Rehman, we provide comprehensive guidance on:
1. Institute introduction & mission
2. Courses (Hifz-ul-Quran, Nazra, Tajweed, Shariyat, Dars-e-Nizami, Arabic)
3. Online admission procedure & tracking
4. Required admission documents
5. Campus facilities & student life
6. Contact & administrative inquiries

How may I assist you today? You can ask in English, Urdu (اردو), or Roman Urdu.`;
      }

      return res.json({ reply: contextualReply });
    }
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      institute: 'Jamia Salahuddin Ayubi',
      director: 'Muneeb ur Rehman',
      timestamp: new Date().toISOString(),
    });
  });

  // Vite integration in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        next(e);
      }
    });
  } else {
    // Production static files
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Jamia Salahuddin Ayubi server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
