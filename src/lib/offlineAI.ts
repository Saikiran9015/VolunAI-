/**
 * Smart offline fallback AI for VolunAI.
 * Handles a wide range of questions when Gemini API is unavailable.
 */

type QA = { keywords: string[]; answer: string }

const KB: QA[] = [
  // Greetings
  {
    keywords: ['hello', 'hi', 'hey', 'greet', 'good morning', 'good afternoon', 'good evening', 'howdy', 'sup'],
    answer: "Hello! 👋 I'm VolunAI, your AI assistant for NGO Connect. I can help you with donations, volunteering, NGO registration, emergency alerts, impact tracking, and much more. What would you like to know?",
  },
  // What is VolunAI
  {
    keywords: ['what is volunai', 'about volunai', 'info volunai', 'tell me about', 'volunai platform', 'what does volunai', 'explain volunai'],
    answer: "VolunAI is an AI-powered NGO management and volunteer coordination platform. It connects verified NGOs, donors, volunteers, corporates, and people in need — using geolocation, smart AI matching, and real-time impact tracking. Key features include emergency alerts, donation transparency, volunteer rewards, and multi-language support (English, Hindi, Telugu, Tamil, Kannada, Urdu).",
  },
  // What is NGO
  {
    keywords: ['what is ngo', 'what are ngo', 'ngo mean', 'ngo full form', 'ngo definition', 'ngo stand for'],
    answer: "NGO stands for Non-Governmental Organization — a non-profit group that operates independently from the government, typically for social, humanitarian, or environmental causes. On VolunAI, NGOs can register, get verified, create donation campaigns, post volunteer tasks, and track their impact in real time through the NGO Admin portal.",
  },
  // NGO registration
  {
    keywords: ['ngo register', 'register ngo', 'ngo signup', 'ngo join', 'ngo create account', 'ngo onboard'],
    answer: "To register your NGO on VolunAI:\n1. Click 'Get Started' on the homepage\n2. Select 'NGO Admin' as your role\n3. Fill in your NGO details (name, registration number, address)\n4. Upload verification documents (80G certificate, trust deed, etc.)\n5. Submit for review — our team verifies within 24–48 hours\nOnce verified, you can create campaigns, post volunteer tasks, and access the full NGO Admin dashboard.",
  },
  // Donor registration
  {
    keywords: ['donor register', 'register donor', 'donor signup', 'donor join', 'how to donate', 'donate process', 'donor registration process', 'become donor', 'how do i donate'],
    answer: "To register as a Donor on VolunAI:\n1. Click 'Get Started' → select 'Donor'\n2. Enter your name, email, and phone number\n3. Verify your phone via OTP\n4. Set up your donor profile\n\nOnce registered, you can browse verified NGOs, choose campaigns to fund, make secure payments, and receive instant receipts. You can also track exactly how your donation is being used through our transparency dashboard.",
  },
  // Volunteer registration
  {
    keywords: ['volunteer register', 'register volunteer', 'volunteer signup', 'volunteer join', 'become volunteer', 'how volunteer', 'volunteer process'],
    answer: "To register as a Volunteer on VolunAI:\n1. Click 'Get Started' → select 'Volunteer'\n2. Enter your details (name, phone, skills, location)\n3. Verify via OTP\n4. Complete your skills profile\n\nVolunAI uses AI to match you with nearby tasks based on your skills and availability. You'll earn points, badges, and recognition for every task completed!",
  },
  // Donation process
  {
    keywords: ['donat', 'contribute', 'fund', 'give money', 'payment', 'donate to ngo'],
    answer: "Donating on VolunAI is simple and transparent:\n1. Log in as a Donor\n2. Browse verified NGO campaigns\n3. Choose a campaign and amount\n4. Complete secure payment (UPI, card, net banking)\n5. Receive an instant digital receipt\n\nYou can track your donation's utilization in real time — VolunAI shows exactly where your money goes, ensuring full transparency.",
  },
  // Emergency alerts
  {
    keywords: ['emergency', 'alert', 'disaster', 'relief', 'crisis', 'urgent'],
    answer: "VolunAI has a real-time Emergency Alert System:\n• NGO Admins can trigger alerts from their dashboard\n• Alerts are sent via push notification, SMS, and WhatsApp to nearby volunteers and NGOs\n• Location-based matching ensures the closest responders are notified first\n• Volunteers can accept emergency tasks and get live updates\n\nThis system is designed for rapid disaster response and humanitarian relief coordination.",
  },
  // Impact tracking
  {
    keywords: ['impact', 'track', 'report', 'how much', 'result', 'outcome', 'statistic', 'metric'],
    answer: "VolunAI tracks impact across multiple dimensions:\n• **Donors**: See donation utilization, project updates, and beneficiary counts\n• **Volunteers**: View hours logged, tasks completed, and rewards earned\n• **NGOs**: Access real-time dashboards with campaign performance, volunteer engagement, and fund usage\n• **Corporates**: Get detailed CSR impact reports for compliance and reporting\n\nAll data is transparent and auditable.",
  },
  // Volunteer rewards
  {
    keywords: ['reward', 'badge', 'point', 'gamif', 'leaderboard', 'recognition', 'certificate'],
    answer: "VolunAI gamifies volunteering to keep volunteers motivated:\n• Earn points for every task completed and hour logged\n• Unlock badges (First Mission, Community Hero, Emergency Responder, etc.)\n• Climb the leaderboard and compete with other volunteers\n• Download verified volunteer certificates for your portfolio/resume\n• Top volunteers get featured on NGO appreciation boards",
  },
  // Corporate / CSR
  {
    keywords: ['corporate', 'csr', 'company', 'business', 'enterprise', 'sponsor'],
    answer: "Corporates can partner with VolunAI for CSR (Corporate Social Responsibility):\n• Browse and partner with verified NGOs aligned to your CSR goals\n• Log employee volunteering hours and contributions\n• Get detailed impact reports for SEBI/statutory CSR compliance\n• Enable employee volunteer programs through the platform\n• Receive co-branded recognition on campaigns",
  },
  // People in need
  {
    keywords: ['need help', 'people in need', 'aid', 'assistance', 'needy', 'beneficiar', 'request help', 'get help'],
    answer: "People in need can request assistance on VolunAI:\n1. Register as 'Person in Need'\n2. Submit a help request with details of what you need\n3. VolunAI's AI matches your request with the most relevant NGOs and volunteers in your area\n4. You'll be contacted within the platform for coordination\n\nAll requests are handled with privacy and dignity.",
  },
  // AI matching
  {
    keywords: ['ai match', 'smart match', 'how match', 'algorithm', 'artificial intelligence', 'machine learning'],
    answer: "VolunAI's AI Smart Matching engine:\n• **Donor → NGO**: Matches donors to NGO campaigns based on cause preferences, location, and past giving patterns\n• **Volunteer → Task**: Matches volunteers to tasks using skills, availability, and proximity\n• **NGO → Need**: Connects NGOs to communities and aid requests that fit their focus areas\n\nThe AI continuously learns from platform activity to improve match accuracy.",
  },
  // Multi-language
  {
    keywords: ['language', 'hindi', 'telugu', 'tamil', 'kannada', 'urdu', 'translate', 'multilingual'],
    answer: "VolunAI supports multiple Indian languages:\n• English, Hindi, Telugu, Tamil, Kannada, and Urdu\n• Use the Language (🌐) button at the top right of the platform to switch languages\n• Powered by Google Translate integration for seamless multilingual access\n• Ensures the platform is accessible to users across India regardless of language preference.",
  },
  // Login / Auth
  {
    keywords: ['login', 'sign in', 'log in', 'password', 'otp', 'forgot', 'auth', 'access'],
    answer: "To log in to VolunAI:\n• **Donors**: Go to 'Donor Login Portal' and sign in with your registered email/phone + OTP\n• **Volunteers**: Use the Volunteer portal login\n• **NGO Admins**: Use the NGO Admin portal with your admin credentials\n\nIf you forgot your password, use the 'Forgot Password' option to reset via OTP sent to your registered phone number.",
  },
  // Receipt / transparency
  {
    keywords: ['receipt', 'invoice', 'proof', 'tax', '80g', 'deduction', 'document', 'certificate'],
    answer: "VolunAI provides full financial transparency:\n• Instant digital receipts after every donation\n• 80G tax exemption certificates (where applicable, based on NGO registration)\n• Full audit trail of fund utilization\n• Monthly impact reports showing how donations were spent\n• All financial data is tamper-proof and accessible from your donor dashboard.",
  },
  // How it works / process
  {
    keywords: ['how it work', 'how does', 'process', 'step', 'guide', 'tutorial', 'get start', 'begin', 'start'],
    answer: "Here's how VolunAI works:\n1. **Register**: Choose your role — Donor, Volunteer, NGO Admin, or Corporate\n2. **Verify**: Complete phone OTP verification and profile setup\n3. **Connect**: Browse NGOs, campaigns, or volunteer tasks\n4. **Act**: Donate, volunteer, or manage your NGO\n5. **Track**: Monitor your impact in real time through your personalized dashboard\n\nThe platform is designed to be simple, transparent, and impactful.",
  },
  // Platform features
  {
    keywords: ['feature', 'capabilit', 'what can', 'function', 'module', 'service'],
    answer: "VolunAI's key features include:\n🤝 AI-powered volunteer & donor matching\n🚨 Real-time emergency alert system\n📊 Impact tracking & transparency dashboards\n🏅 Volunteer rewards & gamification\n🌍 Multi-language support (6 Indian languages)\n✅ NGO verification & trust framework\n📱 Push/SMS/WhatsApp notifications\n🏢 Corporate CSR module\n📄 Automated receipts & impact reports\n📍 Geolocation-based task & alert assignment",
  },
  // Security / trust
  {
    keywords: ['safe', 'secure', 'trust', 'verif', 'fraud', 'legit', 'genuine', 'authentic'],
    answer: "VolunAI is built with trust and security at its core:\n• All NGOs undergo document verification before listing (registration certificates, 80G, trust deeds)\n• Volunteers are verified via phone OTP and profile review\n• Donation payments are processed through secure, PCI-compliant payment gateways\n• Full audit trails prevent fraud and misuse\n• Fraud monitoring alerts flag suspicious activities automatically",
  },
  // Contact / support
  {
    keywords: ['contact', 'support', 'help', 'issue', 'problem', 'complain', 'feedback', 'report'],
    answer: "For support on VolunAI:\n• Use the in-platform chat (that's me! 😊) for instant help\n• For technical issues, use the 'Report Issue' option in your dashboard settings\n• NGOs with urgent verification issues can email the admin team\n• Donors with payment issues can raise a dispute from the transaction history page\n\nWe aim to resolve all queries within 24 hours.",
  },
  // General knowledge fallback
  {
    keywords: ['what is', 'explain', 'define', 'meaning of', 'tell me', 'describe'],
    answer: "I'm VolunAI, specialized in NGO management, donations, and volunteering. For general knowledge questions, I can help with context related to the social sector. Could you rephrase your question with a bit more context? For example: 'What is the NGO registration process?' or 'What is impact tracking on VolunAI?' — I'll give you a detailed answer!",
  },
]

function tokenize(text: string): string[] {
  return text.toLowerCase().split(/\s+/)
}

function score(userText: string, qa: QA): number {
  const lower = userText.toLowerCase()
  const tokens = tokenize(userText)
  let best = 0
  for (const kw of qa.keywords) {
    if (lower.includes(kw)) {
      // Exact phrase match — strong signal
      const s = kw.split(' ').length * 2
      if (s > best) best = s
    } else {
      // Partial token match
      const kwTokens = tokenize(kw)
      const matches = kwTokens.filter((t) => tokens.some((u) => u.startsWith(t) || t.startsWith(u)))
      const s = matches.length / kwTokens.length
      if (s > best) best = s
    }
  }
  return best
}

export function smartOfflineReply(userText: string): string {
  let bestScore = 0
  let bestAnswer = "I'm VolunAI, your NGO Connect assistant! 🤝 I can help with donations, volunteering, NGO registration, emergency alerts, impact tracking, and more. Could you tell me more about what you're looking for?"

  for (const qa of KB) {
    const s = score(userText, qa)
    if (s > bestScore) {
      bestScore = s
      bestAnswer = qa.answer
    }
  }

  return bestAnswer
}
