const createNewService = async (schemaName, data) => {
  try {
    await schemaName
      .create(data)
      .then(() => {
        return true;
      })
      .catch(() => {
        return false;
      });
  } catch (err) {
    return err;
  }
};

const getListService = (schemaName) => {
  try {
    return schemaName
      .find()
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });
  } catch (err) {
    return err;
  }
};

const getOneService = (schemaName, id) => {
  try {
    return schemaName
      .findById(id)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });
  } catch (err) {
    return err;
  }
};

const updateOneService = async (schemaName, id, data) => {
  try {
    await schemaName
      .findByIdAndUpdate(id, data)
      .then((result) => {
        return true;
      })
      .catch((err) => {
        return false;
      });
  } catch (err) {
    return err;
  }
};

const deleteOneService = async (schemaName, id) => {
  try {
    await schemaName
      .findByIdAndDelete(id)
      .then((result) => {
        return true;
      })
      .catch((err) => {
        return false;
      });
  } catch (err) {
    return err;
  }
};

module.exports = {
  createNewService,
  getListService,
  getOneService,
  updateOneService,
  deleteOneService,
};
