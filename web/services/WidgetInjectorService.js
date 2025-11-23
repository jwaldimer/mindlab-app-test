class WidgetInjectorService {
  /**
   * Generate the JavaScript code that will be injected in the storefront.
   * @param {string} agentToken - MindLab agent API token
   * @param {object} config - Widget configuration (position, colors, language, shopDomain)
   * @returns {string} JavaScript code as a string
   */
  static generateScript(agentToken, config = {}) {
    if (!agentToken) {
      throw new Error("agentToken is required to generate widget script");
    }

    const safeConfig = {
      token: agentToken,
      position: config.widgetPosition || "bottom-right",
      primaryColor: config.primaryColor || "#008060",
      lang: (config.language || "en").toLowerCase().slice(0, 2),
      shopDomain: config.shopDomain || undefined,
    };

    const configJson = JSON.stringify(safeConfig);
    return `
;(function () {
  if (window.__mindlabWidgetLoading || window.__mindlabWidgetLoaded) {
    console.warn("MindLab widget is already initializing or loaded");
    return;
  }

  window.__mindlabWidgetLoading = true;

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('script[src="' + src + '"]')) {
        return resolve();
      }

      var script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = function () { resolve(); };
      script.onerror = function (err) {
        console.error("Error loading script:", src, err);
        reject(err);
      };
      document.head.appendChild(script);
    });
  }

  function loadCss(href) {
    return new Promise(function (resolve, reject) {
      if (document.querySelector('link[href="' + href + '"]')) {
        return resolve();
      }

      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.onload = function () { resolve(); };
      link.onerror = function (err) {
        console.error("Error loading stylesheet:", href, err);
        reject(err);
      };
      document.head.appendChild(link);
    });
  }

  var widgetConfig = ${configJson};
  var containerId = "mindlab-widget-root";

  Promise.all([
    loadScript("https://unpkg.com/react@18/umd/react.production.min.js"),
    loadScript("https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"),
    loadCss("https://widget.mind-lab.ai/chatbot-widget-front.css"),
    loadScript("https://widget.mind-lab.ai/mindlab-chat-widget.umd.js")
  ])
    .then(function () {
      window.__mindlabWidgetLoaded = true;
      window.__mindlabWidgetLoading = false;

      if (window.ChatWidget && typeof window.ChatWidget.init === "function") {
        try {
          window.ChatWidget.init(containerId, widgetConfig);
          console.log("MindLab chatwidget initialized");
        } catch (err) {
          console.error("Error initializing MindLab chat widget:", err);
        }
      } else {
        console.error("ChatWidget.init is not available on window");
      }
    })
    .catch(function (err) {
      window.__mindlabWidgetLoading = false;
      console.error("Error loading MindLab widget dependencies:", err);
    });
})();
`.trim();
  }
}

module.exports = WidgetInjectorService;
