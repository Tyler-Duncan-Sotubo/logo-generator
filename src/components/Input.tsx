export const Input = (props: React.ComponentPropsWithoutRef<"input">) => {
  return (
    <input
      {...props}
      type="text"
      className="mt-2 w-full rounded-lg border bg-slate-50 px-4 py-4 text-2xl font-medium outline-none"
    />
  );
};
