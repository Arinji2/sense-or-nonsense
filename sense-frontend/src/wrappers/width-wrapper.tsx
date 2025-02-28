export default function WidthWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-full-page flex h-full w-full flex-col items-center justify-center xl:w-full">
      {children}
    </div>
  );
}
