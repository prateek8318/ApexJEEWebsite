const fs = require('fs');

const fixes = [
  {
    file: 'app/(admin)/admin/notes/page.tsx',
    replaces: [
      { find: 'Search, ', replace: '' }
    ]
  },
  {
    file: 'app/(admin)/admin/questions/page.tsx',
    replaces: [
      { find: 'import { Input } from "@/components/ui/input";\n', replace: '' }
    ]
  },
  {
    file: 'app/(admin)/admin/subjects/page.tsx',
    replaces: [
      { find: 'import { Input } from "@/components/ui/input";\n', replace: '' }
    ]
  },
  {
    file: 'app/(admin)/admin/tests/page.tsx',
    replaces: [
      { find: 'import { Input } from "@/components/ui/input";\n', replace: '' },
      { find: 'Search, ', replace: '' }
    ]
  },
  {
    file: 'app/(admin)/admin/topics/page.tsx',
    replaces: [
      { find: 'import { Input } from "@/components/ui/input";\n', replace: '' }
    ]
  },
  {
    file: 'app/(admin)/admin/videos/page.tsx',
    replaces: [
      { find: 'import { Input } from "@/components/ui/input";\n', replace: '' },
      { find: 'Search, ', replace: '' }
    ]
  },
  {
    file: 'app/(others)/chapters/[chapterId]/components/topic-accordion.tsx',
    replaces: [
      { find: 'import { X } from "lucide-react";\n', replace: '' },
      { find: 'import Link from "next/link";\n', replace: '' },
      { find: 'import { usePathname } from "next/navigation";\n', replace: '' },
      { find: 'from "@types/user-api"', replace: 'from "@/types/user-api"' }
    ]
  },
  {
    file: 'app/(others)/chapters/[chapterId]/page.tsx',
    replaces: [
      { find: ' ChevronRight, ', replace: ' ' },
      { find: 'import { useRouter } from "next/navigation";\n', replace: '' }
    ]
  },
  {
    file: 'components/admin/note-dialog.tsx',
    replaces: [
      { find: 'type="file"', replace: 'type={"file" as any}' }
    ]
  },
  {
    file: 'components/admin/question-dialog.tsx',
    replaces: [
      { find: 'type="file"', replace: 'type={"file" as any}' }
    ]
  },
  {
    file: 'components/admin/subject-dialog.tsx',
    replaces: [
      { find: 'CheckCircle2, ', replace: '' },
      { find: 'import Image from "next/image";\n', replace: '' },
      { find: 'type="color"', replace: 'type={"color" as any}' },
      { find: 'type="file"', replace: 'type={"file" as any}' }
    ]
  },
  {
    file: 'components/admin/test-dialog.tsx',
    replaces: [
      { find: 'type="datetime-local"', replace: 'type={"datetime-local" as any}' }
    ]
  },
  {
    file: 'components/admin/video-dialog.tsx',
    replaces: [
      { find: 'type="file"', replace: 'type={"file" as any}' }
    ]
  }
];

for (const fix of fixes) {
  if (fs.existsSync(fix.file)) {
    let content = fs.readFileSync(fix.file, 'utf8');
    for (const r of fix.replaces) {
      // replace all instances
      content = content.split(r.find).join(r.replace);
    }
    fs.writeFileSync(fix.file, content);
    console.log("Fixed " + fix.file);
  } else {
    console.log("File not found: " + fix.file);
  }
}
