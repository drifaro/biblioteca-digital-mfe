/// <reference types="vite/client" />

declare module "mfe_shared/Modal" {
  import type { FC } from "react";
  const C: FC<{
    title: string;
    onClose: () => void;
    footer: React.ReactNode;
    children: React.ReactNode;
  }>;
  export default C;
}
declare module "mfe_shared/SearchBar" {
  import type { FC } from "react";
  const C: FC<Record<string, unknown>>;
  export default C;
}
declare module "mfe_shared/StatCard" {
  import type { FC } from "react";
  const C: FC<Record<string, unknown>>;
  export default C;
}
declare module "mfe_shared/EmptyState" {
  import type { FC } from "react";
  const C: FC<Record<string, unknown>>;
  export default C;
}
declare module "mfe_shared/AuthorAvatar" {
  import type { FC } from "react";
  const C: FC<Record<string, unknown>>;
  export default C;
}
declare module "mfe_shared/Pagination" {
  import type { FC } from "react";
  const C: FC<Record<string, unknown>>;
  export default C;
}
declare module "mfe_shared/PlusIcon" {
  import type { FC, SVGProps } from "react";
  const C: FC<SVGProps<SVGSVGElement>>;
  export default C;
}
declare module "mfe_shared/EditIcon" {
  import type { FC, SVGProps } from "react";
  const C: FC<SVGProps<SVGSVGElement>>;
  export default C;
}
declare module "mfe_shared/TrashIcon" {
  import type { FC, SVGProps } from "react";
  const C: FC<SVGProps<SVGSVGElement>>;
  export default C;
}
