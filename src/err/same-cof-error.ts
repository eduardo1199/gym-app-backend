export class SameCpfError extends Error {
  constructor() {
    super('Seems than the same cpf save in application.')
  }
}
