export class NotMatchPasswordOrCPF extends Error {
  constructor() {
    super('Incorrect password or cpf not found.')
  }
}
