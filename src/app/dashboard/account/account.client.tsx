"use client";

import { ConvertAccount } from "@/actions/account";
import { Button } from "@/components/button";
import AuthModal from "@/modals/auth-modal";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import useAnimate from "../../../../utils/useAnimate";

export default function Account() {
  const [documentDefined, setDocumentDefined] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const animate = useAnimate(800);
  const searchParams = useSearchParams();
  const isValidatedRef = useRef(false);
  const hasValidState = useMemo(() => {
    return searchParams.get("toConvert") === "true";
  }, [searchParams]);

  useEffect(() => {
    if (!hasValidState || isValidatedRef.current) return;

    isValidatedRef.current = true;

    toast.promise(
      (async () => {
        await ConvertAccount();
        isValidatedRef.current = false;
      })(),
      {
        loading: "Converting Account...",
        success: "Account Converted Successfully!",
        error: "Account Conversion Failed!",
      },
    );
  }, [hasValidState]);

  useEffect(() => {
    setDocumentDefined(true);
  }, []);
  return (
    <>
      {documentDefined &&
        showModal &&
        createPortal(
          <AuthModal
            Animate={animate}
            state={{
              key: "toConvert",
              value: "true",
            }}
          />,
          document.body,
        )}
      <div className="flex h-fit w-full flex-col items-center justify-center gap-8 gap-y-2 bg-blue-500/20 p-4 md:h-[200px] md:flex-row">
        <div className="flex h-fit w-fit flex-col items-center justify-center md:w-[300px] md:items-start xl:w-[400px]">
          <h3 className="text-lg font-bold text-white md:text-xl xl:text-2xl">
            CONVERT ACCOUNT
          </h3>
        </div>
        <div className="h-[80%] w-[2px] bg-white/20"></div>
        <div className="flex h-full w-fit flex-col items-center justify-center gap-3 gap-y-8 md:flex-row xl:w-[500px]">
          <div className="flex h-fit w-fit flex-col items-start justify-start gap-6 md:gap-3">
            <p className="text-center text-xss font-bold text-white md:text-left">
              By converting,{" "}
              <span className="inline md:block">
                {" "}
                you get the following benefits.
              </span>
            </p>
            <div className="flex h-fit w-full flex-col items-center justify-center md:w-fit">
              <ul className="flex h-fit w-fit flex-col items-start justify-start gap-2 text-white/50">
                <li className="flex flex-row items-center justify-start gap-2 text-xss">
                  <div className="size-2 rounded-full bg-green-500"></div>
                  Secure your Account
                </li>
                <li className="flex flex-row items-center justify-start gap-2 text-xss">
                  <div className="size-2 rounded-full bg-green-500"></div>
                  Login anywhere
                </li>
                <li className="flex flex-row items-center justify-start gap-2 text-xss">
                  <div className="size-2 rounded-full bg-green-500"></div>
                  Set a username
                </li>
                <li className="flex flex-row items-center justify-start gap-2 text-xss">
                  <div className="size-2 rounded-full bg-green-500"></div>
                  Set defaults
                </li>
              </ul>
            </div>
          </div>
          <Button
            onClick={() => {
              setShowModal(true);
              animate.setQueue(true);
            }}
            className="h-fit w-full rounded-sm bg-green-500 bg-opacity-30 px-3 leading-tight hover:bg-opacity-70 md:ml-auto md:w-fit xl:w-[120px] xl:py-2"
          >
            <p className="text-xs font-bold text-white md:text-xs">CONVERT</p>
          </Button>
        </div>
      </div>
    </>
  );
}
