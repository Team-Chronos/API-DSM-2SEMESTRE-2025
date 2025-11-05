import fs from "fs";
import path from "path";

export const listarCertificados = (req, res) => {
  const dirPath = path.resolve("src/certificados");

  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log("Pasta 'src/certificados' criada automaticamente.");
    }
    const arquivos = fs.readdirSync(dirPath);

    const certificados = arquivos
      .filter((file) => file.endsWith(".pdf"))
      .map((file) => ({
        nome: file,
        url: `/certificados/${file}`,
      }));

    res.status(200).json(certificados);
  } catch (err) {
    console.error("Erro ao listar certificados:", err);
    res.status(500).json({ mensagem: "Erro ao listar certificados." });
  }
};

