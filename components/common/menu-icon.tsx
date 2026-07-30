import {
  Activity,
  Award,
  Baby,
  BadgeDollarSign,
  BookOpen,
  Bookmark,
  BookOpenText,
  Building2,
  Calendar,
  CircleDollarSign,
  CircleDot,
  CircleUserRound,
  ClipboardList,
  ContactRound,
  CreditCard,
  DollarSign,
  FileCheck,
  FileHeadphoneIcon,
  FilePenLine,
  FileText,
  GraduationCap,
  Heart,
  HelpCircle,
  Layers,
  LayoutDashboard,
  LayoutList,
  Library,
  Megaphone,
  MessageSquareWarningIcon,
  PersonStanding,
  PlayCircle,
  Settings,
  ShieldPlus,
  ShoppingBag,
  Target,
  TrendingUp,
  UsersRound,
  Video,
} from "lucide-react";

type MenuIconProps = {
  src: string;
};

const MenuIcon = ({ src }: MenuIconProps) => {
  switch (src) {
    case "/admin/dashboard":
    case "/dashboard":
      return <LayoutDashboard />;
    case "/admin/subjects":
      return <BookOpen />;
    case "/admin/chapters":
      return <Layers />;
    case "/admin/topics":
      return <Library />;
    case "/admin/questions":
      return <HelpCircle />;
    case "/admin/videos":
      return <Video />;
    case "/admin/notes":
      return <FileText />;
    case "/self-learning":
      return <BookOpenText />;
    case "/study-materials":
      return <Library />;
    case "/video-lectures":
      return <Video />;
    case "/practice-questions":
      return <HelpCircle />;
    case "/revision-notes":
      return <BookOpen />;
    case "/mock-tests":
      return <GraduationCap />;
    case "/timetable":
      return <Calendar />;
    case "/performance":
      return <TrendingUp />;
    case "/subscription-billing":
      return <CreditCard />;
    case "/doubt-form":
      return <MessageSquareWarningIcon />;
    case "/notice-board":
      return <Megaphone />;
    case "/consent-artifact":
      return <ClipboardList />;
    case "/processing-inventory":
      return <LayoutList />;
    case "/consent-template":
      return <FileText />;
    case "/edit-forms":
      return <FilePenLine />;
    case "/settings":
      return <Settings />;
    case "/processing-inventory/processing-category":
      return <Layers />;
    case "/processing-inventory/processing-activities":
      return <Activity />;
    case "/processing-inventory/processing-purpose":
      return <Target />;
    case "/store":
      return <ShoppingBag />;
    case "/students":
      return <GraduationCap />;
    case "/parents":
      return <PersonStanding />;
    case "/guardians":
      return <PersonStanding />;
    case "/kids":
      return <Baby />;
    case "/developers":
      return <ContactRound />;
    case "/webinars":
      return <Video />;
    case "/courses":
      return <PlayCircle />;
    case "/lessons":
      return <BookOpenText />;
    case "/sections":
      return <Bookmark />;
    case "/organizations":
      return <Building2 />;
    case "/users":
      return <UsersRound />;
    case "/transactions":
      return <DollarSign />;
    case "/refunds":
      return <CircleDollarSign />;
    case "/payments":
      return <BadgeDollarSign />;
    case "/wishlist":
      return <Heart />;
    case "/library":
      return <Library />;
    case "/certificates":
      return <Award />;
    case "/profile":
      return <CircleUserRound />;
    case "/privacy-notice":
      return <ShieldPlus />;
    case "/consent-forms":
      return <FileCheck />;
    case "/grievance":
      return <MessageSquareWarningIcon />;
    case "/support":
      return <FileHeadphoneIcon />;
    default:
      return <CircleDot />;
  }
};

export default MenuIcon;
