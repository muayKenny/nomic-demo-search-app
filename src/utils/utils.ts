export const extractSrc = (htmlString: string) => {
  const matches = htmlString.match(/src="([^"]+)"/);
  return matches ? matches[1] : '';
};
