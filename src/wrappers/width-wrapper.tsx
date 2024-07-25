export default function WidthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full w-full max-w-[1280px] flex-col items-center justify-center xl:w-full">
      {children}
    </div>
  );
}
