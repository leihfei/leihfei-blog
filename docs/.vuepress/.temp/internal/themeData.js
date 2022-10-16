export const themeData = JSON.parse("{\"logo\":\"images/hero.png\",\"docDir\":\"docs\",\"locales\":{\"/\":{\"navbar\":[{\"text\":\"首页\",\"link\":\"/\"},{\"text\":\"算法\",\"children\":[\"/algorithm/算法基础\"]},{\"text\":\"Java\",\"children\":[\"/thread/线程八大核心基础\",\"/thread/多线程高级笔记\"]},{\"text\":\"中间件\",\"children\":[\"/middleware/Redis思想\"]}],\"editLinkText\":\"在 GitHub 上编辑此页\",\"lastUpdatedText\":\"上次更新\",\"contributorsText\":\"贡献者\",\"tip\":\"提示\",\"warning\":\"注意\",\"danger\":\"警告\",\"notFound\":[\"这里什么都没有\",\"我们怎么到这来了？\",\"这是一个 404 页面\",\"看起来我们进入了错误的链接\"],\"backToHome\":\"返回首页\",\"openInNewWindow\":\"在新窗口打开\",\"toggleColorMode\":\"切换颜色模式\",\"toggleSidebar\":\"切换侧边栏\",\"selectLanguageName\":\"English\"}},\"colorMode\":\"auto\",\"colorModeSwitch\":true,\"navbar\":[],\"repo\":null,\"selectLanguageText\":\"Languages\",\"selectLanguageAriaLabel\":\"Select language\",\"sidebar\":\"auto\",\"sidebarDepth\":2,\"editLink\":true,\"editLinkText\":\"Edit this page\",\"lastUpdated\":true,\"lastUpdatedText\":\"Last Updated\",\"contributors\":true,\"contributorsText\":\"Contributors\",\"notFound\":[\"There's nothing here.\",\"How did we get here?\",\"That's a Four-Oh-Four.\",\"Looks like we've got some broken links.\"],\"backToHome\":\"Take me home\",\"openInNewWindow\":\"open in new window\",\"toggleColorMode\":\"toggle color mode\",\"toggleSidebar\":\"toggle sidebar\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateThemeData) {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ themeData }) => {
    __VUE_HMR_RUNTIME__.updateThemeData(themeData)
  })
}
