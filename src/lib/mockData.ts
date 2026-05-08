export type DealStage = "Lead" | "Qualified" | "Mandate" | "Signed" | "Disbursed";
export type Channel = "whatsapp" | "instagram" | "linkedin";

export type Message = {
  id: string;
  from: "me" | "them";
  text: string;
  time: string;
};

export type Conversation = {
  id: string;
  name: string | null; // null = unknown contact, show masked phone/handle
  handle: string;
  city: string;
  channel: Channel;
  lastActive: string;
  preview: string;
  unread?: number;
  stage: DealStage;
  isNewLead?: boolean;
  hasMeetingIntent?: boolean;
  meetingDetails?: { when: string; with: string; location?: string };
  deal: {
    sector: string;
    type: string;
    ticketSize: string;
    location: string;
    actionItems: { id: string; label: string; done?: boolean }[];
    documents: { id: string; name: string; size: string }[];
  };
  messages: Message[];
};

export const conversations: Conversation[] = [
  {
    id: "rohit",
    name: "Rohit Sharma",
    handle: "+91 98201 44521",
    city: "Mumbai",
    channel: "whatsapp",
    lastActive: "2 min ago",
    preview: "Kal 4 baje pakka. Office aa jao, term sheet ready hai.",
    unread: 2,
    stage: "Mandate",
    hasMeetingIntent: true,
    meetingDetails: { when: "Tomorrow, 4:00 PM", with: "Rohit Sharma", location: "Brokai Office, BKC" },
    deal: {
      sector: "Commercial Real Estate",
      type: "Equity Investment",
      ticketSize: "₹120 Cr",
      location: "BKC, Mumbai",
      actionItems: [
        { id: "a1", label: "Share term sheet draft v3", done: true },
        { id: "a2", label: "Confirm meeting tomorrow 4 PM" },
        { id: "a3", label: "Loop in legal counsel" },
      ],
      documents: [
        { id: "d1", name: "BKC_Tower_TermSheet_v3.pdf", size: "2.4 MB" },
        { id: "d2", name: "Title_Report_Final.pdf", size: "8.1 MB" },
      ],
    },
    messages: [
      { id: "m1", from: "them", text: "Jatin bhai, term sheet dekha. 2-3 changes hain.", time: "10:12 AM" },
      { id: "m2", from: "me", text: "Sure Rohit sir, bhej dijiye. Aaj raat tak revise kar deta hoon.", time: "10:14 AM" },
      { id: "m3", from: "them", text: "Cap rate 8.25% chahiye, aur exit clause thoda tighten karna hai.", time: "10:15 AM" },
      { id: "m4", from: "me", text: "Done. Draft v3 share kar raha hoon abhi.", time: "11:48 AM" },
      { id: "m5", from: "them", text: "Perfect. Kal 4 baje pakka. Office aa jao, term sheet ready hai.", time: "12:30 PM" },
    ],
  },
  {
    id: "vikram",
    name: "Vikram Mehta",
    handle: "+91 99670 11234",
    city: "Gurgaon",
    channel: "whatsapp",
    lastActive: "18 min ago",
    preview: "NDA signed. Bank wale se confirmation le lo, kal 3 baje call pe discuss karte hain.",
    stage: "Signed",
    hasMeetingIntent: true,
    meetingDetails: { when: "Tomorrow, 3:00 PM", with: "Vikram Mehta", location: "Phone Call" },
    deal: {
      sector: "Debt Syndication",
      type: "Structured Debt",
      ticketSize: "₹250 Cr",
      location: "Gurgaon",
      actionItems: [
        { id: "a1", label: "Get bank confirmation letter", done: true },
        { id: "a2", label: "Schedule disbursement tranche 1" },
      ],
      documents: [
        { id: "d1", name: "NDA_Executed.pdf", size: "1.2 MB" },
        { id: "d2", name: "Sanction_Letter_HDFC.pdf", size: "3.7 MB" },
      ],
    },
    messages: [
      { id: "m1", from: "them", text: "NDA is signed. Bank wale se confirmation le lo, kal 3 baje call pe discuss karte hain.", time: "9:02 AM" },
      { id: "m2", from: "me", text: "Bilkul sir, HDFC se confirm karke update karta hoon.", time: "9:10 AM" },
    ],
  },
  {
    id: "ananya",
    name: "Ananya Kapoor",
    handle: "@ananya.invests",
    city: "Bangalore",
    channel: "instagram",
    lastActive: "1 hr ago",
    preview: "Saw your reel on commercial yields. Looking to deploy ₹30 Cr. Are you free?",
    unread: 1,
    stage: "Lead",
    isNewLead: true,
    deal: {
      sector: "Commercial Real Estate",
      type: "Equity",
      ticketSize: "₹30 Cr",
      location: "Bangalore",
      actionItems: [
        { id: "a1", label: "Send intro deck" },
        { id: "a2", label: "Schedule discovery call" },
      ],
      documents: [{ id: "d1", name: "Brokai_Intro_Deck.pdf", size: "5.2 MB" }],
    },
    messages: [
      { id: "m1", from: "them", text: "Hey! Saw your reel on commercial yields 🔥", time: "11:20 AM" },
      { id: "m2", from: "them", text: "Looking to deploy ₹30 Cr in Bangalore tech parks. Are you free this week?", time: "11:21 AM" },
    ],
  },
  {
    id: "siddharth",
    name: "Siddharth Rao",
    handle: "Siddharth Rao · CFO at Lodha",
    city: "Mumbai",
    channel: "linkedin",
    lastActive: "3 hrs ago",
    preview: "Interested in your Pune debt structure. Can we set up a call next week?",
    stage: "Qualified",
    hasMeetingIntent: true,
    meetingDetails: { when: "Thu, 11:00 AM", with: "Siddharth Rao (Lodha)", location: "Google Meet" },
    deal: {
      sector: "Residential Debt",
      type: "Mezzanine Debt",
      ticketSize: "₹80 Cr",
      location: "Pune",
      actionItems: [
        { id: "a1", label: "Send Pune project IM" },
        { id: "a2", label: "Propose 3 call slots" },
      ],
      documents: [{ id: "d1", name: "Pune_Project_IM.pdf", size: "4.8 MB" }],
    },
    messages: [
      { id: "m1", from: "them", text: "Hi Jatin — interested in your Pune debt structure. Can we set up a call next week?", time: "Yesterday" },
      { id: "m2", from: "me", text: "Absolutely Siddharth — sharing the IM, will propose 3 slots shortly.", time: "Yesterday" },
    ],
  },
  {
    id: "priya",
    name: "Priya Nair",
    handle: "+91 98450 77321",
    city: "Pune",
    channel: "whatsapp",
    lastActive: "Yesterday",
    preview: "Disbursement ho gayi. Thanks Jatin, pleasure doing business 🙌",
    stage: "Disbursed",
    deal: {
      sector: "Warehousing",
      type: "Senior Debt",
      ticketSize: "₹45 Cr",
      location: "Chakan, Pune",
      actionItems: [{ id: "a1", label: "Send closing gift", done: true }],
      documents: [{ id: "d1", name: "Disbursement_Memo.pdf", size: "900 KB" }],
    },
    messages: [
      { id: "m1", from: "them", text: "Disbursement ho gayi. Thanks Jatin, pleasure doing business 🙌", time: "Yesterday" },
      { id: "m2", from: "me", text: "Pleasure was mine Priya ji. Next deal jaldi karte hain!", time: "Yesterday" },
    ],
  },
  {
    id: "arjun",
    name: "Arjun Desai",
    handle: "@arjun.realty",
    city: "Ahmedabad",
    channel: "instagram",
    lastActive: "2 days ago",
    preview: "Bhai, retail mall portfolio dekh raha hoon. ₹200 Cr range.",
    stage: "Qualified",
    deal: {
      sector: "Retail Real Estate",
      type: "Equity + Debt",
      ticketSize: "₹200 Cr",
      location: "Ahmedabad",
      actionItems: [
        { id: "a1", label: "Underwrite 3 mall assets" },
        { id: "a2", label: "Site visit planning" },
      ],
      documents: [],
    },
    messages: [
      { id: "m1", from: "them", text: "Bhai, retail mall portfolio dekh raha hoon. ₹200 Cr range. Interested?", time: "2 days ago" },
    ],
  },
  // Phone-only / unknown contacts (like real WhatsApp)
  {
    id: "unknown_98765",
    name: null,
    handle: "+91 98765 32108",
    city: "Unknown",
    channel: "whatsapp",
    lastActive: "12 min ago",
    preview: "Hello, aap Brokai ke Jatin ho? Mujhe ₹40 Cr ka funding chahiye Hyderabad project ke liye.",
    unread: 3,
    stage: "Lead",
    isNewLead: true,
    deal: {
      sector: "Residential",
      type: "Senior Debt",
      ticketSize: "₹40 Cr",
      location: "Hyderabad",
      actionItems: [
        { id: "a1", label: "Verify identity & company" },
        { id: "a2", label: "Send NDA before sharing details" },
      ],
      documents: [],
    },
    messages: [
      { id: "m1", from: "them", text: "Hello, aap Brokai ke Jatin ho?", time: "12:18 PM" },
      { id: "m2", from: "them", text: "Mujhe ₹40 Cr ka funding chahiye Hyderabad project ke liye.", time: "12:19 PM" },
      { id: "m3", from: "them", text: "Reference Rohit Sharma sir ne diya hai.", time: "12:20 PM" },
    ],
  },
  {
    id: "unknown_99821",
    name: null,
    handle: "+91 99821 04417",
    city: "Delhi NCR",
    channel: "whatsapp",
    lastActive: "45 min ago",
    preview: "Sanction letter Friday ko expire ho raha hai. Call kar lo bhai, urgent hai.",
    unread: 1,
    stage: "Qualified",
    hasMeetingIntent: true,
    meetingDetails: { when: "Today, 5:00 PM", with: "+91 99821 04417", location: "Phone Call" },
    deal: {
      sector: "Residential",
      type: "Bridge Loan",
      ticketSize: "₹50 Cr",
      location: "Pune",
      actionItems: [
        { id: "a1", label: "Save contact (likely Aman Builders?)" },
        { id: "a2", label: "Call before Friday EOD" },
      ],
      documents: [],
    },
    messages: [
      { id: "m1", from: "them", text: "Sanction letter Friday ko expire ho raha hai.", time: "11:45 AM" },
      { id: "m2", from: "them", text: "Call kar lo bhai, urgent hai.", time: "11:46 AM" },
    ],
  },
  {
    id: "unknown_ig",
    name: null,
    handle: "@unknown_user_8821",
    city: "Unknown",
    channel: "instagram",
    lastActive: "2 hrs ago",
    preview: "DMing from a friend's recommendation. Want to invest 15-20 Cr in commercial. Kindly revert.",
    unread: 1,
    stage: "Lead",
    isNewLead: true,
    deal: {
      sector: "Commercial",
      type: "Equity",
      ticketSize: "₹20 Cr",
      location: "TBD",
      actionItems: [{ id: "a1", label: "Qualify the lead" }],
      documents: [],
    },
    messages: [
      { id: "m1", from: "them", text: "DMing from a friend's recommendation.", time: "10:15 AM" },
      { id: "m2", from: "them", text: "Want to invest 15-20 Cr in commercial. Kindly revert.", time: "10:16 AM" },
    ],
  },
];

