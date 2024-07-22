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
      className="py-1 px-4 rounded-sm bg-red-500 inline text-white text-lg"
    >
      EDIT
    </button>
  );
}
