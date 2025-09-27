router.get('/confirm/:token', (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = users.find(u => u.email === decoded.email);

    if (!user) return res.status(400).send('Usuário não encontrado.');

    user.verified = true;
    res.send('E-mail confirmado com sucesso! Agora você pode fazer login.');
  } catch (err) {
    res.status(400).send('Token inválido ou expirado.');
  }
});
