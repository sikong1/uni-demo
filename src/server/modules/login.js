
import request from '../index'

export const getApi = () => {
  return request.get({
    url: '/portfolio',
  });
}
export const login = (data) => {
  return request.post(
    {
      url: "/api/login",
      data,
    },
    { withToken: false }
  );
}
export const register = (data) => {
  return request.post(
    {
      url: "/api/register",
      data,
    },
    { withToken: false }
  );
}