// ─── AI-detected meetings (derived but with explicit detection metadata) ──
export type AiMeeting = {
  id: string;
  conversationId: string;
  when: string;
  dayKey: "today" | "tomorrow" | "thu" | "fri";
  startHour: number; // 24h
  durationMin: number;
  title: string;
  with: string;
  location: string;
  channel: Channel;
  detectedFrom: string; // human readable
  confidence: "high" | "medium";
};

export const aiMeetings: AiMeeting[] = [
  {
    id: "mt1",
    conversationId: "rohit",
    when: "Tomorrow · 4:00 PM",
    dayKey: "tomorrow",
    startHour: 16,
    durationMin: 60,
    title: "Term sheet review — BKC Tower",
    with: "Rohit Sharma",
    location: "Brokai Office, BKC",
    channel: "whatsapp",
    detectedFrom: "WhatsApp · 12:30 PM",
    confidence: "high",
  },
  {
    id: "mt2",
    conversationId: "vikram",
    when: "Tomorrow · 3:00 PM",
    dayKey: "tomorrow",
    startHour: 15,
    durationMin: 30,
    title: "HDFC disbursement sync",
    with: "Vikram Mehta",
    location: "Phone Call",
    channel: "whatsapp",
    detectedFrom: "WhatsApp · 9:02 AM",
    confidence: "high",
  },
  {
    id: "mt3",
    conversationId: "siddharth",
    when: "Thu · 11:00 AM",
    dayKey: "thu",
    startHour: 11,
    durationMin: 45,
    title: "Pune debt structure call",
    with: "Siddharth Rao (Lodha)",
    location: "Google Meet",
    channel: "linkedin",
    detectedFrom: "LinkedIn · Yesterday",
    confidence: "medium",
  },
  {
    id: "mt4",
    conversationId: "unknown_99821",
    when: "Today · 5:00 PM",
    dayKey: "today",
    startHour: 17,
    durationMin: 30,
    title: "Urgent: Sanction letter expiring",
    with: "+91 99821 04417",
    location: "Phone Call",
    channel: "whatsapp",
    detectedFrom: "WhatsApp · 11:46 AM",
    confidence: "high",
  },
];

