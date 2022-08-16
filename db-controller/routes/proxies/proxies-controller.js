const modelName = 'Proxies';

const proxiesController = (repository) => {
  const getProxyById = async (req, res) => {
    return repository.findOne({ modelName, options: { _id: req.params.id }})
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => console.log(error));
  };

  const getProxies = async (req, res) => {
    return repository.find({ modelName})
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => console.log(error));
  };
  
  const patchProxy = async (req, res) => {
    return repository.update({ modelName, options: { modelName, updatedRecord: req.body }})
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => console.log(error));
  };
  
  const createProxy = async (req, res) => {
    let existingProxy = await checkForExistingProxy(req.body.ip);
    if(existingProxy) {
      return repository.update({ modelName, updatedRecord: {
        _id: existingProxy._id,
        isSocket: req.body.protocol !== "http",
        isHttp: req.body.protocol === "http",
        ip: req.body.ip,
        isActive: req.body.success,
        isWorking: req.body.success === true ? true : existingProxy.isWorking,
        shouldBeTested: false,
        lastCheck: +(new Date()),
        timesTried: isNaN(existingProxy.timesFailed) ? 1 : (existingProxy.timesFailed + 1),
        timesSucceed: req.body.success ? ((existingProxy.timesSucceed || 0) + 1) : (existingProxy.timesSucceed || 0),
        timesFailed: req.body.success ? (existingProxy.timesFailed || 0) : ((existingProxy.timesFailed || 0 ) + 1),
        instagramUsers: existingProxy.instagramUsers ? existingProxy.instagramUsers : 0
      } })
        .then((response) => {
          res.status(200).send(response);
        })
        .catch(error => console.log(error));
    } else {
      return repository.create({ modelName, newObject: {
        isSocket: req.body.protocol !== "http",
        isHttp: req.body.protocol === "http",
        ip: req.body.ip,
        isActive: req.body.success,
        isWorking: req.body.success,
        shouldBeTested: false,
        lastCheck: +(new Date()),
        timesTried: 1,
        timesSucceed: req.body.success ? 1 : 0,
        timesFailed: req.body.success ? 0 : 1,
        instagramUsers: 0
      } })
        .then((response) => {
          res.status(200).send(response);
        })
        .catch(error => console.log(error));
    }
  };
  
  const deleteProxy = async (req, res) => {
    return repository.remove({ modelName, record: {
      _id: req.params.id 
    }})
      .then((response) => {
        res.status(200).send(response);
      })
      .catch(error => console.log(error));
  };

  const checkForExistingProxy = (ip) => {
    return repository.findOne({ modelName, options: { ip: ip }});
    }

  return {
    getProxyById,
    getProxies,
    patchProxy,
    createProxy,
    deleteProxy,
  };
};

module.exports = proxiesController;