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