const base64 = str => Buffer.from(String(str)).toString("base64");

function cursorify(val) {
  return val && val.__cursor ? base64(JSON.stringify(val.__cursor)) : null;
}

export default (function addStartEndCursor(value) {
  const data = value && value.data && value.data.length ? value.data : null;
  const startCursor = cursorify(data && data[0]);
  const endCursor = cursorify(data && data[value.data.length - 1]);
  return {
    ...value,
    startCursor,
    endCursor,
  };
});
