export const connectDB = {
    then: jest.fn(() => Promise.resolve()),
    catch: jest.fn(() => Promise.reject(new Error('Mocked DB error')))
  };