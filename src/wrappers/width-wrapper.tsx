export default function WidthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-[95%] xl:w-full h-full flex flex-col items-center justify-center max-w-[1280px]">
      {children}
    </div>
  );
}
