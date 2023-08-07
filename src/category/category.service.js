const logger = require('../lib/logger');

const categoryRepository = require('./category.repository');

function getNestedCategories(categories, categoryId) {
  var categoryTree = [];
  for (let i in categories) {
    if (categories[i].parentId == categoryId) {
      var children = getNestedCategories(categories, categories[i].id);

      if (children.length) {
        categories[i].subCategory = children;
      }
      categoryTree.push(categories[i]);
    }
  }
  return categoryTree;
}

const getCategoryTree = async (categoryId) => {
  try {
    const categories = await categoryRepository.getCategoriesById(categoryId);

    if (!categories || !categories[0]) {
      logger.warn('No category found for given categoryId', {
        categoryId,
        categories,
      });
      return [];
    }

    const tree = getNestedCategories(categories[0], categoryId);

    return tree.length ? tree : categories[0];
  } catch (error) {
    logger.error('Error in processing tree data', e);
    throw error;
  }
};

module.exports = { getCategoryTree, getNestedCategories };
