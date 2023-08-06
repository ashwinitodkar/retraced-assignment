const categoryService = require('../category.service');
const categoryRepository = require('../category.repository');

jest.mock('../category.repository');

describe('category service tests', () => {
  const categories = [
    { id: 1, name: 'edwd', parentId: null },
    { id: 2, name: 'ttt', parentId: null },
    { id: 3, name: 'ooo', parentId: 1 },
    { id: 4, name: 'ppp', parentId: 3 },
    { id: 5, name: 'lll', parentId: 4 },
    { id: 6, name: 'mmm', parentId: 4 },
    { id: 7, name: 'nnn', parentId: 3 },
    { id: 8, name: 'zzz', parentId: 2 },
  ];

  describe('getNestedCategories', () => {
    it('should return complete tree correctly when no parentId specified', () => {
      // Given
      const parentId = null;

      // When
      const tree = categoryService.getNestedCategories(categories, parentId);

      // Then
      expect(tree).toStrictEqual([
        {
          id: 1,
          name: 'edwd',
          parentId: null,
          subCategory: [
            {
              id: 3,
              name: 'ooo',
              parentId: 1,
              subCategory: [
                {
                  id: 4,
                  name: 'ppp',
                  parentId: 3,
                  subCategory: [
                    {
                      id: 5,
                      name: 'lll',
                      parentId: 4,
                    },
                    {
                      id: 6,
                      name: 'mmm',
                      parentId: 4,
                    },
                  ],
                },
                {
                  id: 7,
                  name: 'nnn',
                  parentId: 3,
                },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'ttt',
          parentId: null,
          subCategory: [
            {
              id: 8,
              name: 'zzz',
              parentId: 2,
            },
          ],
        },
      ]);
    });

    it('should return correct tree for given categoryId', () => {
      // Given
      const parentId = 2;

      // When
      const tree = categoryService.getNestedCategories(categories, parentId);

      // Then
      expect(tree).toStrictEqual([
        {
          id: 8,
          name: 'zzz',
          parentId: 2,
        },
      ]);
    });

    it('should return [] when no parentId found for given categoryId', () => {
      // Given
      const parentId = 2000;

      // When
      const tree = categoryService.getNestedCategories(categories, parentId);

      // Then
      expect(tree).toStrictEqual([]);
      expect(
        categories.find((aCategory) => aCategory.parentId === parentId)
      ).toBe(undefined);
    });
  });

  describe('getCategoryTree', () => {
    it('should return complete tree correctly when no parentId specified', async () => {
      // Given
      const parentId = null;
      categoryRepository.getCategoriesById = jest
        .fn()
        .mockResolvedValueOnce([categories]);

      // When
      const tree = await categoryService.getCategoryTree(parentId);

      // Then
      expect(tree).toStrictEqual([
        {
          id: 1,
          name: 'edwd',
          parentId: null,
          subCategory: [
            {
              id: 3,
              name: 'ooo',
              parentId: 1,
              subCategory: [
                {
                  id: 4,
                  name: 'ppp',
                  parentId: 3,
                  subCategory: [
                    {
                      id: 5,
                      name: 'lll',
                      parentId: 4,
                    },
                    {
                      id: 6,
                      name: 'mmm',
                      parentId: 4,
                    },
                  ],
                },
                {
                  id: 7,
                  name: 'nnn',
                  parentId: 3,
                },
              ],
            },
          ],
        },
        {
          id: 2,
          name: 'ttt',
          parentId: null,
          subCategory: [
            {
              id: 8,
              name: 'zzz',
              parentId: 2,
            },
          ],
        },
      ]);
    });

    it('should return correct tree for given categoryId', async () => {
      // Given
      const parentId = 2;
      categoryRepository.getCategoriesById = jest
        .fn()
        .mockResolvedValueOnce([
          categories.filter((aCategory) => aCategory.parentId === parentId),
        ]);

      // When
      const tree = await categoryService.getCategoryTree(parentId);

      // Then
      expect(tree).toStrictEqual([
        {
          id: 8,
          name: 'zzz',
          parentId: 2,
        },
      ]);
    });

    it('should return [] when no parentId found for given categoryId', async () => {
      // Given
      const parentId = 2000;
      categoryRepository.getCategoriesById = jest
        .fn()
        .mockResolvedValueOnce([[]]);

      // When
      const tree = await categoryService.getCategoryTree(parentId);

      // Then
      expect(tree).toStrictEqual([]);
      expect(
        categories.find((aCategory) => aCategory.parentId === parentId)
      ).toBe(undefined);
    });

    it('should return the category when no sub category found for given categoryId', async () => {
      // Given
      const id = 8;
      const nodeId8 = categories.find((aCategory) => aCategory.id === id);
      categoryRepository.getCategoriesById = jest
        .fn()
        .mockResolvedValueOnce([nodeId8]);

      // When
      const tree = await categoryService.getCategoryTree(id);

      // Then
      expect(tree).toStrictEqual(nodeId8);
    });

    it('should return [] when unexpected data received from db', async () => {
      // Given
      const parentId = null;

      categoryRepository.getCategoriesById = jest
        .fn()
        .mockResolvedValueOnce([null]);

      // When
      const tree = await categoryService.getCategoryTree(parentId);

      // Then
      expect(tree).toStrictEqual([]);
    });

    it('should log and throw when exception occured', async () => {
      // Given
      const parentId = null;

      categoryRepository.getCategoriesById = jest
        .fn()
        .mockRejectedValueOnce(new Error('Example DB error'));

      // Then
      await expect(
        // When
        categoryService.getCategoryTree(parentId)
      ).rejects.toThrow();
    });
  });
});
