export function Button({ variant="primary", className="", ...props }) {
  const base = variant==="ghost" ? "btn-ghost" : "btn-primary";
  return <button className={`${base} ${className}`} {...props} />;
}