import type { ReactNode } from "react";

export function MobileShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh px-0 text-broker-ink sm:px-4">
      <div className="mx-auto flex min-h-dvh w-full max-w-[480px] flex-col overflow-hidden bg-broker-bg shadow-2xl sm:border-x sm:border-broker-border">
        {children}
      </div>
    </div>
  );
}
