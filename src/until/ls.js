
export const LS = {
    set: (key, value) => {
        if(value !== null && value !== undefined && typeof(value) !== 'string'){
            value = JSON.stringify(value)
        }
        localStorage.setItem(key, value)
    },
    get: (key) => {
        let data = localStorage.getItem(key)
        if(data !== null){
            return data
        }else{
            return ''
        }
    }
}

export const SS = {
    set: (key, value) => {
        if(value !== null && value !== undefined && typeof(value) !== 'string'){
            value = JSON.stringify(value)
        }
        sessionStorage.setItem(key, value)
    },
    get: (key) => {
        let data = sessionStorage.getItem(key)
        if(data !== null){
            return data
        }else{
            return ''
        }
    }
}