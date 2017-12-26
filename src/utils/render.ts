import { Nullable } from './Nullable';

export const render = (component:any, endpoint:Nullable<HTMLElement>, callback:(component:any) => void) => {
    if (endpoint != null) endpoint.innerHTML = `${component.render()}`;
    setTimeout(() => callback(component), 1000);
};