const mysqlHelper = require('../../lib/mysqlHelper');
module.exports.addCategory = function (category) {
  //CategoryId, Name
  var params = [category.name, category.parentId];
  return mysqlHelper.execStoredProcedure('AddCategory', params);
};

module.exports.getCategories = function (categoryId) {
  var params = [categoryId];
  return mysqlHelper.execStoredProcedure('GetCategoriesById', params);
};
