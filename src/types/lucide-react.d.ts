declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';

  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
    strokeWidth?: number | string;
  }

  export type Icon = ComponentType<IconProps>;

  export const LayoutDashboard: Icon;
  export const BookOpenCheck: Icon;
  export const FileText: Icon;
  export const ClipboardCheck: Icon;
  export const ListChecks: Icon;
  export const Scaling: Icon;
  export const GraduationCap: Icon;
  export const Users: Icon;
  export const UploadCloud: Icon;
  export const LogOut: Icon;
  export const Bot: Icon;
  export const Menu: Icon;
  export const X: Icon;
  export const Loader2: Icon;
  export const AlertCircle: Icon;
  export const Eye: Icon;
  export const Trash2: Icon;
  export const ArrowLeft: Icon;
  export const Upload: Icon;
  export const FileText: Icon;
}
