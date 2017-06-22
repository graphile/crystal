const bindAll = (obj, keys) => {
  keys.forEach(key => {
    obj[key] = obj[key].bind(obj);
  });
  return obj;
};

exports.bindAll = bindAll;
