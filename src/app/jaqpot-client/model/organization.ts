import { MetaInfo } from './metaInfo';


export interface Organization {
    _id?: string;

    meta?: MetaInfo;

    ontologicalClasses?: Array<string>;

    visible?: boolean;

    temporary?: boolean;

    featured?: boolean;

    capabilities?: { [key: string]: number; };

    userIds?: Array<string>;

    about?: string;

    website?: string;

    contact?: string;

    city?: string;
    
    country?: string;

    affiliations?: Array<string>; 

}