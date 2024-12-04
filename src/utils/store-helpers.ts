export function updateObject(oldObj: any, updatedObj: any) {
    return {
        ...oldObj,
        ...updatedObj,
    };
}

export function updateArray(oldArr: any[], newArr: any[]) {
    if (newArr.length === 0) {
        return [];
    }
    return [...oldArr, ...newArr];
}

export const localStorageUserDatakey = "userDetails";

export const getUserData = () => {
    let data = JSON.parse(localStorage.getItem(localStorageUserDatakey)!);
    return data;
};
