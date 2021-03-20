module.exports.getOptionsOnShow=()=>{
    let pages = getCurrentPages();
    // 数组中索引最大的页面--当前页面
    let currentPage = pages[pages.length - 1];
    return currentPage.options;
}