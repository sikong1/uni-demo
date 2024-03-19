
import request from '../index.js'

export const getData = () => {
  return request.get({
    url: '/chat/getData',
  });
}