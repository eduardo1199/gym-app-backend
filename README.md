# GymBackEnd

## Projeto voltado para genreciamento do projeto gym-app-frontend, que consiste no gerencimento de uma acadêmia única. Authenticação de administrador, visualização de informações de usuário, cadastro de alunos, planos, gerencimento de vínculo com academia.

## Desenvolvido com SQLite banco de dados, PrismaORM, Express, Typescript.

## Settings setup project

instalar pacotes de depêndencias.

<aside>
💡 npm install

</aside>

build migrate 

<aside>
💡 npm run migrate —migrate-name

</aside>

npm run dev

<aside>
💡 npm run dev

</aside>

build

<aside>
💡 npm run build

</aside>

## Routes

path: `src/http/Routes.ts`

### User Routes

```tsx
app.post('/user', registerUser)
app.get('/users', getAllUsers)
app.get('/user/:id', getUser)
app.put('/user/:id', updateUser)
app.delete('/user/:id', deleteUser)
app.get('/user/:cpf', authenticateUser)
```

- Register New User
    - function controller registerUser from create new user
- Get All Users
    - function controller getAllUsers from list all users
- Get Unique User
    - function controllers get unique user by id
- Update user
    - function controller updateUser from update user by id
- Delete user
    - function controllers deleteUser by id
- authentication user on app
    - functon controlllers authentication user by cpf

### Use Cases

path:  `‘src/use-cases’`

### Plans Use Cases

**create plan use case**: 

utilizando a interface `IPlanRepository` para implementação dos métodos. Primeiramente, verificando com o método `findBySomeNameAndTimeOfPlan`  se existe um plano com mesmo nome ou tempo de duração. Caso não encontre, o cadastro será realizado!

```tsx
interface CreatePlanUseCaseRequest {
  name: string
  timeOfPlan: number
  price: number
}

interface CreatePlanUseCaseResponse {
  plan: Plan
}

export class CreatePlanUseCase {
  constructor(private planRepository: IPlanRepository) {}

  async execute(
    data: CreatePlanUseCaseRequest,
  ): Promise<CreatePlanUseCaseResponse> {
    const { name, timeOfPlan, price } = data

    const hasPlanSomeNameOrTime =
      await this.planRepository.findBySomeNameAndTimeOfPlan(timeOfPlan, name)

    if (hasPlanSomeNameOrTime) {
      throw new Error('Plan already exists!')
    }

    const plan = await this.planRepository.register({
      name,
      price,
      timeOfPlan,
    })

    return {
      plan,
    }
  }
}
```

**get plan:** Buscar um plano específico utilizando o ID do plano, com os métodos do repositório.

Primeiramente, utilizando método `findById` para buscar o plano utilizando o ID, caso encontre o plano, retorne o mesmo. Caso contrário, um erro é disparado.

```tsx
interface GetPlanUseCaseRequest {
  id: string
}

interface GetPlanUseCaseResponse {
  plan: Plan
}

export class GetPlanUseCase {
  constructor(private planRepository: IPlanRepository) {}

  async execute(data: GetPlanUseCaseRequest): Promise<GetPlanUseCaseResponse> {
    const plan = await this.planRepository.findById(data.id)

    if (!plan) {
      throw new Error('Not exist plan!')
    }

    return {
      plan,
    }
  }
}
```

**get all plans:** Buscar todos os planos cadastros no sistema, utilizando os métodos do repositório.

Primeiramente, utilizando método `findByAllPlans` para todos os planos cadastros no sistema.

```tsx
interface GetAllPlansUseCaseResponse {
  plans: Plan[]
}

export class GetAllPlansUseCase {
  constructor(private planRepository: IPlanRepository) {}

  async execute(): Promise<GetAllPlansUseCaseResponse> {
    const plans = await this.planRepository.findByAllPlans()

    return {
      plans,
    }
  }
}
```

**Amount user with plan:** Esse caso de uso é utilizado para buscar a quantidade de usuário cadastros para um plano específico. 

Utilizando o método do repositório, `findByCountUsersWithPlan` podemos buscar a quantidade de usuários para aquele plano. Caso não tenha aquele plano específico, é disparado um erro.

```
interface AmountUserWithPlanUseCaseRequest {
  id: string
}

interface AmountUserWithPlanUseCaseResponse {
  amount: number
}

export class AmountUserWithPlanUseCase {
  constructor(private planRepository: IPlanRepository) {}

  async execute(
    data: AmountUserWithPlanUseCaseRequest,
  ): Promise<AmountUserWithPlanUseCaseResponse> {
    const plan = await this.planRepository.findById(data.id)

    if (!plan) {
      throw new Error('Not exist plan!')
    }

    const amount = await this.planRepository.findByCountUsersWithPlan(data.id)

    return {
      amount,
    }
  }
}
```

**Delete plan:** Esse caso de uso é usado para deletar um plano específico.

A partir do ID do plano, podemos utilizar o método `delete` para remover o plano cadastrado no sistema. Antes, verificando se o plano realmente existe.

```
interface DeletePlanUseCaseRequest {
  id: string
}

export class DeletePlanUseCase {
  constructor(private planRepository: IPlanRepository) {}

  async execute(data: DeletePlanUseCaseRequest) {
    const plan = await this.planRepository.findById(data.id)

    if (!plan) {
      throw new Error('Not exist plan!')
    }

    await this.planRepository.delete(data.id)
  }
}
```

**Update plan:** Esse caso de uso é utiilizado para editar um plano específico.

A partir um plano selecionado, podemos editar o plano com o método da classe `update` para editar um plano específico. Antes, verificamos se existe o plano com o ID selecionado e verificamos se existe um plano com aquele nome ou tempo.

```
interface UpdatePlanUseCaseRequest {
  name?: string
  timeOfPlan?: number
  price?: number
  id: string
}

interface UpdatePlanUseCaseResponse {
  plan: Plan
}

export class UpdatePlanUseCase {
  constructor(private planRepository: IPlanRepository) {}

  async execute(
    data: UpdatePlanUseCaseRequest,
  ): Promise<UpdatePlanUseCaseResponse> {
    const { name, timeOfPlan, price, id } = data

    const hasPlanById = await this.planRepository.findById(data.id)

    if (!hasPlanById) {
      throw new Error('Not exist plan!')
    }

    const hasPlanSomeNameOrTime =
      await this.planRepository.findBySomeNameAndTimeOfPlan(timeOfPlan, name)

    if (hasPlanSomeNameOrTime) {
      throw new Error('Plan already exists!')
    }

    const plan = await this.planRepository.update(
      {
        name,
        price,
        timeOfPlan,
      },
      id,
    )

    return {
      plan,
    }
  }
}
```