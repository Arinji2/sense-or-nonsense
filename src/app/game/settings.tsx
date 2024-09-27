"use client";

import { SettingsIcon } from "lucide-react";
import { useState } from "react";

export default function Settings() {
  const [isEnabled, setIsEnabled] = useState(false);

  return (
    <div className="fixed z-20 flex flex-row items-center justify-center gap-2 rounded-md bg-black px-3 py-2 xl:right-5 xl:top-10">
      <SettingsIcon className="size-10" />
    </div>
  );
}
