exports.get404 = (req, res) => {
  console.log('object');
  return res.status(404).json({ message: 'Route not found' });
};
