import { library } from "@fortawesome/fontawesome-svg-core"; // Import the library component.
import { fab } from "@fortawesome/free-brands-svg-icons"; // Import all brands icons.
import { fas } from "@fortawesome/free-solid-svg-icons"; // Import all solid icons.
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import the FontAwesomeIcon component.
import Equivalent from "@site/src/components/Equivalent";
import MDXComponents from "@theme-original/MDXComponents";

library.add(fab, fas);

export default {
  ...MDXComponents,
  equivalent: Equivalent,
  Icon: FontAwesomeIcon, // Make the FontAwesomeIcon component available in MDX as <icon />.
};
