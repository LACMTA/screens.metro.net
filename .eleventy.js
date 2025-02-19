module.exports = function(eleventyConfig) {
    eleventyConfig.setInputDirectory('src');
    eleventyConfig.setLayoutsDirectory('_layouts');
    eleventyConfig.setIncludesDirectory('_includes'); // This is already the default
    eleventyConfig.setDataDirectory('_data'); // This is already the default
    
    eleventyConfig.addPassthroughCopy('src/css');
    eleventyConfig.addPassthroughCopy('src/images');
    eleventyConfig.addPassthroughCopy('src/js');
}