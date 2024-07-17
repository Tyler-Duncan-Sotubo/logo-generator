export const Input = (props: React.ComponentPropsWithoutRef<"input">) => {
  return (
    <input
      {...props}
      type="text"
      className="w-full border-b px-2 py-3 outline-none"
    />
  );
};
