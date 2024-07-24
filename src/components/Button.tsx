export const Button = (
  props: React.ComponentPropsWithoutRef<"button">,
  className: string,
) => {
  return (
    <button
      className={`${className} inline-flex items-center rounded-md border-b-2 border-blue-900 bg-blue-950 px-8 py-2 font-semibold text-[1.rem] text-white no-underline transition hover:bg-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-700 focus:ring-offset-1`}
      {...props}
    >
      {props.children}
    </button>
  );
};
