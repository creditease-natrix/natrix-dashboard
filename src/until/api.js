
axios.defaults.withCredentials = true;
import rootvue from "../main.js";
import qs from "qs";
import axios from "axios";
let config = {
  
};




export const get_no = option => {
  /*
   *params
   *url: ajax的url地址
   * data: ajax的请求数据
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
   * url: ajax的url地址
   * data: ajax的请求数据
   */

  let { url, data = {} } = option;

  return axios
    .get(url, {
      params: data,
      retry:2,
      retryDelay: 100 ,
      paramsSerializer: function(params) {
        return qs.stringify(params, { arrayFormat: "repeat" });
      }
    })
    .then(response => {
      if (response.status == 200) {

        if (response.data.permission) {
            return response.data;
        } else {
          rootvue.$message.error("您当前尚未登录，请先登录查看");
          window.location.href = NatrixIndex;
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
   *url: ajax的url地址
   *data: ajax的请求数据
   */
  let { url, data = {} } = option;
  return axios
    .post(
      url, 
      data, 
      config,
      {retry: 5,
      retryDelay: 100 }
    )
    .then(response => {
      if (response.status == 200) {
        if (response.data.permission) {
           return response.data;
        } else {
          rootvue.$message.error("您当前尚未登录，请先登录查看");
          window.location.href = NatrixIndex
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
   *url: ajax的url地址
   * data: ajax的请求数据
   */
  let { url, data = {} } = option;
  return axios
    .put(url, data, config)
    .then(response => {
      if (response.status == 200) {
        if (response.data.permission) {
          return response.data;
        } else {
          window.location.href = NatrixIndex
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
   *url: ajax的url地址
   *data: ajax的请求数据
   */

  let { url, data = {} } = option;

  return axios
    .delete(url, { params: data })
    .then(response => {
      if (response.status === 200) {
        if (response.data.permission) {
          return response.data;
        } else {
          rootvue.$message.error("您当前尚未登录，请先登录查看")
          window.location.href = NatrixIndex
          return false;
        }
      } else {
      }
    })
    .catch(error => {
      console.log(error);
    });
};