export type Reminder = {
  id: string;
  title: string;
  when: string;
  type: "call" | "meeting" | "followup" | "doc";
  urgency: "high" | "medium" | "low";
  conversationId?: string;
};

export const reminders: Reminder[] = [
  { id: "r1", title: "Call Aman Builder before EOD", when: "Today · 5:00 PM", type: "call", urgency: "high", conversationId: "unknown_99821" },
  { id: "r2", title: "Site visit — Chakan warehouse", when: "Sat · 11:00 AM", type: "meeting", urgency: "medium", conversationId: "priya" },
  { id: "r3", title: "Follow up with Ananya on intro deck", when: "Mon · 10:00 AM", type: "followup", urgency: "medium", conversationId: "ananya" },
  { id: "r4", title: "Send revised term sheet to Arjun", when: "Today · EOD", type: "doc", urgency: "low", conversationId: "arjun" },
];

export const callLogs = [
  {
    id: "c1",
    caller: "Aman Builder",
    phone: "+91 98XXX XXXXX",
    time: "Today, 11:42 AM",
    duration: "2:45",
    reason: "Wants to discuss ₹50 Cr Pune debt deal. Mentioned urgency — sanction letter expires Friday.",
    urgency: "High" as const,
    transcript:
      "Hi, this is Aman from Aman Builders. I got your number from Rohit. I have a ₹50 Cr requirement for our Pune project. The HDFC sanction letter expires this Friday so we need to move fast. Please call me back today if possible.",
  },
  {
    id: "c2",
    caller: "Neha Agarwal",
    phone: "+91 98XXX XXXXX",
    time: "Today, 9:18 AM",
    duration: "1:32",
    reason: "Following up on BKC tower equity deal. Wants updated cap table.",
    urgency: "Medium" as const,
    transcript:
      "Hi Jatin, Neha here. Just following up on the BKC tower equity deal. Can you share the updated cap table by EOD? Also our investment committee meets Thursday — I'd like to present.",
  },
  {
    id: "c3",
    caller: "Unknown · +91 99XXX XXXXX",
    phone: "+91 99XXX XXXXX",
    time: "Yesterday, 6:50 PM",
    duration: "0:48",
    reason: "Cold inquiry — looking for ₹10 Cr residential project in Hyderabad.",
    urgency: "Low" as const,
    transcript:
      "Hello, my name is Ravi. I'm looking for a ₹10 Cr residential project in Hyderabad. Got your reference from LinkedIn. Please send me whatever options you have.",
  },
];

export const channels = [
  { id: "wa", name: "WhatsApp Business", provider: "Wati", account: "+91 98201 44521 · @jatin.deals", color: "#25D366" },
  { id: "ig", name: "Instagram DMs", provider: "Meta Graph API", account: "@jatin.deals", color: "#E1306C" },
  { id: "in", name: "LinkedIn Messaging", provider: "Unipile", account: "Jatin Mehra · Brokai", color: "#0A66C2" },
];
