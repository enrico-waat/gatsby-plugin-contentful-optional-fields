// TODO: allow user to define defaults themselves
const TypeDefaults = {
  RichText: { id: "", json: "" },
};

// TODO: allow users to define types themselves
exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type RichText implements Node {
      raw: String
    }
  `;
  createTypes(typeDefs);
};

exports.createResolvers = ({ createResolvers }, pluginOptions) => {
  // You must pass a map of optional fields in gatsby-config.js
  if (pluginOptions.optionalFields) {
    // Reduce optional field map into structure expected by gatsby's createResolvers
    const resolvers = Object.entries(pluginOptions.optionalFields).reduce(
      (keyAcc, [key, values]) => ({
        ...keyAcc,
        [key]: Object.entries(values).reduce(
          (valueAcc, [field, type]) => ({
            ...valueAcc,
            [field]: {
              type,
              resolve: (source) => (field in source) ? source[field] : (TypeDefaults[type] || null),
            },
          }),
          {}
        ),
      }),
      {}
    );

    createResolvers(resolvers);
  }
};