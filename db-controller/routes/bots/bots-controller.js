const modelName = 'Bots';

const botsController = (repository) => {
  const getBotById = async (req, res) => {
    return repository.findOne({ modelName, options: { _id: req.params.id }})
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => console.log(error));
  };

  const getBots = async (req, res) => {
    return repository.find({ modelName})
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => console.log(error));
  };
  
  const patchBot = async (req, res) => {
    return repository.update({ modelName, updatedRecord: req.body })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => console.log(error));
  };
  
  const createBot = async (req, res) => {
    return repository.create({ modelName, newObject: req.body })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => console.log(error));
  };
  
  const deleteBot = async (req, res) => {
    return repository.remove({ modelName, record: {
      _id: req.params.id 
    }})
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => console.log(error));
  };

  return {
    getBotById,
    getBots,
    patchBot,
    createBot,
    deleteBot,
  };
};

module.exports = botsController;