// Vendored from @fluid/utils (fluidfunctionalism.com), transpiled to JS.
// Update by re-fetching the registry item, not by editing here.
import { clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        // <generated:type-scale>
        "text-display",
        "text-title",
        "text-subtitle",
        "text-body",
        "text-caption",
        "text-micro",
        "text-site-display",
        "text-site-title",
        "text-site-subtitle",
        "text-site-body",
        "text-site-caption",
        "text-site-micro"
        // </generated:type-scale>
      ]
    }
  }
});
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
export {
  cn
};
