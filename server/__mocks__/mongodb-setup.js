module.exports = {
  connectToDatabase: jest.fn().mockResolvedValue({
    database: {
      collection: jest.fn().mockReturnValue({
        find: jest.fn().mockReturnValue({
          toArray: jest.fn().mockResolvedValue([])
        }),
        insertOne: jest.fn().mockResolvedValue({ 
          insertedId: 'mockId' 
        }),
        updateOne: jest.fn().mockResolvedValue({ 
          acknowledged: true 
        })
      })
    }
  })
};