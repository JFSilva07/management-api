# Management_API



API REST para gerenciamento de vendedores, clientes, produtos e vendas. Construída em <strong>Node.js + Express + MySQL</strong>. Fornece endpoints para cadastro, atualização, listagem e exclusão, além do controle de vendas.

## Tecnologias utilizadas.
<br>

### Backend
- [Node.js](https://nodejs.org/) – Ambiente de execução JavaScript
- [Express](https://expressjs.com/) – Framework para criação de APIs REST
- [MySQL](https://www.mysql.com/) – Banco de dados relacional

### Validação e Segurança
- [Joi](https://joi.dev/) – Validação de dados
- [CORS](https://www.npmjs.com/package/cors) – Permite requisições entre domínios
- [Dotenv](https://www.npmjs.com/package/dotenv) – Variáveis de ambiente

### Utilitários
- [Axios](https://axios-http.com/) – Cliente HTTP para requisições externas
- [Nodemon](https://nodemon.io/) – Monitoramento e reinício automático da aplicação
- 
<br>

## Estrutura de pastas.

<br>

<pre>

  
&darr; src                        //src - Separa código fonte de outros arquivos de configuração.
    &rarr; config                   //config - Centraliza configurações como conexão com banco de dados e variáveis de ambiente.
    &rarr; middlewares              //middlewares - Contém funções que são executadas no meio do ciclo request/response, como validação, autenticação, logs, etc...
    &rarr; models                   //models - Define a estrutura dos dados, contém as querys SQL.
    &rarr; routes                   //routes - Define endpoints da API e conecta á lógica que deve ser executada.
    &rarr; validations              //validations - Separa regras de validação da lógica de negócio.
    app.js                     //app.js - Inicializa o Express, configura CORS e JSON, e registra as rotas de usuários, clientes, produtos e vendas.
    server.js                  //server.js - Importa o app, define a porta e inicia o servidor Express, exibindo mensagens de status no console.
.env.exemple                   //.env.exemple - Exemplo das variáveis de ambiente local. Caso queira usar um banco em nuvem, basta adicionar o link de acesso. Veja a configuração e execução na próxima seção.
package-lock.json              //package-lock.json - Registra as versões exatas das dependências instaladas, garantindo que todos os ambientes usem os mesmos pacotes e versões do projeto. (Geralmente não necessita ser alterado)
package.json                   //package.json - Define as dependências, scripts, informações do projeto e configurações necessárias para rodar e gerenciar a API Node.js.

  
</pre>

<br>

## Configuração e execução.

<br>

### 1 - Clone o repositório

  - Copie o link do repositório:
  ```
    
    https://github.com/JFSilva07/management-api.git
    
  ```
  - Abra o terminal integrado do seu editor de códigos e digite:
  ```
    
    git clone https://github.com/JFSilva07/management-api.git
    
  ```
  
  ### 2- Instale as dependências
  - Após clonar o repositorio e abrir a pasta em sua IDE, instale as dependências via terminal integrado:
  ```
    
    npm install
    
  ```
  
### 3- Configure as variáveis de ambiente.
- Na raiz do projeto crie um arquivo <code> .env </code> baseado no arquivo <code> .env.exemple </code>.
```
  
#App
  PORT = 3000
  NODE_ENV = development

#DB
  DB_HOST=linkDeAcessoDB
  DB_PORT=3306
  DB_USER=UsuarioDoBanco
  DB_PASS=SenhaDoBanco
  DB_NAME=NomeDoBanco

#Caso queira usar um banco de dados em nuvem, como o PlanetScale, descomente a linha abaixo e comente as linhas acima

  #DATABASE_URL=linkDeAcessoDB
  
```

### 4 - Rode a aplicação
- Iniciar a aplicação :
```
  
  npm run start
  
```
Ou inicar a aplicação em modo de desenvolvimento com nodemon :
```
  
  npm run dev
  
```

## Configuração do banco de dados.
<br>

Este projeto usa o MySQL e para que a API funcione corretamente, você precisará configurar o banco de dados.  Siga os passos abaixo para criar o banco de dados e as tabelas necessárias. 
Aqui mostro esse processo usando o [MySQL Workbenck](https://www.mysql.com/products/workbench/) por ser mais intuitivo e ajudar na visualização do banco, tabelas, dados, etc.. 

<br>

### 1 - Instalar o MySQL Comunity Server

<br>

<ul>
  
   <li>Acesse a página do instalador MySQL comunity server (https://dev.mysql.com/downloads/mysql/)</li>
   <li>Selecione a versão LTS do instalador.</li>
   <li>Selecione seu sistema operacional.</li>
   <li>Faça o dowload do arquivo Windows (x86, 64-bit), MSI Installer.</li>
   <li>Execute o arquivo e siga o passo a passo para a instalação.</li>
   <li>Escolha o tipo de instalação, recomendo a opção "Developer Default". Ela já inclui o Server, o Workbench e outras ferramentas úteis. </li>
   <li>Durante a instalação, você será solicitado a configurar a senha do usuário <code> root </code>. Essa senha é crucial, pois é a principal forma de acesso administrativo ao seu servidor de banco de dados. Anote-a em um lugar seguro.</li>
   <li>Siga as instruções até o fim. O assistente de instalação irá iniciar o serviço do MySQL Server.</li>
   
</ul>

<br>

### 2 - Criar conexão no Workbench
Agora que você tem o MySQL Server e o Workbench instalados, é hora de conectá-los para começar a usar.

<br>

<ul>
  <li>Abra o programa MySQL Workbench.</li>
  <li>Na tela inicial crie uma nova conexão, clique no botão <code>+</code> (ou "MySQL Connections").</li>
  <li>Dê um nome para sua conexão. (Ex. "Localhost")</li>
  <li>Hostname geralmente é <code>localhost</code> ou <code>127.0.0.1</code>. (Recomendo usar <code>localhost</code>)</li>
  <li>Porta padrão do MySQL é <code> 3306 </code>.</li>
  <li>Usuário padrão é <code>root</code>. (Possui acesso de administrador)</li>
  <li>Teste a conexão clicando em "Test connection" e digite a senha do usuário root que você criou na instalação do MySQL Workbench.</li>
  <li>Se tudo estiver OK, apenas confirme as caixas clicando em OK e Ok navamente pra salvar a conexão.</li>
</ul>


<br>

### 3 - Criar banco de dados

<br> 

-  Na tela inicial do Workbench, clique na conexão que você acabou de criar.
- O Workbench abrirá a tela de edição, onde você pode digitar comandos SQL. Crie o banco de dados e suas tabelas adicionando o seguinte código SQL:
  
<br>

```
-- Criação do banco de dados (opcional, caso não exista)
CREATE DATABASE IF NOT EXISTS management_data;
USE management_data;

-- Tabela de clientes
CREATE TABLE `clients` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) DEFAULT NULL,
  `number` VARCHAR(45) DEFAULT NULL,
  `address` JSON NOT NULL,
  `cpf` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabela de usuários
CREATE TABLE `users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `number` VARCHAR(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabela de produtos
CREATE TABLE `products` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `description` TEXT,
  `category` VARCHAR(45) DEFAULT NULL,
  `storage` INT DEFAULT 0,
  `created` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `in_stock` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB;

-- Tabela de vendas
CREATE TABLE `sales` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `client_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  `date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `client_id` (`client_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `fk_sales_clients` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sales_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB;

-- Tabela de itens de venda
CREATE TABLE `sale_items` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `sale_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `unit_price` DECIMAL(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sale_id` (`sale_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `fk_sale_items_sales` FOREIGN KEY (`sale_id`) REFERENCES `sales` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_sale_items_products` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `sale_items_chk_quantity` CHECK ((`quantity` > 0)),
  CONSTRAINT `sale_items_chk_unit_price` CHECK ((`unit_price` >= 0))
) ENGINE=InnoDB;
  
```
- Execute esse código SQL clicando no simbolo de raio no canto superior esquerdo da tela de edição. <br> Se tudo estiver Ok, show, a conexão e o banco de dados estão feitos.
- Agora lá no seu arquivo <code>.env</code>, verifique as variaveis de conexão ao banco, tudo deve estar de acordo com os dados que você colocou no Workbench. ( Usuário root, sua senha do banco de dados, host = localhost, porta 3306, etc...)
- API pronta pra uso...

  <br>
  
## Endpoints
Nos exemplos abaixo o URL será <code>http://localhost:3000</code> . 

<br>

### Produtos:

#### - <code>GET /products</code>                 &rarr; Busca todos os produtos cadastrados no banco de dados.
Requisição:
  <pre>
  http://localhost:3000/products
  </pre>
Resposta:
<pre>
[
	{
		"id": 1,
		"name": "Smartphone",
		"price": "1600.80",
		"description": "Produto recondicionado",
		"category": "informática",
		"storage": 0,
		"created": "2025-08-31T04:04:07.000Z",
		"updated": "2025-08-31T04:35:02.000Z",
		"in_stock": 0
	},
  {
  		"id": 2,
  		"name": "Notebook",
  		"price": "3200.80",
  		"description": "Produto novo",
  		"category": "informática",
  		"storage": 10,
  		"created": "2025-08-31T04:04:07.000Z",
  		"updated": "2025-08-31T04:35:02.000Z",
  		"in_stock": 1
  	}
]
</pre>

<br>

#### - <code>GET /products?available=true</code>  &rarr; Busca apenas produtos em estoque.
Requisição:
<pre>
http://localhost:3000/products?available=true
</pre>
Resposta:
<pre>
[
 {
  		"id": 2,
  		"name": "Notebook",
  		"price": "3200.80",
  		"description": "Produto novo",
  		"category": "informática",
  		"storage": 10,
  		"created": "2025-08-31T04:04:07.000Z",
  		"updated": "2025-08-31T04:35:02.000Z",
  		"in_stock": 1
  	}
]
</pre>

<br>

  
#### - <code>GET /products/id</code>              &rarr; Busca um produto específico pelo ID.
Requisição:
<pre>
http://localhost:3000/products/1
</pre>
Resposta:
<pre>
[
 {
		"id": 1,
		"name": "Smartphone",
		"price": "1600.80",
		"description": "Produto recondicionado",
		"category": "informática",
		"storage": 0,
		"created": "2025-08-31T04:04:07.000Z",
		"updated": "2025-08-31T04:35:02.000Z",
		"in_stock": 0
	}
]
</pre>

<br>

- <code>POST /products</code>                &rarr; Cria um novo produto na banco de dados.
- <code>PUT /products/id</code>              &rarr; Atualiza um ou mais dados de um produto específico pelo ID.
- <code>DELETE /products/id</code>           &rarr; Deleta um produto da base de dados.


<br>
- Por hoje é só, amanhã completo com os outros endpoints, requisições e respostas, e funcionalidades importantes.
  
