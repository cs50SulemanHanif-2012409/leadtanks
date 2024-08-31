export type AdminStats  = {
    users : number,
    packages : number,
    leads : number,
    jamalleads : number,
    orders : number,
    status : boolean
}
export type JamalLeads = {
    _id : string,
    title : string,
    phoneNumber : string,
    address : string,
    country : string,
    city : string,
    websiteLink : string,
}

export type packageType = {
    _id : string,
    leadTitle : string,
    leadDescription : string,
    leadPrice : number,
    leadTags : [string],
    noleads : number,
    createdAt : string,
    updatedAt : string
}