const ShopifyScriptTagsService = require("./ShopifyScriptTagsService");

const APP_BASE_URL = process.env.APP_BASE_URL;

class WidgetService {

  /**
   * Get the scrip tag.
   */
  static async getScriptTag(shopDomain){
    const scriptUrl = `${APP_BASE_URL}/api/v1/mindlab/widget/widget.js?shop=${encodeURIComponent(
      shopDomain
    )}`;

    const session = {
      shop: shopDomain,
      accessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
    };

    const scriptTag = await ShopifyScriptTagsService.ensureWidgetScriptTag(
      session,
      scriptUrl
    );

    return scriptTag;
  }
  
}

module.exports = WidgetService;
