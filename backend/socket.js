const Response = require('./models/Response');

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('joinForm', async ({ formId }) => {
      socket.join(formId);

      // Atomically create a document if it doesn't exist
      const responseDoc = await Response.findOneAndUpdate(
        { formId },
        { $setOnInsert: { responses: {}, isClosed: false } },
        { new: true, upsert: true }
      );

      // Send current response state and lock status to the joining user
      socket.emit('loadResponse', responseDoc.responses);
      socket.emit('formStatus', { isClosed: responseDoc.isClosed });

      // Handle real-time field sync
      socket.on('updateResponse', async ({ field, value }) => {
        const doc = await Response.findOne({ formId });
        if (!doc || doc.isClosed) return;

        // Ensure responses object exists
        if (!doc.responses) {
          doc.responses = {};
        }

        doc.responses[field] = value;
        await doc.save();

        // Notify all the other users about the change
        socket.to(formId).emit('responseUpdated', { field, value });
      });

      // Handle form submission
      socket.on('submitForm', async ({ formId, responses }) => {
        const doc = await Response.findOne({ formId });
        if (!doc || doc.isClosed) return;

        doc.responses = responses;
        doc.isClosed = true;
        await doc.save();

        // Notify all the users that the form is closed now
        io.to(formId).emit('formStatus', { isClosed: true });
      });
    });

    //Bsic field locking 
    socket.on('lockField', ({ formId, field }) => {
        socket.to(formId).emit('fieldLocked', { field });
    });
    //Basic field unlocking
    socket.on('unlockField', ({ formId, field }) => {
        socket.to(formId).emit('fieldUnlocked', { field });
    });


    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

module.exports = setupSocket;
