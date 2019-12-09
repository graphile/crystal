import { base64 } from "../utils";

function cursorify(val: any) {
  return val && val.__cursor ? base64(JSON.stringify(val.__cursor)) : null;
}

export default (function addStartEndCursor(value: any) {
  const data = value && value.data && value.data.length ? value.data : null;
  const startCursor = cursorify(data && data[0]);
  const endCursor = cursorify(data && data[value.data.length - 1]);
  return {
    ...value,
    startCursor,
    endCursor,
  };
});
