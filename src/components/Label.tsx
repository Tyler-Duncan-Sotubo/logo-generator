export const Label = (props: React.ComponentPropsWithoutRef<"label">) => {
  return (
    <label {...props} className="mb-3 w-full px-2 text-xl font-medium">
      {props.children}
    </label>
  );
};
