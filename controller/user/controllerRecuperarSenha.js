require('dotenv').config(); // <- ESSENCIAL!

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const DAOUser = require('../../model/DAO/user/userDAO.js');
const DAOCodigo = require('../../model/DAO/user/codigoRecuperacaoDAO.js');


console.log('Email do .env:', process.env.EMAIL_USER);

exports.enviarCodigo = async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: 'Email é obrigatório.' });

  const usuario = await DAOUser.selectUsuarioByEmail(email);
  if (!usuario || usuario.length === 0) {
    return res.status(404).json({ message: 'Usuário não encontrado com esse e-mail.' });
  }

  const codigo = crypto.randomInt(100000, 999999).toString();
  const expiracao = new Date(Date.now() + 10 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' ');

  const salvar = await DAOCodigo.inserirCodigo(email, codigo, expiracao);
  if (!salvar) return res.status(500).json({ message: 'Erro ao salvar código.' });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: 'Planify <noreply@planify.com>',
    to: email,
    subject: 'Código de Recuperação de Senha',
    text: `Seu código de verificação é: ${codigo}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Código enviado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao enviar e-mail.' });
  }
};

exports.validarCodigo = async (req, res) => {
  const { email, codigo } = req.body;

  const codigoValido = await DAOCodigo.buscarCodigoValido(email, codigo);
  if (!codigoValido) {
    return res.status(401).json({ message: 'Código inválido ou expirado.' });
  }

  const usuario = await DAOUser.selectUsuarioByEmail(email);
  if (!usuario || usuario.length === 0) {
    return res.status(404).json({ message: 'Usuário não encontrado com esse e-mail.' });
  }

  await DAOCodigo.excluirCodigo(email);

  console.log('Usuário encontrado:', usuario[0]);

  res.status(200).json({
    message: 'Código validado com sucesso.',
    id_usuario: usuario.id_usuario
  });
};

/* // carrega as variáveis de ambiente do arquivo .env, como o email e a senha do remetente
require('dotenv').config(); // essencial para proteger dados sensíveis

// importa o módulo nativo 'crypto', usado aqui para gerar um número aleatório seguro (código de verificação)
const crypto = require('crypto');

// importa o 'nodemailer', biblioteca usada para enviar emails via smtp (gmail neste caso)
const nodemailer = require('nodemailer');

// importa o dao responsável por interagir com os dados dos usuários no banco de dados
const daoUser = require('../../model/dao/usuarioDAO.js');

// importa o dao responsável por inserir, buscar e excluir códigos de recuperação no banco
const daoCodigo = require('../../model/dao/codigoRecuperaçãoDAO.js');

// exibe no terminal o email configurado no .env para envio de mensagens
console.log('email do .env:', process.env.EMAIL_USER);

// função exportada: envia um código de recuperação de senha para o e-mail informado
exports.enviarCodigo = async (req, res) => {
  const { email } = req.body;

  // verifica se o campo email foi enviado na requisição
  if (!email) return res.status(400).json({ message: 'email é obrigatório.' });

  // busca o usuário no banco com base no e-mail informado
  const usuario = await daoUser.selectUsuarioByEmail(email);
  if (!usuario || usuario.length === 0) {
    return res.status(404).json({ message: 'usuário não encontrado com esse e-mail.' });
  }

  // gera um código de 6 dígitos aleatórios
  const codigo = crypto.randomInt(100000, 999999).toString();

  // define uma data de expiração para o código (10 minutos após o envio)
  const expiracao = new Date(Date.now() + 10 * 60 * 1000)
    .toISOString()
    .slice(0, 19)
    .replace('t', ' '); // formato compatível com banco

  // insere o código no banco de dados associado ao e-mail
  const salvar = await daoCodigo.inserirCodigo(email, codigo, expiracao);
  if (!salvar) return res.status(500).json({ message: 'erro ao salvar código.' });

  // configura o transporte do nodemailer com os dados do remetente (gmail)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // remetente (do .env)
      pass: process.env.EMAIL_PASS  // senha de app (do .env)
    }
  });

  // define os dados do e-mail a ser enviado
  const mailOptions = {
    from: 'planify <noreply@planify.com>', // remetente fictício
    to: email, // destinatário
    subject: 'código de recuperação de senha',
    text: `seu código de verificação é: ${codigo}` // corpo do e-mail
  };

  // tenta enviar o e-mail com o código
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'código enviado com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'erro ao enviar e-mail.' });
  }
};

// função exportada: valida o código de recuperação informado pelo usuário
exports.validarCodigo = async (req, res) => {
  const { email, codigo } = req.body;

  // verifica se o código e e-mail informados são válidos e ainda não expiraram
  const codigoValido = await daoCodigo.buscarCodigoValido(email, codigo);
  if (!codigoValido) {
    return res.status(401).json({ message: 'código inválido ou expirado.' });
  }

  // busca novamente o usuário para confirmar a existência
  const usuario = await daoUser.selectUsuarioByEmail(email);
  if (!usuario || usuario.length === 0) {
    return res.status(404).json({ message: 'usuário não encontrado com esse e-mail.' });
  }

  // exclui o código após o uso para garantir segurança (uso único)
  await daoCodigo.excluirCodigo(email);

  console.log('usuário encontrado:', usuario[0]);

  // retorna o id do usuário para que o frontend possa prosseguir com a redefinição de senha
  res.status(200).json({
    message: 'código validado com sucesso.',
    id_usuario: usuario[0].id_usuario
  });
};
*/