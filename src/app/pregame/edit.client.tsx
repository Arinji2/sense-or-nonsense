"use client";

import { useRouter } from "next/navigation";
import { EncryptGameDataAction } from "../../../utils/game-data";

export default function EditButton({
  objKey,
  reset,
}: {
  objKey: string;
  reset?: boolean;
}) {
  const router = useRouter();
  return (
    <button
      onClick={async () => {
        await EncryptGameDataAction({
          key: objKey,
          value: "",
          deleteKey: true,
          reset: reset,
        });

        router.refresh();
      }}
      className="inline rounded-sm bg-red-500 px-4 py-1 text-lg text-white"
    >
      EDIT
    </button>
  );
}
