import { Globe, MapPin, Building2,  Link as LinkIcon, Users, Calendar } from "lucide-react";

export const orgInfoData = [
  {
    icon: MapPin,
    text: "Noida, Uttar Pradesh",
  },
  {
    icon: LinkIcon,
    text: "consentgrid.in",
  },
  {
    icon: Users,
    text: "48 members",
  },
  {
    icon: Calendar,
    text: "Joined 2021",
  },
];

export const tabs = ["Overview", "Projects", "Members"];

export const appsData = [
  {
    id: 1,
    title: "Retail Banking Consent Hub",
    description:
      "Captures and manages customer consent for onboarding, card services, and partner offers.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
    stars: 73,
    forks: 19,
    updated: "Updated 1 day ago",
  },
  {
    id: 2,
    title: "Insurance Lead Consent API",
    description:
      "API-first gateway for collecting explicit lead-sharing consent with audit-ready logs.",
    tags: ["Node.js", "Fastify", "Redis"],
    stars: 61,
    forks: 14,
    updated: "Updated 4 days ago",
  },
  {
    id: 3,
    title: "Mobile Preference Center",
    description:
      "In-app privacy center for communication controls, cookie settings, and notice history.",
    tags: ["React Native", "TypeScript", "Firebase"],
    stars: 44,
    forks: 11,
    updated: "Updated 3 days ago",
  },
   {
    id: 4,
    title: "DPDP Audit Console",
    description:
      "Internal dashboard for DSAR tracking, policy attestations, and retention governance.",
    tags: ["Vue", "Go", "Elasticsearch"],
    stars: 39,
    forks: 9,
    updated: "Updated 6 days ago",
  },
];

export const activityData = [
  {
    id: 1,
    action: "pushed to",
    target: "consent-management-platform",
    time: "2 hours ago",
  },
  {
    id: 2,
    action: "created issue in",
    target: "privacy-policy-generator",
    time: "5 hours ago",
  },
  {
    id: 3,
    action: "merged PR in",
    target: "cookie-consent-widget",
    time: "1 day ago",
  },
];

export const membersData = [
  { name: "Sarah Chen", role: "Lead Engineer", initial: "SC" },
  { name: "Alex Morgan", role: "Product Manager", initial: "AM" },
  { name: "David Kim", role: "Designer", initial: "DK" },
  { name: "Priya Patel", role: "Backend Dev", initial: "PP" },
];

export const statsDatas = [
  { label: "Projects", value: "18" },
  { label: "Members", value: "48" },
  { label: "Stars", value: "2.4k" },
  { label: "Followers", value: "910" },
];

export const aboutData = [
  { icon: Globe, text: "consentgrid.in", highlight: true },
  { icon: MapPin, text: "Noida, Uttar Pradesh" },
  { icon: Building2, text: "Privacy & Compliance" },
  { icon: Users, text: "48 members · 9 teams" },
];

export const memberDetails = [
  {
    id: 1,
    name: "Amit Sharma",
    email: "amit.sharma@gmail.com",
    address: "Delhi, India",
    contact: "+91 9876543210",
  },
  {
    id: 2,
    name: "Priya Singh",
    email: "priya.singh@gmail.com",
    address: "Mumbai, India",
    contact: "+91 9123456780",
  },
  {
    id: 3,
    name: "Rahul Verma",
    email: "rahul.verma@gmail.com",
    address: "Bangalore, India",
    contact: "+91 9988776655",
  },
  {
    id: 4,
    name: "Neha Gupta",
    email: "neha.gupta@gmail.com",
    address: "Pune, India",
    contact: "+91 9090909090",
  },
  {
    id: 5,
    name: "Arjun Mehta",
    email: "arjun.mehta@gmail.com",
    address: "Ahmedabad, India",
    contact: "+91 9345678901",
  },
  {
    id: 6,
    name: "Sneha Kapoor",
    email: "sneha.kapoor@gmail.com",
    address: "Chandigarh, India",
    contact: "+91 9871234567",
  },
  {
    id: 7,
    name: "Vikram Joshi",
    email: "vikram.joshi@gmail.com",
    address: "Jaipur, India",
    contact: "+91 9765432109",
  },
  {
    id: 8,
    name: "Anjali Desai",
    email: "anjali.desai@gmail.com",
    address: "Surat, India",
    contact: "+91 9012345678",
  },
  {
    id: 9,
    name: "Karan Malhotra",
    email: "karan.malhotra@gmail.com",
    address: "Kolkata, India",
    contact: "+91 8899776655",
  },
];

export const projectDetails = [

  {
    id: 1,
    name: "Consent Artifact Vault",
    description: "Immutable storage and retrieval service for signed consent records and notice versions.",
  },
  {
    id: 2,
    name: "DSAR Lifecycle Manager",
    description: "Workflow engine for intake, assignment, SLA monitoring, and closure of data rights requests.",
  },
  {
    id: 3,
    name: "Granular Cookie Control Widget",
    description: "Frontend widget with category-wise controls for analytics, ads, and functional cookies.",
  },
  {
    id: 4,
    name: "Vendor Risk and Processor Registry",
    description: "Central registry for processors, DPA documents, and periodic compliance review status.",
  },
  {
    id: 5,
    name: "Notice Authoring Studio",
    description: "Template editor for multi-lingual privacy notices with versioning and publish approvals.",
  },
  {
    id: 6,
    name: "Cross-Channel Preference Sync Service",
    description: "Synchronizes opt-in and opt-out states across CRM, marketing automation, and support tools.",
  },

];
export const roles = [
  { label: "Support Staff", value: "ROLE_SUPPORT_STAFF" },
  { label: "Maintainer", value: "ROLE_MAINTAINER" },
  { label: "Organization Admin", value: "ROLE_ORG_ADMIN" },
  { label: "Super Admin", value: "ROLE_SUPER_ADMIN" },
  { label: "End User", value: "ROLE_END_USER" },
  { label: "DPO Manager", value: "ROLE_DPO_MANAGER" },
  { label: "Developer", value: "ROLE_DEVELOPER" },
];
