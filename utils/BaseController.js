class BaseController {
  constructor(model, modelName = 'Document') {
    this.model = model;
    this.modelName = modelName;
  }

  // Create a new document
  create = async (req, res, next) => {
    try {
      const doc = await this.model.create(req.body);
      res.status(201).json({
        success: true,
        message: `${this.modelName} created successfully`,
        data: doc,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get all documents
  getAll = async (req, res, next) => {
    try {
      const docs = await this.model.find();
      res.status(200).json({
        success: true,
        count: docs.length,
        data: docs,
      });
    } catch (error) {
      next(error);
    }
  };

  // Get single document by ID
  getById = async (req, res, next) => {
    try {
      const doc = await this.model.findById(req.params.id);
      if (!doc) {
        return res.status(404).json({
          success: false,
          message: `${this.modelName} not found`,
        });
      }
      res.status(200).json({
        success: true,
        data: doc,
      });
    } catch (error) {
      next(error);
    }
  };

  // Update document
  update = async (req, res, next) => {
    try {
      const doc = await this.model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
      });
      if (!doc) {
        return res.status(404).json({
          success: false,
          message: `${this.modelName} not found`,
        });
      }
      res.status(200).json({
        success: true,
        message: `${this.modelName} updated successfully`,
        data: doc,
      });
    } catch (error) {
      next(error);
    }
  };

  // Delete document
  delete = async (req, res, next) => {
    try {
      const doc = await this.model.findByIdAndDelete(req.params.id);
      if (!doc) {
        return res.status(404).json({
          success: false,
          message: `${this.modelName} not found`,
        });
      }
      res.status(200).json({
        success: true,
        message: `${this.modelName} deleted successfully`,
        data: {},
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = BaseController;
