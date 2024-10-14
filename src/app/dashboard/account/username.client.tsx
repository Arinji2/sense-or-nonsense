"use client";

import { UpdateUsernameAction } from "@/actions/account";
import { Button } from "@/components/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { cn } from "../../../../utils/cn";
import { UsernameSchema } from "../../../../validations/pb/schema";

export default function Username({
  isGuest,
  currentUsername,
}: {
  isGuest: boolean;
  currentUsername: string;
}) {
  const router = useRouter();
  const [username, setUsername] = useState(currentUsername);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div
      className={cn(
        "flex h-fit w-full flex-col items-center justify-center gap-8 gap-y-2 bg-green-500/20 p-4 md:h-[200px] md:flex-row",
        {
          "cursor-not-allowed opacity-20": isGuest,
        },
      )}
    >
      <div className="flex h-fit w-fit flex-col items-center justify-center md:w-[300px] md:items-start xl:w-[400px]">
        <h3 className="text-lg font-bold text-white md:text-xl xl:text-2xl">
          EDIT USERNAME
        </h3>
      </div>
      <div className="h-[80%] w-[2px] bg-white/20"></div>
      <form className="flex h-fit w-full flex-col items-center justify-center gap-3 gap-y-8 md:flex-row xl:w-[500px]">
        <div className="flex h-fit w-fit flex-col items-start justify-start gap-6 md:gap-3">
          <p className="text-center text-xss font-bold text-white md:text-left">
            Edit your username
          </p>

          <input
            type="text"
            disabled={isGuest}
            value={username}
            onChange={(e) => {
              const parse = UsernameSchema.safeParse(e.target.value);
              if (parse.success) {
                setUsername(e.target.value);
              } else {
                const errorMessage =
                  parse.error.errors[0]?.message || "Invalid input";
                toast.error(errorMessage);

                return;
              }
            }}
            className="h-fit w-full shrink rounded-sm bg-white/10 px-3 py-2 text-sm text-white outline-none md:w-fit md:py-1.5 md:text-xs xl:py-2.5"
          />
        </div>
        <Button
          disabled={
            isGuest ||
            username === currentUsername ||
            username === "" ||
            isLoading
          }
          type="submit"
          onClick={async (e) => {
            e.preventDefault();
            setIsLoading(true);
            const toastID = toast.loading("Updating Username...");
            try {
              await UpdateUsernameAction(username);

              toast.success("Username Updated Successfully!");
            } catch (e) {
              if (
                e instanceof Error &&
                e.message === "Username already exists"
              ) {
                toast.error("Username Already Exists");
              } else {
                toast.error("Username Update Failed");
              }
            } finally {
              toast.dismiss(toastID);
            }

            router.refresh();
            setIsLoading(false);
          }}
          className="h-fit w-full shrink-0 rounded-sm bg-green-500 bg-opacity-30 px-3 leading-tight hover:bg-opacity-70 md:ml-auto xl:w-[120px] xl:py-2"
        >
          <p className="text-xs font-bold text-white md:text-xs">SAVE</p>
        </Button>
      </form>
    </div>
  );
}
