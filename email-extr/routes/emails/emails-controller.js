const emailsController = (repository) => {
  const getCodeById = async (req, res) => {
    res.status(200).send(repository.getById(req.params.id));
  };

  return {
    getCodeById,
  };
};

module.exports = emailsController;