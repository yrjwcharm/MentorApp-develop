export default {
  DocumentDir: () => {},
  ImageCache: {
    get: {
      clear: () => {}
    }
  },
  fs: {
    exists: jest.fn(() => {
      return Promise.resolve(true)
    }),
    dirs: {
      MainBundleDir: () => {},
      CacheDir: () => {},
      DocumentDir: 'foo'
    }
  }
}
