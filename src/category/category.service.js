const logger = require('../lib/logger');

const categoryRepository = require('./category.repository');

function getNestedCategories(categories, categoryId) {
  let categoryTree = [];
  for (let i in categories) {
    if (categories[i].parentId == categoryId) {
      let children = getNestedCategories(categories, categories[i].id);

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

    let rootNode = null;
    const tree = getNestedCategories(categories[0], categoryId);
    if (categoryId !== undefined && categoryId !== null) {
      rootNode = categories[0].find((category) => category.id == categoryId);
    }
    if (tree.length) {
      if (rootNode) {
        rootNode.subCategory = tree;
        return rootNode;
      }
      return tree;
    }

    return categories[0];
  } catch (error) {
    logger.error('Error in processing tree data', error);
    throw error;
  }
};

module.exports = { getCategoryTree, getNestedCategories };
