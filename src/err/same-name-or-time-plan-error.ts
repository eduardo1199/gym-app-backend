export class SameNameOrPeriodTimePlanError extends Error {
  constructor() {
    super('Has plan with same name or period.')
  }
}
