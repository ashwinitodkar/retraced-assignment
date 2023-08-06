const mysqlHelper = require('../lib/mysqlHelper');

module.exports.addCategory = function (category) {
  const { name, parentId } = category;
  return mysqlHelper.execStoredProcedure('AddCategory', [name, parentId]);
};

module.exports.getCategoriesById = function (categoryId) {
  const params = [categoryId];
  return mysqlHelper.execStoredProcedure('GetCategoriesById', params);
};
