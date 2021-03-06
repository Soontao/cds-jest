

module.exports = class PersonalService extends cds.ApplicationService {


  async init() {

    this.informationService = await cds.connect.to("InformationService")
    // TODO: update this handler for support single/multi values
    this.after("READ", "Person", async (rows) => {
      if (rows) {
        if (rows instanceof Array) {
          await Promise.all(rows.map(this.afterReadPerson))
        } else {
          await this.afterReadPerson(rows)
        }
      }
    })
    await super.init()

  }

  async afterReadPerson(each) {
    if (each.ID) {
      each.Informations = await this.informationService.run(SELECT.from("Information").where({ PersonID: each.ID }))
    }
  }

  dummy() {
    return "dummy value"
  }

}