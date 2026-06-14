// Generic CRUD controller factory shared by wheels, slots, and other admin resources.
// `label` is used in 404 messages; `arrayFields` are nested arrays (prizes /
// segments) whose incoming `id` must be mapped back to `_id` so subdocument
// ids stay stable across updates.
function crudController(Model, { label, arrayFields = [] } = {}) {
  const notFound = `${label} not found`;

  // Convert frontend `{ id }` on nested docs to `{ _id }` so mongoose keeps
  // existing subdocument ids instead of generating new ones every save.
  function normalize(body) {
    const data = { ...body };
    for (const field of arrayFields) {
      if (Array.isArray(data[field])) {
        data[field] = data[field].map(({ id, _id, ...rest }) => {
          const keep = id || _id;
          return keep ? { _id: keep, ...rest } : rest;
        });
      }
    }
    return data;
  }

  return {
    async list(req, res) {
      const { status, sortBy = "createdAt", order = "desc" } = req.query;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;

      const filter = status ? { status } : {};
      const sort = { [sortBy]: order === "asc" ? 1 : -1 };

      const [data, total] = await Promise.all([
        Model.find(filter)
          .sort(sort)
          .skip((page - 1) * limit)
          .limit(limit),
        Model.countDocuments(filter),
      ]);

      res.json({ data, total, page, limit });
    },

    async get(req, res) {
      const item = await Model.findById(req.params.id).catch(() => null);
      if (!item) return res.status(404).json({ message: notFound });
      res.json(item);
    },

    async create(req, res) {
      const item = await Model.create(normalize(req.body));
      res.status(201).json(item);
    },

    async update(req, res) {
      const item = await Model.findByIdAndUpdate(
        req.params.id,
        normalize(req.body),
        { new: true, runValidators: true, overwrite: false },
      ).catch(() => null);
      if (!item) return res.status(404).json({ message: notFound });
      res.json(item);
    },

    async remove(req, res) {
      const item = await Model.findByIdAndDelete(req.params.id).catch(
        () => null,
      );
      if (!item) return res.status(404).json({ message: notFound });
      res.status(204).send();
    },
  };
}

module.exports = crudController;
