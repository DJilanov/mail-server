const mailHandler = () => {

  let emails = {};

  const push = (item) => {
    emails[item.email] = item.code;
  };

  const getById = (id) => {
    let code = emails[id];
    if(!code) {
      return {
        waiting: true,
        code: null
      };
    }
    // TODO: Enable on prod
    // delete emails[id];
    return {
      waiting: false,
      code: code
    };
  };

  const removeById = (id) => {

  };

  return {
    push,
    getById,
    removeById,
  };
};
  
  module.exports = mailHandler;