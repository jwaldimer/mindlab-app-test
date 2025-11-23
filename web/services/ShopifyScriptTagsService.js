require("@shopify/shopify-api/adapters/node");

const { shopifyApi, ApiVersion } = require("@shopify/shopify-api");

const rawAppUrl = process.env.APP_BASE_URL || "";
const hostName = rawAppUrl
  .replace(/^https?:\/\//, "")
  .replace(/\/$/, "");

const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET,
  apiVersion: ApiVersion.October25,
  isCustomStoreApp: true,
  isEmbeddedApp: true,
  hostName,
  adminApiAccessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
});

/**
 * Service to manage Shopify Script Tags for the app.
 */
class ShopifyScriptTagsService {
  static restClient(session) {
    return new shopify.clients.Rest({ session });
  }

  static async getScriptTags(session) {
    const client = this.restClient(session);
    const response = await client.get({
      path: "script_tags",
    });
    return response.body.script_tags || [];
  }

  static async createScriptTag(session, scriptUrl) {
    const client = this.restClient(session);
    const response = await client.post({
      path: "script_tags",
      data: {
        script_tag: {
          event: "onload",
          src: scriptUrl,
          display_scope: "all",
        },
      },
      type: "application/json",
    });

    return response.body.script_tag;
  }

  static async updateScriptTag(session, scriptTagId, updates) {
    const client = this.restClient(session);
    const response = await client.put({
      path: `script_tags/${scriptTagId}`,
      data: {
        script_tag: updates,
      },
      type: "application/json",
    });

    return response.body.script_tag;
  }

  static async deleteScriptTag(session, scriptTagId) {
    const client = this.restClient(session);
    await client.delete({
      path: `script_tags/${scriptTagId}`,
    });
  }

  static async ensureWidgetScriptTag(session, scriptUrl) {
    const tags = await this.getScriptTags(session);

    const existing = tags.find((tag) => tag.src === scriptUrl);

    if (existing) {
      await this.deleteScriptTag(session, existing.id);
    }

    return this.createScriptTag(session, scriptUrl);
  }
}

module.exports = ShopifyScriptTagsService;
