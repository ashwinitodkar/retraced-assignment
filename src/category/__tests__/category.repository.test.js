const mysqlHelper = require('../../lib/mysqlHelper');
const categoryRepository = require('../category.repository');

jest.mock('../../lib/mysqlHelper');

describe('category repository tests', () => {
  it('should return empty array when no data', async () => {
    // Given
    const categoryId = null;
    mysqlHelper.execStoredProcedure = jest.fn().mockResolvedValueOnce([]);

    const data = await categoryRepository.getCategoriesById(categoryId);

    // Then
    expect(data).toStrictEqual([]);
  });

  it('should return all data ', async () => {
    // Given
    const categoryId = null;
    const mockedData = [
      { id: 1, name: 'A', parent_id: null },
      { id: 2, name: 'A1', parent_id: 1 },
      { id: 3, name: 'B', parent_id: null },
      { id: 4, name: 'B1', parent_id: 3 },
      { id: 5, name: 'A2', parent_id: 1 },
      { id: 6, name: 'B2', parent_id: 3 },
      { id: 7, name: 'B10', parent_id: 4 },
      { id: 8, name: 'B11', parent_id: 4 },
      { id: 9, name: 'B20', parent_id: 6 },
      { id: 10, name: 'B21', parent_id: 6 },
      { id: 11, name: 'B201', parent_id: 9 },
      { id: 12, name: 'B202', parent_id: 9 },
    ];

    mysqlHelper.execStoredProcedure = jest
      .fn()
      .mockResolvedValueOnce(mockedData);

    const data = await categoryRepository.getCategoriesById(categoryId);

    // Then
    expect(data).toStrictEqual(mockedData);
  });
});
