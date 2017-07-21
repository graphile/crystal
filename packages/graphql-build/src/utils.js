const bindAll = (obj, keys) => {
  keys.forEach(key => {
    obj[key] = obj[key].bind(obj);
  });
  return obj;
};

export { bindAll };
