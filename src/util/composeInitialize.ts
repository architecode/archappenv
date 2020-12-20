export const composeInitialize = (initialize: () => Promise<void>) => (() => {
  let isInitialized = false;

  return async () => {
    if (!isInitialized) {
      await initialize();
      isInitialized = true;
    }
  };
})();
