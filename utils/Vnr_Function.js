
export default class Vnr_Function {
    static CheckIsNullOrEmpty(data) {
        if (data !== undefined && data !== null && data !== "" && data !== "NaN")
            return false;
        else
            return true
    }
    static CheckContains(dataItem, fieldQuery, query) {
        if (dataItem[fieldQuery] && dataItem[fieldQuery].toLowerCase().includes(query.toLowerCase())) {
            return true
        }
        return false
    }


    static removeObjectInArray(arr, object, valueField) {
        const indexObject = arr.findIndex((value) => { return value[valueField] == object[valueField] });
        if (indexObject >= 0) {
            arr.splice(indexObject, 1);
            return arr;
        }
        else {
            return arr
        }
    }





}
// export const  = {

// }