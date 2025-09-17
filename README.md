# 📝 TaskMaster App

Integrantes:
+ [Nicolas Dobbeck Mendes RM: 557605](https://github.com/NicolasDobbeck)
+ [Thiago Henry Dias RM: 554522](https://github.com/lavithiluan)
+ [José Bezerra Bastos Neto RM: 559221](https://github.com/jjosebastos)


Aplicativo de gerenciamento de tarefas com autenticação, sincronização em tempo real, temas claros/escuros, internacionalização e notificações locais.

---

## 🚀 Funcionalidades

<details>
<summary>Principais Funcionalidades</summary>

1. **Autenticação**
   - Login com o provedor de E-mail via Firebase Auth.
   - Login persistente (auto-login).

2. **Gerenciamento de Tarefas**
   - Cada usuário possui sua própria coleção de tarefas no Firestore.
   - CRUD completo: criar, ler, atualizar e deletar tarefas.
   - Lista de tarefas com sincronização em tempo real usando `onSnapshot`.

3. **Tema Claro/Escuro**
   - Alternância dinâmica entre tema claro e escuro.
   - Persistência da preferência do usuário (AsyncStorage).

4. **Internacionalização**
   - Suporte a Português (PT) e Inglês (EN).
   - Troca dinâmica de idioma sem reiniciar o app.
   - Textos traduzidos usando `i18n-js` ou `react-i18next`.

5. **Notificações Locais**
   - Agendamento de notificações associadas a cada tarefa.
   - Funciona em segundo plano com `expo-notifications`.

6. **API Externa**
   - Integração com API externa usando **TanStack Query**.
</details>

---

## 🛠 Tecnologias e Bibliotecas

O projeto utiliza as seguintes bibliotecas e ferramentas:

### Firebase
- `@react-native-firebase/app`
- `@react-native-firebase/auth`
- `@react-native-firebase/firestore`

### Navegação
- `@react-navigation/native`
- `@react-navigation/native-stack`

### UI Components
- `react-native-paper`
- `react-native-safe-area-context`
- `react-native-screens`

### Armazenamento Local
- `@react-native-async-storage/async-storage`

### Date/Time Picker
- `@react-native-community/datetimepicker`
- `react-native-modal-datetime-picker`

### Internacionalização
- `i18n-js`

### Notificações
- `expo-notifications`
- `expo-web-browser` (para autenticação externa)

### React & Expo
- `react`, `react-dom`, `react-native`
- `expo`, `expo-auth-session`, `expo-dev-client`, `expo-status-bar`

### Gerenciamento de Dados Externos
- `@tanstack/react-query`
- `axios` (para consumo de APIs externas)

  
## Como Rodar o Projeto

### Pré-requisitos

- Node.js >= 18
- Expo CLI
- Conta Firebase configurada

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/NicolasDobbeck/list-.git
cd list-

# 2. Instale as dependências
npm install
# ou
yarn install

# 3. Configure o Firebase
# - Configure Authentication (Email/Google) e Firestore

# 4. Rode o app no modo desenvolvimento
npx expo start


