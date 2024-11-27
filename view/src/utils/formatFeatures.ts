const format_feature = (feature: string) => feature.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
export default format_feature;