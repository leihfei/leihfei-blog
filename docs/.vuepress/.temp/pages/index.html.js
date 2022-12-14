export const data = JSON.parse("{\"key\":\"v-8daa1a0e\",\"path\":\"/\",\"title\":\"\",\"lang\":\"en-US\",\"frontmatter\":{\"home\":true,\"heroImage\":\"/images/logo.png\",\"heroText\":\"Welcome to hep.\",\"tagline\":\"Born to win.\",\"actionText\":\"开始探索之旅 →\",\"actionLink\":\"/zh/guide/\",\"features\":[{\"title\":\"关于我\",\"details\":\"爱好学习，喜欢技术的码农，希望和大家称为好朋友。\"},{\"title\":\"学习笔记\",\"details\":\"学习总爱忘记，好记性不如烂笔头。\"},{\"title\":\"生活点点滴滴\",\"details\":\"记录生活中美好的时刻，把生命中的点点滴滴都堆积成无法比拟的幸福。\"}],\"footer\":\"Hep Licensed | Copyright © 黔ICP备18006718号-1\"},\"excerpt\":\"\",\"headers\":[],\"git\":{},\"filePathRelative\":\"README.md\"}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
