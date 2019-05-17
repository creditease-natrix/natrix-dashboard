
axios.defaults.withCredentials = true;

import rootvue from "../main.js";
import qs from "qs";
import axios from "axios";
let config = {
  
};
//请求拦截
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});
// // http响应拦截器
// axios.interceptors.response.use(res => {
//   console.log(res,'响应拦截')
//   return res.data
//  }, (error )=> {
//   console.log(error)
//   return Promise.reject(error)
// })

// export default axios

export const get_no = option => {
  /*
   *params
   *   url: ajax的url地址
   *  data: ajax的请求数据
   */
  let { url, data = {} } = option;
  return axios
    .get(url,
       { 
         params: data,
         paramsSerializer: function (params) {
           return qs.stringify(params, { arrayFormat: "repeat" });
         }
       }
    )
    .then(response => {
      if (response.status === 200) {
        return response.data;
      } else {
      }
    })
    .catch(error => {
      console.log(error);
    });
};
export const get = option => {
  /*
   *params
   *   url: ajax的url地址
   *  data: ajax的请求数据
   */

  let { url, data = {} } = option;

  return axios
    .get(url, {
      params: data,
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: "repeat" });
      }
    })
    .then(response => {
      if (response.status === 200) {
        if (response.data.permission) {
          return response.data;
        } else {
          rootvue.$message.error("您当前尚未登录，请先登录查看");
          return false;
        }
      } else {
      }
    })
    .catch(error => {
      console.log(error);
    });
};
export const post = option => {
  /*
   *params
   *   url: ajax的url地址
   *  data: ajax的请求数据
   */
  let { url, data = {} } = option;
  return axios
    .post(url, data, config)
    .then(response => {
      if (response.status == 200) {
        if (response.data.permission) {
          return response.data;
        } else {
          rootvue.$message.error("您当前尚未登录，请先登录查看");
          return false;
        }
      } else {
      }
    })
    .catch(error => {
      console.log(error);
    });
};

export const put = option => {
  /*
   *params
   *   url: ajax的url地址
   *  data: ajax的请求数据
   */
  let { url, data = {} } = option;
  return axios
    .put(url, data, config)
    .then(response => {
      console.log(response, "put");
      if (response.status == 200) {
        if (response.data.permission) {
          return response.data;
        } else {
          return false;
        }
      } else {
      }
    })
    .catch(error => {
      console.log(error);
    });
};

export const deleteMethod = option => {
  /*
   *params
   *   url: ajax的url地址
   *  data: ajax的请求数据
   */

  let { url, data = {} } = option;

  return axios
    .delete(url, { params: data })
    .then(response => {
      if (response.status === 200) {
        if (response.data.permission) {
          return response.data;
        } else {
          rootvue.$message.error("您当前尚未登录，请先登录查看");
          return false;
        }
      } else {
      }
    })
    .catch(error => {
      console.log(error);
    });
};
