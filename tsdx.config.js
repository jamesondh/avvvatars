const replace = require("@rollup/plugin-replace");

module.exports = {
  rollup(config, options) {
    // Add process.env.NODE_ENV replacement for production builds
    config.plugins = config.plugins.map((p) =>
      p.name === "replace"
        ? replace({
            "process.env.NODE_ENV": JSON.stringify(options.env),
            preventAssignment: true,
          })
        : p
    );

    // TSDX bundles dependencies by default. Goober is small and used by the core
    // react component, so let's keep it bundled there.
    // For the headless entry point, we might not need goober, but the core logic is shared.

    // TSDX defaults to a single entry point (src/index.tsx usually).
    // We need to tell it about our headless entry point.
    // NOTE: TSDX doesn't directly support multiple entry points in a clean way.
    // The standard way is often to have separate packages or run tsdx multiple times.
    // However, we can try adjusting the input config here, but it might be fragile.

    // If building specifically for the headless target (needs modification to build script)
    // or adjust input based on format?
    // Let's stick to the default build for now and see if the exports map is sufficient.
    // TSDX might build all src files it finds referenced by the main entry.
    // If the headless export doesn't work after build, we'll need to adjust the build process itself.

    // Keep existing external logic (important for peer deps like React)
    if (options.format === "cjs" || options.format === "esm") {
      config.external = (id) => {
        // Keep React/ReactDOM as external
        return (
          /^react($|\/)/.test(id) ||
          /^react-dom($|\/)/.test(id) ||
          /^goober($|\/)/.test(id)
        );
      };
    }

    // console.log('--- TSDX Rollup Config ---');
    // console.log('Format:', options.format);
    // console.log('Input:', config.input);
    // console.log('Output:', config.output);
    // console.log('External:', config.external);
    // console.log('Plugins:', config.plugins.map(p => p.name));
    // console.log('--------------------------');

    return config;
  },
};
