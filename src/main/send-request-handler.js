export default {
  async handle(event) {
    await event.sender.send('receive-response', { body: '{}' });
  },
};
