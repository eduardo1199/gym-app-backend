export class SameNameMachineError extends Error {
  constructor() {
    super('Seems than the same name save in application.')
  }
}
