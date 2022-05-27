module.exports = {
  publicPath: '/',
  lintOnSave: false,
  pages: {
      'index': {
          entry: 'src/pages/admin/main.js',
          template: 'public/index.html',
          filename: 'admin_index.html',
          title: 'Admin Page',
          chunks: ['chunk-vendors', 'chunk-common', 'index']
      },
      'user': {
          entry: 'src/pages/user/main.js',
          template: 'public/index.html',
          filename: 'user_index.html',
          title: 'User Page',
          chunks: ['chunk-vendors', 'chunk-common', 'user']
      }
  }
}