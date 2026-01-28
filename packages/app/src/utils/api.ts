export const getContext = async (
  url: URL,
  backstageToken: string,
  entraIdToken: string,
) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${backstageToken}`,
      EntraId: entraIdToken,
    },
  });
  return response;
};
