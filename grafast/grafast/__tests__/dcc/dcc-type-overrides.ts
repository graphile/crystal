import { Step } from "../../dist";
import { ItemSpec } from "./dcc-data";

export type Overrides = {
  SafeRoomStock: {
    source: Step<ItemSpec>;
  };
  ClubStock: {
    source: Step<ItemSpec>;
  };
};
