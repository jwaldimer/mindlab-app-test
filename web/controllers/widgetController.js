const { StoreSettings } = require("../models");
const WidgetInjector = require("../services/WidgetInjectorService");

const get_widget = async (req, res) => {
  try {
    const shopDomain = process.env.SHOPIFY_SHOP_DOMAIN;

    if (!shopDomain) {
      res.setHeader("Content-Type", "application/javascript; charset=utf-8");
      return res
        .status(400)
        .send('MindLab widget: SHOPIFY_SHOP_DOMAIN is not configured\n');
    }

    const settings = await StoreSettings.findOne({ where: { shopDomain } });

    if (!settings || !settings.widgetActive || !settings.agentToken) {
      res.setHeader("Content-Type", "application/javascript");
      return res
        .status(400)
        .send("MindLab widget is not active or not configured for this shop");
    }

    const script = WidgetInjector.generateScript(settings.agentToken, {
      widgetPosition: settings.widgetPosition,
      primaryColor: settings.primaryColor,
      language: settings.language,
      shopDomain,
    });

    res.setHeader("Content-Type", "application/javascript");
    return res.status(200).send(script);
  } catch (err) {
    console.error("Error generating MindLab widget script:", err);
    res.setHeader("Content-Type", "application/javascript");
    return res
      .status(500)
      .send("Error generating MindLab widget script");
  }
};

module.exports = {
  get_widget,
};
