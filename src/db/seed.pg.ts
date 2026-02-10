/**
 * Postgres seed script for Supabase production database.
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." npx tsx src/db/seed.pg.ts
 */
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema.pg";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const client = postgres(DATABASE_URL, { prepare: false });
const db = drizzle(client, { schema });

async function seed() {
  // Drop tables in dependency order
  await client.unsafe(`
    DROP TABLE IF EXISTS contact_timeline CASCADE;
    DROP TABLE IF EXISTS meetings CASCADE;
    DROP TABLE IF EXISTS contact_life_events CASCADE;
    DROP TABLE IF EXISTS contact_news CASCADE;
    DROP TABLE IF EXISTS career_history CASCADE;
    DROP TABLE IF EXISTS contact_links CASCADE;
    DROP TABLE IF EXISTS contacts CASCADE;
    DROP TABLE IF EXISTS organizations CASCADE;
    DROP TABLE IF EXISTS briefings CASCADE;
  `);

  // Create tables
  await client.unsafe(`
    CREATE TABLE organizations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT
    );

    CREATE TABLE contacts (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT,
      organization_id INTEGER REFERENCES organizations(id),
      image_url TEXT,
      bio TEXT,
      linkedin_url TEXT
    );

    CREATE TABLE contact_links (
      id SERIAL PRIMARY KEY,
      contact_id INTEGER NOT NULL REFERENCES contacts(id),
      type TEXT NOT NULL,
      url TEXT NOT NULL,
      label TEXT
    );

    CREATE TABLE career_history (
      id SERIAL PRIMARY KEY,
      contact_id INTEGER NOT NULL REFERENCES contacts(id),
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      start_date TEXT,
      end_date TEXT,
      description TEXT,
      is_current BOOLEAN DEFAULT false,
      source_url TEXT,
      source TEXT
    );

    CREATE TABLE contact_news (
      id SERIAL PRIMARY KEY,
      contact_id INTEGER NOT NULL REFERENCES contacts(id),
      title TEXT NOT NULL,
      source TEXT,
      url TEXT,
      date TEXT NOT NULL,
      summary TEXT
    );

    CREATE TABLE contact_life_events (
      id SERIAL PRIMARY KEY,
      contact_id INTEGER NOT NULL REFERENCES contacts(id),
      event TEXT NOT NULL,
      date TEXT NOT NULL,
      description TEXT,
      source_url TEXT,
      source TEXT
    );

    CREATE TABLE briefings (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL,
      title TEXT NOT NULL
    );

    CREATE TABLE meetings (
      id SERIAL PRIMARY KEY,
      briefing_id TEXT NOT NULL REFERENCES briefings(id),
      contact_id INTEGER NOT NULL REFERENCES contacts(id),
      time TEXT NOT NULL,
      hour REAL NOT NULL,
      talking_points TEXT,
      recent_news TEXT,
      summary TEXT,
      context TEXT,
      notes TEXT
    );

    CREATE TABLE contact_timeline (
      id SERIAL PRIMARY KEY,
      contact_id INTEGER NOT NULL REFERENCES contacts(id),
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      direction TEXT,
      from_address TEXT,
      to_address TEXT,
      duration TEXT,
      channel TEXT
    );
  `);

  // Seed organizations
  const orgs = [
    { name: "Begin Software", description: "Denver-based software development team that has built dev teams for 50+ companies." },
    { name: "Gem Investments", description: "$12B OCIO platform with VC, private credit, and lending verticals." },
    { name: "Handle", description: "YC-backed construction finance and credit software platform." },
    { name: "Abstract", description: "Abstract Ventures — early-stage venture capital firm." },
    { name: "Spring Street Wealth", description: "Wealth management firm." },
    { name: "Inflection Capital", description: "Alternative investment distribution and advisory services." },
  ];

  const orgRows = await db.insert(schema.organizations).values(orgs).returning();
  const orgMap = Object.fromEntries(orgRows.map((o) => [o.name, o.id]));

  // Seed contacts
  const contactsData = [
    { name: "Brandon Frisch", role: "Managing Director & Co-founder", organizationId: orgMap["Begin Software"], imageUrl: "https://ui-avatars.com/api/?name=Brandon+Frisch&background=78716c&color=fff", bio: "Co-founder of Begin Software, a Denver-based software development team that has built dev teams for 50+ companies. Specializes in scaling engineering organizations and technical project delivery.", linkedinUrl: "https://linkedin.com/in/brandonfrisch" },
    { name: "Kate Simpson", role: "Managing Director, Head of VC", organizationId: orgMap["Gem Investments"], imageUrl: "https://ui-avatars.com/api/?name=Kate+Simpson&background=78716c&color=fff", bio: "24+ years in investment management. Leads VC initiatives at Gem's $12B OCIO platform. Helped launch Gem's private credit and lending verticals.", linkedinUrl: "https://linkedin.com/in/katesimpson" },
    { name: "Hannah Corry", role: "Co-founder", organizationId: orgMap["Handle"], imageUrl: "https://ui-avatars.com/api/?name=Hannah+Corry&background=78716c&color=fff", bio: "YC-backed founder building Handle, a construction finance and credit software platform. Focused on modernizing financial operations in the construction industry.", linkedinUrl: "https://linkedin.com/in/hannahcorry" },
    { name: "Caroline Stevenson", role: "Operating Partner, Talent", organizationId: orgMap["Abstract"], imageUrl: "https://ui-avatars.com/api/?name=Caroline+Stevenson&background=78716c&color=fff", bio: "Built talent organizations at multiple high-growth companies. Previously led People at Gem. Now Operating Partner focused on Talent at Abstract Ventures.", linkedinUrl: "https://linkedin.com/in/carolinestevenson" },
    { name: "Brandon", role: "Wealth Advisor", organizationId: orgMap["Spring Street Wealth"], imageUrl: "https://ui-avatars.com/api/?name=Brandon&background=78716c&color=fff", bio: "Wealth management professional at Spring Street Wealth.", linkedinUrl: "https://linkedin.com" },
    { name: "Justin Kunz", role: "CEO & Founding Partner", organizationId: orgMap["Inflection Capital"], imageUrl: "https://ui-avatars.com/api/?name=Justin+Kunz&background=78716c&color=fff", bio: "Former BlackRock and Fidelity executive. Launched Inflection Capital to focus on alternative investment distribution and advisory services.", linkedinUrl: "https://linkedin.com/in/justinkunz" },
  ];

  const contactRows = await db.insert(schema.contacts).values(contactsData).returning();
  const contactMap = Object.fromEntries(contactRows.map((c) => [c.name, c.id]));

  // Links
  const linksData = [
    { contactId: contactMap["Brandon Frisch"], type: "linkedin", url: "https://linkedin.com/in/brandonfrisch" },
    { contactId: contactMap["Brandon Frisch"], type: "website", url: "https://beginsoftware.com", label: "Begin Software" },
    { contactId: contactMap["Brandon Frisch"], type: "twitter", url: "https://x.com/brandonfrisch" },
    { contactId: contactMap["Brandon Frisch"], type: "github", url: "https://github.com/brandonfrisch" },
    { contactId: contactMap["Kate Simpson"], type: "linkedin", url: "https://linkedin.com/in/katesimpson" },
    { contactId: contactMap["Kate Simpson"], type: "website", url: "https://geminvestments.com", label: "Gem Investments" },
    { contactId: contactMap["Kate Simpson"], type: "twitter", url: "https://x.com/katesimpsonvc" },
    { contactId: contactMap["Hannah Corry"], type: "linkedin", url: "https://linkedin.com/in/hannahcorry" },
    { contactId: contactMap["Hannah Corry"], type: "website", url: "https://handle.com", label: "Handle" },
    { contactId: contactMap["Hannah Corry"], type: "twitter", url: "https://x.com/hannahcorry" },
    { contactId: contactMap["Hannah Corry"], type: "ycombinator", url: "https://ycombinator.com/companies/handle", label: "YC Profile" },
    { contactId: contactMap["Caroline Stevenson"], type: "linkedin", url: "https://linkedin.com/in/carolinestevenson" },
    { contactId: contactMap["Caroline Stevenson"], type: "website", url: "https://abstract.vc", label: "Abstract Ventures" },
    { contactId: contactMap["Caroline Stevenson"], type: "twitter", url: "https://x.com/carolinestev" },
    { contactId: contactMap["Brandon"], type: "linkedin", url: "https://linkedin.com" },
    { contactId: contactMap["Brandon"], type: "website", url: "https://springstreetwealth.com", label: "Spring Street Wealth" },
    { contactId: contactMap["Justin Kunz"], type: "linkedin", url: "https://linkedin.com/in/justinkunz" },
    { contactId: contactMap["Justin Kunz"], type: "website", url: "https://inflectioncap.com", label: "Inflection Capital" },
    { contactId: contactMap["Justin Kunz"], type: "twitter", url: "https://x.com/justinkunz" },
    { contactId: contactMap["Justin Kunz"], type: "substack", url: "https://justinkunz.substack.com", label: "Newsletter" },
  ];

  await db.insert(schema.contactLinks).values(linksData);

  // Career History
  const careerData = [
    { contactId: contactMap["Brandon Frisch"], role: "Managing Director & Co-founder", company: "Begin Software", startDate: "2018", endDate: "Present", description: "Built a 40+ engineer outsourced dev team serving 50+ companies. Focused on scaling engineering orgs for startups and mid-market.", isCurrent: true, source: "LinkedIn", sourceUrl: "https://linkedin.com/in/brandonfrisch" },
    { contactId: contactMap["Brandon Frisch"], role: "VP of Engineering", company: "Techstars", startDate: "2015", endDate: "2018", description: "Led engineering for accelerator programs. Mentored 100+ early-stage startup CTOs.", source: "LinkedIn", sourceUrl: "https://linkedin.com/in/brandonfrisch" },
    { contactId: contactMap["Brandon Frisch"], role: "Senior Software Engineer", company: "Rally Software (CA Technologies)", startDate: "2012", endDate: "2015", description: "Full-stack engineer on agile project management tools before the CA Technologies acquisition.", source: "LinkedIn", sourceUrl: "https://linkedin.com/in/brandonfrisch" },
    { contactId: contactMap["Kate Simpson"], role: "Managing Director, Head of VC", company: "Gem Investments", startDate: "2020", endDate: "Present", description: "Leads all VC initiatives across Gem's $12B OCIO platform. Launched private credit and lending verticals.", isCurrent: true, source: "LinkedIn", sourceUrl: "https://linkedin.com/in/katesimpson" },
    { contactId: contactMap["Kate Simpson"], role: "Director, Private Investments", company: "Cambridge Associates", startDate: "2014", endDate: "2020", description: "Managed $3B+ in alternative allocations for institutional LPs. Sourced and evaluated VC fund managers.", source: "LinkedIn", sourceUrl: "https://linkedin.com/in/katesimpson" },
    { contactId: contactMap["Kate Simpson"], role: "Associate", company: "Goldman Sachs", startDate: "2008", endDate: "2014", description: "Investment banking and private wealth management. Covered technology and healthcare sectors.", source: "LinkedIn", sourceUrl: "https://linkedin.com/in/katesimpson" },
    { contactId: contactMap["Kate Simpson"], role: "Analyst", company: "Morgan Stanley", startDate: "2002", endDate: "2008", description: "Equity research covering financial services. Started career in institutional sales.", source: "LinkedIn", sourceUrl: "https://linkedin.com/in/katesimpson" },
    { contactId: contactMap["Hannah Corry"], role: "Co-founder & CEO", company: "Handle", startDate: "2024", endDate: "Present", description: "Building construction finance software to modernize credit and payment operations. YC W24 batch.", isCurrent: true, source: "Crunchbase", sourceUrl: "https://crunchbase.com/organization/handle-finance" },
    { contactId: contactMap["Hannah Corry"], role: "Product Manager", company: "Brex", startDate: "2021", endDate: "2024", description: "Led product for spend management targeting construction and real estate verticals.", source: "LinkedIn", sourceUrl: "https://linkedin.com/in/hannahcorry" },
    { contactId: contactMap["Hannah Corry"], role: "Associate", company: "Bain & Company", startDate: "2019", endDate: "2021", description: "Strategy consulting focused on fintech and financial services clients.", source: "LinkedIn", sourceUrl: "https://linkedin.com/in/hannahcorry" },
    { contactId: contactMap["Caroline Stevenson"], role: "Operating Partner, Talent", company: "Abstract Ventures", startDate: "2025", endDate: "Present", description: "Advises portfolio companies on hiring strategy, org design, and executive recruiting.", isCurrent: true, source: "LinkedIn", sourceUrl: "https://linkedin.com/in/carolinestevenson" },
    { contactId: contactMap["Caroline Stevenson"], role: "VP People", company: "Gem (Recruiting Platform)", startDate: "2021", endDate: "2025", description: "Scaled the People org from 50 to 300 employees. Led all talent acquisition, people ops, and culture.", source: "LinkedIn", sourceUrl: "https://linkedin.com/in/carolinestevenson" },
    { contactId: contactMap["Caroline Stevenson"], role: "Head of Talent", company: "Plaid", startDate: "2018", endDate: "2021", description: "Built recruiting function during hypergrowth phase. Hired 200+ engineers and go-to-market team.", source: "LinkedIn", sourceUrl: "https://linkedin.com/in/carolinestevenson" },
    { contactId: contactMap["Caroline Stevenson"], role: "Recruiter", company: "Google", startDate: "2014", endDate: "2018", description: "Technical recruiting for Cloud and AI teams.", source: "LinkedIn", sourceUrl: "https://linkedin.com/in/carolinestevenson" },
    { contactId: contactMap["Brandon"], role: "Wealth Advisor", company: "Spring Street Wealth", startDate: "2022", endDate: "Present", description: "Financial planning and wealth management for high-net-worth individuals.", isCurrent: true, source: "LinkedIn", sourceUrl: "https://linkedin.com" },
    { contactId: contactMap["Brandon"], role: "Financial Advisor", company: "Merrill Lynch", startDate: "2018", endDate: "2022", description: "Managed $50M+ in client assets. Focus on tech executives and entrepreneurs.", source: "LinkedIn", sourceUrl: "https://linkedin.com" },
    { contactId: contactMap["Justin Kunz"], role: "CEO & Founding Partner", company: "Inflection Capital", startDate: "2025", endDate: "Present", description: "Building an alternatives distribution platform connecting fund managers with wealth advisors.", isCurrent: true, source: "LinkedIn", sourceUrl: "https://linkedin.com/in/justinkunz" },
    { contactId: contactMap["Justin Kunz"], role: "Managing Director", company: "Fidelity Investments", startDate: "2019", endDate: "2025", description: "Led alternative investment distribution strategy. Built partnerships with 500+ RIAs and wirehouses.", source: "LinkedIn", sourceUrl: "https://linkedin.com/in/justinkunz" },
    { contactId: contactMap["Justin Kunz"], role: "Vice President", company: "BlackRock", startDate: "2014", endDate: "2019", description: "Alternative investments product specialist. Covered institutional and wealth management channels.", source: "LinkedIn", sourceUrl: "https://linkedin.com/in/justinkunz" },
    { contactId: contactMap["Justin Kunz"], role: "Associate", company: "J.P. Morgan", startDate: "2010", endDate: "2014", description: "Private banking coverage of UHNW clients. Focus on alternative allocations.", source: "LinkedIn", sourceUrl: "https://linkedin.com/in/justinkunz" },
  ];

  await db.insert(schema.careerHistory).values(careerData);

  // News
  const newsData = [
    { contactId: contactMap["Brandon Frisch"], title: "Begin Software expands to 40+ engineers", source: "LinkedIn", url: "https://linkedin.com/in/brandonfrisch/posts/begin-40-engineers", date: "Jan 28, 2026", summary: "Announced team growth milestone and new multi-timezone delivery model." },
    { contactId: contactMap["Brandon Frisch"], title: "How we scaled dev teams for 50 startups", source: "Substack", url: "https://brandonfrisch.substack.com/p/scaling-dev-teams", date: "Jan 15, 2026", summary: "Published article on lessons learned building outsourced engineering teams." },
    { contactId: contactMap["Brandon Frisch"], title: "Speaking at Denver Startup Week", source: "Twitter", url: "https://x.com/brandonfrisch/status/1234567890", date: "Dec 5, 2025", summary: "Panel on 'Building Engineering Teams in the AI Era' at Denver Startup Week." },
    { contactId: contactMap["Kate Simpson"], title: "Gem launches private credit vertical", source: "Bloomberg", url: "https://bloomberg.com/news/articles/2026-02-03/gem-investments-private-credit", date: "Feb 3, 2026", summary: "Gem Investments expands beyond traditional VC with new $500M private credit fund." },
    { contactId: contactMap["Kate Simpson"], title: "The case for AI infrastructure investing", source: "LinkedIn", url: "https://linkedin.com/in/katesimpson/posts/ai-infrastructure-thesis", date: "Jan 20, 2026", summary: "Long-form post on why AI infrastructure will outperform AI application layer investments." },
    { contactId: contactMap["Kate Simpson"], title: "Named to 40 Under 40 in Finance", source: "Institutional Investor", url: "https://institutionalinvestor.com/40-under-40-2025", date: "Nov 12, 2025", summary: "Recognized for leadership in institutional VC allocation strategy." },
    { contactId: contactMap["Hannah Corry"], title: "Handle closes $4M seed round", source: "TechCrunch", url: "https://techcrunch.com/2026/01/30/handle-seed-round", date: "Jan 30, 2026", summary: "YC-backed Handle raises seed funding to modernize construction finance." },
    { contactId: contactMap["Hannah Corry"], title: "Why construction finance is broken", source: "Twitter", url: "https://x.com/hannahcorry/status/9876543210", date: "Jan 22, 2026", summary: "Thread on payment delays and credit inefficiencies costing the industry $40B/year." },
    { contactId: contactMap["Hannah Corry"], title: "YC W24 Demo Day presentation", source: "YouTube", url: "https://youtube.com/watch?v=handle-demo-day", date: "Sep 15, 2025", summary: "Pitched Handle at Y Combinator Demo Day to 1,000+ investors." },
    { contactId: contactMap["Caroline Stevenson"], title: "Joins Abstract Ventures as Operating Partner", source: "LinkedIn", url: "https://linkedin.com/in/carolinestevenson/posts/joining-abstract", date: "Jan 5, 2026", summary: "Announced move from Gem to Abstract Ventures to focus on portfolio company talent strategy." },
    { contactId: contactMap["Caroline Stevenson"], title: "Hiring in the age of AI agents", source: "LinkedIn", url: "https://linkedin.com/in/carolinestevenson/posts/hiring-ai-agents", date: "Dec 18, 2025", summary: "Article on how AI is changing the talent acquisition landscape for startups." },
    { contactId: contactMap["Brandon"], title: "Spring Street Wealth year in review", source: "Company Blog", url: "https://springstreetwealth.com/blog/2025-year-in-review", date: "Jan 10, 2026", summary: "Annual recap highlighting portfolio performance and new client services." },
    { contactId: contactMap["Justin Kunz"], title: "Announces launch of Inflection Capital", source: "LinkedIn", url: "https://linkedin.com/in/justinkunz/posts/launching-inflection", date: "Jan 15, 2026", summary: "Left Fidelity to build an alternatives distribution platform for the modern wealth advisor." },
    { contactId: contactMap["Justin Kunz"], title: "The future of alternative investment access", source: "Substack", url: "https://justinkunz.substack.com/p/future-of-alt-access", date: "Feb 1, 2026", summary: "First newsletter issue on democratizing alternatives for RIAs and family offices." },
    { contactId: contactMap["Justin Kunz"], title: "Interview: Why I left Fidelity", source: "Citywire RIA", url: "https://citywire.com/ria/news/justin-kunz-inflection-capital", date: "Jan 22, 2026", summary: "Discussed the opportunity gap in alt distribution and plans for Inflection Capital." },
  ];

  await db.insert(schema.contactNews).values(newsData);

  // Life Events
  const lifeEventsData = [
    { contactId: contactMap["Brandon Frisch"], event: "Company milestone", date: "Jan 2026", description: "Begin Software crossed 50 client companies served since founding.", source: "LinkedIn", sourceUrl: "https://linkedin.com/in/brandonfrisch/posts/begin-50-clients" },
    { contactId: contactMap["Brandon Frisch"], event: "Relocated", date: "2023", description: "Moved from Boulder to Denver to be closer to the startup ecosystem.", source: "LinkedIn" },
    { contactId: contactMap["Kate Simpson"], event: "Promotion", date: "2024", description: "Promoted to Managing Director at Gem Investments, overseeing all VC initiatives.", source: "LinkedIn", sourceUrl: "https://linkedin.com/in/katesimpson" },
    { contactId: contactMap["Kate Simpson"], event: "Board appointment", date: "Dec 2025", description: "Joined the board of a stealth AI infrastructure startup.", source: "Crunchbase", sourceUrl: "https://crunchbase.com/person/kate-simpson" },
    { contactId: contactMap["Hannah Corry"], event: "Founded company", date: "2024", description: "Left Brex to co-found Handle, accepted into YC W24 batch.", source: "Y Combinator", sourceUrl: "https://ycombinator.com/companies/handle" },
    { contactId: contactMap["Hannah Corry"], event: "Fundraise", date: "Jan 2026", description: "Closed $4M seed round led by YC Continuity and fintech angels.", source: "TechCrunch", sourceUrl: "https://techcrunch.com/2026/01/30/handle-seed-round" },
    { contactId: contactMap["Caroline Stevenson"], event: "New role", date: "Jan 2026", description: "Joined Abstract Ventures as Operating Partner after 4 years at Gem.", source: "LinkedIn", sourceUrl: "https://linkedin.com/in/carolinestevenson/posts/joining-abstract" },
    { contactId: contactMap["Caroline Stevenson"], event: "Speaking engagement", date: "Nov 2025", description: "Keynote at SaaStr Annual on building people-first engineering cultures.", source: "Twitter", sourceUrl: "https://x.com/carolinestev/status/saastr-keynote" },
    { contactId: contactMap["Justin Kunz"], event: "Founded company", date: "Jan 2026", description: "Launched Inflection Capital after 6 years at Fidelity Investments.", source: "LinkedIn", sourceUrl: "https://linkedin.com/in/justinkunz/posts/launching-inflection" },
    { contactId: contactMap["Justin Kunz"], event: "Left Fidelity", date: "Dec 2025", description: "Departed Managing Director role to pursue entrepreneurship in alternatives distribution.", source: "Citywire RIA", sourceUrl: "https://citywire.com/ria/news/justin-kunz-inflection-capital" },
    { contactId: contactMap["Justin Kunz"], event: "New baby", date: "Oct 2025", description: "Welcomed second child — a daughter.", source: "LinkedIn" },
  ];

  await db.insert(schema.contactLifeEvents).values(lifeEventsData);

  // Briefing
  await db.insert(schema.briefings).values({
    id: "2026-02-09",
    date: "Sunday, February 9, 2026",
    title: "Daily Briefing",
  });

  // Meetings
  const meetingsData = [
    {
      briefingId: "2026-02-09", contactId: contactMap["Brandon Frisch"], time: "10:30 AM", hour: 10.5,
      talkingPoints: JSON.stringify(["Ask about their team's experience with AI/agent tooling", "Explore potential development partnership for Anon integrations", "Discuss their client base and ideal project types"]),
      recentNews: "Begin Software recently expanded to 40+ engineers across multiple time zones.",
      summary: "Brandon co-founded Begin Software in 2018 and has grown it to 40+ engineers serving 50+ companies. Former VP Engineering at Techstars. Deep Denver tech ecosystem ties. Recently published on scaling outsourced dev teams and is speaking at Denver Startup Week on AI-era engineering. Good fit for a development partnership — his team has breadth across stacks and he understands early-stage velocity needs.",
      context: "Warm intro via Mike Chen (Techstars network). You and Brandon exchanged a few emails in January after Mike connected you. He's interested in exploring how Begin could provide engineering support for agent infrastructure projects. This is your first face-to-face meeting.",
      notes: JSON.stringify(["Brandon mentioned in his last email that he's specifically looking to grow their AI/ML practice — good angle for partnership.", "Begin's hourly rates are competitive for Denver market (~$85-120/hr depending on seniority).", "Mike Chen vouched strongly — said Brandon is 'the most reliable operator in Denver tech.'"]),
    },
    {
      briefingId: "2026-02-09", contactId: contactMap["Kate Simpson"], time: "11:00 AM", hour: 11,
      talkingPoints: JSON.stringify(["Understand Gem's thesis on AI infrastructure investments", "Discuss their portfolio company needs for agent/automation tooling", "Explore strategic partnership or investment opportunities"]),
      recentNews: "Gem recently launched their private credit vertical, expanding beyond traditional VC.",
      summary: "Kate leads VC at Gem Investments, a $12B OCIO platform. 24+ years in investment management spanning Goldman Sachs, Morgan Stanley, and Cambridge Associates. Recently named to 40 Under 40 in Finance. Gem just launched a private credit vertical and she's published bullish takes on AI infrastructure investing. Well-positioned as both a potential investor and a connector to Gem's portfolio companies.",
      context: "Met Kate at a fintech dinner in NYC last November. She mentioned Gem was looking at AI infrastructure deals and you followed up by email. She's been responsive and suggested meeting when schedules aligned. You've had two prior email exchanges — one about the market and one to set up this meeting.",
      notes: JSON.stringify(["Kate's LinkedIn post on AI infrastructure got 2,400+ engagements — she's clearly building thought leadership here.", "Gem's OCIO model means they allocate on behalf of endowments and foundations — could be a different investor profile than typical VC.", "She prefers in-person meetings over Zoom, per her email style."]),
    },
    {
      briefingId: "2026-02-09", contactId: contactMap["Hannah Corry"], time: "11:30 AM", hour: 11.5,
      talkingPoints: JSON.stringify(["Learn about Handle's integration needs with banks and lenders", "Discuss construction industry pain points around automation", "Explore how Anon's agent infrastructure could help their product"]),
      recentNews: "Handle recently closed their YC funding round.",
      summary: "Hannah left Brex in 2024 to co-found Handle, a YC W24 construction finance platform. Just closed a $4M seed led by YC Continuity. Former Bain consultant. She's vocal on Twitter about construction industry inefficiencies costing $40B/year in payment delays. Handle needs deep integrations with banks and lenders — potential use case for agent infrastructure to automate those connections.",
      context: "Intro from Sarah at YC. Hannah reached out directly after seeing your demo at a YC event in December. You had a brief Zoom call in January where she walked through Handle's product and integration challenges. She specifically asked to meet in person to discuss a potential pilot.",
      notes: JSON.stringify(["Handle currently integrates with 3 banks manually — she mentioned scaling to 50+ is their biggest bottleneck.", "Her co-founder (not attending) is the technical one — may need a follow-up call with their CTO.", "She's actively fundraising Series A in Q2 — timing is good for a pilot that demonstrates traction."]),
    },
    {
      briefingId: "2026-02-09", contactId: contactMap["Caroline Stevenson"], time: "2:00 PM", hour: 14,
      talkingPoints: JSON.stringify(["Discuss Abstract's portfolio company hiring needs", "Explore talent strategies for AI-native companies", "Potential intro to Abstract portfolio companies needing Anon"]),
      recentNews: "Recently joined Abstract as Operating Partner after leading People at Gem.",
      summary: "Caroline just joined Abstract Ventures as Operating Partner for Talent after 4 years leading People at Gem (50 to 300 employees). Built recruiting at Plaid during hypergrowth, started at Google. She advises Abstract's portfolio companies on hiring and org design. Strong connector — she can intro you to Abstract portfolio companies that need agent/automation tooling. Also published on hiring in the AI era.",
      context: "Caroline and you have a mutual friend in David Park from the Plaid days. David introduced you over email last month. She's interested in understanding the AI agent landscape to better advise Abstract's portfolio companies on technical hiring and tooling decisions. First meeting.",
      notes: JSON.stringify(["Abstract has ~30 portfolio companies — Caroline works closely with about 12 of them on talent.", "David Park said she's incredibly well-connected in SF/NYC startup circles.", "She's writing a series on AI and hiring — might be worth sharing your perspective for her next piece."]),
    },
    {
      briefingId: "2026-02-09", contactId: contactMap["Brandon"], time: "3:00 PM", hour: 15,
      talkingPoints: JSON.stringify(["Discuss wealth management strategies", "Explore financial planning options"]),
      recentNews: "Research pending - more details to follow.",
      summary: "Brandon is a wealth advisor at Spring Street Wealth, previously at Merrill Lynch where he managed $50M+ in client assets focused on tech executives and entrepreneurs. Moved to Spring Street in 2022 to work with high-net-worth individuals in a more boutique setting.",
      context: "Personal connection — Brandon has been your wealth advisor since 2023. This is a regular quarterly check-in to review portfolio allocation and financial planning. Casual, relationship-focused meeting.",
      notes: JSON.stringify(["Last quarter you discussed increasing alternatives allocation to 15% — follow up on that.", "He mentioned exploring direct real estate syndication opportunities in Denver."]),
    },
    {
      briefingId: "2026-02-09", contactId: contactMap["Justin Kunz"], time: "3:30 PM", hour: 15.5,
      talkingPoints: JSON.stringify(["Understand Inflection's thesis on AI in financial services", "Discuss distribution partnerships for fintech products", "Explore how agent infrastructure applies to wealth/alts"]),
      recentNews: "Recently launched Inflection Capital after leaving Fidelity.",
      summary: "Justin left a Managing Director role at Fidelity in December to launch Inflection Capital, an alternatives distribution platform. 15+ years spanning J.P. Morgan, BlackRock, and Fidelity. Built partnerships with 500+ RIAs at Fidelity. Just started a Substack on democratizing alt investment access. New baby in October. He's building in a space where agent automation could be transformative for advisor workflows.",
      context: "Cold outreach from Justin via LinkedIn in January. He'd seen coverage of your company and thought there were synergies between agent infrastructure and the wealth/alts distribution problem he's solving. You had a quick 15-minute intro call where he pitched the Inflection vision. He was energetic and well-prepared. Meeting to go deeper on potential collaboration.",
      notes: JSON.stringify(["Justin's Substack already has 800+ subscribers after one post — strong distribution instincts.", "He had a baby in October — congratulate him and ask how things are going.", "Inflection is pre-product but he's talking to 50+ RIAs for discovery. Could be a great design partner scenario."]),
    },
  ];

  await db.insert(schema.meetings).values(meetingsData);

  // Relationship Timeline
  const timelineData = [
    { contactId: contactMap["Brandon Frisch"], type: "intro", title: "Intro from Mike Chen", description: "Mike Chen (Techstars network) connected you via email. Mike said Brandon runs a solid dev shop and would be a great partner for agent infrastructure projects.", date: "Jan 10, 2026", channel: "gmail" },
    { contactId: contactMap["Brandon Frisch"], type: "email", title: "Intro from Mike — engineering partnership", description: "Hey Daniel, Mike Chen mentioned you're building some interesting agent infrastructure. We've been helping startups scale their eng teams and I'd love to chat about how Begin could support...", date: "Jan 12, 2026", direction: "inbound", fromAddress: "brandon@beginsoftware.com", toAddress: "daniel@example.com", channel: "gmail" },
    { contactId: contactMap["Brandon Frisch"], type: "email", title: "Re: Intro from Mike — engineering partnership", description: "Brandon, thanks for reaching out. Would love to learn more about Begin's approach. Are you free for a coffee when I'm in Denver next month?", date: "Jan 14, 2026", direction: "outbound", fromAddress: "daniel@example.com", toAddress: "brandon@beginsoftware.com", channel: "gmail" },
    { contactId: contactMap["Brandon Frisch"], type: "email", title: "Re: Intro from Mike — engineering partnership", description: "Absolutely — let's lock in Feb 9. I'll send a calendar invite. Looking forward to it.", date: "Jan 15, 2026", direction: "inbound", fromAddress: "brandon@beginsoftware.com", toAddress: "daniel@example.com", channel: "gmail" },
    { contactId: contactMap["Kate Simpson"], type: "meeting", title: "Met at fintech dinner in NYC", description: "Sat next to Kate at the Piper Sandler fintech dinner. Talked about AI infrastructure investing and Gem's OCIO model. She was very engaged and asked detailed questions about agent use cases.", date: "Nov 17, 2025", duration: "~30 min", channel: "in-person" },
    { contactId: contactMap["Kate Simpson"], type: "email", title: "Great meeting you at the fintech dinner", description: "Daniel, enjoyed our conversation last night about AI infrastructure. Gem is actively looking at this space and I'd love to continue the dialogue...", date: "Nov 18, 2025", direction: "inbound", fromAddress: "kate.simpson@geminvestments.com", toAddress: "daniel@example.com", channel: "gmail" },
    { contactId: contactMap["Kate Simpson"], type: "email", title: "Re: Great meeting you at the fintech dinner", description: "Kate, likewise! Your perspective on the OCIO model and how it intersects with AI was really interesting. Happy to share more about what we're building whenever you have time.", date: "Nov 20, 2025", direction: "outbound", fromAddress: "daniel@example.com", toAddress: "kate.simpson@geminvestments.com", channel: "gmail" },
    { contactId: contactMap["Kate Simpson"], type: "email", title: "Coffee in Denver?", description: "I'll be in Denver the week of Feb 9 for a board meeting. Any chance you're around? Would love to meet in person and go deeper on the AI infra thesis.", date: "Jan 28, 2026", direction: "inbound", fromAddress: "kate.simpson@geminvestments.com", toAddress: "daniel@example.com", channel: "gmail" },
    { contactId: contactMap["Kate Simpson"], type: "email", title: "Re: Coffee in Denver?", description: "Perfect timing — I'm in Denver that week too. How about Sunday morning, Feb 9 at 11 AM? There's a great spot near Union Station.", date: "Jan 29, 2026", direction: "outbound", fromAddress: "daniel@example.com", toAddress: "kate.simpson@geminvestments.com", channel: "gmail" },
    { contactId: contactMap["Hannah Corry"], type: "intro", title: "Intro from Sarah at YC", description: "Sarah from YC mentioned Handle as a company with interesting agent/automation needs in fintech. Didn't make a formal intro — Hannah reached out on her own after the demo.", date: "Dec 8, 2025", channel: "linkedin" },
    { contactId: contactMap["Hannah Corry"], type: "email", title: "Loved your demo at the YC event", description: "Hi Daniel! I'm Hannah, co-founder of Handle (YC W24). Your agent infrastructure demo really resonated with me — we have a massive integration problem with banks and lenders that this could solve...", date: "Dec 10, 2025", direction: "inbound", fromAddress: "hannah@handle.com", toAddress: "daniel@example.com", channel: "gmail" },
    { contactId: contactMap["Hannah Corry"], type: "email", title: "Re: Loved your demo at the YC event", description: "Hannah, thanks! Construction finance is a fascinating space. I looked at Handle and the problem you're solving is huge. Would love to learn more — can we hop on a Zoom?", date: "Dec 12, 2025", direction: "outbound", fromAddress: "daniel@example.com", toAddress: "hannah@handle.com", channel: "gmail" },
    { contactId: contactMap["Hannah Corry"], type: "call", title: "Zoom call — Handle product walkthrough", description: "Hannah walked through Handle's product and explained the integration challenges with banks and lenders. Construction payments are incredibly manual. Discussed potential pilot scope for agent-based automation of lender integrations.", date: "Jan 15, 2026", duration: "35 min", channel: "zoom" },
    { contactId: contactMap["Hannah Corry"], type: "email", title: "Zoom follow-up + in-person?", description: "Great call today! I'm even more excited about the potential here. I'll be in Denver Feb 9 — want to meet up and discuss a pilot?", date: "Jan 20, 2026", direction: "inbound", fromAddress: "hannah@handle.com", toAddress: "daniel@example.com", channel: "gmail" },
    { contactId: contactMap["Hannah Corry"], type: "email", title: "Re: Zoom follow-up + in-person?", description: "Definitely, let's do it. I'll block 11:30 AM. Send me the details on what you'd need for a pilot and I'll come prepared.", date: "Jan 21, 2026", direction: "outbound", fromAddress: "daniel@example.com", toAddress: "hannah@handle.com", channel: "gmail" },
    { contactId: contactMap["Caroline Stevenson"], type: "intro", title: "Intro from David Park", description: "David Park (mutual friend from Plaid days) connected you and Caroline over email. Said you two should know each other — she's advising Abstract portfolio companies on talent and tooling.", date: "Jan 8, 2026", channel: "gmail" },
    { contactId: contactMap["Caroline Stevenson"], type: "email", title: "Re: Intro: David Park → Daniel + Caroline", description: "Thanks David! Caroline, great to e-meet you. I'd love to chat about how Abstract's portfolio companies are thinking about AI tooling and talent. Are you open to meeting Feb 9 in Denver?", date: "Jan 9, 2026", direction: "outbound", fromAddress: "daniel@example.com", toAddress: "caroline@abstract.vc", channel: "gmail" },
    { contactId: contactMap["Caroline Stevenson"], type: "email", title: "Re: Intro: David Park → Daniel + Caroline", description: "Daniel, would love that! Feb 9 works. How about 2 PM? I'm curious to hear about the agent landscape — it's coming up a lot with our founders.", date: "Jan 10, 2026", direction: "inbound", fromAddress: "caroline@abstract.vc", toAddress: "daniel@example.com", channel: "gmail" },
    { contactId: contactMap["Brandon"], type: "note", title: "Became a client", description: "Started working with Brandon at Spring Street Wealth for personal financial planning and wealth management.", date: "Mar 2023", channel: "in-person" },
    { contactId: contactMap["Brandon"], type: "meeting", title: "Quarterly portfolio review", description: "Reviewed Q3 performance. Discussed increasing allocation to alternatives and re-balancing tech-heavy positions.", date: "Oct 15, 2025", duration: "45 min", channel: "in-person" },
    { contactId: contactMap["Brandon"], type: "email", title: "Q4 recap and Feb check-in", description: "Hey Daniel, happy new year. Q4 was solid — portfolio up 8.2%. Let's schedule our quarterly review. I have availability Feb 9 in the afternoon if that works?", date: "Jan 5, 2026", direction: "inbound", fromAddress: "brandon@springstreetwealth.com", toAddress: "daniel@example.com", channel: "gmail" },
    { contactId: contactMap["Brandon"], type: "email", title: "Re: Q4 recap and Feb check-in", description: "Sounds great. Let's do 3 PM on Feb 9. Looking forward to it.", date: "Jan 7, 2026", direction: "outbound", fromAddress: "daniel@example.com", toAddress: "brandon@springstreetwealth.com", channel: "gmail" },
    { contactId: contactMap["Justin Kunz"], type: "email", title: "Potential synergies — agent infra x alts distribution", description: "Hi Daniel, I'm Justin Kunz — just left Fidelity to start Inflection Capital. I've been following your work on agent infrastructure and I think there's a huge opportunity at the intersection of AI agents and alternative investment distribution...", date: "Jan 18, 2026", direction: "inbound", fromAddress: "justin@inflectioncap.com", toAddress: "daniel@example.com", channel: "linkedin" },
    { contactId: contactMap["Justin Kunz"], type: "email", title: "Re: Potential synergies — agent infra x alts distribution", description: "Justin, interesting background and compelling thesis. I can see how agent automation could transform advisor workflows. Let's find 15 min to chat this week.", date: "Jan 20, 2026", direction: "outbound", fromAddress: "daniel@example.com", toAddress: "justin@inflectioncap.com", channel: "gmail" },
    { contactId: contactMap["Justin Kunz"], type: "call", title: "Intro call — Inflection Capital vision", description: "Quick intro call. Justin pitched the Inflection vision: building an alternatives distribution platform for modern wealth advisors. He sees agent automation as key to making alt due diligence and onboarding frictionless. Energetic, well-prepared, clear thinker.", date: "Jan 22, 2026", duration: "15 min", channel: "phone" },
    { contactId: contactMap["Justin Kunz"], type: "email", title: "Re: Potential synergies — agent infra x alts distribution", description: "Quick call was great. I'm going to be in Denver Feb 9 — could we meet in person? I'd love to go deeper on the collaboration ideas we discussed.", date: "Jan 25, 2026", direction: "inbound", fromAddress: "justin@inflectioncap.com", toAddress: "daniel@example.com", channel: "gmail" },
    { contactId: contactMap["Justin Kunz"], type: "email", title: "Re: Potential synergies — agent infra x alts distribution", description: "Sounds good, Justin. I have 3:30 PM open. Let's meet then. Looking forward to it.", date: "Jan 26, 2026", direction: "outbound", fromAddress: "daniel@example.com", toAddress: "justin@inflectioncap.com", channel: "gmail" },
  ];

  await db.insert(schema.contactTimeline).values(timelineData);

  console.log("Seeded Postgres database:");
  console.log(`  ${orgs.length} organizations`);
  console.log(`  ${contactsData.length} contacts`);
  console.log(`  ${linksData.length} links`);
  console.log(`  ${careerData.length} career entries`);
  console.log(`  ${newsData.length} news items`);
  console.log(`  ${lifeEventsData.length} life events`);
  console.log(`  1 briefing`);
  console.log(`  ${meetingsData.length} meetings`);
  console.log(`  ${timelineData.length} timeline events`);

  await client.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
