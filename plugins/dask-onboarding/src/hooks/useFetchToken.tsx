import { useState, useEffect } from 'react';
import { useApi, identityApiRef } from '@backstage/core-plugin-api'; 

const isProduction = process.env.NODE_ENV === 'production';

const useFetchToken = (): { token: string; loading: boolean } => {
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const identityApi = useApi(identityApiRef);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const credentials = isProduction
          ? (await identityApi.getCredentials())
          : {token: "eyJ0eXAiOiJ2bmQuYmFja3N0YWdlLnVzZXIiLCJhbGciOiJFUzI1NiIsImtpZCI6IjY0Y2JkM2FhLTM5NzctNGIyNy1hYjkyLTMwM2RiMDkxZjM3YyJ9.eyJncm91cHMiOlsiUGxhdHRmb3JtOkRhdGFwbGF0dGZvcm0iLCJEYXRhcGxhdHRmb3JtOkRhdGFwbGF0dGZvcm0gLSBUZWFtIExlYWQiLCJHZW9kZXNpOlBHUy1hbmFseXNlIiwiU2rDuDpTZSBIYXZuaXbDpSIsIkVpZW5kb206U21pYSIsIkxhbmQ6VGVhbSBpbm5vdmFzam9uIG9nIHRla25vbG9naSJdLCJpc3MiOiJodHRwczovL2thcnR2ZXJrZXQuZGV2L2FwaS9hdXRoIiwic3ViIjoidXNlcjpkZWZhdWx0L2F1Z3VzdC5kYWhsX2thcnR2ZXJrZXQubm8iLCJlbnQiOlsidXNlcjpkZWZhdWx0L2F1Z3VzdC5kYWhsX2thcnR2ZXJrZXQubm8iLCJncm91cDpkZWZhdWx0L2RhdGFwbGF0dGZvcm0iLCJncm91cDpkZWZhdWx0L2RhdGFwbGF0dGZvcm1fLV90ZWFtX2xlYWQiLCJncm91cDpkZWZhdWx0L3Bncy1hbmFseXNlIiwiZ3JvdXA6ZGVmYXVsdC9zZV9oYXZuaXYiLCJncm91cDpkZWZhdWx0L3NtaWEiLCJncm91cDpkZWZhdWx0L3RlYW1faW5ub3Zhc2pvbl9vZ190ZWtub2xvZ2kiXSwiYXVkIjoiYmFja3N0YWdlIiwiaWF0IjoxNzM4MTQ3NTgzLCJleHAiOjE3MzgxNTExODMsInVpcCI6Ikp2LWZTN2d2dW1WNzFsemoyUm1DQWZKTEtkYTdYUU5kOTdqeTEyQlVGekVVaHRTbmVob2FadmdXY0VsNVZpX2stRXQ0MWFKS0pkZ1Itd0hDV3JvOF9BIn0.VAG9gNdMny-pT2MdVmAk9mk2Tj0w-j-c4rcgpgKfUtjc7M5ynCVsTmn-AuAPGs8wXpAGIBanzvCiKji8TVSo9A"};
        console.log('isProduction:', isProduction);
        setToken(credentials.token || "");
      } catch (error) {
        console.error('Failed to fetch token:', error);
        setToken("");
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, [identityApi]);

  return { token, loading };
};

export default useFetchToken;
