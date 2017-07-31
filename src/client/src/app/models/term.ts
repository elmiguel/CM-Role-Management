export class Term {
  constructor(
    public _id: string,
    public id: string,
    public externalId: string,
    public dataSourceId: string,
    public description: string,
    public __v: number,
    public availability: Object
  ) { }
}
