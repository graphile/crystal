// @flow
const bindAll = (obj: {}, keys: Array<string>) => {
  keys.forEach(key => {
    obj[key] = obj[key].bind(obj);
  });
  return obj;
};

export { bindAll };
