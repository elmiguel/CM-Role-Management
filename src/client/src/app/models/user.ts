export class User {
  constructor(
    public id: string,
    public uuid: string,
    public externalId: string,
    public dataSourceId: string,
    public userName: string,
    public educationLevel: string,
    public gender: string,
    public created: string,
    public lastLogin: string,
    public systemRoleIds: string[],
    public availability: Object,
    public name: Object,
    public contact: Object
  ) { }

}
