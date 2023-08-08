const categoryService = require('../category.service');
const categoryRepository = require('../category.repository');

jest.mock('../category.repository');

describe('category service tests', () => {
  const categories = [
    { id: 1, name: 'A', parentId: null },
    { id: 3, name: 'B', parentId: null },
    { id: 2, name: 'A1', parentId: 1 },
    { id: 5, name: 'A2', parentId: 1 },
    { id: 4, name: 'B1', parentId: 3 },
    { id: 6, name: 'B2', parentId: 3 },
    { id: 7, name: 'B10', parentId: 4 },
    { id: 8, name: 'B11', parentId: 4 },
    { id: 9, name: 'B20', parentId: 6 },
    { id: 10, name: 'B21', parentId: 6 },
    { id: 11, name: 'B201', parentId: 9 },
    { id: 12, name: 'B202', parentId: 9 },
  ];

  describe('getNestedCategories', () => {
    it('should return complete tree correctly when no id specified', () => {
      // Given
      const id = null;

      // When
      const tree = categoryService.getNestedCategories(categories, id);
      // Then
      expect(tree).toStrictEqual([
        {
          id: 1,
          name: 'A',
          parentId: null,
          subCategory: [
            { id: 2, name: 'A1', parentId: 1 },
            { id: 5, name: 'A2', parentId: 1 },
          ],
        },
        {
          id: 3,
          name: 'B',
          parentId: null,
          subCategory: [
            {
              id: 4,
              name: 'B1',
              parentId: 3,
              subCategory: [
                { id: 7, name: 'B10', parentId: 4 },
                { id: 8, name: 'B11', parentId: 4 },
              ],
            },
            {
              id: 6,
              name: 'B2',
              parentId: 3,
              subCategory: [
                {
                  id: 9,
                  name: 'B20',
                  parentId: 6,
                  subCategory: [
                    { id: 11, name: 'B201', parentId: 9 },
                    { id: 12, name: 'B202', parentId: 9 },
                  ],
                },
                { id: 10, name: 'B21', parentId: 6 },
              ],
            },
          ],
        },
      ]);
    });

    it('should return correct tree for given categoryId', () => {
      // Given
      const parentId = 1;

      // When
      const tree = categoryService.getNestedCategories(categories, parentId);

      // Then
      expect(tree).toStrictEqual([
        {
          id: 2,
          parentId: 1,
          name: 'A1',
        },
        {
          id: 5,
          parentId: 1,
          name: 'A2',
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
    it('should return complete tree correctly when no id specified', async () => {
      // Given
      const id = null;
      categoryRepository.getCategoriesById = jest
        .fn()
        .mockResolvedValueOnce([categories]);

      // When
      const tree = await categoryService.getCategoryTree(id);

      // Then
      expect(tree).toStrictEqual([
        {
          id: 1,
          name: 'A',
          parentId: null,
          subCategory: [
            { id: 2, name: 'A1', parentId: 1 },
            { id: 5, name: 'A2', parentId: 1 },
          ],
        },
        {
          id: 3,
          name: 'B',
          parentId: null,
          subCategory: [
            {
              id: 4,
              name: 'B1',
              parentId: 3,
              subCategory: [
                { id: 7, name: 'B10', parentId: 4 },
                { id: 8, name: 'B11', parentId: 4 },
              ],
            },
            {
              id: 6,
              name: 'B2',
              parentId: 3,
              subCategory: [
                {
                  id: 9,
                  name: 'B20',
                  parentId: 6,
                  subCategory: [
                    { id: 11, name: 'B201', parentId: 9 },
                    { id: 12, name: 'B202', parentId: 9 },
                  ],
                },
                { id: 10, name: 'B21', parentId: 6 },
              ],
            },
          ],
        },
      ]);
    });

    it('should return correct tree for given categoryId', async () => {
      // Given
      const id = 2;
      categoryRepository.getCategoriesById = jest
        .fn()
        .mockResolvedValueOnce([
          categories.filter((aCategory) => aCategory.id === id),
        ]);

      // When
      const tree = await categoryService.getCategoryTree(id);

      // Then
      expect(tree).toStrictEqual([
        {
          id: 2,
          parentId: 1,
          name: 'A1',
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
        .mockResolvedValueOnce([[nodeId8]]);

      // When
      const tree = await categoryService.getCategoryTree(id);

      // Then
      expect(tree).toStrictEqual([nodeId8]);
    });

    it('should return [] when unexpected data received from db', async () => {
      // Given
      const id = null;

      categoryRepository.getCategoriesById = jest
        .fn()
        .mockResolvedValueOnce([null]);

      // When
      const tree = await categoryService.getCategoryTree(id);

      // Then
      expect(tree).toStrictEqual([]);
    });

    it('should log and throw when exception occured', async () => {
      // Given
      const id = null;

      categoryRepository.getCategoriesById = jest
        .fn()
        .mockRejectedValueOnce(new Error('Example DB error'));

      // Then
      await expect(categoryService.getCategoryTree(id)).rejects.toThrow();
    });
  });
});
